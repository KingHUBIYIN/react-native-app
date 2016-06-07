$(function() {
    if (window.Mustache)
        Mustache.tags = ['[[',']]'];
     is.wgt.scan(document.body);
        $(document).trigger(is.event.WGTS_INITIALIZED_INITIAL);
    

    // async load js
    for (var i in is.async_load_jss) {
        $('<script>',{
            type:'text/javascript',
            src:is.async_load_jss[i]
        }).appendTo('body');
    };
});

if ($.i18n != null) {
$._ = $.i18n.prop;
$.i18n.properties({
    name:'Messages', 
    path:i18n_base_path, 
    mode:'map', 
    // language:'ja-JP',
    callback: function() {
       
        $.validator.addMethod('valid_hex_color', function(a, b) {
            return !a || /^[0-9A-F]{6}$/i.test(a);
        }, $._('Please enter a valid hex color'));
        $.validator.addMethod('phone', function(a, b) {
            a = a.replace(/\s+/g, "");
            return this.optional(b) || a.match(/^\+?([0-9\(\)\-]){3,20}$/);
        }, $._('Please enter a valid phone number'));
        $.validator.addMethod('valid_appstore_link', function(a) {
            return !a || /(itunes\.apple\.com\/|apple\.com\/itunes).*id[0-9]{5,10}/.test(a);
        }, $._('Please provide a valid link to your IOS app'));
        $.validator.addMethod('valid_google_play_link', function(a) {
            return !a || /play\.google\.com\/store.*(\?|&)id=[\w\.]+(\?|&|$)/.test(a);
        }, $._('Please provide a valid link to your app on Google Play'));
    }
});
} else {
    $._ = function(t) {
        return t;
    } 
}
var _oldhide = $.fn.hide;
$.fn.hide = function(speed, callback) {
    $(this).trigger('hide');
    return _oldhide.apply(this,arguments);
};

