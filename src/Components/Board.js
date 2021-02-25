import "./board.css"
import { useState,useRef,useEffect  } from 'react'



export const Board=(props)=>{
    const [board,setBoard]=useState(["_","_","_",
                                    "_","_","_",
                                    "_","_","_"])

    useEffect(()=>{
        props.socket.on('play',(data)=>{
            console.log('Chat event received!');
            console.log(data)
            setBoard(data['data'])
        });
        
    },[])
    
    function send(num,value){ 
        var item=[...board.slice(0,num),value,...board.slice(num+1)]
        props.socket.emit('play',item);
    }
    return(
        <div className="board">
            {board.map((items,index)=>{ return <Box  index={index}  func={send} value={board[index]} player={props.id}/>
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
            }
            else{
                alert("Spectators cant play!!")
                alert(props.player)
            }
        }
    }
    return <div onClick={change} >{props.value}</div>

}
      

