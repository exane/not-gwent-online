#Gwent-Online

#Introduction

Gwent-Online is an open-source project of the card-game Gwent.

#Install
##- Requirements
- [node.js](https://nodejs.org/) installed
- [GraphicsMagick](http://www.graphicsmagick.org) installed (for generating sprites)

##- Build
```git
cd ~/myProjectDirectory
git clone https://github.com/exane/gwent.git
cd gwent
npm install
npm run gulp
```

##- Config
- go to /public and open Config.js
- change hostname to your address. (e.g., "192.168.123.1") <br>Make sure you don't have a trailing slash after your IP or address. (e.g., "192.168.123.1/")
- If you have to change port than make sure you change the port on your server as well. <br>You find the server port in /server/server.js on line #18 "app.listen(#port)";

##- Start Server
```
cd ~/myProjectDirectory/gwent
node server/server.js
```

##- Start Client
- Open your browser and go to "192.168.123.1/gwent/public" or wherever you saved your project.
