'use strict';
is.btg.Resource = function(a) {
    this.element = a;
    this.id = this.element.data('id');
    this.setEl();
    this.el.resourcePictureList = this.element.find('.resource-picture');
    this.url = {
        deleteUrl:this.element.data('delete-url'),
        changeUrl:this.element.data('change-url'),
        stateUrl : this.element.data('state-url'),
    };
    this.tpl = {
        resourceTitle:$('#mustache-resource-title').assert().html(),
        editorCateList:$('#mustache-editor-cate-list').assert().html(),
        attrCateList:$('#mustache-attr-cate-list').assert().html(),
    };
    if (this.el.resourcePictureList.length == 1) {
        this.el.resourcePictureList.find('.resource-picture-delete').hide();
    };

    this.activeNavTitle = this.element.data('active-nav-title') || 'Home';

    this.trainingState = this.element.data('training-state') != 'False';
    this.trainingRate = this.element.data('training-rate') || 0;
    this.vuRate = this.element.data('vu-rate') || 0;
    this.ifAr = this.element.data('if-ar') == 'True' ? 1 : 0;
    this.arState = this.element.data('ar-state') != 'False';
    this.ifRandom = this.element.data('if-random') || 0;
    this.publish = this.element.data('publish');
    this.cache = this.element.data('cache');
    this.layer = this.element.data('layer');

    this.waitedit = this.element.find('.resource-waitedit');
    this.unreleased = this.element.find('.resource-unreleased');
    this.apply = this.element.find('.resource-apply');
    this.deny = this.element.find('.resource-deny');
    this.released = this.element.find('.resource-released');
    this.updateUnreleased = this.element.find('.resource-update-unreleased');
    this.updateApply = this.element.find('.resource-update-apply');
    this.random = this.element.find('.resource-random');

    this.updateArBtnState(this.element.data('if-ar'));
    this.updateRandomState();
    this.bindEvent();
};
is.btg.Resource.prototype = {
    bindEvent : function(){
        this.el.deleteBtn.on('click',this.deleteBtnClick.bind(this));
        this.el.changeBtn.on('click',this.changeBtnClick.bind(this));
        this.el.changeSubmitBtn.on('click',this.changeSubmit.bind(this));
        // this.el.arBtn.on(is.event.LIVE,this.changeAr.bind(this));
        this.el.arBtn.on('click',this.changeAr.bind(this));
        this.el.randomBtn.on('change',this.changeRandom.bind(this));
        // this.el.customPublishedBtn.on('change',this.customPublished.bind(this));
        this.el.customPublishedBtn.on('click',this.customPublished.bind(this));
        this.el.customPublishedCancelBtn.on('click',this.customPublishedCancel.bind(this));

        this.el.layerBtn.on('click',this.replaceLayerBtnClick.bind(this));

        this.element.on(is.event.NEED_UPDATE_PUBLISH, this.updateNew.bind(this));

        this.addInterval();
    },
    updateNew:function(){
        var resourcePictureWgt = this.getResourcePictureWgt();
        resourcePictureWgt.updateState();
        this.updateRandomState();
    },
    addInterval:function(){
        is.resourceCheckState.addResourceId(this.id);
    },
    getResourcePictureWgt:function(){
        if(!this.resourcePictureWgt)
            this.resourcePictureWgt = is.wgt.get(this.el.resourcePictureList,'btg-resource-picture');
        return this.resourcePictureWgt;
    },
    deleteBtnClick:function(e){
        is.confirm('Delete resource', 'Are you sure to delete?', {ok: this.remove.bind(this)});
        return false;
    },
    updateArBtnState:function(available){
        if (available == 'True') {
            this.el.arBtn.css("background", "url('../static/idealsee/img/topic_list/ARon.png') no-repeat")
        } else {
            this.el.arBtn.css("background", "url('../static/idealsee/img/topic_list/ARoff.png') no-repeat")
        }
        // this.el.arBtn.attr('disabled',!available);
        // this.el.arBtn.parent().toggleClass('disabled');
    },
    remove:function(){
        $.delete(this.url.deleteUrl, {}, function(a) {
            this.handleDeleteResponse(a);
        }.bind(this));
    },
    handleDeleteResponse: function(a) {
        if (!a.error){
            this.element.remove();
            is.resourceCheckState.removeResourceId(this.id);
        }
        else
            is.alertUnexpectedServerResponse(a, 'error');
    },
    setEl:function(){
        this.el = {
            deleteBtn:this.element.find('.resource-delete'),
            changeBtn:this.element.find('.resource-change'),
            changeSubmitBtn:this.element.find('.btn-resource-change-submit'),
            resourceTitle:this.element.find('.resource-title'),
            cateName:this.element.find('.cate-name'),
            editorCateName:this.element.find('.editor-cate-name'),
            attrCateName:this.element.find('.attr-cate-name'),
            // arBtn:this.element.find('.change-if-ar'),
            arBtn:this.element.find('.ar-check'),
            randomBtn:this.element.find('.change-if-random'),
            // customPublishedBtn:this.element.find('.change-if-custom-published'),
            customPublishedBtn:this.element.find('#publish-btn'),
            customPublishedCancelBtn:this.element.find('.publish-cancel-btn'),

            changeArGroup:this.element.find('.change-if-ar-group'),
            layerBtn:this.element.find('.layer-btn').assert(),

            // randomLabel:this.element.find('.resource-random-label').assert(),

            dropDown:this.element.find('.dropdown'),
        };
    },
    toggleArState:function(d){
        if (d) {
            this.el.changeArGroup.addClass('disabled');
            // this.el.arBtn.attr('disabled',d);
            // this.el.arBtn.parent().addClass('disabled');
        }else{
            this.el.changeArGroup.removeClass('disabled');
            // this.el.arBtn.attr('disabled',d);
            // this.el.arBtn.parent().removeClass('disabled');
        }
    },
    changeBtnClick:function(e){
        var title,editorCateId,attrCateId;
            
        title        = this.el.resourceTitle.text();
        editorCateId = this.el.editorCateName.data('cate-id');
        attrCateId   = this.el.attrCateName.data('attr-cate-id');
        
        this.el.dropDown.toggleClass('open');
        this.el.dropDown.hide();

        this.element.find('.rt-change').addClass('rt-change-change');

        this.changeResourceTitle  = $(is.tpl(
            Mustache.render(this.tpl.resourceTitle,{resourceTitle:title})
        ));
        this.changeEditorCateList = $(is.tpl(
            Mustache.render(this.tpl.editorCateList)
        ));
        this.changeAttrCateList   = $(is.tpl(
            Mustache.render(this.tpl.attrCateList)
        ));

        this.el.resourceTitle.after(this.changeResourceTitle).hide();
        this.el.editorCateName.after(this.changeEditorCateList).hide();
        this.el.attrCateName.after(this.changeAttrCateList).hide();

        this.el.cateName.toggleClass('cate-name');
        this.el.cateName.toggleClass('select-group');
        // this.el.changeBtn.hide();

        this.el.changeSubmitBtn.show();

        // this.changeResourceTitle.focus();
        this.changeEditorCateList.val(editorCateId);
        this.changeAttrCateList.val(attrCateId);

        return false;
    },
    changeSubmit:function(e){
        var put_data = {
            resource_tag_title:  this.changeResourceTitle.val(),
            cate_id:  this.changeEditorCateList.val(),
            attr_cate_id:  this.changeAttrCateList.val(),
        };
        $.put(this.url.changeUrl,put_data,function(a){
            this.handleChangeResponse(a);
        }.bind(this));
        return false;
    },
    handleChangeResponse:function(a){
        if (!a.error){
            this.el.resourceTitle.show().text(this.changeResourceTitle.val());
            this.el.resourceTitle.attr('title', this.changeResourceTitle.val());
            this.el.editorCateName.show().text(this.changeEditorCateList.find('option:selected').text());
            this.el.editorCateName.attr('title', this.changeEditorCateList.find('option:selected').text());
            this.el.attrCateName.show().text(this.changeAttrCateList.find('option:selected').text());

            this.changeResourceTitle.remove();
            this.element.find('.change-editor-cate-list').remove();
            this.element.find('.change-attr-cate-list').remove();

            this.element.find('.rt-change').removeClass('rt-change-change');

            this.el.cateName.toggleClass('cate-name');
            this.el.cateName.toggleClass('select-group');
            // this.el.changeBtn.show();
            this.el.changeSubmitBtn.hide();
            this.el.dropDown.show();

            this.el.editorCateName.data('cate-id',this.changeEditorCateList.val());
            this.el.attrCateName.data('attr-cate-id',this.changeEditorCateList.val());

            var resourcePictureWgt = this.getResourcePictureWgt();
            if(this.ifAr){
                resourcePictureWgt.el.arStateSuccess.find('.ar-success').remove();
                resourcePictureWgt.el.arStateWait.show();
            }
        }
        else{

            is.alertUnexpectedServerResponse(a, 'error');
        }
    },
    changeAr:function(e){
        var ar = 0;
        if (this.ifAr == 0) {
            ar = 1;
        }
        var put_data = {
            // if_ar:this.el.arBtn.is(':checked') ? 1 : 0
            if_ar:ar
        },resourcePictureWgt = this.getResourcePictureWgt();

        // this.ifAr = this.el.arBtn.is(':checked');
        this.ifAr = ar
        this.arState = false;

        var btn_flg = ar == 1 ? 'True' : 'False';
        this.updateArBtnState(btn_flg);

        resourcePictureWgt.el.arStateSuccess.find(".ar-success").remove();
        resourcePictureWgt.el.arStateWait.hide();
        resourcePictureWgt.el.arStateClose.hide();
        if (btn_flg == 'True') {
            resourcePictureWgt.el.arStateWait.show();
        } else {
            resourcePictureWgt.el.arStateClose.show();
        }

        this.addInterval();

        // if (this.ifAr) {
        //    resourcePictureWgt.el.arStateItem.show();
        //    resourcePictureWgt.el.arStateSuccess.hide();
        //    resourcePictureWgt.el.arStateWait.show();

        // }else{
        //    resourcePictureWgt.el.arStateItem.hide();
        // }
        $.put(this.url.changeUrl,put_data,function(a){
            this.changeArResponse(ar);
        }.bind(this));
        return true;
    },
    changeRandom:function(e){
        var if_random = this.el.randomBtn.is(':checked') ? 3 : 0;
        var put_data = {
            if_random:if_random
        };

        this.addInterval();
        // if (if_random == 3)
        //     this.el.randomLabel.text( this.el.randomLabel.data('waiting-label') );
        // else
        //     this.el.randomLabel.text( this.el.randomLabel.data('default-label') );
        $.put(this.url.changeUrl,put_data,function(a){
            this.changeRandomResponse(a);
        }.bind(this));
        return false;
    },
    customPublished:function(e){
        var can_use = this.el.customPublishedBtn.hasClass("publish-btn-normal");

        if (!can_use) {
            return false;
        }

        $("#pub-resource-id").val(this.id);
        this.addInterval();

        // var if_custom_published = this.el.customPublishedBtn.is(':checked') ? 1 : 0;
        // var if_custom_published = 3;
        // var put_data = {
        //     if_custom_published:if_custom_published
        // };
        // $.put(this.url.changeUrl,put_data,function(a){
        //     this.customPublishedResponse(a);
        // }.bind(this));
        // return false;
    },
    customPublishedCancel:function(e){
        this.el.dropDown.toggleClass('open');
        // this.el.dropDown.hide();
        var put_data = {
            if_custom_published:0,
            if_random:0,
            if_cache:0
        };
        $.put(this.url.changeUrl,put_data,function(a){
            this.customPublishedResponse(a);
        }.bind(this));
        this.ifRandom = 0;
        this.publish = 0;
        this.cache = 0;
        return false;
    },
    changeArResponse:function(a){
        if (!a.error){
            var if_ar = this.ifAr;
            if(if_ar){
                $.message('success','Set ar success');
            }
            else {
                $.message('success','Cancle ar success');
            }
        }
        else{
            is.alertUnexpectedServerResponse(a, 'error');
        }
    },
    changeRandomResponse:function(a){
        if (!a.error){
            var if_random = this.el.randomBtn.is(':checked') ? 1 : 0;
            if(if_random){
                $.message('success','Recommend to a casual look success');
            }
            else {
                $.message('success','Cancel recommended to casual look success');
            }
        }
        else{

            is.alertUnexpectedServerResponse(a, 'error');
        }
    },
    customPublishedResponse:function(a) {
        if (!a.error){
            var if_custom_published = 0;
            if(if_custom_published){
                $.message('success','Publish success');
            }
            else {
                $.message('success','Cancel publish success');
            }
        }
        else{

            is.alertUnexpectedServerResponse(a, 'error');
        }
    },
    // checkState:function(){
    //     var needCheckState = false,resourcePictureWgt;
    //     if (!this.trainingState)
    //         needCheckState = true;
    //     if (this.ifAr && !this.arState)
    //         needCheckState = true;
    //     if(this.ifRandom == 3)
    //         needCheckState = true;
    //     if (this.vuRate == -1)
    //         needCheckState = true;
    //     if (this.publish == 3)
    //         needCheckState = true;
        
    //     if (!needCheckState){
    //         is.resourceCheckState.removeResourceId(this.id);
    //         return
    //     }

    //     $.get(this.url.stateUrl,function(data){
    //         if (data.error) {
    //             return;
    //         };
    //         // update this's data
    //         this.trainingState = data.training_state;
    //         this.trainingRate = data.rate;
    //         this.vuRate = data.vu_rate;
    //         this.arState = data.ar_state;
    //         this.ifRandom = data.if_random
    //         this.publish = data.if_custom_published
    //         this.ifAr = data.if_ar ? 1 : 0;

    //         this.element.data('training-state',data.training_state)
    //         this.element.data('rate',data.rate)
    //         this.element.data('vu-rate',data.vu_rate)
    //         this.element.data('if-random',data.if_random)
    //         this.element.data('ar-state',data.ar_state)
    //         this.element.data('publish',data.if_custom_published)
    //         this.element.data('if-ar',data.if_ar)
            
    //         // update the element
            
    //         resourcePictureWgt = this.getResourcePictureWgt();

    //         resourcePictureWgt.updateState();
    //         this.updateRandomState();
    //     }.bind(this));
    // },
    replaceLayerBtnClick:function(e){
        var layerHref = this.el.layerBtn.attr('href'),
            addParams = {
                back_url   : window.location.href,
                back_title : this.activeNavTitle, 
            };
        this.el.layerBtn.attr('href',layerHref + '?' + $.param(addParams));
        return true;
    },

    updateRandomState:function(){
        if (this.ifRandom == 1) {
            this.random.show();
        } else {
            this.random.hide();
        }
        // var randomLabel = this.el.randomLabel.data('default-label');
        // if (this.ifRandom == 1)
        //     randomLabel = this.el.randomLabel.data('successed-label');
        // else if(this.ifRandom == 2)
        //    randomLabel = this.el.randomLabel.data('failed-label');
        // else if(this.ifRandom == 3)
        //    randomLabel = this.el.randomLabel.data('waiting-label');

        // this.el.randomLabel.text(randomLabel);
    }
};

