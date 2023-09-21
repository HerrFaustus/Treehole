from flask import Flask, request, jsonify, make_response
from functools import wraps
import pymongo
import datetime
import json
import jwt
import os
from dotenv import load_dotenv


load_dotenv()
from flask_cors import CORS

app = Flask(__name__)

origin=os.environ.get('ORIGIN')
CORS(app, supports_credentials=True,origins=origin)



mongo_uri = os.environ.get("MONGO_URI")
mongo_db = os.environ.get("MONGO_DB")
jwt_token = os.environ.get('JWT_TOKEN')
flask_port = int(os.environ.get('FLASK_PORT', 5000))


client = pymongo.MongoClient(mongo_uri)
db = client[mongo_db]
user_col = db['user']
post_col = db['post']


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('jwt_token')
        if not token:
            return jsonify({'message': 'Unauthorized access', 'data': None}), 401
        try:
            payload = jwt.decode(token, jwt_token, algorithms=["HS256"])
            user_id = payload['sub']
            kwargs['user_id'] = user_id
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token is expired', 'data': None}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token', 'data': None}), 401
        return f(*args, **kwargs)
    return decorated

# 注册
@app.route('/api/register', methods=['POST'])
def register():
    data = json.loads(request.data)
    if not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing id or password', 'data': None}), 400
    user = user_col.find_one({'username': data['username']})
    if user:
        return jsonify({'message': 'User already exists', 'data': None}), 400
    user_id = user_col.count_documents({})+1
    user = {'_id': user_id, 'username': data['username'], 'password': data['password'], 'favorates': []}
    user_col.insert_one(user)
    return jsonify({'message': 'User created successfully', 'data': None}), 201

# 登录
@app.route('/api/login', methods=['POST'])
def login():
    data = json.loads(request.data)
    user = user_col.find_one({'username': data['username']})
    if not user or user['password'] != data['password']:
        return jsonify({'message': 'Invalid credentials', 'data': None}), 401
    payload = {'sub': user['_id'], 'iat': datetime.datetime.utcnow()}
    token = jwt.encode(payload, jwt_token, algorithm='HS256')
    response = make_response(jsonify({'message': 'Logged in successfully', 'data': None}))
    response.set_cookie('jwt_token', token, httponly=True,samesite="None",secure=True)
    return response, 200

# 获取post列表/检索post
@app.route('/api/posts', methods=['GET'])
@require_auth
def get_posts(user_id):
    posts = []
    query = request.args.get('query', default='', type=str)
    last_id = request.args.get('last_id', default=999999999999999, type=int)
    query = {'$or': [{'title': {'$regex': f'.*{query}.*'}}, {'content': {'$regex': f'.*{query}.*'}}],'_id':{'$lt':last_id}}
    per_page = 20
    total_count = post_col.count_documents(query)
    # total_page = (total_count + per_page - 1) // per_page
    # have_next = page<total_page
    have_next = total_count>20
    for post in post_col.find(query)\
        .sort('publish_time', pymongo.DESCENDING).limit(per_page):
        post['favorats'] = len(post['favorated'])
        post['favorated'] = user_id in post['favorated']
        
        posts.append(post)
    return jsonify({'message': 'Posts retrieved successfully', 'data': {"posts":posts,'have_next':have_next}}), 200


# 获取单一post
@app.route('/api/posts/<int:post_id>', methods=['GET'])
@require_auth
def get_post_details(user_id, post_id):
    post = post_col.find_one({'_id': post_id})
    if not post:
        return jsonify({'message': 'Post not found', 'data': None}), 404
    post['favorated'] = user_id in post['favorated']
    return jsonify({'message': 'Post retrieved successfully', 'data': post}), 200


# 发表 post
@app.route('/api/posts', methods=['POST'])
@require_auth
def add_post(user_id):
    title = request.json.get('title')
    content = request.json.get('content')
    if (title is None) or (content is None):
        return jsonify({'message': 'Post title and content are required'}), 400
    publish_time = datetime.datetime.now()
    post_id = post_col.count_documents({})+1
    db.post.insert_one({'_id':post_id,'user': user_id, 'title': title, 'content': content, 'publish_time': publish_time, 'comments': [],'favorated':[]})
    return jsonify({'message': 'Post added successfully'}), 200

# 发表评论
@app.route('/api/posts/<int:post_id>/comments', methods=['POST'])
@require_auth
def add_comment(user_id,post_id):
    content = request.json.get('content')
    if content is None:
        return jsonify({'message': 'Comment content is missing'}), 400
    publish_time = datetime.datetime.now()
    db.post.update_one({'_id': post_id}, {'$push': {'comments': {'user': user_id, 'content': content,'publish_time':publish_time}}})
    return jsonify({'message': 'Comment added successfully'}), 200

# 获取用户post
@app.route('/api/user/posts', methods=['GET'])
@require_auth
def get_user_posts( user_id):
    posts = []
    for post in post_col.find({'user': user_id}).sort('publish_time', pymongo.DESCENDING):
        post['favorated'] = user_id in post['favorated']
        posts.append(post)
    return jsonify({'message': 'User posts retrieved successfully', 'data': posts}), 200

# 获取收藏列表
@app.route('/api/user/favorates', methods=['GET'])
@require_auth
def get_user_favorites(user_id):
    user = user_col.find_one({'_id': user_id})
    favorate_posts = []
    for post_id in user['favorates']:
        post = post_col.find_one({'_id': post_id})
        if post:
            # 必定为True
            post['favorated'] = True
            favorate_posts.append(post)
    return jsonify({'message': 'User favorate posts retrieved successfully', 'data': favorate_posts}), 200

# 收藏/取消收藏
@app.route('/api/posts/<int:post_id>/favorate', methods=['POST'])
@require_auth
def favorate_post(user_id, post_id):
    post = post_col.find_one({'_id': post_id})
    if not post:
        return jsonify({'message': 'Post not found', 'data': None}), 404
    if user_id in post['favorated']:
        post_col.update_one({'_id': post_id}, {'$pull': {'favorated': user_id}})
        user_col.update_one({'_id': user_id}, {'$pull': {'favorates': post_id}})
        return jsonify({'message': 'Post unfavorated successfully', 'data': None}), 400
    post_col.update_one({'_id': post_id}, {'$push': {'favorated': user_id}})
    user_col.update_one({'_id': user_id}, {'$push': {'favorates': post_id}})
    return jsonify({'message': 'Post favorated successfully', 'data': None}), 200



if __name__ == '__main__':
    app.run(port=flask_port,debug=True)
