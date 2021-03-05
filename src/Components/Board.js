import "./board.css"
import { useState,useEffect  } from 'react'
import {Leaderboard} from './Leaderboard.js'


export const Board=(props)=>{
    const [won,hasWon]=useState([false, //[0] has someone won
                                "", //[1] message for winner or loser
                                "", //[2] message so spectators know who won
                                ]);
    useEffect(()=>{
        props.socket.on('play',(data)=>{

            const values=["X","O"];
            var message="";
            var Spectator_message="Message"
            if (data['Won']!="_" ){
                if (data['Won']===values[props.id]){
                    message="You have won!!"
                    props.socket.emit("winner",{"username":props.username})
                }
                else{
                    message="You have lost!!!"
                }
                if(props.id==0){
                    Spectator_message="Player one has won"
                }
                else{
                    Spectator_message="Player two has won"
 
                }
                hasWon((oldState)=>[true,message,Spectator_message])
            }

        });
        
    },[])
    function send(num,value){ 
        var item=[...props.board.slice(0,num),value,...props.board.slice(num+1)];
        props.socket.emit('play',{"value":value,"index":num,"data":item});
    }
    function restartGame(){
        props.socket.emit("restart")
        hasWon([false,"",""])
        
    }
    const values={"X":"Player 1", "O":"Player 2"}
    return(
        <div className="game" >
            {won[0] && props.id<2 && <div className="message">{won[1]}</div>}
            {won[0] && props.id>1 && <div className="message">{won[2]} has Won!!!!</div>}

            <div className="board">
                {props.board.map((items,index)=>{ return <Box  index={index}  func={send} value={props.board[index]} player={props.id} won={won[0]} turn={props.turn}/>
                })}
            </div>
            {won[0] && props.id<2 && <button onClick={restartGame} className="restart">Play again</button>}
            <Leaderboard leaderboard={props.leaderboard} username={props.username}/>
        </div>
    )
}
const Box=(props)=>{
    const values=["X","O"]
    const change=()=>{
        //players can only go if no one has won yet
        if (!props.won){
            if(props.turn===props.player){
                if (props.value==="_"){
                    if (props.player<=1){
                        props.func(props.index,values[props.player])
                        props.func(props.index,values[props.player])

                    }
                }
           }
        }
    }
    return <div className="box" onClick={change} >{props.value}</div>

}
      

