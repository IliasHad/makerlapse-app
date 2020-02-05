const { remote} = require("electron");
const fs = require("fs")
const path = require('path')

const ffmpegPath = require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
var ffprobePath = require("ffprobe-static").path.replace('app.asar', 'app.asar.unpacked');
ffmpeg.setFfprobePath(ffprobePath)
console.log(ffmpegPath);
console.log(ffprobePath)
const app = remote.app;


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
   
  
  
  

     ffmpeg(input)
      .outputOptions(defaultParms)
  
      .toFormat("mp4")
      
      .output(path)
     
      .on("start", function(commandLine) {
        console.log(commandLine);
       // document.querySelector('.alert-danger-time').style.display= "none"
  
      })
      .on("stderr", function(stderrLine) {
        console.log("Stderr output: " + stderrLine);
      })
      .on("error", function(err, stdout, stderr) {
        console.log("Cannot process video: " + err.message);
        console.log(stdout);
        console.log(stderr);
        if (err) console.log("Rah Kayn Mochkil");
  
      })
      .on('progress')
  
      .on("end", function() {
      
      
        console.log("Finished processing");
       
      
      })
  
      .run()
   
  };
  