var scrollEvent = function(className,callback,flag){
    var $jumbotron = $("." + className);
    var index = 0;
    var length = $jumbotron.length;
    var isAnimation = false;
    var toPosition = function(){
        isAnimation = true;
        var position = $($jumbotron[index]).position();
        $("html,body").animate({scrollTop: position.top + "px"},800,"swing",function(){
            isAnimation = false;
            callback(index)
        })
    };
    var getPosition = function(_top,wheelDelta){
        var _index = 0;
        for(var i = 0; i < length ; i++){
            var position = $($jumbotron[i]).position();
            if(_top>=position.top){
                _index = i;
            }
        }
        var _position = $($jumbotron[_index]).position().top;
        var height = $($jumbotron[_index]).height();
         if(!isNaN(_top)&&!isNaN(_position)&&!isNaN(height)){
             callback(_index,_top,wheelDelta,_position,height);
         }
    };
    var toTop = function(){
        if(isAnimation){
            return;
        }
        if(index>0){
            index = index -1;
        }else{
            index = 0;
        }
        toPosition();
    };
    var toBottom = function(){
        if(isAnimation){
            return;
        }
        if(index<length-1){
            index = index + 1;
        }else{
            index = length - 1;
        }
         toPosition();
    };
    return{
        init: function(){
            if(flag){
                window.onkeydown = function(e){
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    var keyCode = e.which?e.which:e.keyCode;
                    switch(keyCode){
                            //pageUp
                            case 33:
                               
                            case 104:
                    }
                }
            }else{
                var last_top = document.documentElement.scrollTop || document.body.scrollTop;
                var mouseWheel = function(e){
                    e = e || window.event;
                    var _top = document.documentElement.scrollTop || document.body.scrollTop;
                    var wheelTop = last_top - _top;
                    getPosition(_top,wheelTop);
                }
                //兼容性代码
                if(document.addEventListener){
                    document.addEventListener("DOMMouseScroll",mouseWheel,false)
                }else{
                    window.onscroll = window.onmousewheel = document.onmousewheel = mouseWheel;
                }
            }
        },
        toPrev:function(){
            toTop();
        },
        toNext:function(){
            toBottom();
        },
        toTop:function(){
            index = 0;
            toTop();
        },
        toBottom:function(){
            index = length -1;
            toBottom();
        }
    }
}