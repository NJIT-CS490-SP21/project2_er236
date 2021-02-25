import "./board.css"
import { useState,useRef,useEffect  } from 'react'



export const Board=(props)=>{
    const [board,setBoard]=useState([["_","_","_",
                                    "_","_","_",
                                    "_","_","_"],false,"_"])
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
            setBoard([data['data'],data['Won']!="_",message])
        });
        
    },[])
    
    function send(num,value){ 
        var item=[...board[0].slice(0,num),value,...board[0].slice(num+1)]
        props.socket.emit('play',item);
    }
    console.log(board)
    return(
        <div className="game" >
            {board[2]!="_" && <div className="message">{board[2]}</div>}
            <div className="board">
                {board[0].map((items,index)=>{ return <Box  index={index}  func={send} value={board[0][index]} player={props.id} go={board[1]} />
                })}
            </div>
            {board[1] && <button>Play again</button>}
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
      

