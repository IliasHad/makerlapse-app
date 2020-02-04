import React from 'react';
import {Rnd} from "react-rnd";
const {remote} = window.require('electron');
const screenSize = remote.screen.getPrimaryDisplay().size

const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 2px #3a38d2',
    margin: '5px'
};

class Cropper extends React.Component{


  
    constructor(props){
        super(props);
        this.state = {
            width: '500px',
            height: '500px',
            x: (screenSize.width/2) - 250,
            y: (screenSize.height/2) - 250
        };
    }
    componentDidMount()  {
      console.log(this.state)
    }

    render(){
        return(
            <Rnd
                style={style}
                size={{ width: this.state.width, height: this.state.height }}
                position={{ x: this.state.x, y: this.state.y }}
                onDragStop={(e, d) => {
                    this.setState({ x: d.x, y: d.y })
                }}
                onResize={(e, direction, ref, delta, position) => {
                    this.setState({
                        width: ref.style.width,
                        height: ref.style.height,
                        x : position.x,
                        y : position.y
                    });
                }}
                bounds={'parent'}
            >
                <div className="rnd-controls">
                    <button
                        className="btn btn-primary"
                        onClick={this.props.snip.bind(this, this.state)}
                    >Capture</button>
                    <button
                        onClick={this.props.destroySnipView.bind(this)}
                        className="btn btn-primary"
                    >Cancel</button>
                </div>
            </Rnd>
        )
    }
}

export default Cropper;
