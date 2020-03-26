
const {BrowserWindow, ipcMain} = require("electron")
const isDev = require("electron-is-dev");
const path = require("path")
const {createVideoWindow} = require("./videos")
const {createMusicWindow, hideMusicWindow} = require("./music")
let editorWindow
let latestScreenVideo

const createEditorWindow = (screenVideoPath) =>  {
    latestScreenVideo = screenVideoPath
    editorWindow = null 
    editorWindow  = new BrowserWindow({ 
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
      ? "http://localhost:3000/editor"
      : `file://${path.join(__dirname, "../build/index.html")}`
    );
    
    editorWindow.on("closed", () => (webCamWindow= null));
    
    
    
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