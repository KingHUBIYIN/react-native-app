'use strict'
var systemActions = require('../actions/system-actions');
var localStorageUtils = require('./local-storage-utils');
var {History} = require('../components/base/react-native-router')
var {Alert} = require('react-native')

const STUDENT_URL = 'http://testedu.idealsee.com';

var Ajax = function(options){
	// change data
	var formData = null;
    if(options.type.toUpperCase()=="GET"){
        if(typeof options.data=="object"){
            options.url +="?";
            var i = 0;
            for(var key in options.data){
                if(i!=0) options.url +="&";
                 var value = options.data[key];
                 options.url += key+"="+value;
                 i++;
            }
        }
    }else{
	   switch(typeof options.data){
		case "string":
			formData = options.data;
			break;
		case "object":
			if(options.data instanceof Array){
				formData = JSON.stringify(options.data);
			}
			else{
				formData = new FormData();
				for(var key in options.data){
					var value = options.data[key];
					if(value!=null && typeof value != "string"){
						value = JSON.stringify(value);
					}
					formData.append(key,value)
				}
			}
			break;
	   }
    }

    fetch(STUDENT_URL+options.url,{
        method:options.type,
        body:formData,
    })
    .then((response)=> response.text())
    .then((responseText)=>{
        var res = JSON.parse(responseText)
		if(res.status=="success"){
			options.success(res);
		}else{
			options.error('error', res.detail || res.msg);
		}
    })
    .catch((error)=>{
        options.error('warning',"服务器错误");
    })
}
var helper = {
	handleErrorMsgChange:function(error){
		Alert.alert("提示",error.msg,[{text: '确定', onPress: () => {} }])
	},
	handleUserDataChange:function(user){
		History.pushRoute("/user/login");
	},
}

module.exports = {
	baseUrl:STUDENT_URL,
    getStudentInfo:function(formData){
		Ajax({
			url:"/api/s/student_info/",
			type:"get",
			data:formData,
			success:function(res){
				localStorageUtils.setData("student_info",res.data);
				systemActions.receivedStudentInfo(res.data);
			},
			error:function(status,msg){
				helper.handleErrorMsgChange({status,msg});
			}
		})
    },
	userLogout:function(formData){
		Ajax({
			url:"/s/logout/",
			type:"post",
			success:function(res){
				localStorageUtils.setData("user_info",{});
				systemActions.postedUserLogoutForm({});
			},
			error:function(status,msg){
				helper.handleErrorMsgChange({status,msg});
			}
		})
	},
	userLogin:function(formData){
		Ajax({
			url:"/s/login",
			type:"post",
			data:formData,
			success:function(res){
				localStorageUtils.setData("user_info",formData);
				systemActions.postedUserLoginForm(formData);
			},
			error:function(status,msg){
				helper.handleErrorMsgChange({status,msg});
			}
		})
	},
	postUserNewPassword:function(formData){
		Ajax({
			url:"/s/password_reset/",
			type:"post",
			data:formData,
			success:function(res){
				systemActions.postedUserNewPassword(res.data);
			},
			error:function(status,msg){
				helper.handleErrorMsgChange({status,msg});
			}
		})
	},
	postUserFeedback:function(formData){
		Ajax({
			url:"/api/v1/students/feedback",
			type:"post",
			data:formData,
			success:function(res){
				systemActions.postedUserFeedback(res.data);
			},
			error:function(status,msg){
				helper.handleErrorMsgChange({status,msg});
			}
		})
	},
    initData:function(){
        localStorageUtils.getData(function(error,json){
            var data = JSON.parse(json);
            if(data && data.user_info){
                systemActions.receivedUserInfo(data.user_info);
            }
			helper.handleUserDataChange(data.user_info);
        });
    },
     //分段获取试卷列表
    getAllData:function(formData){
        Ajax({
			url:"/custom/student/get_paper_list",
			type:"get",
			data:formData,
			success:function(res){
				systemActions.receivedAllData(res.data);
			},
			error:function(status,msg){
				helper.handleErrorMsgChange({status,msg});
			}
		})
    },
    //获取meta信息
    getStudentMeta:function(formData){
        Ajax({
			url:"/api/v1/students/meta",
			type:"get",
			data:formData,
			success:function(res){
				systemActions.receivedStudentMeta(res.data);
			},
			error:function(status,msg){
				helper.handleErrorMsgChange({status,msg});
			}
		})
    },
    //获取不同科目的错题总数
    getExamErrorTopicNum:function(formData){
        Ajax({
			url:"/api/v1/students/get_exam_error_topic_num",
			type:"get",
			data:formData,
			success:function(res){
				systemActions.receivedExamErrorTopicNum(res.data);
			},
			error:function(status,msg){
				helper.handleErrorMsgChange({status,msg});
			}
		})
    },
    //分段获取错题的试卷列表
    getExamErrorTopic:function(formData){
         Ajax({
			url:"/api/v1/students/get_exam_error_topic",
			type:"get",
			data:formData,
			success:function(res){
				systemActions.receivedExamErrorTopic(res.data);
			},
			error:function(status,msg){
				helper.handleErrorMsgChange({status,msg});
			}
		})
    },
    //攻克训练的题目
    getTopicSuggest:function(formData){
        Ajax({
			url:"/api/topic/suggest",
			type:"get",
			data:formData,
			success:function(res){
				systemActions.receivedTopicSuggest(res.data);
			}
		})
    }
}