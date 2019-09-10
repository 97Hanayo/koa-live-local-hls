$(function () {
    const old = $('#old')
    const oldvalid = $('#oldvalid')

    const pwd = $('#pwd')
    const pwdvalid = $('#pwdvalid')

    const renew = $('#renew')
    const renewvalid = $('#renewvalid')

    const repwd = $('#repwd')

    var $resetpwd = $('#resetpwd')

    const pwdpatrnnum = /^[0-9]*$/
    const pwdpatrnstr = /^[A-Za-z]+$/
    const pwdpatrn = /^[A-Za-z0-9]{8,}$/

    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            repwd.click()
        }
    })

    old.blur(function () {
        if (old.val() == '' || old.val() == null) {
            oldvalid.html('你旧密码呢')
            old.addClass('is-invalid')
            old.removeClass('is-valid')
            return false
        } else {
            $.ajax({
                url: '../api/users/pwdcheck',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'old': $.md5(old.val())
                }),
                success: function (response) {
                    if (response.success == true) {
                        old.addClass('is-valid')
                        old.removeClass('is-invalid')
                        return true
                    } else {
                        oldvalid.html('跟旧密码不一样哦')
                        old.addClass('is-invalid')
                        old.removeClass('is-valid')
                        return false
                    }
                },
                error: function (e) {
                    console.error(e)
                }
            })
        }
    })

    pwd.blur(function () {
        if (pwd.val() == '' || pwd.val() == null) {
            pwdvalid.html('不能不写密码噢(￣▽￣)"')
            pwd.addClass('is-invalid')
            pwd.removeClass('is-valid')
            return false
        } else if (pwdpatrnnum.exec(pwd.val())) {
            pwdvalid.html('你怎么写的都是数字(′д｀σ)σ')
            pwd.addClass('is-invalid')
            pwd.removeClass('is-valid')
            return false
        } else if (pwdpatrnstr.exec(pwd.val())) {
            pwdvalid.html('你怎么写的都是字母(′д｀σ)σ')
            pwd.addClass('is-invalid')
            pwd.removeClass('is-valid')
            return false
        } else if (!pwdpatrn.exec(pwd.val())) {
            pwdvalid.html('好像不够长啊(#｀-_ゝ-)')
            pwd.addClass('is-invalid')
            pwd.removeClass('is-valid')
            return false
        } else if (pwd.val() == old.val()) {
            pwdvalid.html('旧的和新的一样？...(*￣０￣)ノ')
            pwd.addClass('is-invalid')
            pwd.removeClass('is-valid')
        } else {
            pwd.addClass('is-valid')
            pwd.removeClass('is-invalid')
            return true
        }
    })

    renew.blur(function () {
        if (renew.val() == '' || renew.val() == null) {
            renewvalid.html('这里怎么是空的(；′⌒`)')
            renew.addClass('is-invalid')
            renew.removeClass('is-valid')
            return false
        } else if (renew.val() != pwd.val()) {
            renewvalid.html('跟上面不一样啊,,ԾㅂԾ,,')
            renew.addClass('is-invalid')
            renew.removeClass('is-valid')
            return false
        } else if (renew.val() == pwd.val()) {
            renew.addClass('is-valid')
            renew.removeClass('is-invalid')
            return true
        }
    })

    repwd.click(function () {
        if (old.val() == '' || old.val() == null) {
            oldvalid.html('你旧密码呢')
            old.addClass('is-invalid')
            old.removeClass('is-valid')
            return false
        } else if (pwd.val() == '' || pwd.val() == null) {
            pwdvalid.html('不能不写密码噢(￣▽￣)"')
            pwd.addClass('is-invalid')
            pwd.removeClass('is-valid')
            return false
        } else if (renew.val() == '' || renew.val() == null) {
            renewvalid.html('这里怎么是空的(；′⌒`)')
            renew.addClass('is-invalid')
            renew.removeClass('is-valid')
            return false
        } else {
            $.ajax({
                url: '../api/users/pwdreset',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'password': $.md5(pwd.val())
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
                jump(count)
            } else {
                location.href = '/index'
            }
        }, 1000)
    }
})