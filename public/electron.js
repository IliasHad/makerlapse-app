const {systemPreferences, app, BrowserWindow, ipcMain, screen, Tray, dialog, Menu}= require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const os = require("os")
const {getScreenInfo, startRecording, stopRecording} = require("./main/screenRecording/sreenRecording")
const fs = require("fs")
const { menubar } = require('menubar');
const parseMilliseconds = require('parse-ms');
let trayTimerTimeout = null;
const padNumber = (number, character = '0') => `${character}${number}`.slice(-2);
let mainWindow;
let  webCamWindow  = null
let latestScreenVideo
let editorWindow
let tray
let mb
const {checkForUpdates} =require("./main/utils/updater")
const Sentry = require('@sentry/electron');

const url = require("url")

Sentry.init({dsn: 'https://f213ce0060af47219a3efaecea6e2857@sentry.io/5177853'});



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
  
  ? 'http://localhost:3000'
  :   
  url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  })
,
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
  console.log(args)
    //do something with args
        event.returnValue = 'Hi, sync reply';
      if(args.isWebcam === true && os.platform() === "darwin") {

    if(isDev) {
      createWebcamWindow()
      startRecording(args)
      showTimeRecorded()

    } 

    else {
      const isCameraAccess =    systemPreferences.getMediaAccessStatus("camera")

      if(isCameraAccess !== "granted") {
        systemPreferences.askForMediaAccess("camera") 
        .then(isGaranted => {
          if(isGaranted) {
            createWebcamWindow()
            startRecording(args)
            showTimeRecorded()
  
          }
        })
      }
    }
  
       
      }

      else if(args.audioDeviceId !== undefined && os.platform() === "darwin") {
      
      if(isDev){
        startRecording(args)
        showTimeRecorded()
      } else {
        const isMicrophoneAccess =    systemPreferences.getMediaAccessStatus("microphone")
        if(isMicrophoneAccess !== "granted") {
          systemPreferences.askForMediaAccess("microphone") 
          .then(isGaranted => {
            if(isGaranted) {
              startRecording(args)
              showTimeRecorded()
    
            }
          })
        }

      }
      }
     else {
        startRecording(args)
        showTimeRecorded()
      }

})

ipcMain.on("stop-recording",(event, message) => {
  stopRecording()
  if(webCamWindow !== null ) {
    webCamWindow.close()

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
 webCamWindow.fullScreenable = false
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
  const musicPath = path.join(app.getAppPath(),'music', 'music.json')
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
  fs.writeFileSync(musicPath, JSON.stringify(perdifinedMusic), "UTF-8",{'flags': 'a'});

 
}





// Register an event listener. When ipcRenderer sends mouse click co-ordinates, show menu at that position.
ipcMain.on(`display-updater-menu`, function(e, x, y) {
    menu.popup({
      x: x,
      y: y
    });

});




const template = [
  {
    label: "Update And Quit",
    type: "normal",
    click() { checkForUpdates()}
    },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


 