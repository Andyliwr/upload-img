$(document).ready(function () {
    if ($('#logined').html() === 'true') {
        $.ajax({
            method: 'GET',
            url: '/api/user',
            dataType: 'json',
            timeout: 10000,
            success: function (res) {
                if (res.ok) {
                    $('#username-a > img').attr('src', 'user')
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    }
})
