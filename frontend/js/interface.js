
const BASE_URL = "http://127.0.0.1:5055";
$.ajaxSetup({ async: false,xhrFields: { withCredentials: true }});

//测试
function register(username, password) {
    const url = `${BASE_URL}/api/register`;
    const data = { username: username, password: password };

    return $.ajax({
        url: url,
        type: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data),
        dataType: 'json',
        complete: function (xhr, textStatus) {
            if (xhr.status == 401)
            alert(xhr.responseText);

        }
    });
}

function login(username, password) {
    const url = `${BASE_URL}/api/login`;
    const data = { username: username, password: password };

    return $.ajax({
        url: url,
        type: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data),
        dataType: 'json',
        complete: function (xhr, textStatus) {
            if (xhr.status == 401)
            alert(xhr.responseHeaders);
        }
    });
}

function getPosts(query = '', last_id = '') {
    const url = `${BASE_URL}/api/posts?query=${query}&last_id=${last_id}`;

    return $.ajax({
        url: url,
        type: 'GET',
        headers: { 'Content-Type': 'application/json' },
        dataType: 'json',
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        complete: function (xhr, textStatus) {
            if(xhr.status == 401)
            alert(xhr.responseText);
        }
    });
}

function getPostDetails(postId) {
    const url = `${BASE_URL}/api/posts/${postId}`;
    return $.ajax({
        url: url,
        type: 'GET',
        headers: { 'Content-Type': 'application/json' },
        dataType: 'json',
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        complete: function (xhr, textStatus) {
            if(xhr.status == 401)
            alert(xhr.responseText);
        }
    });
}

function addPost(title, content) {
    const url = `${BASE_URL}/api/posts`;
    const data = { title: title, content: content };
    return $.ajax({
        url: url,
        type: 'POST',
        async: false,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data),
        dataType: 'json',
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        }
    });
}

function addComment(postId, content) {
    const url = `${BASE_URL}/api/posts/${postId}/comments`;
    const data = { content: content };

    return $.ajax({
        url: url,
        type: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data),
        dataType: 'json',
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        complete: function (xhr, textStatus) {
            if(xhr.status == 401)
            alert(xhr.responseText);
        }
    });
}

function getUserPosts() {
    const url = `${BASE_URL}/api/user/posts`;

    return $.ajax({
        url: url,
        type: 'GET',
        headers: { 'Content-Type': 'application/json' },
        dataType: 'json',
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        complete: function (xhr, textStatus) {
            if(xhr.status == 401)
            alert(xhr.responseText);
        }
    });
}

function getUserFavorites() {
    const url = `${BASE_URL}/api/user/favorates`;

    return $.ajax({
        url: url,
        type: 'GET',
        headers: { 'Content-Type': 'application/json' },
        dataType: 'json',
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        complete: function (xhr, textStatus) {
            if(xhr.status == 401)
            alert(xhr.responseText);
        }
    });
}

//收藏
function favoritePost(postId) {
    const url = `${BASE_URL}/api/posts/${postId}/favorate`;

    return $.ajax({
        url: url,
        type: 'POST',
        headers: { 'Content-Type': 'application/json' },
        dataType: 'json',
        xhrFields: {
            withCredentials: true // 发送Ajax时，Request header中会带上 Cookie 信息。
        },
        complete: function (xhr, textStatus) {
            if(xhr.status == 401)
            alert(xhr.responseText);
        }
    });
}
// 论坛对象

function renderOnePost() {

}

function createPkuhole(username, password) {
    var tempPkuhole = new Object;
    //login(username, password);
    //渲染过的帖子
    tempPkuhole.posts = [];
    //主页面
    tempPkuhole.renderPosts = function () {
        const result = getPosts();
        result.done(function (responseText, textStatus) {
            responseText.data.posts.forEach(post => {
                //渲染每个帖子
                tempPkuhole.posts.push(post);
                $("body").append();
                '<el-row :gutter="12" class="post">' +
                    '<el-col :span="8">' +
                    '<el-card shadow="always">' +
                    '<span @click="openDrawer">' + post.content + '</span>' +
                    '</el-card>' +
                    '</el-col>' +
                    '<el-col :span="8">' +
                    '<el-card shadow="always">' +
                    '<span @click="openDrawer">现在这里还什么都没有，点击右上角发布第一篇洞文吧！</span>' +
                    '</el-card>' +
                    '</el-col>' +
                    '</el-row>';
                //post._id
                //post.comments 渲染评论
                //post.publish_time
                //post.favorated 是否收藏
                //收藏数
                //post.comments.length 评论数
            }
            );
        });
    }
    tempPkuhole.renderMorePosts = function () {
        const result = getPosts(last_id = tempPkuhole.posts[tempPkuhole.posts.length - 1]._id);
        result.done(
            function (responseText, textStatus) {
                responseText.data.posts.forEach(post => {
                    //渲染每个帖子
                    tempPkuhole.posts.push(post);
                    //post._id
                    //post.comments 渲染评论
                    //post.publish_time
                    //post.favorated 是否收藏
                    //收藏数
                    //post.comments.length 评论数
                }
                );
            }
        );
    }
    //收藏
    tempPkuhole.renderFavPosts = function () {
        const result = getUserFavorites();
        /**/
    }
    tempPkuhole.renderMoreFavPosts = function () {

    }
    //搜索 
    tempPkuhole.searchPosts = function () {

    }
    tempPkuhole.searchMorePosts = function () {

    }
    //发表
    tempPkuhole.createPost = function () {

    }
    //评论
    tempPkuhole.replayPost = function () {
        //发表评论
    }
    //展开一个帖子
    tempPkuhole.openPost = function () {
        //渲染评论
        //渲染回复
    }

}