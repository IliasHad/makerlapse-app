const { desktopCapturer, ipcRenderer, remote, shell} = require("electron");
const dialog = require('electron').remote.dialog
const streamifier = require("streamifier");
const os = require("os");
const Timer = require("easytimer");
const timer = new Timer();
const fs = require("fs")
const path = require('path')
const uniqid = require('uniqid');
const ffmpegOnProgress = require('ffmpeg-on-progress')

const ffmpegPath = require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
var ffprobePath = require("ffprobe-static").path.replace('app.asar', 'app.asar.unpacked');
ffmpeg.setFfprobePath(ffprobePath)
console.log(ffmpegPath);
console.log(ffprobePath)
const app = remote.app;
const userAppPath =  app.getPath('userData');
let settingsPath = path.join(userAppPath, "settings.json")

/*var ffmpeg = Promise.promisify(require("fluent-ffmpeg"));
var ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
var ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);*/
let sourcesItems = [];

remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})
timer.addEventListener("secondsUpdated", function(e) {
  document.querySelector('.progress-wrapper').style.display = "none"
  document.querySelector('.btn-primary.open__timelapse').style.display = "none"


  document.querySelector(
    ".contdown__timer"
  ).innerHTML = timer.getTimeValues().toString();
});
timer.addEventListener('stop', function(e) {
  document.querySelector(
    ".contdown__timer"
  ).innerHTML = ""
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

const logProgress = (progress, event) => {
  // progress is a floating point number from 0 to 1
  console.log('progress', (progress * 100).toFixed())
  document.querySelector('.duration__form').style.display= "none"
  document.querySelector('.progress-wrapper').style.display = "block"
  document.querySelector('.progress-percentage span').innerHTML = (progress * 100).toFixed() + "%"
document.querySelector('.progress-bar').setAttribute("aria-valuenow", (progress * 100).toFixed())
document.querySelector('.progress-bar').style.width = (progress * 100).toFixed()+ "%"

}

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
      console.log(e.target.value);
      img.innerHTML = "";

      getThumbanil(e.target.value);
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
// CLean Record Stream
const cleanRecord = () => {
  recordedChunks = [];
  numRecordedChunks = 0;
};

const calcFrames = (min, sec) => {
  let fps 
  let totalDuration = parseInt(sec) + ( parseInt(min) * 60)

  console.log(numberOfScreenShots, totalDuration)
  if(totalDuration > 0) {
    fps = numberOfScreenShots / totalDuration  

  } else {
    fps = 30

  }

  console.log(fps)
  addSettings(fps)
}
// Calculate Speed Of The Output Video Based On Screen Video Duration
const calcSpeed = (min ,sec)  => {
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


const recorderOnDataAvailable = event => {
  console.log(event.data)
  let elaspedTime  = (Date.now() - startTime ) / 60000

  if (event.data && event.data.size > 0) {
    console.log("#6: added chunk");
    recordedChunks.push(event.data);
    numRecordedChunks += event.data.byteLength;
    let blob = new Blob(recordedChunks, { type: "video/webm" });


 
    saveData(blob)
  
};
}
const stopRecording = () => {

  stopTime = Date.now()

  recorder.stop();
  document.querySelector('.duration__form').style.display= "block"
  console.log("#5: Stopping record and starting download");
  localStream.getVideoTracks()[0].stop();
  // Set the artist for song.mp3
  console.info(JSON.stringify( localStream.getVideoTracks()[0].getSettings()))
 
};

const downloadTimelapse = () => {
  setTimeout(function() {
    convertBuffer();
  }, 100);
};

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
const saveData = (blob) => {
  screenVideoPath =`${os.tmpdir()}\\${screenVideoName}`
 console.log(screenVideoPath)
   var inStream;
   var reader = new FileReader();
   reader.onload =  function() {
     var buffer = Buffer.from(reader.result);
     console.log(buffer);
 
     // open input stream
     if (buffer.length > 0) {
     let  writeStream =   fs.createWriteStream(screenVideoPath,{flags: 'a'})
    // write some data with a base64 encoding
 writeStream.write(Buffer.from(buffer));
 
 // the finish event is emitted when all data has been flushed from the stream
  writeStream.on('finish', () => {
     console.log('wrote all data to file');
     cleanRecord()
 });
 
 // close the stream
  writeStream.end();
     //  await fs.appendFileSync(tmp, buffer)
 
     
     }
   };
   reader.readAsArrayBuffer(blob);
 }

 
const convertBuffer = () => {
  logProgress(0)

  let blob = new Blob(recordedChunks, { type: "video/webm" });
  console.log(blob);

  var inStream;

  var reader = new FileReader();
  reader.onload = async function() {
    var buffer = Buffer.from(reader.result);
    console.log(buffer);
    speedUpVideo();
    // open input stream
    if (buffer.length > 0) {
      inStream = await streamifier.createReadStream(buffer);
     
    }
  };
  reader.readAsArrayBuffer(blob);
};
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
  var command = ffmpeg(input)
    .outputOptions(defaultParms)

    .toFormat("mp4")
    
    .output(path)
   
    .on("start", function(commandLine) {
      console.log(commandLine);
      document.querySelector('.alert-danger-time').style.display= "none"

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
    .on('progress', ffmpegOnProgress(logProgress, durationEstimate))

    .on("end", function() {
    
      // Assuming that 'path/file.txt' is a regular file.
      if(recordingType.includes("photo")) {
        console.log(ScreenShotPath)
        input = ScreenShotPath
      }
      else {
        input = screenVideoPath
      }
      console.log("Finished processing");
      logProgress(1)
      document.querySelector('.open__timelapse').style.display = "block"

    
    })

    .run()
 
};

const getMediaStream = stream => {

  localStream = stream;
 
  stream.onended = () => {
    console.log("Media stream ended.");
  };

  try {

    console.log("#3: Start recording the stream.");
    recorder = new MediaRecorder(stream);
    
  
  } catch (e) {
    console.assert(false, "Exception while creating MediaRecorder: " + e);
    return;
  }
  recorder.ondataavailable = recorderOnDataAvailable;
  
  recorder.onstop = () => {
    stopTime = Date.now()
    screenVideoDuration = Math.round((stopTime - startTime) / 60000)

    console.log(screenVideoDuration)
    console.log("#7: recorderOnStop fired");
  };
  recorder.start(1000);
  
  startTime = Date.now();
  console.log("#4: Recorder is started.");
  console.log(stream)
  console.log(startTime)
  screenVideoName = `Makerlapse-Recorder-${uniqid()}.webm`
};

const getUserMediaError = error => {
  console.log("failed: ", error);
};

const onAccessApproved = id => {
  if (!id) {
    console.log("Access rejected.");
    return;
  }
  console.log("#2: ", id);
  navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: id,
        maxWidth:  3840,
        maxHeight: 2160
      }
      
      }
    })
    .then(getMediaStream)
    .catch(getUserMediaError);
};
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

