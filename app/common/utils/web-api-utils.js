'use strict'
var systemActions = require('../actions/system-actions');
var localStorageUtils = require('./local-storage-utils');
var {History} = require('../components/base/react-native-router')
var {Alert} = require('react-native')

const STUDENT_URL = 'http://testedu.idealsee.com';

var Ajax = function(options){
	// change data
	var formData = null;
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
    }
}