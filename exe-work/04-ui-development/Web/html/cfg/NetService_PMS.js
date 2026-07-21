$(function(){
	var NetPMS;
	var NetInfoNum;
	var bSupport = false;
	var pageTitle;
	var bSupportNetMPSV2 = GetFunAbility(gDevice.Ability.NetServerFunction.NetPMSV2);
	function ShowData() {
		var cfg = NetPMS[NetPMS.Name];
		if (cfg.Enable) {
			$("#SwitchEnable").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
		}else {
			$("#SwitchEnable").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
		}
		DivBox_Net("#SwitchEnable", "#CfgBox");
		$("#InputServerName").val(cfg.ServName);
		$("#InputHostPort").val(cfg.Port);
		$("#InputBoxID").val(cfg.BoxID);
		if (bSupport) {
			var Info = NetInfoNum[NetInfoNum.Name];
			var AbilityPram = parseInt(Info.AbilityPram);	//Info.AbilityPram
			var nNum = 0;
			for (var i=0; i < 32; i++) {
				if (AbilityPram & (0x01 << i)) {
					nNum++;
				}
			}
			Notes_MaxSub.innerHTML = lg.get("IDS_PMS_MaxSub") + nNum;
			$("#InfoNum").css("display", "");
		}
		if (bSupportNetMPSV2) {
			$("#CfgBox").css("display", "none");
			$("#InfoNum").css("display", "none");
			$("#BtnClear").css("display", "none");
		}
	}
	function LoadConfig() {
		RfParamCall(function(a){
			NetPMS = a;
			RfParamCall(function(a){
				if (a.Ret == 100) {
					NetInfoNum = a;
					bSupport = true;
				}else {
					bSupport = false;
				}
				ShowData();
				MasklayerHide();
			},pageTitle, "PMS.num", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}, pageTitle, "NetWork.PMS", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	$(function(){
		if (bSupportNetMPSV2) {
			pageTitle = lg.get("IDS_NETS_NetPMSV2");
		}else {
			pageTitle = lg.get("IDS_NETS_NetPMS");
		}
		$("#SwitchEnable").click(function(){
			if ($(this).attr("data") == "0") {
				$(this).removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			}else {
				$(this).removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			}
			DivBox_Net("#SwitchEnable", "#CfgBox");
		});
		$("#BtnClear").click(function(){
			LoadConfig();
			var Info = NetInfoNum[NetInfoNum.Name];
			Info.AbilityPram = "0x00000000";
			RfParamCall(function(a){
			Notes_MaxSub.innerHTML = lg.get("IDS_PMS_MaxSub") + "0";
			}, pageTitle, "PMS.num", -1, WSMsgID.WsMsgID_CONFIG_SET, NetInfoNum);
		});
		$("#BtnSave").click(function(){
			var cfg = NetPMS[NetPMS.Name];
			cfg.Enable = $("#SwitchEnable").attr("data") * 1 ? true :false;
			cfg.ServName = $("#InputServerName").val();
			cfg.Port = $("#InputHostPort").val() *1;
			cfg.BoxID = $("#InputBoxID").val();
			
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "NetWork.PMS", -1, WSMsgID.WsMsgID_CONFIG_SET, NetPMS);
		});
		$("#BtnRf").click(function(){
			LoadConfig();
		});
		LoadConfig();
	});
});