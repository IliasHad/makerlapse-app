const { remote} = require("electron");
const fs = require("fs")
const path = require('path')
const {createWorker} = require("@ffmpeg/ffmpeg")

const worker = createWorker({
  logger: m => console.log(m),
  progress: p => console.log(p)
})

const speedUpVideo = async (file) => {

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
  
    const baseName = path.basename(file);
    const write = await worker.write(baseName, file);
  console.log(write)
  
    const run = await worker.run(`-i ${baseName} -preset ultrafast -vf setpts=(1/100)*PTS -crf 18 -vsync 0 -movflags frag_keyframe+empty_moov -movflags +faststart flame.mp4`);
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
