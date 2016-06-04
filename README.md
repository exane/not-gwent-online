#Gwent-Online

#Introduction
Not-Gwent-Online is a standalone multiplayer version of Gwent, a card game from The Witcher 3. 

#Install
##- Requirements
- [node.js](https://nodejs.org/) installed
- [GraphicsMagick](http://www.graphicsmagick.org) installed (for generating sprites)

##- Build

```sh
cd ~/myWebserverRoot
git clone https://github.com/exane/not-gwent-online
cd not-gwent-online
npm install
npm run build
```


##- Config
- go to /public and open Config.js
- change hostname to your address. (e.g., "192.168.123.1") <br>Make sure you don't have a trailing slash after your IP or address. (e.g., "192.168.123.1/")

##- Start Server
```sh
cd ~/myProjectDirectory/not-gwent-online
node server/server.js
```

##- Start Client
- Open your browser and go to e.g. "http://192.168.123.1:4000"