var is = {};
is.options = {};
is.event = {
    CONTRIBUTORS_ADD: 'CONTRIBUTORS_ADD',
    CONTRIBUTORS_LIST: 'CONTRIBUTORS_LIST',
    CONTRIBUTORS_REFRESH: 'CONTRIBUTORS_REFRESH',
    CREATOR_BUTTON_ADD: 'CREATOR_BUTTON_ADD',
    CREATOR_BUTTON_ERROR: 'CREATOR_BUTTON_ERROR',
    CREATOR_BUTTON_UPDATE: 'CREATOR_BUTTON_UPDATE',
    CREATOR_BUTTON_DELETE: 'CREATOR_BUTTON_DELETE',
    CREATOR_CAROUSEL_META_SAVE: 'CREATOR_CAROUSEL_META_SAVE',
    CREATOR_CAROUSEL_META_SKIP: 'CREATOR_CAROUSEL_META_SKIP',
    CREATOR_CAROUSEL_TILE_REMOVE: 'CREATOR_CAROUSEL_TILE_REMOVE',
    CREATOR_EDITOR_DIRTY: 'CREATOR_EDITOR_DIRTY',
    CREATOR_EDITOR_SAVED: 'CREATOR_EDITOR_SAVED',
    CREATOR_PAGES_SELECT: 'CREATOR_PAGES_SELECT',
    CREATOR_PAGES_SELECT_SUBMIT: 'CREATOR_PAGES_SELECT_SUBMIT',
    CREATOR_PROCESSING_CONFIRM: 'CREATOR_PROCESSING_CONFIRM',
    REATOR_UPLOAD_INIT: 'CREATOR_UPLOAD_INIT',
    CREATOR_UPLOAD_COMPLETE: 'CREATOR_UPLOAD_COMPLETE',
    FORM_ERROR: 'FORM_ERROR',
    FORM_ERRORS: 'FORM_ERRORS',
    FORM_BEFORE_SUBMIT: 'FORM_BEFORE_SUBMIT',
    FORM_SUBMIT: 'FORM_SUBMIT',
    FORM_SUCCESS: 'FORM_SUCCESS',
    INLINE_UPLOAD_501: 'INLINE_UPLOAD_501',
    INLINE_UPLOAD_ERROR: 'INLINE_UPLOAD_ERROR',
    INLINE_UPLOAD_PICKED: 'INLINE_UPLOAD_PICKED',
    INLINE_UPLOAD_READY: 'INLINE_UPLOAD_READY',
    INLINE_UPLOAD_SUCCESS: 'INLINE_UPLOAD_SUCCESS',
    LIGHTBOX_AJAX_ERROR: 'LIGHTBOX_AJAX_ERROR',
    LIGHTBOX_AJAX_SUCCESS: 'LIGHTBOX_AJAX_SUCCESS',
    LIGHTBOX_CLOSE: 'LIGHTBOX_CLOSE',
    LIGHTBOX_CLOSE_BY_USER: 'LIGHTBOX_CLOSE_BY_USER',
    LIGHTBOX_OPEN: 'LIGHTBOX_OPEN',
    LIVE: 'keydown keyup paste change LIVE',
    PAGE_DELETED: 'PAGE_DELETED',
    PAGE_LOAD_START: 'PAGE_LOAD_START',
    PAGE_LOAD_COMPLETE: 'PAGE_LOAD_COMPLETE',
    PAGE_RENAME: 'PAGE_RENAME',
    PAGE_REORDER: 'PAGE_REORDER',
    PAGE_UPLOAD_WIZARD_COMPLETE: 'PAGE_UPLOAD_WIZARD_COMPLETE',
    PAYMENT_BUNDLE_CHECKED: 'PAYMENT_BUNDLE_CHECKED',
    PAYMENT_BUNDLE_VOLUME: 'PAYMENT_BUNDLE_VOLUME',
    PAYMENTS_MESSAGE_READ: 'PAYMENTS_MESSAGE_READ',
    PLACEHOLDER_BLUR: 'PLACEHOLDER_BLUR',
    SYSTEM_MESSAGE_READ: 'SYSTEM_MESSAGE_READ',
    UPLOAD_FILE_PICKED: 'UPLOAD_FILE_PICKED',
    UPLOAD_PAGE_CANCELED: 'UPLOAD_PAGE_CANCELED',
    UPLOAD_PAGE_SERIALIZE: 'UPLOAD_PAGE_SERIALIZE',
    UPLOAD_PAGE_UPLOADED: 'UPLOAD_PAGE_UPLOADED',
    WIDGET_FORM_SAVE: 'WIDGET_FORM_SAVE',
    WIDGET_FORM_NOCHANGE: 'WIDGET_FORM_NOCHANGE',
    WIDGET_FORM_UPDATE: 'WIDGET_FORM_UPDATE',
    WIDGET_META_SET: 'WIDGET_META_SET',
    WIDGET_PREVIEW_READY: 'WIDGET_PREVIEW_READY',
    WIDGET_PREVIEW_RENDERED: 'WIDGET_PREVIEW_RENDERED',
    WINDOW_RESIZE: 'WINDOW_RESIZE',
    WINDOW_RESIZE_DELAY: 'WINDOW_RESIZE_DELAY',
    WGTS_INITIALIZED: 'WGTS_INITIALIZED',
    WGTS_INITIALIZED_INITIAL: 'WGTS_INITIALIZED_INITIAL',
    FORM_SERVER_ERROR:'FORM_SERVER_ERROR',
    CREATOR_ADD_SIDEBAR_PAGES:'CREATOR_ADD_SIDEBAR_PAGES',
    EDITOR_PAGE_START:'EDITOR_PAGE_START',
    UPLOAD_COMPONENT_PICTURE_UPLOADED:'UPLOAD_COMPONENT_PICTURE_UPLOADED',
    PAGE_ADDED:'PAGE_ADDED',
    LIGHTBOX_USER_CLOSE:'LIGHTBOX_USER_CLOSE',
    SHOW_TAB:'SHOW_TAB',
    WIDGET_ADD:'WIDGET_ADD',
    WIDGET_DELETE:'WIDGET_DELETE',
    FILE_UPLOAD_SUCCESS:'FILE_UPLOAD_SUCCESS',
    FILE_DIALOG_COMPLETE:'FILE_DIALOG_COMPLETE',
    SINGLE_UPLOAD_START:'SINGLE_UPLOAD_START',
    SINGLE_UPLOAD_SUCCESS:'SINGLE_UPLOAD_SUCCESS',
    SINGLE_UPLOAD_ERROR:'SINGLE_UPLOAD_ERROR',
    SINGLE_UPLOAD_PROGRESS:'SINGLE_UPLOAD_PROGRESS',
    SINGLE_UPLOAD_COMPLATE:'SINGLE_UPLOAD_COMPLATE',
    TIMELINE_FORM_SAVE:'TIMELINE_FORM_SAVE',
    TIMELINE_FORM_NOCHANGE:'TIMELINE_FORM_NOCHANGE',
    ANIMATION_TYPE_FOCUS:'ANIMATION_TYPE_FOCUS',
    CHANGE_EDIT_MODE:'CHANGE_EDIT_MODE',
    EV_TYPE_CHANGE:'EV_TYPE_CHANGE',
    WIDGET_PROPERTY_CHANGE:'WIDGET_PROPERTY_CHANGE',

    NEED_UPDATE_PUBLISH:'NEED_UPDATE_PUBLISH',
};
is.an_type = {
    'ANIMATION_NONE' : 0, 
    'FADE_IN' : 1, 
    'ERASE' : 2, 
    'FLY_INTO' : 3, 
    'CUT' : 4, 
    'FLICKER' : 5, 
    'BOUNCE' : 6, 
    'FADE_OUT' : 7, 
    'ZOOM' : 8, 
    'BREATHING_LIGHT':9,
    'ROTATE' : 10,
    'TRUN' : 11,
};
is.action_type = is.actionType = is.widgetType ={
    CALLME : 0, 
    LINK:1,
    GEO:2,
    EXTEND:3,
    VIDEO:4,
    THREED:5,
    MUSIC:6,
    ALBUM:7, //相册
    APP_DOWNLOAD:8,
    PICTURE:9,
    TEXT:10,
    TRIGGER:11,

};
is.edit_mode = {
    PAGE:'PAGE',
    TRIGGER:'TRIGGER',
};
is.an_direction = {
    'TOP_TO_BOTTOM':0,
    'BOTTOM_TO_UP':1,
    'LEFT_TO_RIGHT':2,
    'RIGHT_TO_LEFT':3,
};
is.rotate_direction = {
    'CLOCKWISE': 0,
    'COUNTERCLOCKWISE' : 1,
}
is.zoom_type = {
    'ENLARGE': 0,
    'NARROW' : 1,
};
is.PERMISSION_READONLY = 'PERMISSION_READONLY';
is.getIconUrl = function(ev_type){
    for (var i in is.StandardButtons){
            var standardButton = is.StandardButtons[i]
            if (standardButton.ev_type == ev_type) {
                return standardButton.icon_url;
            };
        }
};
is.hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
is.extend = function(a, b) {
    var c, d;
    for (var e = 1, f = arguments.length; e < f; e++) {
        d = arguments[e];
        for (c in d)
            if (d.hasOwnProperty(c))
                a[c] = d[c];
    }
};
is.Wgt = function() {
    this._wgts = {};
};
is.Wgt.prototype = {scan: function(a) {
        var b;
        if (arguments.length === 0)
            this.scan(document.documentElement);
        for (var c = 0, d = arguments.length; c < d; c++) {
            var e = $(arguments[c]);
            b = e.find('[data-wgt]');
            if (e.attr('data-wgt'))
                b = b.add(e);
            for (var f = 0, g = b.length; f < g; f++)
                this._initElementWgts(b[f]);
        }
    },
    register: function(a, b) {
        this._wgts[a] = b;
    },
    get: function(a, b) {
        var c;
        a = $(a);
        if (!a.length)
            return false;
        c = $(a).eq(0).data();
        if (!c.wgtInstances)
            return false;
        if (b)
            return c.wgtInstances[b] || false;
        if (this.count(a) === 1)
            return c.wgtInstances[c.wgt];
        return c.wgtInstances.length ? c.wgtInstances : false;
    },
    count: function(a) {
        var b = 0, c = $(a).data('wgtInstances');
        for (var d in c)
            if (c.hasOwnProperty(d))
                b++;
        return b;
    },
    append: function(a, b) {
        if (this._wgts[b])
            return this._construct($(a), b);
        else
            throw new Error('Widget undefined: ' + b);
    },
    _initElementWgts: function(a) {
        var b, c;
        a = $(a);
        b = a.attr('data-wgt');
        b = b.split(/\s+/);
        for (var d = 0, e = b.length; d < e; d++) {
            c = b[d];
            if (!c)
                continue;
            this.append(a, c);
        }
        a.trigger(is.event.WGTS_INITIALIZED);
    },
    _construct: function(a, b) {
        var c = this.get(a, b);
        if (!c) {
            c = new this._wgts[b](a, b);
            this._register(a, b, c);
        }
        return c;
    },
    _register: function(a, b, c) {
        var d = a.data();
        d.wgtInstances = d.wgtInstances || {};
        d.wgtInstances[b] = c;
    }};
