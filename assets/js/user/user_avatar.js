$(function() {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    var layer = layui.layer
        // 1.3 创建裁剪区域

    $image.cropper(options);
    $("#imgChoose").on('click', function() {
        $("#file").click();
    })
    $("#file").on('change', function(e) {

        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }
        // 拿到用户选择的文件
        var filelist = e.target.files[0]
            // 根据选择的文件， 创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(filelist)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    $('#sureimg').on('click', function() {
        // 3. 将裁剪后的图片，输出为 base64 格式的字符串  dataURL就是要传的参数
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('上传头像失败！')
                }
                layer.msg('上传头像成功！')
                    // 调用父框架中的函数重新渲染页面
                window.parent.getUserInfo()
            }
        })



    })
})