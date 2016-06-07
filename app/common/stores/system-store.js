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
	  
        answer_sheets = answer_sheets.filter(function(ele){
            return ele.subject_id == subjectInfo.subject_id;
        });
        
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
              _exam_info[key] = {
                  topic_no: key,
                  correct: exam_info[key].correct,
                  fullmark: exam_info[key].fullmark,
                  score: exam_info[key].score,
                  section_code: exam_info[key].section_code,
                  type: exam_info[key].type
              }
          }
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
  },//某套试卷的信息
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
                      _exam_info_error[key] = {
                          topic_no: key,
                          correct: exam_info[key].correct,
                          fullmark: exam_info[key].fullmark,
                          score: exam_info[key].score,
                          section_code: exam_info[key].section_code,
                          type: exam_info[key].type
                      }
                  }
              }else{
                  if(exam_info[key].score == exam_info[key].fullmark){
                      rightTopic++;
                  }else{
                      if(!_exam_info_error[key]){
                           _exam_info_error[key] = {};
                      }//判断错题A3组合起来
                      _exam_info_error[key] = {
                          topic_no: key,
                          correct: exam_info[key].correct,
                          fullmark: exam_info[key].fullmark,
                          score: exam_info[key].score,
                          section_code: exam_info[key].section_code,
                          type: exam_info[key].type
                      }
                  }
              }//计算总体数及正确题数
              if(!_exam_info[key]){
                   _exam_info[key] = {};
              }
              _exam_info[key] = {
                  topic_no: key,
                  correct: exam_info[key].correct,
                  fullmark: exam_info[key].fullmark,
                  score: exam_info[key].score,
                  section_code: exam_info[key].section_code,
                  type: exam_info[key].type
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
    },//试题的正误判断
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
                answer: _topic_detail[0].answer,
                answers: _topic_detail[0].answers,
                content: _topic_detail[0].content,
                topic_answer: _topic_detail[0].topic_answer
            }
            return topic_detail;
        }else{
            return null;
        }
    },//我的作业中的试题详情
    getSubjectWrongTopics:function(){
        var _meta_data = this.getMetaData();
        var subject = _meta_data?_meta_data.subject:[];
        var len_subject = subject.length;
        var len_data = _student_data.length;
        var math_error = 0;//数学错题数
        var chinese_error = 0;//语文错题数
        var english_error = 0;//英语错题数
        var _subject_wrong_topics = [];
        if(len_subject > 0){
             for(var i = 0 ; i < len_subject; i++){
                 if(subject[i].cn == "数学"){
                     for(var j = 0 ; j < len_data; j++){
                         var spec = _student_data[j].answer_sheet.spec;
                         var exam_info = _student_data[j].exam_info.exam_info;
                         var subject_id = _student_data[j].exam_info.subject_id;
                         var exams = [];
                         for(var key in exam_info){
                              exams.push(exam_info[key]);
                         }
                         if(subject[i].subject_id == subject_id){
                              var rightTopic_len = exams.filter(function(ele,pos){
                                  return spec == "A4"?!!ele.correct:ele.score == ele.fullmark;
                              }).length;
                              var errorTopic = exams.length - rightTopic_len;
                              math_error += errorTopic;
                         }
                     }//遍历试卷取数学中的错题
                     _subject_wrong_topics.push({
                         subject: subject[i].subject,
                         subject_id: subject[i].subject_id,
                         name: subject[i].cn,
                         topic_error:math_error 
                     })
                 }
                 if(subject[i].cn == "语文"){
                     for(var j = 0 ; j < len_data; j++){
                         var spec = _student_data[j].answer_sheet.spec;
                         var exam_info = _student_data[j].exam_info.exam_info;
                         var subject_id = _student_data[j].exam_info.subject_id;
                         var exams = [];
                          for(var key in exam_info){
                              exams.push(exam_info[key]);
                          }
                         if(subject[i].subject_id == subject_id){
                              var rightTopic_len = exams.filter(function(ele,pos){
                                  return spec == "A4"?!!ele.correct:ele.score == ele.fullmark;
                              }).length;
                              var errorTopic = exams.length - rightTopic_len;
                              math_error += errorTopic;
                         }
                     }//遍历试卷取数学中的错题
                     _subject_wrong_topics.push({
                         subject: subject[i].subject,
                         subject_id: subject[i].subject_id,
                         name: subject[i].cn,
                         topic_error:chinese_error 
                     })
                 }
                 if(subject[i].cn == "英语"){
                     for(var j = 0 ; j < len_data; j++){
                         var spec = _student_data[j].answer_sheet.spec;
                         var exam_info = _student_data[j].exam_info.exam_info;
                         var subject_id = _student_data[j].exam_info.subject_id;
                         var exams = [];
                          for(var key in exam_info){
                              exams.push(exam_info[key]);
                          }
                         if(subject[i].subject_id == subject_id){
                              var rightTopic_len = exams.filter(function(ele,pos){
                                  return spec == "A4"?!!ele.correct:ele.score == ele.fullmark;
                              }).length;
                              var errorTopic = exams.length - rightTopic_len;
                              math_error += errorTopic;
                         }
                     }//遍历试卷取数学中的错题
                     _subject_wrong_topics.push({
                         subject: subject[i].subject,
                         subject_id: subject[i].subject_id,
                         name: subject[i].cn,
                         topic_error:english_error 
                     })
                 }
             }
        };
        
        return _subject_wrong_topics;
    },//科目错题数目汇总
    getWrongTopicChapter:function(subject){
        var subjectInfo = this.getSubjectByName(subject);
        _student_data = _student_data.filter(function(ele){
            return ele.answer_sheet.subject_id == subjectInfo.subject_id;
        });//过滤出对应科目的试卷列表
        
        
        var len_all_data = _student_data.length;//对应科目paper_list长度
        var _topics = [];//申明一个数组存储所有题
        
        for(var i = 0 ; i < len_all_data; i++ ){
            var topics = _student_data[i].topics;
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
                var answer_sheet = _student_data[m].answer_sheet;
                var spec = _student_data[m].answer_sheet.spec;
                var topics = _student_data[m].topics;
                var exam_info = _student_data[m].exam_info.exam_info;
                var exams = [];
                var topics_len = topics.length;
                for(var k in exam_info){
                    exams.push({
                        no: k,
                        exam_info:exam_info[k]
                    })
                };
                var exams_len = exams.length;
                for(var n = 0 ; n < exams_len; n++){
                    if(spec == "A4"){
                        if(exams[n].exam_info.correct == 0 || exams[n].exam_info.correct == null){
                            var no  = exams[n].no;
                            var _topic_error = topics.filter(function(ele,pos){
                                return ele.no == no;
                            });
                            if(_topic_error.length > 0){
                                var nodes = !!_topic_error[0].nodes?_topic_error[0].nodes:[];
                                if(nodes.length > 0 && nodes[0] == key){
                                      if(!chapter[key]){
                                        chapter[key] = [];
                                    }
                                    chapter[key] = chapter[key].concat({
                                        answer_sheet_id: answer_sheet.answer_sheet_id,
                                        name: answer_sheet.name,
                                        subject_id: answer_sheet.subject_id,
                                        spec: spec
                                    })
                                }
                            }
                        }
                    }
                    if(spec == "A3"){
                        if(exams[n].exam_info.correct == 0 || exams[n].exam_info.correct == null){
                            var no  = exams[n].no;
                            var _topic_error = topics.filter(function(ele,pos){
                                return ele.no == no;
                            });
                            if(_topic_error.length > 0){
                                var nodes = !!_topic_error[0].nodes?_topic_error[0].nodes:[];
                                if(nodes.length > 0 && nodes[0] == key){
                                      if(!chapter[key]){
                                        chapter[key] = [];
                                    }
                                    chapter[key] = chapter[key].concat({
                                        answer_sheet_id: answer_sheet.answer_sheet_id,
                                        name: answer_sheet.name,
                                        subject_id: answer_sheet.subject_id,
                                        spec: spec
                                    })
                                }
                            }
                        }
                    }
                }
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
    },//章节分组
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
            _student_data = action.data.filter(function(ele,pos){
                    return ele.pages && ele.pages.length>0;
            });

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
    }
})

module.exports = SystemStore;