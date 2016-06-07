
!(function($){
    
function file_dialog_complete(id) {
  //alert(id);
}
function queue_complete_handler() {
  //alert(id);
}
function build_upload(options) {
  var defaults = {
    label : "批量上传",
    upload_url: "/web/comupload",
    file_post_name: "file",
    file_size_limit: "10240",
    file_type_description: "媒体文件",
    file_types: "*.*",
    button_id: "spanButtonPlaceholder",
    progressTarget: "fsUploadProgress",
    cancelButtonId: "cancelButton",
    post_params: {},
    file_upload_limit:"0",
  }
  var opts = $.extend({}, defaults, options);
  switch(opts.label.length){
    case 4:
      button_width = 90;
      break;
    case 2:
      button_width = 60;
      break;
  }
  var swfupload = new SWFUpload({
    // Backend Settings
    upload_url: opts.upload_url,
    file_post_name: opts.file_post_name,
    post_params: opts.post_params,
    // File Upload Settings
    file_size_limit: opts.file_size_limit,
    file_types: opts.file_types,
    file_types_description: opts.file_types_description,
    file_upload_limit: opts.file_upload_limit,
    file_queue_limit: "0",

    // Event Handler Settings (all my handlers are in the Handler.js file)
    file_dialog_start_handler: fileDialogStart,
    file_queued_handler: fileQueued,
    file_queue_error_handler: fileQueueError,
    file_dialog_complete_handler: fileDialogComplete,
    upload_start_handler: uploadStart,
    upload_progress_handler: uploadProgress,
    upload_error_handler: uploadError,
    upload_success_handler: uploadSuccess,
    upload_complete_handler: uploadComplete,
    queue_complete_handler: queue_complete_handler,

    // Button Settings
    button_placeholder_id: opts.button_id,
    //button_image_url : swfupload_btn_url,
    button_width: button_width,
    button_height: 18,
    button_text: '<span class="button">' + opts.label + '</span>',
        button_text_style: '.button { font-family: Helvetica, Arial, sans-serif; font-size: 14pt; font-weight: bold; color: #FFFFFF; } .buttonSmall { font-size: 10pt; }',
        button_text_top_padding: 3,
        button_text_left_padding: 18,
    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
    button_cursor: SWFUpload.CURSOR.HAND,

    // Flash Settings
    flash_url: swfupload_url,

    custom_settings: {
      progressTarget: opts.progressTarget,
      cancelButtonId: opts.cancelButtonId,
    },
  });
  return swfupload;
}
  $(function() {
    $("[data-toggle='swfupload']").each(function() {
      var $this = $(this);
      var $options = $this.attr("options") ? $this.attr("options") : "{}";
      $options = eval("(" + $options + ")");
      var $progressTarget = $this.find(".progressTarget").attr("id");
      var $buttonId = $this.find(".buttonId").attr("id");
      var $cancelButton = $this.find(".cancelButtonId");
      var $instance = $this.attr("data-instance");
      var $not_need_narrow = $this.data("not-need-narrow");
      $options.progressTarget = $progressTarget;
      $options.button_id = $buttonId;
      $options.cancelButtonId = $cancelButton.attr("id");
      $options.post_params = {
        "instance": $instance
      };
      if ($not_need_narrow) {
        $options.post_params["not_need_narrow"] = 1
      };
      var swfupload = build_upload($options);
      $cancelButton.bind("click", function() {
        cancelQueue(swfupload);
      });
      $this.data('swfupload',swfupload);
    });
  });
})(jQuery)