is.wgt = new is.Wgt();

is.storage = function(a, b) {
    if (!a || !localStorage || !localStorage.setItem)
        return null;
    else if (b === null) {
        localStorage.removeItem(a);
        return null;
    } else if (b) {
        localStorage.setItem(a, b);
        return b;
    } else
        return localStorage.getItem(a);
};
/**
 * Ctrl+Key shortcuts
 * @param {string} key,etc:'A'
 * @param {function} callback:event callback
 * @param {array} args:callback's args
 */
is.ctrl = function(key, callback, args){
    var isCtrl = false;
    $(document).keydown(function(e){
        if (e.which === 17) 
            isCtrl = true;
        if (e.which === key.charCodeAt(0) && isCtrl === true) {
            callback.apply(this, args);
            return false;
        }
    }).keyup(function(e){
        if (e.which === 17) 
            isCtrl = false;
    });
};

$.fn.assert = function(a, b) {
    a = (typeof a === 'undefined') ? 1 : a;
    b = (typeof b === 'undefined') ? a : b;
    if (this.length < a || this.length > b) {
        console.warn(this);
        throw new Error('' + '"' + this.selector + '" should match at least ' + a + ' and at most ' + b + ' elements, but matched ' + this.length + ' elements.');
    }
    return this;
};
$.delete = function (e,r,i,o){
    return $.ajax({
        url:e,
        type:'DELETE',
        dataType:o,
        data:r,
        success:i
    });
};
$.put = function (e,r,i,o){
    return $.ajax({
        url:e,
        type:'PUT',
        dataType:o,
        data:r,
        success:i
    });
};
$.message = function(type,msg){
    $('.alert-message').remove();
    var alert = $('<div>',{class:'alert'})
        .addClass('alert-'+type)
        .addClass('alert-message')
        .append($('<p>',{text:$._(msg)}));

    window.setTimeout(function(){
        alert.remove();
    },2000);
    $('body').append(alert);
};
is.tpl = function(a) {
    return (typeof a === 'string') ? $($.parseHTML($.trim(a))) : a;
};
is.randomStr = function(a) {
    return Math.random().toString(36).substr(2, a || 5);
};
if (!Function.prototype.bind)
    Function.prototype.bind = function(a) {
        var b, c, d, e, f;
        b = Array.prototype.slice.call(arguments, 1);
        c = this;
        d = function() {
        };
        e = function() {
            f = this instanceof d && a ? this : a;
            return c.apply(f, b.concat(Array.prototype.slice.call(arguments)));
        };
        d.prototype = this.prototype;
        e.prototype = new d();
        return e;
    };
is.format = {twodecimals: function(a) {
        return Math.round(a * 100) / 100;
    },
    intcomma: function(a) {
        a = (String(a)).split('').reverse().join('');
        a = a.replace(/([0-9]{3})([0-9])/g, '$1,$2');
        a = a.split('').reverse().join('');
        return a;
    },
    price: function(a, b) {
        var c, d;
        c = Math.floor(a);
        d = Math.floor(a % 1 * 100);
        c = this.intcomma(c);
        return c + (!b ? '.' + (d < 10 ? '0' : '') + d : '');
    },
    priceRound: function(a) {
        if (a % 1 === 0)
            return this.price(parseFloat(a).toFixed(0), true);
        else
            return this.price(a);
    },
    pluralize: function(a, b, c) {
        return (a === 1) ? b || '' : c || 's';
    },
    sprintf: function() {
        var a = arguments;
        return a[0].replace(/\{(\d+)\}/g, function(b, c) {
            return typeof a[c] !== 'undefined' ? a[c] : b;
        });
    }
};

is.preloadImage = function(a, b, c) {
    var d, e;
    b = b || function() {
    };
    d = $('<img>').css({position: 'absolute',left: -99999,top: -99999});
    d.attr({src: a});
    d.appendTo(document.body);
    e = function() {
        b(a, d.prop('width'), d.prop('height'));
        d.remove();
    };
    if (d[0].complete)
        e();
    else {
        d.on('load', e);
        d.on('error', function() {
            d.remove();
            if (c)
                c(a, d);
            throw new Error('Error loading image: ' + a);
        });
    }
};
is.isEqualDict = function(a, b) {
    var c;
    for (c in a)
        if (a.hasOwnProperty(c))
            if (String(a[c]) !== String(b[c]))
                return false;
    for (c in b)
        if (b.hasOwnProperty(c))
            if (String(a[c]) !== String(b[c]))
                return false;
    return true;
};

