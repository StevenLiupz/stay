/**
 * Created by Steven on 2017/4/30.
 */
$(function(){ 
    var flag = true; // 定义一个变量用于记录当前动画是否执行完成
    var index = 1; // 用于记录轮播的次数 
    var timer = null; // 用于定时器
    var $swiper = $(".swiper-container .swiper-wrapper ul").eq(0);
    var $imgs = $swiper.find("li img"); // 轮播图的图片个数
    var imgHeight = $imgs.eq(0).height(); // 轮播图的图片高度
    var imgWidth = $imgs.eq(0).width(); // 轮播图的图片宽度

    setHeight(); // 初始化轮播图区域的高度
    // autoplay(); // 轮播图自动播放
    swiperIndexSet(); // 初始化轮播图的第一个下标样式 

    $(".swiper-wrapper>ul").css("left",-imgWidth); // 初始化移动轮播图至第一张图
    $(window).resize(function() { 
        setHeight(); // 根据窗口大小的变化动态设置轮播图区域的高度和图片宽度
    })

    $(".swiper-wrapper").hover(function(){
        clearInterval(timer);
        $(".swiper-button").show();
    },function(){
        autoplay();
        $(".swiper-button").hide();
    })

    /*APP的显示与隐藏*/   
    $(".stayAPP").parent('li').hover(function(){  
        $(this).children('.nav-appDown').show(); 
    },function(){
        // 这里利用事件冒泡的原理，虽然绝对定位的div脱离了标准流，但是依然会触发li的hover事件   
        $(this).children('.nav-appDown').hide(); 
    })

    /*设置轮播图区域的高度*/ 
    function setHeight(){   
        imgHeight = $imgs.eq(0).height(); // 获取图片的高
        // imgWidth = $imgs.eq(0).width(); // 通过jquey的width()方法获取到的宽是经过了四舍五入后的，因此无法获取到小数点
        // 使用原生的getBoundingClientRect()方法可以获取到元素的真实尺寸，包含小数点
        imgWidth = $imgs[0].getBoundingClientRect().width.toFixed(1); // 获取图片的宽 
        $swiper.css("left",-imgWidth*index); // 浏览器窗口变化时动态设置当前ul的位移
        $(".swiper-container").height(imgHeight); // 浏览器窗口变化时动态设置轮播图外层容器的高度
    }

    /*轮播图动画*/ 
    $(".swiper-button-next").click(function(){
        move();
    })
    $(".swiper-button-prev").click(function(){
        move(false); 
    })
    // 封装的轮播图动画
    function move(direction){
        if(flag){
            flag = false;
            if(typeof direction != "undefined" && direction == false){ // 判断轮播方向
                index--;
            }else if(typeof direction == "undefined" || direction == true){
                index++;
            }
            $(".swiper-index .swiper-index-item").removeClass("active").eq(index-1).addClass("active");
            $swiper.animate({
                left: -imgWidth * index
            },500,function(){
                flag = true;
                if (index == 0) {
                    index = 6;
                    $swiper.css("left",-imgWidth*index); 
                    swiperIndexSet();
                }else if (index == 7) {
                    index = 1;
                    $swiper.css("left",-imgWidth*index); 
                    swiperIndexSet();
                }
                $(".swiper-container .swiper-wrapper ul li>.content>a").removeClass("run");
                $(".swiper-container .swiper-wrapper ul li").eq(index).find(".content>a").addClass("run");
            })
        }
    }

    // 设置轮播图的下标样式
    function swiperIndexSet(){
        $(".swiper-index .swiper-index-item").removeClass("active").eq(index-1).addClass("active");
    }
    // 轮播图下标的点击跳转
    $(".swiper-index .swiper-index-item").each(function(i){   
        // 如何将i传入click函数中？
        // 这里要用立即执行函数进行传参的话需要在外部定义一个变量存this对象，否则在立即执行函数内部的this会指向window
        // let $that = $(this); 
        // (function(i){
        //  $that.on("click",function(){
        //      index = i + 1; 
        //      $swiper.css("left",-imgWidth*index);
        //  }); 
        // })(i);
        $(this).on("click",function(){
            index = $(this).index() + 1; 
            $swiper.css("left",-imgWidth*index);
            swiperIndexSet();
        })
    }) 

    function autoplay(speed){
        clearInterval(timer); 
        if(speed == "undefined" || isNaN(speed)){
            speed = 3500; // 设置自动播放的默认速度
        }
        timer = setInterval(function(){
            move();
        },speed);
    }
})