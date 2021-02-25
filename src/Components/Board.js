import "./board.css"
import { useState,useEffect  } from 'react'



export const Board=(props)=>{
    const [board,setBoard]=useState([["_","_","_",
                                    "_","_","_",
                                    "_","_","_"],false,"_",""])
    useEffect(()=>{
        props.socket.on('play',(data)=>{
            console.log('Chat event received!');
            console.log(data);
            const values=["X","O"];
            var message="_";
            if (data['Won']!="_" && props.id<2){
                if (data['Won']===values[props.id]){
                    message="You have won!!"
                }
                else{
                    message="You have lost!!!"
                }
            }
            setBoard([data['data'],data['Won']!="_",message,data['Won']])
        });
        
    },[])
    
    function send(num,value){ 
        var item=[...board[0].slice(0,num),value,...board[0].slice(num+1)]
        props.socket.emit('play',item);
    }
    function restartGame(){
        
    }
    const values={"X":"Player 1", "O":"Player 2"}
    console.log("Props.id",props.id)
    console.log(board)
    console.log("values",values)

    return(
        <div className="game" >
            {board[1]!="_" && props.id<2 && <div className="message">{board[2]}</div>}
            {board[1]!="_" && props.id>1 && <div className="message">{values[board[3]]} has Won!!!!</div>}

            <div className="board">
                {board[0].map((items,index)=>{ return <Box  index={index}  func={send} value={board[0][index]} player={props.id} go={board[1]} />
                })}
            </div>
            {board[1] && props.id<2 && <button onClick={restartGame}>Play again</button>}
        </div>
    )
}
const Box=(props)=>{
    const values=["X","O"]
    const change=()=>{
        if (!props.go){
            if (props.value==="_"){
                if (props.player<=1){
                    props.func(props.index,values[props.player])
                }
                else{
                    alert("Spectators cant play!!")
                    alert(props.player)
                }
            }
        }
    }
    return <div onClick={change} >{props.value}</div>

}
      

