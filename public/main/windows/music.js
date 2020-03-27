
const {BrowserWindow, ipcMain, app} = require("electron")
const isDev = require("electron-is-dev");
const path = require("path")
var YoutubeMp3Downloader = require("youtube-mp3-downloader");
const util = require('electron-util');
const fs = require("fs")
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const ffmpegPath = util.fixPathForAsarUnpack(ffmpeg.path);
//Configure YoutubeMp3Downloader with your settings
let musicWindow
const musicPath = path.join(app.getAppPath(),'music', 'music.json')
const url = require("url")
const createMusicWindow= () =>  {
  musicWindow = null
  musicWindow   = new BrowserWindow({ 
      height: 488,
      width: 380,
      webPreferences: { nodeIntegration: true},
      icon: path.join(__dirname, 'assets/icons/icon.png'),
      title:"Makerlapse",
    
    
    });
    
    musicWindow.webContents.openDevTools()
    musicWindow.setTitle("Soundtracks")
    musicWindow.loadURL(
      isDev
  
      ? 'http://localhost:3000/music'
      :   
      url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
    
    musicWindow.on("closed", () => (webCamWindow= null));
    
    
    
    }
    ipcMain.on("get-music",(event, message) => {

      event.returnValue = JSON.parse(fs.readFileSync(musicPath))
      console.log("Event Triggered")
     
    })

    ipcMain.on("donwload-music",(event,id) => {
  
      console.log("Music Download", id)
      downloadMP3(id)
      event.returnValue = "Music ..."
      

     
    })

const hideMusicWindow = () => {
  musicWindow.close()
}


      exports.createMusicWindow = createMusicWindow
      exports.hideMusicWindow = hideMusicWindow




  

const outputPath = path.join(app.getAppPath(), "music")
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": ffmpegPath,        // Where is the FFmpeg binary located?
    "outputPath": outputPath,    // Where should the downloaded and encoded files be stored?

});




const downloadMP3 = (id) => {


let progress = 0
//Download video and save as MP3 file
fs.exists(outputPath, (isExcited) => {
    if(!isExcited)  {
        fs.mkdir(outputPath, (err) => { 
            if (err) { 
              return console.error(err); 
            } 
            console.log('Directory created successfully!'); 
          }); 

    }

  

  else {
   //Download video and save as MP3 file
YD.download(id);
 
YD.on("finished", function(err, data) {

  const previousMusic = JSON.parse(fs.readFileSync(musicPath)).music
  console.log(data)
  console.log(previousMusic)
  const exciting = previousMusic.filter(el => el.youtubeId=== id)
  console.log(exciting.length)
if(exciting.length > 0 ) {
  previousMusic.forEach(el => {
    if(el.youtubeId === id) {
      el.filePath = data.file
    }
  })
} else {
  previousMusic.push({
    filePath:data.file,
    youtubeId:data.videoId,
    artist: data.title,
    thumbnail: data.thumbnail
  })
}
console.log(previousMusic)
 
  fs.writeFileSync(musicPath, JSON.stringify({music:previousMusic}))

  musicWindow.webContents.send("get-music",{music:previousMusic} )

});
 
YD.on("error", function(error) {
    console.log(error);
});
 
YD.on("progress", function(data) {
   progress = data.progress.percentage
   musicWindow.webContents.send('music-progress', progress);

});
  }

})

return progress
}





