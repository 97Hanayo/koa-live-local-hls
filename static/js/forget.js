$(function () {
    const email = $('#email')
    const emailfeed = $('#emailfeed')
    const emailinfeed = $('#emailinfeed')

    const code = $('#code')
    const codefeed = $('#codefeed')
    const codeinfeed = $('#codeinfeed')

    const password = $('#password')
    const pwdfeed = $('#pwdfeed')
    const pwdinfeed = $('#pwdinfeed')

    const passwordcheck = $('#passwordcheck')
    const repwdfeed = $('#repwdfeed')
    const repwdinfeed = $('#repwdinfeed')

    const emailpatrn = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

    const codepatrn = /^[0-9]{6}$/

    const pwdpatrnnum = /^[0-9]*$/
    const pwdpatrnstr = /^[A-Za-z]+$/
    const pwdpatrn = /^[A-Za-z0-9]{8,}$/

    const change = $('#change')

    const valid = email.is('.is-invalid') && code.is('.is-invalid') && password.is('.is-invalid') && passwordcheck.is('.is-invalid')

    const send = $('#send')
    const $resetpwd=$('#resetpwd')
    const num=$('#num')

    email.blur(function () {
        if (email.val() == '' || email.val() == null) {
            emailinfeed.html('不能不写邮箱噢(￣▽￣)"')
            email.addClass('is-invalid')
            email.removeClass('is-valid')
            send.attr("disabled", "")
            return false
        } else if (!emailpatrn.exec(email.val())) {
            emailinfeed.html('邮箱是不是哪里不对(#｀-_ゝ-)')
            email.addClass('is-invalid')
            email.removeClass('is-valid')
            send.attr("disabled", "")
            return false
        } else {
            $.ajax({
                url: '../api/users/emailcheck',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'email': email.val()
                }),
                success: function (data) {
                    if (data) {
                        emailfeed.html('哦耶ヾ(•ω•`)o')
                        email.addClass('is-valid')
                        email.removeClass('is-invalid')
                        send.removeAttr("disabled")
                        return true
                    }
                },
                error: function (data) {
                    if (data) {
                        emailinfeed.html('好像没有这个邮箱噢')
                        email.addClass('is-invalid')
                        email.removeClass('is-valid')
                        send.attr("disabled", "")
                        return false
                    }
                }
            })
        }
    })

    code.blur(function () {
        if (code.val() == '' || code.val() == null) {
            codeinfeed.html('没有验证码？(￣▽￣)"')
            code.addClass('is-invalid')
            code.removeClass('is-valid')
            return false
        } else if (!codepatrn.exec(code.val())) {
            codeinfeed.html('验证码是六位纯数字哦(#｀-_ゝ-)')
            code.addClass('is-invalid')
            code.removeClass('is-valid')
            return false
        } else {
            $.ajax({
                url: '../api/users/codecheck',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'email': email.val(),
                    'code': $.md5(code.val())
                }),
                success: function (data) {
                    if (data) {
                        codefeed.html('哦耶ヾ(•ω•`)o')
                        code.addClass('is-valid')
                        code.removeClass('is-invalid')
                        return true
                    }
                },
                error: function (data) {
                    if (data) {
                        codeinfeed.html('验证码不对或者失效了哦，请重新发送！')
                        code.addClass('is-invalid')
                        code.removeClass('is-valid')
                        return false
                    }
                }
            })
        }
    })

    password.blur(function () {
        if (password.val() == '' || password.val() == null) {
            pwdinfeed.html('不能不写密码噢(￣▽￣)"')
            password.addClass('is-invalid')
            password.removeClass('is-valid')
            return false
        } else if (pwdpatrnnum.exec(password.val())) {
            pwdinfeed.html('你怎么写的都是数字(′д｀σ)σ')
            password.addClass('is-invalid')
            password.removeClass('is-valid')
            return false
        } else if (pwdpatrnstr.exec(password.val())) {
            pwdinfeed.html('你怎么写的都是字母(′д｀σ)σ')
            password.addClass('is-invalid')
            password.removeClass('is-valid')
            return false
        } else if (!pwdpatrn.exec(password.val())) {
            pwdinfeed.html('好像不够长啊(#｀-_ゝ-)')
            password.addClass('is-invalid')
            password.removeClass('is-valid')
            return false
        } else {
            pwdfeed.html('哦耶ヾ(•ω•`)o')
            password.addClass('is-valid')
            password.removeClass('is-invalid')
            return true
        }
    })

    passwordcheck.blur(function () {
        if (passwordcheck.val() == '' || passwordcheck.val() == null) {
            repwdinfeed.html('这里怎么是空的(；′⌒`)')
            passwordcheck.addClass('is-invalid')
            passwordcheck.removeClass('is-valid')
            return false
        } else if (passwordcheck.val() != password.val()) {
            repwdinfeed.html('跟上面不一样啊,,ԾㅂԾ,,')
            passwordcheck.addClass('is-invalid')
            passwordcheck.removeClass('is-valid')
            return false
        } else if (passwordcheck.val() == password.val()) {
            repwdfeed.html('哦耶ヾ(•ω•`)o')
            passwordcheck.addClass('is-valid')
            passwordcheck.removeClass('is-invalid')
            return true
        }
    })

    let start
    let time = 60//一分钟
    function setTime() {
        if (time == 0) {
            send.removeAttr("disabled")
            send.text('发送')
            time = 60
            clearInterval(start)
            return false

        } else {
            send.attr("disabled", "")
            send.text(time + '秒后重新发送')
            time--
        }
    }
    send.click(function () {
        $.ajax({
            type: "POST",
            url: "../api/users/send",
            data: JSON.stringify({
                'email': $('#email').val()
            }),
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            success: function (response) {
                $('#codemail').modal('show')
                return true
            }
        })
        start = setInterval(function () {
            setTime(time)
        }, 1000)
    })
    change.click(function () {
        if (email.val() == '' || email.val() == null) {
            emailinfeed.html('不能不写邮箱噢(￣▽￣)"')
            email.addClass('is-invalid')
            return false
        } else if (code.val() == '' || code.val() == null) {
            codeinfeed.html('验证码不对或者失效了哦，请重新发送！')
            code.addClass('is-invalid')
            return false
        } else if (password.val() == '' || password.val() == null) {
            pwdinfeed.html('不能不写密码噢(￣▽￣)"')
            password.addClass('is-invalid')
            return false
        } else if (passwordcheck.val() == '' || passwordcheck.val() == null) {
            repwdinfeed.html('这里怎么是空的(；′⌒`)')
            passwordcheck.addClass('is-invalid')
            return false
        } else if (valid) {
            return false
        } else {
            $.ajax({
                url: '../api/users/pwdreset',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'email': email.val(),
                    'password': $.md5(password.val())
                }),
                success: function (response) {
                    $resetpwd.modal('show')
                    jump(5)
                    $('#toindex').click(function () {
                        location.href = '/index'
                    })
                },
                error: function (e) {
                    console.error(e)
                }
            })
        }
    })

    function jump(count) {
        window.setTimeout(function () {
            count--
            if (count > 0) {
                num.html(`${count}`)
                jump(count)
            } else {
                location.href = '/index'
            }
        }, 1000)
    }
})