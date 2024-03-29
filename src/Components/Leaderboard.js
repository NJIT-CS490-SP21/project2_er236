import { useState, React } from 'react';
import PropTypes from 'prop-types';

const Leaderboard = (props) => {
  const [viewLeaderboard, setActive] = useState(false);
  function showleaderboard() {
    setActive(!viewLeaderboard);
  }
  return (
    <div className="leaderboard">
      <button type="button" onClick={showleaderboard}>Show Leaderboard</button>
      {viewLeaderboard && (
        <div className="notSelf">
          <div
            className="username"
            style={{ fontSize: 20, fontWeight: 'bold' }}
          >
            Username
          </div>
          <div className="score" style={{ fontSize: 20, fontWeight: 'bold' }}>
            Score
          </div>
        </div>
      )}
      {viewLeaderboard
        &&  [...Object.values(props.leaderboard)].map((item) => {
          const isSelf = props.username === props.leaderboard[item].username;
          return (
            <div className={isSelf ? 'isSelf' : 'notSelf'}>
              <div className="username">
                {props.leaderboard[item].username}
              </div>
              <div className="score">{props.leaderboard[item].score}</div>
            </div>
          );
        })}
    </div>
  );
};
Leaderboard.propTypes={
     leaderboard:PropTypes.arrayOf(PropTypes.any).isRequired,
     username:PropTypes.string.isRequired,
     score:PropTypes.number.isRequired
}
export default Leaderboard;