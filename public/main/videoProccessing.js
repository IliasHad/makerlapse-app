const { remote} = require("electron");
const fs = require("fs")
const path = require('path')
const {createWorker} = require("@ffmpeg/ffmpeg")

const worker = createWorker({
  logger: m => console.log(m),
  progress: p => console.log(p)
})
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const util = require('electron-util');
const ffmpegPath = util.fixPathForAsarUnpack(ffmpeg.path);
const execa = require('execa');






// `ffmpeg -i original.mp4 -vcodec libx264 -crf 27 -preset veryfast -c:a copy output.mp4`
const convertToH264 = async inputPath => {
  const outputPath = path.join(__dirname, "testing.mp4")
  console.log(inputPath)
try{
  const {stdout, stderr} = await execa(ffmpegPath, [
    '-i', inputPath,
    '-an',
    '-vcodec', 'copy',
    

    outputPath
  ]);

    stderr.on('data', data => {
      console.log("Data is comming ...")
     console.log(data)

    })
    stderr.on('error', console.log("Error :("));

console.log(stdout)
console.log(stderr)
  console.log(outputPath);
}
 catch(err){
   console.log(err)
 }
}
const speedUpVideo = async (webcamData) => {

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
   
  
   let defaultParms = [
    "-preset ultrafast",
    "-threads 1",
   `-vf setpts=(1/100)*PTS`,
    "-crf 18",// New To Get Better Quality
    "-vsync 0", // New To Get Better Quality
    "-movflags frag_keyframe+empty_moov",
    "-movflags +faststart"
  ]
  

  try {

 
    let output = [];
  
    const worker = createWorker({
      logger: ({ message }) =>console.log(message),
      progress: (p) => console.log(p)
    });
    const load = await worker.load();
      console.log(load)
  
      const name = 'record.mp4';
      const write = await worker.write(name,webcamData);
  console.log(write)
    


    const run = await worker.run(`-i ${name} -c:v libx264 -preset slow -profile:v high -vf setpts=(1/100)*PTS -crf 18 -coder 1 -pix_fmt yuv420p -movflags +faststart -g 30 -bf 2 -c:a aac -b:a 384k -profile:a aac_low    flame.mp4`);
      console.log(run)
/*
    "-preset ultrafast",
      "-threads 1",
     `-vf setpts=(1/100)*PTS`,
      "-crf 18",// New To Get Better Quality
      "-vsync 0", // New To Get Better Quality
      "-movflags frag_keyframe+empty_moov",
      "-movflags +faststart"
  */
  const { data } = await worker.read('flame.mp4');
  console.log('Complete transcoding');
  fs.writeFileSync('flame.mp4', Buffer.from(data));
  process.exit(0);
  
  }	
  catch(err) {
      console.log(err)
  }
   
  };
  
exports.speedUpVideo = speedUpVideo
exports.convertToH264 = convertToH264