is.confirm = function(title, content, options) {
    var lightboxHtml, lightbox, lightboxOp, cancelBtn, okBtn;
    title = $._(title);
    content = $._(content);
    lightboxHtml = '' + '<h1>[[title]]</h1>' + '<form>' + '   <p class="question [[contentClass]]">[[&question]]</p>' + '   <div class="buttons">' + '       [[#cancelButton]]<button class="cancel">[[cancelLabel]]</button>[[/cancelButton]]' + '       <button class="ok">[[okLabel]]</button>' + '   </div>' + '</form>';
    lightboxHtml = Mustache.render(lightboxHtml, {title: title,question: content,contentClass:options.contentClass,cancelButton: !options.nocancel,cancelLabel: options.cancelLabel || $._('Cancel'),okLabel: options.okLabel || $._('OK')});
    lightboxHtml = is.tpl(lightboxHtml);
    lightbox     = new is.Lightbox();
    options.ok = options.ok || lightbox.close.bind(lightbox);
    cancelBtn = lightboxHtml.find('.cancel').on('click', function() {
        lightbox.close();
        return false;
    });
    okBtn = lightboxHtml.find('.ok').on('click', function() {
        options.ok();
        lightbox.clearCallbacks();
        lightbox.close();
        return false;
    });
    lightboxOp = $.extend({html: lightboxHtml,onclose: options.cancel,width: 320,height: 220}, options);
    lightbox.open(lightboxOp);
};
is.alert = function(title, content, options) {
    options = $.extend(options, {nocancel: true});
    is.confirm(title, content, options);
};
is.toggleLoading = function(a, b) {
    var c, d, e, f;
    a = $(a).toggleClass('is-loading', b);
    if (!a.length)
        return;
    e = a.find('button, .button');
    e.attr('disabled', b);
    c = e.last().parent();
    d = c.find(e).first();
    f = c.find('.loading').stop();
    for (var g = 0, h = e.length; g < h; g++) {
        var i = e.eq(g);
        if (!i.data('loading-label'))
            continue;
        else if (!i.data('default-label'))
            i.data('default-label', e.eq(g).text());
        i.text(i.data(b ? 'loading-label' : 'default-label'));
    }
    if (!f.length) {
        f = $('<span/>').addClass('loading').css({opacity: 0});
        f.insertBefore(d);
    }
    if (b)
        f.animate({opacity: 1}, 200);
    else
        f.animate({opacity: 0}, 200, function() {
            $(this).remove();
        });
};
is.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
        context = this;
        args = arguments;
        timestamp = new Date().getTime();
        var later = 
        function() {
            var last = new Date().getTime() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    context = args = null;
                }
            }
        };
        var callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
};
/**
 Tooltip
**/
is.Tooltip = function(a, b) {
    var c, d, e, f;
    this.element = a;
    this.name = b;
    c = is.event.LIGHTBOX_OPEN + '.' + this.name;
    d = this.openTooltip.bind(this);
    e = this.positionTooltip.bind(this);
    f = this.toolTipContent.bind(this);
    this.snappy = this.element.data('snappy');
    this.position = (this.element.data('position') || 'north');
    this.positions = {north: {my: 'center top',at: 'center bottom'},east: {my: 'right center',at: 'left center'},south: {my: 'center bottom',at: 'center top'},west: {my: 'left center',at: 'right center'}};
    $(document).off(c).on(c, this.closeOtherTooltips.bind(this));
    this.element.tooltip({items: '[data-txt]',show: 50,hide: 100,content: f,open: d,position: {my: this.positions[this.position].my,at: this.positions[this.position].at,using: e,collision: 'flipfit'}});
    this.element.on('mouseleave', this.mouseLeave.bind(this));
};
is.Tooltip.prototype = {toolTipContent: function() {
        return this.element.attr('data-txt');
    },
    openTooltip: function(a, b) {
        var c = b.tooltip;
        this.closeOtherTooltips();
        c.animate({top: c.position().top + 10}, 50);
        if (!this.snappy) {
            c.on('mouseenter', this.haltTimer.bind(this));
            c.on('mouseleave', this.exitTooltip.bind(this));
        }
    },
    closeOtherTooltips: function() {
        var a = $('[data-wgt$=tooltip-trigger]').not(this.element);
        for (var b = 0, c = a.length; b < c; b++) {
            var d = is.wgt.get(a[b], this.name);
            if (d)
                d.exitTooltip();
        }
    },
    positionTooltip: function(a, b) {
        var c, d;
        c = b.element.element;
        d = (this.position === 'east' || this.position === 'west');
        if (d)
            this.positionHorizontalTooltip(b, a);
        else
            this.positionVerticalTooltip(b, a);
        c.css({left: a.left,top: a.top,marginRight: 20});
        c.addClass('pos-' + b.horizontal + '-' + b.vertical);
        c.toggleClass('pad', (c.height() <= 20));
    },
    positionHorizontalTooltip: function(a, b) {
        b.top -= 8;
        switch (a.horizontal) {
            case 'left':
                b.left += 6;
                break;
            case 'right':
                b.left -= 10;
                break;
        }
    },
    positionVerticalTooltip: function(a, b) {
        var c, d = 24, e, f, g;
        c = a.target.left + (a.target.width / 2);
        e = c - a.element.width + d;
        f = c - d;
        g = ((a.element.left + a.element.width) >= $(document).width());
        switch (a.horizontal) {
            case 'left':
                b.left = e;
                break;
            case 'right':
                b.left = f - a.element.width;
                break;
            case 'center':
                if (g) {
                    b.left = e;
                    a.horizontal = 'left';
                } else
                    b.left += 4;
                break;
        }
        switch (a.vertical) {
            case 'top':
                b.top += 6;
                break;
            case 'bottom':
                b.top -= 24;
                break;
        }
    },
    mouseLeave: function(a) {
        if (this.snappy)
            this.exitTooltip();
        else {
            a.stopImmediatePropagation();
            this.hideTooltip = setTimeout(this.exitTooltip.bind(this), 200);
        }
    },
    exitTooltip: function() {
        // this.element.tooltip('close');
    },
    haltTimer: function() {
        clearTimeout(this.hideTooltip);
    }};
is.wgt.register('tooltip-trigger', is.Tooltip);
/**
ajaxsubmit
**/
$.ajaxSetup({error: function(a, b) {
        if (b === 'abort')
            return false;
        // 增加自定义错误
        else if (a.status === 400)
            is.alert('Error', eval('('+a.responseText+')').msg );
        else if (a.status === 403)
            is.alert('No authority', 'Sorry, you do not have permission to access this feature.');
        else if (a.status === 404)
            is.alert('Page not found', 'Sorry, we could not find the page. Please try again later.');
        else if (a.status === 500)
            is.alert('System Error', 'Sorry, we encountered while processing your request a server error, please try again later.');
        else if (b === 'parsererror')
            is.alert('Parse error', 'Sorry, we are unable to process this request. Please try again later.');
        else if (b === 'timeout')
            is.alert('Service Timeout', 'Sorry, the page loads timeout. Please try again later.');
    },crossDomain: false,
    beforeSend: function(a, b) {
        if (String(b.type) !== 'GET')
            a.setRequestHeader('X-CSRFToken', $.cookie('csrftoken'));
    }});
