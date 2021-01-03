$(function() {
    var layer = layui.layer;
    // 调用此函数获取用户基本信息
    getUserInfo();
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' },
            function(index) {
                //do something
                // 清空本地储存中的 token
                localStorage.removeItem('token')
                    // 重新跳转到登陆页面
                location.href = '/login.html'

                // 关闭 confirm 询问框 
                layer.close(index);
            });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        //请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data);
        },
        //不论成功还是失败最终都会执行 complete
        // complete: function(res) {
        //     // console.log(res);
        //     //在complete 回调函数中可以通过res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 强制清空 token
        //         console.log(res);
        //         localStorage.removeItem('token');
        //         // 强制跳转到登陆页面
        //         location.href = '/login.html'
        //     }
        // }

    })
}

//渲染用户头像
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`);
    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}