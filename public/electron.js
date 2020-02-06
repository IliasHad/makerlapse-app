const {app, BrowserWindow, ipcMain}= require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const os = require("os")
const {getScreenInfo, startRecording, stopRecording} = require("./main/sreenRecording")
const {capture, createScreenShotsDir } = require("./main/screenShots")

const {speedUpVideo} = require("./main/videoProccessing")


let mainWindow;
let folder
require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour"
});
function createWindow() {
  mainWindow = new BrowserWindow({ 
    width:365, height: 780, 
    webPreferences: { nodeIntegration: true },
    maximizable: false,
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
  mainWindow.on("closed", () => (mainWindow = null));

 
}

app.on("ready", ()=> {
/*
setInterval(() => {
  capture((err, res) => {
    if (err) { console.error(err) }
  })
}, captureDelay)*/
createWindow()





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
  
})

ipcMain.on("stop-recording",(event, message) => {
  stopRecording()
  event.returnValue = 'Hi, sync reply';

})
