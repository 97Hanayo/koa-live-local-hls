$(function () {
    $.get('../api/manage/all', (data) => {
        let e_check = 0
        let i_check = 0
        let ask_check = 0
        let isindex = 0
        for (var i = 0; i < data.length; i++) {
            if (data[i].email_check != 'yes') {
                e_check++
            }
            if (data[i].index != 'yes') {
                i_check++
            }
            if (data[i].ask == 'yes' && data[i].livestatus == 'no') {
                ask_check++
            }
            if (data[i].index == 'yes') {
                isindex++
            }
        }

        $('#all').val(data.length)
        $('#isindex').val(isindex)
        $('#emailcheck').val(e_check)
        $('#ask').val(ask_check)

        //申请
        const askData = function () {
            const l = [];
            for (var i = 0; i < data.length; i++) {
                const m = data[i]
                if (m.ask == 'yes' && m.livestatus == 'no') {
                    const d = {
                        'num': i,
                        'name': m.user,
                        'qq': m.qq,
                        'level': m.level,
                        'ask': m.ask
                    }
                    l.push(d)
                }
            }
            return l
        }
        $('#ask_table').bootstrapTable({
            pagination: true,
            sortOrder: "desc",
            search: true,
            pageNumber: 1,//初始化加载第一页，默认第一页
            pageSize: 10, //每页显示
            pageList: [10],
            columns: [{
                field: 'num',
                title: '#'
            }, {
                field: 'name',
                title: '用户名'
            }, {
                field: 'qq',
                title: 'QQ'
            }, {
                field: 'level',
                title: '等级',
                formatter: level
            }, {
                field: 'ask',
                title: '直播权限',
                formatter: ask
            }],
            data: askData(data)
        })

        //修改操作
        $('#ask_req').on('click', 'button', function (event) {
            let $id = $(this).attr('id')
            let $livestatus
            if (!$(`#ask_req #${$id}`).hasClass('btn-danger')) {
                $(`#ask_req #${$id}`).removeClass('btn-success')
                $(`#ask_req #${$id}`).addClass('btn-danger')
                $(`#ask_req #${$id}`).html('撤销')
                $livestatus = 'yes'
            } else {
                $(`#ask_req #${$id}`).removeClass('btn-danger')
                $(`#ask_req #${$id}`).addClass('btn-success')
                $(`#ask_req #${$id}`).html('允许')
                $livestatus = 'no'
            }
            $.ajax({
                //access
                type: "POST",
                url: "../api/manage/askset",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'user': $id,
                    'livestatus': $livestatus
                }),
                dataType: "json",
                success: function (response) {
                    return true
                }
            })
        })

        //首页显示
        const indexData = function () {
            const l = [];
            for (var i = 0; i < data.length; i++) {
                const m = data[i]
                if (m.index == 'yes') {
                    const d = {
                        'num': i,
                        'name': m.user,
                        'index': m.index
                    }
                    l.push(d)
                }
            }
            return l
        }
        $('#index_table').bootstrapTable({
            pagination: true,
            sortOrder: "desc",
            search: true,
            pageNumber: 1,//初始化加载第一页，默认第一页
            pageSize: 10, //每页显示
            pageList: [10],
            columns: [{
                field: 'num',
                title: '#'
            }, {
                field: 'name',
                title: '用户名'
            }, {
                field: 'index',
                title: '显示状态',
                formatter: index
            }],
            data: indexData(data)
        })

        //修改操作
        $('#index_req').on('click', 'button', function (event) {
            let $id = $(this).attr('id')
            let $index
            if (!$(`#index_req #${$id}`).hasClass('btn-danger')) {
                $(`#index_req #${$id}`).removeClass('btn-success')
                $(`#index_req #${$id}`).addClass('btn-danger')
                $(`#index_req #${$id}`).html('撤销')
                $index = 'no'
            } else {
                $(`#index_req #${$id}`).removeClass('btn-danger')
                $(`#index_req #${$id}`).addClass('btn-success')
                $(`#index_req #${$id}`).html('撤下')
                $index = 'yes'
            }
            $.ajax({
                type: "POST",
                url: "../api/manage/indexset",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'user': $id,
                    'index': $index
                }),
                dataType: "json",
                success: function (response) {
                    //todo
                    return true
                }
            })
        })

        //直播权限
        const statusdata = function () {
            const l = [];
            for (var i = 0; i < data.length; i++) {
                const m = data[i]
                const d = {
                    'num': i,
                    'name': m.user,
                    'qq': m.qq,
                    'livestatus': m.livestatus
                }
                l.push(d)
            }
            return l
        }
        $('#livestatus_table').bootstrapTable({
            pagination: true,
            sortOrder: "desc",
            search: true,
            pageNumber: 1,//初始化加载第一页，默认第一页
            pageSize: 10, //每页显示
            pageList: [10],
            columns: [{
                field: 'num',
                title: '#'
            }, {
                field: 'name',
                title: '用户名'
            }, {
                field: 'livestatus',
                title: '直播权限',
                formatter: livestatus
            }],
            data: statusdata(data)
        })

        //修改操作
        $('#livestatus_req').on('click', 'button', function (event) {
            let $id = $(this).attr('id')
            let $livestatus
            if (!$(`#livestatus_req #${$id}`).hasClass('btn-danger')) {
                $(`#livestatus_req #${$id}`).removeClass('btn-success')
                $(`#livestatus_req #${$id}`).addClass('btn-danger')
                $(`#livestatus_req #${$id}`).html('未开启')
                $livestatus = 'no'
            } else {
                $(`#livestatus_req #${$id}`).removeClass('btn-danger')
                $(`#livestatus_req #${$id}`).addClass('btn-success')
                $(`#livestatus_req #${$id}`).html('已开启')
                $livestatus = 'yes'
            }
            $.ajax({
                type: "POST",
                url: "../api/manage/livestatusset",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'user': $id,
                    'livestatus': $livestatus
                }),
                dataType: "json",
                success: function (response) {
                    //todo
                    return true
                }
            })
        })

        //邮箱验证
        const emaildata = function () {
            const l = [];
            for (var i = 0; i < data.length; i++) {
                const m = data[i]
                const d = {
                    'num': i,
                    'name': m.user,
                    'email': m.email,
                    'email_check': m.email_check
                }
                l.push(d)
            }
            return l
        }
        $('#email_table').bootstrapTable({
            pagination: true,
            sortOrder: "desc",
            search: true,
            pageNumber: 1,//初始化加载第一页，默认第一页
            pageSize: 10, //每页显示
            pageList: [10],
            columns: [{
                field: 'num',
                title: '#'
            }, {
                field: 'name',
                title: '用户名'
            }, {
                field: 'email',
                title: '邮箱'
            }, {
                field: 'email_check',
                title: '邮箱验证',
                formatter: emailstatus
            }],
            data: emaildata(data)
        })

        //修改操作
        $('#email_req').on('click', 'button', function (event) {
            let $id = $(this).attr('id')
            let $email
            if (!$(`#email_req #${$id}`).hasClass('btn-danger')) {
                $(`#email_req #${$id}`).removeClass('btn-success')
                $(`#email_req #${$id}`).addClass('btn-danger')
                $(`#email_req #${$id}`).html('未验证')
                $email = 'no'
            } else {
                $(`#email_req #${$id}`).removeClass('btn-danger')
                $(`#email_req #${$id}`).addClass('btn-success')
                $(`#email_req #${$id}`).html('撤销')
                $email = 'yes'
            }
            $.ajax({
                type: "POST",
                url: "../api/manage/emailset",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'user': $id,
                    'email_check': $email
                }),
                dataType: "json",
                success: function (response) {
                    //todo
                    return true
                }
            })
        })

        //管理设置
        const managedata = function () {
            const l = [];
            for (var i = 0; i < data.length; i++) {
                const m = data[i]
                const d = {
                    'num': i,
                    'name': m.user,
                    'qq': m.qq,
                    'level': m.level
                }
                l.push(d)
            }
            return l
        }
        $('#manage_table').bootstrapTable({
            pagination: true,
            sortOrder: "desc",
            search: true,
            pageNumber: 1,//初始化加载第一页，默认第一页
            pageSize: 10, //每页显示
            pageList: [10],
            columns: [{
                field: 'num',
                title: '#'
            }, {
                field: 'name',
                title: '用户名'
            }, {
                field: 'qq',
                title: 'QQ'
            }, {
                field: 'level',
                title: '管理',
                formatter: managestatus
            }],
            data: managedata(data)
        })

        //修改操作
        $('#manage_req').on('click', 'a', function (event) {
            let $id = $(this).parent().prev('button').attr('id')
            let $level = $(this).attr('value')
            if ($level == '3') {
                $(`#manage_req #${$id}`).html('管理')
            } else if ($level == '1') {
                $(`#manage_req #${$id}`).html('普通用户')
            }
            $.ajax({
                type: "POST",
                url: "../api/manage/manageset",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    'user': $id,
                    'level': $level
                }),
                dataType: "json",
                success: function (response) {
                    //todo
                    return true
                }
            })
        })

        function level(value, row, index) {
            switch (value) {
                case 1:
                    return '普通用户'
                case 3:
                    return '管理'
                case 0:
                    return '小黑屋'
                case 5:
                    return '超管'
            }
        }

        function ask(value, row, index) {
            if (value == 'yes') {
                return `<button class='btn btn-success' id="${row.name}">允许</button>`
            }
        }

        function index(value, row, index) {
            if (value == 'yes') {
                return `<button class='btn btn-success' id="${row.name}">撤下</button>`
            }
        }

        function livestatus(value, row, index) {
            if (value == 'yes') {
                return `<button class='btn btn-success' id="${row.name}">已开启</button>`
            } else {
                return `<button class='btn btn-danger' id="${row.name}">未开启</button>`
            }
        }

        function emailstatus(value, row, index) {
            if (value == 'yes') {
                return `<span>已验证</span>`
            } else {
                return `<button class='btn btn-danger' id="${row.name}">未验证</button>`
            }
        }

        function managestatus(value, row, index) {
            if (value == '3') {
                return `
                <div class="d-flex">
                    <div class="dropdown mr-1">
                        <button type="button" class="btn btn-success dropdown-toggle" id="${row.name}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="10,20">
                            管理
                        </button>
                        <div class="dropdown-menu" aria-labelledby="${row.name}">
                            <a class="dropdown-item" href="#" value="1">普通用户</a>
                            <a class="dropdown-item" href="#" value="3">管理</a>
                        </div>
                    </div>
                </div>`
            } else if (value == '1') {
                return `
                <div class="d-flex">
                    <div class="dropdown mr-1">
                        <button type="button" class="btn btn-success dropdown-toggle" id="${row.name}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="10,20">
                            普通用户
                        </button>
                        <div class="dropdown-menu" aria-labelledby="${row.name}">
                            <a class="dropdown-item" href="#" value="1">普通用户</a>
                            <a class="dropdown-item" href="#" value="3">管理</a>
                        </div>
                    </div>
                </div>`
            }
        }
    })
})