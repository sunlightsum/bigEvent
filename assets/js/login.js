$(function() {
    // 点击去注册的链接
    $("#link_reg").on('click', function() {
            $(".login-box").hide();
            $(".reg-box").show();
        })
        // 点击去登录的链接
    $("#link_login").on('click', function() {
            $(".login-box").show();
            $(".reg-box").hide();
        })
        //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer
        // 通过 form.verify() 来自定义校验规则,然后将pass这个写到HTML中的lay-verify属性中
    form.verify({
            pass: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            repass: function(value) {
                var psd = $(".reg-box [name=password]").val()
                if (psd !== value) {
                    return '两次密码不一致'
                }
            }
        })
        // 注册调接口表单#reg_form
    $("#reg_form").on("submit", function(e) {
        e.preventDefault()
        var data = {
            username: $('#reg_form [name=username]').val(),
            password: $('#reg_form [name=password]').val()
        }
        $.post("/api/reguser", data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                layer.msg('注册成功，请登录');
                $("#link_login").click()
            })
    });
    //为登录表单调接口
    $('#login_form').on('submit', function(e) {
        e.preventDefault();
        // var data = {
        //         username: $('#login_form [name=username]').val(),
        //         password: $('#login_form [name=password]').val()
        //     }
        var data = $(this).serialize() //serialize() 快速获取表单的值
            // console.log(data);

        $.post('/api/login', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            //将登录成功得到的token保存到本地存储中以便于后续用于有权限接口的身份认证
            localStorage.setItem('token', res.token)
            layer.msg('登录成功')
            location.href = '/index.html'
        })
    })
})