is.wgt.register('btg-resource', is.btg.Resource);

'use strict';
is.btg.EduResource = function(a) {
    this.element = a;
    this.id = this.element.data('id');
    this.setEl();
    this.el.resourcePictureList = this.element.find('.resource-picture');
    this.url = {
        deleteUrl:this.element.data('delete-url'),
        changeUrl:this.element.data('change-url'),
        stateUrl : this.element.data('state-url'),
    };
    this.tpl = {
        resourceTitle:$('#mustache-resource-title').assert().html(),
        editorCateList:$('#mustache-editor-cate-list').assert().html(),
        //attrCateList:$('#mustache-attr-cate-list').assert().html(),
    };
    if (this.el.resourcePictureList.length == 1) {
        this.el.resourcePictureList.find('.resource-picture-delete').hide();
    };

    this.activeNavTitle = this.element.data('active-nav-title') || 'Home';

    this.trainingState = this.element.data('training-state') != 'False';
    this.trainingRate = this.element.data('training-rate') || 0;
    this.vuRate = this.element.data('vu-rate') || 0;
    this.ifAr = this.element.data('if-ar') == 'True' ? 1 : 0;
    this.arState = this.element.data('ar-state') != 'False';
    this.ifRandom = this.element.data('if-random') || 0;
    this.publish = this.element.data('publish');
    this.cache = this.element.data('cache');
    this.layer = this.element.data('layer');

    this.waitedit = this.element.find('.resource-waitedit');
    this.unreleased = this.element.find('.resource-unreleased');
    this.apply = this.element.find('.resource-apply');
    this.deny = this.element.find('.resource-deny');
    this.released = this.element.find('.resource-released');
    this.updateUnreleased = this.element.find('.resource-update-unreleased');
    this.updateApply = this.element.find('.resource-update-apply');
    this.random = this.element.find('.resource-random');

    this.updateArBtnState(this.element.data('if-ar'));
    this.updateRandomState();
    this.bindEvent();
};
is.btg.EduResource.prototype = {
    bindEvent : function(){
        this.el.deleteBtn.on('click',this.deleteBtnClick.bind(this));
        this.el.changeBtn.on('click',this.changeBtnClick.bind(this));
        this.el.changeSubmitBtn.on('click',this.changeSubmit.bind(this));
        // this.el.arBtn.on(is.event.LIVE,this.changeAr.bind(this));
        this.el.arBtn.on('click',this.changeAr.bind(this));
        this.el.randomBtn.on('change',this.changeRandom.bind(this));
        // this.el.customPublishedBtn.on('change',this.customPublished.bind(this));
        this.el.customPublishedBtn.on('click',this.customPublished.bind(this));
        this.el.customPublishedCancelBtn.on('click',this.customPublishedCancel.bind(this));

        //this.el.layerBtn.on('click',this.replaceLayerBtnClick.bind(this));

        this.element.on(is.event.NEED_UPDATE_PUBLISH, this.updateNew.bind(this));

        this.addInterval();
    },
    updateNew:function(){
        var resourcePictureWgt = this.getResourcePictureWgt();
        resourcePictureWgt.updateState();
        this.updateRandomState();
    },
    addInterval:function(){
        is.resourceCheckState.addResourceId(this.id);
    },
    getResourcePictureWgt:function(){
        if(!this.resourcePictureWgt)
            this.resourcePictureWgt = is.wgt.get(this.el.resourcePictureList,'btg-resource-picture');
        return this.resourcePictureWgt;
    },
    deleteBtnClick:function(e){
        is.confirm('Delete resource', 'Are you sure to delete?', {ok: this.remove.bind(this)});
        return false;
    },
    updateArBtnState:function(available){
        if (available == 'True') {
            this.el.arBtn.css("background", "url('../static/idealsee/img/topic_list/ARon.png') no-repeat")
        } else {
            this.el.arBtn.css("background", "url('../static/idealsee/img/topic_list/ARoff.png') no-repeat")
        }
        // this.el.arBtn.attr('disabled',!available);
        // this.el.arBtn.parent().toggleClass('disabled');
    },
    remove:function(){
        $.delete(this.url.deleteUrl, {}, function(a) {
            this.handleDeleteResponse(a);
        }.bind(this));
    },
    handleDeleteResponse: function(a) {
        if (!a.error){
            this.element.remove();
            is.resourceCheckState.removeResourceId(this.id);
        }
        else
            is.alertUnexpectedServerResponse(a, 'error');
    },
    setEl:function(){
        this.el = {
            deleteBtn:this.element.find('.resource-delete'),
            changeBtn:this.element.find('.resource-change'),
            changeSubmitBtn:this.element.find('.btn-resource-change-submit'),
            resourceTitle:this.element.find('.resource-title'),
            cateName:this.element.find('.cate-name'),
            editorCateName:this.element.find('.editor-cate-name'),
            attrCateName:this.element.find('.attr-cate-name'),
            // arBtn:this.element.find('.change-if-ar'),
            arBtn:this.element.find('.ar-check'),
            randomBtn:this.element.find('.change-if-random'),
            // customPublishedBtn:this.element.find('.change-if-custom-published'),
            customPublishedBtn:this.element.find('#publish-btn'),
            customPublishedCancelBtn:this.element.find('.publish-cancel-btn'),

            changeArGroup:this.element.find('.change-if-ar-group'),
            //layerBtn:this.element.find('.layer-btn').assert(),

            // randomLabel:this.element.find('.resource-random-label').assert(),

            dropDown:this.element.find('.dropdown'),
        };
    },
    toggleArState:function(d){
        if (d) {
            this.el.changeArGroup.addClass('disabled');
            // this.el.arBtn.attr('disabled',d);
            // this.el.arBtn.parent().addClass('disabled');
        }else{
            this.el.changeArGroup.removeClass('disabled');
            // this.el.arBtn.attr('disabled',d);
            // this.el.arBtn.parent().removeClass('disabled');
        }
    },
    changeBtnClick:function(e){
        var title,editorCateId,attrCateId;
            
        title        = this.el.resourceTitle.text();
        editorCateId = this.el.editorCateName.data('cate-id');
        attrCateId   = this.el.attrCateName.data('attr-cate-id');
        
        this.el.dropDown.toggleClass('open');
        this.el.dropDown.hide();

        this.element.find('.rt-change').addClass('rt-change-change');

        this.changeResourceTitle  = $(is.tpl(
            Mustache.render(this.tpl.resourceTitle,{resourceTitle:title})
        ));
        this.changeEditorCateList = $(is.tpl(
            Mustache.render(this.tpl.editorCateList)
        ));
        this.changeAttrCateList   = $(is.tpl(
            Mustache.render(this.tpl.attrCateList)
        ));

        this.el.resourceTitle.after(this.changeResourceTitle).hide();
        this.el.editorCateName.after(this.changeEditorCateList).hide();
        this.el.attrCateName.after(this.changeAttrCateList).hide();

        this.el.cateName.toggleClass('cate-name');
        this.el.cateName.toggleClass('select-group');
        // this.el.changeBtn.hide();

        this.el.changeSubmitBtn.show();

        // this.changeResourceTitle.focus();
        this.changeEditorCateList.val(editorCateId);
        this.changeAttrCateList.val(attrCateId);

        return false;
    },
    changeSubmit:function(e){
        var put_data = {
            student_name:  this.changeResourceTitle.val(),
            exam_id:  this.changeEditorCateList.val(),            
        };
        $.put(this.url.changeUrl,put_data,function(a){
            this.handleChangeResponse(a);
        }.bind(this));
        return false;
    },
    handleChangeResponse:function(a){
        if (!a.error){
            this.el.resourceTitle.show().text(this.changeResourceTitle.val());
            this.el.resourceTitle.attr('title', this.changeResourceTitle.val());
            this.el.editorCateName.show().text(this.changeEditorCateList.find('option:selected').text());
            this.el.editorCateName.attr('title', this.changeEditorCateList.find('option:selected').text());
            this.el.attrCateName.show().text(this.changeAttrCateList.find('option:selected').text());

            this.changeResourceTitle.remove();
            this.element.find('.change-editor-cate-list').remove();
            this.element.find('.change-attr-cate-list').remove();

            this.element.find('.rt-change').removeClass('rt-change-change');

            this.el.cateName.toggleClass('cate-name');
            this.el.cateName.toggleClass('select-group');
            // this.el.changeBtn.show();
            this.el.changeSubmitBtn.hide();
            this.el.dropDown.show();

            this.el.editorCateName.data('cate-id',this.changeEditorCateList.val());
            this.el.attrCateName.data('attr-cate-id',this.changeEditorCateList.val());

            var resourcePictureWgt = this.getResourcePictureWgt();
            if(this.ifAr){
                resourcePictureWgt.el.arStateSuccess.find('.ar-success').remove();
                resourcePictureWgt.el.arStateWait.show();
            }
        }
        else{

            is.alertUnexpectedServerResponse(a, 'error');
        }
    },
    changeAr:function(e){
        var ar = 0;
        if (this.ifAr == 0) {
            ar = 1;
        }
        var put_data = {
            // if_ar:this.el.arBtn.is(':checked') ? 1 : 0
            if_ar:ar
        },resourcePictureWgt = this.getResourcePictureWgt();

        // this.ifAr = this.el.arBtn.is(':checked');
        this.ifAr = ar
        this.arState = false;

        var btn_flg = ar == 1 ? 'True' : 'False';
        this.updateArBtnState(btn_flg);

        resourcePictureWgt.el.arStateSuccess.find(".ar-success").remove();
        resourcePictureWgt.el.arStateWait.hide();
        resourcePictureWgt.el.arStateClose.hide();
        if (btn_flg == 'True') {
            resourcePictureWgt.el.arStateWait.show();
        } else {
            resourcePictureWgt.el.arStateClose.show();
        }

        this.addInterval();

        // if (this.ifAr) {
        //    resourcePictureWgt.el.arStateItem.show();
        //    resourcePictureWgt.el.arStateSuccess.hide();
        //    resourcePictureWgt.el.arStateWait.show();

        // }else{
        //    resourcePictureWgt.el.arStateItem.hide();
        // }
        $.put(this.url.changeUrl,put_data,function(a){
            this.changeArResponse(ar);
        }.bind(this));
        return true;
    },
    changeRandom:function(e){
        var if_random = this.el.randomBtn.is(':checked') ? 3 : 0;
        var put_data = {
            if_random:if_random
        };

        this.addInterval();
        // if (if_random == 3)
        //     this.el.randomLabel.text( this.el.randomLabel.data('waiting-label') );
        // else
        //     this.el.randomLabel.text( this.el.randomLabel.data('default-label') );
        $.put(this.url.changeUrl,put_data,function(a){
            this.changeRandomResponse(a);
        }.bind(this));
        return false;
    },
    customPublished:function(e){
        var can_use = this.el.customPublishedBtn.hasClass("publish-btn-normal");

        if (!can_use) {
            return false;
        }

        $("#pub-resource-id").val(this.id);
        this.addInterval();

        // var if_custom_published = this.el.customPublishedBtn.is(':checked') ? 1 : 0;
        // var if_custom_published = 3;
        // var put_data = {
        //     if_custom_published:if_custom_published
        // };
        // $.put(this.url.changeUrl,put_data,function(a){
        //     this.customPublishedResponse(a);
        // }.bind(this));
        // return false;
    },
    customPublishedCancel:function(e){
        this.el.dropDown.toggleClass('open');
        // this.el.dropDown.hide();
        var put_data = {
            if_custom_published:0,
            if_random:0,
            if_cache:0
        };
        $.put(this.url.changeUrl,put_data,function(a){
            this.customPublishedResponse(a);
        }.bind(this));
        this.ifRandom = 0;
        this.publish = 0;
        this.cache = 0;
        return false;
    },
    changeArResponse:function(a){
        if (!a.error){
            var if_ar = this.ifAr;
            if(if_ar){
                $.message('success','Set ar success');
            }
            else {
                $.message('success','Cancle ar success');
            }
        }
        else{
            is.alertUnexpectedServerResponse(a, 'error');
        }
    },
    changeRandomResponse:function(a){
        if (!a.error){
            var if_random = this.el.randomBtn.is(':checked') ? 1 : 0;
            if(if_random){
                $.message('success','Recommend to a casual look success');
            }
            else {
                $.message('success','Cancel recommended to casual look success');
            }
        }
        else{

            is.alertUnexpectedServerResponse(a, 'error');
        }
    },
    customPublishedResponse:function(a) {
        if (!a.error){
            var if_custom_published = 0;
            if(if_custom_published){
                $.message('success','Publish success');
            }
            else {
                $.message('success','Cancel publish success');
            }
        }
        else{

            is.alertUnexpectedServerResponse(a, 'error');
        }
    },
    // checkState:function(){
    //     var needCheckState = false,resourcePictureWgt;
    //     if (!this.trainingState)
    //         needCheckState = true;
    //     if (this.ifAr && !this.arState)
    //         needCheckState = true;
    //     if(this.ifRandom == 3)
    //         needCheckState = true;
    //     if (this.vuRate == -1)
    //         needCheckState = true;
    //     if (this.publish == 3)
    //         needCheckState = true;
        
    //     if (!needCheckState){
    //         is.resourceCheckState.removeResourceId(this.id);
    //         return
    //     }

    //     $.get(this.url.stateUrl,function(data){
    //         if (data.error) {
    //             return;
    //         };
    //         // update this's data
    //         this.trainingState = data.training_state;
    //         this.trainingRate = data.rate;
    //         this.vuRate = data.vu_rate;
    //         this.arState = data.ar_state;
    //         this.ifRandom = data.if_random
    //         this.publish = data.if_custom_published
    //         this.ifAr = data.if_ar ? 1 : 0;

    //         this.element.data('training-state',data.training_state)
    //         this.element.data('rate',data.rate)
    //         this.element.data('vu-rate',data.vu_rate)
    //         this.element.data('if-random',data.if_random)
    //         this.element.data('ar-state',data.ar_state)
    //         this.element.data('publish',data.if_custom_published)
    //         this.element.data('if-ar',data.if_ar)
            
    //         // update the element
            
    //         resourcePictureWgt = this.getResourcePictureWgt();

    //         resourcePictureWgt.updateState();
    //         this.updateRandomState();
    //     }.bind(this));
    // },
    replaceLayerBtnClick:function(e){
        var layerHref = this.el.layerBtn.attr('href'),
            addParams = {
                back_url   : window.location.href,
                back_title : this.activeNavTitle, 
            };
        this.el.layerBtn.attr('href',layerHref + '?' + $.param(addParams));
        return true;
    },

    updateRandomState:function(){
        if (this.ifRandom == 1) {
            this.random.show();
        } else {
            this.random.hide();
        }
        // var randomLabel = this.el.randomLabel.data('default-label');
        // if (this.ifRandom == 1)
        //     randomLabel = this.el.randomLabel.data('successed-label');
        // else if(this.ifRandom == 2)
        //    randomLabel = this.el.randomLabel.data('failed-label');
        // else if(this.ifRandom == 3)
        //    randomLabel = this.el.randomLabel.data('waiting-label');

        // this.el.randomLabel.text(randomLabel);
    }
};

