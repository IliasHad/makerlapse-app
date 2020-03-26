import React,{useRef,useState, useEffect } from 'react';
const ipcRenderer = window.require("electron").ipcRenderer


const MusicPage = () => {

    const youtubeVideo = useRef(null);
    const [progress, setProgress] = useState(0)
    const [id, setId] = useState("")
    const [music, setMusic] = useState(ipcRenderer.sendSync("get-music").music)

    ipcRenderer.on("get-music", (event, {music}) => {
    
        setMusic(music)
    })

  

    
   const  downloadMP3 = (e) => {

      const id = e.target.id
      setId(id)
      const message =   ipcRenderer.sendSync("donwload-music", id)
        console.log(message)

        ipcRenderer.on("music-progress", (event, data) => {
            console.log(Math.round(data))
            setProgress(Math.round(data))
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
       const id = youtubeVideo.current.value.split("https://www.youtube.com/watch?v=")[1]
       console.log(id)
        ipcRenderer.sendSync("donwload-music", id)

    }
    return (

       <div className="music__container">
            <h3 className="app__title music__header">SoundTracks</h3>
         
         <form onSubmit={handleSubmit}>
            <div class="form-group"><input ref={youtubeVideo} placeholder="Youtube Video" type="text" class="form-control" />

            <button type="submit" className="btn btn-primary" >Download MP3</button>

            </div>            </form>

<div className="music__items">


{music.map(el => 
    <div className="music__item">

    <img className="music__thumbnail" src={el.thumbnail}></img>
<h5 className="music__title">{el.artist}</h5>
        <p className="music__source">{el.source}</p>


        {el.filePath === ""
        ?         <button className="music__btn btn btn-primary" id={el.youtubeId} onClick={downloadMP3}>{el.youtubeId === id ? `${progress}%` : "Download"}</button>

        : <button className="music__btn btn btn-primary" id={el.youtubeId} onClick={() => {
            ipcRenderer.sendSync("music-added", el.filePath)

        }}>Use</button>
      }
     
    </div>
    
    )}



</div>


       </div>

    );
  
}

export default MusicPage
