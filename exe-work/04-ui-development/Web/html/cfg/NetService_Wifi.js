//# sourceURL=NetService_Wifi.js
$(function(){
	var NetDHCP;
	var NetWIFI;
	var NetWifiAP;
	var bDhcpVisible = false;
	var pageTitle = lg.get("IDS_NETS_NetWifi");
	function OnDoublieClick(data) {
		var cfg = NetWIFI[NetWIFI.Name];
		$("#InputSSID").val(data.SSID);
		$("#InputEncrypType").val(data.EncrypType);
		if (data.EncrypType != "WEP") {
			$("#SelKeyType").val(1);
			$("#KeyTypeBox").css("display", "none");
		}else {
			$("#SelKeyType").val(0);
			$("#KeyTypeBox").css("display", "");
		}
		cfg.Auth = data.Auth;
		cfg.NetType = data.NetType;
	}
	function ShowWifiList() {
		if (!isObject(NetWifiAP)) {
			return;
		}
		var RSSI = {
			"NoSingnal":"IDS_WIFI_Singal_NoSingnal",
			"VeryLow":"IDS_WIFI_Singal_VeryLow",
			"Low":"IDS_WIFI_Singal_Low",
			"Good":"IDS_WIFI_Singal_Good",
			"VeryGood":"IDS_WIFI_Singal_VeryGood",
			"Excellent":"IDS_WIFI_Singal_Excellent"
		};
		var WifiList;
		var rowNum = 0;
		var cfg = NetWifiAP[NetWifiAP.Name];
		if (cfg.Numbers != 0) {
			WifiList = cfg.WifiAP;
			rowNum = WifiList.length;
		}
		var table = $("#WifiTable")[0];
		var nClearRow = table.rows.length;
		var i;
		for (i = 0; i < nClearRow; ++i) {
			table.deleteRow(0);
		}
		for (i = 0; i < rowNum; ++i) {
			var tr = table.insertRow(i);
			tr.classList.add("CustomWifiClass");
			tr.value = i;
			var td1 = tr.insertCell(0);
			var td2 = tr.insertCell(1);
			var td3 = tr.insertCell(2);
			td1.innerHTML = toHtmlEncode(WifiList[i].SSID);
			td2.innerHTML = lg.get(RSSI[WifiList[i].RSSI]);
			td3.innerHTML = toHtmlEncode(WifiList[i].Auth);
		}
		var nHeight = $("#WifiList .table-responsive").height()-$("#WifiList .table-head").height();
		var nHeadPadding = 0;
		if(rowNum * 30 > nHeight){
			nHeadPadding = TableRightPadding;
		}
		$("#WifiList .table-head").css("padding-right", nHeadPadding+"px");
		$("#WifiList .table-content").css("height", nHeight+'px');
		$(".CustomWifiClass").dblclick(function(){
			var nIndex = $(this).prop("value") *1;
			OnDoublieClick(WifiList[nIndex]);
		})
	}
	function UpdateKeyType() {
		$("#SelKeyType").empty();
		$("#SelKeyType").append('<option value="0">'+ lg.get("IDS_WIFI_Hex") +'</option>');
		$("#SelKeyType").append('<option value="1">'+ lg.get("IDS_WIFI_ASCII") +'</option>');
	}
	function ShowData() {
		var cfg = NetWIFI[NetWIFI.Name];
		if (cfg.Enable) {
			$("#SwitchEnable").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			$("#SwitchDHCP").css("pointer-events","all");
			
		}else {
			$("#SwitchEnable").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			$("#SwitchDHCP").css("pointer-events","none");
		}
		DivBox_Net("#SwitchEnable", "#CfgBox");
		$("#InputSSID").val(cfg.SSID);
		$("#InputPassword").val(cfg.Keys);
		$("#InputIpAddress").val(HexIpToDecIp(cfg.HostIP));
		$("#InputSubnetMask").val(HexIpToDecIp(cfg.Submask));
		$("#InputGateway").val(HexIpToDecIp(cfg.GateWay));
		UpdateKeyType();
		$("#InputEncrypType").val(cfg.EncrypType);
		if (cfg.EncrypType != "WEP") {
			$("#SelKeyType").val(1);
			$("#KeyTypeBox").css("display", "none");
		}else {
			$("#SelKeyType").val(cfg.KeyType);
			$("#KeyTypeBox").css("display", "");
		}
		if (!bDhcpVisible) {
			$("#DHCPBox").css("display", "none");
		}else {
			var DhcpCfg = NetDHCP[NetDHCP.Name];
			if (DhcpCfg[2].Enable) {
				$("#SwitchDHCP").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			}else {
				$("#SwitchDHCP").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			}
			if (cfg.Enable) {
				if (DhcpCfg[2].Enable) {
					DivBox(0, "#DhcpCtrlBox");
				}else {
					DivBox(1, "#DhcpCtrlBox");
				}
			}
		}
		MasklayerHide();
	}
	function LoadConfig() {
		if (bDhcpVisible) {
			RfParamCall(function(a){
				NetDHCP = a;
				RfParamCall(function(a){
					NetWIFI = a;
					ShowData()
				}, pageTitle, "NetWork.Wifi", -1, WSMsgID.WsMsgID_CONFIG_GET);
			}, pageTitle, "NetWork.NetDHCP", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}else {
			RfParamCall(function(a){
				NetWIFI = a;
				ShowData()
			}, pageTitle, "NetWork.Wifi", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}
	}
	$(function(){
		var BuildTime = gDevice.loginRsp.BuildTime;
		var Time = new Date(Date.parse(BuildTime.split(" ")[0]));
		var OkTime = new Date(Date.parse("2012-06-22")); //设备那端这个时间之后的才支持wifi的dhcp
		if (Time > OkTime) {
			bDhcpVisible = true;	
		}
		$("#SwitchEnable").click(function() {
			if ($(this).attr("data") == "0") {
				$(this).removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
				$("#SwitchDHCP").css("pointer-events","all");
			}else {
				$(this).removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
				$("#SwitchDHCP").css("pointer-events","none");
			}
			DivBox_Net("#SwitchEnable", "#CfgBox");
			if ($(this).attr("data") == "1" && bDhcpVisible) {
				var nData = $("#SwitchDHCP").attr("data") *1;
				DivBox(1-nData, "#DhcpCtrlBox");
			}
		});
		$("#SwitchDHCP").click(function(){
			if ($(this).attr("data") == "0") {
				$(this).removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			}else {
				$(this).removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			}
			var nData = $(this).attr("data") *1;
			if ($("#SwitchEnable").attr("data") == "1") {
				DivBox(1-nData, "#DhcpCtrlBox");
			}
		});
		$("#BtnSreach").click(function(){
			RfParamCall(function(a){
				NetWifiAP = a;
				ShowWifiList();
				MasklayerHide();
			}, pageTitle, "WifiAP", -1, WSMsgID.WsMsgID_SYSINFO_REQ);
		});
		$("#BtnSave").click(function(){
			var cfg = NetWIFI[NetWIFI.Name];
			cfg.SSID = $("#InputSSID").val();
			cfg.Enable = $("#SwitchEnable").attr("data") *1 == 1 ? true : false;
			cfg.Keys = $("#InputPassword").val();
			cfg.HostIP = DecIpToHexIp($("#InputIpAddress").val());
			cfg.Submask = DecIpToHexIp($("#InputSubnetMask").val());
			cfg.GateWay = DecIpToHexIp($("#InputGateway").val());
			cfg.EncrypType = $("#InputEncrypType").val();
			cfg.KeyType = $("#SelKeyType").val() *1;
			var bNeedReboot=false;

			if(bDhcpVisible){
				var DhcpCfg = NetDHCP[NetDHCP.Name];
				DhcpCfg[2].Enable = $("#SwitchDHCP").attr("data") *1 == 1 ? true : false;
				RfParamCall(function (a) {
					if(a.Ret == 603){
						bNeedReboot=true;
					}
					RfParamCall(function(a) {
						if(a.Ret == 603){
							bNeedReboot=true;
						}
						if(bNeedReboot){
							RebootDev(pageTitle,lg.get("IDS_WIFI_SAVE_REBOOT"),false);
						}else{
							ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
						}
					}, pageTitle, "NetWork.Wifi", -1, WSMsgID.WsMsgID_CONFIG_SET, NetWIFI);
				}, pageTitle, "NetWork.NetDHCP", -1, WSMsgID.WsMsgID_CONFIG_SET, NetDHCP);
			}
			else
			{
				RfParamCall(function(a) {
					if(a.Ret == 603){
						bNeedReboot=true;
					}
					if(bNeedReboot){
						RebootDev(pageTitle,lg.get("IDS_WIFI_SAVE_REBOOT"),false);
					}else{
						ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
					}
				}, pageTitle, "NetWork.Wifi", -1, WSMsgID.WsMsgID_CONFIG_SET, NetWIFI);
			}
		});
		$("#BtnRf").click(function(){
			LoadConfig();
		})
		LoadConfig();
	});	
});