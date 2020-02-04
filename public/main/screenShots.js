const {app}= require("electron");
const fs = require("fs")
const path = require("path");
const screenshot = require('screenshot-desktop')
const moment = require('moment')



const dir = app.getAppPath()


let folder


const createScreenShotsDir =  () => {
    const now = Date.now()
    folder = moment(now).format('YYYY-MM-DD-HH-mm-ss')
  // Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.
  fs.mkdir(path.join(dir, folder), { recursive: false }, (err) => {
   if(err) throw err
  });
  
  }
  
function capture () {
    const now = Date.now()
    const ts = moment(now).format('YYYY-MM-DD-HH-mm-ss')
    const filename = `${ts}.png`
  console.log(path.join(dir, filename))
  screenshot({ filename: path.join(dir, folder,filename) }).then((imgPath) => {
    // imgPath: absolute path to screenshot
    console.log(imgPath)
    // created in current working directory named shot.png
  })
  .catch(err => {
    createScreenShotsDir()
  
  })
  }

  exports.capture = capture
  exports.createScreenShotsDir = createScreenShotsDir