is.wgt.register('btg-edu-resource', is.btg.EduResource);

'use strict';
is.btg.Order = function(a) {
    this.element = a;
    this.id = this.element.data('id');
    this.setEl();    
    this.url = {
        deleteUrl:this.element.data('delete-url'),
        changeUrl:this.element.data('change-url'),        
    };
    this.tpl = {        
    };    

    this.activeNavTitle = this.element.data('active-nav-title') || 'Home';    
    this.isAll = this.element.data('is-all');
    this.bindEvent();
};
is.btg.Order.prototype = {
    bindEvent : function(){
        this.el.deleteBtn.on('click',this.deleteBtnClick.bind(this));
        this.el.changeBtn.on('click',this.changeBtnClick.bind(this));        
    },
    deleteBtnClick:function(e){
        is.confirm('Delete order', 'Are you sure to delete?', {ok: this.remove.bind(this)});
        return false;
    },    
    remove:function(){
        $.delete(this.url.deleteUrl, {}, function(a) {
            this.handleDeleteResponse(a);
        }.bind(this));
    },
    handleDeleteResponse: function(a) {
        if (!a.error){
            this.element.remove();            
        }
        else
            is.alertUnexpectedServerResponse(a, 'error');
    },
    setEl:function(){
        this.el = {
            deleteBtn:this.element.find('.order-delete'),
            changeBtn:this.element.find('.order-change'),            
            editorCateName:this.element.find('.editor-cate-name'),            
        };
    },    
    changeBtnClick:function(e){
        is.confirm('Change order', 'Are you sure to change?', {ok: this.update.bind(this)});
        return false;        
    },
    update:function(){
        var handle;
        handle = this.el.editorCateName.data('handle');
        if (handle == 0)
        {
            handle = 1;
        }
        else
        {
            handle = 0;
        }
        var put_data = {
            handle:  handle
        };
        $.put(this.url.changeUrl,put_data,function(a){
            this.handleChangeResponse(a);
        }.bind(this));
        return false;
    },
    handleChangeResponse:function(a){
        if (!a.error){
            if (this.isAll)
            {
                window.location.reload();
            }
            else
            {
                this.element.remove();
            }
        }
        else
            is.alertUnexpectedServerResponse(a, 'error');
    }
};

