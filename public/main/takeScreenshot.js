const { app } = require("electron");
const fs = require("fs");
const path = require("path");
const screenshot = require("screenshot-desktop");
const moment = require("moment");

var { exec } = require("child_process");

const dir = app.getAppPath();

const createScreenShotsDir = (folder) => {
  fs.mkdir(path.join(dir, folder), { recursive: false }, (err) => {
    if (err) throw err;
  });
};

function capture(folder, selectedScreen, selectedWindow) {
  const now = Date.now();
  const ts = moment(now).format("YYYY-MM-DD-HH-mm-ss");
  const filename = `${ts}.png`;

  fs.exists(path.join(dir, folder), (excists) => {
    let command;
    let output = path.join(dir, folder, filename);

    if (process.platform === "darwin") {
      if (selectedWindow)
        command = `/usr/sbin/screencapture  -l ${selectedWindow}   -x ${output}`;
      else command = `/usr/sbin/screencapture    -x ${output}`;
    }
    if (excists && process.platform === "darwin") {
      exec(command, (error, stdout, stderr) => {
        if (!error) {
          console.log("Selection captured!");
        }
      });
    } else if (excists && process.platform === "win32") {
      if (selectedWindow) {
        screenshot({ windowId: selectedWindow, filename: output });
      } else {
        screenshot({ filename: output });
      }
    } else {
      createScreenShotsDir(folder);
    }
  });
}

exports.capture = capture;
