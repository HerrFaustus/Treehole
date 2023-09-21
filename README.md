# 2023JSFinalWork

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

本网站实现了类似于P大树洞的功能。主要包括登录、发帖、回帖、收藏、搜索。后端使用 Python + Flask + JWT + Mongodb 构建。前端使用 jQuery+Axios 构建。

以下为各部分分工介绍

### 后端 BY 鄢维 2000011366

后端开发的基本原则是快速和简单。后端全部位于文件夹`backend`下，`run.py`为主程序，`.example.env`为`.env`示例，`example.ipynb`为供前端开发参考的代码示例（Python），`requirements.txt`为依赖库，`readme.md`包括了 API 的一些说明。

1. 主要是使用 Flask 框架，在 Python 环境中快速构建了一套 API，通过不同 `methods` 表征不同操作，结果均返回为 JSON 格式，保证返回结果清晰、简单。
2. 数据库方面，使用了非关系数据库 Mongodb，将用户和帖子分别记录在两个表中，得益于 Mongodb 类似 JSON 的存储方式，我将所有评论一并记录在帖子文档下，方便查询调用，利用 Mongodb Compass GUI，我们还可以实现简单的后台管理功能，包括删帖、删号、控评等。
3. 搜索方面，使用 Mongodb 自带的正则匹配功能，此方案虽然效率可能比不上全文检索，但对中文的支持性较好且无需额外配置，在不加搜索词情况下，搜索接口可以当成获取最新树洞接口使用，此外，还增加了分页、数量限制功能，可以给定 `last_id`，只返回此 id 以前的帖子。
4. 权限认证方面，使用 JSON WEB TOKEN 进行认证，认证 token 使用 cookie 进行存储，这套方案轻量、方便、快捷，适用范围广，且后端无需存储会话信息。
5. 此外，关于同源策略，由于是开发环境，我直接使用`flask-cors`允许前端进行访问，并设置 JWT Cookie 支持跨域，在生产环境中，可能需要进一步优化安全性。
6. 最后，撰写了相应的说明问文档，方便前端同学参考。

除进行后端开发外，我基于 bootstrap, axios 和 Vue 快速开发了一套前端演示界面，也就是课上所展示的界面。

1. 演示界面基本实现了发帖、回帖、搜索等功能。JS 部分使用 axios 进行前后端通信，使用 Vue 进行数据渲染和事件绑定。
2. 由于使用了 Vue 中模板语法、双向绑定、事件监听等功能，前端代码比较直观、易读，也节省了开发的时间。
3. CSS 方面使用现成的 bootstrap 组件库，虽然界面算不上特别美观，但 bootstrap 的引入保证了网站整体风格统一，且节省了从零搭建的时间。

当然，这套界面仅作为演示，我们最终提交的作业中前端是由大家共同完成、优化的。



### html css 部分 BY 陈星宇 2000014718

1. index.html style.css
   参考鄢维同学所提供的前端演示，根据王焱同学的需求与建议，负责完成了主页面的html与css制作，包括背景、导航栏、侧边栏、树洞卡片、发布与评论框、图标与按钮的结构与样式等。尤其用心处，在微调黑白色调设计和毛玻璃效果以美化网页风格。

2. login.html register.html login.css
   基于 同学的登录/注册页设计，调整了背景与登录/注册框的样式，以符合网站黑白色调 + 毛玻璃的整体风格。同时也增加了一些动画。

### js html部分 BY 王焱 1900013022

1. js/interface.js  后端接口，使用ajax进行异域请求，需要配置CORS，由于需要cookie，需要在前端设置ajax为withCredentials: true，后端需要设置origin域名，否则无法携带cookie。数据都使用json格式，便于解析。

2. js/main.js

   +  组织了三个页面main.html login.html register.html，根据页面逻辑进行跳转。每个页面有自己变量，使用浏览器储存保存username，passward让三个页面共享。登出清空，实现注销。

   + 侧边栏包括发帖栏，帖子评论栏通过变换组件位置来显示。洞内内容使用js字符串模板组织html，并生成相应html部分。

   +  下拉刷新，当滚动页面的高度小于滚轮高度和用户页面高度时，向后端请求新的帖子，再生成相应的html。
   
   +  生成主页面的帖子，从后端获取数据，组织利用字符串模板组织html DOM添加的页面相应的部分。收藏，我的两个页面逻辑相同。
3. 整合CSS 组织html
   我负责分配任务，需要html大的框架来组织分工，提出基本的CSS要求。同时我负责对接后端的接口，还要和后端的同学协调接口。
4. 本地部署
    单纯的OCRS问题是很好解决，但由于还需要携带cookie，产生的大量的问题，一开始我已经查到需要服务端信任域名的方案，但由于我们对前端的代理并不熟悉，所以一开始没采取这个方式。但后面找到CORS比较详细文档，只能采取这样方式，鄢维同学说vscode有本地代理插件，所以最终采取vscode的live server进行来进行本地前端代理，从而本地部署，来进行本地测试。

### css 部分 BY 张艺凯 2100013221

1. 本树洞的设计理念在于，即保持树洞原有的基本设计布局和“树洞味”，同时又不拘一格，不拘泥于一定要按照树洞本身的“装帧设计”来构思设计。因此，我大刀阔斧地提出了几个登陆页面的设计布局，这些设计布局和树洞原有的登陆部分相差甚远，但美观大方、较为“现代”。
2. 所写的主要css组分有：点击网页背景出现随机颜色圈的特殊效果（css+js实现）、登陆页面的用户名、密码输入的特殊效果（css实现）、按钮的效果等。在此之外，在登陆界面尚未拟定好html代码及所用框架的情况下，我拟写了一套用于课堂展示的登录卡片效果。——虽然这套效果没有最终应用。另外，网页中的ripples效果、点击回到网页最上方等效果均为可选组件，后者并没有最终嵌入index.html网页之中。
3. 另外，我还因地制宜地补充了css代码中，适应不同屏幕大小设备的部分，以便为不同设备的用户带来更好的操作与浏览体验。