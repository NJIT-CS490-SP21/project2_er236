import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath("./"))


from app import loginOrRegister,db

Login_KEY_INPUT="Input"
Login_Option="option"
Login_Option1="register"
Login_Option2="login"
clients=[0]
class LoginOrRegisterCheck(unittest.TestCase):
    def setUp(self):
        self.success_test=[
            {
                Login_Option:Login_Option1,
                "name" :"user1",
                "id": 0
            },
            {
                Login_Option:Login_Option2,
                "name" :"user2",
                "id": 0
            }
        ]
        inital_person= db.Person(username="inital_person", score=100)
        self.initial_db = [inital_person]
        
        
    def mocked_db_add(self,name):
        self.initial_db.append(db.Person(username=name,score=100))
        return len(self.initial_db)
        
        
    def test_success(self):
        for test in self.success_test:
            #test registering user
            if test["option"]=="register":
                with patch('app.db.insert',self.mocked_db_add):
                    expected_result=len(self.initial_db) + 1

                    actual_result=db.insert(test) 
                    self.assertEqual(actual_result+1,expected_result)
    '''       
    def test_failure(self):
        for test in self.failure_test_params:
            actual_result=test[KEY_INPUT]
            expected_result=test[KEY_EXPECTED]
            self.assertNotEqual(actual_result,expected_result)
    '''      
if __name__=='__main__':
    unittest.main()