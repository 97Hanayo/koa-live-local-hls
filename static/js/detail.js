$(document).ready(function updateinfo() {
    const detail = $('#detail')
    const change = $('#change')
    var $changeend = $('#changeend')

    change.click(function () {
        if (detail.val() == '' || detail.val() == null) {
            detail.val('这个人很懒')
        }
        $.ajax({
            url: '../api/users/edit',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
                'detail': detail.val()
            }),
            success: function (response) {
                $changeend.modal('show')
            },
            error: function (e) {
                console.error(e)
            }
        })
    })
})