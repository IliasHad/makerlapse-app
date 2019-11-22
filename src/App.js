import React, { Component } from 'react';
import './App.css';
import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";
import Recording from "./RecordingForm";
import Processing from "./ProcessingForm"

const {app} = window.require('electron').remote;

class App extends Component {
  render() {
    return (
      <div className="App">
       <Recording />
       <Processing />
      </div>
    );
  }
}

export default App;
