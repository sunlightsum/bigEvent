// jq每次调用$.get $.post 或$.ajax请求时都会先调用ajaxPrefilter() 这个函数
// 在这个函数中， 可以拿到ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的Ajax请求之前，先统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { //用于需要权限的接口
            Authorization: localStorage.getItem("token") || ''
        }
    }

    // 全局挂载complete()函数
    //这个complete函数在执行了success或error函数之后都会执行
    options.complete = function(res) {
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！")
        //强制清空token
        //强制跳转到登录页面
        {
            localStorage.removeItem('token');
            location.href = '/login.html'
        }
    }
})