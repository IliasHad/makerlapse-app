const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const fs = require("fs")
const path = require("path");
const isDev = require("electron-is-dev");
const screenshot = require('screenshot-desktop')
const moment = require('moment')
const os = require("os")
const aperture = require('aperture');
const delay = require('delay');
const { createWorker } = require('@ffmpeg/ffmpeg');
const worker = createWorker({
  corePath: "./node_modules/@ffmpeg/core/ffmpeg-core.js",
  logger: m => console.log(m)
});

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
  mainWindow.webContents.send("on-ready", os.platform())
console.log(os.platform())
main().catch(err => {
  console.log(err)
  
});
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
  const recorder = aperture();
  console.log('Screens:', await aperture.screens());
  const audioDevice = await aperture.audioDevices()
  console.log('Audio devices:', audioDevice[0].id);
  
  console.log('Preparing to record for 5 seconds');
  try {
    await recorder.startRecording(options);
    console.log('Recording started');
    await delay(300000);
    const fp = await recorder.stopRecording({fps: 60, audioDeviceId:  audioDevice[0].id });
    console.log('Video saved in the current directory', fp);
    await worker.load();
  console.log('Start transcoding');
  await worker.write('input.mp4', fp);
  await worker.run(`-i /data/input.mp4
  -preset ultrafast
  -threads 1
 -vf setpts=(1/50)*PTS
  -crf 18
  -vsync 0
  -movflags frag_keyframe+empty_moov
  -movflags +faststart
  
  flame.mp4`, { input: 'flame.avi', output: 'flame.mp4' });
  const { data } = await worker.read('flame.mp4');
  console.log('Complete transcoding');
  fs.writeFileSync('flame.mp4', Buffer.from(data));
  process.exit(0);
  }
  catch(err) {

    console.log(err)
    main()
  }

}
