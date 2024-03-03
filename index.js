const { exec } = require("child_process");
const path = require("path");
const figlet = require("figlet");
const fs = require("fs");
const archiver = require("archiver");

// Determine the operating system and set adbPath accordingly
let adbPath;
const backupPath = process.cwd() + "/backup";

// Check if the backup directory exists, if not, create it
if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath);
}

if (process.platform === "win32") {
  console.log("Windows Detected");
  adbPath = process.cwd() + "/adb/adb";
} else {
  console.log("Linux or Mac detected");
  adbPath = "adb"; // Assume adb is in the system PATH
}

// Attempt to start the ADB server
exec(`${adbPath} start-server`, (error, stdout, stderr) => {
  if (error) {
    console.error("Error starting ADB server:", error.message);
    return;
  }
  console.log("ADB server started.");
  // Start the backup process
  run();
});

// Function to display ASCII art
function displayAsciiArt() {
  return new Promise((resolve, reject) => {
    figlet("RG35XX Backup", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(data);
      resolve();
    });
  });
}

function listDirectories(cardType) {
    return new Promise((resolve, reject) => {
        let command;
        if (cardType === 'SDCARD') {
            command = `${adbPath} -d shell "ls -d /mnt/sdcard/*"`;
        } else if (cardType === 'mmc') {
            command = `${adbPath} -d shell "ls -d /mnt/mmc/*"`;
        } else {
            reject(new Error('Invalid card type.'));
            return;
        }

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(new Error(stderr));
                return;
            }
            const directories = stdout.split('\n').filter(Boolean).map(dir => dir.trim());
            resolve(directories);
        });
    });
}

function adbPull(sourceDir) {
  return new Promise((resolve, reject) => {
    // Log the source directory (in cyan)
    console.log("\x1b[36m", `Backing up directory: ${sourceDir}`, "\x1b[0m");
    // Log the warning message (in yellow)
    console.log(
      "\x1b[33m",
      "This could take a while and will NOT provide progress, please wait until Completion message",
      "\x1b[0m"
    );

    // Construct the adb pull command
    const backupDir = backupPath; // Destination backup directory
    const command = `"${adbPath}" -d pull -a "${sourceDir}" "${backupDir}"`;

    // Execute the adb pull command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(new Error(stderr));
        return;
      }
      resolve(stdout);
    });
  });
}

function createZip(directory) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(`${directory}.zip`);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(
        "\x1b[32m",
        `Backup directory "${directory}" has been zipped successfully.`,
        "\x1b[0m"
      );
      resolve();
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.on("progress", ({ entries }) => {
      const percentage = (entries.processed / entries.total) * 100;
      console.clear();
      console.log(
        "\x1b[32m",
        `Zipping "${directory}" Please wait...`,
        "\x1b[0m"
      );
      console.log(
        "Processed:",
        entries.processed,
        "Total Files:",
        entries.total,
        "Percentage Complete: ",
        percentage.toFixed(2),
        "%"
      );
    });

    archive.directory(directory, false);
    archive.pipe(output);
    archive.finalize();
  });
}

async function run() {
  try {
    // Display ASCII art
    console.clear();
    await displayAsciiArt();

    // Ask the user to select a card type
    console.log("\x1b[36m", "Select the card type:");
    console.log("\x1b[32m");
    console.log("1. mmc");
    console.log("2. SDCARD");

    // Prompt user to select the card type
    const cardChoice = await prompt(
      "Enter the number corresponding to the card type: "
    );

    let cardType;
    if (cardChoice === "1") {
      cardType = "mmc";
    } else if (cardChoice === "2") {
      cardType = "SDCARD";
    } else {
      throw new Error("Invalid choice. Please enter 1 or 2.");
    }

    // Get list of directories from the device
    const directories = await listDirectories(cardType);

    // Display directories and prompt user to select one
    console.log("\x1b[36m", "Available directories on the device:");
    console.log("\x1b[32m");

    directories.forEach((dir, index) => {
      console.log(`${index + 1}. ${dir}`);
    });
    const selectedDirectoryIndex =
      parseInt(await prompt("Enter the index of the source directory: "), 10) -
      1;

    if (
      isNaN(selectedDirectoryIndex) ||
      selectedDirectoryIndex < 0 ||
      selectedDirectoryIndex >= directories.length
    ) {
      throw new Error("Invalid directory index.");
    }

    const sourceDir = directories[selectedDirectoryIndex];

    // Execute adb pull with the source directory
    await adbPull(sourceDir);
    console.log(
      "\x1b[32m",
      "Backup Complete, Please see your backup directory",
      "\x1b[0m"
    );

    // Ask if zipping is required
    const zipRequired = await prompt(
      "Do you want to zip the backup directory? (Y/N): "
    );
    if (zipRequired.toUpperCase() === "Y") {
      // Get the directory name from the source directory path
      const sourceDirectoryName = sourceDir.split("/").pop();
      // Create zip file for the directory that was pulled
      const backupDir = process.cwd() + "/backup/" + sourceDirectoryName;
      await createZip(backupDir);
    } else {
      console.log("\x1b[33m", "Zipping skipped as per user choice.", "\x1b[0m");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function prompt(question) {
  console.log("\x1b[0m");
  return new Promise((resolve) => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(question, (answer) => {
      readline.close();
      resolve(answer.trim());
    });
  });
}
