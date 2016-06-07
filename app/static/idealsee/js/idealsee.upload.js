'use strict';
is.SwfUpload = function(a) {
    this.element = a;
    this.setDefaultOpt();
    this.opts = $.extend(this.defaultOpt,this.element.data());
    this.createStructure();
    this.swfupload = this.makeSwfUpload();
};
is.SwfUpload.prototype = {
    setDefaultOpt:function(){
        this.defaultOpt = {
            label : $._('Upload'),
            upload_url: "/web/comupload",
            file_post_name: "file",
            file_size_limit: "10240",
            file_type_description: $._('Media file'),
            file_types: "*.jpg;*.png;*.jpeg",
            upload_button_id:'upload' + new Date().getTime(),
            cancel_button_id:'cancel' + new Date().getTime(),
            progress_target:'progress' + new Date().getTime(),
            post_params: {},
            file_upload_limit:"0",

        }
    },
    createStructure:function(){
        $('<div>').addClass('btn btn-primary')
        .append(
            $('<span>'+this.opts.label+'</span>')
            .attr('id',this.opts.upload_button_id)
        )
        .appendTo(this.element);

        $('<div>').addClass('btn btn-danger')
        .attr('id',this.opts.cancel_button_id)
        .attr('disabled','disabled')
        .append('<span>'+$._('Cancle Upload')+'</span>')
        .appendTo(this.element);

        $('<div>').addClass('fieldset flash progressTarget')
        .attr('id',this.opts.progress_target)
        .css({'max-height':'200px','overflox-y':'auto'})
        .appendTo(this.element);

    },
    makeSwfUpload:function(){
        var button_width,swfupload;
        switch(this.opts.label.length){
            case 4:
                button_width = 90;
                break;
            case 2:
                button_width = 60;
                break;
        };
        button_width = 250;
        swfupload = new SWFUpload({
            // Backend Settings
            upload_url: this.opts.upload_url,
            file_post_name: this.opts.file_post_name,
            post_params: this.opts.post_params||{},
            // File Upload Settings
            file_size_limit: this.opts.file_size_limit,
            file_types: this.opts.file_types,
            file_types_description: this.opts.file_types_description,
            file_upload_limit: this.opts.file_upload_limit,
            file_queue_limit: "0",

            // Event Handler Settings (all my handlers are in the Handler.js file)
            file_dialog_start_handler: this.fileDialogStart.bind(this),
            file_queued_handler: this.fileQueued.bind(this),
            file_queue_error_handler: this.fileQueueError.bind(this),
            file_dialog_complete_handler: this.fileDialogComplete.bind(this),
            upload_start_handler: this.uploadStart.bind(this),
            upload_progress_handler: this.uploadProgress.bind(this),
            upload_error_handler: this.uploadError.bind(this),
            upload_success_handler: this.uploadSuccess.bind(this),
            upload_complete_handler: this.uploadComplete.bind(this),
            queue_complete_handler: this.queueComplete.bind(this),

            // Button Settings
            button_placeholder_id: this.opts.upload_button_id,
            //button_image_url : swfupload_btn_url,
            button_width: button_width,
            button_height: 20,
            button_text: '<span class="button">' + this.opts.label + '</span>',
            button_text_style: '.button { font-family: Helvetica, Arial, sans-serif; font-size: 14pt; font-weight: bold; color: #FFFFFF;text-align: center; } .buttonSmall { font-size: 10pt; }',
            button_text_top_padding: 3,
            button_text_left_padding: 0,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            button_cursor: SWFUpload.CURSOR.HAND,

            // Flash Settings
            flash_url: swfupload_url,

            custom_settings: {
                progressTarget: this.opts.progress_target,
                cancelButtonId: this.opts.cancel_button_id,
            },
        });
        return swfupload;
    },
    fileDialogStart:function(){

    },
    fileQueued:function(file) {
        try {
            // You might include code here that prevents the form from being submitted while the upload is in
            // progress.  Then you'll want to put code in the Queue Complete handler to "unblock" the form
            var progress = new FileProgress(file, this.swfupload.customSettings.progressTarget);
            progress.setStatus("Pending...");
            progress.toggleCancel(true, this.swfupload);
        } catch (ex) {
            this.swfupload.debug(ex);
        }

    },
    fileQueueError:function(file, errorCode, message) {
        try {
            if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
                return;
            }

            var progress = new FileProgress(file, this.swfupload.customSettings.progressTarget);
            progress.setError();
            progress.toggleCancel(false);

            switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                progress.setStatus("File is too big.");
                this.swfupload.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                progress.setStatus("Cannot upload Zero Byte files.");
                this.swfupload.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                progress.setStatus("Invalid File Type.");
                this.swfupload.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                alert("You have selected too many files.  " +  (message > 1 ? "You may only add " +  message + " more files" : "You cannot add any more files."));
                break;
            default:
                if (file !== null) {
                    progress.setStatus("Unhandled Error");
                }
                this.swfupload.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            }
        } catch (ex) {
            this.swfupload.debug(ex);
        }
    },
    fileDialogComplete:function(numFilesSelected, numFilesQueued) {
        try {
            if (this.swfupload.getStats().files_queued > 0) {
                document.getElementById(this.swfupload.customSettings.cancelButtonId).disabled = false;
                $("#" + this.swfupload.customSettings.cancelButtonId).parent().disabled(false);
                $(document).trigger(is.event.FILE_DIALOG_COMPLETE)
            }
            // file_dialog_complete(this.swfupload.customSettings.id);
            /* I want auto start and I can do that here */
            this.swfupload.startUpload();
        } catch (ex)  {
            this.swfupload.debug(ex);
        }
    },
    uploadStart:function(file) {
        try {
            /* I don't want to do any file validation or anything,  I'll just update the UI and return true to indicate that the upload should start */
            var progress = new FileProgress(file, this.swfupload.customSettings.progressTarget);
            progress.setStatus("Uploading...");
            progress.toggleCancel(true, this.swfupload);
        }
        catch (ex) {
        }
        
        return true;
    },
    uploadProgress:function(file, bytesLoaded, bytesTotal) {

        try {
            var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);

            var progress = new FileProgress(file, this.swfupload.customSettings.progressTarget);
            progress.setProgress(percent);
            progress.setStatus("Uploading...");
        } catch (ex) {
            this.swfupload.debug(ex);
        }
    },

    uploadSuccess:function(file, serverData) {
        try {
            eval('serverData = '+serverData);
            var progress = new FileProgress(file, this.swfupload.customSettings.progressTarget);
            if (serverData.status == 'success') {
                progress.setComplete();
                progress.setStatus("Complete.");
                progress.toggleCancel(false);
                serverData.file_name=file.name;
                $(document).trigger(is.event.FILE_UPLOAD_SUCCESS,[serverData]);
                // upload_success(serverData);
            }else{
                progress.setError();
                progress.toggleCancel(false);
                progress.setStatus("Upload Error: " + serverData.msg);
                this.swfupload.debug("Error, File name: " + file.name + ", Message: " + serverData.msg);
            }
            
        } catch (ex) {
            this.swfupload.debug(ex);
        }
    },
    uploadComplete:function(file) {
        try {
            /*  I want the next upload to continue automatically so I'll call startUpload here */
            if (this.swfupload.getStats().files_queued === 0) {
                document.getElementById(this.swfupload.customSettings.cancelButtonId).disabled = true;
                $("#" + this.swfupload.customSettings.cancelButtonId).parent().disabled(true);
            } else {    
                this.startUpload();
            }
        } catch (ex) {
            this.swfupload.debug(ex);
        }

    },
    queueComplete:function(){
        
    },
    uploadError:function(file, errorCode, message) {
        try {
            var progress = new FileProgress(file, this.swfupload.customSettings.progressTarget);
            progress.setError();
            progress.toggleCancel(false);

            switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                progress.setStatus("Upload Error: " + message);
                this.swfupload.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
                progress.setStatus("Configuration Error");
                this.swfupload.debug("Error Code: No backend file, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                progress.setStatus("Upload Failed.");
                this.swfupload.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                progress.setStatus("Server (IO) Error");
                this.swfupload.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                progress.setStatus("Security Error");
                this.swfupload.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                progress.setStatus("Upload limit exceeded.");
                this.swfupload.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
                progress.setStatus("File not found.");
                this.swfupload.debug("Error Code: The file was not found, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                progress.setStatus("Failed Validation.  Upload skipped.");
                this.swfupload.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                if (this.swfupload.getStats().files_queued === 0) {
                    document.getElementById(this.swfupload.customSettings.cancelButtonId).disabled = true;
                    $("#" + this.swfupload.customSettings.cancelButtonId).parent().disabled(true);
                }
                progress.setStatus("Cancelled");
                progress.setCancelled();
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                progress.setStatus("Stopped");
                break;
            default:
                progress.setStatus("Unhandled Error: " + error_code);
                this.swfupload.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                break;
            }
        } catch (ex) {
            this.swfupload.debug(ex);
        }
    }

};
is.wgt.register('swfupload', is.SwfUpload);
/*swfupload end*/


