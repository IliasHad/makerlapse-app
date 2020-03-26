import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom"
const ipcRenderer = window.require("electron").ipcRenderer


const VideosPage = () => {

    const [videoPath, setVideoPath] = useState("");
    const [progress, setProgress] = useState(0);

    const [estimator, setEstimator] = useState("");

    // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    ipcRenderer.on("video-progress", (event, progress, estimator, videoPath) => {
        setProgress(progress)
        setVideoPath(videoPath)
        setEstimator(estimator)
    })  });
  
    return (
      <div className="video__container" >
            <h3 className="app__title music__header">Videos</h3>

<div className="video__items">

    <div className="video__item">
        <img className="video__thumbnail"></img>
    <h5 className="video__title">{videoPath}</h5>
    <p className="video__estimator">
        
    Converting {progress}%.. {estimator}
      </p>
    </div>
</div>
      </div>
    );
  
}

export default VideosPage
