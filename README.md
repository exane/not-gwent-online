#Gwent-Online

#Introduction
Not-Gwent-Online is a standalone multiplayer version of Gwent, a card game from The Witcher 3. 

#Install
##- Requirements
- [node.js](https://nodejs.org/) installed
- [GraphicsMagick](http://www.graphicsmagick.org) installed (for generating sprites)
- Any Webserver like xampp, wamp, lamp etc

##- Build
Make sure to clone the project in your webserver root folder, otherwise you won't be able to access your client later.
The root folder is often called 'www' or 'htdocs', but depends on your installed webserver.
```git
cd ~/myWebserverRoot
git clone https://github.com/exane/not-gwent-online
cd not-gwent-online
npm install
npm run build
```


##- Config
- go to /public and open Config.js
- change hostname to your address. (e.g., "192.168.123.1") <br>Make sure you don't have a trailing slash after your IP or address. (e.g., "192.168.123.1/")
- If you have to change the port then make sure you change the port on your server as well. <br>You find the server port in /server/server.js on line #18 "app.listen(#port)";

##- Start Server
```
cd ~/myProjectDirectory/not-gwent-online
node server/server.js
```

##- Start Client
- Open your browser and go to "192.168.123.1/not-gwent-online/public" or wherever you saved your project.
