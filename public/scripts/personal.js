// 时间选择控件中文化
(function($) {
    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今天",
        suffix: [],
        meridiem: ["上午", "下午"]
    };
}(jQuery));

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
        language: 'zh',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });
})