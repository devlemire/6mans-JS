# How to setup

- Install node for Windows: https://nodejs.org/en/download/current/
- Download the latest zip code from the 'releases' tab on this GitHub repository: https://github.com/devlemire/6mans-JS/releases
- Unzip the code to a directory
- Create a discord application at: https://discordapp.com/developers/applications
- Create a new bot for your new discord application
- Copy the `Client ID` of your new app and go to: https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8

  - Replace CLIENTID with the Client ID you copied

- Select your server you want the 6mans bot to run on
- Go back to your discord application and then the bot tab, and this time copy the bot token
- Open a cmd prompt and change directory to the directory where you put the code
- Run `npm i` to install the project dependencies
- Run `echo token=TOKEN > .env`
  - Replace TOKEN with the token you copied
- Run `node index.js`
- In a Discord server where you have added the bot, type `!6m-help` to verify the bot is working and to see a list of helpful commands.

# After initial setup - How to run

- Open cmd
- Change directories to where you put the bot
- Run `node index.js`