is.wgt.register('btg-order', is.btg.Order);

'use strict';
is.btg.ResourcePicture = function(a) {
    this.element = a;

    this.resourceEl = this.element.parents('.btg-resource').assert();
    this.resourceWgt = is.wgt.get(this.resourceEl,'btg-resource');

    this.id = this.element.data('id');

    this.el = {
        // state
        trainingStateWait:this.element.find('.resource-wait'),
        // lessPoint:this.element.find('.resource-less-point'),
        rate:this.element.find('.resource-picture-rate'),

        arStateItem:this.element.find('.ar-state-item'),
        arStateSuccess:this.element.find('.resource-ar-success'),
        arStateWait:this.element.find('.resource-ar-wait'),
        arStateClose:this.element.find('.resource-ar-close'), 

        img:this.element.find('.resource-picture-img'),
        cover:this.element.find('.resource-picture-cover'),
        progress:this.element.find('.resource-picture-progress'),
        deleteBtn:this.element.find('.resource-picture-delete'),
        // changeBtn:this.element.find('.resource-picture-change'),
        changeBtn:this.resourceEl.find('.resource-picture-change'),

        previewBtn:this.element.find('.preview-btn'),
    };

    this.formUrl = this.element.data('form-url')

    this.updateState();

    this.bindEvent();
};
is.btg.ResourcePicture.prototype = {
    bindEvent : function(){
        this.el.deleteBtn.on('click',this.deleteBtnClick.bind(this));
        this.el.changeBtn.on(is.event.SINGLE_UPLOAD_START,this.uploadStart.bind(this));
        this.el.changeBtn.on(is.event.SINGLE_UPLOAD_PROGRESS,this.uploadProgress.bind(this));
        this.el.changeBtn.on(is.event.SINGLE_UPLOAD_SUCCESS,this.changeResourcePicture.bind(this));
        this.el.changeBtn.on(is.event.SINGLE_UPLOAD_ERROR,this.uploadError.bind(this));
    },
    updateState:function(){
        // training state
        // if(!this.resourceWgt.trainingState){
        //     this.resourceWgt.toggleArState(true);
        //     this.el.trainingStateWait.show();
        //     this.el.lessPoint.hide();
        //     this.el.rate.hide();
        // }else{
        //     this.el.trainingStateWait.hide();
        //     this.updateTrainingState(this.resourceWgt.trainingRate);
        // }
        var ir_rate = 0;
        if(!this.resourceWgt.trainingState){
            ir_rate = -1;
        } else {
            ir_rate = this.resourceWgt.trainingRate;
        }
        this.updateTrainingState(ir_rate);

        // ar state
        this.el.arStateWait.hide();
        this.el.arStateClose.hide();

        // this.el.arStateItem.show();
        if(this.resourceWgt.ifAr){
            if (this.resourceWgt.arState){
                // this.el.arStateSuccess.show();
                this.renderArRate(this.resourceWgt.vuRate);
            }else {
                // this.el.arStateSuccess.hide();
                this.el.arStateWait.show();
            }
        } else {
            // this.el.arStateWait.hide();
            this.el.arStateClose.show();
        }

        this.resourceWgt.waitedit.hide();
        this.resourceWgt.unreleased.hide();
        this.resourceWgt.apply.hide();
        this.resourceWgt.deny.hide();
        this.resourceWgt.released.hide();
        this.resourceWgt.updateUnreleased.hide();
        this.resourceWgt.updateApply.hide();

        var publish_can_use = false;
        var publish_can_cancel = true;

        if (this.resourceWgt.layer == 0) {
            this.resourceWgt.waitedit.show();
            publish_can_cancel = false;
        } else {
            if (this.resourceWgt.publish == 0) {
                if (this.resourceWgt.cache == 0) {
                    this.resourceWgt.unreleased.show();
                    publish_can_cancel = false;
                } else {
                    this.resourceWgt.updateUnreleased.show();
                }
                publish_can_use = true;
            } else if (this.resourceWgt.publish == 1) { 
                this.resourceWgt.released.show();
            } else if (this.resourceWgt.publish == 2) {
                this.resourceWgt.deny.show();
            } else if (this.resourceWgt.publish == 3) {
                if (this.resourceWgt.cache == 0) {
                    this.resourceWgt.apply.show();
                } else {
                    this.resourceWgt.updateApply.show();
                }
            }
        }
        this.updatePublishBtn(publish_can_use);
        this.updatePublishCancelBtn(publish_can_cancel);
    },
    updatePublishBtn:function(can_use) {
        if (can_use){
            this.resourceWgt.el.customPublishedBtn.removeClass("publish-btn-disabled");
            this.resourceWgt.el.customPublishedBtn.addClass("publish-btn-normal");
            this.resourceWgt.el.customPublishedBtn.attr('title','');
        } else {
            this.resourceWgt.el.customPublishedBtn.removeClass("publish-btn-normal");
            this.resourceWgt.el.customPublishedBtn.addClass("publish-btn-disabled");
            this.resourceWgt.el.customPublishedBtn.attr('title',$._('Please edit before apply'));
        }
    },
    updatePublishCancelBtn:function(can_cancel) {
        if (can_cancel){
            this.resourceWgt.el.customPublishedCancelBtn.show();
        } else {
            this.resourceWgt.el.customPublishedCancelBtn.hide();
        }
    },
    updateTrainingState:function(rate){
        // this.el.rate.data('rate',rate);
        this.renderTrainingRate(rate);
    },
    renderTrainingRate : function(rate){
        if (this.el.rate.find('.ir-success').length)
            return
        // var rate = this.el.rate.data('rate');
        // if (rate <= 0) {
        //     this.resourceWgt.toggleArState(true);
        //     this.el.rate.hide();
        //     this.el.lessPoint.show();
        //     return;
        // }
        // this.resourceWgt.toggleArState(false);
        // this.el.rate.show();
        // this.el.lessPoint.hide();

        // this.resourceWgt.updateArBtnState(true);


        // var star_rated_url = this.el.rate.data('star-rated-url');
        // var star_unrated_url = this.el.rate.data('star-unrated-url');
        var starRateHtml = "";
        if (rate < 0) {
            this.el.trainingStateWait.show();
        } else {
            this.el.trainingStateWait.hide();
            // for (var i = 1; i <= 5; i++) {
            //     if (i <= rate) {
            //         starRateHtml = starRateHtml + "<img src='"+star_rated_url+"'/>";
            //     } else {
            //         starRateHtml = starRateHtml + "<img src='"+star_unrated_url+"'/>";
            //     }
            // }
            var desc = "";
            if (rate == 0) {
                desc = this.el.rate.data('rate-0');
            } else if (rate == 1) {
                desc = this.el.rate.data('rate-1');
            } else if (rate == 2) {
                desc = this.el.rate.data('rate-2');
            } else if (rate == 3) {
                desc = this.el.rate.data('rate-3');
            } else if (rate == 4) {
                desc = this.el.rate.data('rate-4');
            } else if (rate == 5) {
                desc = this.el.rate.data('rate-5');
            }
            var percent = rate * 20;
            if (rate == 0) {
                starRateHtml = "<span class='resource-star ir-success' style='color:#ff7301'>" + percent + "%" + desc + "</span>";
            } else {
                starRateHtml = "<span class='resource-star ir-success'>" + percent + "%" + desc + "</span>";
            }
        }
        
        this.el.rate.append(starRateHtml);
    },
    renderArRate:function(rate){
        if (this.el.arStateSuccess.find('.ar-success').length)
            return

        this.el.arStateSuccess.find('.ar-rate-waiting').remove();

        if (rate == -1) {
            this.el.arStateSuccess.append( 
                $('<span>',{
                    text:$._('AR wait ...'),
                    class:'ar-rate-waiting',
                })
            )
            return;
        };
        // var star_rated_url = this.el.arStateSuccess.data('star-rated-url');
        // var star_unrated_url = this.el.arStateSuccess.data('star-unrated-url');
        var starRateHtml = "";
        // for (var i = 1; i <= 5; i++) {
        //     if (i <= rate) {
        //         starRateHtml = starRateHtml + "<img src='"+star_rated_url+"'/>";
        //     } else {
        //         starRateHtml = starRateHtml + "<img src='"+star_unrated_url+"'/>";
        //     }
        // }
        var desc = "";
        if (rate == 0) {
            desc = this.el.arStateSuccess.data('rate-0');
        } else if (rate == 1) {
            desc = this.el.arStateSuccess.data('rate-1');
        } else if (rate == 2) {
            desc = this.el.arStateSuccess.data('rate-2');
        } else if (rate == 3) {
            desc = this.el.arStateSuccess.data('rate-3');
        } else if (rate == 4) {
            desc = this.el.arStateSuccess.data('rate-4');
        } else if (rate == 5) {
            desc = this.el.arStateSuccess.data('rate-5');
        }
        var percent = rate * 20;
        if (rate == 0) {
            starRateHtml = "<span class='resource-star ar-success' style='color:#ff7301'>" + percent + "%" + desc + "</span>";
        } else {
            starRateHtml = "<span class='resource-star ar-success'>" + percent + "%" + desc + "</span>";
        }
        this.el.arStateSuccess.append(starRateHtml);
    },
    deleteBtnClick:function(e){
        is.confirm('Delete picture', 'Are you sure to delete?', {ok: this.remove.bind(this),offsetObj: true});
        return false;
    },
    remove:function(){
        var post_data = {
            resource_picture_id : this.id
        }
        $.delete(this.formUrl, post_data, function(a) {
            this.handleDeleteResponse(a);
        }.bind(this));
    },
    handleDeleteResponse: function(a) {
        if (!a.error)
            this.element.remove();
        else
            is.alertUnexpectedServerResponse(a, 'error');
    },
    changeResourcePicture:function(e,a){
        this.hideProgress();
        var post_data = {
            resource_picture_id : this.id,
            md5                 : a.md5
        };
        $.put(this.formUrl,post_data,function(a){
            this.changeResourcePictureResponse(a);
        }.bind(this));
    },
    changeResourcePictureResponse:function(a){
        if (!a.error){
            $.message('success','Change resource picture success');
            this.el.img.attr('src',a.image_255_src); 
            this.el.previewBtn.data('url', '/web/resource/preview/' + a.md5);
            this.el.rate.find('.ir-success').remove();
            this.renderTrainingRate(-1);
            if(this.resourceWgt.ifAr){
                this.el.arStateSuccess.find('.ar-success').remove();
                this.el.arStateWait.show();
            }
        }
        else
            is.alertUnexpectedServerResponse(a, 'error');
    },
    uploadStart:function(e){
        this.showProgress();
    },
    uploadProgress:function(e,position, total, percent){
        this.el.progress.find('.progress-bar').css({'width':percent + '%'});
    },
    uploadError:function(e){
        this.hideProgress();
    },
    showProgress:function(){
        this.el.cover.show();
        this.el.progress.show();
        this.el.progress.find('.progress-bar').css({'width':'0px'});
    },
    hideProgress:function(){
        this.el.cover.hide();
        this.el.progress.hide();
    },
};

