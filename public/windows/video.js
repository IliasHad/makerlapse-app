const { BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
let videoWindow;

function createVideoWindow() {
  videoWindow = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: { nodeIntegration: true },
    titleBarStyle: "customButtonsOnHover",
    frame: false,
  });
  videoWindow.loadURL(
    isDev
      ? "http://localhost:9000/video"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  videoWindow.webContents.openDevTools();

  videoWindow.on("closed", () => (videoWindow = null));
}

function sendProgressData(progress, outputPath, isDone) {
  videoWindow.webContents.send("progress-update", progress, outputPath, isDone);
}

function hideVideoWindow() {
  videoWindow.close();
}

exports.createVideoWindow = createVideoWindow;
exports.sendProgressData = sendProgressData;
exports.hideVideoWindow = hideVideoWindow;
