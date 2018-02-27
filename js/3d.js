(function ($) {
    $.fn.lucky = function (opt) {
        var opts = {
            row: 7, //每排显示个数  必须为奇数
            col: 5, //每列显示个数  必须为奇数
            depth: 6, //纵深度
            iconW: 30, //图片的宽
            iconH: 30, //图片的高
            iconRadius: 8, //图片的圆角
            data: personArray, //图片的地址数据
        }
        var _self = $(this);
        var settings = $.extend({}, opts, opt);
        var M = {
            WinHeight: $(this).height(),
            winWidth: $(this).width(),
            isThisTag: false,
            centerX: Math.ceil(settings.row / 2) - 1,
            centerY: Math.ceil(settings.col / 2) - 1,
            timer: null,
            isStop: false,
        };

        // 初始化应用
        var initFun = function () {
            initEleFun();
            stepFun();
        };
        var initEleFun = function () {
            for (var i = 0; i < settings.depth; i++) {
                createEleFun(i);
            }
        }

        var createEleFun = function (n) {

            // 创建所有的dom元素
            var eleStr = '';
            for (var i = 0; i < settings.row; i++) {
                for (var r = 0; r < settings.col; r++) {
                    if (i == M.centerX && r == M.centerY) {
                        if (!M.isThisTag) {

                            eleStr += '<div style="' + styleFun(i, r) + '" class="js_current_dom"></div>';
                            M.isThisTag = true;

                        }

                    } else {
                        eleStr += '<div data-depth="' + n + '" style="' + styleFun(i, r) + '" class="element"></div>';
                    }
                }
            }
            _self.append(eleStr);
        }

        //设置每个头像的位置与样式
        var styleFun = function (i, r) {
            onlyWidth = M.winWidth / settings.row,
                onlyHeight = M.WinHeight / settings.col,
                onlyCenterW = (M.winWidth / settings.row - settings.iconW) / 2,
                onlyCenterH = (M.WinHeight / settings.col - settings.iconH) / 2;
            var style = 'position:absolute;width:' + settings.iconW + 'px;height:' + settings.iconH + 'px;border-radius:' + settings.iconRadius + 'px;left:' + (i * onlyWidth + onlyCenterW) + 'px;top :' + (r * onlyHeight + onlyCenterH) + 'px;';
            return style;
        }

        //让每个头像运动
        var stepFun = function () {

            var index = 0, elements = $('.element').length;
            for (var i = 0; i < elements; i++) {
                var element = $('.element')[i];
                if (!!settings.data[i]) {
                    $(element).css('background-image', 'url(' + settings.data[i].image + ')');
                } else {
                    index >= (settings.data.length - 1) ? index = 1 : ++index;
                    $(element).css('background-image', 'url(' + settings.data[index].image + ')');
                }

                var depth = $(element).attr('data-depth');
                Transform(element);
                element.translateZ = -depth * 200;

                setTimeout(function (element) {
                    var random = Math.floor(Math.random() * 3) + 15;
                    tick(function () {
                        if (!M.isStop) {
                            element.translateZ >= 200 ? element.translateZ = -depth * 200 : element.translateZ += random;
                        }
                    })
                }(element), 200)
            }

            //中间的头像运动
            var thisElement = $('.js_current_dom')[0];
            Transform(thisElement);
            tick(function () {
                thisElement.translateZ >= 200 ? thisElement.translateZ = 0 : thisElement.translateZ += 15;
            })
        }

        var preloadImg = function(arr){

        }

        //让中间的头像随机切换背景图
        var randomFun = function () {

            M.timer = setInterval(function () {
                //如果内定号码不存在，则为随机号码
                var randomNum = Math.floor(Math.random() * settings.data.length); //（随机数）

                $('.js_current_dom').css({
                   'background-image': 'url(' + settings.data[randomNum].image + ')'
                })
            }, 50)
        }
        //停止运动
        M.stop = function () {
            clearInterval(M.timer);
            M.isStop = true;
        }
        //开始运动
        M.open = function () {
            randomFun();
            M.isStop = false;
        }
        initFun();
        return M;
    }

})(jQuery);