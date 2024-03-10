# RG35XX Backup Utility

This Node.js script is designed to facilitate the backup of directories from an Android device using ADB (Android Debug Bridge). It allows users to select directories from the device and back them up to their local system. Additionally, it provides an option to zip the backed-up directories for easier storage and transfer.

## Prerequisites
- Node.js installed on your system.
- ADB (Android Debug Bridge) installed on your system and accessible via the command line. Windows is provided in this repo
- Access to an USB cable and ADB enabled RG35XX

## Installation
1. Clone or download the repository containing this script to your local system.
2. Navigate to the directory where the script is located using the command line.
3. Install the required Node.js packages by running the following command:
   ```
   npm install
   ```

## Usage
1. Connect your Android device to your computer via USB.
2. Ensure USB debugging is enabled on your Android device.
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
This script is provided as-is without any warranty. Use it at your own risk. Ensure you have appropriate permissions before accessing and backing up directories from your Android device.

For more information on ADB and its usage, refer to the [Android Developer documentation](https://developer.android.com/studio/command-line/adb).