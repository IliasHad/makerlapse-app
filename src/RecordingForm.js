
import React, { Component } from 'react';
import {getSources, getThumbanil} from "./getScreens";
import {onAccessApproved, stopRecording, getRecordingType} from "./ScreenRecordingWin";
const Timer = require("easytimer");
const timer = new Timer();
const ipcRenderer = window.require("electron").ipcRenderer
class Recording extends Component {

  state ={
    isLoaded: false
  }
  componentDidMount () {

    console.log("Loaded")
    // Get List of screens and applications available for recording
<<<<<<< HEAD
    const data = ipcRenderer.sendSync("get-screen-details")
    console.log(data.screens[0].id)
    this.setState({screens:data.screens, isLoaded: true, screenId: data.screens[0].id})
=======
    getSources(); 
    ipcRenderer.on("on-ready", (event, os)=> {
      console.log(os,event)
      console.log("On Ready")
    })
>>>>>>> d2125baf706a671b734e821d57b438ca14d2f6cf
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

<<<<<<< HEAD
      this.setState({screenId:  e.target.value})
=======
      getThumbanil(e.target.value);
   //   getSources()
>>>>>>> d2125baf706a671b734e821d57b438ca14d2f6cf

  }
  handleChange = checkbox => {
    console.log("hi")
  


    if (checkbox === true) {
      
      let id = this.state.screenId
      let reply = ipcRenderer.sendSync('start-recording',id);
console.log(reply)
if(reply) {
  timer.start()
}
   
     
    }
    
    else {
      let reply = ipcRenderer.sendSync('stop-recording');

    
      if(reply) {
        timer.stop()
      }
      
    

    }
  };
  render() {
    return (


<>
<div className="img__container"></div>
   <div className="capturer__list">
     {(this.state.isLoaded &&
       <select className="screen__items" onChange={this.changeScreens}>
         <>
         {this.state.screens.map(el => 
  <option>{el.name}</option>
         )}
</>
      
       </select>
      )}
   
       
      

   
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
