import React from "react"

const ipcRenderer = window.require("electron").ipcRenderer



const Header = () => {


    return (

        <div className="header">
            <div className="header__left">

            <h3 className="app__title">Makerlapse</h3>

            </div>

            <div className="header__right">

            <i className="ni ni-cloud-download-95" onClick={(e) => {

const x = e.pageX 
const y = e.pageY
ipcRenderer.send(`display-updater-menu`, { x, y });

            }}></i>
            <i className="ni ni-settings-gear-65"></i>
            <i className="ni ni-camera-compact"></i>

            

            </div>

        </div>
    )
}

export default Header