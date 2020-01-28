import { determineScreenShotSize, startScreenShotinng } from "./ScreenShot";
const { desktopCapturer} = window.require("electron");
let sourcesItems = [];

console.log("Size",  determineScreenShotSize())

// Options for screen recording
let options = {
  
    types: [ "screen"],
    thumbnailSize: determineScreenShotSize()

   
    
  
}

export const getScreenShotsThumbnails = () => {
  desktopCapturer.getSources(options, (error, sources) => {
    let thumbnail = sources.filter(el => el.id.includes('screen'))[0].thumbnail

});
}

// Get List of screens and applications available for recording

export const getSources = () => {
    desktopCapturer.getSources(options, (error, sources) => {
      if (error) console.log(error);
      let screenList = document.querySelector(".screen__items");
     // let windowsList = document.querySelector(".window__items");
      screenList.innerHTML = "";
     // windowsList.innerHTML = ""
  
      sourcesItems = sources;
      console.log(sources);
      let defaultId = sources.filter(el => el.id.includes('screen'))[0].id
      let thumbnail = sources.filter(el => el.id.includes('screen'))[0].thumbnail
      console.log(thumbnail)
      getThumbanil(defaultId)

      for (let source of sources) {
       
        let thumb = source.thumbnail.toDataURL();
        if (!thumb) continue;
  
        let title = source.name.slice(0, 20);
        let item = `<option value=${source.id}><a href="#">${title}</a></option>`;
        if (source.id.includes("screen")) {
          screenList.insertAdjacentHTML("afterbegin", item);
        }
        
        //else {
          //windowsList.insertAdjacentHTML("afterbegin", item);
        //}
      }
    });
  };

// Get thumbnail when you get screens and application available for recording
export const getThumbanil = id => {
    let img = document.querySelector(".img__container");

     img.innerHTML = ""
    console.log(sourcesItems);
  
    let thumb = sourcesItems.filter(el => el.id === id)[0].thumbnail;
    let item = `<img id=${id} src=${thumb.toDataURL()}> `;
    img.insertAdjacentHTML("afterbegin", item);

  };