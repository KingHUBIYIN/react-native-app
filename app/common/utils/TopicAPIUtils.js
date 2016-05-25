var ObjectAPIUtils = require('./ObjectAPIUtils');
var parseImg = function(strImg,imgs){
        var reg = /<img\b[^<]*(?:(?!<\/img>)<[^<]*)*<\/img>/gm;
        var i=0,r;
        var images = [];
        while(r=reg.exec(strImg)){
            var res = r[0];
            images[i] = res;
            i++;
        }
        for(var i=0;i<images.length;i++){
            strImg =  strImg.replace(images[i],'<img src="'+imgs[i]+'" ></img>');
        }
        return strImg;
}

module.exports = {
    parseTopic:function(topic){
        var parseTopicMain = function(){
            var topic_main =topic.topic_main? (topic.topic_main.images ? parseImg(topic.topic_main.raw,topic.topic_main.images) : topic.topic_main.raw):"";
			if(topic_main=="") topic_main = topic.content?topic.content:"";
			if(topic_main[0]=="\n") topic_main =  topic_main.replace(/\n/,"");
            return topic_main.replace(/\n\n/gm,"<br/>").replace(/\n/gm,"<br/>").replace(/testedu/gm,"edu");
        }
        var parseTopicAnswer = function(){
            
            var answer =topic.std_answer ? (topic.std_answer.images ? parseImg(topic.std_answer.raw,topic.std_answer.images) : topic.std_answer.raw):"";
            var topic_answer = topic.topic_answer ? (topic.topic_answer.images ? parseImg(topic.topic_answer.raw,topic.topic_answer.images) : topic.topic_answer.raw):"";
            var ans_content = topic.ans_content;
			
            var answer = answer || topic_answer || ans_content || "";
            
            return answer.replace(/\n/gm,"<br/>").replace(/testedu/gm,"edu");
        }
        
        var parseTopicAnswers = function(){
            var optoins = topic.topic_options || topic.answers || topic.answer || [];
            var _options = [];
            var len = optoins?optoins.length:0;
            for(var i=0;i<len;i++){
                var option = optoins[i];
                var _opt = option.images ? parseImg(option.raw,option.images) : option.raw?option.raw:option;
				_opt = _opt?_opt:"";
                _options.push(_opt.replace(/\n/gm,"<br/>").replace(/testedu/gm,"edu"));
            }
			
			
            return _options;
        }
        
        var _topic = ObjectAPIUtils.cloneAttrs(topic,
                   ["topic_detail_id","answer_sheet_id","no","topic_id","label","sub",
                    "topic_type","grade","subject","version","nodes","width","table_position","page_num"]
          );        
        _topic.height = topic.height || topic.line_height;
        _topic.id = topic.topic_id;
        _topic.type = topic.topic_type;
        _topic.content = parseTopicMain();
        _topic.answer = parseTopicAnswer();
        _topic.answers = parseTopicAnswers();
        _topic.source = topic._type;
        _topic.date = new Date(topic.date*1000);
        _topic.chapter = (topic.nodes && topic.nodes[0])?topic.nodes[0]:"",
        _topic.section = (topic.nodes && topic.nodes[1])?topic.nodes[1]:"";
        _topic.knowledge = (topic.nodes && topic.nodes[2])?topic.nodes[2]:"";
		_topic.nandu = topic.nandu? topic.nandu:"";

        return _topic;
    },
    parseTopics:function(topics){
        var _topics = [];
        for(var i=0;i<topics.length;i++){
            _topics.push(this.parseTopic(topics[i]));
        }
        return _topics;
    },
	parseTemplatesOfAnswersheet:function(templates){
		var data = templates.data;
		var html = templates.html;
		var hTopics = [];
		for(var i=0;i<html.length;i++){
			var rowData = html[i].split("\n");
			for(var r=0;r<rowData.length;r++){
				var _c = rowData[r].split(" ");
				if(_c[0] && parseInt(_c[0])>0){
					var type = _c[0] , no = _c[1] , top = { x: parseInt(_c[2]) ,y: parseInt(_c[3]) } , middle = { x: parseInt(_c[4]) , y: parseInt(_c[5]) },bottom = { x:parseInt(_c[6]) , y: parseInt(_c[7]) };
					var width = bottom.x-top.x , height = bottom.y - top.y;
					hTopics.push({ type:type, no:no, top:top, middle:middle, bottom:bottom, height:height, width:width,page_num:i });
				}
			}
		}
		return hTopics;
	}
}