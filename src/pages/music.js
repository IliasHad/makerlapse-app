import React from "react";
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
      <div className="empty-state">
        <MusicSVG width="200" height="200" />

        <p>Upload Soundtrack to be added on your timelapse video</p>

        <div>
          <button
            className="button button-primary"
            onClick={() => ipcRenderer.send("upload-soudtrack")}
          >
            Upload
          </button>
          <button
            className="button button-secondary"
            onClick={() => ipcRenderer.send("skip-music")}
          >
            Skip
          </button>
        </div>
      </div>
    </Layout>
  );
};