is.wgt.register('btg-resource-picture', is.btg.ResourcePicture);


is.btg.resourceSearch = function(a){
    this.element = a;
    this.el = {
        title:this.element.find('.resource-search-title').assert(),
        cover:this.element.find('.resource-search-cover').assert(),
        progress:this.element.find('.resource-search-progress').assert(),
        imageSearchBtn:this.element.find('.resource-img-search').assert(),
    };
    this.bindEvent();
};
is.btg.resourceSearch.prototype = {
    bindEvent:function(){
        this.el.imageSearchBtn.on(is.event.SINGLE_UPLOAD_START,this.imageSearchStart.bind(this));
        this.el.imageSearchBtn.on(is.event.SINGLE_UPLOAD_COMPLATE,this.imageSearchComplate.bind(this));
        this.el.imageSearchBtn.on(is.event.SINGLE_UPLOAD_PROGRESS,this.imageSearchProgress.bind(this));
        this.el.imageSearchBtn.on(is.event.SINGLE_UPLOAD_SUCCESS,this.imageSearchSuccess.bind(this));
        this.el.imageSearchBtn.on(is.event.SINGLE_UPLOAD_ERROR,this.imageSearchError.bind(this));

        this.element.on('submit',this.replaceSubmit.bind(this));
    },
    replaceSubmit:function(e){
        if (this.element.find('[name=pic_md5]').val()) {
            this.element.find('[name=resource_title]').val('');
        };
        return true;
    },
    imageSearchStart:function(e){
        this.showProgress();
    },
    imageSearchComplate:function(e){
        this.hideProgress();
    },
    imageSearchProgress:function(e,position, total, percent){
        this.el.progress.find('.progress-bar').css({'width':percent + '%'});
    },
    imageSearchSuccess:function(e,a){
        if (a.status == 'error') {
            // console.log('123');
            // is.alert('Error',a.msg, {vitrageOpacity: 0.1});
            return false;
        };
        // is.alert('Success', '上传文件成功。');
        this.element.find('[name="' + a.field_name + '"]').val(a.md5);
        this.el.title.val(a.file_name);
    },
    imageSearchError:function(e,a){
        // is.alert('Error',a.msg, {vitrageOpacity: 0.1});
        return;
    },
    showProgress:function(){
        this.el.cover.show();
        this.el.progress.show();
        this.el.progress.find('.progress-bar').css({'width':'0px'});
    },
    hideProgress:function(){
        this.el.cover.hide();
        this.el.progress.hide();
    },
};
is.wgt.register('resource-search', is.btg.resourceSearch);


