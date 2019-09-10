$(function () {
    const mydate = new Date()
    $('#resend').click(function () {
        $.ajax({
            type: "POST",
            url: "../api/users/resend",
            data: JSON.stringify({
                'token': $.md5($('#user').html() + mydate.toLocaleTimeString()),
                'email': $('#email').val()
            }),
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            success: function (response) {
                $('#resendmail').modal('show')
                return true
            }
        })
    })
})