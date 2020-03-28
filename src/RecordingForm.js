
import React, { Component } from 'react';
const Timer = require("easytimer");
const timer = new Timer();
const ipcRenderer = window.require("electron").ipcRenderer



class Recording extends Component {

  state ={
    isLoaded: false,
    isWebcam: false
  }
  componentDidMount () {

    console.log("Loaded")
    // Get List of screens and applications available for recording
    const data = ipcRenderer.sendSync("get-screen-details")
    const screenVideoPath = ipcRenderer.sendSync("get-latest-recording-video")
    console.log(data.audioDevices[0].id)
    console.log(screenVideoPath)
    this.setState({screens:data.screens, isLoaded: true, screenId: data.screens[0].id, audioDevices: data.audioDevices, audioDeviceId:data.audioDevices[0].id})
    // Add event listener to hide some uncessary UI elements when you're recording your screen
   /* timer.addEventListener("secondsUpdated", function(e) {
      document.querySelector('.btn-primary.open__timelapse').style.display = "none"
    
    
      document.querySelector(".contdown__timer").innerHTML = timer.getTimeValues().toString();
    });

    // Reset your countdown when someone stop recording
    timer.addEventListener('stop', function(e) {
      document.querySelector(".contdown__timer").innerHTML = ""
    })*/
   
  }

  changeScreens = (e) => {
    
    console.log(e.target.value);

      this.setState({screenId:  e.target.value})

  }
  changeAudioDevices = (e) => {
    
    console.log(e.target.value);

    const id = this.state.audioDevices.filter(el => el.name === e.target.value)[0].id
    console.log(id)  
    this.setState({audioDeviceId: id})

  }
  handleChange = checkbox => {
    console.log("hi")
  


    if (checkbox === true) {
      
      let screenId= this.state.screenId
      let audioDeviceId = this.state.audioDeviceId
      console.log(this.state.isWebcam)
      let reply = ipcRenderer.sendSync('start-recording',{screenId, audioDeviceId, isWebcam: this.state.isWebcam });
console.log(reply)
if(reply) {
  timer.start()
}
   
     
    }
    
    else {
      console.log("stop")
      let reply = ipcRenderer.sendSync('stop-recording');

    
      if(reply) {
        timer.stop()
      }
      
    

    }
  };
  handleMicrophone = (checked) => {
    console.log("Mic", checked)
    if (checked ===  false) {

      this.setState({audioDeviceId: undefined})

    }  else {
     const previous = document.querySelector(".microphone__list select").value
     const id = this.state.audioDevices.filter(el => el.name === previous)[0].id
     console.log(id)  
     this.setState({audioDeviceId: id})
    
   
    }


  }

  handleWebcam = (checked) => {

      this.setState({isWebcam: checked})

  


  }
  render() {
    return (


<>

{/*




   <div className="capturer__list">
     {(this.state.isLoaded &&
       <select className="screen__items" onChange={this.changeScreens}>
         <>
         {this.state.screens.map(el => 
  <option key={el.id}>{el.name}</option>
         )}
</>
      
       </select>
      )}
   
       
      

   
   </div>
   */}

<div className="actions">
      
           
      <input type="checkbox"  id="record" className="record__btn"  onChange={(e) => {
    this.handleChange(e.target.checked) }} />
      <label htmlFor="record" className="record__video"  ></label>

</div>

<div className="items__list screen__list">
<h4 className="list__title">Screens </h4>

{(this.state.isLoaded &&
       <select className="screen__items" onChange={this.changeScreens}>
         {this.state.screens.map(el => 
  <option key={el.id}>{el.name} </option>
         )}


      
       </select>
      )}
</div>
<div className="items__list microphone__list">
  <div className="list__items">
  <h4 className="list__title">Microphone</h4>
  <div className="list__toggle">
  <label className="custom-toggle" htmlFor="microphone">
              <input type="checkbox" id="microphone" onChange={(e) => {
    this.handleMicrophone(e.target.checked) }}/>
              <span className="custom-toggle-slider rounded-circle" />
            </label>
  </div>
  

  </div>

{(this.state.isLoaded &&
       <select className="screen__items" onChange={this.changeAudioDevices}>
         <>
         {this.state.audioDevices.map(el => 
  <option key={el.id}>{el.name} </option>
         )}

</>
      
       </select>
      )}
</div>
  

<div className="items__list microphone__list">
  <div className="list__items">
  <h4 className="list__title">Webcam</h4>
  <div className="list__toggle">
  <label className="custom-toggle" htmlFor="webcam">
              <input type="checkbox" id="webcam" onChange={(e) => {
    this.handleWebcam(e.target.checked) }}/>
              <span className="custom-toggle-slider rounded-circle" />
            </label>
  </div>
  

  </div>

  </div>
{/* 

<div className=" items__list webcam__list">
<h4 className="list__title">Webcam </h4>
<label className="custom-toggle" htmlFor="webcam">
              <input type="checkbox" id="webcam"/>
              <span className="custom-toggle-slider rounded-circle" />
            </label>
</div>

*/}
</>




)
}
}
export default Recording
