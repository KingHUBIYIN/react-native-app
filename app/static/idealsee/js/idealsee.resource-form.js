
is.wgt.ResourceFrom = function(a) {
    this.element = a;
    this.element.validate();
    this.opts = {
        success:this.submitSuccess.bind(this),
        error:this.submitError.bind(this)
    };
    this.el = {
        imageHolder : this.element.find('.image-holder'),
        // swfupload:this.element.find('.swfupload'),
        imageUpload:this.element.find('.create-upload'),
        cover:this.element.find('.create-cover'),
        progress:this.element.find('.create-progress'),
        warning:this.element.find('.swfupload-warning'),
        
        
        // add cate
        btnShowAddCate:this.element.find('.btn-show-add-cate'),
        addCateHolder:this.element.find('.add-cate-holder'),
        addCateSelect:this.element.find('.select_cate'),
        addCateInput:this.element.find('.add-cate-input'),
        addCateSubmit:this.element.find('.btn-add-submit'),
        addCateCancel:this.element.find('.btn-add-cancel'),
        // isearch
        irsearchStatus:this.element.find('.irsearch-status'),
        irsearchRsRate:this.element.find('.irsearch-rs-rate'),
        pictureRate:this.element.find('.picture-rate'),
        irsearchRsLower:this.element.find('.irsearch-rs-lower'),
        irsearchRsSimilar:this.element.find('.irsearch-rs-similar'),
        irsearchRsSimilarImg:this.element.find('.irsearch-rs-similar-img'),
    };
    this.url = {
        irsearch : this.element.data('irsearch-url'),
        starRated:this.element.data('star-rated-url'),
        starUnRated:this.element.data('star-unrated-url'),
        addCate:this.element.data('add-cate-url'),
    };

    this.fileUploadSuccess = false;
    this.checkUploadFileSuccess = false;
    this.bindEvents();
    this.initialValues = this.getFormValues();
};
is.wgt.ResourceFrom.prototype = {
    bindEvents: function() {
        is.lightbox.get(this.element).userClose = this.userClose.bind(this);
        this.element.on('submit', this.replaceSubmit.bind(this));
        // this.el.btnShowAddCate.live('click', this.showAddCate.bind(this));
        this.el.addCateSelect.on('change', this.showAddCate.bind(this));

        this.el.addCateSubmit.on('click', this.addCateSubmit.bind(this));
        this.el.addCateCancel.on('click', this.addCateCancel.bind(this));

        // $(document).on(is.event.FILE_UPLOAD_SUCCESS,this.renderFormHtml.bind(this));
        // $(document).on(is.event.FILE_UPLOAD_SUCCESS,this.checkUploadFile.bind(this));
        this.el.imageUpload.on(is.event.SINGLE_UPLOAD_START,this.uploadStart.bind(this));
        this.el.imageUpload.on(is.event.SINGLE_UPLOAD_PROGRESS,this.uploadProgress.bind(this));
        this.el.imageUpload.on(is.event.SINGLE_UPLOAD_SUCCESS,this.renderFormHtml.bind(this));
        this.el.imageUpload.on(is.event.SINGLE_UPLOAD_SUCCESS,this.checkUploadFile.bind(this));
        this.el.imageUpload.on(is.event.SINGLE_UPLOAD_ERROR,this.uploadError.bind(this));
    },
    uploadStart:function(e){
        this.showProgress();
        this.el.irsearchRsSimilarImg.html("");
        this.el.irsearchRsSimilar.hide();

        // this.el.imageUpload.removeClass('upload-btn');

    },
    uploadProgress:function(e,position, total, percent){
        this.el.progress.find('.progress-bar').css({'width':percent + '%'});
    },
    showProgress:function(){
        // this.el.cover.show();
        this.el.progress.show();
        this.el.progress.find('.progress-bar').css({'width':'0px'});
    },
    hideProgress:function(){
        // this.el.cover.hide();
        this.el.progress.hide();
    },
    uploadError:function(e){
        this.hideProgress();
        // this.el.imageUpload.addClass('upload-btn');
    },
    getFormValues: function() {
        var a, b = {},
        c = this.element.serializeArray();
        for (var d = 0,
        e = c.length; d < e; d++) {
            a = c[d];
            if (a.name !== 'csrfmiddlewaretoken') b[a.name] = a.value;
        }
        
        return b;
    },
    replaceSubmit: function() {

        if (!this.element.valid()) return false;
        if(!this.fileUploadSuccess) {
            is.alert('Error','you must upload a picture');
            return false;
        }
        if(!this.checkUploadFileSuccess) {
            is.alert('Warning','Being analyzed, please be patient');
            return false;
        }
        if (this.el.addCateInput.val()){
            this.addCateSubmit(null,function(){
                this.element.ajaxSubmit(this.opts);
            }.bind(this));
        } else {
            this.element.ajaxSubmit(this.opts);
        }
        return false;
    },
    showAddCate:function(){
        if (this.el.addCateSelect.val() == 'add'){
            this.el.addCateSelect.hide();
            this.el.addCateHolder.show();
            this.el.addCateInput.val('');
            this.el.addCateInput.focus();
            this.el.addCateSelect.val('');
        }
    },
    addCateSubmit:function(e,callback){
        console.log(this);
        var newCate = this.el.addCateInput.val();
        if (newCate == '') {
            is.alert('Error','Category Name can not be empty' || 'system error');
            return false;
        }
        var post_data = {
            cate_name : newCate
        }
        $.post(this.url.addCate,post_data,function(e){
            this.addCateResponse(e,newCate);
            callback && callback();
        }.bind(this));
        this.el.addCateInput.val('');
    },
    addCateCancel:function(e){
        this.el.addCateHolder.hide();
        this.el.addCateInput.val('');
        this.el.addCateSelect.show();
    },
    addCateResponse:function(e){
        if (e.error) {
            is.alert('Error',e.msg || 'system error');
        } else {
            this.el.addCateHolder.hide();
            this.el.addCateSelect.show();
            this.el.addCateSelect.prepend(
                $('<option>',{
                    text:e.cate_name,
                    value:e.cate_id,
                    selected:true,
                })
            );
        }
    },
    submitSuccess:function(responseText,statusText,xhr){
        var next_url;
        try {
            eval('responseText = '+responseText);
        } catch(ex) {

        }
        if (responseText.next_url) {
            window.location = responseText.next_url;
        } else {
            window.location.reload();
        }
    },
    submitError:function(responseText,statusText,xhr){
        var msg;
        try{
            msg = $.evalJSON(responseText.responseText).msg;
        } catch(ex){
            msg = 'System error'
        }
        is.alert('Error', msg);
    },
    renderFormHtml:function(e,data){
        this.hideProgress();
        this.el.warning.hide();
        this.el.imageUpload.removeClass('upload-btn');
        var uploadFileHtml,hiddenHtml;
        // uploadFileHtml=$('<div>',{'class':'upload-file-item'})
        //     .append($('<img>',{'src':data.image_src}));
        uploadFileHtml = $('<img>',{'src':data.image_src, 'class':'upload-file-item'});
        // hiddenHtml = $('<input>',{
        //     type:'hidden',
        //     name:'file',
        //     value:data.md5
        // });
        // this.el.imageHolder.append(uploadFileHtml);
        this.el.imageUpload.html(uploadFileHtml);
        this.element.find('#file').val(data.md5);
        this.element.find('.resource_submit').removeAttr('disabled');

        // setTimeout(this.removeSwfupload.bind(this),1000);
    },
    removeSwfupload:function(){
        // this.el.swfupload.remove();
    },
    checkUploadFile:function(e,data){
        this.fileUploadSuccess = true;
        this.el.irsearchStatus.show();
        var post_data = {
            'file_id':data.file_id,
            'md5':data.md5
        };
        $.post(this.url.irsearch,post_data,function(e){
            this.handCheckResponse(e);
        }.bind(this));
        return false;
    },
    handCheckResponse:function(e){
        this.el.irsearchStatus.hide();
        if (e.error) {
            is.alert('Error',e.msg || 'system error');
        } else {
            this.checkUploadFileSuccess = true;
            this.renderRate(e.rate || 0);
            this.renderResourceList(e.resource_list || []);
        }
    },
    renderRate:function(rate){
        // if (rate == 0) {
        //     this.el.irsearchRsLower.show();
        // }
        // this.el.irsearchRsRate.show();
        // var starRateHtml = "";
        // var desc = "";
        // if (rate == 0) {
        //     desc = this.el.irsearchRsRate.data('rate-0');
        // } else if (rate == 1) {
        //     desc = this.el.irsearchRsRate.data('rate-1');
        // } else if (rate == 2) {
        //     desc = this.el.irsearchRsRate.data('rate-2');
        // } else if (rate == 3) {
        //     desc = this.el.irsearchRsRate.data('rate-3');
        // } else if (rate == 4) {
        //     desc = this.el.irsearchRsRate.data('rate-4');
        // } else if (rate == 5) {
        //     desc = this.el.irsearchRsRate.data('rate-5');
        // }
        // var percent = rate * 20;
        // starRateHtml = "<span class='' >" + percent + "%(" + desc + ")</span>";
        // this.el.pictureRate.html(starRateHtml);
    },
    renderResourceList:function(resource_list){
        if (resource_list.length > 0) {
            this.el.irsearchRsSimilar.show();
            var uploadFileHtml;
            for (var i = 0 in resource_list) {
                var resource = resource_list[i];
                uploadFileHtml=$('<div>',{'class':'resource-similar-item'})
                    .append($('<img>',{'src':resource.image_src}))
                    .append($('<span>',{'text':resource.title}));
                this.el.irsearchRsSimilarImg.append(uploadFileHtml);
                this.el.irsearchRsSimilarImg.show();
            }
        }
    },
    userClose: function() {
        var a, b;
        b = function() {
            var a = is.lightbox.get(this.element);
            $(document).off(is.event.FILE_UPLOAD_SUCCESS);
            a.closeAll();
        }.bind(this);
        a = {
            ok: b,
            offsetObj: this.element,
            offsetX: -150,
            offsetY: -this.element.height() + 50
        };
        // if (this.isFormDirty()) is.confirm('Shutting down the window ...', 'Are you sure to close without saving changes?', a);
        // else b();
        b();
    },
    isFormDirty: function() {
        var a = this.getFormValues();
        return ! is.isEqualDict(a, this.initialValues);
    },
};
is.wgt.register('btg-resource-from', is.wgt.ResourceFrom);


