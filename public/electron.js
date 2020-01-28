const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const fs = require("fs")
const path = require("path");
const isDev = require("electron-is-dev");
const screenshot = require('screenshot-desktop')
const moment = require('moment')


const captureDelay = 1000
const dir = app.getAppPath()

function capture (cb) {
  const now = Date.now()
  const ts = moment(now).format('YYYY-MM-DD-HH-mm-ss')

  const filename = `${ts}.png`
console.log(path.join(dir, filename))
screenshot({ filename: path.join(dir, folder,filename) }).then((imgPath) => {
  // imgPath: absolute path to screenshot
  console.log(imgPath)
  // created in current working directory named shot.png
});
}
let mainWindow;
let folder
require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour"
});



const createScreenShotsDir =  () => {
  const now = Date.now()
  folder = moment(now).format('YYYY-MM-DD-HH-mm-ss')
// Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.
fs.mkdir(path.join(dir, folder), { recursive: false }, (err) => {
 if(err) throw err
});

}
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

 
  mainWindow.on("closed", () => (mainWindow = null));

 
}

app.on("ready", ()=> {
setInterval(() => {
  capture((err, res) => {
    if (err) { console.error(err) }
  })
}, captureDelay)
createWindow()
createScreenShotsDir()
capture()

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
