
import React, { Component } from 'react';
import {getSources, getThumbanil} from "./getScreens";
import {onAccessApproved, stopRecording, getRecordingType} from "./ScreenRecordingWin";
const Timer = require("easytimer");
const timer = new Timer();
const ipcRenderer = window.require("electron").ipcRenderer
class Recording extends Component {
  componentDidMount () {

    // Get List of screens and applications available for recording
    getSources(); 
    ipcRenderer.on("on-ready", (event, os)=> {
      console.log(os,event)
      console.log("On Ready")
    })
    // Add event listener to hide some uncessary UI elements when you're recording your screen
    timer.addEventListener("secondsUpdated", function(e) {
      document.querySelector('.progress-wrapper').style.display = "none"
      document.querySelector('.btn-primary.open__timelapse').style.display = "none"
    
    
      document.querySelector(".contdown__timer").innerHTML = timer.getTimeValues().toString();
    });

    // Reset your countdown when someone stop recording
    timer.addEventListener('stop', function(e) {
      document.querySelector(".contdown__timer").innerHTML = ""
    })
   
  }

  changeScreens = (e) => {
    
    console.log(e.target.value);
    document.querySelector(".img__container").innerHTML = "";

      getThumbanil(e.target.value);
   //   getSources()

  }
  handleChange = checkbox => {
    console.log("hi")
  

    let recording = getRecordingType();

    if (checkbox === true) {
      timer.start();
  
      
      let id = document.querySelector(".img__container img").id;
      onAccessApproved(id);
   /*   if(recording.recordingType.includes("photo")) {
       /* intervalScreenShooting = setInterval(function() {
          getSources()
          takeScreenShot(id)
          }, imagePerSecond * 1000);
  /*
      }
      else {
        onAccessApproved(id);
      }*/
    }
    
    else {
      timer.stop();
      /*
      if(recording.recordingType.includes("photo")) {
     /*   clearInterval(intervalScreenShooting)
       numberOfScreenShots =   count 
        count = 0
  /*
      }
      else {
        stopRecording()
  
      }
      */
     stopRecording()
    }
  };
  render() {
    return (


<>
<div className="img__container"></div>
   <div className="capturer__list">
     
    <select className="screen__items" onChange={this.changeScreens}>
       
</select>
       
      
    <select className="window__items" onChange={this.changeScreens}>
       
     
    </select>

   
   </div>
<div className="actions">
      
           
      <input type="checkbox"  id="record" className="record__btn"  onChange={(e) => {
    this.handleChange(e.target.checked) }} />
      <label htmlFor="record" className="record__video"  ></label>
<p className="contdown__timer"></p>


<div className="progress-wrapper">
 <div className="progress-info">
   <div className="progress-label">
     <span>Task completed</span>
   </div>
   <div className="progress-percentage">
     <span>60%</span>
   </div>
 </div>
 <div className="progress">
   <div className="progress-bar bg-default" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ></div>
 </div>

</div>

</div>
</>




)
}
}
export default Recording
