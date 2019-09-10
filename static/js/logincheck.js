$(function checkLogin() {
    const username = $('#username')
    const password = $('#password')
    const loginbtn = $('#loginbtn')

    $(document).keydown(function (event) {
        if (event.keyCode == 13 && $('#login').hasClass('show')) {
            loginbtn.click()
        }
    })

    username.blur(function () {
        if (username.val() == '' || username.val() == null) {
            username.addClass('is-invalid')
            username.removeClass('is-valid')
            return false
        } else {
            username.removeClass('is-invalid')
            username.addClass('is-valid')
            return true
        }
    })

    password.blur(function () {
        if (password.val() == '' || password.val() == null) {
            password.addClass('is-invalid')
            password.removeClass('is-valid')
            return false
        } else {
            password.removeClass('is-invalid')
            password.addClass('is-valid')
            return true
        }
    })

    loginbtn.click(function () {
        if (username.val() == '' || username.val() == null) {
            username.addClass('is-invalid')
            return false
        } else if (password.val() == '' || password.val() == null) {
            password.addClass('is-invalid')
            return false
        } else {
            $.ajax({
                url: "../api/users/login",
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'name': username.val(),
                    'password': $.md5(password.val())
                }),
                success: function (response) {
                    if (response.success) {
                        window.location.reload()
                    } else {
                        $('#loginbtn').popover('show')
                        close(1)
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }
    })

    function close(count) {
        window.setTimeout(function () {
            count--
            if (count > 0) {
                close(count)
            } else {
                $('#loginbtn').popover('hide')
            }
        }, 1000)
    }
})