$.ajaxPrefilter('script', function(a, b, c) {
    if (!a.crossDomain) {
        a.cache = true;
        is.xhrScriptsLoaded = is.xhrScriptsLoaded || [];
        if (-1 === $.inArray(a.url, is.xhrScriptsLoaded))
            is.xhrScriptsLoaded.push(a.url);
        else
            c.abort();
    }
});
is.AjaxSubmit = function(a) {
    this.element = a;
    this.buttons = this.element.find('.buttons');
    if (!this.buttons.length)
        this.buttons = this.element;
    this.options = {forceSync: false,success: this.handleJsonResponse.bind(this),error: this.handleError.bind(this),beforeSerialize: this.beforeSerialize.bind(this),beforeSubmit: this.beforeSubmit.bind(this)};
    this.element.ajaxForm(this.options);
};
is.AjaxSubmit.prototype = {submit: function() {
        this.element.ajaxSubmit(this.options);
    },
    beforeSerialize: function(a, b) {
        a.trigger(is.event.FORM_BEFORE_SUBMIT, [b]);
    },
    beforeSubmit: function(a, b, c) {
        b.trigger(is.event.FORM_SUBMIT, [a, c]);
        this.toggleLoading(true);
    },
    handleError: function(a, b) {
        this.toggleLoading(false);
        this.element.trigger(is.event.FORM_ERROR, [a, b]);
        $.ajaxSettings.error(a, b);
    },
    handleJsonResponse: function(a) {
        if (typeof a === 'string')
            try {
                a = JSON.parse(a);
            } catch (b) {
                this.handleError({}, 'parsererror');
                return false;
            }
        this.toggleLoading(false);
        if ($.isEmptyObject(a.errors) && !a.error)
            this.success(a);
        else if (a.error && a.message)
            is.alertUnexpectedServerResponse(a, 'error');
        else
            this.showFormErrors(a);
    },
    success: function(a) {
        this.element.trigger(is.event.FORM_SUCCESS, [a]);
    },
    toggleLoading: function(a) {
        is.toggleLoading(this.buttons, a);
    },
    showFormErrors: function(a) {
        var b = {};
        for (var c in a.errors)
            if (a.errors.hasOwnProperty(c))
                b[c] = a.errors[c].join('<br>');
        this.element.trigger(is.event.FORM_ERRORS, [a, b]);
    }};
is.wgt.register('ajaxsubmit', is.AjaxSubmit);

/*ValidateForm start*/
is.ValidateForm = function(a) {
    this.element = a;
    this.jqValidator = a.validate(this.getValidationSettings());
    this.emailformValidatorFix();
    this.supportDomAutocomplete();
    this.bindEvents();
};
is.ValidateForm.prototype = {globalRules: {},
    bindEvents: function() {
        this.element.on(is.event.FORM_ERRORS, function(a, b, c) {
            this.showErrors(c);
        }.bind(this));
        this.element.on('submit', function() {
            this.element.find('.global-error').remove();
        }.bind(this));
    },
    getValidationSettings: function() {
        var a = this.validateSettings;
        return $.extend(a, this.getDataValidateSettings(this.element.data('rules')));
    },
    getDataValidateSettings: function(a) {
        var b = {};
        if (a) {
            b = this.globalRules[a];
            if (!b)
                throw new Error('Undefined validate settings set: ' + a);
        }
        return b;
    },
    emailformValidatorFix: function() {
        if (this.element.hasClass('validate-fix')) {
            var a, b = $('.item[data-validator]');
            for (var c = 0, d = b.length; c < d; c++) {
                a = $(b[c]);
                a.find(':input').addClass(a.data('validator'));
            }
        }
    },
    validateSettings: {highlight: function(a, b, c) {
            var d = $(a);
            d = (d.hasClass('checkbox-enable-field')) ? d.closest('input') : d.closest('.item');
            d.addClass(b).removeClass(c);
        },
        unhighlight: function(a, b, c) {
            var d = $(a);
            d = (d.hasClass('checkbox-enable-field')) ? d.closest('input') : d.closest('.item');
            d.removeClass(b).addClass(c);
        },
        errorPlacement: function(a, b) {
            var c = (b.hasClass('checkbox-enable-field')) ? b.parents('.checkbox-enable-field-wrap:first') : b.parents('.wrap:first'), d = c.find('.help:first');
            if (c.length && d.length)
                a.insertBefore(d);
            else if (c.length)
                a.appendTo(c);
            else
                a.insertAfter(b);
        }},
    supportDomAutocomplete: function() {
        this.element.on('DOMAutoComplete', ':input', function() {
            $(this).trigger('change');
        });
    },
    showErrors: function(a) {
        var b;
        if (a.__all__) {
            b = $('<div>').addClass('error global-error');
            b.html(a.__all__);
            b.insertBefore(this.element.find('.item:first'));
            delete a.__all__;
        }
        this.jqValidator.showErrors(a);
    }};
is.wgt.register('validate', is.ValidateForm);

/*ValidateForm end*/


/*TabbedInterface*/
is.TabbedInterface = function(a, b) {
    this.element = a;
    this.id = b + '-' + this.element.attr('id');
    this.persist = this.element.data('persist');
    this.hash = this.element.data('hash');
    this.tabActions = this.element.find('li');
    this.tabDictionary = [];
    this.indexTabs();
    this.setInitialTab();
    this.bindEvents();
};
is.TabbedInterface.prototype = {
    indexTabs: function() {
        for (var a = 0, b = this.tabActions.length; a < b; a++) {
            this.tabDictionary.push($(this.tabActions[a]).children('a').first().attr('href'));
            $(this.tabDictionary[a]).hide();
        }
    },
    tabExists: function(a) {
        return this.tabDictionary.indexOf(a) >= 0;
    },
    setInitialTab: function() {
        var a, b, c, d;
        a = location.hash;
        b = (/[?&]tab=([\w\-_]+)/g).exec(location.search);
        if (this.hash && a && this.tabExists(a))
            c = 'a[href$="' + a + '"]';
        else if (b && this.tabExists('#' + b[1]))
            c = 'a[href$="#' + b[1] + '"]';
        else if (this.persist && is.storage(this.id))
            c = 'a[href$="' + is.storage(this.id) + '"]';
        else
            c = 'a:first';
        d = this.element.find(c);
        this.switchTab(d, true);
    },
    bindEvents: function() {
        this.element.on('click', 'a', function(a) {
            this.switchTab($(a.currentTarget));
            return false;
        }.bind(this));
    },
    switchTab: function(a, b) {
        var c = a.attr('href'), d = $(c);
        if (!b && (/[?&]tab=/).test(location.search)) {
            location.href = location.pathname + c;
            return;
        }
        if (this.oldTargetContent && this.oldTargetContent.is(d))
            return;
        this.showContent(d);
        this.tabActions.removeClass('selected');
        a.parent().addClass('selected');
        this.oldTargetContent = d;
        if (!b) {
            c = this.oldTargetContent.attr('id');
            this.persistSelection(c);
            this.setHash(c);
        }
    },
    showContent: function(a) {
        if (this.oldTargetContent)
            this.oldTargetContent.fadeOut(50, function() {
                a.fadeIn(100);
                a.trigger(is.event.SHOW_TAB);
            });
        else {
            a.show();
            a.trigger(is.event.SHOW_TAB);
        }
    },
    persistSelection: function(a) {
        if (this.persist)
            is.storage(this.id, a);
    },
    setHash: function(a) {
        a = '#' + a;
        if (this.hash)
            if (history.pushState)
                history.pushState(null, null, a);
            else
                location.hash = a;
    }};
