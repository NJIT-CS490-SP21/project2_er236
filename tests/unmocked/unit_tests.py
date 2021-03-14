import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath("./"))


from app import add_client,clients,remove_client

class app(unittest.TestCase):
    def setUp(self):
        self.success_test={
            "connect":[
                #new socket connects
                {
                    "sid":"3ihsmcbksjojw",
                    "exist":False
                },
                #same socket tried to connect a second time
                {
                    "sid":"3ihsmcbksjojw",
                    "exist":True
                },

            ],
            "disconnect":[
                #Spectator takes over player 1

                {
                    "remove": "3ihsmcbksjojw",
                    "newPlayer":"Mario2brothers",
                    "newId":0
                },
                #player takes over player 2
                {
                    "remove":"3ihsmcbksjojoooo",
                    "newPlayer":"Fire_Dragon_God_Slayer",
                    "newId":1
                } 
            ]
        }
    def test_connect(self):
        for test in self.success_test["connect"]:
            if test["exist"]:
                expected_value=len(clients)
            else:
                expected_value=len(clients)+1
            add_client(test["sid"])
            actual_value=len(clients)
            self.assertEqual(expected_value,actual_value)
            
    def test_disconnect(self):
        global clients
        clients+= ["3ihsmcbksjojoooo","Mario2brothers","Fire_Dragon_God_Slayer"]

        for test in self.success_test["disconnect"]:
            remove_client(test["remove"])
            self.assertAlmostEqual(clients.index(test["newPlayer"]),test["newId"])




if __name__=='__main__':
    unittest.main()
    print("here")