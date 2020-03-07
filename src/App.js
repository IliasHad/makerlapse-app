import React, { Component } from 'react';
import './App.css';
import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";
import ScreenRecording from "./RecordingForm"
import ProcessingForm from "./ProcessingForm"

class App extends Component {
  render() {
    return (
      <div className="App">
        <ScreenRecording />
     <ProcessingForm />

      </div>
    );
  }
}

export default App;
