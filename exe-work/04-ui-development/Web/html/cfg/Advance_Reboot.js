$(function() {
	var pageTitle = $("#Advance_Reboot").text();
	$(function(){
		$("#RebootBtn").click(function(){
			RebootDev(pageTitle, lg.get("IDS_REBOOT_Tip"), true);
		});
		MasklayerHide();
	});
});
