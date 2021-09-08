$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
            var dt = new Date(data);
            var y = dt.getFullYear();
            var m = zero(dt.getMonth() + 1);
            var d = zero(dt.getDay());

            var hh = zero(dt.getHours());
            var mm = zero(dt.getMinutes());
            var ss = zero(dt.getSeconds());

            return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss
        }
        // 补零函数
    function zero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1, //页数
        pagesize: 2, //一页放几条数据
        cate_id: '', //分类的ID
        state: '', //发布的状态
    }
    initList()
    initCale()

    //初始化列表
    function initList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                console.log(res);

                // 使用模板引擎渲染页面
                var htmlStr = template('tblist', res);
                $('tbody').html(htmlStr)
                randPage(res.total)
            }
        })
    };

    // 渲染筛选中的下拉菜单——分类
    function initCale() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }

                var htmlStr = template('init_cale', res);
                $('[name=cate_id]').html(htmlStr);
                form.render()

            }
        })
    };


    //筛选功能
    $('#search').submit(function(e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initList();
    })

    // 定义分页函数
    function randPage(total) {

        laypage.render({
            elem: 'rander',
            count: total,
            limit: q.pagesize, // 一页放几条数据
            curr: q.pagenum, //设置默认被选中的分页
            // layout 里面的数组控制分页的界面功能，可按需改变顺序
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发laypage.rander的jump 回调函数有两种 会发生死循环
            // 1.调用laypage.rander方法会触发jump
            // 2.点击了页码会触发jump   
            // 可以通过first的值来判断是通过那种方式调用的jump
            // 如果是1方式那么first 是true,第2中方式first是undefind。如果是第一种方式则不调用初始化函数
            // 选择条目数也会触发jump回调
            jump: function(obj, first) { //jump 监听分页的动态信息
                // 将最新的页数赋值给q查寻对象上
                q.pagenum = obj.curr
                    //把最新的条目数赋值给q这个查询对象上
                q.pagesize = obj.limit

                // initList()
                if (!first) {
                    initList();
                }
            }
        })
    }
    //实现删除功能
    $('tbody').on('click', '#remove2', function() {
        // len获取当前这一页的删除按钮个数
        var len = $('.btn-delet').length;
        var id = $(this).attr('data-id');
        console.log(id);
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功');
                    // 当删除一条数据完成后，先判断这一页是否还有剩余数据，如果没有了，就将页码值减一在调用initList()方法，渲染列表
                    if (len === 1) {
                        // len===1就证明点击删除后页面就没有任何剩余数据了
                        // 页码值最小是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initList();
                    layer.close(index);
                }
            })

        });
    })

    //编辑功能
    $('tbody').on('click', '#edit', function() {
        location.href = '/article/artcle_cale_edit.html'

    })


})