is.wgt.register('tabs', is.TabbedInterface);
/*TabbedInterface end*/

/**

ligthbox

**/
is.Lightbox = function() {
    this.selector = '.' + this.ns + 'lightbox';
};
is.Lightbox.prototype = {ns: 'is-lb-',settings: {id: '',url: '',html: '',dom: '',width: 750,height: 'auto',addClass: '',closeButton: true,vitrage: true,vitrageOpacity: 0.1,vitrageClick: 'close',fadeIn: 500,fadeOut: 300,offsetObj: false,offsetX: 3,offsetY: 3,left: false,top: false,windowPadding: 62,animateOnResize: true,isDraggable: true,onopen: false,onclose: false,onUserClose:false},
    open: function(a) {
        if (typeof a === 'string')
            a = {html: a};
        this.iSettings = $.extend({}, this.settings, a);
        this.vitrage = $();
        if (this.iSettings.vitrage)
            this.vitrage = this._addVitrage();
        this.lightbox = this._addLightbox();
        this.makeDraggable();
        this.content(this._getContent(), this.iSettings.url);
        this.setPosition();
        this._addCloseTriggers();
        $(window).on('resize', this.setPosition.bind(this));
        if ($.isFunction(this.iSettings.onopen))
            this.iSettings.onopen(this.lightbox);
        $(document).trigger(is.event.LIGHTBOX_OPEN, [this.lightbox]);
        this.lightbox.find('.ok').focus();
        this.bindEvents();
        return this;
    },
    bindEvents:function(){
        $(this.lightbox).on('keydown', function(e) {
            switch (e.keyCode) {
                case 27:
                    this.lightbox.find('.cancel').trigger('click');
                    break;
                case 13:
                    this.lightbox.find('.ok').trigger('click');
                    break;
                default:
                    return true;
            }
        }.bind(this));
    },
    close: function() {
        if (!this.lightbox)
            return;
        if (this.xhr)
            this.xhr.abort();
        this.lightbox.remove();
        this.vitrage.fadeOut(this.iSettings.fadeOut, function() {
            $(this).remove();
        });
        if (this.iSettings.onclose) {
            this.iSettings.onclose(this.lightbox);
            this.clearCallbacks();
        }
        $(document).trigger(is.event.LIGHTBOX_CLOSE, [this.lightbox]);
    },
    closeAll: function() {
        for (var a = $(this.selector).length; a > 0; a--)
            this.closeLast();
    },
    closeAllButFirst: function() {
        for (var a = $(this.selector).length; a > 1; a--)
            this.closeLast();
    },
    closeLast: function() {
        return $(this.selector).last().data('lightbox').close();
    },
    anyOpen: function() {
        return (0 !== $(this.selector).length);
    },
    get: function(a) {
        return $(a).closest(this.selector).data('lightbox');
    },
    content: function(a, b) {
        var c = $(), d;
        $(':focus:not(body)').blur();
        if (typeof a === 'string')
            a = $($.trim(a));
        c = a.filter('script[src]');
        d = function() {
            this.contentWrap.html(a.not('script[src]'));
            is.wgt.scan(this.contentWrap);
            if (!b && this.iSettings.animateOnResize)
                window.setTimeout(function() {
                    this.lightbox.addClass('canhasanim');
                }.bind(this), 500);
        }.bind(this);
        (function e(a) {
            if (a === c.length)
                d();
            else
                $.getScript(c[a].src).always(function() {
                    e(++a);
                });
        })(0);
    },
    width: function(a) {
        this.iSettings.width = a;
        this.lightbox.css({width: a});
    },
    clearCallbacks: function() {
        this.iSettings.onclose = this.iSettings.onopen = this.iSettings.onUserClose = false ;
    },
    userClose: function() {
        if (this.iSettings.onUserClose) {
            this.iSettings.onUserClose(this.lightbox);
            this.clearCallbacks();
        }
        this.close();
    },
    _addCloseTriggers: function() {
        var a = this.closeButton;
        if (this.vitrage && this.iSettings.vitrageClick === 'close')
            a = a.add(this.vitrage);
        a.on('click', this._handleCloseClick.bind(this));
    },
    _handleCloseClick: function() {
        $(document).trigger(is.event.LIGHTBOX_CLOSE_BY_USER, [this.lightbox]);
        this.userClose();
        return false;
    },
    _addVitrage: function() {
        var a;
        a = $('<div>').appendTo('body').css({opacity: 0});
        a.addClass('vitrage ' + this.ns + 'vitrage');
        a.fadeTo(this.iSettings.fadeIn, this.iSettings.vitrageOpacity);
        return a;
    },
    _addLightbox: function() {
        var a, b;
        this.contentWrap = $('<div>').addClass(this.ns + 'content');
        this.closeButton = $();
        if (this.iSettings.closeButton)
            this.closeButton = $('<div>').addClass(this.ns + 'close').text('Close');
        a = $('<div>').data({lightbox: this}).attr({id: this.iSettings.id}).addClass(this.ns + 'lightbox').addClass(this.iSettings.addClass).append(this.closeButton, this.contentWrap).appendTo('body').css({opacity: 0});
        return a;
    },
    setPosition: function() {
        var a, b, c, d, e, f, g, h = {}, i = this.iSettings, j = $(window).width(), k = $(window).height(), l = i.windowPadding, m = $('html').scrollTop() || $('body').scrollTop();
        this.lightbox.css('width', '');
        c = (i.width === 'auto') ? this.lightbox.width() : i.width;
        d = (i.height === 'auto') ? this.lightbox.height() : i.height;
        if (i.offsetObj && $(i.offsetObj).length) {
            e = $(i.offsetObj);
            b = e.offset();
            a = {width: c,height: d,left: e.width() + b.left + parseFloat(i.offsetX),top: e.height() + b.top + parseFloat(i.offsetY)};
        } else {
            h = {left: (j / 2) - (c / 2),top: (m + (k / 2)) - (d / 1.8)};
            a = {width: c,height: d,left: (i.left !== false) ? i.left : h.left,top: (i.top !== false) ? m + i.top : h.top};
        }
        f = (a.left + a.width) - (j - 10);
        g = (a.top + a.height) - (m + k - l);
        if (f > 0)
            a.left -= f;
        if (g > 0)
            a.top -= g;
        a.left = Math.max(l, a.left);
        a.top = Math.max(l, a.top);
        if (a.height > k)
            a.top = m + l;
        a = $.extend(a, {opacity: 1,height: 'auto'});
        this.lightbox.css(a);
    },
    _getContent: function() {
        var a = '', b = this.iSettings;
        if (b.dom && $(b.dom).length)
            a = $(b.dom).clone(false).html();
        else if (b.url) {
            a = $('<div>').addClass(this.ns + 'loading');
            this.xhr = $.ajax(b.url, {success: this._ajaxSuccess.bind(this),error: this._ajaxError.bind(this)});
        } else if (b.html)
            a = b.html;
        return a;
    },
    _ajaxSuccess: function(a) {
        if (typeof a === 'string') {
            this.content(a);
            this.setPosition();
        } else if ($.isPlainObject(a)) {
            var b = (a.error) ? is.event.LIGHTBOX_AJAX_ERROR : is.event.LIGHTBOX_AJAX_SUCCESS;
            $(document).trigger(b, [a, this]);
        }
        this.xhr = null;
    },
    _ajaxError: function(a, b) {
        this.clearCallbacks();
        this.close();
        this.xhr = null;
        $.ajaxSettings.error(a, b);
    },
    makeDraggable: function() {
        if ($.ui && this.iSettings.isDraggable)
            this.lightbox.draggable({containment: 'body',handle: 'h1',cursor: 'move',start: this.dragStart.bind(this),stop: this.dragEnd.bind(this)});
    },
    dragStart: function() {
        if (this.lightbox.hasClass('ui-draggable'))
            this.lightbox.removeClass('canhasanim');
    },
    dragEnd: function() {
        if (this.lightbox.hasClass('ui-draggable'))
            this.lightbox.addClass('canhasanim');
    }};
