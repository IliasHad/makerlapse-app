

import {screenVideoDuration, screenVideoPath, numberOfScreenShots} from "./ScreenRecording";
import {currentExportValue} from "./ProcessingForm";
const { createWorker } = require('@ffmpeg/ffmpeg');
const dialog = window.require('electron').remote.dialog
const worker = createWorker();
const fs = require("fs")
let outputVideoPath
let recordingType = "mp4"
let ScreenShotPath




const videoProcessing = async  (defaultParms, path, input) => {
  logProgress(0.5)
   
  const workerLoad = await worker.load();
  await console.log(workerLoad)
  
}
const speedUpVideo = (defaultParms, path) => {

  /*
Youtube video Setiings
ffmpeg -i in.mp4 -vf yadif,format=yuv420p -force_key_frames expr:gte(t\,n_forced/2) -c:v libx264 -crf 18 -bf 2 -c:a aac -q:a 1 -ac 2 -ar 48000 -use_editlist 0 -movflags +faststart out.mp4

Instagram Video Settings
ffmpeg -i output-15-fr30.mp4 -vcodec mpeg4 -vb 8000k -strict experimental -qscale 0 output-mpeg4.mp4


Instagram Video COmpreesing

ffmpeg -i input -maxrate 1638k -bufsize 3276k -psy 0 -aq-mode 2 -movflags +faststart output.mp4


twwiter Video Settings

>ffmpeg -i videoLapseWithAudio.mp4 -vcodec libx264 -pix_fmt yuv420p -strict -2 -acodec aac twitter-test-1.mp4
  */
 


  outputVideoPath = path

console.log(outputVideoPath)
let input
  if(recordingType.includes("photo")) {
    console.log(ScreenShotPath)
    input = ScreenShotPath + "\\Makerlapse-ScreenShot-%1d.png"
  }
  else {
    input = screenVideoPath
  }

  
  videoProcessing(defaultParms, path, input);
  /*
  logProgress(1)
  document.querySelector('.open__timelapse').style.display = "block"
*/

      // Assuming that 'path/file.txt' is a regular file.
      if(recordingType.includes("photo")) {
        console.log(ScreenShotPath)
        input = ScreenShotPath
      }
      else {
        input = screenVideoPath
      }
      console.log("Finished processing");
   
    

    
 
};

// Add Settings For Eveyr Option
const addSettings = (speed) => {
  
  
    let defaultParms = [
      "-preset ultrafast",
      "-threads 1",
     `-vf setpts=(1/${speed})*PTS`,
      "-crf 18",// New To Get Better Quality
      "-vsync 0", // New To Get Better Quality
      "-movflags frag_keyframe+empty_moov",
      "-movflags +faststart"
    ]
  
    if(recordingType.includes("photo")) {
    
      defaultParms.push("-r 18", `-vf fps=${speed}`, )
    }
    else {
     defaultParms.push( "-vcodec h264")
    }
  
  
  
  
    if(currentExportValue.includes('instagram')) {
  
      console.log('IG Video')
    }
    else if(currentExportValue.includes('youtube')) {
      defaultParms.push(
        "-profile:v high",
        "-bf 2",
        "-g 30",
        "-coder 1",
        "-pix_fmt yuv420p"
      )
      console.log('Youtube Video')
    }
    else if(currentExportValue.includes('twitter')) {
      console.log('Twitter Video')
      defaultParms.push(
        "-pix_fmt yuv420p",
        "-strict -2"
      )
  
      
    }
    else {
     
  
      console.log('MP4 Video')
    }
    const savePath = () => {
      dialog.showSaveDialog({defaultPath: "Screen-recorder.mp4", filters: [{
      "name": "Video",
      "extensions": ["mp4"]
  }],},(path) => {
     
    console.log(path)
    if(path !== undefined) {
  
      speedUpVideo(defaultParms, path)
  
    }
   
    });
    }
    savePath()
  
  }
  
 export const calcFrames = (min, sec) => {
    let fps 
    let totalDuration = parseInt(sec) + ( parseInt(min) * 60)
  
    console.log(numberOfScreenShots, totalDuration)
    if(totalDuration > 0) {
      fps = numberOfScreenShots / totalDuration  
  
    } else {
      fps = 30
  
    }
  
    console.log(fps)
   // addSettings(fps)
  }
  // Calculate Speed Of The Output Video Based On Screen Video Duration
 export  const calcSpeed = (min ,sec)  => {
    let speed 
    let totalDuration = min + (sec * 60)
  
    if( min) {
      speed = (screenVideoDuration / totalDuration)
  
    }
    else {
      speed= 100
    }
    console.log(speed)
    addSettings(speed)
    //speedUpVideo(speed)
  
  }
  
  


export const logProgress = (progress, event) => {
    // progress is a floating point number from 0 to 1
    
    document.querySelector('.duration__form').style.display= "none"
    document.querySelector('.progress-wrapper').style.display = "block"
    document.querySelector('.progress-percentage span').innerHTML = (progress * 100).toFixed() + "%"
  document.querySelector('.progress-bar').setAttribute("aria-valuenow", (progress * 100).toFixed())
  document.querySelector('.progress-bar').style.width = (progress * 100).toFixed()+ "%"
  
  }