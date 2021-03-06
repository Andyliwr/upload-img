// 时间选择控件中文化
(function($) {
  $.fn.datetimepicker.dates['zh-CN'] = {
    days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    daysMin: ['日', '一', '二', '三', '四', '五', '六', '日'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    today: '今天',
    suffix: [],
    meridiem: ['上午', '下午']
  }
}(jQuery))

var currentPage = 1 // 当前页数

function search(num) {
  $.ajax({
    method: 'GET',
    url: '/api/history/search?type=' + $('#search-type').val() + '&search_str=' + $('.search-group input').val() + '&sdate=' + $('.start-date-group .input-group input').val() + '&edate=' + $('.end-date-group .input-group input').val() + '&page=' + num + '&limit=10',
    dataType: 'json',
    timeout: '10000',
    success: function(res) {
      if (res.ok) {
        // 渲染dom
        var html = ''
        if(res.list.length > 0){
          $('#paginator').show()
          $('#no-data').hide()
          res.list.forEach(item => {
            html += '<tr><td>' + item.old_filename + '</td><td>' + item.filesize + '</td><td>' + item.time + '</td><td><a href="' + item.remote_url + '" target="_blank">' + item.remote_url + '</a></td></tr>'
          })
          $('#history .table tbody').html(html)
          $('#paginator').jqPaginator('option', {
            totalPages: Math.ceil(res.total / 10) || 1,
            totalCounts: res.total || 1,
            currentPage: 1,
            onPageChange: function(num, type) {
              search(num)
            }
          })
        }else{
          $('#no-data').show()
          $('#paginator').hide()
        }
              
      } else {
        showAlert('error', res.msg)
      }
    },
    error: function(err) {
      showAlert('error', '搜索失败')
    }
  })
}

function getList(page, limit) {
  if (!limit) limit = 10
  if (!page) page = 1
  limit = parseInt(limit)
  page = parseInt(page)
  if (page < 1) page = 1
  $.ajax({
    method: 'GET',
    url: '/api/history/list?page=' + page + '&limit=' + limit,
    dataType: 'json',
    timeout: '10000',
    success: function(res) {
      if (res.ok) {
        // 渲染dom
        var html = ''
        if(res.list.length > 0){
          $('#paginator').show()
          $('#no-data').hide()
          res.list.forEach(item => {
            html += '<tr><td>' + item.old_filename + '</td><td>' + item.filesize + '</td><td>' + item.time + '</td><td>' + item.remote_url + '</td></tr>'
          })
          $('#history .table tbody').html(html)
          $('#paginator').jqPaginator('option', {
            totalPages: Math.ceil(res.total / 10) || 1,
            totalCounts: res.total || 1,
            currentPage: page
          })
          currentPage = page
        }else{
          $('#no-data').show()
          $('#paginator').hide()
        }
      } else {
        showAlert('error', res.msg)
      }
    },
    error: function(err) {
      showAlert('error', '获取历史记录失败')
    }
  })
}
$(document).ready(function() {
  var $timeline_block = $('.content section')
  //hide timeline blocks which are outside the viewport
  $timeline_block.each(function() {
    if ($(this).offset().top > $(window).scrollTop() + $(window).height() * 0.75) {
      $(this).addClass('is-hidden')
    }
  })
  //on scolling, show/animate timeline blocks when enter the viewport
  $(window).on('scroll', function() {
    $timeline_block.each(function() {
      if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.75 && $(this).hasClass('is-hidden')) {
        $(this).removeClass('is-hidden').addClass('bounce-in')
      }
    })
  })

  $('.content article > h3').on('click', function() {
    if ($(this).hasClass('hide-more')) {
      $(this).removeClass('hide-more')
      $(this).parent().find('section').fadeIn()
    } else {
      $(this).addClass('hide-more')
      $(this).parent().find('section').fadeOut()
    }
  })

  // 设置时间选择控件
  $('.form_date').datetimepicker({
    language: 'zh-CN',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0,
    format: 'yyyy-mm-dd'
  })

  $('#search-type').on('change', function() {
    // 根据select的值展示不同的搜索方式
    if ($(this).val() == '0') {
      $('.start-date-group, .end-date-group').css('display', 'none')
      $('.search-group').css('display', 'inline-block')
    } else if ($(this).val() == '1') {
      $('.start-date-group, .end-date-group').css('display', 'inline-block')
      $('.search-group').css('display', 'none')
    }
  })

  // 获取历史纪录,初始化分页
  $('#paginator').jqPaginator({
    totalPages: 1,
    totalCounts: 1,
    pageSize: 10,
    visiblePages: 10,
    currentPage: currentPage,
    first: '',
    prev: '<li class="prev"><a href="javascript:void(0);">前一页</a></li>',
    next: '<li class="next"><a href="javascript:void(0);">后一页</a></li>',
    last: '',
    page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
    onPageChange: function(num, type) {
      getList(num, 10)
    }
  })

  $('.button-group > a').on('click', function() {
    search(1)
  })

  // 是否直接显示history页面
  if(window.location.hash == '#history'){
    $('#history-tab').trigger('click')
  }

  // 监听设置的保存按钮点击事件
  $('#save').click(function(){
    let setting = []
    $('#setting .options .option > input').each(function(){
      if($(this).attr('type') === 'text'){
        setting.push({
          stname: $(this).attr('name'),
          value: $(this).val()
        })
      } else {
        setting.push({
          stname: $(this).attr('name'),
          value: $(this).prop('checked')
        })
      }
    })
    // send ajax
    $.ajax({
      method: 'POST',
      url: '/api/setting',
      data: {
        setting
      },
      dataType: 'json',
      timeout: '10000',
      success: function(res) {
        if (res.ok) {
          showAlert('success', '保存设置成功')
        } else {
          showAlert('error', res.msg)
        }
      },
      error: function(err) {
        showAlert('error', '更新设置失败')
      }
    })
  })
})
