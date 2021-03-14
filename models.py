''' SQLAlchemy model'''

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc


class Db:
    def __init__(self, app):
        self.Db = SQLAlchemy(app)

        class Person(self.Db.Model):
            id = self.Db.Column(self.Db.Integer, primary_key=True)
            username = self.Db.Column(self.Db.String(80),
                                      unique=True,
                                      nullable=False)
            score = self.Db.Column(self.Db.Integer,
                                   unique=False,
                                   nullable=False)

            def __repr__(self):
                return '<Person username=' + str(
                    self.username) + '  score=' + str(self.score) + ' >'

            def __eq__(self, other):
                return self.username == other.username

        self.Person = Person
        self.Db.create_all()

    def insert(self, name):
        entry = self.Person(username=name, score=100)
        self.Db.session.add(entry)
        self.Db.session.commit()
        print(entry, " was added to database")

    def exist(self, name):
        return self.Db.session.query(
            self.Person.username).filter_by(username=name).first() is not None

    def query(self):
        que = self.Person.query.order_by(desc(self.Person.score)).all()
        return {
            i: {
                "username": que[i].username,
                "score": que[i].score
            }
            for i in range(len(que))
        }
