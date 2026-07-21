$(function () {
	var UpnpCfg = {};
	var pageTitle = lg.get("IDS_NETS_NetUPNP");
	function ShowData() {
		var cfg = UpnpCfg[UpnpCfg.Name];
		if(cfg.Enable && cfg.State){
			$('#HTTPPort').val(cfg.HTTPPort);
			$('#TCPPort').val(cfg.MediaPort);
			$('#PhonePort').val(cfg.MobilePort);
		}else {
			$('#HTTPPort').val(0);
			$('#TCPPort').val(0);
			$('#PhonePort').val(0);
		}	
		$("#UpnpSwitch").attr("data", cfg.Enable * 1);
		$('#HTTPPort').prop("disabled", true);
		$('#TCPPort').prop("disabled", true);
		$('#PhonePort').prop("disabled", true);	
		InitButton();
	}
	function GetConfig(){
		RfParamCall(function(a){
			UpnpCfg = a;
			ShowData();
			MasklayerHide();
		}, pageTitle, "NetWork.Upnp", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	$(function () {
		ChangeBtnState();
		$("#UpnpSV").click(function () {
			UpnpCfg[UpnpCfg.Name].Enable = $("#UpnpSwitch").attr("data") * 1 ? true : false;
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "NetWork.Upnp", -1, WSMsgID.WsMsgID_CONFIG_SET, UpnpCfg);
		});
		$("#UpnpRf").click(function () {
			GetConfig();
		});
		GetConfig();
	});
});