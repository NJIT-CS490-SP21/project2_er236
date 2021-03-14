import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath("./"))


from app import loginOrRegister,db

Login_Option="option"
Login_Option1="register"
Login_Option2="login"
class LoginOrRegisterCheck(unittest.TestCase):
    def setUp(self):
        self.success_test={
            "register":[
                #registering new user
                {
                "name" :"user1",
                "id": 0,
                "exist":False
                
                },
                #registering an existing user
                {
                    "name" :"user1",
                    "id": 0,
                    "exist":True
                    
                }
            ],
            "login":[
                #login in existing user

                {
                    "name" :"user1",
                    "id": 0,
                    "doesExist":True
                },
                #login in not existing user
                {
                    Login_Option:Login_Option2,
                    "name" :"user2",
                    "id": 0,
                    "doesExist":False
                } 
            ],
            
            "winnerLose":[
                {
                    "name":"user1",
                    "didWin":True
                },
                {
                    "name":"inital_person",
                    "didWin":False
                }
                
                
            ]
        }
        inital_person= db.Person(username="inital_person", score=100)
        self.initial_db = [inital_person]
        
        
    def mocked_db_add(self,data):
        entry= db.Person(username=data["name"],score=100)
        if entry not in self.initial_db:
            self.initial_db.append(db.Person(username=data["name"],score=100))
            return len(self.initial_db)
        else:
            return -1
        
    def test_register(self):
        for test in self.success_test['register']:
            with patch('app.db.insert',self.mocked_db_add):
                #registering user that doesn't exist
                if not test["exist"]:
                    self.assertEqual(len(self.initial_db) + 1 , db.insert(test))
                #registering user that does exist
                else:
                    self.assertEqual(-1,db.insert(test))
                    
                    
    def mocked_db_exist(self,data):
        return  db.Person(username=data['name']) in self.initial_db
    def test_login(self):
        for test in self.success_test["login"]:
                with patch("app.db.exist", self.mocked_db_exist):
                    #login in existing user
                    if test["doesExist"]:
                        expected_result=True
                        self.assertEqual(True,db.exist(test))
                    #login in user that doesnt exist
                    else:
                        self.assertEqual(False,db.exist(test))
    def test_win(self):
        for test in self.success_test["winnerLose"]:
            if test["didWin"]:
                
                        
            
         
if __name__=='__main__':
    unittest.main()