is.lightbox = new is.Lightbox();

is.LightboxTrigger = function(a) {
    this.element = a;
    this.element.on('click', this.openLightbox.bind(this));
    this.handleJson();
};
is.LightboxTrigger.prototype = {handleJson: function() {
        var a = [is.event.LIGHTBOX_AJAX_SUCCESS, is.event.LIGHTBOX_AJAX_ERROR].join(' ');
        $(document).off(a).on(a, this.report);
    },
    report: function(a, b, c) {
        is.lightbox.closeLast();
        is.alertUnexpectedServerResponse(b, c);
    },
    setupLightbox: function() {
        var a = this.element.data();
        if (a.offsetObj === 'this')
            a.offsetObj = this.element;
        return a;
    },
    openLightbox: function() {
        this.lightbox = new is.Lightbox();
        this.lightbox.open(this.setupLightbox());
        return false;
    }};
is.wgt.register('lightbox', is.LightboxTrigger);

/*AutofocusInput*/
is.AutofocusInput = function(a) {
    var b, c, d;
    b = a.find('input, textarea, select');
    c = b.filter(':visible:first');
    d = c.val();
    if (c.attr('type') !== 'file') {
        try {
            c.trigger('focus').addClass('autofocus');
        } catch (e) {
        }
        try {
            c[0].setSelectionRange(d.length, d.length);
        } catch (e) {
        }
    }
};
is.wgt.register('autofocus', is.AutofocusInput);
/*AutofocusInput end*/

/*CountdownInpu*/
is.CountdownInput = function(a) {
    this.element = a;
    this.counter = a.closest('.item').find('.count').assert();
    this.maxlength = parseInt(this.counter.text(), 10);
    a.on(is.event.LIVE, this.update.bind(this));
    a.attr({maxlength: this.maxlength});
    this.update();
};
is.CountdownInput.prototype = {update: function(a) {
        var b = this.maxlength - this.element.val().length;
        this.counter.text(b);
        if (a && b < 0)
            return false;
    }};
