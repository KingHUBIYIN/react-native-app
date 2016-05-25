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
        var answer_sheets = _.map(_student_data,function(ele,pos){
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
        answer_sheets =  _.sortBy(answer_sheets,function(ele){
              return -ele.date;
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
        answer_sheets = [];
        for(var key in paperlist){
            answer_sheets.push({
                key: key,
                children: paperlist[key]
            })
        }
      return answer_sheets;
  },
    getAnswerSheet:function(answer_sheet_id){
      var answer_sheets = _student_data.filter(function(ele,pos){
          return ele.answer_sheet_id == answer_sheet_id;
       }); 
      if(answer_sheets.length>0){
		  var topics = answer_sheets[0].topics;
		  var _topics = [];
		  for(var i=0;i<topics.length;i++){
			  if(topics[i].sub && topics[i].sub.length>0){
				  for(var j=0;j<topics[i].sub.length;j++){
					  var _sub = topics[i].sub[j];
					  _topics.push($.extend(true,{},topics[i],{label:_sub.no,score:_sub.score,height:_sub.height,attachments:_sub.attachments}));
				  }
			  }else{
				  _topics.push(topics[i])
			  }
		  }
		  answer_sheets[0]._topics = _topics;
          return answer_sheets[0];
      }else{
          return null;
      }
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
            _student_data = action.data.filter(function(ele,pos){
                    return ele.pages && ele.pages.length>0;
            });

            for(var i=0;i<_student_data.length;i++){
                _student_data[i].topics = TopicAPIUtils.parseTopics(_student_data[i].topics);
            }
             _student_data = _.sortBy(_student_data,function(ele){return -ele.date});
            StudentStore.emitChange(EventTypes.RECEIVED_ALL_DATA);
          break; 
        case ActionTypes.RECEIVED_STUDENT_META:
            _meta_data = action.data;
            StudentStore.emitChange(EventTypes.RECEIVED_STUDENT_META);
            break;
    }
})

module.exports = SystemStore;