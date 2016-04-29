var SystemDispatcher = require('../dispatcher/system-dispatcher');
var SystemConstants = require('../constants/system-constants');

var ActionTypes = SystemConstants.ActionTypes;

module.exports = {
	receivedErrorMsg:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.RECEIVED_ERROR_MSG,
            data:data
        })
    },
    receivedUserInfo:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.RECEIVED_USER_INFO,
            data:data
        })
    },
    receivedStudentInfo:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.RECEIVED_STUDENT_INFO,
            data:data
        })
    },
    postedUserLoginForm:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.POSTED_USER_LOGIN_FORM,
            data:data
        })
    },
	postedUserNewPassword:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.POSTED_USER_NEW_PASSWORD,
            data:data
        })
	},
	postedUserFeedback:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.POSTED_USER_FEEDBACK,
            data:data
        })
	},
	receivedProvinces:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.RECEIVED_PROVINCES,
            data:data
        })
	},
    changedAddressForm:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.CHANGED_ADDRESS_FORM,
            data:data
        })
    },
	receivedCategory:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.RECEIVED_CATEGORY,
            data:data
        })
	},
	changedCategoryForm:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.CHANGED_CATEGORY_FORM,
            data:data
        })
	},
	changedDatePickerForm:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.CHANGED_DATE_PICKER_FORM,
            data:data
        })
	},

}