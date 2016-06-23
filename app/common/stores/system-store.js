'use strict'
var SystemDispatcher = require('../dispatcher/system-dispatcher');
var {ActionTypes,EventTypes} = require('../constants/system-constants');
var TopicAPIUtils = require('../utils/TopicAPIUtils');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require("underscore");

var _error_msg = {status:"error",msg:"操作失败"};
// store model
var _send_info_list = [];
var _message_list = [];
var _user_info = {};
var _student_info = {};
// form address
var _provinces = [];
var _address_form = {};
// form selection
var _category = {};
var _category_form = {};
var _date_picker_form = {};

//获取全部资源
var _student_data = [];
var _meta_data = {student:{},subject:[]};

//分段获取数据
var next_cursor = 0;
var _wrong_next_cursor = 0;

//获取错题总数
var _topic_error_num = {};

//获取错误的试卷
var _wrong_answers = [];

//攻克训练的题目
var _topic_suggest = [];

//学习曲线
var _subject_attrs = [];
var _chart_data = {};
var _knowledge_map = [];

var SystemStore = assign({},EventEmitter.prototype,{
    emitChange:function(type){
        this.emit(type);
    },
    addChangeListener:function(type,callback){
        this.on(type,callback);
    },
    removeChangeListener:function(type,callback){
        this.removeListener(type,callback)
    },
    getNextCursor:function(){
        return next_cursor;
    },
    getWrongNextCursor:function(){
        return _wrong_next_cursor;
    },
    getExamErrorTopicNum:function(){
        return _topic_error_num;
    },//获取不同科目的错题总数
    getMetaData:function(){
      return _meta_data;
    },
    getSubjectByName:function(name){
          return _meta_data.subject.filter(function(ele){
              return ele.subject == name;
          })[0];
    },
    getAnswerSheets:function(subject){
        var subjectInfo = this.getSubjectByName(subject);
        var answer_sheets = _.map(_student_data,function(ele){
          var exam = ele.exam_info.exam_info;
          var answer_sheet = ele.answer_sheet;
          var spec = answer_sheet.spec;
          var exams = [];
          for(var i in exam){
              exams.push(exam[i]);
          }
          var correct_len = exams.filter(function(ele){
              return  spec=="A4"? !!ele.correct : ele.fullmark==ele.score;
          }).length;

          return {
              id:ele.answer_sheet_id,
              name:answer_sheet.name,
              subject_id:answer_sheet.subject_id,
              date:new Date(ele.date*1000).Format("yyyy/MM/dd"),
              correct: correct_len,
              error:exams.length - correct_len,
              sum:exams.length,
              percent:exams.length?Math.round(correct_len*100/exams.length):0
          }
        });
        if(answer_sheets.length > 0){
            answer_sheets = answer_sheets.filter(function(ele){
                return ele.subject_id == subjectInfo.subject_id;
            });//过滤出不同科目的试卷

            var obj = {};
            var paperlist = {};
            var len = answer_sheets.length;
            for(var i = 0 ; i < len ; i ++){
                obj[answer_sheets[i].date] = true;//把所有的时间记录下来;
            };
            for(var key in obj){
                var results = answer_sheets.filter(function(ele,pos){
                    return ele.date == key;
                });
                if(!paperlist[key]){
                    paperlist[key] = [];
                };
                if(results.length > 0){
                    paperlist[key] = paperlist[key].concat(results);
                }
            };//把年月日相同的时间组织起来
          return paperlist;
        }else{
            return {};
        }
  },
    getAnswerSheet:function(answer_sheet_id){
      var answer_sheets = _student_data.filter(function(ele,pos){
          return ele.answer_sheet_id == answer_sheet_id;
       }); 
      if(answer_sheets.length>0){
		  var topics = answer_sheets[0].topics;
          var exam_info = answer_sheets[0].exam_info.exam_info;
          var _exam_info = {};
          //计算总体数及正确题数
          var spec = answer_sheets[0].answer_sheet.spec;
          var count = 0;
          var rightTopic = 0;
          //把当前题号加入到试题中
          for(var key in exam_info){
              count++
              if(spec == "A4"){
                  if(exam_info[key].correct == 1){
                     rightTopic++;
                  }
              }else{
                  if(exam_info[key].score == exam_info[key].fullmark){
                      rightTopic++;
                  }
              }//计算总体数及正确题数
              if(!_exam_info[key]){
                   _exam_info[key] = {};
              }
              var topics_len = topics.length;
              for(var i = 0; i < topics_len; i++){
                  if(topics[i].no == key){
                      _exam_info[key] = {
                          topic_id: topics[i].topic_id,
                          topic_no: key,
                          correct: exam_info[key].correct,
                          fullmark: exam_info[key].fullmark,
                          score: exam_info[key].score,
                          section_code: exam_info[key].section_code,
                          type: exam_info[key].type
                      }
                  }
              }
          };
          answer_sheets[0].exam_info.exam_info = _exam_info;
		  var _topics = [];
		  for(var i=0;i<topics.length;i++){
			  if(topics[i].sub && topics[i].sub.length>0){
				  for(var j=0;j<topics[i].sub.length;j++){
					  var _sub = topics[i].sub[j];
					  _topics.push(_.extend(topics[i],{label:_sub.no,score:_sub.score,height:_sub.height,attachments:_sub.attachments}));
				  }
			  }else{
				  _topics.push(topics[i])
			  }
		  }
          _topics = _.sortBy(_topics,function(ele,pos){
return ele.no;
          });
		  answer_sheets[0]._topics = _topics;
		  answer_sheets[0].count = count;
		  answer_sheets[0].rightTopic = rightTopic;
          return answer_sheets[0];
      }else{
          return null;
      }
  },//我的作业中某套试卷的信息
    getAnswerSheetError:function(answer_sheet_id){
       var answer_sheets = _student_data.filter(function(ele,pos){
          return ele.answer_sheet_id == answer_sheet_id;
       }); 
       if(answer_sheets.length>0){
		  var topics = answer_sheets[0].topics;
          var exam_info = answer_sheets[0].exam_info.exam_info;
          var _exam_info = {};
          //计算总体数及正确题数
          var spec = answer_sheets[0].answer_sheet.spec;
          var count = 0;
          var rightTopic = 0;
          var _exam_info_error = {};
          //把当前题号加入到试题中
          for(var key in exam_info){
              count++
              if(spec == "A4"){
                  if(exam_info[key].correct == 1){
                     rightTopic++;
                  }else{
                      if(!_exam_info_error[key]){
                           _exam_info_error[key] = {};
                      }//判断错题A4组合起来
                      var topics_len = topics.length;
                      for(var i = 0; i < topics_len; i++){
                          if(topics[i].no == key){
                              _exam_info_error[key] = {
                                  topic_id: topics[i].topic_id,
                                  topic_no: key,
                                  correct: exam_info[key].correct,
                                  fullmark: exam_info[key].fullmark,
                                  score: exam_info[key].score,
                                  section_code: exam_info[key].section_code,
                                  type: exam_info[key].type
                              }
                          }
                      }
                  }
              }else{
                  if(exam_info[key].score == exam_info[key].fullmark){
                      rightTopic++;
                  }else{
                      if(!_exam_info_error[key]){
                           _exam_info_error[key] = {};
                      }//判断错题A3组合起来
                      var topics_len = topics.length;
                      for(var i = 0; i < topics_len; i++){
                          if(topics[i].no == key){
                              _exam_info_error[key] = {
                                  topic_id: topics[i].topic_id,
                                  topic_no: key,
                                  correct: exam_info[key].correct,
                                  fullmark: exam_info[key].fullmark,
                                  score: exam_info[key].score,
                                  section_code: exam_info[key].section_code,
                                  type: exam_info[key].type
                              }
                          }
                      }
                  }
              }//计算总体数及正确题数
              if(!_exam_info[key]){
                   _exam_info[key] = {};
              }
              var topics_len = topics.length;
              for(var i = 0; i < topics_len; i++){
                  if(topics[i].no == key){
                      _exam_info[key] = {
                          topic_id: topics[i].topic_id,
                          topic_no: key,
                          correct: exam_info[key].correct,
                          fullmark: exam_info[key].fullmark,
                          score: exam_info[key].score,
                          section_code: exam_info[key].section_code,
                          type: exam_info[key].type
                      }
                  }
              }
          }
          answer_sheets[0].exam_info.exam_info = _exam_info;
          answer_sheets[0].exam_info._exam_info_error = _exam_info_error;
		  var _topics = [];
		  for(var i=0;i<topics.length;i++){
			  if(topics[i].sub && topics[i].sub.length>0){
				  for(var j=0;j<topics[i].sub.length;j++){
					  var _sub = topics[i].sub[j];
					  _topics.push(_.extend(topics[i],{label:_sub.no,score:_sub.score,height:_sub.height,attachments:_sub.attachments}));
				  }
			  }else{
				  _topics.push(topics[i])
			  }
		  }
          _topics = _.sortBy(_topics,function(ele,pos){
                return ele.no;
          });
		  answer_sheets[0]._topics = _topics;
		  answer_sheets[0].count = count;
		  answer_sheets[0].rightTopic = rightTopic;
          return answer_sheets[0];
      }else{
          return null;
      }
    },//我的作业中试题的正误判断
    getTopicDetail:function(answer_sheet_id,topic_no){
        var topic_detail = {};
        var answer_sheet = _.filter(_student_data,function(ele,pos){
            return ele.answer_sheet_id == answer_sheet_id;
        });//获取某套试卷的全部信息
        if(answer_sheet.length > 0){
             var topics = answer_sheet[0].topics;
             var answer_sheet = answer_sheet[0].answer_sheet;
             var _topic_detail = _.filter(topics,function(ele,pos){
                 return ele.no == topic_no;
             });//获取相同题号的试题详情
             var standard_answers = answer_sheet.standard_answers;
            //组合需要的数据
            var nodes = _topic_detail[0].nodes;
            topic_detail = {
                answer_sheet_id: answer_sheet.answer_sheet_id,
                name: answer_sheet.name,
                nandu: _topic_detail[0].nandu,
                section: _topic_detail[0].section,
                node: nodes[nodes.length-1],
                topic_type: _topic_detail[0].topic_type,
                subject: _topic_detail[0].subject,
                no: _topic_detail[0].no,
                std_answer: _topic_detail[0].answer,
                answers: _topic_detail[0].answers,
                content: _topic_detail[0].content,
                topic_options: _topic_detail[0].topic_options
            }
            return topic_detail;
        }else{
            return null;
        }
    },//我的作业中的试题详情
    getWrongAnswerSheets:function(subject){
        var subjectInfo = this.getSubjectByName(subject);
        var answer_sheets = _.map(_wrong_answers,function(ele){
          var exam = ele.error_topics;
          var answer_sheet = ele.answer_sheet;
          var spec = answer_sheet.spec;
          var exams = [];
          for(var i in exam){
              exams.push(exam[i]);
          }

          return {
              id:ele.answer_sheet_id,
              name:answer_sheet.name,
              subject_id:ele.subject_id,
              date:new Date(ele.last_modify*1000).Format("yyyy/MM/dd"),
              error:exams.length
          }
        });
        answer_sheets = answer_sheets.filter(function(ele){
            return ele.subject_id == subjectInfo.subject_id;
        });//过滤出不同科目的试卷
      return answer_sheets;
    },//分离不同科目错题试卷列表
    getWrongTopicChapter:function(subject){
        var subjectInfo = this.getSubjectByName(subject);
        _wrong_answers = _wrong_answers.filter(function(ele){
            return ele.subject_id == subjectInfo.subject_id;
        });//过滤出对应科目的试卷列表
        
        
        var len_all_data = _wrong_answers.length;//对应科目paper_list长度
        var _topics = [];//申明一个数组存储所有题
        
        for(var i = 0 ; i < len_all_data; i++ ){
            var topics = _wrong_answers[i].topics;
            _topics = _topics.concat(topics);
        }//所有的题目数据合并到_topics中;
        
        var obj = {};//申明一个对象存储所有的章
        
        var _topics_len = _topics.length;
        for(var j = 0 ; j < _topics_len; j++){
            var nodes = !!_topics[j].nodes?_topics[j].nodes:[];
            if(nodes.length > 0){
                var chapter = nodes[0];
                obj[chapter] = true;
            }
        }//存储所有的章
        
        var chapter = {};//声明一个对象储存章对应的试卷列表
        for(var key in obj){
            for(var m = 0 ; m < len_all_data; m++ ){
                var topics = _wrong_answers[m].topics;
                var topics_len = topics.length;
                for(var n = 0; n < topics_len ; n++){
                    var nodes = topics[n].nodes?topics[n].nodes:[];
                    if(nodes[0] == key){
                        if(!chapter[key]){
                            chapter[key] = [];
                        };
                        chapter[key].push(_wrong_answers[m]);
                    }
                };
            }
        };
        //去除重复
        for(var a in chapter){
            var b = chapter[a];
            var obj_chapter = {};
            var b_len = b.length;
            for(var c = 0 ; c < b_len; c++){
                obj_chapter[b[c].answer_sheet_id] = b[c];
            }
            var arr = [];
            for(var z in obj_chapter){
                 arr.push(obj_chapter[z])
            }
            chapter[a] = arr
        }
        return chapter
    },//分离不同科目章节分组
    getWrongTopicByType:function(answer_sheet_id,topicType){
        var _wrong_answer = _wrong_answers.filter(function(ele,pos){
            return ele.answer_sheet_id == answer_sheet_id;
        });//过滤出某涛试卷的全部信息
        var wrong_topic = [];
        var topics = _wrong_answer[0].topics;
        var topics_len = topics.length;
        if(!!topicType){
            wrong_topic = _.filter(topics,function(ele,pos){
                return ele.topic_type == topicType;
            });
            wrong_topic = _.sortBy(wrong_topic,function(ele,pos){
                return ele.no;
            });
            return wrong_topic;
        };//根据不同题目类型筛选题目
        for(var i = 0; i < topics_len; i++){
            wrong_topic.push(topics[i]);
        }
        wrong_topic = _.sortBy(wrong_topic,function(ele,pos){
            return ele.no;
        });
        return wrong_topic;
    },//根据类型筛选不同的题目
    getWrongTopicDetailByTopicId:function(answer_sheet_id,topicId){
         var _wrong_answer = _wrong_answers.filter(function(ele,pos){
            return ele.answer_sheet_id == answer_sheet_id;
         });//过滤出某涛试卷的全部信息
         var topics = _wrong_answer[0].topics;
         var topic = _.filter(topics,function(ele,pos){
             return ele.topic_id == topicId;
         });//获取单倒试题详细信息
         return topic[0];
    },//根据试卷ID及题目ID筛选出试题详细信息
    getTopicSuggest:function(){
        for(var i = 0 ; i < _topic_suggest.length; i++){
            var topic_options = !!_topic_suggest[i].topic_options?_topic_suggest[i].topic_options:[];
            if(topic_options.length > 0){
                topic_options[0].option = "A";
                topic_options[0].topic_id = _topic_suggest[i].topic_id;
                topic_options[0].selected = "";
                topic_options[1].option = "B";
                topic_options[1].topic_id = _topic_suggest[i].topic_id;
                topic_options[1].selected = "";
                topic_options[2].option = "C";
                topic_options[2].topic_id = _topic_suggest[i].topic_id;
                topic_options[2].selected = "";
                topic_options[3].option = "D";
                topic_options[3].topic_id = _topic_suggest[i].topic_id;
                topic_options[3].selected = "";
                _topic_suggest.topic_options = topic_options;
            };
        }
        return _topic_suggest;
    },//攻克训练的题目
    getChartData:function(){
      var answer_sheets = _.map(_chart_data.exam_infos,function(ele){
          var exam = ele.exam_info;
          var exams = [];
          for(var i in exam){
              exams.push(exam[i]);
          }
          
          var correct_len = exams.filter(function(ele){
              return !!ele.correct;
          }).length;
          
          return {
              date:ele.date,
              correct: correct_len,
              error:exams.length - correct_len,
              sum:exams.length
          }
      });
      
      var pieData = [
          {
              correct:answer_sheets[0]?answer_sheets[0].correct:0,
              error:answer_sheets[0]?answer_sheets[0].error:0,
              sum:answer_sheets[0]?answer_sheets[0].sum:0,
          },
          {
              correct:0,
              error:0,
              sum:0
          },
          {
              correct:0,
              error:0,
              sum:0
          },
          {
              correct:0,
              error:0,
              sum:0
          }
      ]
      
      var answer_sheets = _.sortBy(answer_sheets,function(ele){
          return - ele.date;
      })
      
      var weeks = answer_sheets.filter(function(ele){
          var today = new Date();
          var mon = new Date().addDate(-today.getDay());
          var sun = new Date().addDate(7-today.getDay());
          var _date = ele.date*1000;
          return _date>mon.valueOf() && _date<sun.valueOf();
      });
      
      var months = answer_sheets.filter(function(ele){
          var today = new Date();
          var firstDay = new Date().addDate(-today.getDate());
          var lastDay = new Date().addDate(today.MonthlyNum()-today.getDate());
          var _date = ele.date*1000;
          return _date> firstDay.valueOf() && _date< lastDay.valueOf();
      });
      
      _.map(answer_sheets,function(ele,pos){
          pieData[3].correct += ele.correct;
          pieData[3].error += ele.error;
          pieData[3].sum += ele.correct + ele.error;
      })
      _.map(weeks,function(ele,pos){
          pieData[1].correct += ele.correct;
          pieData[1].error += ele.error;
          pieData[1].sum += ele.correct + ele.error;
      })
      _.map(months,function(ele,pos){
          pieData[2].correct += ele.correct;
          pieData[2].error += ele.error;
          pieData[2].sum += ele.correct + ele.error;
      })
    var answer_len = answer_sheets.length;
    var values =    _.map(answer_sheets,function(ele,pos){
                return {
                    x:(pos%Math.round(answer_len/10))?"":pos, 
                    y:ele.sum?ele.correct*100/ele.sum:0
                }
      })
      
      return {
          pie:[
                    {
                        seriesName:"本次",
                        values:[
                                  { name: 'correct',label:"正确", value: pieData[0].correct ,color:"rgba(255,255,255,0.6)" },
                                  { name: 'wrong',label:"错误", value: pieData[0].error,color:"rgba(0,0,0,0.1)" },
                                  { name: 'undo',label:"未做", value: 0,color:"#CCCCCC" }
                        ],
                        sum:pieData[0].sum
                    },
                    {
                        seriesName:"本周",
                        values:[
                                  { name: 'correct',label:"正确", value: pieData[1].correct,color:"rgba(255,255,255,0.6)" },
                                  { name: 'wrong',label:"错误", value: pieData[1].error,color:"rgba(0,0,0,0.1)" },
                                  { name: 'undo',label:"未做", value: 0,color:"#CCCCCC" }
                        ],
                        sum:pieData[1].sum
                    },
                    {
                        seriesName:"本月",
                        values:[
                                  { name: 'correct',label:"正确", value: pieData[2].correct,color:"rgba(255,255,255,0.6)" },
                                  { name: 'wrong',label:"错误", value: pieData[2].error,color:"rgba(0,0,0,0.1)" },
                                  { name: 'undo',label:"未做", value: 0,color:"#CCCCCC" }
                        ],
                        sum:pieData[2].sum
                    },
                    {
                        seriesName:"累计",
                        values:[
                                  { name: 'correct',label:"正确", value: pieData[3].correct,color:"rgba(255,255,255,0.6)" },
                                  { name: 'wrong',label:"错误", value: pieData[3].error,color:"rgba(0,0,0,0.1)" },
                                  { name: 'undo',label:"未做", value: 0,color:"#CCCCCC" }
                        ],
                        sum:pieData[3].sum
                    }
            ],
          line: [
                {
                    seriesName:"作业数据",
                    values: values,
                    color:"#FF7E60"
                 },
                {
                    seriesName:"考试数据",
                    values:values,
                    color:"#91DE74"
                }
          ]
      }
  },//获取学习曲线
    getKnowledgeChartData:function(subject){
      _subject_attrs = _.map(_subject_attrs,function(ele,pos){
              if(subject == "数学"){
                  var points_topics = _knowledge_map.filter(function(k,pos){
                  return k.nodes[2] == ele.points;
                  })
                  var points_correct_topics = points_topics.filter(function(k,pos){
                      return k.correct;
                  })
                  var percent = points_correct_topics.length*100 / points_topics.length;
                  var packName = percent>=100?"green":percent>=60?"yellow":percent>0?"red":"none";
                  var colors = {
                      "green":"#91DE74",
                      "yellow":"#FFC22D",
                      "red":"#FF7E60",
                      "none":"#CCCCCC"
                  };
                  return {
                      chapter: ele.chapter,
                      chapter_num: ele.chapter_num,
                      section: ele.section,
                      section_num: ele.section_num,
                      points : ele.points,
                      className: ele.points,
                      packageName:packName,
                      value:50+ Math.ceil(ele.points.length/4)*25,
                      rows:Math.ceil(ele.points.length/4),
                      color:colors[packName],
                      percent:percent,
                      total:points_topics.length,
                      A4:0,
                      A3:0
                  }
              };
              if(subject == "语文"){
                  var section_topics = _knowledge_map.filter(function(k,pos){
                  return k.nodes[1] == ele.section;
                  })
                  var section_correct_topics = section_topics.filter(function(k,pos){
                      return k.correct;
                  })
                  var percent = section_correct_topics.length*100 / section_topics.length;
                  var packName = percent>=100?"green":percent>=60?"yellow":percent>0?"red":"none";
                  var colors = {
                      "green":"#91DE74",
                      "yellow":"#FFC22D",
                      "red":"#FF7E60",
                      "none":"#CCCCCC"
                  };
                  return {
                      chapter: ele.chapter,
                      chapter_num: ele.chapter_num,
                      section: ele.section,
                      section_num: ele.section_num,
                      points : ele.points,
                      className: ele.section,
                      packageName:packName,
                      value:50+ Math.ceil(ele.section.length/4)*25,
                      rows:Math.ceil(ele.section.length/4),
                      color:colors[packName],
                      percent:percent,
                      total:section_topics.length,
                      A4:0,
                      A3:0
                  }
                  };
          });
      
      return _.toArray(_.groupBy(_subject_attrs,function(ele){
          return ele.chapter_num;
      }));
  },//获取知识图谱数据
    getSubjectAttrs:function(){
        return _subject_attrs;
    },
	getErrorMsg:function(){
		return _error_msg;
	},
    getStudentInfo:function(){
        return _student_info;
    },
	getUserInfo:function(){
		return _user_info;
	},
	setUserInfo:function(user_info){
		_user_info = user_info;
	},
	clearUserInfo:function(){
		_user_info = {};
	},
	getProvinces:function(){
		var provinces = [];
		for(var i=0;i<_provinces.length;i++){
			provinces.push({
				text:_provinces[i].text,
				value:_provinces[i].value
			})
		}
		return provinces;
	},
	getCities:function(province){
		if(!province) return [];
		var provinces = _provinces.filter(function(ele,pos){
			return province.value==ele.value;
		})
		if(provinces.length>0){
			return provinces[0].cities?provinces[0].cities:[];
		}else{
			return [];
		}
	},
    getAddressForm:function(){
        return _address_form;
    },
	getCategory:function(){
		return _category;
	},
	getCategoryByType:function(type){
		return _category[type]? _category[type] :_category;
	},
	getCategoryForm:function(){
		return _category_form;
	},
	getDatePickerForm:function(){
		return _date_picker_form;
	}
})

