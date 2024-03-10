# RG35XX Backup Utility

This Node.js script is designed to facilitate the backup of directories from the RG35XX using ADB (Android Debug Bridge). It allows users to select directories from the device and back them up to their local system. Additionally, it provides an option to zip the backed-up directories for easier storage and transfer.

## Prerequisites
- Node.js installed on your system.
- ADB (Android Debug Bridge) installed on your system and accessible via the command line. Windows is provided in this repo
- Access to an USB cable and ADB enabled RG35XX

## Enable ADB
- Insert the main SD card into a PC
- On the Misc partition (not the larger partition with Roms foldeer) create a text file in the root of the drive. Rename this new file to "enableADB" making sure to remove the .txt file extention. image
![Screenshot](/help/adb.png)
- Reinsert the SD Card into the RG35xx you should now be able to connect to the device over USB if it is turned on (not on the battery charging screen).

## Installation
1. Clone or download the repository containing this script to your local system.
2. Navigate to the directory where the script is located using the command line.
3. Install the required Node.js packages by running the following command:
   ```
   npm install
   ```

## Usage
1. Connect your RG35XX device to your computer via USB.
2. Ensure USB debugging is enabled on your RG35XX device.
3. Open a terminal and navigate to the directory where the script is located.
4. Run the script using the following command:
   ```
   npm start
   ```
5. Follow the on-screen prompts to select the card type (mmc or SDCARD) and the directory to back up.
6. Optionally, choose to zip the backed-up directory when prompted.
7. Once the backup is complete, the backed-up files will be available in the specified backup directory.

## Notes
- This script assumes that ADB is installed and accessible via the system PATH for OS that are not windows.
- Backup files will be stored in the `backup` directory within the directory where the script is located.
- Progress indicators may not be available during the backup process due to limitations in ADB.

## Disclaimer
This script is provided as-is without any warranty. Use it at your own risk. Ensure you have appropriate permissions before accessing and backing up directories from your RG35XX device.

For more information on ADB and its usage, refer to the [Android Developer documentation](https://developer.android.com/studio/command-line/adb).