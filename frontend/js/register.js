function registerUser() {
    var username = $(":text").val();
    var password = $(":password").val();
    if (username == "" || password == "") {
        alert("用户名或密码不能为空");
        return;
    }
    register(username, password).done(function (data) {
        window.location.href = "./login.html";
        alert("register " + username + ' ' + password);
    });
}