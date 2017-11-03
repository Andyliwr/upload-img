$(document).ready(function () {
    var userNameReg = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{3,10}$/
    var userPasswordReg = /^[a-zA-Z0-9_]{6,20}$/
    var userEmailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
    $('input.form-control').bind('input', function (event) {
        var _this = $(this)
        var id = _this.attr('id');
        var value = _this.val()
        if (id === 'inputName') {
            if (userNameReg.test(value)) {
                $.ajax({
                    method: 'GET',
                    url: '/api/checkname?name=' + value,
                    dataType: 'json',
                    timeout: 10000,
                    success: function (res) {
                        if (res.ok) {
                            $('#inputName+i').show()
                            _this.parent().removeClass('has-error')
                            $('.err-tips').html('&nbsp;')
                        } else {
                            $('#inputName+i').hide()
                            _this.parent().addClass('has-error')
                            $('.err-tips').html(res.msg)
                        }
                    },
                    error: function (err) {
                        $('#inputName+i').hide()
                        _this.parent().addClass('has-error')
                        // $('.err-tips').html('校验用户名失败')
                    }

                })
            } else {
                $('#inputName+i').hide()
                _this.parent().addClass('has-error')
                $('.err-tips').html('请输入3-12个中文、数字或者字母')
            }

        } else if (id === 'inputEmail') {
            if (userEmailReg.test(value)) {
                $.ajax({
                    method: 'GET',
                    url: '/api/checkemail?name=' + value,
                    dataType: 'json',
                    timeout: 10000,
                    success: function (res) {
                        if (res.ok) {
                            $('#inputEmail+i').show()
                            _this.parent().removeClass('has-error')
                            $('.err-tips').html('&nbsp;')
                        } else {
                            $('#inputEmail+i').hide()
                            _this.parent().addClass('has-error')
                            $('.err-tips').html(res.msg)
                        }
                    },
                    error: function (err) {
                        $('#inputEmail+i').hide()
                        _this.parent().addClass('has-error')
                        // $('.err-tips').html('校验用户名失败')
                    }
                })
            } else {
                $('#inputEmail+i').hide()
                _this.parent().addClass('has-error')
                $('.err-tips').html('请输入正确邮箱地址')
            }
        } else if (id === 'inputPassword') {
            if (userPasswordReg.test(value)) {
                $('#inputPassword+i').show()
                _this.parent().removeClass('has-error')
                $('.err-tips').html('&nbsp;')
            } else {
                $('#inputPassword+i').hide()
                _this.parent().addClass('has-error')
                $('.err-tips').html('请输入6-20位字母或者数字组成的密码')
            }
        } else if (id === 'inputRePassword') {
            if (value === $('#inputPassword').val()) {
                $('#inputRePassword+i').show()
                _this.parent().removeClass('has-error')
                $('.err-tips').html('&nbsp;')
            } else {
                $('#inputRePassword+i').hide()
                _this.parent().removeClass('has-error')
                $('.err-tips').html('两次输入密码不一致')
            }
        }
    })

    // 点击注册
    $('#doRegiste').bind('click', function () {
        var isok = true
        $('.group>i').each(function () {
            if ($(this).css('display') === 'none') {
                isok = false
            }
        })
        if (isok) {
            $('.err-tips').html('&nbsp;')
            $('#doRegiste').addClass('loading').attr('disabled', true)
            $.ajax({
                method: 'POST',
                url: '/api/signup',
                data: {
                    username: $('#inputName').val(),
                    email: $('#inputEmail').val(),
                    password: $('#inputPassword').val(),
                    repassword: $('#inputRePassword').val()
                },
                dataType: 'json',
                timeout: 10000,
                success: function (res) {
                    $('#doRegiste').removeClass('loading').removeAttr('disabled')
                    if (res.ok) {
                        showAlert('success', '注册成功！即将前往首页')
                        setTimeout(function () {
                            window.location.href = '/'
                        }, 2000)
                    } else {
                        $('.err-tips').html(res.msg)
                    }
                },
                error: function (err) {
                    $('#doRegiste').removeClass('loading').removeAttr('disabled')
                    $('.err-tips').html('注册失败')
                }
            })
        }
    })
})
