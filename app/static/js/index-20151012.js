// glass动画
var glassAnimate = function(){
    var showIntro = function(i,callback){
                $("#imgIntro"+i).css({visibility:"visible",position:"relative",left:0,top:0});
                $("#imgIntro"+i).animate({top:-120},500,"",callback);
    }
    
    var spendWorld = function(){
        var _height = $("#imgGlass").height();
        $world.animate({left:"0%",top:114,position:"absolute",width:"100%",height:_height },100,"",function(){
            
            showIntro(1,function(){
                showIntro(2,function(){
                    showIntro(3,function(){
                        showIntro(4);
                    })
                })
            })
            window.onresize =function(){
                var _top = $("#imgGlass").offset().top;
                $("#world").css({ top:114,width:"100%",height:"auto"});
            };
            
        });
    }
    var showWorld = function(callback){
        $world.animate({opacity:1},150,"",callback)
    }

    var hideWorld = function(callback){
        $world.animate({opacity:0},150,"",callback)
    }

    var toggleWorld = function(callback){
        hideWorld(function(){
            showWorld(callback);
        })
    };
    
    hasHide = false;
    var _height = $("#imgGlass").height();
    $world = $('#world').css({ width:"0%",height:10,position:"absolute",left:"50%",top:114+_height*0.4,visibility:"visible" });
    $world.animate({ top:114+_height*0.4,left:"0%",width:"100%",height:10,opacity:1},200,"",function(){
        toggleWorld(function(){
            toggleWorld(function(){
                spendWorld()
            });
        })
    });
}

var sunAnimate = function(){
    // 太阳光动画
    var _height = $("#imgGlare").height();
    $parent = $("#imgGlare").parent();
    var $black = $('<div>').appendTo($parent);
    $black.css({position:"absolute",right:0,top:0,width:"100%",height:_height,background:"#000"});
    $black.animate({width:"0%"},1500,"",function(){
        $("#imgTitle").css({position:"relative",left:0, top:80,visibility:"visible",opacity:0 });
        $("#imgTitle").animate({visibility:"visible",top:0,opacity:1},1000,"",function(){
            $("#imgWord").css({position:"relative",left:0, top:50,visibility:"visible",opacity:0 });
            $("#imgWord").animate({visibility:"visible",top:0,opacity:1},600);
            $black.remove();
        });
    });
}

var initHover = function(){
    $(".btn-weixin").hover(function(){
        var _left = $(this).offset().left;
        var _top = $(this).offset().top;
        var width = $(this).width();
        $qrcode = $("#qrcode")
        $qrcode.css({position:"absolute",left:_left+width+25,top:_top-20,width:150,height:139,opacity:0,visibility:"visible"});
        $qrcode.animate({width:150,height:139,opacity:1},200);
    },function(){
        var _left = $(this).offset().left;
        var _top = $(this).offset().top;
        var width = $(this).width();
        $qrcode = $("#qrcode")
        $qrcode.animate({width:150,height:139,opacity:0},200,"",function(){
            $qrcode.css({position:"absolute",left:_left+width+25,top:_top-20,width:150,height:139,opacity:0,visibility:"hidden"});
        });
    })
    
    $(".btn-hover").hover(function(){
        $hover = $(this);
        $hover.css({opacity:0.3});
        $hover.css({background:$hover.attr("hover-background")});
        $hover.animate({opacity:1},500)
    },function(){
        $hover = $(this);
        $hover.css({background:$hover.attr("background"),opacity:1});
    });
    
//    $(".btn-home").hover(function(){
//        $hover = $(this);
//        $hover.css({background:$hover.attr("hover-background")});
//    },function(){
//        $hover = $(this);
//        $hover.css({background:$hover.attr("background")});
//    });
}
var hasHide = true;
$(document).ready(function(){
        initHover();
        sunAnimate();

        var _top = $("#imgGlare").offset().top;
        var _height = $("#imgGlare").height();
        var scope = $("#imgGlass").height();
        var position = _top+_height;

        window.onscroll = function(e){
            var e =e || window.event;
            var scrolltop=document.documentElement.scrollTop||document.body.scrollTop;
            if(scrolltop>position-180){
                if(hasHide){
                    $("#imgGlass").animate({opacity:1},600)
                    glassAnimate();
                }
            }
            if(scrolltop>(_top-150) && scrolltop< position){
                var  scale = (position-scrolltop)/(_height+100);
                scale = scale>1.2?1.2:scale;
                $("#imgGlare").css({width:"82.5%", opacity:scale-0.2 });
            }
            if(scrolltop<(_top-150)){
                $("#imgGlare").css({
                    position:"relative",
                    top:scrolltop/2,
                    left:0
                })
            }
        }
        
        $("#btnSend").click(function(){
            var name = $("#yourName").val();
            if(name==""){ $("#yourName").focus();return false;}
            var email = $("#yourEmail").val();
            if(email==""){ $("#yourEmail").focus();return false;}
            var company = $("#yourCom").val();
            if(company==""){ $("#yourCom").focus();return false;}
            var content = $("#yourContent").val();
            if(content==""){ $("#yourContent").focus();return false;}
            
            var resetForm = function(){
                $("#yourName").val("");
                $("#yourEmail").val("");
                $("#yourCom").val("");
                $("#yourContent").val("");
            }
            
            $.ajax({
                url:"/indexmail/feedback",
                type:"post",
                dataType:"json",
                data:{
                    name:name,
                    company:company,
                    email:email,
                    content:content
                },
                success:function(){
                    alert("咨询内容发送成功!");
                    resetForm();
                },
                error:function(){
                    alert("咨询内容发送成功!");
                    resetForm();
                }
            });
            return false;
        });
});