import logo from './logo.svg';
import './App.css';
import {Board} from './Components/Board.js'
import {Signin} from './Components/Signin.js'
import { useState  } from 'react'
import axios from 'axios';



function App(props) {
  const [Logged,isLogged]=useState([false,""]);

  var role=0
  //gets player number
  axios.get('/role').then((res)=>{role = res['role']})
  function Sign(e){
    e.preventDefault()
    var name=e.target[0].value
    var option=e.target[1].value
    console.log(props.socket)
    axios.post("LoginorRegister", {"name":name,"option":option}).then((req)=>{
      console.log(req)
      if (req['data']['code']===1){
        alert(req['data']['message'])
      }
      else{
        console.log(req['data']['message'])
        isLogged([true,name])
      }
    })
    
  }

  
  return (
    <div className="App">
      {!Logged[0]  && <Signin func={Sign} />}
      {Logged[0] && <Board role={role}  username={Logged[1]} socket={props.socket}/>}
    </div>
  );
}

export default App;