let options = {
  
    types: [ "screen","window"],
    thumbnailSize: {
      width: 1280 ,
      height:720
    }
    
  
}
const getSources = () => {
  desktopCapturer.getSources(options, (error, sources) => {
    if (error) console.log(error);
    let screenList = document.querySelector(".screen__items");
    let windowsList = document.querySelector(".window__items");

    sourcesItems = sources;
    console.log(sources);
    let defaultId = sources.filter(el => el.id.includes('screen'))[0].id
    console.log(defaultId)
    getThumbanil(defaultId)
    for (let source of sources) {
     
      let thumb = source.thumbnail.toDataURL();
      if (!thumb) continue;

      let title = source.name.slice(0, 20);
      let item = `<option value=${source.id}><a href="#">${title}</a></option>`;
      if (source.id.includes("screen")) {
        screenList.insertAdjacentHTML("afterbegin", item);
      } else {
        windowsList.insertAdjacentHTML("afterbegin", item);
      }
    }
  });
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
const getThumbanil = id => {
  img.innerHTML = ""
  console.log(sourcesItems);

  let thumb = sourcesItems.filter(el => el.id === id)[0].thumbnail;
  let item = `<img id=${id} src=${thumb.toDataURL()}> `;
  img.insertAdjacentHTML("afterbegin", item);
};

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











function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];
 
  console.info("Track settings:");
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info("Track constraints:");
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}