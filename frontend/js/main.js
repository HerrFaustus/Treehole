//注销 跳转到登录界面
var username = localStorage.getItem("username");
var password = localStorage.getItem("password");
var login_status = false;
var last_id = 9999999;
if (login_status == false) {
    if (username == '' || password == '') {
        alert(username);
        window.location.href = "./login.html";
    }
    else {
        login_status = true;
        login(username, password);
        show_post_list(reload = true);
    }
}
function logout() {
    localStorage.setItem("username", '');
    localStorage.setItem("password", '');
    window.location.href = "./login.html";

}
//发布树洞 显示发布侧边栏目
function show_newpost_sidebar() {
    $("#sidebar_newpost").addClass("show-sidebar");

}
//隐藏发布侧边栏目
function hide_newpost_sidebar() {
    $("#sidebar_newpost").removeClass("show-sidebar");
}
//发布新的树洞
function create_new_post() {
    //获取树洞内容
    var post_content = $("#PostContentArea").val();
    $("#PostContentArea").val("");
    //alert(post_content);
    //发送发帖请求
    addPost("title", post_content);
    //关闭发帖页面
    hide_newpost_sidebar();
    //重新渲染帖子
    show_post_list(reload = true);
}
//展示所有post
function encodeHtml(posts) {
    for (var i = 0; i < posts.length; i++) {
        var post = posts[i];
        var favorated = 'fa-star';
        if (!post.favorated) {
            favorated = 'fa-star-o';
        }
        var commentshtml = "";
        for (var j = 0; j < post.comments.length; j++) {
            commentshtml += `<div class="card mb-3 post-card card-body">
                                    <h5 class="card-text" onclick="show_post_detail(${post._id})"> ${post.comments[j].content}</h5>
                                 </div>`;
        }
        $("#mainbody").append(
            `<div class="row post-container">
                    <div class="card mb-3 post-card card-body">
                        <div class="card-body-title">
                            <p class="post-info">${post._id}&nbsp;${post.publish_time}</p>
                            <i class="fa ${favorated} collectButton" id="collectButton${post._id}" onclick=collect_post(${post._id})></i>
                        </div>
                        <h5 class="card-text" onclick="show_post_detail(${post._id})">${post.content}</h5>
                    </div>
                    ${commentshtml}
                </div>`);
        last_id = post._id;
    }
}
function show_post_list(reload = true) {
    if (reload == true) {
        last_id = 9999999;
        $("#mainbody").html("");
    }
    getPosts('', last_id).done(function (data) {
        //alert(data.message);
        encodeHtml(data.data.posts);
    }
    );
}
//展示我的post
function show_my_post_list(reload = true) {
    if (reload == true) {
        last_id = 9999999;
        $("#mainbody").html("");
    }
    getUserPosts().done(function (data) {
        //alert(data.message);
        encodeHtml(data.data);
    });
}
//展示收藏的post
function show_star_post_list(reload = true) {
    if (reload == true) {
        last_id = 9999999;
        $("#mainbody").html("");
    }
    getUserFavorites().done(function (data) {
        //alert(data.message);
        encodeHtml(data.data);
    });
}
//展示检索的帖子
function show_search_post_list(reload = true) {
    if (reload == true) {
        last_id = 9999999;
        $("#mainbody").html("");
    }
    let serach = $("#searchInput").val();
    //alert(serach);
    $("#searchInput").val("");
    getPosts(serach, last_id).done(function (data) {
        //alert(data.message);
        encodeHtml(data.data.posts);
    });
}
//展示单个帖子的详情
var selected_post_id = null;
function show_post_detail(id) {
    $("#post-detail").addClass("show-sidebar");
    if (id != null) {
        selected_post_id = id;
        getPostDetails(id).done(function (data) {
            //alert(data.message);
            $("#postdetaillist").html = "";
            var post = data.data;
            var html = `<li class="card card-body">
                            <p class="post-info">${post._id}&nbsp;${post.publish_time}</p>
                            <h5 class="card-text">${post.content}</h5> 
                        </li>`;
            for (var j = 0; j < post.comments.length; j++) {
                html += `<li class="card card-body">
                            <h5 class="card-text">${post.comments[j].content}</h5>
                        </li>`;
            }
            $("#postdetaillist").html(html);
        });
    }
}
//隐藏单个帖子的详情
function hide_post_detail() {
    $("#post-detail").removeClass("show-sidebar");
}
//创建新的评论
function create_new_comment() {
    //获取评论内容
    var comment_content = $("#CommentContentArea").val();
    //alert(comment_content);
    $("#CommentContentArea").val("");
    //CommentContentArea$("#PostContentArea").val("");
    //发送评论请求
    if (selected_post_id != null) {
        addComment(selected_post_id, comment_content);
        //刷新评论
        show_post_detail(selected_post_id);
        //刷新帖子
    }
}
//收藏帖子
function collect_post(id) {
    $("#collectButton" + id).toggleClass("fa-star-o");
    $("#collectButton" + id).toggleClass("fa-star");
    favoritePost(id);
}
function handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        if (last_id > 1)
            show_post_list(reload = false)
    }
}
window.addEventListener('scroll', handleScroll)