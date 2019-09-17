$(function () {
    let user = $('#user').text()
    let roomdetail = $('#roomdetail').val()
    let hls = $('#hls').val()
    //初始页面状态判断
    $.get("../api/users/status", function (data) {
        $('#type').val(data.livetype)
        if (data.index == 'no') {
            $('#livenow').css('display', 'none')
            $('#livebegin').css('display', 'inline')
            $('#livesetting').css('display', 'none')
        } else {
            $('#livebegin').css('display', 'none')
            $('#livenow').css('display', 'inline')
            $('#livesetting').css('display', 'inline')
        }
    })
    $('#ask').click(function () {
        $.ajax({
            type: "POST",
            url: "../api/users/ask",
            data: JSON.stringify({
                'ask': 'yes'
            }),
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            success: function (response) {
                $('#sendask').modal('show')
                $('#ask').attr('disabled', '')
            }
        })
    })
    $('#type').click(function () {
        $('#type').removeClass('is-invalid')
    })
    $('#roomdetail').bind('input propertychange', function () {
        $('#detaillive').text($(this).val())
    })
    $('#liveopen').click(function () {
        if ($('#type').val() == 'none') {
            $('#typevalid').html('要选择分类才能直播')
            $('#type').addClass('is-invalid')
            $('#type').removeClass('is-valid')
            return false
        } else {
            $.ajax({
                type: "POST",
                url: "../api/users/indexset",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'index': 'yes',
                    'type': $('#type').val(),
                    'roomdetail': roomdetail,
                    'hls': hls
                }),
                dataType: "json",
                success: function (data) {
                    $('#hls').val(data.hls)
                    $('#type').removeClass('is-invalid')
                    $('#livebegin').css('display', 'none')
                    $('#livenow').css('display', 'inline')
                    $('#livesetting').css('display', 'inline')
                    return true
                }
            })
        }
    })
    $('#liveclose').click(function () {
        $.ajax({
            type: "POST",
            url: "../api/users/indexset",
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
                'index': 'no',
                'type': 'none',
                'roomdetail': roomdetail
            }),
            dataType: "json",
            success: function (response) {
                $('#livenow').css('display', 'none')
                $('#livebegin').css('display', 'inline')
                $('#livesetting').css('display', 'none')
                return true
            }
        })
    })
    $('#urlsave').click(function () {
        $.ajax({
            type: "POST",
            url: "../api/users/detailset",
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
                'hls': $('#hls').val(),
                'roomdetail': $('#roomdetail').val()
            }),
            dataType: "json",
            success: function (response) {
                $('#hlssend').modal('show')
                return true
            }
        })
    })
})
