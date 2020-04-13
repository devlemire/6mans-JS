# How to setup

### Install node for Windows
https://nodejs.org/en/download/current/

### Download the latest release
https://github.com/devlemire/6mans-JS/releases

### Unzip the code to a directory on your computer

### Create a discord application
https://discordapp.com/developers/applications
 
### Create a discord bot under the application

### Give the bot access to your server
- Copy the `Client ID` of your new app
- Navigate to https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8 in your web browser
  - Replace CLIENTID with the Client ID you copied
  - Select your server you want the 6mans bot to run on
- <b>Never share your client id with any one</b>
  
### Copy the bot token from discord developer web page
Go back to your discord application and then the bot tab and finally copy the bot token
- <b>Never share your bot token with any one</b>

### Install Project Dependencies
- Open a cmd prompt and change directory (the terminal command is `cd`) to the directory where you put the code
- Run `npm i` to install the project dependencies

### Create project variables
- Open a text editor on your computer (ex; Notepad)
- Create a new file in the folder you unzipped earlier called: `.env` (make sure you don't save this as `.txt`)
  - `.env` will work
  - `.env.txt` will not work
- Make the contents of your file look like the following:
  - ```js
    token=YOUR_TOKEN
    categoryName=CATEGORY_NAME
    channelName=CHANNEL_NAME
    debugLogs=true
    ```
    - Replace `YOUR_TOKEN` with the bot token you copied from earlier
    - Replace `CHANNEL_NAME` with the channel name you want the bot to listen on
    - Replace `CATEGORY_NAME` with the category name you want the bot to create voice channels under
 
### Run the server
- Go back to your command prompt, make sure you are in the directory of the folder you unzipped earlier, and run `node index.js`
- In a Discord server where you have added the bot, type `!6m-help` to verify the bot is working and to see a list of helpful commands.
  - Make sure you type the command in the channel that matches your `channelName` env variable

# After initial setup - How to run

- Open cmd
- Change directories to where you put the bot
- Run `node index.js`

# Common Gotchas as of v1.9.2

- You <b>must</b> be online when interacting with the 6mans bot
