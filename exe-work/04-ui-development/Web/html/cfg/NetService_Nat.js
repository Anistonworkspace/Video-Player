$(function() {
	var Nat = {};
	var ExtApp = {};
	var pageTitle = lg.get("IDS_NETS_NetNat");
	var bSupportCRedDisExtApp = false;
	function ShowData() {
		var cfg = Nat[Nat.Name];
		var a = cfg.NatEnable?1:0;
		$("#Enable_Switch").attr("data", a);
		$("#MTU").val(cfg.XMeyeMTU);
		if(bSupportCRedDisExtApp){
			var curDevIp = gDevice.ip;
			var isIPv6 = curDevIp.indexOf("[") == -1 ? false : true;
			if(isIPv6 && g_BrowseType == BrowseType.BrowseMSIE){	 	// UNC 和 IPV6Address兼容 (IEQuestion)
				var st = curDevIp.indexOf("[");
				var ed = curDevIp.indexOf("]");
				var temp = curDevIp.substr(st + 1, ed - 1);
				temp = temp.split(':').join('-');
				curDevIp = temp + ".ipv6-literal.net";
			}
			$("#IPEYE_Link").html(lg.get("IDS_NAT_IPEYE_Link") + '<a href="http://' + 
				curDevIp + ':8282" id="IPEYE_Link_Url" target="_blank">' + 'http://' + curDevIp + ':8282</a>');
		}

		InitButton();
		DivBox_Net("#Enable_Switch", "#CloudDivBox");
	}
	function GetConfig(){
		RfParamCall(function(a){
			Nat = a;
			RfParamCall(function(b){
				if(b.Ret == 100){
					$("#IPEYE_Div").css("display", "");
					bSupportCRedDisExtApp = true;
				}else{
					$("#IPEYE_Div").css("display", "none");
					bSupportCRedDisExtApp = false;
				}
				ShowData();
				MasklayerHide();
			}, pageTitle, "Custom.CRedDisExtApp", -1, WSMsgID.WsMsgID_CONFIG_GET, null, true);
		}, pageTitle, "NetWork.Nat", -1, WSMsgID.WsMsgID_CONFIG_GET);	
	}
	$(function() {
		ChangeBtnState();
		$("#NatRf").click(function() {
			GetConfig();
		});
		$("#Enable_Switch").click(function() {
			DivBox_Net("#Enable_Switch", "#CloudDivBox");
		});
		$("#NatSV").click(function() {
			var cfg = Nat[Nat.Name];
			cfg.NatEnable = $("#Enable_Switch").attr("data") * 1 ? true : false;
			cfg.XMeyeMTU = $("#MTU").val() * 1;
			RfParamCall(function(a) {
				if(a.Ret == 603){
					RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), true);
				}else {
					ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
				}
			}, pageTitle, Nat.Name, -1, WSMsgID.WsMsgID_CONFIG_SET, Nat);
		});
		
		GetConfig();
	});
});