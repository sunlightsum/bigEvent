$(function() {
    getUserInfo();
    $(".edit ").on('click', function() {
        var layer = layui.layer
        console.log('ok');
        layer.confirm('确认退出?', { icon: 3, title: '提示' }, function(index) {
            //    清空本地存储的token
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        });
    })
})




function readerAvatar(user) {
    var username = user.nickname || user.username;
    // console.log(username);

    $('.welcome').html('欢迎&nbsp;&nbsp;' + username);
    if (user.user_pic !== null) {
        // 图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();

    } else {
        // 文本头像
        var first = username[0].toUpperCase();
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide()
    }
}

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers: { //用于需要权限的接口
        //     Authorization: localStorage.getItem("token") || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            readerAvatar(res.data);
            console.log(res);

        },
        //这个complete函数在执行了success或error函数之后都会执行
        // complete: function(res) {
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！")
        //     //强制清空token
        //     //强制跳转到登录页面
        //     {
        //         localStorage.removeItem('token');
        //         location.href = '/login.html'
        //     }
        // }


    })
}