is.SingleUpload = function(a){
    this.element = a;
    this.url = this.element.data('url') || '/web/comupload';
    this.file_types = this.element.data('file-types') || "*.*";
    this.render_field_name = this.element.data('field-name');
    this.show_origin_progress = this.element.data('show-progress') || 0;
    this.accept_ext = this.element.data('accept') || '';
    this.options = {
        beforeSend     : this.beforeSend.bind(this),
        uploadProgress : this.uploadProgress.bind(this),
        success        : this.uploadSuccess.bind(this),
        error          : this.uploadError.bind(this),
        complete       : this.clearStructure.bind(this),
    }

    this.bindEvent();
};
is.SingleUpload.prototype = {
    bindEvent:function(){
        this.element.on('click',this.startUpload.bind(this));
    },
    createStructure:function(){
        this.uploadForm = $('<form>',{
            action:this.url,
            method:'POST',
            enctype:"multipart/form-data"
        }).appendTo('body').hide();
        this.uploadInput = $('<input>',{
            name:'file',
            type:'file',
            accept:this.file_types,
        }).appendTo(this.uploadForm);
        this.progress = $('<div>',{
            'class':'progress hide'
        }).append($('<div>',{
            'class':'progress-bar'
        }));
        this.element.after(this.progress);
    },
    clearStructure:function(){
        this.hideProgress();
        this.uploadForm.remove();
        this.progress.remove();
        $(document).trigger(is.event.SINGLE_UPLOAD_COMPLATE);
        this.element.trigger(is.event.SINGLE_UPLOAD_COMPLATE);
    },
    startUpload:function(e){
        this.createStructure();

        this.uploadForm.on('submit',this.submit.bind(this));
        this.uploadInput.on('change',this.selectFileComplate.bind(this));

        this.uploadInput.trigger('click');
        this.uploadInput.on('click',function(e){
            e.stopPropagation();
            return false;
        });
        e.stopPropagation();
        return false;
    },
    submit:function(e){
        this.uploadForm.ajaxSubmit(this.options);
        this.showProgress();
        this.element.trigger(is.event.SINGLE_UPLOAD_START);
        return false;
    },
    showProgress:function(){
        this.element.hide();
        if (this.show_origin_progress) {
            this.progress.show();
        }
    },
    hideProgress:function(){
        this.element.show();
        if (this.show_origin_progress) {
            this.progress.hide();
        }
    },
    selectFileComplate:function(e){
        var ext = this.uploadInput.val().split(".").pop();

        if (this.accept_ext.search(ext) < 0) {
            is.alert('Error','File type is error');
            return;
        }
        if (this.uploadInput.val()) {
            $(document).trigger(is.event.SINGLE_UPLOAD_START);
            this.element.trigger(is.event.SINGLE_UPLOAD_START);
            this.uploadForm.trigger('submit');
        } else {
            this.clearStructure();
        }
    },
    beforeSend:function(xhr, o){
        this.xhr = xhr;
    },
    cancelUpload:function(){
        if (this.xhr) {
            this.xhr.abort();
        };
    },
    uploadSuccess:function(a){
        try{
            a = $.evalJSON(a);
        }catch(e){
        }
        
        if (a.status == 'error') {
            is.alert('Error',a.msg);
            $(document).trigger(is.event.SINGLE_UPLOAD_ERROR,[a]);
            this.element.trigger(is.event.SINGLE_UPLOAD_ERROR,[a]);
        } else{
            a.field_name = this.render_field_name;
            $(document).trigger(is.event.SINGLE_UPLOAD_SUCCESS,[a]);
            this.element.trigger(is.event.SINGLE_UPLOAD_SUCCESS,[a]);
            this.showResult(a);
        }
        this.clearStructure();
    },
    uploadError:function(a,b){
        try{
            a = $.evalJSON(a);
        }catch(e){
        }
        a.field_name = this.render_field_name;
        if (a.statusText == 'abort' || b == 'abort ') {
            return;
        }
        is.alert('Error','Upload file error');
        $(document).trigger(is.event.SINGLE_UPLOAD_ERROR,[a]);
        this.element.trigger(is.event.SINGLE_UPLOAD_ERROR,[a]);
        this.clearStructure();
    },
    uploadProgress:function(e,position, total, percent){
        $(document).trigger(is.event.SINGLE_UPLOAD_PROGRESS,[position,total,percent]);
        this.element.trigger(is.event.SINGLE_UPLOAD_PROGRESS,[position,total,percent]);
        this.progress.find('.bar').css({
            width:percent + '%'
        });
    },
    showResult:function(a){
        $('.'+this.render_field_name + '_file_name')
        .show()
        .text(a.file_name);
        
    },
};
is.wgt.register('single-upload',is.SingleUpload);