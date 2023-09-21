# Treehole

## 本地部署

#### 前端代理

前端使用vscode的live server代理，在vscode上下载插件后，在 login.html 上点击右键，找到open with live server 打开本地代理。

#### 后端代理

1. `cd backend && pip install -r requirements.txt`
2. 复制 `.example.env` 到 `.env` 文件，并填写相应部分：

```
MONGO_URI=mongodb 的连接 URL，可以使用 Mongodb Altas DBAAS 服务
MONGO_DB=mongodb 中使用的数据库名
JWT_TOKEN=JWT所使用的TOKEN，请设置为某一随机字符串
FLASK_PORT=后端端口号 （默认为5055，修改时需要修改js/interface.js的base_url）
ORIGIN=前端地址，live server 默认为5500端口，如果修改live server端口需要修改。
```

3. 运行`python3 run.py`

## 功能解析

本网站实现了类似于P大树洞(https://treehole.pku.edu.cn)的功能。主要包括登录、发帖、回帖、收藏、搜索。后端使用 Python + Flask + JWT + Mongodb 构建。前端使用 jQuery+Axios 构建。

### 后端技术简介

后端开发的基本原则是快速和简单。后端全部位于文件夹`backend`下，`run.py`为主程序，`.example.env`为`.env`示例，`example.ipynb`为供前端开发参考的代码示例（Python），`requirements.txt`为依赖库，`readme.md`包括了 API 的一些说明。

1. 主要是使用 Flask 框架，在 Python 环境中快速构建了一套 API，通过不同 `methods` 表征不同操作，结果均返回为 JSON 格式，保证返回结果清晰、简单。
2. 数据库方面，使用了非关系数据库 Mongodb，将用户和帖子分别记录在两个表中，得益于 Mongodb 类似 JSON 的存储方式，我将所有评论一并记录在帖子文档下，方便查询调用，利用 Mongodb Compass GUI，我们还可以实现简单的后台管理功能，包括删帖、删号、控评等。
3. 搜索方面，使用 Mongodb 自带的正则匹配功能，此方案虽然效率可能比不上全文检索，但对中文的支持性较好且无需额外配置，在不加搜索词情况下，搜索接口可以当成获取最新树洞接口使用，此外，还增加了分页、数量限制功能，可以给定 `last_id`，只返回此 id 以前的帖子。
4. 权限认证方面，使用 JSON WEB TOKEN 进行认证，认证 token 使用 cookie 进行存储，这套方案轻量、方便、快捷，适用范围广，且后端无需存储会话信息。
5. 此外，关于同源策略，由于是开发环境，我直接使用`flask-cors`允许前端进行访问，并设置 JWT Cookie 支持跨域，在生产环境中，可能需要进一步优化安全性。
