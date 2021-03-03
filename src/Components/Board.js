import "./board.css"
import { useState,useEffect  } from 'react'



export const Board=(props)=>{
    //States values
    console.log("props.id: ",props.id)
    
    
    //[4] -> who's turn it is
    const [board,setBoard]=useState([["_","_","_",
                                    "_","_","_",
                                    "_","_","_"],  //[0] ->array of box values board
                                    false,  //[1] ->bool representing if someone has won
                                    "_",    //[2] ->message for player 1 and 2 for when someone wins
                                    "",     //[3] -> value of winning player so spectators could see who won
                                    0,       //[4] ->who's turn it is
                                    ])
    useEffect(()=>{
        props.socket.on('play',(data)=>{

            const values=["X","O"];
            var message="_";
            if (data['Won']!="_" ){
                if (data['Won']===values[props.id]){
                    message="You have won!!"
                }
                else{
                    message="You have lost!!!"
                }
            }
            setBoard([data['data'],data['Won']!="_",message,data['Won'],data['turn']])
        });
        props.socket.on("restart",(data)=>{
            console.log("restart: ",data)
            setBoard([data['data'],false,"_","",0])
        })
        
    },[])
    console.log(board)
    console.log(props.id)
    function send(num,value){ 
        var item=[...board[0].slice(0,num),value,...board[0].slice(num+1)]
        props.socket.emit('play',item);
    }
    function restartGame(){
        props.socket.emit("restart")
    }
    const values={"X":"Player 1", "O":"Player 2"}
    console.log(board)
    return(
        <div className="game" >
            {board[1] && props.id<2 && <div className="message">{board[2]}</div>}
            {board[1] && props.id>1 && <div className="message">{values[board[3]]} has Won!!!!</div>}

            <div className="board">
                {board[0].map((items,index)=>{ return <Box  index={index}  func={send} value={board[0][index]} player={props.id} go={board[1]} turn={board[4]}/>
                })}
            </div>
            {board[1] && props.id<2 && <button onClick={restartGame}>Play again</button>}
        </div>
    )
}
const Box=(props)=>{
    const values=["X","O"]
    const change=()=>{
        //players can only go if no one has won yet
        if (!props.go){
            //players can only play if its their turn
            if(values[props.turn]==values[props.player]){
                if (props.value==="_"){
                    if (props.player<=1){
                        props.func(props.index,values[props.player])
                    }
                    else{
                        alert("Spectators cant play!!")
                    }
                }
            }
        }
    }
    return <div className="box" onClick={change} >{props.value}</div>

}
      

