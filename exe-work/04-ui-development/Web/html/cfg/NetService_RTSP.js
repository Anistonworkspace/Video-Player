$(function(){
	var RTSP;
	var NetComm;
	var NetOnvif;
	var bChangeOnvifPort = GetFunAbility(gDevice.Ability.OtherFunction.SuppportChangeOnvifPort);
	var pageTitle = lg.get("IDS_NETS_NetRTSP");
	function ShowData() {
		var cfg = RTSP[RTSP.Name];
		if (cfg.IsServer) {
			$("#SwitchEnable").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
		} else {
			$("#SwitchEnable").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
		}
		DivBox_Net("#SwitchEnable", "#PortBox");
		$("#InputPort").val(cfg.Server.Port);
		MasklayerHide();
	}
	function CheckPort() {
		var rtspPort = $("#InputPort").val() *1;
		var arrPort = [0, 0, 0];
		arrPort[0] = NetComm[NetComm.Name].TCPPort;
		arrPort[1] = NetComm[NetComm.Name].HttpPort;
		if (bChangeOnvifPort) {
			arrPort[2] = NetOnvif[NetOnvif.Name].Port;
		}
		var i;
		for(i=0; i < 3; i++) {
			if (!bChangeOnvifPort &&(i == 2)){
				continue;
			}
			if (rtspPort == 34568 || rtspPort == 34569 || rtspPort == 34570 ){
				ShowPaop(pageTitle, lg.get("IDS_NETW_PortConflict"));
				return false;
			}
			if (arrPort[i] == rtspPort) {
				ShowPaop(pageTitle, lg.get("IDS_NETW_PortConflict"));
				return false;
			}
		}

		return true;
	}
	function SaveData() {
		if (!CheckPort()) {
			return;
		}
		var cfg = RTSP[RTSP.Name];
		cfg.IsServer = $("#SwitchEnable").attr("data")*1 == 1 ? true : false;
		cfg.Server.Port = $("#InputPort").val() *1;
		RfParamCall(function(a){
			if(a.Ret == 603){
				RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), true);
			}else {
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}
		}, pageTitle, "NetWork.RTSP", -1, WSMsgID.WsMsgID_CONFIG_SET, RTSP);
	} 
	function LoadConfig(){
		RfParamCall(function(a){
			RTSP = a;
			RfParamCall(function(a){
				NetComm = a;
				if (bChangeOnvifPort) {
					RfParamCall(function(a){
						NetOnvif = a;
						ShowData();
					}, pageTitle, "OEMcfg.Correspondent", -1, WSMsgID.WsMsgID_CONFIG_GET);
				}else {
					ShowData();
				}
			}, pageTitle, "NetWork.NetCommon", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}, pageTitle, "NetWork.RTSP", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	$(function(){
		$("#SwitchEnable").click(function(){
			if ($(this).attr("data") != "1") {
				$(this).removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			} else {
				$(this).removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			}
			DivBox_Net("#SwitchEnable", "#PortBox");
		});
		$("#BtnSave").click(function(){
			SaveData();
		});
		$("#BtnRf").click(function(){
			LoadConfig();
		});
		LoadConfig();
	});
});