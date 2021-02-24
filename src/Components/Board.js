import "./board.css"
import { useState,useRef,useEffect  } from 'react'



export const Board=(props)=>{
    const [board,setBoard]=useState(["_","_","_","_","_","_","_","_","_"])
    const player=0;
    


    useEffect(()=>{
        props.socket.on('play',(data)=>{
            console.log('Chat event received!');
            console.log(data)
            setBoard(data)
        });
        props.socket.on("connect",(data)=>{
            console.log("turn",data)
        })
        
    },[])
    
    function send(num,value){ 
        var item=[...board.slice(0,num),value,...board.slice(num+1)]
        setBoard(item)
        props.socket.emit('play',item);
    }
    return(
        <div className="board">
            {board.map((items,index)=>{ return <Box  index={index}  func={send} value={board[index]} player={props.role}/>
            })}
        </div>
    )
}
const Box=(props)=>{
    const values=["X","O"]
    const change=()=>{
        if (props.value==="_"){
            if (props.player<=1){
                props.func(props.index,values[props.player])
                console.log(props.player)
            }
            else{
                alert("Spectators cant play!!")
            }
        }
    }
    return <div onClick={change} >{props.value}</div>

}
      

