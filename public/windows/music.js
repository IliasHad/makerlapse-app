const { dialog, BrowserWindow } = require('electron')

const {createVideoWindow} =require("../windows/video")
const { speedUpVideo } = require("../main/videoProcessing");

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow = null
let time = 0
let inputPath

const openMusicDialog = () => {
   dialog.showOpenDialog({ 
    
    properties: ['openFile'],
  
    filters: [
      { name: 'Music', extensions: ['mp3'] },
    ]})
    .then(result => {
      console.log(result.canceled)
      if(result.filePaths) {
        let filePath = result.filePaths[0]
        hideMusicWindow()
        createVideoWindow()
        speedUpVideo(inputPath, time, filePath)
        

      }
      console.log(result.filePaths)
    }).catch(err => {
      console.log(err)
    })
}



function createMusicWindow(input, duration) {
    inputPath = input
    time = duration 
    mainWindow = new BrowserWindow({
      width: 400,
      height: 400,
      webPreferences: { nodeIntegration: true },
      titleBarStyle: "customButtonsOnHover",
      frame: false,
    });
    mainWindow.loadURL(
      isDev
        ? "http://localhost:9000/music"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
  
    mainWindow.on("closed", () => (mainWindow = null));
  }


  function hideMusicWindow () {
      mainWindow.close()
  }
  
  exports.createMusicWindow = createMusicWindow
  exports.openMusicDialog = openMusicDialog
  exports.hideMusicWindow = hideMusicWindow