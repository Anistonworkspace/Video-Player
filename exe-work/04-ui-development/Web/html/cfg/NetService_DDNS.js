//# sourceURL=NetService_DDNS.js
$(function() {
	var DDNSFunc = [];
	var NetDDNS = {};
	var pageTitle = lg.get("IDS_NETS_NetDDNS");
	var LastIndex = 0;
	var Suffix = ["", ".swanndvr.net"];
	function ShowSelData() {
		var cfg = NetDDNS[NetDDNS.Name][LastIndex];
		var sHostname = cfg.HostName;
		var sHostNameText = Suffix[0];
		if ("SWANNDVR" == cfg.DDNSKey) {
			if (sHostname.indexOf(Suffix[1]) != -1) {
				sHostname = sHostname.substr(0, sHostname.length - Suffix[1].length);
			}
			sHostNameText = Suffix[1];
		}
		$("#DDNSHostName").val(sHostname);
		$("#HOST_NAME_TEXT").prop("innerText", sHostNameText);

		$("#DDNSUserName").val(cfg.Server.UserName);
		$("#DDNSUserPW").val(cfg.Server.Password);
		$("#DDNSEnable").attr("data", cfg.Enable ? 1 : 0);
		DivBox_Net("#DDNSEnable", "#DDNSDivBox");
		DivBox_Net("#DDNSEnable", "#DDNSTest_box");
		InitButton();
		MasklayerHide();
	}
	function ShowData() {
		$("#DDNSType").empty();
		LastIndex = 0;
		for (var i=0; i < DDNSFunc.length; i++) {
			// 福克斯子客户定制
			if(typeof g_customDDNSType == "number" && g_customDDNSType)
			{
				if(DDNSFunc[i] == "CN99" || DDNSFunc[i] == "Oray" || DDNSFunc[i] == "MYQ-SEE")
					continue;
			}
			$("#DDNSType").append('<option value="'+ i +'">'+ DDNSFunc[i] +'</option>');
			// Faire定制
			if(typeof g_FaireDefaultDDNS == "number" && g_FaireDefaultDDNS)
			{
				if(DDNSFunc[i] == "DynDns")
				{
					LastIndex = i;
				}
			}
		}
		var cfg = NetDDNS[NetDDNS.Name];
		// 福克斯子客户定制
		if(typeof g_customDDNSType == "number" && g_customDDNSType)
		{
			$("#DDNSType")[0].selectedIndex = 0;
		}
		else{
			$("#DDNSType")[0].selectedIndex = DDNSFunc.indexOf(cfg[LastIndex].DDNSKey);
		}
		
		ShowSelData();
	}
	function SaveLastSelData() {
		var cfg = NetDDNS[NetDDNS.Name][LastIndex];
		cfg.Enable = $("#DDNSEnable").attr("data") *1?true:false;
		if ("SWANNDVR" == cfg.DDNSKey) {
			cfg.HostName = $("#DDNSHostName").val() + Suffix[1];
		}else {
			cfg.HostName = $("#DDNSHostName").val() + Suffix[0];
		}
		cfg.Server.UserName = $("#DDNSUserName").val();
		cfg.Server.Password = $("#DDNSUserPW").val();
	}
	function LoadConfig() {
		RfParamCall(function(a){
			DDNSFunc = a[a.Name];
			RfParamCall(function(a){
				NetDDNS = a;
				ShowData();
			}, pageTitle, "NetWork.NetDDNS", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}, pageTitle, "DDNSService", -1,WSMsgID.WsMsgID_ABILITY_GET);
	}
	$(function(){
		if (!GetFunAbility(gDevice.Ability.OtherFunction.SupportDDNSTest)) {
			$("#DDNSTest_box").css("display", "none");
		}
		ChangeBtnState();
		$("#DDNSType").change(function() {
			SaveLastSelData();
			var sel = $(this).val() * 1;
			var cfg = NetDDNS[NetDDNS.Name];
			for (var i=0; i < cfg.length; i++) {
				if (DDNSFunc[sel] == cfg[i].DDNSKey) {
					LastIndex = i;
					break;
				}
			}
			ShowSelData();
		});
		$("#DDNSEnable").click(function () {
			DivBox_Net("#DDNSEnable", "#DDNSDivBox");
			DivBox_Net("#DDNSEnable", "#DDNSTest_box");
		});
		$("#DDNSSave").click(function() {
			SaveLastSelData();
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, NetDDNS.Name,-1, WSMsgID.WsMsgID_CONFIG_SET, NetDDNS);
		});
		$("#DDNSRf").click(function(){
			LoadConfig();
		});
		$("#DDNSTest").click(function() {
			SaveLastSelData();
			DDNSTest.innerHTML = lg.get("IDS_EMAILTESTING");
			$("#DDNSTest").prop("disabled", true);
			var data = {
				"Name":"OPDDNSTest",
				"OPDDNSTest":NetDDNS[NetDDNS.Name][LastIndex]
			};
			RfParamCall(function(a) {
				DDNSTest.innerHTML = lg.get("IDS_DDNSTEST");
				$("#DDNSTest").prop("disabled", false);
				if (a.Ret == 100){
					ShowPaop(pageTitle, lg.get("IDS_DDNSTEST_SUC"));
				} else if (a.Ret == 101){	//服务器Offline或连接失败
					ShowPaop(pageTitle, lg.get("IDS_DDNSTEST_CONNECT_ERR"));
				} else if (a.Ret == 106){	//AuthorityParity失败
					ShowPaop(pageTitle, lg.get("IDS_DDNSTEST_PERMISSION_CHECK_ERR"));
				} else {					//108, 超Hour，UnknownError
					ShowPaop(pageTitle, lg.get("IDS_UNKNOWN_ERR"));
				}
			}, pageTitle, "OPDDNSTest", -1, cgiCmd.opcontrol, data);
		})
		
		LoadConfig();
	});
});