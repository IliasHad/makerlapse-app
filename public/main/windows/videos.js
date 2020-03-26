
const {BrowserWindow, ipcMain} = require("electron")
const isDev = require("electron-is-dev");
const path = require("path")
let videoWindow

const tmp = require('tmp');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const util = require('electron-util');
const execa = require('execa');
var spawn = require('child_process').spawn
const prettyMs = require("pretty-ms")
const moment = require('moment')
const timeRegex = /time=\s*(\d\d:\d\d:\d\d.\d\d)/gm;
const speedRegex = /speed=\s*(-?\d+(,\d+)*(\.\d+(e\d+)?)?)/gm;
const ffmpegPath = util.fixPathForAsarUnpack(ffmpeg.path);
let progress, estimator




      const speedUpVideo = async (inputPath, speed, durationMs) => {
        const now = Date.now()
        const outputPath = `/Users/mac/ilias/${moment(now).format('YYYY-MM-DD-HH-mm-ss')}.mp4`;
      
      
      
      
      console.log("Output",outputPath)
        console.log("Hi mothers Fuckers")
       let converter = await spawn(ffmpegPath, [
          '-i', inputPath,
          '-c:v', 'libx264',
          '-an',
          '-preset', 'veryfast',
          '-profile:v', 'high',
          '-vf' ,`setpts=(1/${speed})*PTS`,
          '-crf','18',
      '-coder', '1',
      '-pix_fmt','yuv420p',
      '-movflags', '+faststart',
      '-g', '30',
      '-bf', '2',
      '-c:a','aac',
      '-b:a','384k',
      '-profile:a','aac_low',
      
          outputPath
        ]);
      
      
        let speedProcessing
        let stderr = '';
      
        converter.stderr.setEncoding('utf8');
      
        converter.stderr.on('data', function (data) {
          stderr += data;
      
          
          data = data.trim();
      
            const processingSpeed = speedRegex.exec(data);
      
      
            // Duration of output video in milliseconds
      
            if (processingSpeed) {
              speedProcessing= parseFloat(processingSpeed[1]);
              console.log("Speed :", speedProcessing)
            }
      
      
          // Processed time
            const timeProccessed = timeRegex.exec(data);
      
      
            if (timeProccessed) {
              const processedMs = moment.duration(timeProccessed[1]).asMilliseconds();
              console.log("Process MS:", processedMs, timeProccessed[1])
              progress = processedMs / durationMs;
              console.log("Process",progress)
              let progressPercentage =Math.floor(progress * 100)
              // Wait 2 second in the conversion for the speed to be stable
              if (processedMs > 2 * 1000) {
                const msRemaining = (durationMs - processedMs) /  speedProcessing;
                estimator = prettyMs(Math.max(msRemaining, 1000), {compact: true})
                console.log("MS Remaining", msRemaining)
                console.log("After 2 Secondes Progress :", progress, "Estimator :", "Progress Percentage", progressPercentage);
                videoWindow.webContents.send('video-progress', progressPercentage, `- ${estimator} remaining`, outputPath);

                // fix issue when the progress percentage is above 100%
              if(progressPercentage > 100) {
                progressPercentage = 99
              }
      
              } else {
                console.log("Progress :", progress , "Progress Percentage", progressPercentage)
                videoWindow.webContents.send('video-progress', progressPercentage, "", outputPath);

              }
      
             
            }
            converter.on('error', (err) => console.log("Error On Command", err));
      
            converter.on('exit', code => {
              if (code === 0) {
               
                console.log("Process Done :)")
                progressPercentage = 100
                videoWindow.webContents.send('video-progress', progressPercentage, '- Done', outputPath);


              } else {
                console.log("Process Failed :(")
      
              }
            });
        })


    }

   

const createVideoWindow = (screenVideoPath, screenVideoDuration , selectedMusic,outputDuration) =>  {
    videoWindow = null 

    console.log("Output Duration", outputDuration)
   let seconds =    moment.duration(`00:${outputDuration}`).asSeconds()
   let milliseconds =     moment.duration(`00:${outputDuration}`).asMilliseconds()

   console.log("Secondes", seconds, screenVideoDuration)
    let speed =  100

    if(seconds) {
      speed = (screenVideoDuration / seconds)
  
    }
    else {
      speed= 100
    }
    console.log("Speeeding", speed)
    speedUpVideo(screenVideoPath, speed, milliseconds)
    console.log("Screen Video Path", screenVideoPath)
    videoWindow  = new BrowserWindow({ 
        height: 488,
        width: 340,
      webPreferences: { nodeIntegration: true,  webSecurity: false
     },
      icon: path.join(__dirname, 'assets/icons/icon.png'),
      title:"Makerlapse",
    
    
    });
    
    videoWindow.webContents.openDevTools()
    videoWindow.loadURL(
      isDev
      ? "http://localhost:3000/video"
      : `file://${path.join(__dirname, "../build/index.html")}`
    );
    
    videoWindow.on("closed", () => (webCamWindow= null));
    
    
    
    }


   



      exports.createVideoWindow = createVideoWindow
      exports.videoWindow = videoWindow
