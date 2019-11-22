
import React, { Component } from 'react';
import {calcFrames, calcSpeed} from "./VideoProcessing"
import {recorder, stopRecording} from "./ScreenRecording"
export let currentExportValue = "mp4"
const Timer = require("easytimer");
const timer = new Timer();
class ProcessingForm extends Component {


  handleChange = (e) => {
   
      console.log(e.target.value);
    
      currentExportValue = e.target.value 
   
  }
  handleSubmit = e => {
    e.preventDefault()
    let minutes = e.target[0].value ||0
    let secondes = e.target[1].value ||0 
    console.log(minutes, secondes)
    timer.stop();

   
   /*
    if(recordingType.includes("photo") ){
      clearInterval(intervalScreenShooting)
     

      calcFrames(minutes, secondes)
    }
    else  {
      if(recorder.state === "active") {
        stopRecording()

      }

      calcSpeed(minutes, secondes)

     

    }
   */
  if(recorder.state === "active") {
    stopRecording()

  }

  calcSpeed(minutes, secondes)


  }
  render() {
    return (


<>




<form className="duration__form" onSubmit={this.handleSubmit} >
    <label htmlFor="minutes">Ouput Duration</label>
    <input  type="number" placeholder="M" />
    <input  type="number"  placeholder="S" />
    <select className="export__items" onChange={this.handleChange}>
              
        <option value="mp4">Export As MP4</option>
        <option value="instagram">Export for Instagram</option>
        <option value="twitter">Export for Twitter</option>
        <option value="youtube">Export for Youtube</option>

       </select>
    <button className="btn btn-primary download__timelapse" type="submit">Download Timelapse Video</button>

</form>
<button className="btn btn-primary open__timelapse " >Open Timelapse Video</button>
</>

)
}
}
export default ProcessingForm