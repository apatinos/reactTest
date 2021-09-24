import React from 'react';
import '../../application/styles/square.css';

export default class Square extends React.Component {
    constructor(props) {    
        super(props);   
        this.state = {      
            position : props.position,
        };  
        this.block= "button block_"+this.props.value;
    }

    render() {
      return (
        <button className={this.block} onClick={()=>  this.props.buttonClick(this.state.position) }>
            {(this.props.value)?this.props.value:"  "}
        </button>
      );
    }
}