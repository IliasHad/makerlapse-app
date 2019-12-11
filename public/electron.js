const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

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
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

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
