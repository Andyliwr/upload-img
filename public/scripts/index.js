$(document).ready(function() {
    if ($('#logined').html() === 'true') {
        $.ajax({
            method: 'GET',
            url: '/api/user',
            dataType: 'json',
            timeout: 10000,
            success: function(res) {
                console.log(res)
            },
            error: function(err) {
                console.log(err)
            }
        })
    }
})