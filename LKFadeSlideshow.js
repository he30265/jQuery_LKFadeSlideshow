/**
 * Title: LKFadeSlideshow
 * Version: 1.1.1
 * Description: plugin
 * Author: LiuZhenghe
 * Date: 2019-01-03
 */

(function($) {
    // What does the LKFadeSlideshow plugin do?
    $.fn.LKFadeSlideshow = function(options) {

        if (!this.length) {
            return this;
        };

        var opts = $.extend(true, {}, $.fn.LKFadeSlideshow.defaults, options);

        this.each(function() {
            var $this = $(this);
            var slide_container = $(this).find('.slide_container');
            var slide_wrapper = $(this).find('.slide_wrapper');
            var slide_item = $(this).find('.slide_item');
            var pagination = $(opts.pagination);
            var paginationNum = opts.paginationNum;
            var paginationClickable = opts.paginationClickable;
            var page_text = "";
            var item_length = slide_item.length;
            var arrow_left = $(opts.arrow_left);
            var arrow_right = $(opts.arrow_right);
            var autoPlay;
            var speed = opts.speed; // 切换速度
            var initialItem = opts.initialItem; // 初始化索引
            // 不设置初始化索引值，或设置的值超过轮播元素的个数，默认为0。
            if (initialItem == null || initialItem > item_length - 1) {
                initialItem = 0;
            };
            // 设置初始化显示与隐藏的元素。
            slide_item.eq(initialItem).animate({
                opacity: "1"
            }, 0);
            slide_item.eq(initialItem).siblings().animate({
                opacity: "0"
            }, 0);

            // 动态设置轮播区域高度
            var slide_height = slide_item[0].clientHeight;
            slide_wrapper.css('height', slide_height);

            // 分页相关设置
            // 当不设置 paginationNum 的值或设置为 true 时，分页中添加数字。
            if (paginationNum != true) {
                for (var i = 1; i <= item_length; i++) {
                    page_text += "<span></span>";
                };
            } else {
                for (var i = 1; i <= item_length; i++) {
                    page_text += "<span>" + i + "</span>";
                };
            };
            // 动态添加分页
            pagination.html(page_text);
            // 给分页加当前样式
            var pagination_list = pagination.children('span');
            for (var i = 0; i < pagination_list.length; i++) {};
            $(pagination_list[initialItem]).addClass('active');

            // 切换主方法：
            // 传入两个参数：tag,page_index。
            // tag："0"表示点击左箭头，"1"表示点击右箭头，"2"表示点击分页。
            // page_index：在主方法中无法获取被点击元素的索引值，永远是-1，所以需要传入一个参数来获得。
            function slideMove(tag, page_index) {
                // 清除定时器
                // 不清除定时器，就会创建出多个定时器，切换速度会越来越快。
                clearInterval(autoPlay);
                slide_item.stop(true, true); // 清除多次点击事件

                // 点击左箭头执行事件
                if (tag == 0) {
                    initialItem--;
                    if (initialItem < 0) {
                        initialItem = item_length - 1;
                    };
                };

                // 点击右箭头执行事件
                if (tag == 1) {
                    initialItem++;
                    if (initialItem > item_length - 1) {
                        initialItem = 0;
                    };
                };

                // 点击分页执行事件
                if (tag == 2) {
                    initialItem = page_index;
                };

                // 切换效果
                slide_item.eq(initialItem).animate({
                    opacity: "1"
                }, speed);
                slide_item.eq(initialItem).siblings().animate({
                    opacity: "0"
                }, speed);
                pagination_list.eq(initialItem).siblings().removeClass('active');
                pagination_list.eq(initialItem).addClass('active');

                // 自动轮播2
                // 当前位置改变后再次触发右箭头点击事件，此时就可以一直循环点击事件。
                if (typeof(opts.autoPlay) != "number") {
                    clearInterval(autoPlay);
                } else {
                    autoPlay = setTimeout(function() {
                        slideMove(1);
                    }, opts.autoPlay);
                };

            };

            // 自动轮播1
            // 触发第一次右箭头点击事件。
            // 此处做了一个判断，当调用该插件时，如果不设置 autoPlay 的值或设置为 fales 等其他值时，不执行自动轮播事件。
            if (typeof(opts.autoPlay) != "number") {
                clearInterval(autoPlay);
            } else {
                autoPlay = setTimeout(function() {
                    slideMove(1);
                }, opts.autoPlay);
            };

            // 点击左箭头
            arrow_left.click(function(event) {
                event.preventDefault();
                slideMove(0);
                return false;
            });

            // 点击右箭头
            arrow_right.click(function(event) {
                event.preventDefault();
                slideMove(1);
                return false;
            });

            // 点击分页
            // 加一个判断条件：当 paginationClickable 为 true 是，触发分页点击事件，默认无点击事件。
            if (paginationClickable == true) {
                pagination.on('click', 'span', function(event) {
                    event.preventDefault();
                    slideMove(2, $(this).index());
                });
            };

        });

        return this;
    };

    // default options
    $.fn.LKFadeSlideshow.defaults = {
        autoPlay: null, // 自动轮播
        speed: null, // 速度
        initialItem: null, // 初始化索引
        pagination: null, //  分页
        paginationNum: null, // 数字分页
        paginationClickable: null, // 点击分页切换
        arrow_left: null, // 点击左箭头
        arrow_right: null // 点击右箭头
    };

})(jQuery);