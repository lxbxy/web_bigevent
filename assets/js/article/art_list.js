$(function() {
    // 定义一个查询的参数对象，将来请求数据的时候，
    //需要将请求参数对象提交到服务器
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {

        const dt = new Date(date);



        var y = dt.getFullYear();
        var m = p(dt.getMonth() + 1);
        var d = p(dt.getDate());

        var hh = p(dt.getHours());
        var mm = p(dt.getMinutes());
        var ss = p(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function p(e) {
        return e = e > 10 ? e : '0' + e;
    }
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, // 每页显示几条数据
        cate_id: '', // 文章的分类id
        state: '' //文章的发布状态
    }
    initTable()
    initCate()
        // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
                //使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                //  调用模板引擎渲染分类的可选项
                var str = template('tpl-cate', res)
                $('[name=cate_id]').html(str)
                form.render();
            }
        })
    }

    // 为筛选表单绑定一个submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数q中对应的值赋值
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用laypage.render方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', //枫叶容器id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 分页发生切换时 触发jump回调
            // 可以通过first的值来判断是通过什么方式 触发回调
            jump: function(obj, first) {
                // console.log(obj);
                // console.log(obj.curr);
                // 把最新的页码值 赋值到q这个查询函数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数 赋值到q这个查询参数对象的 pagesize 属性值
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表并渲染表格
                // initTable()
                if (!first) {
                    initTable();
                }
            }


        })
    }








    $('tbody').on('click', '.btn-delete', function() {
        // console.log(123);
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
            // console.log(id);
            //询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 当数据删除完成后 需要判断当前页面这一页中 是否还有剩余的数据
                        // 如果没有剩余数据之后 则让页码值-1之后
                        // 在重新调用initTable()
                    if (len == 1) {
                        // 如果len的长度等于1 则证明删除之后 页面上没有数据来
                        // 页码值最小值必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })

})