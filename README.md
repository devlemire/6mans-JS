# How to setup

1. Install node for Windows: https://nodejs.org/en/download/current/
2. Download the latest zip code from the 'releases' tab on this GitHub repository: https://github.com/devlemire/6mans-JS/releases
3. Unzip the code to a directory
4. Create a discord application at: https://discordapp.com/developers/applications
5. Create a new bot for your new discord application
6. Copy the `Client ID` of your new app and go to: https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8
   a. Replace CLIENTID with the Client ID you copied
7. Select your server you want the 6mans bot to run on
8. Go back to your discord application and then the bot tab, and this time copy the bot token
9. Open a cmd prompt and change directory to the directory where you put the code
10. Run `npm i` to install the project dependencies
11. Run `echo token=TOKEN > .env`
    a. Replace TOKEN with the token you copied
12. Run `node index.js`

# After initial setup - How to run

1. Open cmd
2. Change directories to where you put the bot
3. Run `node index.js`
