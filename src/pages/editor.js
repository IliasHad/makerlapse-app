import React, {useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom"
const ipcRenderer = window.require("electron").ipcRenderer
const EditorPage = ({screenVideoPath}) => {


  const outputDuration= useRef(null);


  const [selectedMusic, setSelectedMusic] = useState("Add Soundtrack")
  const [videoDuration, setVideoDuration] = useState(0)
    // Assume "video" is the video node
    var i = setInterval(function() {
      let video = document.querySelector("video")
       if(video.readyState > 0) {
         var minutes = parseInt(video.duration / 60, 10);
         var seconds = video.duration % 60;
     
         // (Put the minutes and seconds in the display)
         setVideoDuration((minutes * 60) + seconds)
         clearInterval(i);
       }
     }, 200);
  ipcRenderer.on("get-selected-music", (event, selectedMusic) => {
    setSelectedMusic(selectedMusic)
  })

    return (
      <div className="video__container" >
     

<video preload="auto" src={`file://${screenVideoPath}`} autoPlay controls></video>
     
<div className="editor__actions">
<div className="action__input">
<label htmlFor="output__duration">Output Duration</label>
  <input ref={outputDuration} id="output__duration" className="action__item "  type="time" placeholder="00:00" ></input>
  </div>
<button className="action__item action__button " onClick={(e) => {
  const x = e.pageX 
  const y = e.pageY
  ipcRenderer.sendSync("open-soundtrack-window")
}}>
{selectedMusic}
  </button> 

  <button className="action__item action__button" onClick={(e) => {
  const x = e.pageX 
  const y = e.pageY
  console.log(screenVideoPath, videoDuration, selectedMusic, outputDuration.current.value)
  ipcRenderer.sendSync("open-video-window",screenVideoPath, videoDuration, selectedMusic, outputDuration.current.value)
}}>
  Export

  </button> 

</div>
     </div>

    );
  
}

export default EditorPage
