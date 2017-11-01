$(document).ready(function () {

  // 点击注册
  $('#doLogin').bind('click', function () {
    var nameOrEmail = $('#inputEmail').val()
    var password = $('#inputPassword').val()
    if (nameOrEmail) {
      if (password) {
        $.ajax({
          method: 'POST',
          url: '/api/signin',
          data: {
            nameOrEmail: $('#inputEmail').val(),
            password: $('#inputPassword').val(),
          },
          dataType: 'json',
          timeout: 10000,
          success: function (res) {
            if (res.ok) {
              showAlert('success', '登陆成功！即将前往首页')
              setCookie('ldk_upload_img_uid', '')
              // setTimeout(function () {
              //   window.location.href = '/'
              // }, 2000)
            } else {
              $('.err-tips').html(res.msg)
            }
          },
          error: function (err) {
            $('.err-tips').html('登陆失败')
          }
        })
      } else {
        $('.err-tips').html('请输入密码')
      }
    } else {
      $('.err-tips').html('请输入用户名或者密码')
    }
  })
})
