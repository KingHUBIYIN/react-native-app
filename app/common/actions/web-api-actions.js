var SystemDispatcher = require('../dispatcher/system-dispatcher');
var WebAPIUtils = require('../utils/web-api-utils');

module.exports = {
	userLogout:function(formData){
		WebAPIUtils.userLogout(formData);
	},
	userLogin:function(formData){
		WebAPIUtils.userLogin(formData);
	},
	getStudentInfo:function(formData){
		WebAPIUtils.getStudentInfo(formData);
	},
	postUserNewPassword:function(formData){
		WebAPIUtils.postUserNewPassword(formData);
	},
	postUserFeedback:function(formData){
		WebAPIUtils.postUserFeedback(formData);
	},
    //获取试卷列表
    getAllData:function(formData){
        WebAPIUtils.getAllData(formData);
    },
    //获取meta信息
    getStudentMeta:function(formData){
         WebAPIUtils.getStudentMeta(formData);
    }
}