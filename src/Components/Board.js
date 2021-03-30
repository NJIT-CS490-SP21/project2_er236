import './board.css';
import { useState, useEffect, React } from 'react';
import PropTypes from 'prop-types';
import  Leaderboard  from './Leaderboard';

export const Board = (props) => {
  const [won, hasWon] = useState([
    false, // [0] has someone won
    '', // [1] message for winner or loser
    '', // [2] message so spectators know who won
  ]);
  useEffect(() => {
    props.socket.on('restart', () => {
      hasWon([false, '', '']);
    });
    props.socket.on('play', (data) => {
      const values = ['X', 'O'];
      let message = '';
      let Spectator_Message = 'Message';
      if (data.Won !== '_') {
        if (data.Won === values[props.id]) {
          message = 'You have won!!';
          props.socket.emit('winner', { username: props.username });
        } else {
          message = 'You have lost!!!';
          props.socket.emit('loser', { username: props.username });
        }
        if (props.id === 0) {
          Spectator_Message = 'Player one has won';
        } else {
          Spectator_Message = 'Player two has won';
        }
        hasWon( [true, message, Spectator_Message]);
      }
    });
  });
  function send(num, value) {
    const item = [
      ...props.board.slice(0, num),
      value,
      ...props.board.slice(num + 1),
    ];
    props.socket.emit('play', { value, index: num, data: item });
  }
  function restartGame() {
    props.socket.emit('restart');
  }
  return (
    <div className="game">
      {props.id === 0 && <h1 className="player">Player One</h1>}
      {props.id === 1 && <h1 className="player">Player Two</h1>}
      {props.id > 1 && <h1 className="player">Spectator</h1>}

      {won[0] && props.id < 2 && <div className="message">{won[1]}</div>}
      {won[0] && props.id > 1 && (
        <div className="message">
          {won[2]}
          {' '}
          has Won!!!!
        </div>
      )}

      <div className="board">
        {props.board.map((items, index) => (
          <Box
            index={index}
            func={send}
            value={props.board[index]}
            player={props.id}
            won={won[0]}
            turn={props.turn}
          />
        ))}
      </div>
      {won[0] && props.id < 2 && (
        <button type="button" onClick={restartGame} className="restart">
          Play again
        </button>
      )}
      <Leaderboard leaderboard={props.leaderboard} username={props.username} />
    </div>
  );
};
Board.propTypes={
  username:PropTypes.string.isRequired,
  leaderboard: PropTypes.arrayOf(PropTypes.any).isRequired,
  id:PropTypes.number.isRequired,
  turn:PropTypes.number.isRequired,
  board: PropTypes.arrayOf(PropTypes.any).isRequired,
  socket:PropTypes.any.isRequired

  
  

}
const Box = (props) => {
  Box.propTypes={
    value:PropTypes.string.isRequired,
    player:PropTypes.number.isRequired,
    won:PropTypes.bool.isRequired,
    turn:PropTypes.number.isRequired,
    func:PropTypes.func.isRequired,
    index:PropTypes.number.isRequired
  }
  const values = ['X', 'O'];
  const change = () => {
    // players can only go if no one has won yet
    if (!props.won) {
      if (props.turn === props.player) {
        if (props.value === '_') {
          if (props.player <= 1) {
            props.func(props.index, values[props.player]);
          }
        }
      }
    }
  };
  return (
    <div role="button" className="box" onClick={change}>
      {props.value}
    </div>
  );
};

