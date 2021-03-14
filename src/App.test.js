import { render, screen,fireEvent } from "@testing-library/react";
import App from "./App";
import {Leaderboard} from "./Components/Leaderboard"
import {Board} from "./Components/Board"
import {Signin} from "./Components/Signin"
import io from "socket.io-client";
const socket = io();

test('Test leaderboard', () => {
  render(<Leaderboard username='' leaderboard={[{"username":"john","score":100}]}/>);
  
  const ShowLeaderboard = screen.getByText('Show Leaderboard');
  expect(ShowLeaderboard).toBeInTheDocument();
  fireEvent.click(ShowLeaderboard)
  const user = screen.getByText("john")
  expect(user).toBeInTheDocument()
});

test("Test Signin",()=>{
    render(<Signin/>);
    const Submit=screen.getByText("Submit");
    const option=screen.getByText("login");
    const HelloUser=screen.getByText("Hello User")
    expect(Submit).toBeInTheDocument()
    expect(option).toBeInTheDocument() 
    
});
test("Test Board",()=>{
    render(<Board board={["_","_","_","_","_","_","_","_","_"]} socket={socket}/>)
    const board_value=screen.getAllByText("_");
    expect(board_value.length).toBe(9);
    
    const restartButton=screen.queryByText("Play again");
    expect(restartButton).not.toBeInTheDocument()
})
