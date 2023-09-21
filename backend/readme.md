## 部署

1. `pip install -r requirements.txt`
2. 复制`.example.env`到`.env`并填写。
3. 运行`run.py`，程序将运行在`5055`端口

`example.html` 及 `example.ipynb` 仅供参考，以下面文档为准

## API文档

1. 用户注册

URL: `/api/register`

请求方法: `POST`

请求参数:

```
{
    "username": "string", // 用户名，必填
    "password": "string"  // 密码，必填
}
``` 

响应结果:

```
{
    "data": null,
    "message": "User created successfully"
}
``` 

2. 用户登录

URL: `/api/login`

请求方法: `POST`

请求参数:

```
{
    "username": "string", // 用户名，必填
    "password": "string"  // 密码，必填
}
``` 

响应结果:

```
{
    "data": null,
    "message": "Logged in successfully"
}
``` 

3. 获取 post 列表/检索 post

URL: `/api/posts`

请求方法: `GET`

请求参数:

```
{
    "query": "string", // 搜索关键词，选填
    "last_id": number     // 只检索比此 ID 更小的 post (不包含此 ID)，选填
}
``` 

响应结果:

```
{
    "data": {
        "have_next": boolean, // 是否还有下一页
        "posts": [{ //默认每页 20 条
            "_id": number,
            "comments": [],       // 评论列表
            "content": "string",  // 内容
            "favorated": boolean, // 当前用户是否已收藏该 post
            "publish_time": "string", // 发布时间
            "title": "string",    // 标题
            "user": number        // 发布用户的 ID
        }]
    },
    "message": "Posts retrieved successfully"
}
``` 

4. 获取单一 post

URL: `/api/posts/{post_id}`

请求方法: `GET`

路径参数:

```
{
    "post_id": number // post 的 ID，必填
}
``` 

响应结果:

```
{
    "data": {
        "_id": number,
        "comments": [],       // 评论列表
        "content": "string",  // 内容
        "favorated": boolean, // 当前用户是否已收藏该 post
        "publish_time": "string", // 发布时间
        "title": "string",    // 标题
        "user": number        // 发布用户的 ID
    },
    "message": "Post retrieved successfully"
}
``` 

5. 发表 post

URL: `/api/posts`

请求方法: `POST`

请求参数:

```
{
    "title": "string",   // 标题，必填
    "content": "string"  // 内容，必填
}
``` 

响应结果:

```
{
    "message": "Post added successfully"
}
``` 

6. 发表评论

URL: `/api/posts/{post_id}/comments`

请求方法: `POST`

路径参数:

```
{
    "post_id": number // post 的 ID，必填
}
``` 

请求参数:

```
{
    "content": "string" // 评论内容，必填
}
``` 

响应结果:

```
{
    "message": "Comment added successfully"
}
``` 

7. 获取用户 post

URL: `/api/user/posts`

请求方法: `GET`

响应结果:

```
{
    "data": [{
        "_id": number,
        "comments": [],       // 评论列表
        "content": "string",  // 内容
        "favorated": boolean, // 当前用户是否已收藏该 post
        "publish_time": "string", // 发布时间
        "title": "string",    // 标题
        "user": number        // 发布用户的 ID
    }],
    "message": "User posts retrieved successfully"
}
``` 

8. 获取收藏列表

URL: `/api/user/favorates`

请求方法: `GET`

响应结果:

```
{
    "data": [{
        "_id": number,
        "comments": [],       // 评论列表
        "content": "string",  // 内容
        "favorated": boolean, // 当前用户是否已收藏该 post
        "publish_time": "string", // 发布时间
        "title": "string",    // 标题
        "user": number        // 发布用户的 ID
    }],
    "message": "User favorate posts retrieved successfully"
}
``` 

9. 收藏/取消收藏

URL: `/api/posts/{post_id}/favorate`

请求方法: `POST`

路径参数:

```
{
    "post_id": number // post 的 ID，必填
}
``` 

响应结果:

```
{
    "data": null,
    "message": "Post favorated successfully" // 或者 "Post unfavorated successfully"
}```
