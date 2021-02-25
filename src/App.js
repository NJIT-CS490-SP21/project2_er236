import logo from './logo.svg';
import './App.css';
import {Board} from './Components/Board.js'
import {Signin} from './Components/Signin.js'
import { useState,useEffect  } from 'react'
import axios from 'axios';



function App(props) {
  const [Logged,isLogged]=useState([false,""]);
  useEffect(()=>{
    props.socket.on("turn",(data)=>{
            isLogged([...Logged.slice(0,2),data])
        })
  },[])
  function Sign(e){
    e.preventDefault()
    var name=e.target[0].value
    var option=e.target[1].value
    axios.post("LoginorRegister", {"name":name,"option":option,'id':props.socket['id']}).then((req)=>{
      if (req['data']['code']===1){
        alert(req['data']['message'])
      }
      else{
        isLogged([true,name,req['data']['id']])
      }
    })
    
  }

  
  return (
    <div className="App">
      {!Logged[0]  && <Signin func={Sign} />}
      {Logged[0] && <Board  username={Logged[1]} socket={props.socket} id={Logged[2]}/>}
    </div>
  );
}

export default App;
