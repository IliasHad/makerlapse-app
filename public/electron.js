const { app, BrowserWindow, ipcMain, shell } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");
const { capture } = require("./main/takeScreenshot");
const moment = require("moment");
const { menubar } = require("menubar");
const fs = require("fs");
let mainWindow;
let intereval;
let dir = app.getAppPath();
let tray;
let mb;
let webCamWindow = null;
let frameCount = 0;
const {
  createMusicWindow,
  openMusicDialog,
  hideMusicWindow,
} = require("./windows/music");
const { speedUpVideo } = require("./main/videoProcessing");
const { hideVideoWindow, createVideoWindow } = require("./windows/video");
/*
require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour",
});

*/
let inputPath;
let time = 0;

const now = Date.now();
let folder = moment(now).format("YYYY-MM-DD-HH-mm-ss");

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

app.on("ready", () => {
  /*
  setInterval(() => {
    capture((err, res) => {
      if (err) { console.error(err) }
    })
  }, captureDelay)*/

  mb = menubar({
    preloadWindow: true,
    index: isDev
      ? "http://localhost:9000"
      : url.format({
          pathname: path.join(__dirname, "../build/index.html"),
          protocol: "file:",
          slashes: true,
        }),
    browserWindow: {
      width: 290,
      height: 380,
      webPreferences: { nodeIntegration: true },
      maximizable: false,
      title: "Makerlapse",
    },
  });

  mb.on("ready", () => {
    console.log("Ready ...");
    mb.window.openDevTools()

    tray = mb.tray;
  });
});

ipcMain.on(
  "start-screenshoting",
  (event, { selectedScreen, selectedWindow, selectOption }) => {
    event.returnValue = "Start ScreenShoting";

    console.log(selectedWindow);
    if (selectOption === "screen-only") {
      intereval = setInterval(() => {
        frameCount += 1;
        showEstimatedTime(frameCount);
        capture(folder, selectedScreen, selectedWindow);
      }, 1000);
    } else {
      createWebcamWindow();

      intereval = setInterval(() => {
        frameCount += 1;
        showEstimatedTime(frameCount);

        capture(folder, selectedScreen, selectedWindow);
      }, 1000);
    }
  }
);

ipcMain.on("stop-screenshoting", (event) => {
  event.returnValue = "Stop ScreenShoting";

  if (webCamWindow !== null) {
    webCamWindow.close();
  }
  clearInterval(intereval);
  inputPath = path.join(dir, folder);

  fs.readdir(inputPath, (error, files) => {
    frameCount = files.length; // return the number of files
    console.log(frameCount);
    time = (frameCount / 30) * 1000;
    createMusicWindow(inputPath, time);
  });
});

function createWebcamWindow() {
  const { screen } = require("electron");
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  webCamWindow = new BrowserWindow({
    height: 200,
    width: 200,
    webPreferences: { nodeIntegration: true },
    maximizable: false,
    icon: path.join(__dirname, "assets/icons/icon.png"),
    title: "Makerlapse",
    alwaysOnTop: true,
    transparent: true,
    frame: false,
    x: width - 200,
    y: height - 210,
  });
  webCamWindow.loadURL(`file://${path.join(__dirname, "webcam.html")}`);
  app.dock.hide();
  webCamWindow.setAlwaysOnTop(true, "floating");
  webCamWindow.setVisibleOnAllWorkspaces(true);
  webCamWindow.fullScreenable = false;
  console.log(webCamWindow.isAlwaysOnTop());

  webCamWindow.on("closed", () => (webCamWindow = null));
}

function showEstimatedTime(frameCount) {
  let time = frameCount / 30;
  console.log(frameCount, time);
  let estimatedTime = moment()
    .seconds(time)
    .format("mm:ss");
  tray.setTitle(estimatedTime);
}

ipcMain.on("upload-soudtrack", (event) => {
  openMusicDialog();
});

ipcMain.on("skip-music", (e) => {
  hideMusicWindow();
});

ipcMain.on("play-video", (e, path) => {
  shell.openItem(path);
});

ipcMain.on("hide-music", (e) => {
  hideMusicWindow();
  createVideoWindow();
  speedUpVideo(inputPath, time);
});

ipcMain.on("hide-video", (e) => {
  hideVideoWindow();
});
