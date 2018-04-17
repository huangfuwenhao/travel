/*
 * @Author: yachu
 * @Date:   2018-04-03 18:52:15
 * @Last Modified by:   yachu
 * @Last Modified time: 2018-04-09 11:47:25
 */

window.onload = function() {
    // 顶部广告 关闭
    var close = document.querySelector('.close');
    var ad = document.querySelector('.ad');
    close.onclick = function() {
        animate(ad, {
            'height': 0,
            'paddingBottom': 0
        }, function() {
            ad.parentNode.removeChild(ad);
        });
        ad.removeChild(close);
    };
    //固定导航
    var topAd = document.querySelector('.top-ad');
    var nav = document.querySelector('.top-head');
    var banner = document.querySelector('#banner');
    window.onscroll = function() {
        if (topAd.offsetHeight) {
            if (scroll().top > (topAd.offsetHeight)) {
                nav.style.position = 'fixed';
                banner.style.marginTop = topAd.offsetHeight + 'px';
            } else {
                nav.style.position = '';
                banner.style.marginTop = 0 + 'px';
            }
        } else {
            if (scroll().top > (nav.offsetHeight)) {
                nav.style.position = 'fixed';
                banner.style.marginTop = nav.offsetHeight + 80 + 'px';
            } else {
                nav.style.position = '';
                banner.style.marginTop = 0 + 'px';
            }
        }
    };
    // 获取滚动坐标的兼容函数
    function scroll() {
        return {
            left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
            top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        };
    }

    // 轮播图
    var banner = document.getElementById('banner');
    var screen = document.getElementsByClassName('screen')[0];
    var ul = document.querySelector('.screen ul');
    var ol = document.querySelector('.screen ol');
    var ulLis = document.querySelectorAll('#banner ul li');
    var imgs = document.querySelectorAll('#banner ul img');
    var olLis = document.querySelectorAll('#banner ol li');
    var arrow = document.getElementById('arrow');
    var left = document.getElementById('left');
    var right = document.getElementById('right');
    var leftHeight = window.getComputedStyle(left).height;
    var imgWidth = banner.offsetWidth;
    var index = 1;
    var timer = null;

    // 全屏轮播改造
    var cWidth = document.documentElement.clientWidth;
    var cHeight = document.documentElement.clientHeight - 160;
    banner.style.width = cWidth + 'px';
    banner.style.height = cHeight + 'px';
    screen.style.width = cWidth + 'px';
    screen.style.height = cHeight + 'px';
    ul.style.width = cWidth * ulLis.length + 'px';
    ul.style.left = -index * cWidth + 'px';
    left.style.top = cHeight / 2 - (leftHeight / 2) + 'px';
    right.style.top = left.style.top;
    for (var i = 0; i < ulLis.length; i++) {
        ulLis[i].style.width = cWidth + 'px';
        ulLis[i].style.height = cHeight + 'px';
    }

    window.onresize = function() {
        var cWidth = document.body.clientWidth || document.documentElement.clientWidth;
        var cHeight = document.documentElement.clientHeight;
        banner.style.width = cWidth + 'px';
        banner.style.height = cHeight + 'px';
        screen.style.width = cWidth + 'px';
        screen.style.height = cHeight + 'px';
        ul.style.width = cWidth * ulLis.length + 'px';
        ul.style.left = -index * cWidth + 'px';
        left.style.top = cHeight / 2 - (leftHeight / 2) + 'px';
        right.style.top = left.style.top;
        for (var i = 0; i < ulLis.length; i++) {
            ulLis[i].style.width = cWidth + 'px';
            ulLis[i].style.height = cHeight + 'px';
        }
    };

    // 1.自动轮播
    timer = setInterval(move, 3000);
    // 2. 鼠标事件
    banner.onmouseover = function() {
        ol.style.display = 'block';
        arrow.style.display = 'block';
        clearInterval(timer);
    };
    banner.onmouseout = function() {
        ol.style.display = '';
        arrow.style.display = '';
        timer = setInterval(move, 3000);
    };
    // 4.按钮点击
    right.onclick = function() {
        move(1);
    };
    left.onclick = function() {
        move(-1);
    };
    // 5.点击小圆点
    olLis.forEach(function(ol) {
        ol.onclick = function() {
            index = this.innerHTML - 0;
            animate(ul, {
                'left': -imgWidth * index
            });
            updateIndex();
        };
    });

    function move(dir) { //direction
        dir = dir || 1;
        if (index == 4) {
            index = 1;
            ul.style.left = -imgWidth * index + 'px';
        }
        if (index == 0) {
            index = 3;
            ul.style.left = -imgWidth * index + 'px';
        }
        index += dir;
        animate(ul, {
            'left': -imgWidth * index
        });
        // 3.处理小圆点背景色
        updateIndex();

    }

    function updateIndex() {
        for (var i = 0; i < olLis.length; i++) {
            olLis[i].className = '';
        }
        if (index == 4) {
            olLis[0].className = 'current';
        } else if (index == 0) {
            olLis[2].className = 'current';
        } else {
            olLis[index - 1].className = 'current';
        }
    }

    // 缓动动画封装 参数：1.对象，2.json格式数据，3.回调函数
    function animate(obj, json, callback) {
        clearInterval(obj.timer); // 进来先清理定时器 防止重复调用
        obj.timer = setInterval(function() {
            var flag = true; // 假设都已经执行完成
            for (key in json) { // 属性：属性值 attr：target  key:json[key]
                if (key === 'opacity') { // 透明度单独处理
                    var target = json[key] * 100; // 没有单位 0-1 所以先*100 最后再/100
                    var leader = getStyle(obj, key) * 100;
                    var step = (target - leader) / 10;
                    step = step > 0 ? Math.ceil(step) : Math.floor(step);
                    leader = leader + step;
                    obj.style[key] = leader / 100;
                } else if (key === 'zIndex') { // 层级单独处理
                    obj.style[key] = json[key]; // 不需要渐变 直接设置
                } else {
                    var target = json[key];
                    var leader = parseInt(getStyle(obj, key)) || 0; // 获取失败给个默认值 0
                    var step = (target - leader) / 10; // 缓动动画核心
                    step = step > 0 ? Math.ceil(step) : Math.floor(step); // 正数向上取整 负数向下取整
                    leader = leader + step;
                    obj.style[key] = leader + 'px';
                }
                if (leader !== target) {
                    flag = false; // 假设错误
                }
            }
            if (flag) { // 假设正确 清除定时器
                clearInterval(obj.timer);
                if (callback) {
                    callback(); // 有回调函数才调用
                }
            }
        }, 15);
    }

    // 获取任意属性值的兼容函数 参数1.对象  2.属性 返回属性值
    function getStyle(obj, attr) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(obj, null)[attr];
        } else {
            return obj.currentStyle[attr];
        }
    }

}

