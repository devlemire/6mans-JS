# Disclaimer

Discord has the ability to update their API structure even though I'm not updating my package version. That means the bot can break at any time when Discord flips switches on their API. I do not have the time to keep up with their development team. With that being said, this bot <b>may be in a broken state</b>. I will leave this repository up as a reference to other developers. But at this time, support for this project is discontinued for me. Sorry! Life is too busy.

# How to setup

### 1) Install node for Windows
https://nodejs.org/en/download/current/

### 2) Download the latest release
https://github.com/devlemire/6mans-JS/releases

### 3) Unzip the code to a directory on your computer

### 4) Create a discord application & bot
https://discordapp.com/developers/applications
- Create a discord bot under the application
  - On the left side there is a tab called "Bot" when you click into the application you've created

### 5) Give the bot access to your server
- Copy the `Client ID` of your new app
- Navigate to https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8 in your web browser
  - Replace CLIENTID with the Client ID you copied
  - Select your server you want the 6mans bot to run on
- <b>Never share your client id with any one</b>
  
### 6) Copy the bot token from discord developer web page
Go back to your discord application and then the bot tab and finally copy the bot token
- <b>Never share your bot token with any one</b>

### 7) Install Project Dependencies
- Open a cmd prompt and change directory (the terminal command is `cd`) to the directory where you put the code
- Run `npm i` to install the project dependencies

### 8) Create project variables
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
    lobbySeries=LOBBY_SERIES
    lobbyRegion=LOBBY_REGION
    lobbyName=LOBBY_NAME
    ```
    - Replace `YOUR_TOKEN` with the bot token you copied from earlier.
    - Replace `CHANNEL_NAME` with the channel name you want the bot to listen on.
    - Replace `CATEGORY_NAME` with the category name you want the bot to create voice channels under.
    - Replace `LOBBY_SERIES` with the desired series length. Best of 3.. 5... etc. Just give a number.
    - Replace `LOBBY_REGION` with the desired private match region. Example; "US-East".
    - Replace `LOBBY_NAME` with your brand (server-name). This is the name that will appear in the bot's information messages.

### 9) Run the server
- Go back to your command prompt, make sure you are in the directory of the folder you unzipped earlier, and run `node index.js`
- In a Discord server where you have added the bot, type `!6m-help` to verify the bot is working and to see a list of helpful commands.
  - Make sure you type the command in the channel that matches your `channelName` env variable

# After initial setup - How to run

- Open cmd
- Change directories to where you put the bot
- Run `node index.js`

# Common Gotchas

- Creating a category on your discord server is <b>not</b> optional. This is needed so the bot knows where to make the voice channels.
- Set your `CHANNEL_NAME` and `CATEGORY_NAME` to exactly how they are displayed in discord.
<img src="https://github.com/devlemire/6mans-JS/blob/master/screenshots/category.png">
