$(function(){
	var NetNTP;
	var pageTitle = lg.get("IDS_NETS_NetNTP");
	function SaveData() {
		var cfg = NetNTP[NetNTP.Name];
		cfg.Enable = $("#NtpEable").attr("data")*1 == 1 ? true : false;
		if ($("#ChoseAuto").attr("d") == "active") {
			cfg.TimeZone = 14;
		}else if ($("#ChoseCustom").attr("d") == "active") {
			cfg.TimeZone = 13;
		}
		cfg.Server.Name = $("#InputServerIP").val();
		cfg.Server.Port = $("#InputPort").val() *1;
		cfg.UpdatePeriod = $("#InputUpdatePeriod").val() *1;
		RfParamCall(function(a){
			ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
		}, pageTitle, "NetWork.NetNTP", -1, WSMsgID.WsMsgID_CONFIG_SET, NetNTP);
	}
	function ShowData(){
		var cfg = NetNTP[NetNTP.Name];
		if (cfg.Enable) {
			$("#NtpEable").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
		} else {
			$("#NtpEable").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
		}
		DivBox_Net("#NtpEable", "#NTPBox");
		if (cfg.TimeZone == 14) {
			$("#ChoseAuto").attr("d", "");
			$("#ChoseAuto").click();
		}else if (cfg.TimeZone == 13) {
			$("#ChoseCustom").attr("d", "");
			$("#ChoseCustom").click();
		}else {
			$("#RadioBox").css("display", "none");
		}
		$("#InputServerIP").val(cfg.Server.Name);
		$("#InputPort").val(cfg.Server.Port);
		$("#InputUpdatePeriod").val(cfg.UpdatePeriod);
		MasklayerHide();
	}
	function LoadConfig(){
		RfParamCall(function(a){
			NetNTP = a;
			ShowData();
		}, pageTitle, "NetWork.NetNTP", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	$(function(){
		$("#NtpEable").click(function() {
			if ($(this).attr("data") != "1") {
				$(this).removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			} else {
				$(this).removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			}
			DivBox_Net("#NtpEable", "#NTPBox");
		});
		$("#ChoseCustom, #ChoseAuto").click(function () {
			if ($(this).attr("d") != "active") {
				if ($(this).attr("id") == "ChoseCustom") {
					$("#Custom").css("height", "auto").css("display", "block");
				}
				else if ($(this).attr("id") == "ChoseAuto") {
					$("#Custom").css("display", "none");
				}
				$("#ChoseCustom, #ChoseAuto").attr("d", "");
				$(this).attr("d", "active");
				$(this).prop("checked", true);
			}
		});
		$("#NtpBtnSave").click(function(){
			SaveData();
		});
		$("#NtpBtnRf").click(function(){
			LoadConfig();
		});
		LoadConfig();
	});
});