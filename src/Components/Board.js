import "./board.css"
import { useState,useRef,useEffect  } from 'react'



export const Board=(props)=>{
    const [board,setBoard]=useState([["_","_","_",
                                    "_","_","_",
                                    "_","_","_"],false])

    useEffect(()=>{
        props.socket.on('play',(data)=>{
            console.log('Chat event received!');
            console.log(data)
            setBoard([data['data'],data['didWin']!="_"])
        });
        
    },[])
    
    function send(num,value){ 
        var item=[...board.slice(0,num),value,...board.slice(num+1)]
        props.socket.emit('play',item);
    }
    return(
        <div className="game" >
            <div className="board">
                {board[0].map((items,index)=>{ return <Box  index={index}  func={send} value={board[0][index]} player={props.id}/>
                })}
            </div>
            {board[1] && <button>Play again</button>}
        </div>
    )
}
const Box=(props)=>{
    const values=["X","O"]
    const change=()=>{
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
    return <div onClick={change} >{props.value}</div>

}
      

