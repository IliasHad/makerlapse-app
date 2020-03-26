

const { createWorker } = require('@ffmpeg/ffmpeg');
const fs = require('fs');
const path = require('path');





async function convertImageToVideos(folderPath) {
    try {

 

	const worker = createWorker({
		logger: ({ message }) =>console.log(message),
		progress: (p) => console.log(p)
	});
	const load = await worker.load();
    console.log(load)

const files  =fs.readdirSync(folderPath)

	for (let i = 0; i < files.length; i += 1) {
		const num = `00${i}`.slice(-3);
		console.log(path.join(folderPath,files[i] ))
		await worker.write(`tmp.${num}.png`, path.join(folderPath,files[i] ));
	  }


  console.log('Start transcoding');
  await worker.run('-framerate 30 -pattern_type glob -i *.png  -c:a copy -shortest -c:v libx264 -pix_fmt yuv420p out.mp4', { output: 'out.mp4' });
  const { data } = await worker.read('out.mp4');
  console.log('Complete transcoding');

/*
  "-preset ultrafast",
    "-threads 1",
   `-vf setpts=(1/100)*PTS`,
    "-crf 18",// New To Get Better Quality
    "-vsync 0", // New To Get Better Quality
    "-movflags frag_keyframe+empty_moov",
    "-movflags +faststart"
*/
fs.writeFileSync('out.mp4', Buffer.from(data));
process.exit(0);

}	
catch(err) {
    console.log(err)
}
}