SystemStore.dispatchToken = SystemDispatcher.register(function(action){
    switch(action.type){
		case ActionTypes.RECEIVED_ERROR_MSG:
            _error_msg = action.data;
            SystemStore.emitChange(EventTypes.RECEIVED_ERROR_MSG);
            break;
        case ActionTypes.RECEIVED_STUDENT_INFO:
            _student_info = action.data;
            SystemStore.emitChange(EventTypes.RECEIVED_STUDENT_INFO);
            break;
        case ActionTypes.POSTED_USER_LOGIN_FORM:
            _user_info = action.data;
            SystemStore.emitChange(EventTypes.POSTED_USER_LOGIN_FORM);
            break;
		case ActionTypes.POSTED_USER_LOGOUT_FORM:
			_user_info = action.data;
            SystemStore.emitChange(EventTypes.POSTED_USER_LOGOUT_FORM);
            break;
		case ActionTypes.RECEIVED_USER_INFO:
            _user_info = action.data;
            SystemStore.emitChange(EventTypes.RECEIVED_USER_INFO);
            break;
		case ActionTypes.POSTED_USER_NEW_PASSWORD:
			var data = action.data;
            SystemStore.emitChange(EventTypes.POSTED_USER_NEW_PASSWORD);
            break;
		case ActionTypes.POSTED_USER_FEEDBACK:
			var data = action.data;
            SystemStore.emitChange(EventTypes.POSTED_USER_FEEDBACK);
            break;
		case ActionTypes.RECEIVED_PROVINCES:
			_provinces = action.data;
            SystemStore.emitChange(EventTypes.RECEIVED_PROVINCES);
            break;
        case ActionTypes.CHANGED_ADDRESS_FORM:
            var {province,city,type,back,name} = action.data
            var __provinces = _provinces.filter(function(ele,pos){
                return ele.value == province;
            })
           var __cities = __provinces[0].cities.filter(function(ele,pos){
                return ele.value == city;
            })
           _address_form = {
               type,
               back,
               name,
               province:__provinces[0],
               city:__cities[0]
           }
            SystemStore.emitChange(EventTypes.CHANGED_ADDRESS_FORM);
            break;
		case ActionTypes.RECEIVED_CATEGORY:
			_category = action.data;
			SystemStore.emitChange(EventTypes.RECEIVED_CATEGORY);
			break;
		case ActionTypes.CHANGED_CATEGORY_FORM:
			var {category,type,back,name} = action.data
			var _categorys = _category[type].filter(function(ele,pos){
				return ele.value == category;
			})
			_category_form = {
				category:_categorys[0],
				type,
				back,
				name
			}
			SystemStore.emitChange(EventTypes.CHANGED_CATEGORY_FORM);
			break;
		case ActionTypes.CHANGED_DATE_PICKER_FORM:
			var {date,type,back,name} = action.data
			date = parseInt(date);
			_date_picker_form = {
				date:{
					date: new Date(date*1000),
					value: date,
					text: new Date(date*1000).Format("yyyy/MM/dd")
				},
				type,
				back,
				name
			}
			SystemStore.emitChange(EventTypes.CHANGED_DATE_PICKER_FORM);
			break;
		case ActionTypes.POSTED_SEND_SHIP_FORM:
			_send_info_list.push(action.data);
			SystemStore.emitChange(EventTypes.RECEIVED_MY_SEND_INFO);
			SystemStore.emitChange(EventTypes.POSTED_SEND_SHIP_FORM);
			break;
		case ActionTypes.POSTED_SEND_CARRY_FORM:
			_send_info_list.push(action.data);
			SystemStore.emitChange(EventTypes.RECEIVED_MY_SEND_INFO);
			SystemStore.emitChange(EventTypes.POSTED_SEND_CARRY_FORM);
			break;
        case ActionTypes.RECEIVED_ALL_DATA:
            var student_data = action.data.datas.filter(function(ele,pos){
                    return ele.pages && ele.pages.length>0;
            });
            _student_data = _student_data.concat(student_data);
            next_cursor = action.data.next_cursor;
            
            //对_student_data去重
            var obj = {};
            var data_len = _student_data.length;
            for(var i = 0 ; i < data_len; i++){
              obj[_student_data[i].answer_sheet_id] = _student_data[i]; 
            };
            var data_arr = [];
            for(var key in obj){
              data_arr.push(obj[key])
            };
            _student_data = data_arr;
            
            
            for(var i=0;i<_student_data.length;i++){
                _student_data[i].topics = TopicAPIUtils.parseTopics(_student_data[i].topics);
            }
             _student_data = _.sortBy(_student_data,function(ele){return -ele.date});
            SystemStore.emitChange(EventTypes.RECEIVED_ALL_DATA);
          break; 
        case ActionTypes.RECEIVED_STUDENT_META:
            _meta_data = action.data;
            SystemStore.emitChange(EventTypes.RECEIVED_STUDENT_META);
          break;
       case ActionTypes.RECEIVED_EXAM_ERROR_TOPIC_NUM:
            _topic_error_num = action.data;
            SystemStore.emitChange(EventTypes.RECEIVED_EXAM_ERROR_TOPIC_NUM);
          break;
       case ActionTypes.RECEIVED_EXAM_ERROR_TOPIC:
            var wrong_answers = action.data.datas.filter(function(ele,pos){
                    return ele.pages && ele.pages.length>0;
            });
            _wrong_answers = _wrong_answers.concat(wrong_answers);
            _wrong_next_cursor = action.data.next_cursor;
            
            //对_student_data去重
            var obj = {};
            var data_len = _wrong_answers.length;
            for(var i = 0 ; i < data_len; i++){
              obj[_wrong_answers[i].answer_sheet_id] = _wrong_answers[i]; 
            };
            var data_arr = [];
            for(var key in obj){
              data_arr.push(obj[key])
            };
            _wrong_answers = data_arr;
            
            
            for(var i=0;i<_wrong_answers.length;i++){
                _wrong_answers[i].topics = TopicAPIUtils.parseTopics(_wrong_answers[i].topics);
            }
             _wrong_answers = _.sortBy(_wrong_answers,function(ele){return -ele.date});
            SystemStore.emitChange(EventTypes.RECEIVED_EXAM_ERROR_TOPIC);
          break;   
      case ActionTypes.RECEIVED_TOPIC_SUGGEST:
            _topic_suggest = action.data;
            SystemStore.emitChange(EventTypes.RECEIVED_TOPIC_SUGGEST);
          break;
     case ActionTypes.RECEIVED_SUBATTRS:
          _subject_attrs = _.sortBy(action.data,function(ele,pos){
                  return parseFloat(ele.section_num);
              });
          SystemStore.emitChange(EventTypes.RECEIVED_SUBATTRS);
          break;
     case ActionTypes.RECEIVED_ALL_EXAM_INFO:
          _chart_data = action.data;
          SystemStore.emitChange(EventTypes.RECEIVED_ALL_EXAM_INFO);
          break;
    case ActionTypes.RECEIVED_KONW_MAP:
          _knowledge_map = action.data;
          StudentStore.emitChange(EventTypes.RECEIVED_KONW_MAP);
          break;        
    }
})

module.exports = SystemStore;