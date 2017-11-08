$(document).ready(function() {
    // 点击注册
    $('#doLogin').bind('click', function() {
        var nameOrEmail = $('#inputEmail').val()
        var password = $('#inputPassword').val()
        if (nameOrEmail) {
            if (password) {
                $('.err-tips').html('&nbsp;')
                $('#doLogin').addClass('loading').attr('disabled', true)
                $.ajax({
                    method: 'POST',
                    url: '/api/signin',
                    data: {
                        nameOrEmail: $('#inputEmail').val(),
                        password: $('#inputPassword').val(),
                    },
                    dataType: 'json',
                    timeout: 10000,
                    success: function(res) {
                        $('#doLogin').removeClass('loading').removeAttr('disabled')
                        if (res.ok) {
                            showAlert('success', '登陆成功！')
                            var backUrl = getParam('backUrl')
                            setTimeout(function() {
                                window.location.href = backUrl || '/'
                            }, 800)
                        } else {
                            $('.err-tips').html(res.msg)
                        }
                    },
                    error: function(err) {
                        $('.err-tips').html('登陆失败')
                        $('#doLogin').removeClass('loading').removeAttr('disabled')
                    }
                })
            } else {
                $('.err-tips').html('请输入密码')
            }
        } else {
            $('.err-tips').html('请输入用户名或者密码')
        }
    })

    $(document).keypress(function(e) {
        // 回车键事件  
        if (e.which == 13) {
            jQuery("#doLogin").click()
        }
    })
})