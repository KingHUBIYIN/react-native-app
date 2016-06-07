$(function() {
	$("[data-toggle='change']").on("click", function() {
		$this = $(this);
		var $is_submit = $this.attr("is-submit");
		var $group = $this.attr("data-group");
		var $url = $this.attr("data-url");
		var $type = $this.attr("type") ? $this.attr("type") : "PUT";
		if($is_submit == 1) {
			$this.find("span").html("提交中...");
			$this.attr({
				"disabled": "disabled"
			});
			$this.next().attr({
				"disabled": "disabled"
			});
			var $data = "";
			$("[data-belong='" + $group + "']:visible,[data-belong='" + $group + "'][data-type='select']").each(function() {
				var $item = $(this);
				if($item.attr("data-type") == "select") {
					$item = $item.next("select");
				}
				var $name = $item.attr("name");
				var $value = $item.val();
				$value = encodeURIComponent($value);
				if($data == "") {
					$data = $name + "=" + $value;
				} else {
					$data += "&" + $name + "=" + $value;
				}
			});
			$.ajax({
				type: $type,
				url: $url,
				data: $data,
				success: function(msg) {
					eval('msg = ' + msg);
					$this.find("span").html("修改");
					$this.removeAttr("disabled");
					$this.next().removeAttr("disabled");
					$("[data-belong='" + $group + "']:hidden").each(function() {
						$(this).html(msg[$(this).attr("data-name")]);
						$(this).show();
						$(this).next("input,textarea").remove();
						$(this).next("select").hide();
					});
				},
				error: function() {
					alert("出现错误，请检查参数！");
					$this.find("span").html("修改");
					$this.removeAttr("disabled");
					$this.next().removeAttr("disabled");
					$("[data-belong='" + $group + "']:hidden").each(function() {
						$(this).show();
						$(this).next("input,textarea").remove();
						$(this).next("select").hide();
					});
				},
			});
			$this.attr("is-submit", 0);
		} else {
			$("[data-belong='" + $group + "']").each(function() {
				var $item = $(this);
				var $name = $item.attr("data-name");
				var $value = $item.html();
				var $type = $item.attr("data-type") ? $item.attr("data-type") : "text";
				var $html;
				if($type == "text") {
					$html = "<input class='input-medium' data-belong='" + $group + "' type='text' name='" + $name + "' value='" + $value + "'/>";
				} else if($type == "textarea") {
					$html = "<textarea data-belong='" + $group + "' name='" + $name + "'>" + $value + "</textarea>";
				} else if($type == "select") {
					var $select = $item.next("select");
					$select.show();
				}
				$item.hide();
				$item.after($html);
			});
			$this.find("span").html("提交");
			$this.attr("is-submit", 1);
		}
		return false;
	});
	$('#mediaUpload').on('hide', function() {
		return model_can_close;
	});
	$('.carousel-inner').on({
		mouseenter: function() {
			$this = $(this)
			$(this).find(".carousel-caption").show();
		},
		mouseleave: function() {
			$(this).find(".carousel-caption").hide();
		}
	});
	$("[data-toggle='delete']").on("click", function() {
		var $this = $(this);
		var $url = $this.attr("data-url");
		var $target = $($this.parents("[data-target]")[0]);
		if(confirm("确认删除？")) $.ajax({
			type: "DELETE",
			url: $url,
			success: function(msg) {
				$target.remove();
			}
		});
		return false;
	});
	$("[data-toggle='selected']").on("click", function() {
		var $this = $(this);
		var $url = $this.attr("data-url");
		var $data = $this.attr("data");
		if(confirm("确认选择？")) $.ajax({
			type: "PUT",
			url: $url,
			data: $data,
			success: function(msg) {
				$("#msg p").html("选择成功！").parent().show(function() {
					$(this).hide(3000);
				});
				$(".front-media").hide();
				$this.parents(".carousel-inner").find(".front-media").show();
			}
		});
		return false;
	});
	$("#mediaUpload .modal-footer button").on("click", function() {
		var $url = window.location;
		$.get($url, function(data) {
			var $data = $(data);
			$(".medias").replaceWith($data.find(".medias"));
		});
	});
	$("form[data-wgt='ajax']").on("submit", function() {
		var $this = $(this);
		var $url = $this.attr("data-url");
		var $target = $this.attr("data-target");
		var $options = {
			success: function(responseText, statusText, xhr) {
				$.get($url, function(_page) {
					var $page = $(_page);
					$this.parents("#content").find("#" + $target).replaceWith($page.find("#" + $target));
				});
			},
			error: function(responseText, statusText, xhr) {
				alert("错误");
			}
		};
		$this.ajaxSubmit($options);
		return false;
	});
	$("[data-toggle='fileupload']").click(function() {
		var $this          = $(this),
			$parent        = $this.parent(),
			$form          = $('<form action="/web/comupload" method="post">').appendTo("body"),
			$input         = $("<input type='file' name='file'>").hide().appendTo($form),
			$hidden        = $("<input type='hidden' name='not_need_narrow' value='1'>").hide().appendTo($form),
			$wgt_loading   = $("#wgt-loading-upload");
	});
});
//idealsee jquery plugin 
//power by idealsee.dxl@gmail.com
(function($) {
	$.fn.hilight = function(options) {
		defaults = {
			foreground: "red",
			background: "yellow"
		};
		var opts = $.extend({}, defaults, options);
		return this.each(function() {
			var $this = $(this);
			var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
			$this.css({
				background: o.background,
				color: o.foreground
			});
		});
	};
	$.fn.disabled = function(disabled) {
		return this.each(function() {
			var $this = $(this);
			$this.attr("disabled",disabled);
		});
	};
	$.alert = function(content,callback) {
		var top     = $(".notifications div:last").length ? $(".notifications:last").offset().top : undefined,
			$notify = $("<div class='top-center notifications'>");

		top && $notify.css({top:top + 38});

		$notify.appendTo("body").notify({
			type: "alert",
			message: {
				text: content
			},
			onClosed:function(){
				callback && callback();
			}
		}).show();
	};
	$.success = function(content,callback) {
		var top     = $(".notifications div:last").length ? $(".notifications:last").offset().top : undefined,
			$notify = $("<div class='top-center notifications'>");

		top && $notify.css({top:top + 38});

		$notify.appendTo("body").notify({
			type: "success",
			message: {
				text: content
			},
			onClosed:function(){
				callback && callback();
			}
		}).show();
	};
	$.error = function(content,callback) {
		var top     = $(".notifications div:last").length ? $(".notifications:last").offset().top : undefined,
			$notify = $("<div class='top-center notifications'>");

		top && $notify.css({top:top + 38});
		
		$notify.appendTo("body").notify({
			type: "error",
			message: {
				text: content
			},
			onClose : function(){
				return false;
			},
			onClosed:function(){
				callback && callback();
			}
		}).show();
	};
	$.getImageUrl = function(md5){
		var site_url  = window.location.protocol + '//' + window.location.hostname + '/';
		return site_url + 'media01/' + md5 + "-100."+ md5.split("_")[1];
	};
	$.extend($.validator.messages,{
		required: "必选字段",
		remote: "请修正该字段",
		email: "请输入正确格式的电子邮件",
		url: "请输入合法的网址",
		date: "请输入合法的日期",
		dateISO: "请输入合法的日期 (ISO).",
		number: "请输入合法的数字",
		digits: "只能输入整数",
		creditcard: "请输入合法的信用卡号",
		equalTo: "请再次输入相同的值",
		accept: "请输入拥有合法后缀名的字符串",
		maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
		minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
		rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
		range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
		min: jQuery.validator.format("请输入一个最小为 {0} 的值")
	});
	$.validator.methods.url = function(value, element){
		// if ( !/^(https?|ftp):\/\//.test(value) ) {
		// 	value = 'http://' + value;
		// 	$(element).val(value);
		// }
		// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
		return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
	}
})(jQuery);


!(function($){
  $('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });

  $.fn.exform = function(){
    this.each(function () {
      var form = $(this);
      for (var i = $.fn.exform.renders.length - 1; i >= 0; i--) {
        $.fn.exform.renders[i](form)
      };
      form.addClass('rended');
    })
  }
  $.fn.exform.renders = [];
  $(function() {
    $('.exform:not(.rended)').exform();
  });

  $.getCookie = function(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) == (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }

  // dashboard widget
  $('.widget-form').each(function(e){
    var el = $(this);
    el.find('.btn-remove').click(function(){
      el.find('input[name=_delete]').val('on');
      return true;
    });
  });

  // g-search
  $('#g-search .dropdown-menu a').click(function(){
      $('#g-search').attr('action', $(this).data('action')).submit();
  })

  // save settings
  $.save_user_settings = function(key, value, success, error){
    var csrftoken = $.getCookie('csrftoken');
    $.ajax({
      type: 'POST',
      url: window.__admin_path_prefix__ + 'settings/user',
      data: {'key': key, 'value': value},
      success: success,
      error: error,
      beforeSend: function(xhr, settings) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    });
  }
  
})(jQuery)