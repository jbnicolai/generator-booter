require('modernizr');
require('bootstrap');

$(function(){
    require('./modules/breakpoints')();
    require('./modules/textfill')();
    require('./modules/custom')();
})