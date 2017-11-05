function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

$(document).ready(function() {
    $('#input2').filer({
        limit: null,
        maxSize: null,
        extensions: null,
        changeInput: '<div class="jFiler-input-dragDrop"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>将文件拖动到此处</h3> <span style="display:inline-block; margin: 15px 0">或者</span></div><a class="jFiler-input-choose-btn blue">选择文件上传</a></div></div>',
        showThumbs: true,
        appendTo: null,
        theme: "dragdropbox",
        templates: {
            box: '<ul class="jFiler-item-list"></ul>',
            item: '<li class="jFiler-item">\
                            <div class="jFiler-item-container">\
                                <div class="jFiler-item-inner">\
                                    <div class="jFiler-item-thumb" data-toggle="modal" data-target="#myModal">\
                                        <div class="jFiler-item-status"></div>\
                                        <div class="jFiler-item-info">\
                                            <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name | limitTo: 25}}</b></span>\
                                        </div>\
                                        {{fi-image}}\
                                    </div>\
                                    <div class="jFiler-item-assets jFiler-row">\
                                        <ul class="list-inline pull-left">\
                                            <li>{{fi-progressBar}}</li>\
                                        </ul>\
                                        <ul class="list-inline pull-right">\
                                            <li><a class="icon-jfi-paperclip" data-toggle="modal" data-target="#myModal"></a></li>\
                                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                                        </ul>\
                                    </div>\
                                </div>\
                            </div>\
                        </li>',
            itemAppend: '<li class="jFiler-item">\
                            <div class="jFiler-item-container">\
                                <div class="jFiler-item-inner">\
                                    <div class="jFiler-item-thumb" data-toggle="modal" data-target="#myModal">\
                                        <div class="jFiler-item-status"></div>\
                                        <div class="jFiler-item-info">\
                                            <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name | limitTo: 25}}</b></span>\
                                        </div>\
                                        {{fi-image}}\
                                    </div>\
                                    <div class="jFiler-item-assets jFiler-row">\
                                        <ul class="list-inline pull-left">\
                                            <span class="jFiler-item-others">{{fi-icon}} {{fi-size2}}</span>\
                                        </ul>\
                                        <ul class="list-inline pull-right">\
                                            <li><a class="icon-jfi-paperclip" data-toggle="modal" data-target="#myModal"></a></li>\
                                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                                        </ul>\
                                    </div>\
                                </div>\
                            </div>\
                        </li>',
            progressBar: '<div class="bar"></div>',
            itemAppendToEnd: false,
            removeConfirmation: false,
            _selectors: {
                list: '.jFiler-item-list',
                item: '.jFiler-item',
                progressBar: '.bar',
                remove: '.jFiler-item-trash-action',
            }
        },
        uploadFile: {
            url: "/api/uploader",
            data: {},
            type: 'POST',
            enctype: 'multipart/form-data',
            beforeSend: function() {},
            success: function(data, el) {
                // 添加data-info属性
                if (data.data) {
                    el.attr('data-info', JSON.stringify(data.data))
                }
                var parent = el.find(".jFiler-jProgressBar").parent();
                el.find(".jFiler-jProgressBar").fadeOut("slow", function() {
                    $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Success  " + bytesToSize(data.data['x:size']) + "</div>").hide().appendTo(parent).fadeIn("slow");
                })
                // 点击弹出复制链接的弹窗
                $('.jFiler-item-thumb, .icon-jfi-paperclip').off('click').on('click', function(event) {
                    event.preventDefault()
                    var obj = $(this).parents('.jFiler-item').data('info')
                    $('#myModal .table td[data-type="url"]').html(obj.url)
                    $('#myModal .table td[data-type="md"]').html('![](' + obj.url + ')')
                    $('#myModal .table td[data-type="html"]').text('<img src="' + obj.url + '" alt="" />')
                    $('#myModal .table td[data-type="url"]+td .btn').attr('data-clipboard-text', obj.url)
                    $('#myModal .table td[data-type="md"]+td .btn').attr('data-clipboard-text', '![](' + obj.url + ')')
                    $('#myModal .table td[data-type="html"]+td .btn').attr('data-clipboard-text', '<img src="' + obj.url + '" alt="" />')
                    var clipboard_url = new Clipboard('#btn_copy_url');
                    clipboard_url.on('success', function(e) {
                        $('#myModal .table .op .btn>i').removeClass('icon-jfi-check').addClass('icon-jfi-files-o')
                        $('#myModal .table .op .btn>span').html('复制')
                        $(e.trigger).children('i').removeClass('icon-jfi-files-o').addClass('icon-jfi-check')
                        $(e.trigger).children('span').html('已复制')
                        e.clearSelection();
                    });
                    var clipboard_md = new Clipboard('#btn_copy_md');
                    clipboard_md.on('success', function(e) {
                        $('#myModal .table .op .btn>i').removeClass('icon-jfi-check').addClass('icon-jfi-files-o')
                        $('#myModal .table .op .btn>span').html('复制')
                        $(e.trigger).children('i').removeClass('icon-jfi-files-o').addClass('icon-jfi-check')
                        $(e.trigger).children('span').html('已复制')
                        e.clearSelection();
                    });
                    var clipboard_html = new Clipboard('#btn_copy_html');
                    clipboard_html.on('success', function(e) {
                        $('#myModal .table .op .btn>i').removeClass('icon-jfi-check').addClass('icon-jfi-files-o')
                        $('#myModal .table .op .btn>span').html('复制')
                        $(e.trigger).children('i').removeClass('icon-jfi-files-o').addClass('icon-jfi-check')
                        $(e.trigger).children('span').html('已复制')
                        e.clearSelection();
                    });
                })
            },
            error: function(el) {
                var parent = el.find(".jFiler-jProgressBar").parent()
                el.find(".jFiler-jProgressBar").fadeOut("slow", function() {
                    $("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-minus-circle\"></i> Error</div>").hide().appendTo(parent).fadeIn("slow");
                })
            },
            statusCode: {},
            onProgress: function() {}
        },
        dragDrop: {
            dragEnter: function() {},
            dragLeave: function() {},
            drop: function() {}
        },
        addMore: true,
        clipBoardPaste: true,
        excludeName: null,
        beforeShow: function() { return true },
        onSelect: function() {},
        afterShow: function() {},
        onRemove: function() {},
        onEmpty: function() {},
        captions: {
            button: "选择文件",
            feedback: "选中文件上传",
            feedback2: "文件已经被选中",
            drop: "拖放图片或者点击上传",
            removeConfirmation: "确定要删除此文件吗?",
            errors: {
                filesLimit: "Only {{fi-limit}} files are allowed to be uploaded.",
                filesType: "Only Images are allowed to be uploaded.",
                filesSize: "{{fi-name}} is too large! Please upload file up to {{fi-maxSize}} MB.",
                filesSizeAll: "Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB."
            }
        }
    })

})