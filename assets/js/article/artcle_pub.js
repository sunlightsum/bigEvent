$(function() {
    var layer = layui.layer
    var form = layui.form

    initCale()
    initEditor()

    function initCale() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败')
                }
                // 定义模板引擎
                var htmStr = template('selCale', res);
                $('[name=cate_id]').html(htmStr)
                form.render()
            }
        })
    }

    // 实现裁剪功能
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#chooseimg').click(function() {
        $('#cover_img').click()

    })
    $('#cover_img').on('change', function(e) {
        var file = e.target.files;
        // if (file.length === 0) {
        //     return
        // }
        var newImgURL = URL.createObjectURL(file[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    //发布状态
    var artState = '已发布'
        // 点击存为草稿
    $('#btnsave2').on('click', function() {
        artState = '草稿'
    })

    $('#form_pub').on('submit', function(e) {
        e.preventDefault();
        var data = new FormData($(this)[0])
        data.append('state', artState)
            // 将裁剪的区域输出调用image toBlob方法, 这个blob就是需要的图片
        var dataURL = $image;
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                data.append('cover_img', blob);
                publishArt(data)
            })


    })

    // 发表文章的方法
    function publishArt(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败')
                }
                layer.msg('发布成功')
                location.href = '/article/article_list.html'
            }
        })
    }

})