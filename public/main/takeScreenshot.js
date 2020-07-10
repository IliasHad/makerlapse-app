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
    console.log(excists);
    let output = path.join(dir, folder, filename);
    console.log("Kayn", selectedWindow);

    if (process.platform === "darwin") {

      if (selectedWindow)
      command = `/usr/sbin/screencapture  -l ${selectedWindow}   -x ${output}`;
    else command = `/usr/sbin/screencapture    -x ${output}`

    }
    if (excists && process.platform === "darwin") {
      console.log(command);

      exec(command, (error, stdout, stderr) => {
        if (!error) {
          console.log("Selection captured!");
        }
      });



    } 
    else if(excists && process.platform === `win32`) {


      console.log(selectedWindow)
      if (selectedWindow) {

        console.log('Hi')
        screenshot({windowId: selectedWindow, filename: output})
        
      }
      else {
        screenshot({ filename: output})

      }


    }
    else  {
      createScreenShotsDir(folder);
    }
  });
}

exports.capture = capture;

// screencapture -x  /Users/mac/ilias/test-2.png

// screencapture -l$(osascript -e 'tell app "Safari" to id of window 1')-x  /Users/mac/ilias/test-4.png

//screencapture

//Utility to take screenshots and screen recordings.

//- Take a screenshot and save it to a file:
//   screencapture path/to/file.png

//- Take a screenshot including the mouse cursor:
//   screencapture -C path/to/file.png

//- Take a screenshot and open it in Preview, instead of saving:
//  screencapture -P

//- Take a screenshot and copy it to the clipboard, instead of saving:
//   screencapture -c

//- Take a screenshot of a selected rectangular area:
//   screencapture -i path/to/file.png

//- Take a screenshot after a delay:
//   screencapture -T seconds path/to/file.png

//- Make a screen recording and save it to a file:
//   screencapture -v path/to/file.mp4

//  osascript -e 'tell application "System Events" to get the title of every window of every process'

// id of windows

// screencapture -l 70  /Users/mac/ilias/21-05.png
