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
	}
}