is.wgt.EduResourceFrom = function(a) {
    this.element = a;
    this.element.validate();
    this.opts = {
        success:this.submitSuccess.bind(this),
        error:this.submitError.bind(this)
    };
    this.el = {
        imageHolder : this.element.find('.image-holder'),
        // swfupload:this.element.find('.swfupload'),
        imageUpload:this.element.find('.create-upload'),
        imageUpload1:this.element.find('.create-upload1'),
        //cover:this.element.find('.create-cover'),
        progress:this.element.find('.create-progress'),
        progress1:this.element.find('.create-progress1'),
        warning:this.element.find('.swfupload-warning'),
        
        
        // add cate
        btnShowAddCate:this.element.find('.btn-show-add-cate'),
        addCateHolder:this.element.find('.add-cate-holder'),
        addCateSelect:this.element.find('.select_cate'),
        addCateInput:this.element.find('.add-cate-input'),
        addCateSubmit:this.element.find('.btn-add-submit'),
        addCateCancel:this.element.find('.btn-add-cancel'),
        // isearch
        irsearchStatus:this.element.find('.irsearch-status'),
        irsearchRsRate:this.element.find('.irsearch-rs-rate'),
        pictureRate:this.element.find('.picture-rate'),
        irsearchRsLower:this.element.find('.irsearch-rs-lower'),
        irsearchRsSimilar:this.element.find('.irsearch-rs-similar'),
        irsearchRsSimilarImg:this.element.find('.irsearch-rs-similar-img'),
    };
    this.url = {
        irsearch : this.element.data('irsearch-url'),
        starRated:this.element.data('star-rated-url'),
        starUnRated:this.element.data('star-unrated-url'),
        addCate:this.element.data('add-cate-url'),
    };

    this.fileUploadSuccess = false;
    this.checkUploadFileSuccess = false;
    this.bindEvents();
    this.initialValues = this.getFormValues();
};
is.wgt.EduResourceFrom.prototype = {
    bindEvents: function() {
        is.lightbox.get(this.element).userClose = this.userClose.bind(this);
        this.element.on('submit', this.replaceSubmit.bind(this));
        // this.el.btnShowAddCate.live('click', this.showAddCate.bind(this));
        this.el.addCateSelect.on('change', this.showAddCate.bind(this));

        this.el.addCateSubmit.on('click', this.addCateSubmit.bind(this));
        this.el.addCateCancel.on('click', this.addCateCancel.bind(this));

        // $(document).on(is.event.FILE_UPLOAD_SUCCESS,this.renderFormHtml.bind(this));
        // $(document).on(is.event.FILE_UPLOAD_SUCCESS,this.checkUploadFile.bind(this));
        this.el.imageUpload.on(is.event.SINGLE_UPLOAD_START,this.uploadStart.bind(this));
        this.el.imageUpload.on(is.event.SINGLE_UPLOAD_PROGRESS,this.uploadProgress.bind(this));
        this.el.imageUpload.on(is.event.SINGLE_UPLOAD_SUCCESS,this.renderFormHtml.bind(this));
        this.el.imageUpload.on(is.event.SINGLE_UPLOAD_SUCCESS,this.checkUploadFile.bind(this));
        this.el.imageUpload.on(is.event.SINGLE_UPLOAD_ERROR,this.uploadError.bind(this));
        
        this.el.imageUpload1.on(is.event.SINGLE_UPLOAD_START,this.uploadStart1.bind(this));
        this.el.imageUpload1.on(is.event.SINGLE_UPLOAD_PROGRESS,this.uploadProgress1.bind(this));
        this.el.imageUpload1.on(is.event.SINGLE_UPLOAD_SUCCESS,this.renderFormHtml1.bind(this));
        this.el.imageUpload1.on(is.event.SINGLE_UPLOAD_SUCCESS,this.checkUploadFile.bind(this));
        this.el.imageUpload1.on(is.event.SINGLE_UPLOAD_ERROR,this.uploadError1.bind(this));
    },
    uploadStart:function(e){
        this.showProgress();        
    },
    uploadStart1:function(e){
        this.showProgress1();        
    },
    uploadProgress:function(e,position, total, percent){
        this.el.progress.find('.progress-bar').css({'width':percent + '%'});
    },
    uploadProgress1:function(e,position, total, percent){
        this.el.progress1.find('.progress-bar1').css({'width':percent + '%'});
    },
    showProgress:function(){
        // this.el.cover.show();
        this.el.progress.show();
        this.el.progress.find('.progress-bar').css({'width':'0px'});
    },
    showProgress1:function(){
        // this.el.cover.show();
        this.el.progress1.show();
        this.el.progress1.find('.progress-bar1').css({'width':'0px'});
    },
    hideProgress:function(){
        // this.el.cover.hide();        
        this.el.progress.hide();
    },
    hideProgress1:function(){
        // this.el.cover.hide();
        this.el.progress1.hide();                
    },
    uploadError:function(e){
        this.hideProgress();
        // this.el.imageUpload.addClass('upload-btn');
    },
    uploadError1:function(e){
        this.hideProgress1();
        // this.el.imageUpload.addClass('upload-btn');
    },
    getFormValues: function() {
        var a, b = {},
        c = this.element.serializeArray();
        for (var d = 0,
        e = c.length; d < e; d++) {
            a = c[d];
            if (a.name !== 'csrfmiddlewaretoken') b[a.name] = a.value;
        }
        
        return b;
    },
    replaceSubmit: function() {

        if (!this.element.valid()) return false;
        if(!this.fileUploadSuccess) {
            is.alert('Error','you must upload a picture');
            return false;
        }
        //if(!this.checkUploadFileSuccess) {
        //    is.alert('Warning','Being analyzed, please be patient');
        //    return false;
        //}
        if (this.el.addCateInput.val()){
            this.addCateSubmit(null,function(){
                this.element.ajaxSubmit(this.opts);
            }.bind(this));
        } else {
            this.element.ajaxSubmit(this.opts);
        }
        return false;
    },
    showAddCate:function(){
        if (this.el.addCateSelect.val() == 'add'){
            this.el.addCateSelect.hide();
            this.el.addCateHolder.show();
            this.el.addCateInput.val('');
            this.el.addCateInput.focus();
            this.el.addCateSelect.val('');
        }
    },
    addCateSubmit:function(e,callback){
        console.log(this);
        var newCate = this.el.addCateInput.val();
        if (newCate == '') {
            is.alert('Error','Category Name can not be empty' || 'system error');
            return false;
        }
        var post_data = {
            exam_name : newCate
        }
        $.post(this.url.addCate,post_data,function(e){
            this.addCateResponse(e,newCate);
            callback && callback();
        }.bind(this));
        this.el.addCateInput.val('');
    },
    addCateCancel:function(e){
        this.el.addCateHolder.hide();
        this.el.addCateInput.val('');
        this.el.addCateSelect.show();
    },
    addCateResponse:function(e){
        if (e.error) {
            is.alert('Error',e.msg || 'system error');
        } else {
            this.el.addCateHolder.hide();
            this.el.addCateSelect.show();
            this.el.addCateSelect.prepend(
                $('<option>',{
                    text:e.cate_name,
                    value:e.cate_id,
                    selected:true,
                })
            );
        }
    },
    submitSuccess:function(responseText,statusText,xhr){
        var next_url;
        try {
            eval('responseText = '+responseText);
        } catch(ex) {

        }
        if (responseText.next_url) {
            window.location = responseText.next_url;
        } else {
            window.location.reload();
        }
    },
    submitError:function(responseText,statusText,xhr){
        var msg;
        try{
            msg = $.evalJSON(responseText.responseText).msg;
        } catch(ex){
            msg = 'System error'
        }
        is.alert('Error', msg);
    },
    renderFormHtml:function(e,data){
        this.hideProgress();
        this.el.warning.hide();
        this.el.imageUpload.removeClass('upload-btn');        
        var uploadFileHtml,hiddenHtml;
        // uploadFileHtml=$('<div>',{'class':'upload-file-item'})
        //     .append($('<img>',{'src':data.image_src}));
        uploadFileHtml = $('<img>',{'src':data.image_src, 'class':'upload-file-item'});
        // hiddenHtml = $('<input>',{
        //     type:'hidden',
        //     name:'file',
        //     value:data.md5
        // });
        // this.el.imageHolder.append(uploadFileHtml);
        this.el.imageUpload.html(uploadFileHtml);
        this.element.find('#file1').val(data.md5);
        this.element.find('.resource_submit').removeAttr('disabled');

        // setTimeout(this.removeSwfupload.bind(this),1000);
    },
    renderFormHtml1:function(e,data){
        this.hideProgress1();
        this.el.warning.hide();        
        this.el.imageUpload1.removeClass('upload-btn1');
        var uploadFileHtml,hiddenHtml;
        // uploadFileHtml=$('<div>',{'class':'upload-file-item'})
        //     .append($('<img>',{'src':data.image_src}));
        uploadFileHtml = $('<img>',{'src':data.image_src, 'class':'upload-file-item'});
        // hiddenHtml = $('<input>',{
        //     type:'hidden',
        //     name:'file',
        //     value:data.md5
        // });
        // this.el.imageHolder.append(uploadFileHtml);
        this.el.imageUpload1.html(uploadFileHtml);
        this.element.find('#file2').val(data.md5);
        //this.element.find('.resource_submit').removeAttr('disabled');

        // setTimeout(this.removeSwfupload.bind(this),1000);
    },
    removeSwfupload:function(){
        // this.el.swfupload.remove();
    },
    checkUploadFile:function(e,data){
        this.fileUploadSuccess = true;
        //this.el.irsearchStatus.show();
        //var post_data = {
       //     'file_id':data.file_id,
        //    'md5':data.md5
        //};
       // $.post(this.url.irsearch,post_data,function(e){
        //    this.handCheckResponse(e);
        //}.bind(this));
        return false;
    },
    handCheckResponse:function(e){
        this.el.irsearchStatus.hide();
        if (e.error) {
            is.alert('Error',e.msg || 'system error');
        } else {
            this.checkUploadFileSuccess = true;
            this.renderRate(e.rate || 0);
            this.renderResourceList(e.resource_list || []);
        }
    },
    renderRate:function(rate){
        // if (rate == 0) {
        //     this.el.irsearchRsLower.show();
        // }
        // this.el.irsearchRsRate.show();
        // var starRateHtml = "";
        // var desc = "";
        // if (rate == 0) {
        //     desc = this.el.irsearchRsRate.data('rate-0');
        // } else if (rate == 1) {
        //     desc = this.el.irsearchRsRate.data('rate-1');
        // } else if (rate == 2) {
        //     desc = this.el.irsearchRsRate.data('rate-2');
        // } else if (rate == 3) {
        //     desc = this.el.irsearchRsRate.data('rate-3');
        // } else if (rate == 4) {
        //     desc = this.el.irsearchRsRate.data('rate-4');
        // } else if (rate == 5) {
        //     desc = this.el.irsearchRsRate.data('rate-5');
        // }
        // var percent = rate * 20;
        // starRateHtml = "<span class='' >" + percent + "%(" + desc + ")</span>";
        // this.el.pictureRate.html(starRateHtml);
    },
    renderResourceList:function(resource_list){
        if (resource_list.length > 0) {
            this.el.irsearchRsSimilar.show();
            var uploadFileHtml;
            for (var i = 0 in resource_list) {
                var resource = resource_list[i];
                uploadFileHtml=$('<div>',{'class':'resource-similar-item'})
                    .append($('<img>',{'src':resource.image_src}))
                    .append($('<span>',{'text':resource.title}));
                this.el.irsearchRsSimilarImg.append(uploadFileHtml);
                this.el.irsearchRsSimilarImg.show();
            }
        }
    },
    userClose: function() {
        var a, b;
        b = function() {
            var a = is.lightbox.get(this.element);
            $(document).off(is.event.FILE_UPLOAD_SUCCESS);
            a.closeAll();
        }.bind(this);
        a = {
            ok: b,
            offsetObj: this.element,
            offsetX: -150,
            offsetY: -this.element.height() + 50
        };
        // if (this.isFormDirty()) is.confirm('Shutting down the window ...', 'Are you sure to close without saving changes?', a);
        // else b();
        b();
    },
    isFormDirty: function() {
        var a = this.getFormValues();
        return ! is.isEqualDict(a, this.initialValues);
    },
};
is.wgt.register('btg-edu-resource-from', is.wgt.EduResourceFrom);