import logo from './logo.svg';
import './App.css';
import {Board} from './Components/Board.js'
import {Signin} from './Components/Signin.js'

import { useState  } from 'react'
import axios from 'axios';

import io from 'socket.io-client';
const socket = io();

function App() {
  const [Logged,isLogged]=useState(false);

  var role=0
  axios.get('/role').then((res)=>{role = res['role']})
  function Sign(e){
    e.preventDefault()
    var name=e.target[0].value
    console.log(name)
  }

  
  return (
    <div className="App">
      {!Logged  && <Signin func={Sign} />}

      {Logged && <Board role={role} socket={socket}/>}
    </div>
  );
}

export default App;
