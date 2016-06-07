/*
 * teninedialog 1.0.0
 * jquery.bootsrap.teninedialog.js
 * Copyright (c) 2015
 * Date: 2015-05-04
 * Anthor: Holly Liu
 * Email: liuhong1.happy@163.com
 * 针对bootstrap模态对话框的二次封装。
 */
(function($){
	$.fn.teninedialog = function(options){
		var defaults = {
			title:'标题',
			content: '内容',
            width:'600px',
			showCloseButton:true,//显示关闭按钮
			otherButtons: [],//其他按钮文本，样式默认,["确定","取消"]
			otherButtonsLoading: [],//其他按钮的保存过程的文本, ["正在保存...", "正在保存..."]
			otherButtonStyles:[],//其他按钮的样式，['btn-super-primary','btn-super-primary'],bootstrap按钮样式
            otherButtonCSS:[],
			bootstrapModalOption:{},//默认的bootstrap模态对话框参数
			dialogShow:function(){},//对话框即将显示事件
			dialogShown:function(){},//对话框已经显示事件
            dialogCreated:function(){},//对话框内容创建完毕
			dialogHide: function () {
			    return false;
			},//对话框即将关闭
			dialogHidden:function(){},//对话框已经关闭事件
			clickButton:function(sender,modal,index){}//选中按钮的序号，排除关闭按钮。sender:按钮jquery对象，model:对话框jquery对象,index:按钮的顺序,otherButtons的数组下标
		}
		var options = $.extend(defaults, options);
		var modalID='';

		//生成一个惟一的ID
		function getModalID(){
			var d = new Date();
			var vYear = d.getFullYear();
			var vMon = d.getMonth()+1;
			var vDay = d.getDate();
			var h = d.getHours();
			var m = d.getMinutes();
			var se = d.getSeconds();
			var sse=d.getMilliseconds();
			return 't_'+vYear+vMon+vDay+h+m+se+sse;
		}		

		$.fn.extend({
		    closeDialog: function (modal) {
		        var modalObj = modal;
		        modalObj.hide();
		        modalObj.remove();
		        $('.modal-backdrop').remove();
                document.body.style.padding ="";
                document.body.className = "";
			}			
		});

		return this.each(function(){
			var obj=$(this);
			modalID=getModalID();
		    //var tmpHtml='<div id="{ID}" class="modal hide fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="myModalLabel">{title}</h3></div><div class="modal-body"><p>{body}</p></div><div class="modal-footer">{button}</div></div>';

			//var tmpHtml = '<div id="{ID}" class="modal hide fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
			//tmpHtml += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="myModalLabel">{title}</h3></div>';
			//tmpHtml += '<div class="modal-body"><p>{body}</p></div><div class="modal-footer">{button}</div></div>';


			var tmpHtml = '<div class="modal fade" id="{ID}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" >';
			tmpHtml += '<div class="modal-dialog" style="width:'+options.width+';margin-top: 80px;">';
			tmpHtml += '<div class="modal-content">';
			tmpHtml += '<div class="modal-header text-center" style="color:#fff;padding:8px 20px;border:0px solid transparent;min-height:40px;height:80px;">';
			tmpHtml += '<a role="button" class="close" id="closeButton{ID}" data-dismiss="modal" style="margin-top:12px;"><span class="close_span" aria-hidden="true" style="font-size:46px;"></span><span class="sr-only">Close</span></a>';
			tmpHtml += '<h4 class="modal-title" id="title{ID}">{title}</h4>';
			tmpHtml += '</div>';
			tmpHtml += '<div class="modal-body" style="margin-top: -25px;">';
			tmpHtml += '{body}';//内容
			tmpHtml += '</div>';
			tmpHtml += '<div class="modal-footer" style="text-align:center;border-top:0px solid transprent;background-color:#fff;padding:0px 0px 44px 0px;font-size:18px;">';
			tmpHtml += '{button}';//底部按钮
			tmpHtml += ' </div>';
			tmpHtml += '</div></div></div>';

			var buttonHtml = '<a  role="button" class="btn  btn-default" data-dismiss="modal" aria-hidden="true">关闭</a>';
			if (!options.showCloseButton && options.otherButtons.length > 0) { buttonHtml = ''; };

            //生成按钮
            var btnClass='modal-btn-'+modalID;
            for (var i = 0; i < options.otherButtons.length; i++) {
                if(options.otherButtonCSS[i]==undefined) options.otherButtonCSS[i]="";
                if (options.otherButtonsLoading.length > 0) {
                    buttonHtml += '<a role="button"  autocomplete="off" data-loading-text="'+options.otherButtonsLoading[i]+'"   buttonIndex="' + i + '" class="btn ' + btnClass + '  ' + options.otherButtonStyles[i] + '" style="'+options.otherButtonCSS[i]+'">' + options.otherButtons[i] + '</a>';
                } else {
                    buttonHtml += '<a role="button" buttonIndex="' + i + '" class="btn ' + btnClass + ' ' + options.otherButtonStyles[i] + '" style="'+options.otherButtonCSS[i]+'">' + options.otherButtons[i] + '</a>';
                }
            }
            //替换模板标记
            tmpHtml=tmpHtml.replace(/{ID}/g,modalID).replace(/{title}/g,options.title).replace(/{body}/g,options.content).replace(/{button}/g,buttonHtml);
            obj.append(tmpHtml);

            var modalObj = $('#' + modalID);
            var closeObj = $('#closeButton' + modalID);
           
            //绑定按钮事件,不包括关闭按钮
            $('.'+btnClass).click(function(){
            	var index=$(this).attr('buttonIndex');
            	options.clickButton($(this),modalObj,index);
            });
            //绑定本身的事件
            modalObj.on('show.bs.modal', function () {
			  options.dialogShow();
			}); 
            modalObj.on('shown.bs.modal', function (e) {
                options.dialogShown();

			});
            modalObj.on('hide.bs.modal', function (e) {
                return options.dialogHide();
			}); 
            modalObj.on('hidden.bs.modal', function () {
			  options.dialogHidden();
			  modalObj.remove();
            });
            modalObj.on('loaded.bs.modal', function (e) {
                
            });
            modalObj.modal(options.bootstrapModalOption);
            
            closeObj.on('click', function (e) {
                modalObj.animate({"margin-top":"1200px",opacity:0},600,"",function(){
                    modalObj.hide();
                    modalObj.remove();
                });
                $('.modal-backdrop').animate({opacity:0},400,"",function(){
                    $('.modal-backdrop').remove()
                });
                document.body.style.padding ="";
                document.body.className = "";
            });

            document.getElementById(modalID).onclick = function (e) {
                e = e || event;
                var target = e.target || e.srcElement;
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
            }
            
            options.dialogCreated(modalID,modalObj);
		});
        return modalObj;
	};

	$.extend({ 
	    teninedialog: function(options) {
	    	return $("body").teninedialog(options);
	    } 
	});
    
    $.extend({
        closeteninedialog:function(modalObj){
                modalObj.hide();
                modalObj.remove();
                $('.modal-backdrop').remove();
                document.body.style.padding ="";
                document.body.className = "";
        }
    })
  
})(jQuery);

