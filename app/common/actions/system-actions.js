var SystemDispatcher = require('../dispatcher/system-dispatcher');
var SystemConstants = require('../constants/system-constants');

var ActionTypes = SystemConstants.ActionTypes;

module.exports = {
    receivedMySendInfo:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.RECEIVED_MY_SEND_INFO,
            data:data
        })
    },
    receivedMyMessage:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.RECEIVED_MY_MESSAGE,
            data:data
        })
    },
    receivedUserInfo:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.RECEIVED_USER_INFO,
            data:data
        })
    },
    postedUserLoginForm:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.POSTED_USER_LOGIN_FORM,
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
	postedSendCarryForm:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.POSTED_SEND_CARRY_FORM,
            data:data
        })
	},
	postedSendShipForm:function(data){
        SystemDispatcher.dispatch({
            type:ActionTypes.POSTED_SEND_SHIP_FORM,
            data:data
        })
	}
}