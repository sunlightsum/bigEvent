$(function() {
    //定义验证规则
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称必须在1~6个字符之间"
            }
        }
    })
    initInfo();

    //获取用户信息填入表单
    function initInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');

                }
                // console.log(res);
                form.val('userform', res.data); //form.val('filter', object);用于给指定表单集合的元素赋值和取值。如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。
            }
        })
    }
    //重置
    $('#reset').on('click', function(e) {
        e.preventDefault();
        initInfo()

    })

    //提交更新表单
    $('#userform').submit(function(e) {
        e.preventDefault()
        var data = form.val('userform')
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            //也可以 data:$(this).serialize()
            data: data,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('设置失败')
                }
                console.log(res);
                window.parent.getUserInfo(); //window是ifarm，它的父亲是index 的大框架，调用了父亲的getUserInfo()的方法渲染页面

            }
        })

    })
})