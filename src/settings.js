const { remote, ipcRenderer} = require("electron");

const app = remote.app;
const userAppPath =  app.getPath('userData');
const path = require('path')
const fs = require('fs')
let settingsPath = path.join(userAppPath, "settings.json")
let optionList = document.querySelector('.timelapse__container .screen__items')
document.addEventListener("DOMContentLoaded", () => {

  
    let option_video = '<option value="video">Timelapse From Video</option>'
    let option_image = ' <option value="photo">Timelapse From Photos</option>'

let typeInput 
  
  document.querySelector(".timelapse__container select").addEventListener("change", e => {
        console.log(e.target.value);

        typeInput = e.target.value
        if(e.target.value.includes('photo')) {
            document.querySelector(".input__fields").style.display = "block"
        }
        else {
            document.querySelector(".input__fields").style.display = "none"

        }

      })

      document.querySelector(".settings__form").addEventListener("submit", (e) => {
e.preventDefault()

imagePerSecond =  e.target[0].value
console.log(imagePerSecond)

let data = {
    typeOfInput:typeInput,
    imagePerSecond
}

fs.exists(settingsPath, function(exists) {
    if(exists) {
      fs.readFile(settingsPath, (err, resData) => {
        if (err) throw err;
       let settings = JSON.parse(resData);
       settings.typeOfInput = typeInput || "video"
       settings.imagePerSecond=  imagePerSecond  || 0

       console.log(settings)
      

        fs.writeFile(settingsPath, JSON.stringify( settings), function(err){
            if(err) console.log(err)
            else console.log('File Cretaed')
        })
    });
    }

    else {

        fs.writeFile(settingsPath, JSON.stringify(data), function(err){
            if(err) console.log(err)
            else console.log('File Cretaed')
        })
    }
})

    })
    document.querySelector('.check__updates').addEventListener("click", () => {
        ipcRenderer.send("check-updates", "Helo")
      })
    
})