        var ScrollEvent = function(className,callback,flag){
                var $jumbotron = $("."+className);
                var index = 0;
                var length = $jumbotron.length;
                var toTop = function(){
                    if(isAnimation) return;
                    if(index>0){
                        index = index -1;
                    }else{
                        index = 0;
                    }
                    toPosition();
               }
               var toBottom = function(){
                    if(isAnimation) return;
                    if(index<length-1){
                        index = index +1;
                        toPosition();
                    }else{
                        index = length-1;
                    }
               }
               var isAnimation = false;
               var toPosition = function(){
                    isAnimation = true;
                    var position = $($jumbotron[index]).position();
                    $('html,body').animate({scrollTop: position.top+'px'}, 800,'swing',function(){
                        isAnimation = false;
                        callback(index);
                    });
               };
               var getPosition = function(_top,wheelDelta){
                   var _index = 0;
                   for(var i=0;i<length;i++){
                       var position = $($jumbotron[i]).position();
                       if(_top>=position.top){
                           _index = i;
                       }
                   }
                   var _position = $($jumbotron[_index]).position().top;
                   var height = $($jumbotron[_index]).height();
                   
                    if( !isNaN(_top) && !isNaN(_position) && !isNaN(height)){
                       callback(_index,_top,wheelDelta,_position,height);
                    }
               }
               return {
                   init:function(){
                       if(flag){
                                window.onkeydown = function (e) {
                                        e = e || event;
                                        var target = e.target || e.srcElement;
                                        var keyCode = e.which ? e.which : e.keyCode;
                                        switch (keyCode) {
                                            //pageUp
                                            case 33:
                                            //2键
                                            case 104:
                                            //W/w键
                                            case 87:
                                            case 119:
                                            //上键
                                            case 38:
                                                toTop();
                                                break;
                                            //pageDown
                                            case 34:
                                            //8键
                                            case 98:
                                            //S/s键
                                            case 83:
                                            case 115:
                                            //下键
                                            case 40:
                                                toBottom();
                                                break;
                                            //Home键
                                            case 36:
                                                index = 0;
                                                toTop();
                                                break;
                                            //End键
                                            case 35:
                                                index = length -1;
                                                toEnd();
                                                break;
                                            default:
                                                break;  
                                        }
                                    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                                    return false;
                                };
                                var mouseWheel = function(e){
                                    var e = e || event;
                                    var wheelDelta = e.wheelDelta || -e.detail * 40;
                                    if (wheelDelta > 0) {
                                                   toTop();
                                    }else{
                                                   toBottom();
                                    }
                                };
                               // 兼容性代码
                               if(document.addEventListener){
                                   document.addEventListener('DOMMouseScroll',mouseWheel,false);
                               }
                               window.onmousewheel = document.onmousewheel = mouseWheel;
                       }else{
                                var mouseWheel = function(e){
                                        var e = e || event;
                                        var _top = document.documentElement.scrollTop | document.body.scrollTop;
                                        var wheelDelta = e.wheelDelta || -e.detail * 40;
                                        getPosition(_top,wheelDelta);
                                };
                               // 兼容性代码
                               if(document.addEventListener){
                                   document.addEventListener('DOMMouseScroll',mouseWheel,false);
                               }
                               window.onscroll = window.onmousewheel = document.onmousewheel = mouseWheel;
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
                       index = length-1;
                       toBottom();
                   },
                   toIndex:function(_index){
                       index = _index;
                       toPosition();
                   }
                }
        }

        var showNavBarTop = null;
        var animateNavBarTop = function(wheelDelta,percent,pageIndex,noAlwaysShowTop){
            if(isNaN(wheelDelta)) return;
            var $NavTop = $(".navbar-fixed-top").show();
            
            if(wheelDelta>0){
                if(showNavBarTop==true) return;
                $NavTop.css({"height":"50px","min-height":"50px","margin-top":"-50px"});
                $NavTop.animate({"margin-top":"0px"},400,"swing",function(){
                    $NavTop.css({"height":"50px","min-height":"50px","margin-top":"0px"});
                });
                if(!noAlwaysShowTop) 
                    $("#top").css({display:"block"});
                showNavBarTop = true;
            }
            if(wheelDelta<0){
                if(showNavBarTop==false) return;
                $NavTop.css({"height":"50px","min-height":"50px","margin-top":"0px"});
                $NavTop.animate({"height":"50px","min-height":"50px","margin-top":"-50px"},400,"swing",function(){
                        $NavTop.css({"height":"50px","min-height":"50px","margin-top":"-50px"});
                });
                if(!noAlwaysShowTop) 
                    $("#top").css({display:"none"});
                
                
                showNavBarTop = false;
            }
            if(pageIndex==0 && percent<30 && !noAlwaysShowTop){
                $("#top").css({display:"none"});
            }
        }
        var showNavBar = function(){
                var $NavTop = $(".navbar-fixed-top");
                $NavTop.css({"height":"50px","min-height":"50px","margin-top":"-50px"});
                $NavTop.animate({"margin-top":"0px"},400,"swing",function(){
                    $NavTop.css({"height":"50px","min-height":"50px","margin-top":"0px"});
                });
                showNavBarTop = true;
        }
        
        var resetContactUsForm = function(){
                    $("#yourName").val("");
                    $("#yourEmail").val("");
                    $("#yourCom").val("");
                    $("#yourContent").val("");
        }
        var submitContactUsForm = function(callback){
                var name = $("#yourName").val();
                if(name==""){ $("#yourName").focus();return false;}
                var email = $("#yourEmail").val();
                if(email==""){ $("#yourEmail").focus();return false;}
                var company = $("#yourCom").val();
                if(company==""){ $("#yourCom").focus();return false;}
                var content = $("#yourContent").val();
                if(content==""){ $("#yourContent").focus();return false;}

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
                        alert("发送成功!");
                        callback(true);
                    },
                    error:function(){
                        alert("发送失败!");
                        callback(false);
                    }
                });
                return true;
        }
        var openContactUsDialog = function(){
                var tmpl = $("#contactUsTmpl").html();
                $.teninedialog({
                    title:"联系我们",
                    content:tmpl,
                    showCloseButton: false,
                    width:"800px",
                    otherButtons: ["发送"],
                    otherButtonStyles: ["btn-send"],
                    otherButtonsLoading: [ "正在发送..."],
                    clickButton: function (sender, modal, index) {
                        if (index == 0) {
                            var valid = submitContactUsForm(function(flag){
                                $(this).closeDialog(modal);
                                sender.button('loading');
                                document.body.style.padding ="";
                                document.body.className = "";
                            })
                           if(valid)  sender.button('loading');
                        } 
                    },
                })
        }
        // 图片预加载
        var PreloadImages = function (arr,callback){   
            $(".loading-dialog").show();
            var newimages=[], loadedimages=0
            var arr=(typeof arr!="object")? [arr] : arr;
            function imageloadpost(){
                loadedimages++
                if (loadedimages==arr.length){
                    setTimeout(function(){
                        $(".loading-dialog").hide();
                        callback(newimages);
                    },200);
                }
            }

            for (var i=0; i<arr.length; i++){
                newimages[i]= new Image();
                newimages[i].src=arr[i]
                newimages[i].onload=function(){
                    imageloadpost()
                }
                newimages[i].onerror=function(){
                    imageloadpost()
                }
            }
            if(arr.length==0){
                $(".loading-dialog").hide();
                callback(newimages);
            }
        };
        // 视频预加载
        var PreloadVideo = function(src,percent,callback){
            var video = document.createElement('video');
            video.src = src;
            console.log(src);
            video.load();
            $(".loading-dialog").show();
            var duration = video.duration;
            if(!percent) percent = 30;
            
            var queryBufferedPercent = function(){
                if( video.buffered.length<=0 || (video.buffered.end(0)*100/duration)<percent) {
                    if(video.buffered.length<=0){
                        console.log("video loading 0");
                    }else{
                        var buffered = 0;
                        for(var i=0;i<video.buffered.length;i++){
                            buffered += video.buffered.end(i);
                        }
                        video.currentTime = buffered;
                        console.log("video loading "+video.currentTime);
                    }
                    setTimeout(queryBufferedPercent,1000);
                }
                else{
                    console.log("video loaded")
                    $(".loading-dialog").hide();
                    callback();
                }
            }
            queryBufferedPercent();
        }


        var $select_language = $("#select_language").hide();
        var $aSelectLanguage =  $("#aSelectLanguage");
        var isShowSelectLanguage = false;
        var InitSelectLanguage = function(){
            $aSelectLanguage.mouseenter(function(e){
                $select_language.show();
            });
            $aSelectLanguage.mouseleave(function(e){
                $select_language.hide();
            });
            $aSelectLanguage.click(function(e){
                $select_language.toggle();
            });
            $(".select-li").click(function(e){
                var lan = $(this).data("lan");
                $.get("/switch_lan?lan=" + lan,function(e){
                    if (e.status == 'error') {
                        alert(e.msg || 'system error');
                    } else {
                        window.location = "/";
                    }
                });
            });
        }
        
        var isMobileDevice = function() {
        
            var ua = window.navigator.userAgent;
            if (/(iphone|ios|android|mini|mobile|mobi|Nokia|Symbian|iPod|iPad|Windows\s+Phone|MQQBrowser|wp7|wp8|UCBrowser7|UCWEB|360\s+Aphone\s+Browser)/i.test(ua)) {
                return true;
            }
            return false;
        };
        var videoCheck = function () {
            return !!document.createElement("video").canPlayType;
        }
        var mp4Check = function() {
            if(videoCheck()){
                var video = document.createElement("video");
                return !!video.canPlayType('video/mp4');
            }
            return false;
        }
        var canvasCheck = function(){
             return !!document.createElement("canvas").getContext;
        }