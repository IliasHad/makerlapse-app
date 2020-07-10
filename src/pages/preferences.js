import React, { useState, useEffect } from "react";
import { Layout } from "../Components/layout";
import { Header } from "../Components/header";
import { Link } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

export const PreferencesPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    setFrameCount(e.target.value);
    ipcRenderer.send("udpate-preferences", frameCount);
  };

  useEffect(() => {
    setFrameCount(ipcRenderer.sendSync("get-preferences"));
  }, []);
  const [frameCount, setFrameCount] = useState(30);
  return (
    <Layout>
      <Header title="Settings" returnPath="/" />

      <form className="settings" onSubmit={handleSubmit}>
        <div className="settings__option">
          <label className="settings__label" htmlFor="framerate">
            Frame per second in Video
          </label>
          <input
            type="number"
            id="framerate"
            onChange={(e) => setFrameCount(e.target.value)}
            value={frameCount}
          ></input>
        </div>
        <div className="settings">
          <button type="submit" className="button button-primary">
            Save
          </button>
          <Link to="/">
            <button className="button button-secondary">Cancel</button>
          </Link>
        </div>
      </form>
    </Layout>
  );
};
