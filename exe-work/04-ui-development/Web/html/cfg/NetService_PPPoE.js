$(function() {
	var NetPPPoE = {};
	var pageTitle = lg.get("IDS_NETS_NetPPPoE");
	function ShowData() {
		var cfg = NetPPPoE[NetPPPoE.Name];
		$("#Enable_Switch").attr("data", 1 - cfg.Enable * 1);
		$("#PPPOE_Name").val(cfg.Server.UserName);
		$("#PPPOE_PW").val(cfg.Server.Password);
		var ip = HexIpToDecIp(cfg.HostIP);
		$("#PPPOE_IPAddr").val(ip);
	
		InitButton();
		$("#Enable_Switch").click();
	}
	function GetConfig(){
		RfParamCall(function(a){
			NetPPPoE = a;
			ShowData();
			MasklayerHide();
		}, pageTitle, "NetWork.NetPPPoE", -1, WSMsgID.WsMsgID_CONFIG_GET);	
	}
	$(function() {
		ChangeBtnState();
		$("#Enable_Switch").click(function() {
			DivBox_Net("#Enable_Switch", "#NetPPPoEBox");
		});
		$("#PPPOESV").click(function() {
			var cfg = NetPPPoE[NetPPPoE.Name];
			cfg.Enable= $("#Enable_Switch").attr("data") * 1 ? true : false;
			cfg.Server.UserName = $("#PPPOE_Name").val();
			cfg.Server.Password = $("#PPPOE_PW").val();
			RfParamCall(function(a) {
				if(a.Ret == 603){
					RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), true);
				}else {
					ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
				}
			}, pageTitle, NetPPPoE.Name, -1, WSMsgID.WsMsgID_CONFIG_SET, NetPPPoE);
		});
		$("#PPPOERf").click(function(){
			GetConfig();
		});
		
		GetConfig();
	});
});