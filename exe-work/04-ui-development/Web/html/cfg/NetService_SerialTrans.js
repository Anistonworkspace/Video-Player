$(function(){
	var NetSerialApp;
	var pageTitle = lg.get("IDS_NETS_TransFunction");
	function ShowData() {
		var cfg = NetSerialApp[NetSerialApp.Name];
		if (cfg.bEnable) {
			$("#SwitchEnable").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
		}else {
			$("#SwitchEnable").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
		}
		DivBox_Net("#SwitchEnable", "#CfgBox");
		$("#SelCommFunc").val(cfg.SerialType);
		$("#SelProtoType").val(cfg.ServerType);
		$("#InputServerName").val(cfg.ServerAddr);
		$("#InputHostPort").val(cfg.ServerPort);
	}
	function LoadConfig() {
		RfParamCall(function(a){
			NetSerialApp = a;
			ShowData();
			MasklayerHide();
		}, pageTitle, "NetWork.TranCommData", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	$(function(){
		$("#SwitchEnable").click(function(){
			if ($(this).attr("data") == "0") {
				$("#SwitchEnable").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			}else {
				$("#SwitchEnable").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			}
			DivBox_Net("#SwitchEnable", "#CfgBox");
		});
		$("#BtnSave").click(function(){
			var cfg = NetSerialApp[NetSerialApp.Name];
			cfg.bEnable = $("#SwitchEnable").attr("data") *1 == 1 ? true : false;
			cfg.SerialType = $("#SelCommFunc").val() *1;
			cfg.ServerType = $("#SelProtoType").val() *1;
			cfg.ServerAddr = $("#InputServerName").val();
			cfg.ServerPort = $("#InputHostPort").val() *1;
			
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "NetWork.TranCommData", -1, WSMsgID.WsMsgID_CONFIG_SET, NetSerialApp);
		 });
		 $("#BtnRf").click(function(){
			LoadConfig();
		});
		LoadConfig();
	});
});