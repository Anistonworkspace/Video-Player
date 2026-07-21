//# sourceURL=NetService_RTMP.js
$(function () {
	var RTMPCfg = {};
	var pageTitle = "RTMP";
	function ShowData() {
		var cfg = RTMPCfg[RTMPCfg.Name];
		$('#ServerAddress').val(cfg.Directory);
        $('#rtmpSelStreamType').val(cfg.StreamType);
		if(cfg.Enable){
			$("#RTMPSwitch").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
		}else{
			$("#RTMPSwitch").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
		}
        DivBox_Net("#RTMPSwitch", "#DirectoryBox");
        DivBox_Net("#RTMPSwitch", "#rtmpStreamTypeBox");
	}
	function GetConfig(){
		RfParamCall(function(a){
			RTMPCfg = a;
			ShowData();
			MasklayerHide();
		}, pageTitle, "NetWork.RTMP", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	
	$(function () {
        $("#rtmpSelStreamType").empty();
		$("#rtmpSelStreamType").append('<option value="0">'+ lg.get("IDS_MAINSTREAM") +'</option>');
		$("#rtmpSelStreamType").append('<option value="1">'+ lg.get("IDS_SUBSTREAM") +'</option>');

		$("#RTMPSwitch").click(function(){
			if ($(this).attr("data") == "0") {
				$(this).removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			} else {
				$(this).removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			}
			DivBox_Net("#RTMPSwitch", "#DirectoryBox");
            DivBox_Net("#RTMPSwitch", "#rtmpStreamTypeBox");
		});
		$("#RTMPSV").click(function () {
			RTMPCfg[RTMPCfg.Name].Enable = $("#RTMPSwitch").attr("data") * 1 ? true : false;
			RTMPCfg[RTMPCfg.Name].Directory = $('#ServerAddress').val();
            RTMPCfg[RTMPCfg.Name].StreamType = $('#rtmpSelStreamType').val()*1;
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "NetWork.RTMP", -1, WSMsgID.WsMsgID_CONFIG_SET, RTMPCfg);
		});
		$("#RTMPRf").click(function () {
			GetConfig();
		});
		GetConfig();
	});
});