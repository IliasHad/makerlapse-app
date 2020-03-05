const { desktopCapturer, ipcRenderer, remote, shell} = window.require("electron");
const dialog = window.require('electron').remote.dialog
const streamifier = require("streamifier");
const os = require("os");
const Timer = require("easytimer");
const timer = new Timer();
const fs = require("fs")
const path = require('path')
const uniqid = require('uniqid');


const app = remote.app;
const userAppPath =  app.getPath('userData');
let settingsPath = path.join(userAppPath, "settings.json")


let sourcesItems = [];

remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})

let localStream;
let recordedChunks = [];
let recorder;
let img = document.querySelector(".img__container");
let sourcesList = document.querySelector(".list__items");
let numRecordedChunks = 0;
let screenVideoPath 
let currentExportValue = "mp4"
let screenVideoName
let startTime;
let stopTime;
let screenVideoDuration
let intervalScreenShooting
let imagePerSecond
let recordingType = "video"
let count = 0
let numberOfScreenShots;
// FFmpeg Arguments



// estimated duration of output in milliseconds
const durationEstimate = 4000
document.addEventListener("DOMContentLoaded", () => {
  getSources()

      fs.readFile(settingsPath, (err, data) => {
        if (err) throw err;
       let settings = JSON.parse(data);
       console.log(settings)
       recordingType = settings.typeOfInput
       imagePerSecond = settings.imagePerSecond
     
     

        console.log(recordingType, imagePerSecond);
    });
    
 
    document.querySelector('.open__timelapse').addEventListener("click", () => {
    shell.showItemInFolder(outputVideoPath)


     
  })


  Array.from(document.querySelectorAll(".capturer__list select")).forEach(el => {
    el.addEventListener("change", e => {
     
    });
  });

  document.querySelector('.duration__form').addEventListener("submit", e => {
    e.preventDefault()
    let minutes = e.target[0].value ||0
    let secondes = e.target[1].value ||0 
    console.log(minutes, secondes)
    timer.stop();

   
   
    if(recordingType.includes("photo") ){
      clearInterval(intervalScreenShooting)
     

      calcFrames(minutes, secondes)
    }
    else  {
      if(recorder.state === "active") {
        stopRecording()

      }

      calcSpeed(minutes, secondes)

     

    }
   

  })
 

  document.querySelector(".export__items").addEventListener("change", e => {
      console.log(e.target.value);
    
      currentExportValue = e.target.value 
     
    });
  
});




const download = () => {
  console.log(recordedChunks);
  const homeDir = os.homedir();
  let blob = new Blob(recordedChunks, { type: "video/webm" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  document.body.appendChild(a);
  console.log(`URL: ${url} `);
  console.log(url.split("blob:")[1]);

  console.log(blob);

  a.style = "display: none";
  a.href = url;
  a.download = "electron-screen-recorder.webm";
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    convertBuffer();
  }, 100);
};


// Free Trial (Beta)
const reachFreeLimit = () => {
    console.log("You need to upgate your account")

    timer.stop()
    document.querySelector('.record__btn').checked = false
    document.querySelector('.alert-danger-time').style.display= "block"
    stopRecording()
  
}
onload = () => {
    ipcRenderer.send("source-id-selected", null);
    img.innerHTML = "";
  
};


const ScreenShotPath = `${userAppPath}\\Makerlapse-Recorder-${uniqid()}`


const takeScreenShot =  id => {
 console.log(id)


  let thumb = sourcesItems.filter(el => el.id === id)[0].thumbnail;
  console.log(ScreenShotPath)

  count +=1
  fs.exists(ScreenShotPath, function(exists) {
    if(exists) {
      fs.writeFile(`${ScreenShotPath}\\Makerlapse-ScreenShot-${count}.png` , thumb.toPNG(), {flags: "a"},function(err) {
        if(err) console.log(err)
       else console.log('File Created')
      })
    }
    else {
      fs.mkdir(ScreenShotPath, {recursive: true}, (err) => {
        if(err) console.log(err)
        else  fs.writeFile(`${ScreenShotPath}\\Makerlapse-ScreenShot-${uniqid()}.png` , thumb.toPNG(), {flags: "a"},function(err) {
          if(err) console.log(err)
         else console.log('File Created')
        })
      })
    }
  })
 
    

 
}


const handleChange = checkbox => {
  console.log(checkbox.checked);
  if (checkbox.checked === true) {
    timer.start();

    let id = document.querySelector(".img__container img").id;
    if(recordingType.includes("photo")) {
      intervalScreenShooting = setInterval(function() {
        getSources()
        takeScreenShot(id)
        }, imagePerSecond * 1000);

    }
    else {
      onAccessApproved(id);
    }
  } else {
    timer.stop();
    if(recordingType.includes("photo")) {
      clearInterval(intervalScreenShooting)
     numberOfScreenShots =   count 
      count = 0

    }
    else {
      stopRecording()

    }
  }
};











