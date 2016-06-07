$(function() {
	$(".modal_close_btn").click(function(){
		$(this).parents('div.modal').modal("hide");
	});
})