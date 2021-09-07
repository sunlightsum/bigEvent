$(function() {
    var form = layui.form;
    var layer = layui.layer

    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        newpwd: function(value) {
            if (value === $('input[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        repsd: function(value) {
            if (value !== $('input[name=newPwd]').val()) {
                return "两次密码不一致!"
            }
        }
    })

    $('.layui-form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改密码失败!')
                }

                layer.msg('修改密码成功!');
                // 重置表单 将jq对象用[0]的方式转为dom对象，调用reset（）方法重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})