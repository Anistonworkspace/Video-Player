$(function() {
	var Net3G = {};
	var pageTitle = lg.get("IDS_NETS_Net3G");
	function Which3GEx(bef) {
		switch (bef) {
			case "TD_SCDMA" :
				return 0;
			case "WCDMA" :
				return 1;
			case "CDMA_1X" :
				return 2;
			case "EDGE" :
				return 3;
			case "EVDO" :
				return 4;
			case "4G":
				return 5;
			default :
				return 0;
		}
	}
	function ShowData() {
		var cfg = Net3G[Net3G.Name];
		$("#Enable_Switch").attr("data", 1 - cfg.Enable * 1);
		$("#NetType").val(Which3GEx(cfg.NetType));
		$("#APN").val(cfg.APN)
		$("#DialNum").val(cfg.DialNum);
		$("#Net3G_Name").val(cfg.UserName);
		$("#Net3G_PW").val(cfg.Password);
		var ip = HexIpToDecIp(cfg.DialIP);
		$("#Net3G_IPAddr").val(ip);

		InitButton();
		MasklayerHide();
		$("#Enable_Switch").click();
	}
	function GetConfig(){
		RfParamCall(function(a){
			Net3G = a;
			ShowData();
		}, pageTitle, "NetWork.Net3G", -1, WSMsgID.WsMsgID_CONFIG_GET);	
	}
	$(function() {
		if(GetFunAbility(gDevice.Ability.NetServerFunction.Net4G)){
			$("#NetType").append('<option value="5">4G</option>');
		}
		ChangeBtnState();
		$("#Enable_Switch").click(function() {
			DivBox_Net("#Enable_Switch", "#Net3GDivBox");
		});
		$("#NetType").change(function(){
			var type = $(this).val() * 1;
			switch(type){
			case 0://TD_SCDMA
				$("#APN").val("CMNET");
				$("#DialNum").val("*99#");
				break;
			case 1://WCDMA
				$("#APN").val("3GNET");
				$("#DialNum").val("*99#");
				break;
			case 2://CDMA_1X
				$("#APN").val("ChinaNet");
				$("#DialNum").val("#777");
				break;
			case 3://EDGE
				$("#APN").val("CMNET");
				$("#DialNum").val("*99#");
				break;
			case 4://EVDO
				$("#APN").val("ChinaNet");
				$("#DialNum").val("#777");
				break;
			case 5://4G
				$("#APN").val("");
				$("#DialNum").val("");
				break;
			default:
				break;
			}
		});
		$("#Net3GRf").click(function() {
			GetConfig();
		});
		$("#Net3GSV").click(function() {
			var cfg = Net3G[Net3G.Name];
			cfg.Enable = $("#Enable_Switch").attr("data") * 1 ? true : false;
			var net = $("#NetType").val() * 1;
			if (net == 2) {
				cfg.NetType = "CDMA_1X";
			} else {
				cfg.NetType = $("#NetType").find("option:selected").text();
			}
			cfg.APN = $("#APN").val();
			cfg.DialNum = $("#DialNum").val();
			cfg.UserName = $("#Net3G_Name").val();
			cfg.Password = $("#Net3G_PW").val();
			RfParamCall(function(a) {
				if(a.Ret == 603){
					RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), true);
				}else {
					ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
				}
			}, pageTitle, Net3G.Name, -1, WSMsgID.WsMsgID_CONFIG_SET, Net3G);
		});
		GetConfig();
	});
});