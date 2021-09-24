import React from 'react';
import Square from "./square"
import '../../application/styles/board.css';

export class Board extends React.Component {

    constructor(props) {    
        super(props);    
        this.state = {      
            squares: Array(9).fill(null), 
            history:  [],
            isWinner: false
        };
        this.newMove = Array(9).fill(null);
        this.buttonClick = this.buttonClick.bind(this);

    }

    isWinner(condition){
        this.setState({isWinner:condition});
    }


    calculateWinner(squares) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
    }

    componentDidMount() {
        this.newMove = this.state.squares;
    }

    buttonClick(i){  
        this.newMove[i-1]=this.props.value;
        this.setState({squares: this.newMove})
        const winner = this.calculateWinner(this.state.squares);   
        if (winner) {     
            this.isWinner(true)  
        } else {  
            this.setState({ history: [...this.state.history, [...this.newMove] ] })
            this.props.setNext()
        }
    }

    renderSquare(i) {
        return <Square position={i} value={this.state.squares[i-1]} nextPlayer={this.props.value} buttonClick={this.buttonClick}/>;  
    } 

    jumpTo(array){

        if(array){
            this.setState({squares : array})
            
            if(this.state.history && this.state.history.length > 0){
                let previusHistory = this.state.history[this.state.history.length-1];
                this.setState({history : previusHistory})
            }
            else{
                this.setState({history : []})
            }
        }
        else{
            this.setState({squares:[], history:  [], isWinner: false })
            this.props.setNew()
            this.newMove = []
        }
        
        
        
    }

    render(){
        const moves = (this.state.history)?this.state.history.map((move , index) => {      
            const desc = move ?'Go to move #' + index: 'Go to move #0';      
            return ( <li> <button onClick={() => this.jumpTo(move)}>{desc}</button></li>);
        }):null;

        if(!this.state.isWinner){
            console.log(this.state.history)
            return React.createElement('div', {className: 'app-table center'}, 
                React.createElement('h1',{}, "Next Player: " + this.props.value ),
                this.renderSquare(1), 
                this.renderSquare(2), 
                this.renderSquare(3),
                React.createElement('br'),
                this.renderSquare(4),
                this.renderSquare(5),
                this.renderSquare(6),
                React.createElement('br'),
                this.renderSquare(7),
                this.renderSquare(8),
                this.renderSquare(9),
                React.createElement('br'),
                React.createElement('br'),
                React.createElement('h1',{}, "History: " ),
                React.createElement('div', {className: 'app-table center'}, 
                React.createElement('li',{},  <button onClick={() => this.jumpTo(null)}>Go to Start</button> ),
                    moves
                )
            );
            
        }
        else {
            return React.createElement('div', {className: 'app-table center'}, React.createElement('h1',{}, "Win winner chicken dinner: " + this.props.value  ));
        }
        
    }
}