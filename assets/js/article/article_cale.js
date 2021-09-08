$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCale()

    // 渲染数据列表
    function initArtCale() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }


                var htmlStr = template('tablecale', res);
                $('tbody').html(htmlStr)
            }
        })
    };
    var index = null;
    $('#addcale').click(function() {
        index = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dailog_add').html()
        });
    });

    $('body').on('submit', '#add_form', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#add_form').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章失败')
                }
                layer.msg('添加文章成功')
                initArtCale();
                layer.close(index);
                // $('#add_form')[0].reset();
            }
        })
    })

    $('tbody').on('click', '#edit', function() {
        index = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dailog_edit').html()
        });
        var id = $(this).attr('data-id')
            // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类信息失败!')

                }
                form.val('edit_form', res.data)
            }
        })
    })

    // 确认修改
    $('body').on('submit', '#edit_form', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败')
                }
                initArtCale();
                layer.msg('更新分类信息成功')
                layer.close(index)
            }
        })
    });
    $('tbody').on('click', '#remove', function(e) {
        var id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功');
                    initArtCale();
                    layer.close(index);
                }
            })
        });
    })


})