import os
from flask import Flask, send_from_directory,json,session,json
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
            score = db.Column(db.int, unique=True, nullable=False)
            def __repr__(self):
                return '<Person %r>' % self.username



socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)
@socketio.on('connect')
def on_connect():
    global rolenum
    rolenum+=1
    print('User connected!')
    print("playernumber: ",rolenum)
# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    global rolenum
    rolenum-=1
    print('User disconnected!')
    print("playernumber: ",rolenum)
    

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('play')
def on_play(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
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