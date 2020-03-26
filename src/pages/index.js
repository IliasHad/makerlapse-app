import React, { Component } from 'react';
import {Link} from "react-router-dom"

import ScreenRecording from "../RecordingForm"
import Header from "../components/header"
const  IndexPage  = () => {
    return (
        <>
        <Header />
        <ScreenRecording />
    </>
    );
  
}

export default IndexPage;