is.wgt.register('field-countdown', is.CountdownInput);
/*CountdownInput end*/
/*SelectMultipleInput*/
is.SelectMultipleInput = function(a) {
    var b = this.getDOM();
    this.element = a;
    this.options = this.element.find('option').clone();
    this.counter = b.find('.slm-count');
    this.addButton = b.find('.slm-add');
    this.removeButton = b.find('.slm-remove');
    this.availableSelect = b.find('.slm-available select');
    this.selectedsSelect = b.find('.slm-selected select');
    this.storeOriginalOrder();
    this.reConnectLabel();
    this.populateOptions();
    this.initEventHandling();
    this.updateCount();
    this.element.before(b);
};
is.SelectMultipleInput.prototype = {getDOM: function() {
        return $('' + '<div class="select-multiple">' + '   <div class="slm-column slm-selected">' + '       <strong>Selected (<span class="slm-count">0</span>)</strong>' + '       <select multiple></select>' + '   </div>' + '   <div class="slm-column slm-controls">' + '       <div class="slm-add" title="Add to selected values">◄</div>' + '       <div class="slm-remove" title="Remove from selected values">►</div>' + '   </div>' + '   <div class="slm-column slm-available">' + '       <strong>Available options</strong>' + '       <select multiple></select>' + '   </div>' + '</div>');
    },
    storeOriginalOrder: function() {
        for (var a = 0, b = this.options.length; a < b; a++)
            if ('setAttribute' in document.documentElement)
                this.options[a].setAttribute('index', a / 10000);
            else
                $.data(this.options[a], 'index', a);
    },
    reConnectLabel: function() {
        var a = this.element.attr('id');
        this.element.removeAttr('id');
        this.availableSelect.attr('id', a);
        this.element.css({position: 'absolute',left: '-99999em'}).attr('readonly', true);
    },
    populateOptions: function() {
        this.availableSelect.html(this.options.filter(':not([selected])'));
        this.selectedsSelect.html(this.options.filter('[selected]').prop('selected', false));
    },
    initEventHandling: function() {
        var a = this.addButton.add(this.removeButton);
        a.on('click', this.handleEvent.bind(this));
        this.availableSelect.on('dblclick', function() {
            this.addButton.click();
        }.bind(this));
        this.selectedsSelect.on('dblclick', function() {
            this.removeButton.click();
        }.bind(this));
    },
    handleEvent: function(a) {
        var b, c, d;
        if (a.currentTarget === this.addButton[0]) {
            c = this.availableSelect;
            d = this.selectedsSelect;
        } else {
            c = this.selectedsSelect;
            d = this.availableSelect;
        }
        b = c.find(':selected');
        if (b.length) {
            d.find('option').prop('selected', false);
            d.append(b);
            b.prop('selected', true);
            this.updateHiddenSelect();
            this.orderList(d);
            d.focus();
            if ($('html').hasClass('ie'))
                d.css('width', 0).css('width', '');
        }
    },
    updateHiddenSelect: function() {
        this.selectedOpts = this.selectedsSelect.find('option');
        this.element.find('option').prop('selected', false);
        for (var a = 0, b = this.selectedOpts.length; a < b; a++)
            this.element.find('[value="' + this.selectedOpts[a].value + '"]').prop('selected', true);
        this.updateCount();
    },
    orderList: function(a) {
        var b, c = a.find('option');
        if ('getAttribute' in document.documentElement)
            b = function(a, b) {
                return a.getAttribute('index') - b.getAttribute('index');
            };
        else
            b = function(a, b) {
                return $.data(a, 'index') - $.data(b, 'index');
            };
        c.sort(b);
        a.append(c);
    },
    updateCount: function() {
        var a = this.selectedsSelect.find('option').length;
        this.counter.text(a);
        return a;
    }
};
is.wgt.register('select-multiple', is.SelectMultipleInput);
/*SelectMultipleInput end*/
/*UploadFile*/
is.UploadFile = function(a) {
    this.element = a;
    this.createStructure();
    this.bindEvents();
};
is.UploadFile.prototype = {createStructure: function() {
        this.wrap = $('<div>').addClass('upl-wrap');
        this.dummyField = $('<input>').addClass('upl-dummy-input').attr('placeholder', this.element.attr('placeholder'));
        if (this.element.attr('placeholder'))
            is.wgt.append(this.dummyField, 'placeholder');
        this.dummyButton = $('<button>').addClass('upl-dummy-button').attr('type', 'button').text('Browse…');
        this.element.addClass('upl-hidden-input').css({opacity: 0}).wrap(this.wrap);
        this.element.before(this.dummyField).before(this.dummyButton);
    },
    bindEvents: function() {
        this.element.on('change', function(a) {
            this.dummyField.val(a.currentTarget.value.replace(/^.*[\/\\]/g, ''));
            this.dummyField.removeClass('placeholder');
            this.element.trigger('keyup');
            this.element.trigger(is.event.UPLOAD_FILE_PICKED);
        }.bind(this));
    }};
is.wgt.register('upload-file', is.UploadFile);
/*UploadFile*/
is.InputPlaceholder = function(a) {
    var b = document.createElement('input');
    if ('placeholder' in b || a.attr('type') === 'file')
        return;
    if (!('setSelectionRange' in b))
        a[0].setSelectionRange = function(a, b) {
            var c = this.createTextRange();
            c.collapse(true);
            c.moveStart('character', a);
            c.moveEnd('character', b - a);
            c.select();
        };
    a.on('focus', function() {
        if (a.hasClass('placeholder'))
            a[0].setSelectionRange(0, 0);
    });
    a.on('keydown keyup paste', function() {
        if (!a.val())
            a.val('').removeClass('placeholder');
    }.bind(this));
    a.on('blur ' + is.event.PLACEHOLDER_BLUR, function() {
        if (!a.val())
            a.val(a.attr('placeholder')).addClass('placeholder');
    });
    a.closest('form').on('submit', function() {
        a.find('.placeholder').each(function() {
            a.val('');
        });
    });
    $.valHooks.input = $.valHooks.textarea = {get: function(a) {
            return $(a).is('.placeholder') ? '' : a.value;
        }};
    a.trigger(is.event.PLACEHOLDER_BLUR);
};
is.wgt.register('placeholder', is.InputPlaceholder);
is.btg = {};

is.btg.ContextMenu = function(a) {
    this.element = a;
    this.contextmenus = [];
    this.contextClass='context-menu';
    this.menuTpl = $('#mustache-context-munu').html();
};
is.btg.ContextMenu.prototype = {
    addMenu:function(name,contextmenus){
        var menu; 
        menu = Mustache.render(this.menuTpl, {
            menus:contextmenus
        });
        menu = is.tpl(menu);
        menu.addClass(name);
        menu.addClass(this.contextClass);
        this.element.append(menu);
    },
    closeAll:function(el){
        this.element.find('.'+this.contextClass).each(function(){
            $(this).hide();
        });
    },
    run:function(el,name,contextmenus,_onItem){
        this.closeAll(el);
        this.contextmenus = contextmenus;
        var contextmenuClass = 'context-menu-' + name;
        if (!this.element.find('.' + contextmenuClass).length) {
            this.addMenu(contextmenuClass,contextmenus);
        }
        el.contextmenu({
            target:'.' + contextmenuClass,
            onItem:_onItem
        });
    },
};
is.wgt.register('btg-context-menu', is.btg.ContextMenu);

is.btg.ItemSwitch = function(a) {
    this.element = a;
    this.switchId = this.element.data('switch');
    
    this.targetSwitch = $('.item-name-' + this.switchId);
    this.element.on('click', this.doSwitch.bind(this));
    this.toggleTargetSwitch();
};
is.btg.ItemSwitch.prototype = {
    doSwitch: function() {
        var targetSwitchWgt = is.wgt.get($('#'+this.switchId),'btg-item-switch');
        if(this.element.prop('checked')){
            this.targetSwitch.removeClass('hide');
            if (targetSwitchWgt) {
                targetSwitchWgt.doSwitch();
            }
        }
        else{
            this.targetSwitch.trigger('hide');
            this.targetSwitch.addClass('hide');
            if (targetSwitchWgt) {
                targetSwitchWgt.targetSwitch.addClass('hide');
            }
        }
        
    },
    toggleTargetSwitch:function(){
        if(this.element.prop('checked'))
            this.targetSwitch.removeClass('hide');
        else
            this.targetSwitch.addClass('hide');
    }
};
is.wgt.register('btg-item-switch', is.btg.ItemSwitch);
