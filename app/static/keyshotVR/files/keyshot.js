(function($){
var KeyshotVR = function(options){

	var $element = $("#"+options.id).css({"position":"relative","top":"0px","left":"0px"});	
	var $display = $('<img class="loading" src="'+options.loading+'" style="'+options.loadingStyle+'">').appendTo($element);
	var $timeline = $("<div class='timeline' style='height:"+options.timelineRadius+"px;position:relative;left:0px;top:-40px;width:600px;margin:0px auto;'></div>").appendTo($element);
	var $title = $("<div class='title' style='position:relative;top:-40px;text-align:center;color:"+options.timelineColor+";'>"+options.timeline+"</div>").appendTo($element);;
	var keyshotVRCtrl = {},timelineCtrl = {};
	var initState = false,updateState = false;

	var GetMousePos = function(e){
		e = e || event;
		var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
		var scrollY = document.documentElement.scrollTop || document.body.scrollTop;

		var x = parseFloat(e.pageX || e.clientX+scrollX);
		var y = parseFloat(e.pageY || e.clientY+scrollY);

		return {x:x,y:y};
	}
    var ClearSelect = function(e){
        if(window.getSelection){
            window.getSelection().removeAllRanges();
        }else{
            document.selection.empty();
        }
    }


	var ImagePreload = function(callback){
		if(!initState){
			initState = true;
			var loadedLen = 0;
			var imgLen = options.imgArr.length;
			for(var i=0;i<imgLen;i++){
				var img = new Image();
				img.src = options.imgArr[i];
				img.onload = function(e){
					loadedLen +=1;
					if(loadedLen == imgLen){
						callback();
					}
				}
				img.onerror = function(e,err){
					loadedLen +=1;
					if(loadedLen == imgLen){
						callback();
					}
				}
			}
			
		}
	}
	
	var InitKeyshotVR = function(){
		var leftPercent = 0;
		var imgLen = options.imgArr.length;
		var canPlay = true, playIndex = 0,playInter=null;
		
		ImagePreload(function(){
			if(imgLen>0){
				var index = Math.round(leftPercent*imgLen/100);
				$display.attr("src", options.imgArr[index]);
				$display.css({"width":"100%","margin":"0px"});
			}
		});

		var Play = function(onChange){
            playIndex = 0;
			var player = function(){
				var index = playIndex%imgLen;
				playIndex = index + 1;
				setIndex(index);
                onChange(index*100/(imgLen-1))
			}
			playInter = setInterval(player,options.playInterval);
		}

		var Pause = function(){
			if(playInter) clearInterval(playInter);
		}

		var setPercent = function(percent){
				leftPercent = percent;
				if(imgLen>0){
					var index = Math.round(leftPercent*imgLen/100);
					if(index>=imgLen) index= imgLen-1;
					if(index<0) index= 0;
					
					if(options.index != index)
						$display.attr("src", options.imgArr[index]);

					options.index = index;
				}
		}

		var setIndex = function(index){
			if(imgLen>0){
				if(index>=imgLen) index= imgLen-1;
				if(index<0) index= 0;
				leftPercent = index*100/imgLen;
				$display.attr("src", options.imgArr[index]);
			}
		}

		return {
			setLeftPercent:function(percent){
				setPercent(percent);
			},
			play:function(onChange){
				Play(onChange);
			},
			pause:function(){
				Pause();
			}
		};
	}

	var InitTimeline = function(tlOpts){
		var tlOpts = tlOpts || {};
		var lineStyle = "width:100%;position:absolute;left:0px;top:"+options.timelineRadius/2+"px;border-top:1px solid "+options.timelineColor+";";
		var $line = $("<div style='"+lineStyle+"'></div>").appendTo($timeline);	
		var circleStyle = "position:absolute;left:0px;top:0px;height:"+options.timelineRadius+"px;width:"+options.timelineRadius+"px;border-radius:"+options.timelineRadius+"px;border:1px solid "+options.timelineColor+";background-color:"+options.timelineBackColor+";cursor:move;";	
		var $circle = $("<div style='"+circleStyle+"'></div>").appendTo($timeline);	
		var circleDown = false,startPos = {x:0,y:0};
		var lineWidth = $timeline.width();
		var leftPercent = 0;
		
		var handleMouseDown = function(e){
			circleDown = true;
			startPos = GetMousePos(e);
		}

		var handleMouseMove = function(e){
			if(circleDown){
                ClearSelect(e);
				var endPos = GetMousePos(e);
				leftPercent = leftPercent + (endPos.x-startPos.x)*100/lineWidth;
				maxLeft = (lineWidth-options.timelineRadius)*100/lineWidth;
				startPos = endPos;
				if(leftPercent<0){leftPercent=0;}
				if(leftPercent>maxLeft) {leftPercent=maxLeft;}
				$circle.css("left",leftPercent+"%");
				options.percent = leftPercent*100/maxLeft;
				tlOpts.onChange(options);
                
			}
		}
		var handleMouseUp = function(e){
			if(circleDown){
				circleDown = false;
                ClearSelect(e);
				var endPos = GetMousePos(e);
				leftPercent = leftPercent + (endPos.x-startPos.x)*100/lineWidth;
				maxLeft = (lineWidth-options.timelineRadius)*100/lineWidth;
				startPos = endPos;
				if(leftPercent<0){leftPercent=0;}
				if(leftPercent>maxLeft) {leftPercent=maxLeft;}
				$circle.css("left",leftPercent+"%");
				options.percent = leftPercent*100/maxLeft;
				tlOpts.onChange(options);
			}
		}

		$circle.mousedown(handleMouseDown);
		$circle.mousemove(handleMouseMove);
		$circle.mouseup(handleMouseUp);
		$(window).mousemove(handleMouseMove);
		$(window).mouseup(handleMouseUp);
        
		return {
			setLeftPercent:function(percent){
				maxLeft = (lineWidth-options.timelineRadius)*100/lineWidth;
				leftPercent = percent*maxLeft/100;
				if(leftPercent<0){leftPercent=0;}
				if(leftPercent>maxLeft) {leftPercent=maxLeft;}
				$circle.css("left",leftPercent+"%");
			},
			setChangeHandler:function(callback){
				tlOpts.onChange = callback;
			}
		};
	}

	
	
    return {
		init:function(){
			keyshotVRCtrl = InitKeyshotVR();
			timelineCtrl =  InitTimeline();
			timelineCtrl.setChangeHandler(function(opt){
				keyshotVRCtrl.setLeftPercent(opt.percent);
			})
		},
		update:function(options){

		},
		play:function(){
			if(keyshotVRCtrl){
				keyshotVRCtrl.play(function(percent){
                    timelineCtrl.setLeftPercent(percent);
                });
			}
		},
		pause:function(){
			if(keyshotVRCtrl){
				keyshotVRCtrl.pause();
			}
		},
		timelineHide:function(){
			$timeline.hide();
			$title.hide();
		},
		timelineShow:function(){
			$timeline.show();
			$title.show();
		},
		setPercent:function(percent){
			if(keyshotVRCtrl) keyshotVRCtrl.setLeftPercent(percent);
			if(timelineCtrl) timelineCtrl.setLeftPercent(percent);
		}
    }
}


var KeyshotVRElements = {};
$.fn.keyshotVR = function(fn,opt){	
    var default_options = {
		imgArr:[],
		index: -1,
		loading:"files/ks_logo.png",
		loadingStyle:"width:30%;margin:0px auto;display:block;",
		imgStyle:"width:100%;margin:0px;display:block;",
		timeline:drag_text,
		timelineColor:"#999999",
		timelineBackColor:"#2f2f2f",
		timelineRadius:36,
		playInterval:200
    }
	var id = this[0].id;
    if(typeof fn=="Object" || typeof fn=="object"){
		options = $.extend(true,{},default_options,fn);
		
		options.id = id;
		if(!KeyshotVRElements[id]){
			KeyshotVRElements[id] = new KeyshotVR(options);
			KeyshotVRElements[id].init();
		}else{
			KeyshotVRElements[id].update(options);
		}
    }else{
		switch(fn){
			case "play":
				KeyshotVRElements[id].play();
				break;
			case "pause":
				KeyshotVRElements[id].pause();
				break;
			case "hide":
				KeyshotVRElements[id].timelineHide();
				break;
			case "show":
				KeyshotVRElements[id].timelineShow();
				break;
			case "setPercent":
				KeyshotVRElements[id].setPercent(opt);
				break;
		}
    }
}
})(jQuery)
