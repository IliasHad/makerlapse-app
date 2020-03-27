const {app, desktopCapturer, Tray}= require("electron");
const fs = require("fs")
const os = require("os")
const uniqid = require('uniqid');
const FileReader = require('filereader')
const Blob = require('node-blob');
const streamToBlob = require('stream-to-blob')
const moment = require('moment')
let localStream;
let recordedChunks = [];
let recorder;
let screenVideoPath 
let screenVideoName
let startTime;
let stopTime;
let screenVideoDuration
let aperture
let macRecorder
const path = require("path")
const {createEditorWindow} = require("../windows/editor")
const {destryWebcamAccess} = require("../windows/webcam")

if(os.platform() === "darwin") {
 aperture = require('aperture');
 macRecorder = aperture();


}







async function getScreenInfo(){

    return new Promise(async (res, rej) => {
  
      if(os.platform() === "darwin") {
      
        const screens = await aperture.screens()
        const audioDevices = await aperture.audioDevices()
        console.log(screens, audioDevices)
        res({screens, audioDevices, os})
      }
      else {
       
        desktopCapturer.getSources({ types: ['window', 'screen'] }).then(sources => {

          console.log(sources)
          res({screens:sources, os})

        })
      }
        
          
        
      
        
      
    })
    
  }
  
  
  
  
  
  
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
            minWidth: 1280,
            maxWidth: 1920,
            minHeight: 720,
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
  
  
  
    async function startRecording ({screenId, audioDeviceId}) {
  
      
      if(os.platform() === "darwin") {
        await macRecorder.startRecording({screenId, audioDevices: audioDeviceId});

      }
    
      else {
    
        onAccessApproved(screenId)
      }
    }
    
 

    const stopRecording = async () => {

        if(os.platform() === "darwin") {
      
        
         const fp = await macRecorder.stopRecording()
         const now = Date.now()
         destryWebcamAccess()

         fileName = moment(now).format('YYYY-MM-DD-HH-mm-ss')
         const outputPath = `${app.getAppPath()}/videos/${fileName}.mp4`;
         fs.existsSync(`${app.getAppPath()}/videos`) || fs.mkdirSync(`${app.getAppPath()}/videos`);
         fs.renameSync(fp, outputPath)
         console.log(`Video saved in ${outputPath}`);


         createEditorWindow(outputPath)


        }
      
        else {
      
          stopTime = Date.now()
      
          recorder.stop();
         
          localStream.getVideoTracks()[0].stop();  
        }
        
        // Set the artist for song.mp3
       
      };



      exports.stopRecording = stopRecording
      exports.getScreenInfo = getScreenInfo
      exports.startRecording = startRecording



    