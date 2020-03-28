
const {BrowserWindow, ipcMain} = require("electron")
const isDev = require("electron-is-dev");
const path = require("path")
const {createVideoWindow} = require("./videos")
const {createMusicWindow, hideMusicWindow} = require("./music")
let editorWindow = null 
let latestScreenVideo
const log = require('electron-log');

const url = require("url")
const createEditorWindow = (screenVideoPath) =>  {
    latestScreenVideo = screenVideoPath

    log.info("Create Editor Window Is Called")

    if(editorWindow !== null ) {
     editorWindow.close()
  
    }    editorWindow  = new BrowserWindow({ 
      height: 488,
      width: 691,
      webPreferences: { nodeIntegration: true,  webSecurity: false
     },
      icon: path.join(__dirname, 'assets/icons/icon.png'),
      title:"Makerlapse",
    
    
    });
    
    editorWindow.webContents.openDevTools()
    editorWindow.loadURL(
      isDev
  
      ? 'http://localhost:3000/editor'
      :   
      url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );

    editorWindow.on("closed", () => (webCamWindow= null));
    log.info("Create Editor Window Is Finished")

    
    
    }


    ipcMain.on("get-latest-recording-video",(event, message) => {
  
        console.log("Event Triggered")
        event.returnValue = latestScreenVideo
       
      })

      ipcMain.on("open-video-window",(event, screenVideoPath, videoDuration, selectedMusic, outputDuration) => {
  
        console.log(screenVideoPath, videoDuration, selectedMusic, outputDuration)
        createVideoWindow(screenVideoPath, videoDuration, selectedMusic, outputDuration)

        event.returnValue = "hi"

       
      })

      ipcMain.on("open-soundtrack-window",(event, screenVideoPath) => {
  

        createMusicWindow()
        event.returnValue = "hi"

       
      })

      ipcMain.on("music-added", (event, selectedMusic) => {
        hideMusicWindow()
        editorWindow.webContents.send("get-selected-music", path.basename(selectedMusic))
      } )


      exports.createEditorWindow = createEditorWindow