$(function(){
	var NetARSP;
	var pageTitle = lg.get("IDS_NETS_NetARSP");
	var arrKeyIndex = [];
	var nCurSel = -1;
	function ShowSelData() {
		var cfg = NetARSP[NetARSP.Name][nCurSel];
		if (cfg.Enable) {
			$("#SwitchEnable").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
		} else {
			$("#SwitchEnable").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
		}
		DivBox_Net("#SwitchEnable", "#CfgBox");
		
		$("#InputServerName").val(cfg.Server.Name);
		$("#InputPort").val(cfg.Server.Port);
		$("#InputUpdatePreiod").val(cfg.Interval);
		$("#InputUserName").val(cfg.Server.UserName);
		$("#InputPassword").val(cfg.Server.Password);
	}
	function UpdateDDNSType() {
		var cfg = NetARSP[NetARSP.Name];
		arrKeyIndex = [];
		$("#SelDDNSType").empty();
		for (var i=0; i < cfg.length; i++) {
			if (cfg[i].ARSPKey != "None") {
				var strKeyName = cfg[i].ARSPKey;
				if (cfg[i].ARSPKey == "NanRui") {
					strKeyName = "IPServer";
				}
				arrKeyIndex.push(i);
				$("#SelDDNSType").append('<option value="'+i+'">'+strKeyName+'</option>');
			}
		}
		if (arrKeyIndex.length > 0) {
			nCurSel = arrKeyIndex[0];
			ShowSelData();
		}
		MasklayerHide();
	}
	function LoadConfig() {
		RfParamCall(function(a){
			NetARSP = a;
			UpdateDDNSType();
		}, pageTitle, "NetWork.NetARSP", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	function SaveSelData() {
		var cfg = NetARSP[NetARSP.Name][nCurSel];
		cfg.Enable = $("#SwitchEnable").attr("data") *1 == 1 ? true :false;
		cfg.Server.Name = $("#InputServerName").val();
		cfg.Server.Port = $("#InputPort").val() *1;
		cfg.Interval = $("#InputUpdatePreiod").val() *1;
		cfg.Server.UserName = $("#InputUserName").val();
		cfg.Server.Password = $("#InputPassword").val();
	}
	$(function(){
		$("#SelDDNSType").change(function(){
			var nSel = $(this).val() *1;
			if (nSel != nCurSel) {
				SaveCurSel();
				nCurSel = nSel;
				ShowSelData();
			}
		});
		$("#SwitchEnable").click(function(){
			if ($(this).attr("data") != "1") {
				$(this).removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			} else {
				$(this).removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			}
			DivBox_Net("#SwitchEnable", "#CfgBox");
		});
		$("#BtnSave").click(function(){
			SaveSelData();
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "NetWork.NetARSP", -1, WSMsgID.WsMsgID_CONFIG_SET, NetARSP);
		});
		$("#BtnRf").click(function(){
			LoadConfig();
		});
		LoadConfig();
	});
});