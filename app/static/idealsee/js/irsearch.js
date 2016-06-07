$(function() {
	$(".loading-small").hide();
	var search_source_template = $('#search-source-template').html();
	$("#ir-file-upload").on("click",function(){
		var $form          = $("<form action='/comupload' method='post' enctype='multipart/form-data'>").appendTo("body"),
			$input         = $("<input type='file' name='file'>").hide().appendTo($form),
			$file_text     = $("#ir-file-text"),
			$ir_search     = $("#ir-search"),
			$wgt_loading   = $("#wgt-loading-upload"),
			$search_source = $("#search-source");

		$input.trigger("click");
		$input.on("change",function(){
			var $this     = $(this),
				file_path = $this.val();
			$file_text.val(file_path);
			$form.trigger("submit");
		});	
		$form.on("submit",function(){
			$ir_search.disabled(true);
			$wgt_loading.show("fast");
			var options = {  
				success:function(responseText,statusText,xhr){
					// responseText = $.evalJSON(responseText);
					console.log(responseText);
					if (responseText.status == "error") {
						$file_text.val("");
						$.error(responseText.msg);
					}
					if (responseText.status == "success") {
						$.success("上传文件成功！");
						$file_text.data("media-src",responseText.image_src);
						$file_text.data("file-id",responseText.file_id);
						$file_text.data("md5",responseText.md5);
						$(".pricing-table").remove();
						var search_source_html = Mustache.render(search_source_template, {
							image_src:responseText.image_src
						});
						search_source_html = is.tpl(search_source_html);
						$search_source.append($(search_source_html));
					}
					$ir_search.disabled(false);
					$wgt_loading.hide();
				},
				error:function(responseText,statusText,xhr){
					$.error("上传文件错误!");
					$ir_search.disabled(false);
					$wgt_loading.hide();
				}
			};
			$form.ajaxSubmit(options);
			return false;
		});
	});

	$("#ir-search").on("click",function(){
		var $this      	  = $(this),
			$file_text    = $("#ir-file-text"),
			$wgt_loading  = $("#wgt-loading-search"),
			$media_holder = $("#media-list-holder"),
			file_text     = $file_text.val(),
			media_src     = $file_text.data("media-src"),
			file_id       = $file_text.data("file-id");
			md5           = $file_text.data("md5");

		if ( (!file_text) || (!file_id) ) {
			$.error("你必须上传一张图片!");
		};
		var _data_ = "file_id=" + file_id + "&md5=" + md5;
		$wgt_loading.show();
		$this.disabled(true);
		$.ajax({
			type: "POST",
			url: window.location,
			data: _data_,
			success: function(msg) {
				msg = $.evalJSON(msg);
				$media_holder.find(".pricing-table").remove();
				$this.disabled(false);
				var media_list = msg.media_list;
				$("#time-count").text(msg.time_count);
				$("#total-num").text(msg.total_num);
				for(var i=0 in media_list){
					var media = media_list[i];
					var media_html    = $media_holder.data("html");
					media_html = $.format(
						media_html,media.image_medium_url,
						media.image_small_url,
						media.similarity
						)
					$media_holder.append($(media_html));
				}
				$wgt_loading.hide();
				$this.disabled(false);
			},
			error: function() {
				alert("出现错误，请检查参数！");
				$wgt_loading.hide();
				$this.disabled(false);
			},
		});
	});
});