

export const Leaderboard=(props)=>{
    return <div className="leaderboard">
        <div className="notSelf">
            <div className="username" style={{fontSize:20,fontWeight: 'bold'}}>Username</div>
            <div className="score"style={{fontSize:20,fontWeight: 'bold'}}>Score</div>
        </div>
        {Object.keys(props.leaderboard).map((item)=>{
            var isSelf= props.username===props.leaderboard[item]["username"];
            return <div  className={isSelf ? "isSelf":"notSelf"}> 
                    <div className="username">{props.leaderboard[item]["username"]}</div>
                    <div className="score">{props.leaderboard[item]["score"]}</div>
                </div>
            })} 
    </div>
}