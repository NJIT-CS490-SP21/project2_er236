import os
from flask import Flask, send_from_directory,json,session,json,request
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy


load_dotenv()

app = Flask(__name__, static_folder='./build/static')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SQLALCHEMY_DATABASE_URI']=os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICSTIONS']= False

cors = CORS(app, resources={r"/*": {"origins": "*"}})

db = SQLAlchemy(app)
class Person(db.Model):
            id = db.Column(db.Integer, primary_key=True)
            username = db.Column(db.String(80), unique=True, nullable=False)
            score = db.Column(db.Integer, unique=False, nullable=False)
            def __repr__(self):
                return '<Person %r>' % self.username
db.create_all()
clients=[]

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=True
)
@app.route("/LoginorRegister",methods=["GET","POST"])
def login():
    data=json.loads(request.data.decode())
    if data["option"]=="register":
        try:
            db.session.add(Person(username=data["name"],score=0))
            db.session.commit()
            return ({
                  "code":0,
                  "message":"Successfully registerd user"
              })
        except Exception as error:
              return ({
                  "code":1,
                  "message":str(error.orig) + " for parameters" + str(error.params)
              })
    elif data["option"]=="login":
        res=db.session.query(Person.username).filter_by(username=data['name']).first() is not None
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
                  "message":"Successfully logged in"
              })
    
    
    
    
    
@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)
rolenum=0

@socketio.on('connect')
def on_connect():
    global rolenum
    rolenum+=1
    print('User connected!')
    if request.sid not in clients:
        clients.append(request.sid)
    print("playernumber: ",rolenum)
    return ({"value":rolenum})
# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    global rolenum
    
    print('User disconnected!')
    print("player number: ",rolenum)
    print(request.sid)
    remove=clients.index(request.sid)
    print("exist: ",request.sid in clients)
    print("id: ",clients.index(request.sid))
    rolenum-=1
    

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('play')
def on_play(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    socketio.emit('play',  data, broadcast=True, include_self=False)

rolenum=0
@app.route("/role",methods=['GET'])
def getRole():
    return {"role":rolenum}
# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)