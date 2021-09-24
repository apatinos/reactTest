import { Board } from "./board";
import React from 'react';

export default class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            oIsNext: false,
        }
        this.setNext = this.setNext.bind(this)
        this.setNew = this.setNew.bind(this)
    }
    componentDidMount() {
        this.setState({oIsNext: false})
    }
    setNew(){
        this.setState({oIsNext: false })
    }
    setNext(){
        this.setState({oIsNext: !this.state.oIsNext })
    }
    renderBoard(next){
        
        return (<Board value={next} setNext={this.setNext} setNew={this.setNew}></Board>)
    }
    render() {
        let turn =  this.state.oIsNext ? 'O' : 'X'
        return this.renderBoard(turn);
    }
}