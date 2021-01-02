$(function() {
    //点击“去注册账号的”链接
    $('#link_reg').on('click', function() {
        $('.reg-box').show();
        $('.login-box').hide();

    })
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })


    // 从layUI中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify函数自定义校验规则
    form.verify({
            //自定义一个叫做pwd的校验规则
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            //校验二次密码是否一致的规则
            repwd: function(value) {
                // 通过形参拿到确认密码框中的值
                // 还需要拿到密码框中的值
                // 然后进行一次等于的判断
                // 如果判断失败，则return一个提示消息即可
                let pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次密码不一致'
                }
            }
        })
        //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        // 发起Ajax的POST请求
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, function(res) {
            // console.log(123);
            if (res.status !== 0) { return layer.msg(res.message) }
            layer.msg("注册成功，请登录", function() {
                $('#link_login').click();
            })
        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) { return layer.msg('登陆失败') }
                console.log(res);
                layer.msg('登陆成功！ ')
                    // 将登陆成功得到的token字符串，保存到 localStorage中
                localStorage.setItem('token', res.token)
                    // 跳转到后台页面
                location.href = '/index.html'
            }
        });
    })
})