const {systemPreferences, app, BrowserWindow, ipcMain, screen, Tray, clipboard}= require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const os = require("os")
const {getScreenInfo, startRecording, stopRecording} = require("./main/screenRecording/sreenRecording")
const {capture, createScreenShotsDir } = require("./main/screenRecording/screenShots")
const {downloadMP3} = require("./main/common/getMusic")
const {createMusicWindow} = require("./main/windows/music")
const {createVideoWindow} = require("./main/windows/videos")
const fs = require("fs")
const { menubar } = require('menubar');
const parseMilliseconds = require('parse-ms');
let trayTimerTimeout = null;
const padNumber = (number, character = '0') => `${character}${number}`.slice(-2);
const {menu} = require("./main/common/menus")
let mainWindow;
let  webCamWindow  = null
let latestScreenVideo
let editorWindow
let tray
let mb
require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour"
});








function createWindow() {
  mainWindow = new BrowserWindow({ 
    webPreferences: { nodeIntegration: true },
    icon: path.join(__dirname, 'assets/icons/icon.png'),
    title:"Makerlapse"
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000?main"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.webContents.openDevTools()
console.log(os.platform())

// Must create folder to be able to save screenshots on this folder
/*createScreenShotsDir()
setInterval(() =>{
  capture()
},1000)*/

systemPreferences.askForMediaAccess("camera", "microphone")
.then(data => {

})
.catch(err => {
  console.log(err)
})
  mainWindow.on("closed", () => (mainWindow = null));

 
}
const showTimeRecorded = () => {
  let trayTimer = 0;
  const interval = 1000;

  const tick = () => {
    const {hours, minutes, seconds} = parseMilliseconds(trayTimer);
    if (hours) {
      tray.setTitle(` ${padNumber(hours, ' ')}:${padNumber(minutes)}:${padNumber(seconds)}`);
    } else {
      tray.setTitle(` ${padNumber(minutes)}:${padNumber(seconds)}`);
    }
  }
  trayTimerTimeout = setInterval(() => {
    trayTimer += interval;
    tick();
  }, interval);
  tick()

};
const iconPath = path.join(__dirname, "/icons/makerlapse-icon-20.png")
app.on("ready", ()=> {
/*
setInterval(() => {
  capture((err, res) => {
    if (err) { console.error(err) }
  })
}, captureDelay)*/

mb = menubar({
  preloadWindow: true,
  index: isDev
  ? "http://localhost:3000?main"
  : `file://${path.join(__dirname, "../build/index.html?main")}`,
  browserWindow:{ 
    width:330, height: 536, 
    webPreferences: { nodeIntegration: true },
    maximizable: false,
    title:"Makerlapse",
  },
  icon: iconPath

});

mb.on("ready", () => {
  console.log("Ready ...")
  mb.window.openDevTools()


  tray = mb.tray
  console.log(mb.tray)
  createNecessaryFiles()
})




//createScreenShotsDir()
//capture()

});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});



const options = {
  fps: 30

};


async function main() {
  
  console.log('Preparing to record for 5 seconds');
  
}
ipcMain.on("get-screen-details",(event, message) => {

  getScreenInfo().then(data => {
    console.log("audio",data.audioDevices)

    event.returnValue = data
  })
})







ipcMain.on("start-recording",(event,args) => {
  startRecording(args)
  console.log(args)
    //do something with args
        event.returnValue = 'Hi, sync reply';

      if(args.isWebcam === true) {
        createWebcamWindow()
      }
 if(os.platform() === "darwin") {

 showTimeRecorded()

 }
})

ipcMain.on("stop-recording",(event, message) => {
  stopRecording()
  if(webCamWindow !== null ) {
    webCamWindow.hide()

  }
  event.returnValue = 'Hi, sync reply';
  if(os.platform() === "darwin") {
    clearInterval(trayTimerTimeout)

  }
})


function createWebcamWindow () {
  let display =  screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

webCamWindow  = new BrowserWindow({ 
    height: 200,
    width: 200,
    webPreferences: { nodeIntegration: true },
    maximizable: false,
    icon: path.join(__dirname, 'assets/icons/icon.png'),
    title:"Makerlapse",
    alwaysOnTop:true,
    transparent: true,
    frame: false,
    x: width - 200,
  y: height - 210

  });
  webCamWindow.loadURL(
     `file://${path.join(__dirname, "webcam.html")}`
  );
  app.dock.hide();
 webCamWindow.setAlwaysOnTop(true, "floating");
 webCamWindow.setVisibleOnAllWorkspaces(true);
 webCamWindow.setFullScreenable(false)

  console.log(webCamWindow.isAlwaysOnTop())


// Must create folder to be able to save screenshots on this folder
/*createScreenShotsDir()
setInterval(() =>{
  capture()
},1000)*/
webCamWindow.on("closed", () => (webCamWindow= null));

  
}








// Register an event listener. When ipcRenderer sends mouse click co-ordinates, show menu at that position.
ipcMain.on(`display-app-menu`, function(e, {x, y}) {
    menu.popup({
      window: mb,
      x: x+ 20,
  y:y + 20
    });
    
  
});




function  createNecessaryFiles() {
  const musicPath = path.join(app.getAppPath(), 'music.json')
  const perdifinedMusic = {
    music: [
      {
        filePath: "",
        source: "YouTube",
        artist:"Tropkillaz Boa Noite",
        youtubeId: "kcuVvryU9QA",
        thumbnail:"http://i3.ytimg.com/vi/kcuVvryU9QA/hqdefault.jpg"
      },
      {
        filePath: "",
        source: "YouTube",
        artist:"Cartoon On & On",
        youtubeId: "K4DyBUG242c",
        thumbnail:"http://i3.ytimg.com/vi/K4DyBUG242c/hqdefault.jpg"
      }      
    ]
  }
  fs.exists(musicPath, (excists) => {

    console.log("Path", excists, !excists)
    if(!excists) {
      fs.writeFileSync(musicPath, JSON.stringify(perdifinedMusic))
    }
   
  })
}
