import fs from 'fs';
import electron from 'electron';
const remote = electron.remote || false;

const path = window.require("path")
const uniqid = window.require('uniqid');
const app = remote.app;
const screenSize = remote.screen.getPrimaryDisplay().size
const directory =  app.getAppPath()
const screenshot = require('screenshot-desktop')

let folderPath = ""
export function determineScreenShotSize () {
  folderPath = `Makerlapse-Recorder-${uniqid()}`

     return {
   
        width: screenSize.width,
        height: screenSize.height
    }
    
  }



  export function startScreenShotinng(thumbanil) {
   console.log(path.join(directory ,`Makerlapse-Recorder-${uniqid()}.png`))
   screenshot({format: 'png'}).then((img) => {
    // img: Buffer filled with png goodness
    // ...
    console.log(img)
  }).catch((err) => {
    // ...
    console.log(err)
  })



}