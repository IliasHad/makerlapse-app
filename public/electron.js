const {systemPreferences, app, BrowserWindow, ipcMain, screen}= require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const os = require("os")
const {getScreenInfo, startRecording, stopRecording} = require("./main/sreenRecording")
const {capture, createScreenShotsDir } = require("./main/screenShots")
const {speedUpVideo} = require("./main/videoProccessing")

const { menubar } = require('menubar');

let mainWindow;
let  webCamWindow  = null
let folder
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
      : `file://${path.join(__dirname, "../build/index.html?main")}`
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

app.on("ready", ()=> {
/*
setInterval(() => {
  capture((err, res) => {
    if (err) { console.error(err) }
  })
}, captureDelay)*/
const mb = menubar({
  preloadWindow: true,
  index: isDev
  ? "http://localhost:3000?main"
  : `file://${path.join(__dirname, "../build/index.html?main")}`,
  browserWindow:{ 
    width:265, height: 300, 
    webPreferences: { nodeIntegration: true },
    maximizable: false,
    icon: path.join(__dirname, 'assets/icons/icon.png'),
    title:"Makerlapse"
  }

});

mb.on("ready", () => {
  console.log("Ready ...")
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
    event.returnValue = data
  })
})






ipcMain.on("start-recording",(event,args) => {
  startRecording(args)
    //do something with args
        event.returnValue = 'Hi, sync reply';
 createWebcamWindow()
})

ipcMain.on("stop-recording",(event, message) => {
  stopRecording()
  webCamWindow.hide()
  event.returnValue = 'Hi, sync reply';
})


function createWebcamWindow () {
  let display =  screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

webCamWindow  = new BrowserWindow({ 
    height: 210,
    width: 200,
    webPreferences: { nodeIntegration: true },
    maximizable: false,
    icon: path.join(__dirname, 'assets/icons/icon.png'),
    title:"Makerlapse",
    alwaysOnTop:true,
    transparent: true,
    frame: false,
    transparent: true,
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