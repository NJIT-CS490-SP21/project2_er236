import "./board.css"
import { useState,useRef,useEffect  } from 'react'



export const Board=(props)=>{
    const [board,setBoard]=useState(["_","_","_","_","_","_","_","_","_"])
    const player=0;
    const inputref=useRef("null");
    const socket=props.socket


    useEffect(()=>{
        socket.on('play',(data)=>{
            console.log('Chat event received!');
            console.log(data)
            setBoard(data)
        });
    },[])
    
    function send(num,value){ 
        var item=[...board.slice(0,num),value,...board.slice(num+1)]
        setBoard(item)
        socket.emit('play',item);
    }
    return(
        <div className="board">
            {board.map((items,index)=>{ return <Box  index={index}  func={send} value={board[index]} player={1}/>
            })}
        </div>
    )
}
const Box=(props)=>{
    const values=["X","O"]
    const change=()=>{
        if (props.value==="_"){
            props.func(props.index,values[props.player])
        }
    }
    return <div onClick={change} >{props.value}</div>

}
      

