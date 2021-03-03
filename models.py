from flask_sqlalchemy import SQLAlchemy

class db:
    def __init__(self,app):
        self.db=SQLAlchemy(app)
        class Person(self.db.Model):
            id = self.db.Column(self.db.Integer, primary_key=True)
            username = self.db.Column(self.db.String(80), unique=True, nullable=False)
            score = self.db.Column(self.db.Integer, unique=False, nullable=False)
            def __repr__(self):
                return '<Person username='+self.username+'  score=' +str(self.score)+ ' >' 
        self.Person=Person
        self.db.create_all()
    def insert(self,name):
        entry=self.Person(username=name,score=0)
        self.db.session.add(entry)
        self.db.session.commit()
        print(entry ," was added to database")
    def exist(self,name):
        return self.db.session.query(self.Person.username).filter_by(username=name).first() is not None

  