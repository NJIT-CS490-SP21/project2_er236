import os
from flask import Flask, send_from_directory,json,session,json,request
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from models import db

load_dotenv()

app = Flask(__name__, static_folder='./build/static')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SQLALCHEMY_DATABASE_URI']=os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICSTIONS']= False

cors = CORS(app, resources={r"/*": {"origins": "*"}})

db = db(app)


clients=[]

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=True,
    monitor_clients=True
)

@app.route("/LoginorRegister",methods=["GET","POST"])
def login():
    data=json.loads(request.data.decode())
    if data["option"]=="register":
        try:
            db.insert(data["name"])
            leaderboard()
            return ({
                  "code":0,
                  "message":"Successfully registerd user",
                  "id":clients.index(data['id'])
              })
        except Exception as error:
              return ({
                  "code":1,
                  "message":str(error.orig) + " for parameters" + str(error.params)
              })
    elif data["option"]=="login":
        res=db.exist(data['name'])
        if not res:
            return(
                {
                    "code":1,
                    "message":"User doesn't exist"
                }
            )
        else:
            return ({
                  "code":0,
                  "message":"Successfully logged in",
                  "id":clients.index(data['id'])
              })
@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

@socketio.on('connect')
def on_connect():
    print('User connected!')
    if len(clients)==1 and clients[0]=="":
        clients[0]=request.sid
    elif request.sid not in clients:
        clients.append(request.sid)
    print("player number: ",len(clients))
    
# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')
    remove=clients.index(request.sid)
    if len(clients)>2 and remove==0:
        clients[0]=clients[2]
        del clients[2]
        socketio.emit("id",0,room=clients[0])
        for i in range(2,len(clients)):
            socketio.emit("id",i,room=clients[i])
    else:
        del clients[remove]
        for i in range(remove,len(clients)):
            socketio.emit("id",i,room=clients[i])
remove=0
@socketio.on("id")
def getid():
    for i in range(len(clients)):
        socketio.emit("id",i,room=clients[i])
def checkWon(data):
    winner="_"
    values=["X","O"]
    # row1
    if data[0]==data[1]==data[2] and data[0] in values:
        winner=data[0]
    #row2
    elif data[3]==data[4]==data[5] and data[3] in values:
        winner=data[3]
    #row3
    elif data[6]==data[7]==data[8] and data[6] in values:
        winner=data[6]
    #column1
    elif data[0]==data[3]==data[6] and data[0] in values:
        winner=data[0]
    #column2
    elif data[1]==data[4]==data[7] and data[1] in values:
        winner=data[1]
    #column3
    elif data[2]==data[5]==data[8] and data[2] in values:
        winner=data[2]
    #forward diagonal /
    elif data[2]==data[4]==data[6] and data[2] in values:
        winner=data[2]
    #backward diagonal
    elif data[0]==data[4]==data[8] and data[0] in values:
        winner=data[0]
    return winner
board=["_","_","_","_","_","_","_","_","_"]
turn=0 
@socketio.on("getTurn")
def getturn():
    socketio.emit("getTurn",turn,broadcast=True,include_self=True)
    print("Turn: ",turn)

    
@socketio.on("getboard")
def getboard():
    global board
    socketio.emit("getboard",{"data":board},broadcast=True,include_self=True)
@socketio.on('play')
def on_play(data): # data is whatever arg you pass in your emit call on client
    global turn,board,last_request
    turn =(turn+1)%2
    board[data["index"]]=data["value"]
    didWin=checkWon(board)
    getboard()
    getturn()
    socketio.emit('play',  {"Won":didWin,"turn":turn}, broadcast=True, include_self=True)

@socketio.on("restart")
def restart():
    global turn,board
    board=["_","_","_","_","_","_","_","_","_"]
    turn=0
    socketio.emit('restart',  {"turn":turn,"board":board}, broadcast=True, include_self=True)
@socketio.on("leaderboard")
def leaderboard():
    socketio.emit("leaderboard",db.query(),broadcast=True,include_self=True)
@socketio.on("loser")
def loser(data):
    user=db.Person.query.filter_by(username=data['username']).first()
    user.score-=1
    db.db.session.commit()
    leaderboard()
@socketio.on("winner")
def winner(data):
    user=db.Person.query.filter_by(username=data['username']).first()
    user.score+=1
    db.db.session.commit()
    leaderboard()
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)