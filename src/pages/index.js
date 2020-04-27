import React from "react";
import { Layout } from "../Components/layout";
import { Content } from "../Components/content";
import { Header } from "../Components/header";

export const IndexPage = () => {
  return (
    <Layout>
      <Header title="Makerlapse" />

      <Content />

      {/*
     
     
     
     <button onClick={() => {
        let msg =  ipcRenderer.sendSync("start-screenshoting")
        console.log(msg)
     
     }}>Start ScreenShooting :)</button>
          
     
     <button onClick={() => {
       let msg = ipcRenderer.sendSync("stop-screenshoting")
       console.log(msg)
     }}>Stop ScreenShooting :)</button>
     */}
    </Layout>
  );
};