$(function() {
    // 服务 gif图
    $('.service li').each(function(i, li) {
        $(li).css({
            'background': 'url(./images/' + (i + 1) + '.jpg) no-repeat'
        });
    });
    $('.service li').mouseover(function() {
        var index = $(this).index();
        $(this).css({
            'background': 'url(./images/' + (index + 1) + '.gif) no-repeat'
        });
    });
    $('.service li').mouseout(function() {
        $('.service li').each(function(i, li) {
            $(li).css({
                'background': 'url(./images/' + (i + 1) + '.jpg) no-repeat'
            });
        });
    });
    // 蜜柚手风琴
    $('.column ul li a img').mouseover(function() {
        $(this).css({
            'marginTop': 0,
            'width': '300',
            'height': '460',
            'z-index': 10,
            'left': '-30px',
            'box-shadow': '0px 4px 18px 0px rgba(55, 17, 9, 0.4)'
        });
        $(this).parent().parent().children('div').css({
            'z-index': '10',
            'bottom': -30
        });
    });
    $('.column ul li a img').mouseout(function() {
        $(this).css({
            'marginTop': 30,
            'width': '231',
            'height': '400',
            'z-index': 0,
            'left': '0px',
            'box-shadow': 'none'
        });
        $('.column ul li div').css({
            'bottom': 0
        });
    });
    //艺龙手风琴
    $('.container ul li').each(function(i, li) {
        $(li).css('background-image', 'url(./images/20150120_ifold' + (i + 1) + '.jpg)');
        $(li).mouseover(function() {
            $('.container ul li').stop().animate({
                'width': '126px'
            }, 200);
            $(this).stop().animate({
                'width': '399px'
            }, 200);
        });
        $(li).mouseout(function() {
            $('.container ul li').stop().animate({
                'width': '165px'
            }, 200);
        });
    });
    //主体部分
    $('.pic ul li').mouseover(function() {
        $(this).children('a').stop().fadeIn('fast');
    });
    $('.pic ul li').mouseout(function() {
        $(this).children('a').stop().fadeOut('fast');
    });

    // strory
    $('.img-box').mouseenter(function() {
        $(this).children('.shadow').stop().fadeIn();
        $(this).children('a').stop().slideDown(200);
    });
    $('.img-box').mouseleave(function() {
        $(this).children('.shadow').stop().fadeOut();
        $(this).children('a').stop().slideUp(200);
    });

    //尾部
    $('.wechat-l').hover(function() {
        $(this).siblings().stop().fadeIn('normal');
    }, function() {
        $(this).siblings().stop().fadeOut('normal');
    });

    //回到顶部
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 100) {
            $('.rocket').show();
        } else {
            $('.rocket').hide();
        }
    });
    $('.rocket').click(function() {
        $('body,html').animate({
            scrollTop: 0
        }, 600);
    });
})

