import "./App.css";
import { Board } from "./Components/Board.js";
import { Signin } from "./Components/Signin.js";
import { useState, useEffect } from "react";
import axios from "axios";

function App(props) {
  const [Logged, isLogged] = useState([
    false, //[0] is player logged or not
    "", //[1] player username
    undefined, //[2] player id
    "", //[3] leaderboard data
    [], //[4] board state
    0, //[5] turn
  ]);
  useEffect(() => {
    props.socket.on("id", (data) => {
      isLogged((previousState) => [
        ...previousState.slice(0, 2),
        data,
        ...previousState.slice(3),
      ]);
    });
    props.socket.on("leaderboard", (data) => {
      isLogged((previousState) => [
        ...previousState.slice(0, 3),
        data,
        ...previousState.slice(4),
      ]);
    });
    props.socket.emit("leaderboard");
    props.socket.on("getboard", (data) => {
      isLogged((previousState) => [
        ...previousState.slice(0, 4),
        data["data"],
        ...previousState.slice(5),
      ]);
    });
    props.socket.emit("getboard");

    props.socket.on("restart", (data) => {
      isLogged((previousState) => [
        ...previousState.slice(0, 4),
        data["board"],
        data["turn"],
      ]);
    });
    props.socket.on("getTurn", (data) => {
      isLogged((previousState) => [...previousState.slice(0, 5), data]);
    });
    props.socket.emit("getTurn");
  }, );
  function Sign(e) {
    e.preventDefault();
    var name = e.target[0].value;
    var option = e.target[1].value;
    axios
      .post("LoginorRegister", {
        name: name,
        option: option,
        id: props.socket["id"],
      })
      .then((req) => {
        if (req["data"]["code"] === 1) {
          alert(req["data"]["message"]);
        } else {
          isLogged([true, name, req["data"]["id"], ...Logged.slice(3)]);
        }
      });
  }

  return (
    <div className="App">
      {!Logged[0] && <Signin func={Sign} />}
      {Logged[0] && (
        <Board
          username={Logged[1]}
          socket={props.socket}
          id={Logged[2]}
          leaderboard={Logged[3]}
          board={Logged[4]}
          turn={Logged[5]}
        />
      )}
    </div>
  );
}

export default App;
