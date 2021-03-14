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
        self.success_test=[
            #registering new user
            {
                Login_Option:Login_Option1,
                "name" :"user1",
                "id": 0,
                "exist":False
                
            },
            #registering an existing user
            {
                Login_Option:Login_Option1,
                "name" :"user1",
                "id": 0,
                "exist":True
                
            },
            #login in existing user
            {
                Login_Option:Login_Option2,
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
        ]
        inital_person= db.Person(username="inital_person", score=100)
        self.initial_db = [inital_person]
        
        
    def mocked_db_add(self,data):
        entry= db.Person(username=data["name"],score=100)
        if entry not in self.initial_db:
            self.initial_db.append(db.Person(username=data["name"],score=100))
            return len(self.initial_db)
        else:
            return -1
        
    def mocked_db_exist(self,data):
        print("name: ",data['name'])
        print("db: ",self.initial_db)
        entry= db.Person(username=data['name']) in self.initial_db
        return entry
    def test_success(self):
        for test in self.success_test:
            #test registering user
            if test["option"]==Login_Option1:
                with patch('app.db.insert',self.mocked_db_add):
                    expected_result=len(self.initial_db) + 1
                    actual_result=db.insert(test) 
                    #registering user that doesn't exist
                    if not test["exist"]:
                        self.assertEqual(actual_result,expected_result)
                    #registering user that does exist
                    else:
                        self.assertEqual(-1,actual_result)
            elif test["option"]==Login_Option2:
                with patch("app.db.exist", self.mocked_db_exist):
                    actual_result=db.exist(test)
                    if test["doesExist"]:
                        expected_result=True
                        self.assertEqual(True,actual_result)
                    else:
                        self.assertEqual(False,actual_result)
                        
            
    '''       WWW
    def test_failure(self):
        for test in self.failure_test_params:
            actual_result=test[KEY_INPUT]
            expected_result=test[KEY_EXPECTED]
            self.assertNotEqual(actual_result,expected_result)
    '''      
if __name__=='__main__':
    unittest.main()