// 3D轮播图
$(function() {
    var bgc = ['#0da5d6', '#2AB561', '#DE8910', '#16BA9D', '#ec5e50', '#9c27b0', '#cddc39'];
    $('.sb-slider li').each(function(i, li) {
        $(this).css('background-color', bgc[i]);
    });
})
$(function() {
    var Page = (function() {
        var $navArrows = $('#nav-arrows').hide(),
            $navDots = $('#nav-dots').hide(),
            $nav = $navDots.children('span'),
            $shadow = $('#shadow').hide(),
            slicebox = $('#sb-slider').slicebox({
                orientation: 'h',
                colorHiddenSides: "rgba(204,204,204,.6)",
                autoplay: true, //是否自动开始切换
                disperseFactor: 30,
                onReady: function() {
                    $navArrows.show();
                    $navDots.show();
                    $shadow.show();
                },
                onBeforeChange: function(pos) {
                    $nav.removeClass('nav-dot-current');
                    $nav.eq(pos).addClass('nav-dot-current');
                }
            }),
            init = function() {
                initEvents();
            },
            initEvents = function() {
                $navArrows.children(':first').on('click', function() {
                    slicebox.pause();
                    slicebox.next();
                    slicebox.play();
                });
                $navArrows.children(':last').on('click', function() {
                    slicebox.pause();
                    slicebox.previous();
                    slicebox.play();
                });
                $nav.each(function(i) {
                    $(this).on('click', function(event) {
                        var $dot = $(this);
                        if (!slicebox.isActive()) {
                            $nav.removeClass('nav-dot-current');
                            $dot.addClass('nav-dot-current');
                        }
                        slicebox.pause();
                        slicebox.jump(i + 1);
                        slicebox.play();
                    });
                });

                $('#sb-slider').mouseenter(function() {
                    slicebox.pause();
                });

                $('#sb-slider').mouseleave(function() {
                    slicebox.play();
                });
            };
        slicebox.play();
        return {
            init: init
        };
    })();
    Page.init();
});

// 背景音乐
$(function() {
    $('.logo').click(function() {
        $('embed').remove();
    });
})