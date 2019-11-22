import {logProgress} from "./VideoProcessing"
const { remote} = window.require("electron");
const dialog = window.require('electron').remote.dialog
const streamifier = require("streamifier");
const os = window.require("os");
const fs = window.require("fs")
const path = window.require('path')
const uniqid = window.require('uniqid');
const app = remote.app;
const userAppPath =  app.getPath('userData');
let settingsPath = path.join(userAppPath, "settings.json")



let localStream;
let recordedChunks = [];
export let recorder;
let numRecordedChunks = 0;
export let screenVideoPath 
let currentExportValue = "mp4"
let screenVideoName
let startTime;
let stopTime;
export let screenVideoDuration
let intervalScreenShooting
let imagePerSecond
let recordingType = "video"
let count = 0
export let numberOfScreenShots;
// FFmpeg Arguments


// Get What user choose video or photo and if he choosed photo you'll get image per second
export const getRecordingType = () => {
    fs.readFile(settingsPath, (err, data) => {
        if (err) throw err;
       let settings = JSON.parse(data);
       console.log(settings)
       recordingType = settings.typeOfInput
       imagePerSecond = settings.imagePerSecond
     
     

       return {recordingType, imagePerSecond}
    });
    
}
// Get ID of screen and approve it
export const onAccessApproved = id => {
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
          minWidth: 1920,
          maxWidth: 1920,
          minHeight: 1080,
          maxHeight: 1080,
          maxFrameRate: 30,
        }
        
        }
      })
      .then(getMediaStream)
      .catch(getUserMediaError);
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
      screenVideoDuration = Math.round((stopTime - startTime) / 1000)
      console.log(Math.round(screenVideoDuration / 12))
  
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
  
  

 export  const stopRecording = () => {

    stopTime = Date.now()
  
    recorder.stop();
    document.querySelector('.duration__form').style.display= "block"
    console.log("#5: Stopping record and starting download");
    localStream.getVideoTracks()[0].stop();
    // Set the artist for song.mp3
    console.info(JSON.stringify( localStream.getVideoTracks()[0].getSettings()))
   
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
 //     speedUpVideo();
      // open input stream
      if (buffer.length > 0) {
        inStream = await streamifier.createReadStream(buffer);
       
      }
    };
    reader.readAsArrayBuffer(blob);
  };
  
  
  




  // CLean Record Stream
const cleanRecord = () => {
  recordedChunks = [];
  numRecordedChunks = 0;
};





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
  