'use strict'
var systemActions = require('../actions/system-actions');
var localStorageUtils = require('./local-storage-utils');
var {History} = require('../components/base/react-native-router')
var {Alert} = require('react-native')

const STUDENT_URL = 'http://edu.idealsee.com';

var Ajax = function(options){
	// change data
	var formData = "";
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
		if(!(user && user.username) || History.curRoute.name!="/user/login"){
			History.pushRoute("/user/login");
		}else{
			History.pushRoute("/home/index");
		}
	},
}


module.exports = {
    getMySendInfo:function(){
        
    },
    getMyMessage:function(){
        
    },
	userLogout:function(formData){
		localStorageUtils.setData("user_info",{});
		systemActions.receivedUserInfo({});
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
	postSendCarryForm:function(formData){
		localStorageUtils.getData(function(error,json){
			var data = JSON.parse(json);
			if(data && data.my_send_info){
				data.my_send_info = data.my_send_info?data.my_send_info:[];
				data.my_send_info.push(formData);
				localStorageUtils.setData("my_send_info",data.my_send_info);
			}
	  });
		systemActions.postedSendCarryForm(formData);
	},
	postSendShipForm:function(formData){
		localStorageUtils.getData(function(error,json){
			var data = JSON.parse(json);
			if(data && data.my_send_info){
				data.my_send_info = data.my_send_info?data.my_send_info:[];
				data.my_send_info.push(formData);
				localStorageUtils.setData("my_send_info",data.my_send_info);
			}
	  });
		systemActions.postedSendShipForm(formData);
	},
    initData:function(){
//        localStorageUtils.setData();
        localStorageUtils.getData(function(error,json){
            var data = JSON.parse(json);
            if(data && data.user_info){
                systemActions.receivedUserInfo(data.user_info);
                systemActions.receivedMySendInfo(data.my_send_info);
                systemActions.receivedMyMessage(data.my_message);
				systemActions.receivedProvinces(data.provinces);
				systemActions.receivedCategory(data.category);
            }
			helper.handleUserDataChange(data.user_info);
        });
    },

}