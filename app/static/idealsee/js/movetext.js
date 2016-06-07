var movpertime = 33;
var flypertime = 20;

function movetext(textId, x){
    if (x == undefined ) {
        x = 0;
    }

    var m;
    if (x == 0) {
        m = $("#" + textId).text()
        $("#" + textId).removeClass("waitin");
        var hiddentext = $("<div id='hidden" + textId + "' style='display:none'>" + m + "</div>");
        hiddentext.appendTo("body");
    } else {
        m = $("#hidden" + textId).text();
    }
    x++;

    var message = "<span class='old'>" + m.substring(0,x -2)+ 
            "</span><span class='moving'>" + m.substring(x - 2,x - 1)+ 
            "</span><span class='new'>" + m.substring(x - 1,x) + "</span>";
    $("#" + textId).html(message);

    if (x < m.length + 2) {
        setTimeout("movetext('" + textId + "', " + x + ")",movpertime);
    } else {
        $("#hidden" + textId).remove();
    }
}

function flytext(textId, flag, x){
    // if (x == undefined ) {
    //     x = 0;
    // }
    // if (flag == undefined) {
    //     flag = 'left';
    // }

    // var m;
    // if (x == 0) {
    //     m = $("#" + textId).text()
    //     $("#" + textId).removeClass("waitin");
    //     var hiddentext = $("<div id='hidden" + textId + "' style='display:none'>" + m + "</div>");
    //     hiddentext.appendTo("body");
    // } else {
    //     m = $("#hidden" + textId).text();
    // }
    // x++;

    // if (flag == 'left') {
    //     var message = "<span class='old'>" + m.substring(0,x -5)+ 
    //         "</span><span style='position:relative;right:0px;opacity:0.8'>" + m.substring(x - 5,x - 4)+ 
    //         "</span><span style='position:relative;right:0px;opacity:0.6'>" + m.substring(x - 4,x - 3)+ 
    //         "</span><span style='position:relative;right:0px;opacity:0.4'>" + m.substring(x - 3,x - 2)+ 
    //         "</span><span style='position:relative;right:0px;opacity:0.2'>" + m.substring(x - 2,x - 1)+ 
    //         "</span><span style='position:relative;right:0px;opacity:0.0'>" + m.substring(x - 1,x) + "</span>";
    // } else {
    //     var message = "<span class='old'>" + m.substring(0,x -5)+ 
    //         "</span><span style='position:relative;left:0px;opacity:0.8'>" + m.substring(x - 5,x - 4)+ 
    //         "</span><span style='position:relative;left:0px;opacity:0.6'>" + m.substring(x - 4,x - 3)+ 
    //         "</span><span style='position:relative;left:0px;opacity:0.4'>" + m.substring(x - 3,x - 2)+ 
    //         "</span><span style='position:relative;left:0px;opacity:0.2'>" + m.substring(x - 2,x - 1)+ 
    //         "</span><span style='position:relative;left:0px;opacity:0.0'>" + m.substring(x - 1,x) + "</span>";
    // }
    
    // $("#" + textId).html(message);

    // if (x < m.length + 5) {
    //     setTimeout("flytext('" + textId + "', '" + flag + "', " + x + ")",flypertime);
    // } else {
    //     $("#hidden" + textId).remove();
    // }

    m = $("#" + textId)
    m.animate({opacity:1}, 1500);
    // m.removeClass("waitin");
}

function mtobj(scrollt, textId){
    this.scrollt = scrollt;
    this.textId = textId;
}

function bind_scroll(func, scrollt) {
    $(function(){
        var moveFlag = true;
        $(window).bind('scroll', function(e) {
            if (moveFlag) {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollt) {
                    func();
                    moveFlag = false;
                }
            }
        });
    });
}

function bind_movetext(movetextlist) {
    $(function(){
        var moveFlag = true;
        $(window).bind('scroll', function(e) {
            while (moveFlag) {
                var scrollTop = $(window).scrollTop();
                movetextpro = movetextlist.shift();
                if (scrollTop > movetextpro.scrollt) {
                    movetext(movetextpro.textId);
                    if (movetextlist.length == 0) {
                        moveFlag = false;
                    }
                } else {
                    movetextlist.unshift(movetextpro);
                    break;
                }
            }
        });
    });
}