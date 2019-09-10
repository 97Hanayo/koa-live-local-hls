window.addEventListener('DOMContentLoaded', function () {
    var bgimg = document.getElementById('bgimg')
    var bgimage = document.getElementById('bgimage')
    var bgcrop = document.getElementById('bgcrop')

    var user = document.getElementById('username').value
    var $bgmodal = $('#bgupload')
    var $success = $('#uploadsuccess')
    var cropper

    bgcrop.addEventListener('change', function (e) {
        var files = e.target.files
        var done = function (url) {
            bgcrop.value = ''
            bgimage.src = url
            $bgmodal.modal('show')
        }
        var reader
        var file
        var url

        if (files && files.length > 0) {
            file = files[0]

            if (URL) {
                done(URL.createObjectURL(file))
            } else if (FileReader) {
                reader = new FileReader()
                reader.onload = function (e) {
                    done(reader.result)
                }
                reader.readAsDataURL(file)
            }
        }
    })

    $bgmodal.on('shown.bs.modal', function () {
        cropper = new Cropper(bgimage, {
            aspectRatio: 16 / 9,
            viewMode: 3,
        })
    }).on('hidden.bs.modal', function () {
        cropper.destroy()
        cropper = null
    })

    document.getElementById('bgcropend').addEventListener('click', function () {
        var initialAvatarURL
        var canvas

        $bgmodal.modal('hide')

        if (cropper) {
            canvas = cropper.getCroppedCanvas({
                width: 384,
                height: 216,
            })
            initialAvatarURL = bgimg.src
            bgimg.src = canvas.toDataURL()
            canvas.toBlob(function (blob) {
                var formData = new FormData()

                formData.append('bgimg', blob, `${user}.jpg`)
                $.ajax({
                    url: '../api/upload/bg',
                    method: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        bgimg.src = bgimg.src
                        $success.modal('show')
                    },
                    error: function (e) {
                        console.log(e)
                    }
                })
            })
        }
    })
})