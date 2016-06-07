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
                               if(document.addEventListener){//火狐浏览器支持
                                   document.addEventListener('DOMMouseScroll',mouseWheel,false);
                               }
                               window.onmousewheel = document.onmousewheel = mouseWheel;
                       }else{
                                var last_top = document.documentElement.scrollTop | document.body.scrollTop;
                                var mouseWheel = function(e){
                                        var e = e || event;
                                        var _top = document.documentElement.scrollTop | document.body.scrollTop;
                                        // var wheelDelta = e.wheelDelta || -e.detail * 40;
                                        var wheelDelta = last_top -_top;
                                        last_top = _top;
                                        getPosition(_top,wheelDelta);
                                };
                               // 兼容性代码
                               if(document.addEventListener){//火狐浏览器支持
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
        
        var countdown_flg;
        var send_flg = 0;
        function countdown() {
            if (countdown_flg == 0) {
                send_flg = 0
                document.getElementById('sendsmsverify').innerHTML = "发送验证短信";
            } 
            else {
                document.getElementById('sendsmsverify').innerHTML = "(" + countdown_flg + "s)再次发送";
                countdown_flg--;
                setTimeout('countdown()', 1000);
            }
        }
        var InitLoginDialog = function(){
            //模态框登录系统
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

            function check_regist(mobile, passwd) {
                if (!myreg.test(mobile) || passwd == "") {
                    return false;
                } else {
                    return true;
                }
            }
            $("#open_regist").click(function(){
                $("#loginModal").hide();
                $("#registModal").show();
            });
            $("#open_login").click(function(){
                $("#registModal").hide();
                $("#loginModal").show();
            });
            $(document).keydown(function(event){
                if(event.keyCode == 13){
                     $("#btn-login").click();
                }
            });
            $("#btn-login").click(function(){
                var mobile = $("#login_mobile").val();
                var passwd = $("#login_passwd").val();
                var remember_passwd = $("#remember_passwd")[0].checked;

                $(".error").hide();
                if (!myreg.test(mobile)) {
                    $("#login_mobile_error").html("请输入正确的手机号");
                    $("#login_mobile_error").show();
                    return false;
                }
                if (passwd == "") {
                    $("#login_passwd_error").html("请输入密码");
                    $("#login_passwd_error").show();
                    return false;
                }

                var post_data = {
                    mobile     : mobile,
                    passwd     : passwd,
                    remember_passwd : remember_passwd
                };
                $.post("/user/login",post_data,function(e){
                    if (e.status == 'error') {
                        if (e.code == "404") {
                            $("#login_mobile_error").html("账户不存在");
                            $("#login_mobile_error").show();
                        } else if (e.code == "403") {
                            $("#login_passwd_error").html("账户与密码不匹配");
                            $("#login_passwd_error").show();
                        }
                    } else {
                        window.location.reload();
                    }
                });
            });
            
            $("#btn-regist").click(function(){
                var reg = /^\w+$/;
                var mobile = $("#regist_mobile").val();
                var passwd = $("#regist_passwd").val();
                var sms_verify = $("#sms_verify").val();
                $(".error").hide();
                if (!myreg.test(mobile)) {
                    $("#regist_mobile_error").html("请输入正确的手机号");
                    $("#regist_mobile_error").show();
                    return false;
                }
                if (sms_verify == "") {
                    $("#regist_verify_error").html("验证码错误");
                    $("#regist_verify_error").show();
                    return false;
                }
                if (passwd == "") {
                    $("#regist_passwd_error").html("请输入密码");
                    $("#regist_passwd_error").show();
                    return false;
                }
                if(reg.test(passwd) == false){
                    $("#regist_passwd_error").html("密码不能含有中文字符");
                    $("#regist_passwd_error").show();
                    return false;
                }
                var post_data = {
                    mobile     : mobile,
                    passwd     : passwd,
                    verify     : sms_verify
                };
                $.post("/user/register",post_data,function(e){
                    if (e.status == 'error') {
                        if (e.code == "400") {
                            $("#regist_verify_error").html(e.msg);
                            $("#regist_verify_error").show();
                        } else if (e.code == "409") {
                            $("#regist_mobile_error").html(e.msg);
                            $("#regist_mobile_error").show();
                        }
                    } else {
                        window.location.reload();
                    }
                });
            });
            function prevent_send_too_fast() {
                countdown_flg = 30;
                countdown();
            }
            $("#sendsmsverify").click(function(){
                if (send_flg != 0) {
                    return false;
                }

                var phone = $("#regist_mobile").val();
                $(".error").hide();
                if (!myreg.test(phone)) {
                    $("#regist_mobile_error").html("请输入正确的手机号");
                    $("#regist_mobile_error").show();
                    return false;
                }
                var post_data = {
                    mobile     : phone,
                };
                $.post("/user/send_regist_verify",post_data,function(e){
                    var errcode = e.code;
                    if (errcode == -1) {
                        document.getElementById('sendsmsverify').innerHTML = "发送频繁，稍后再试";
                        return
                    } else if (errcode == 203) {
                        $("#regist_mobile_error").html(e.msg);
                        $("#regist_mobile_error").show();
                        return
                    }
                    send_flg = 1;
                    prevent_send_too_fast();
                });
            })
            $("#forget_passwd").click(function(){
                window.open("/user/forget_passwd");
            });
            $(".show_pass").click(function(){
                var passwd = $("#regist_passwd");
                var passwd_type = passwd.attr("type");
                if (passwd_type == "password") {
                    passwd.attr("type", "text");
                    $(this).attr("src", "/static/images/usercenter/show_pass.png");
                } else {
                    passwd.attr("type", "password");
                    $(this).attr("src", "/static/images/usercenter/hide_pass.png");
                }
            });
            $("#regist_passwd").keyup(function(){
                var p_level = passwd_health($(this).val());
                var text;
                switch(p_level) {    
                case 0:    
                    $(".passwd_health").html("<span style='color:red'>弱</span>");
                    break;  
                case 1:    
                    $(".passwd_health").html("<span style='color:orange'>中</span>");  
                    break;
                case 2:    
                    $(".passwd_health").html("<span style='color:orange'>中</span>");  
                    break;
                default:    
                    $(".passwd_health").html("<span style='color:green'>强</span>");
                };
            })
        }
        
        // 图片预加载
        var PreloadImages = function (arr,callback){   
            ShowLoading();
            var newimages=[], loadedimages=0
            var arr=(typeof arr!="object")? [arr] : arr;
            function imageloadpost(){
                loadedimages++
                if (loadedimages==arr.length){
					HideLoading();
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
                HideLoading();
                callback(newimages);
            }
        };
        // 视频预加载
        var PreloadVideo = function(src,percent,callback){
            var video = document.createElement('video');
            video.src = src;
            console.log(src);
            video.load();
            ShowLoading();
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
                    HideLoading();
                    callback();
                }
            }
            queryBufferedPercent();
        }
        
        var loadingInterval = null;
        var loadingIndex = 0;
        var ShowLoading = function(){
//            if(loadingInterval!=null){
//                clearInterval(loadingInterval);
//                loadingInterval = null;
//            }
            $(".loading-dialog").show();
//            loadingInterval = setInterval(function(){
//				if(loadingInterval==null){
//					return;
//				}
//                loadingIndex = loadingIndex%90;
//                var num = (loadingIndex/1000).toFixed(3).split(".")[1];
//                $('#loading_animation').attr("src","/static/images/loading_animation/loading_animation_"+num+".png");
//                loadingIndex = loadingIndex+1;
//            },50);
        }
        
        var HideLoading = function(){
            $(".loading-dialog").hide();
//            if(loadingInterval!=null){
//                clearInterval(loadingInterval);
//                loadingInterval = null;
//            }
        }


        var $select_language = $("#select_language").hide();
        var $aSelectLanguage =  $("#aSelectLanguage");
        var isShowSelectLanguage = false;
        var InitSelectLanguage = function(gohome){
            var gohome_flg = true;
            if (gohome == false) {
                gohome_flg = false
            }
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
                $.get("/switch_lan?lan=" + lan + "&gohome=" + gohome_flg,function(e){
                    if (e.status == 'error') {
                        alert(e.msg || 'system error');
                    } else {
                        if (gohome_flg) {
                            window.location = "/";
                        } else {
                            window.location.reload();
                        }
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