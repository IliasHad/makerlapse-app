import React ,{useEffect, useState}from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import IndexPage from "./pages/index"
import PreferencesPage from "./pages/preferences"
import EditorPage from "./pages/editor"
import MusicPage from "./pages/music"
import VideosPage from "./pages/videos"
const ipcRenderer = window.require("electron").ipcRenderer
const clipboard =window.require("electron").clipboard
const keyCodes = {
	V: 86,
}


document.onkeydown = function(event){
	let toReturn = true
	if(event.ctrlKey || event.metaKey){  // detect ctrl or cmd
		if(event.which == keyCodes.V){
			document.activeElement.value += clipboard.readText()
			document.activeElement.dispatchEvent(new Event('input'))
			toReturn = false
		}
	}

	return toReturn
}
// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

// Our route config is just an array of logical "routes"
// with `path` and `component` props, ordered the same
// way you'd do inside a `<Switch>`.


const App =  () => {




  return(

 <Router>
<div class="app">

   <Route  path="/"  exact component={IndexPage}/>
   <Route  path="/perferences" exact component={PreferencesPage}/>
   <Route  path="/editor" exact component={EditorPage} />
   <Route  path="/music" exact component={MusicPage}/>

   <Route  path="/video" exact component={VideosPage}/>

   </div>
 </Router>

  )

}

export default App