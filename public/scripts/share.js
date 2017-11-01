function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            var c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

function showAlert(type, content) {
    if (type === 'error') {
        $('.alert #tip-type').html('错误!')
        $('.alert #tip-words').html(content)
        $('.alert').removeClass('alert-warning').removeClass('alert-success').addClass('alert-danger').addClass('show')
    } else if (type === 'success') {
        $('.alert #tip-type').html('恭喜!')
        $('.alert #tip-words').html(content)
        $('.alert').removeClass('alert-warning').removeClass('alert-danger').addClass('alert-success').addClass('show')
    } else if (type === 'waining') {
        $('.alert #tip-type').html('注意!')
        $('.alert #tip-words').html(content)
        $('.alert').removeClass('alert-success').removeClass('alert-danger').addClass('alert-waining').addClass('show')
    }
    $('.alert .close').bind('click', function() {
        $('.alert').removeClass('show')
    })
    setTimeout(function() {
        $('.alert').removeClass('show')
    }, 3000)
}

$(document).ready(function() {
    $('#logout').click(function() {
        $.ajax({
            method: 'GET',
            url: '/api/logout',
            dataType: 'json',
            timeout: 10000,
            success: function(res) {
                if (res.ok) {
                    window.location.href = '/'
                } else {
                    showAlert('error', '退出失败')
                }
            },
            error: function(err) {
                showAlert('error', '退出失败')
            }
        })
    })
})