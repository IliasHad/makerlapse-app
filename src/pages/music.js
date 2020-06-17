import React, { ReactComponent } from "react";
import { Layout } from "../Components/layout";

import { ReactComponent as MusicSVG } from "../music.svg";
import { MdClose } from "react-icons/md";
const { ipcRenderer } = window.require("electron");
export const MusicPage = () => {
  return (
    <Layout>
      <header className="header__container">
        <div className="header__title">Music</div>
        <div className="header__quick-options">
          <button>
            <MdClose onClick={() => ipcRenderer.send("hide-music")} />
          </button>
        </div>
      </header>
      <div
        className="empty-state"
        style={{ webkitAppRegion: "drag" }}
        onDrag={(e) => {
          e.preventDefault();
          console.log(e);
          let droppedFiles = e.target.files || e.dataTransfer.files;
          //assign files to fileservice
          console.log(droppedFiles);
          //open wizard popup
        }}
      >
        <MusicSVG width="200" height="200" />

        <p>Upload Soundtrack to be added on your timelapse video</p>

        <div>
          <button
            className="button button-primary"
            onClick={() => ipcRenderer.sendSync("upload-soudtrack")}
          >
            Upload
          </button>
          <button
            className="button button-secondary"
            onClick={() => ipcRenderer.sendSync("skip-music")}
          >
            Skip
          </button>
        </div>
      </div>
    </Layout>
  );
};
