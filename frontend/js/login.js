function loginUser() {
    var username = $(":text").val();
    var password = $(":password").val();
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    login(username, password).done(function (data) {
        window.location.href = "./index.html";
        alert("登录成功");
    });
    return false;
}