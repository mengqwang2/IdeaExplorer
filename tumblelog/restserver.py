from tumblelog import app
from flask.ext.restful import Api, Resource, reqparse, fields, marshal
import json
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from flask.ext.httpauth import HTTPBasicAuth
import logging
from flask import request, jsonify
import register,login,docList,docDetail,rate,comment

api = Api(app)
auth = HTTPBasicAuth()


class Utility:
    @staticmethod
    def generate_auth_token(user, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': user['Email']})
    
    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
            logging.warning('decoding')
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        id = data['id']
        return id


@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    if (not ('authorization' in request.headers)):
        logging.warning("nothing in token")
        return False
    username_or_token = request.headers['authorization']
    logging.warning("verifying: " + username_or_token)
    
    user = Utility.verify_auth_token(username_or_token)
    #if not user:
        # try to authenticate with username/password
    if not user:
        logging.warning('verification failed')
        return False
    logging.warning('verification succeeded')
    return True


class PasswordRecoveryAPI(Resource):

    def __init__(self):
        self.reqparse = reqparse.RequestParser() #Basic mail format has been checked
        self.reqparse.add_argument('Email', type=str, required=True,
                               help='Email required',
                               location='json')
    
        super(PasswordRecoveryAPI, self).__init__()

    

    def post(self):
        print "PasswordRecoveryAPI"
        args = self.reqparse.parse_args()
#check with the database
        success = True
        
        return {'success': success}, 201

class UserHabitAPI(Resource):

    def __init__(self):
        self.reqparse = reqparse.RequestParser() 
        self.reqparse.add_argument('Postid', type=int, required=True,
                               help='Id required',
                               location='json')
        self.reqparse.add_argument('Email', type=str, required=True,
                                   help='Email required',
                                   location='json')
        super(UserHabitAPI, self).__init__()
    

    def post(self):
        print "UserHabitAPI"
        args = self.reqparse.parse_args()
        logging.warning("Habit received")
        success = True
        
        return {'success': success}, 201


class IdeaAPI(Resource):
    decorators = [auth.login_required]
    def get(self, email):
        print "IdeaAPI"
        dl=docList.DocList(email)
        kwList=dl.getKeywords()
        dlist=dl.doRetrieveDoc(kwList)
        data=list()
        ideasDict={}
        for d in dlist:
            rateObj=rate.Rate(d,'0')
            rt=rateObj.rateGet()
            d_detail=dict()
            d_detail["id"]=d
            dd=docDetail.DocDetail(d)
            d_detail["title"]=dd.getTitle()
            d_detail["description"]=dd.getDescription()
            d_detail["tags"]=" "
            d_detail["rating"]=rt
            data.append(d_detail)

        ideasDict["Ideas"]=data
        return ideasDict


class DetailAPI(Resource):
    decorators = [auth.login_required]
    def get(self, postid):
        print "DetailAPI"
        dd=docDetail.DocDetail(postid)
        rateObj=rate.Rate(postid,'0')
        rt=rateObj.rateGet()
        data=dict()
        data["title"]=dd.getTitle()
        data["description"]=dd.getDescription()
        data["innovators"]=dd.getInnovator()
        data["submit_date"]=dd.getUpdatedDate()
        data["rtc"]=dd.getRelevance()
        data["pps"]=dd.getProbSolved()
        data["success_benefit"]=dd.getSuccessBenefit()
        data["rating"]=rt

        return data

class QueryAPI(Resource):
    decorators = [auth.login_required]

    def __init__(self):
        self.reqparse = reqparse.RequestParser()

        super(QueryAPI, self).__init__()


    def get(self, queries):
        print "QueryAPI"
        kwList=queries.split("&")
        email=" "
        dl=docList.DocList(email)
        dlist=dl.doRetrieveDoc(kwList)
        data=list()
        ideasDict={}
        for d in dlist:
            rateObj=rate.Rate('0',d)
            rt=rateObj.rateGet()
            d_detail=dict()
            d_detail["id"]=d
            dd=docDetail.DocDetail(d)
            d_detail["title"]=dd.getTitle()
            d_detail["description"]=dd.getDescription()
            d_detail["tags"]=" "
            d_detail["rating"]=rt
            data.append(d_detail)

        ideasDict["Ideas"]=data
        return ideasDict


class RatingPostAPI(Resource):
    decorators = [auth.login_required]
    
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('Email', type=str, required=True,
                                   help='Email required',
                                   location='json')
        self.reqparse.add_argument('Rating', type=int, required=True,
                                   help='Rating required',
                                   location='json')
        self.reqparse.add_argument('PostID', type=int, required=True,
                                   help='PostID required',
                                   location='json')

        super(RatingPostAPI, self).__init__()

    def post(self):
        args = self.reqparse.parse_args()

        email=args["Email"]
        rating=args["Rating"]
        docid=args["PostID"]

        rateObj=rate.Rate(docid,email)
        msg=rateObj.ratePost(rating)

        if(msg=="Rate successfully!"):
            return 201
        return 203

#average and individual rating
class RatingGetAPI(Resource):
    decorators = [auth.login_required]
    def get(self, postid, email): #0 email means getting average rating
        rateObj=rate.Rate(postid,email)
        rt=rateObj.rateGet()
        return {'rating': rt};

class CommentAPI(Resource):

    #decorators = [auth.login_required]
    
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('Email', type=str, required=True,
                                   help='Email required',
                                   location='json')
        self.reqparse.add_argument('PostID', type=int, required=True,
                                   help='PostID required',
                                   location='json')
        self.reqparse.add_argument('Content', type=str, required=True,
                                   help='Password required',
                                   location='json')

        super(CommentAPI, self).__init__()

    def get(self,postid):
        comObj=comment.Comment(postid)
        comList=comObj.get()
        return {'Comment': comList}

    def post(self):
        args = self.reqparse.parse_args()
        email=args["Email"]
        content=args["Content"]
        docid=args["PostID"]

        try:
            comObj=comment.Comment(docid)
            msg=comObj.commentPost(content,email)
            if (msg=="Comment successfully!"):
                return 201
            return 203
        except:
            return 203
        

class UserRegAPI(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('UserID', type=str, required=True,
                                   help='UserID required',
                                   location='json')
        self.reqparse.add_argument('Username', type=str, required=True,
                                   help='Username required',
                                   location='json')
        self.reqparse.add_argument('Password', type=str, required=True,
                                   help='Password required',
                                   location='json')
        self.reqparse.add_argument('Email', type=str, required=True,
                       help='Email required',
                       location='json')
        super(UserRegAPI, self).__init__()

    def post(self):
        print "UserRegAPI"
        args = self.reqparse.parse_args()
        logging.warning(args)
        reg=register.Register(args['Username'],args['UserID'],args['Email'],args['Password'])
        msg=reg.doRegister()
        if (msg=="Register successfully!"):
            return {"state": msg},201
        return {"state":msg},203
        

class UserAuthAPI(Resource):


    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('Email', type=str, required=True,
                                   help='Email required',
                                   location='json')
        self.reqparse.add_argument('Password', type=str, required=True,
                                   help='Password required',
                                   location='json')
        super(UserAuthAPI, self).__init__()



    def post(self):
        print "UserAuthAPI"
        args = self.reqparse.parse_args()
        l=login.Login(args['Email'],args['Password'])
        msg=l.doLogin()
        if (msg=="Login successfully"):
            logging.warning("Login successfully")
            currentID = Utility.generate_auth_token(args)
            currentID = currentID.decode('ascii')
            return {'Token':currentID, "state":msg}, 201
        else:
            logging.warning("Login failed")
            return {"state":msg},203
        
        


api.add_resource(IdeaAPI, '/api/ideas/<string:email>')
api.add_resource(UserAuthAPI, '/api/login')
api.add_resource(PasswordRecoveryAPI, '/api/login/forget')
api.add_resource(QueryAPI, '/api/ideas/query=<string:queries>')
api.add_resource(UserRegAPI, '/api/reg')
api.add_resource(CommentAPI, '/api/ideas/comment/<int:postid>')
api.add_resource(RatingPostAPI, '/api/ideas/rating')
api.add_resource(RatingGetAPI, '/api/ideas/rating/<int:postid>/<string:email>')
api.add_resource(UserHabitAPI, '/api/user/habit')
api.add_resource(DetailAPI, '/api/ideas/details/<int:postid>')