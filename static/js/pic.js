window.addEventListener('DOMContentLoaded', function () {
    var avatar = document.getElementById('avatar')
    var picimage = document.getElementById('picimage')
    var piccrop = document.getElementById('piccrop')

    var user = document.getElementById('username').value
    var $picmodal = $('#upload')
    var $success = $('#uploadsuccess')
    var cropper

    piccrop.addEventListener('change', function (e) {
        var files = e.target.files
        var done = function (url) {
            piccrop.value = ''
            picimage.src = url
            $picmodal.modal('show')
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

    $picmodal.on('shown.bs.modal', function () {
        cropper = new Cropper(picimage, {
            aspectRatio: 1,
            viewMode: 3,
        })
    }).on('hidden.bs.modal', function () {
        cropper.destroy()
        cropper = null
    })

    document.getElementById('piccropend').addEventListener('click', function () {
        var initialAvatarURL
        var canvas

        $picmodal.modal('hide')

        if (cropper) {
            canvas = cropper.getCroppedCanvas({
                width: 300,
                height: 300,
            })
            initialAvatarURL = avatar.src
            avatar.src = canvas.toDataURL()
            canvas.toBlob(function (blob) {
                var formData = new FormData()

                formData.append('avatar', blob, `${user}.jpg`)
                $.ajax({
                    url: '../api/upload/pic',
                    method: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        avatar.src = avatar.src
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