is.ResourceCheckState = function(){
    this.resourceIds = [];
    this.csInterval = setInterval(this.updateResourcesState.bind(this),10000);
}; 
is.ResourceCheckState.prototype = {
    addResourceId:function(resourceId){
        var position = $.inArray(resourceId, this.resourceIds);
        if ( position < 0 ) this.resourceIds.push(resourceId);
    },
    removeResourceId:function(resourceId){
        var position = $.inArray(resourceId, this.resourceIds);

        if ( position >= 0 ) this.resourceIds.splice(position, 1);
    },
    updateResourcesState:function(resourceId){
        var get_data = {
            // resource_ids:this.resourceIds
            resource_ids: this.resourceIds.toString()
        };

        if (this.resourceIds.length == 0) {
            return;
        }

        $.get('/web/resource/state',get_data, function(datas){
            if (datas.error) {
                return;
            };
            var len = datas.length;
            for (var i = 0; i < len; i++) {
                var data = datas[i];
                var res_id = data.resource_id;
                var resource_wgt = is.wgt.get(".btg-resource[data-id='" + res_id + "']",'btg-resource');
                // update this's data
                resource_wgt.trainingState = data.training_state;
                resource_wgt.trainingRate = data.rate;
                resource_wgt.vuRate = data.vu_rate;
                resource_wgt.arState = data.ar_state;
                resource_wgt.ifRandom = data.if_random
                resource_wgt.publish = data.if_custom_published
                resource_wgt.ifAr = data.if_ar ? 1 : 0;

                resource_wgt.element.data('training-state',data.training_state)
                resource_wgt.element.data('training-rate',data.rate)
                resource_wgt.element.data('vu-rate',data.vu_rate)
                resource_wgt.element.data('if-random',data.if_random)
                resource_wgt.element.data('ar-state',data.ar_state)
                resource_wgt.element.data('publish',data.if_custom_published)
                resource_wgt.element.data('if-ar',data.if_ar)
                
                // update the element
                
                var resourcePictureWgt = resource_wgt.getResourcePictureWgt();

                resourcePictureWgt.updateState();
                resource_wgt.updateRandomState();
            }

            
        }.bind(this));
    },
    
};

is.resourceCheckState = new is.ResourceCheckState();