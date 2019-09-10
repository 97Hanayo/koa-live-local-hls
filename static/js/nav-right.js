$(function () {
    $("[data-tooltip='tooltip']").tooltip()
    $("[data-popover='popover']").popover()
    $('#loginbtn').click(function () {
        $('#loginbtn').popover('hide')
    })
    $('#refresh').click(function () {
        window.location.reload()
    })
    $('#logoutbtn').click(function () {
        window.location.href = '../api/users/logout'
    })
    $('#account').click(function () {
        window.location.href = '../account'
    })
    $('#manage').click(function () {
        window.location.href = '../manage'
    })
})