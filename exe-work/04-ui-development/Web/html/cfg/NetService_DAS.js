$(function(){
	var NetDAS;
	var pageTitle = lg.get("IDS_NETS_NetDAS");
	function ShowData(){
		var cfg = NetDAS[NetDAS.Name];
		if (cfg.Enable) {
			$("#EnableSwitch").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
		}else {
			$("#EnableSwitch").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
		}
		DivBox_Net("#EnableSwitch", "#DASDivBox");
		$("#InputSerialNum").val(cfg.DeviceID);
		$("#InputServerName").val(cfg.ServerAddr);
		$("#InputSererPort").val(cfg.Port);
		$("#InputUserName").val(cfg.UserName);
		$("#InputPassword").val(cfg.Password);
		MasklayerHide();
	}
	function GetConfig(){
		RfParamCall(function(a){
			NetDAS = a;
			ShowData();
		}, pageTitle, "NetWork.DAS", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	$(function(){
		$("#EnableSwitch").click(function(){
			if ($(this).attr("data") == "0") {
				$(this).removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			}else {
				$(this).removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			}
			DivBox_Net("#EnableSwitch", "#DASDivBox");
		});
		$("#DASSV").click(function(){
			var cfg = NetDAS[NetDAS.Name];
			cfg.Enable = $("#EnableSwitch").attr("data") == "1" ? true : false;
			cfg.DeviceID = $("#InputSerialNum").val();
			cfg.ServerAddr = $("#InputServerName").val();
			cfg.Port = $("#InputSererPort").val() *1;
			cfg.UserName = $("#InputUserName").val();
			cfg.Password = $("#InputPassword").val();
			RfParamCall(function(a){
				if(a.Ret == 603){
					RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), true);
				}else {
					ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
				}
			}, pageTitle, "NetWork.DAS", -1, WSMsgID.WsMsgID_CONFIG_SET, NetDAS);
		});
		$("#DASRf").click(function(){
			GetConfig();
		});
		GetConfig();
	});
});