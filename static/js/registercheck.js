$(function checkForm() {
    const user = $('#user')
    const userfeed = $('#userfeed')
    const userinfeed = $('#userinfeed')

    const email = $('#email')
    const emailfeed = $('#emailfeed')
    const emailinfeed = $('#emailinfeed')

    // const code = $('#code')
    // const codefeed = $('#codefeed')
    // const codeinfeed = $('#codeinfeed')

    const password = $('#password')
    const pwdfeed = $('#pwdfeed')
    const pwdinfeed = $('#pwdinfeed')

    const passwordcheck = $('#passwordcheck')
    const repwdfeed = $('#repwdfeed')
    const repwdinfeed = $('#repwdinfeed')

    const qq = $('#qq')
    const qqfeed = $('#qqfeed')
    const qqinfeed = $('#qqinfeed')

    const check = $('#check')
    const checkinfeed = $('#checkinfeed')

    const finish = $('#finish')

    const num = $('#num')

    const userpatrn = /^[a-zA-Z0-9_-]{4,16}$/

    const emailpatrn = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

    const pwdpatrnnum = /^[0-9]*$/
    const pwdpatrnstr = /^[A-Za-z]+$/
    const pwdpatrn = /^[A-Za-z0-9]{8,}$/

    const qqpatrn = /^\d{5,}$/

    const mydate = new Date()

    // const valid = user.is('.is-invalid') && email.is('.is-invalid') && code.is('.is-invalid) && password.is('.is-invalid') && passwordcheck.is('.is-invalid') && qq.is('.is-invalid') && check.is('.is-invalid')
    const valid = user.is('.is-invalid') && email.is('.is-invalid') && password.is('.is-invalid') && passwordcheck.is('.is-invalid') && qq.is('.is-invalid') && check.is('.is-invalid')

    user.blur(function () {
        if (user.val() == '' || user.val() == null) {
            userinfeed.html('不能不写用户名噢(￣▽￣)"')
            user.addClass('is-invalid')
            user.removeClass('is-valid')
            return false
        } else if (user.val().length < 4 || user.val().length > 16) {
            userinfeed.html('用户名长度不符合要求啊(* ￣︿￣)')
            user.addClass('is-invalid')
            user.removeClass('is-valid')
            return false
        } else if (!userpatrn.exec(user.val())) {
            userinfeed.html('用户名有非法字符哦(#｀-_ゝ-)')
            user.addClass('is-invalid')
            user.removeClass('is-valid')
            return false
        } else {
            $.ajax({
                url: '../api/users/usercheck',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'user': user.val()
                }),
                success: function (data) {
                    if (data) {
                        userinfeed.html('有用户名跟你一样的人诶(○´･д･)ﾉ')
                        user.addClass('is-invalid')
                        user.removeClass('is-valid')
                        return false
                    }
                },
                error: function (data) {
                    userfeed.html('好啦好啦ヾ(•ω•`)o')
                    user.addClass('is-valid')
                    user.removeClass('is-invalid')
                    return true
                }
            })
        }
    })

    email.blur(function () {
        if (email.val() == '' || email.val() == null) {
            emailinfeed.html('不能不写邮箱噢(￣▽￣)"')
            email.addClass('is-invalid')
            email.removeClass('is-valid')
            return false
        } else if (!emailpatrn.exec(email.val())) {
            emailinfeed.html('邮箱是不是哪里不对(#｀-_ゝ-)')
            email.addClass('is-invalid')
            email.removeClass('is-valid')
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
                        emailinfeed.html('有邮箱跟你一样的人诶(○´･д･)ﾉ')
                        email.addClass('is-invalid')
                        email.removeClass('is-valid')
                        return false
                    }
                },
                error: function (data) {
                    emailfeed.html('哦耶ヾ(•ω•`)o')
                    email.addClass('is-valid')
                    email.removeClass('is-invalid')
                    return true
                }
            })
        }
    })

    // code.blur(function () {
    //     if (code.val() == '' || code.val() == null) {
    //         codeinfeed.html('没有验证码？(￣▽￣)"')
    //         code.addClass('is-invalid')
    //         code.removeClass('is-valid')
    //         return false
    //     } else if (!codepatrn.exec(code.val())) {
    //         codeinfeed.html('验证码是六位纯数字哦(#｀-_ゝ-)')
    //         code.addClass('is-invalid')
    //         code.removeClass('is-valid')
    //         return false
    //     } else {
    //         $.ajax({
    //             url: '../api/users/codecheck',
    //             type: 'POST',
    //             dataType: 'json',
    //             contentType: 'application/json;charset=utf-8',
    //             data: JSON.stringify({
    //                 'email': email.val(),
    //                 'code': $.md5(code.val())
    //             }),
    //             success: function (data) {
    //                 if (data) {
    //                     codefeed.html('哦耶ヾ(•ω•`)o')
    //                     code.addClass('is-valid')
    //                     code.removeClass('is-invalid')
    //                     return true
    //                 }
    //             },
    //             error: function (data) {
    //                 if (data) {
    //                     codeinfeed.html('验证码不对或者失效了哦，请重新发送！')
    //                     code.addClass('is-invalid')
    //                     code.removeClass('is-valid')
    //                     return false
    //                 }
    //             }
    //         })
    //     }
    // })

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

    qq.blur(function () {
        if (qq.val() == '' || qq.val() == null) {
            qqinfeed.html('你没有qq吗(⊙_⊙)？')
            qq.addClass('is-invalid')
            qq.removeClass('is-valid')
            return false
        } else if (!pwdpatrnnum.exec(qq.val())) {
            qqinfeed.html('你的QQ带字母的？(〃＞目＜)')
            qq.addClass('is-invalid')
            qq.removeClass('is-valid')
            return false
        } else if (!qqpatrn.exec(qq.val())) {
            qqinfeed.html('你好短噢(≧∀≦)ゞ')
            qq.addClass('is-invalid')
            qq.removeClass('is-valid')
            return false
        } else {
            qqfeed.html('好啦(oﾟvﾟ)ノ')
            qq.addClass('is-valid')
            qq.removeClass('is-invalid')
            return true
        }
    })

    finish.click(function () {
        if (user.val() == '' || user.val() == null) {
            userinfeed.html('不能不写用户名噢(￣▽￣)"')
            user.addClass('is-invalid')
            return false
        } 
        // else if(code.val() == '' || code.val() == null){
        //     codeinfeed.html('没有验证码？(￣▽￣)"')
        //     code.addClass('is-invalid')
        //     code.removeClass('is-valid')
        //     return false
        // }
        else if (email.val() == '' || email.val() == null) {
            emailinfeed.html('不能不写邮箱噢(￣▽￣)"')
            email.addClass('is-invalid')
            return false
        } else if (password.val() == '' || password.val() == null) {
            pwdinfeed.html('不能不写密码噢(￣▽￣)"')
            password.addClass('is-invalid')
            return false
        } else if (passwordcheck.val() == '' || passwordcheck.val() == null) {
            repwdinfeed.html('这里怎么是空的(；′⌒`)')
            passwordcheck.addClass('is-invalid')
            return false
        } else if (qq.val() == '' || qq.val() == null) {
            qqinfeed.html('你没有qq吗(⊙_⊙)？')
            qq.addClass('is-invalid')
            return false
        } else if (!check.is(':checked')) {
            checkinfeed.html('这个要看一下哦')
            check.addClass('is-invalid')
            return false
        } else if (valid) {
            return false
        } else {
            $.ajax({
                url: '../api/users/register',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'user': user.val(),
                    'email': email.val(),
                    'password': $.md5(password.val()),
                    'qq': qq.val(),
                    'token': $.md5(user.val() + mydate.toLocaleTimeString())
                }),
                success: function (e) {
                    jump(5)
                    return true
                },
                error: function (e) {
                    console.error(e)
                }
            })
        }
    })

    // let start
    // let time = 60//一分钟
    // function setTime() {
    //     if (time == 0) {
    //         send.removeAttr("disabled")
    //         send.text('发送')
    //         time = 60
    //         clearInterval(start)
    //         return false

    //     } else {
    //         send.attr("disabled", "")
    //         send.text(time + '秒后重新发送')
    //         time--
    //     }
    // }

    // send.click(function () {
    //     $.ajax({
    //         type: "POST",
    //         url: "../api/users/send",
    //         data: JSON.stringify({
    //             'email': $('#email').val()
    //         }),
    //         dataType: "json",
    //         contentType: 'application/json;charset=utf-8',
    //         success: function (response) {
    //             $('#codemail').modal('show')
    //             return true
    //         }
    //     })
    //     start = setInterval(function () {
    //         setTime(time)
    //     }, 1000)
    // })

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