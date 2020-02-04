const {app, BrowserWindow, ipcMain}= require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const os = require("os")
const {getScreenInfo, startRecording, stopRecording} = require("./main/sreenRecording")
const {capture, createScreenShotsDir } = require("./main/screenShots")



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
main()

// Must create folder to be able to save screenshots on this folder
createScreenShotsDir()
setInterval(() =>{
  capture()
},1000)
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
  try {
    console.log('Video saved in the current directory', "file:///Users/mac/ilias/ilias.mp4");
    const load = await worker.load();
  console.log(load);
  const input =   await worker.write('ilias.mp4', path.resolve("/Users/mac/ilias/ilias.mp4"));
  console.log(input)
  const run = await worker.run('-i ilias.mp4 flame.mp4', { input: 'ilias.mp4', output: 'flame.mp4' });
  console.log(run)
  
  /*const { data } = await worker.read('flame.mp4');
  console.log('Complete transcoding');
  fs.writeFileSync('flame.mp4', Buffer.from(data));
  process.exit(0);*/

  }
  catch(err) {

    console.log(err)
   // main()
  }

}
ipcMain.on("get-screen-details",(event, message) => {
  getScreenInfo().then(data => {
    console.log(data)
    event.returnValue = data
  })
})






ipcMain.on("start-recording",(event,args) => {
  startRecording(args)
    //do something with args
    console.log(args)
    event.returnValue = 'Hi, sync reply';
  
})

ipcMain.on("stop-recording",(event, message) => {
  stopRecording()
  event.returnValue = 'Hi, sync reply';

})
