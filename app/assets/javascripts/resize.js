/*jslint devel:true, browser:true */
/*global $, window */

// 横幅 WIDTH関数を宣言
function resizeWidth() {
    'use strict';

    var mainWidth = $('#main').width(),
        sidebarWidth = $('#sidebar').width();

    $('#map').css('width', mainWidth - sidebarWidth);

}

// 高さ HEIGHT関数を宣言
function resizeHeight() {
    'use strict';

    var marginBottom = 20,
        mainOffsetTop = $('#main').offset().top,
        mainHeight = $(window).height() - mainOffsetTop - marginBottom;

    $('#main').css('height', mainHeight + 'px');
    $('#map').css('height', mainHeight + 'px');
    $('#sidebar').css('height', mainHeight + 'px');

}

// 画面のリサイズ
$(document).ready(function () {
    'use strict';
    resizeWidth();
    resizeHeight();
});

$(window).on('resize', function () {
    'use strict';
    resizeWidth();
    resizeHeight();
});
