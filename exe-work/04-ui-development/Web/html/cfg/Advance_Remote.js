//# sourceURL=Advance_Remote.js
var Remote = function(options) {
	var _opts = {
		SaveCallback : function(bAdd, chn, data) {
		}
	};
	var pageTitle = lg.get("IDS_REMOTE_CHANNEL");
	var bAdd;
	var NetConfig = null;
	var nChannelNum;
	var nDevNum = 0;
	var NetCommCfg;
	var NetDevList;
	var listData = new Array;
	var IPSetCfg;
	var nLastType = 0;//0表示YES我们自己的设备 1表示YES大华设备
	var bSearching = false;
	var bSearchbyDev = GetFunAbility(gDevice.Ability.OtherFunction.SupportNetLocalSearch);
	var nSelectRow = -1;
	var NetIPDevList = new Array;
	var OnvifDevList = null;
	var strSearchType = "Plugin";  // 远程Search方式 CGI 或 Plugin
	_opts = $.extend(_opts, options);
	this.InitRemote = function(nIndex, data, _bAdd){	
		NetConfig = data;
		nChannelNum = nIndex;
		bAdd = _bAdd;
		if(NetConfig != null){
			if(s_ProtocolType_V2[NetConfig.Protocol] == 3){
				NetConfig.Port = 34567;
			}
		}
		Init();
	}
	var s_ProtocolType_V2 = {
		"NAT": 3,
		"DAHUA": 4,
		"ONVIF": 1,
		"TCP": 0,
		"ALL": 7,
		"MAC": 2,
		"ONVIF-Default": 8,
		"RTSP": 5,
		"TCP-ipv6": 6
	};
	
	var s_netProtocolTypeMap = {
		"TCP": 0,
		"UDP": 1,
		"MCAST": 2,
		"NAT": 3,
		"DaHua": 4,
		"RTSP": 5,
		"IPV6": 6,
	};
	function listDataCall(data){
		nSelectRow = -1;
		var table = $("#RemoteTable")[0];
		var nClearRow = table.rows.length;
		var i;
		for (i = 0; i < nClearRow; ++i) {
			table.deleteRow(0);
		}
		for(i = 0; i < data.length; ++i) {
			var tr = table.insertRow(i);
			tr.classList.add("CustomRemoteClass");
			$(tr).attr("d", "not-active");
			
			var td1 = tr.insertCell(0);
			var td2 = tr.insertCell(1);
			var td3 = tr.insertCell(2);
			var td4 = tr.insertCell(3);
			var td5 = tr.insertCell(4);
			td1.innerHTML = data[i].No;
			td2.innerHTML = data[i].DevName;
			$(td2).attr("title", data[i].DevName);
			td3.innerHTML = toHtmlEncode(data[i].DevInfo);
			td4.innerHTML = toHtmlEncode(data[i].IP);
			td5.innerHTML = toHtmlEncode(data[i].Port);
		}
		var nHeight = $("#RemoteList .table-responsive").height()-$("#RemoteList .table-head").height();
		var nHeadPadding = 0;
		if(data.length * 30 > nHeight){
			nHeadPadding = TableRightPadding;
		}
		$("#RemoteList .table-head").css("padding-right", nHeadPadding+"px");
		$("#RemoteList .table-content").css("height", nHeight+'px');
		
		//表格Support单选行
		$(".CustomRemoteClass").click(function(){
			nSelectRow = $(this)[0].rowIndex;
			$(".CustomRemoteClass").attr("d", "not-active");
			$(this).attr("d", "active");
			SelectRow(nSelectRow);
		});
	}
	function EnableBox(a, b) {
		var d = $(b);
		if (a == 0) {
			d.find("select, input, button").prop("disabled", true);
			d.children().prop("disabled", true);
			$(".second_close").prop("disabled", true);
			if (d.css("display") != "none") {
				d.stop().fadeTo("slow", 0.4);
			}
			if (bSearching){
				d.css("cursor", "wait");
				d.find("input, button").css("cursor", "wait");
			}
			d.find("button").addClass("btn-disable")
		} else {
			d.find("select, input, button").prop("disabled", false);
			if (d.css("display") != "none") {
				d.stop().fadeTo("slow", 1);
			}
			d.children().prop("disabled", false);
			$(".second_close").prop("disabled", false);
			d.css("cursor", "default");
			d.find("button").css("cursor", "pointer");
			d.find("input.inputTxt").css("cursor", "text");
			d.find("button").removeClass("btn-disable")
		}
		d = null
	}
	function SelectRow(nIndex){
		var nProc = $("#Protocol").val() * 1;
		var bIpv6 = false;
		var bNat = false;
		if(nProc == Protocol_V2.PROTOCOL_NAT){
			$("#RemotePortDiv").css("display", "none");
			RemoteIPL.innerHTML = lg.get("IDS_VER_SerialID");
			bNat = true;
		}
		
		if(bSearchbyDev){
			var Data = listData[nIndex].Data;
			if(bNat){
				$("#RemoteIP").val(Data.SN);
			}else{
				if(Data.pAddr != ""){
					$("#RemoteIP").val(Data.pAddr);
					bIpv6 = true;
				}else{
					$("#RemoteIP").val(HexIpToDecIp(Data.HostIP));
				}
			}
			$("#RemotePort").val(Data.TCPPort);
			var nProtocol = s_netProtocolTypeMap[Data.MonMode];
			if(nProtocol == 1){	//ONVIF
				if(bNat){
					$("#Protocol").val(Protocol_V2.PROTOCOL_NAT);
				}else{
					$("#Protocol").val(Protocol_V2.PROTOCOL_ONVIF);
				}
				EnableButton(0, "#NetWorkSet");
			}else if(nProtocol == 0){	//NETIP
				if(bNat){
					$("#Protocol").val(Protocol_V2.PROTOCOL_NAT);
				}else{
					if(bIpv6){
						$("#Protocol").val(Protocol_V2.PROTOCOL_NETIPV6);
					}else{
						$("#Protocol").val(Protocol_V2.PROTOCOL_NETIP);
					}
				}
				
				if(bIpv6){
					EnableButton(0, "#NetWorkSet");
				}else{
					EnableButton(1, "#NetWorkSet");
				}
			}else if (nProtocol == 2){ //MAC
				if(bNat){
					$("#Protocol").val(Protocol_V2.PROTOCOL_NAT);
				}else{
					$("#Protocol").val(Protocol_V2.PROTOCOL_MAC);
				}
				EnableButton(1, "#NetWorkSet");
			}
			
			if(nProtocol == Protocol_V2.PROTOCOL_MAC){
				$("#RemoteIP").val(Data.MAC);
				RemoteIPL.innerHTML = lg.get("IDS_REMOTE_MAC");
			}		
			if(Data.HostName == "Dahua" || Data.HostName == "Jovision" || Data.HostName == "Hikvision"){
				$("#Protocol").val(Protocol_V2.PROTOCOL_ONVIF);
			}
		}else{
			var Data = listData[nIndex].Data;
			if(bNat){
				$("#RemoteIP").val(Data.SN);
			}else{
				if(Data.pAddr != ""){
					$("#RemoteIP").val(Data.pAddr);
					bIpv6 = true;
				}else{
					$("#RemoteIP").val(HexIpToDecIp(Data.HostIP));
				}
			}
			$("#RemotePort").val(Data.TCPPort);
			var nProtocol = s_netProtocolTypeMap[Data.MonMode];
			if(nProtocol == 1){	//ONVIF
				EnableButton(0, "#NetWorkSet");
			}else if(nProtocol == 0){	//NETIP
				if(bIpv6){
					EnableButton(0, "#NetWorkSet");
				}else{
					EnableButton(1, "#NetWorkSet");
				}
			}else if (nProtocol == 2){ //MAC	
				EnableButton(1, "#NetWorkSet");
			}
		}
	}
	function SearchRemoteDevice(lCbm, callback, bSearchAll){
		bSearchAll = bSearchAll == void 0?false:bSearchAll;
		var sProtocol = '';	
		if(lCbm == Protocol_V2.PROTOCOL_NETIP || lCbm ==  Protocol_V2.PROTOCOL_NETIPV6){
			sProtocol = 'TCP';
		}else if(lCbm == Protocol_V2.PROTOCOL_ONVIF || lCbm == Protocol_V2.PROTOCOL_MAC){
			sProtocol = 'ONVIF';
		}
		var req = {
			"Name" : "OPLocalSearch",
			"OPLocalSearch":{
				"SearchProtocol" : sProtocol
			}
		}
		RfParamCall(function(a){
			bSearching = false;		
			if(bSearchAll && lCbm != Protocol_V2.PROTOCOL_NETIP){
				callback(a);
			}else{
				callback(a);
				EnableBox(1, "#RemotePage");
				EnableButton(0, "#NetWorkSet");
				var sIP;
				sIP = $("#RemoteIP").val();
				if(sIP != ""){
					for(var i = 0; i < listData.length; i++){
						if(sIP == listData[i].IP){
							nSelectRow = i;
							$(".CustomRemoteClass").attr("d", "not-active");		
							$(".CustomRemoteClass").eq(i).attr("d", "active");
							SelectRow(nSelectRow);
							break;
						}
					}
				}
			}
		}, pageTitle, 'OPLocalSearch', -1, WSMsgID.WSMsgID_NET_LOCALSEARCH_REQ, req, 1);
	}
	function ShowNetSet(nIndex){
		var userName = $("#RemoteUser").val();
		var pwd = $("#RemotePWD").val();
		var devtype = $("#ReDevType").val();
		var sLocalIP = HexIpToDecIp(NetCommCfg[NetCommCfg.Name].HostIP).split(".");
		var num3 = 0, num2 = 0;
		var SetIPCfg = {"Name" : "OPDIGSetIP"};
		for(var i = 0; i < sLocalIP.length; i++){
			sLocalIP[i] = sLocalIP[i] * 1;
		}
		var Data = listData[nIndex].Data;
		$("#RemoteIP, #NetSetIP").val(HexIpToDecIp(Data.HostIP));
		$("#NetSetMask").val(HexIpToDecIp(Data.Submask));
		$("#NetSetGetWay").val(HexIpToDecIp(Data.GateWay));
		$("#NetSetUser").val(userName);
		$("#NetSetPWD").val(pwd);
		
		$("#NetSetAuto").unbind().click(function(){
			if (sLocalIP[3] + num3 ==255){
				sLocalIP[3] = 0;
				num2++;
				num3 = 0;
			}
			num3++;
			if(sLocalIP[2] + num2 == 255){
				sLocalIP[2] = 0;
				num2 = 0;
			}
			var str = sLocalIP[0] + '.' + sLocalIP[1] + '.' + (sLocalIP[2] + num2) + '.' + (sLocalIP[3] + num3);
			$("#NetSetIP").val(str);
			$("#NetSetMask").val(HexIpToDecIp(Data.Submask));
			$("#NetSetGetWay").val(HexIpToDecIp(Data.GateWay));
		});
		$("#NetSetOK").unbind().click(function(){
			var sIP = $("#NetSetIP").val();
			var sSubmask = $("#NetSetMask").val();
			var sGetWay = $("#NetSetGetWay").val();
			if (!(CheckIP(sIP) && CheckIP(sSubmask) && CheckIP(sGetWay))) {
				ShowPaop(pageTitle, lg.get("IDS_IP_FORMAT"));
				return ;
			}
			if (!CheckMask(sSubmask)) {
				ShowPaop(pageTitle, lg.get("IDS_SETSUBNETMASKFAILED"));
				return;
			}
			var iptemp_arr = [];
			iptemp_arr = sIP.split(".");			
			var masktemp_arr = [];
			masktemp_arr = sSubmask.split(".");
			var gwtemp_arr = [];
			gwtemp_arr = sGetWay.split(".");
			if (!CheckGateway(iptemp_arr, masktemp_arr, gwtemp_arr)) {
				ShowPaop(pageTitle, lg.get("IDS_SETGETWAYFAILED"));
				return;
			}
			if(sIP == HexIpToDecIp(Data.HostIP)){
				$("#NetSet_Dialog").hide();
				EnableBox(1, "#RemotePage");
				return;
			}
			SetIPCfg["OPDIGSetIP"] = {
				"Channel": 0,
				"devtype": devtype,
				"LoginCfg":{
					"UserName": $("#NetSetUser").val()
				},
				"Netcfg":{
					"GateWay": DecIpToHexIp(sGetWay),
					"HostIP": DecIpToHexIp(sIP),
					"HostName": Data.HostName,
					"HttpPort": Data.HttpPort,
					"MAC": Data.MAC,
					"MaxBps": Data.MaxBps,
					"MonMode": Data.MonMode,
					"SSLPort": Data.SSLPort,
					"Submask": DecIpToHexIp(sSubmask),
					"TCPMaxConn": Data.TCPMaxConn,
					"TCPPort": Data.TCPPort,
					"TransferPlan": Data.TransferPlan,
					"UDPPort": Data.UDPPort,
					"UseHSDownLoad": Data.UseHSDownLoad
				}
			};	
			if(Data.HostName == "Dahua" || Data.HostName == "Jovision" || Data.HostName == "Hikvision"){
				SetIPCfg.OPDIGSetIP.EncryptType = 2;
				var spassword = CryptoJS.enc.Utf8.parse($("#NetSetPWD").val()).toString(CryptoJS.enc.Base64);
				SetIPCfg.OPDIGSetIP.LoginCfg.Password = spassword.substr(0, 32);
			}else{
				SetIPCfg.OPDIGSetIP.LoginCfg.EncryptType = 1;
				SetIPCfg.OPDIGSetIP.LoginCfg.Password = MD5_8($("#NetSetPWD").val());
			}

			ChangeIP_Title.innerHTML = lg.get("IDS_ALARM_PROMPT");
			confirm_str.innerHTML = lg.get("IDS_SureToChangeIP");
			ChangeIP_Save.innerHTML = lg.get("IDS_OK");
			ChangeIP_Cancle.innerHTML = lg.get("IDS_CANCEL")
			$("#Tip_Dialog").show(function(){
				$("#NetSet_Dialog").hide();
				$("#ChangeIP_Cancle, #Tip_Dialog .second_close2").unbind().click(function(){
					$("#Tip_Dialog").hide();
					$("#NetSet_Dialog").show();
				});
				$("#ChangeIP_Save").unbind().click(function(){
					RfParamCall(function(a){
						$("#Tip_Dialog").hide();
						if(a.Ret == 100){
							Data.IP = sIP;
							listDataCall(listData);
							EnableBox(1, "#RemotePage");
							$("#RemoteIP").val(sIP);
							ShowPaop(pageTitle, lg.get("IDS_REMOTE_CUCCESS"));
						}else{
							$("#NetSet_Dialog").show();
							ShowPaop(pageTitle, lg.get("IDS_SAVE_FAILED"));
						}
						
						
					}, pageTitle, "OPDIGSetIP", -1, WSMsgID.WSMsgID_SET_DIG_IP_REQ, SetIPCfg, true);
				});
			});
		});
		$("#NetSetCancle, #NetSet_Dialog .second_close2").unbind().click(function(){
			$("#NetSet_Dialog").hide();
			EnableBox(1, "#RemotePage");
		});
	}
	function Init(){
		var version = gDevice.loginRsp.SoftWareVersion;
		$("#Protocol").empty();
		if(version.indexOf("R07") >= 0 || version.indexOf("R08") >= 0 || version.indexOf("R09") >= 0 || version.indexOf("R10") >= 0){
			$("#Protocol").append('<option>TCP</option>');
			$("#Protocol").prop("disabled", true);
		}else{
			$("#Protocol").append('<option value="' + Protocol_V2.PROTOCOL_NETIP + '">NETIP</option>');
			if(GetFunAbility(gDevice.Ability.NetServerFunction.NetIPv6)){
				$("#Protocol").append('<option value="' + Protocol_V2.PROTOCOL_NETIPV6 + '">NETIP_IPV6</option>');
			}			
			if(GetFunAbility(gDevice.Ability.OtherFunction.SupportRTSPClient)){
				$("#Protocol").append('<option value="' + Protocol_V2.PROTOCOL_RTSP + '">RTSP</option>');
			}	
			if(GetFunAbility(gDevice.Ability.OtherFunction.SupportOnvifClient)){
				$("#Protocol").append('<option value="' + Protocol_V2.PROTOCOL_ONVIF + '">ONVIF</option>');
			}
			if(GetFunAbility(gDevice.Ability.NetServerFunction.MACProtocol)){
				$("#Protocol").append('<option value="' + Protocol_V2.PROTOCOL_MAC + '">MAC</option>');
			}
			if(GetFunAbility(gDevice.Ability.NetServerFunction.NATProtocol)){
				$("#Protocol").append('<option value="' + Protocol_V2.PROTOCOL_NAT + '">NAT</option>');
			}
			$("#Protocol").val(0);
		}
		
		$("#StreamType").append('<option value="MAIN">'+ lg.get("IDS_MAINSTREAM") +'</option>');
		$("#StreamType").append('<option value="2END">'+ lg.get("IDS_EXTSREAM") +'</option>');
		
		$("#SearchPro").append('<option value="' + Protocol_V2.PROTOCOL_NETIP + '">NETIP</option>');
		if(GetFunAbility(gDevice.Ability.NetServerFunction.NetIPv6)){
			$("#SearchPro").append('<option value="' + Protocol_V2.PROTOCOL_NETIPV6 + '">NETIP_IPV6</option>');
		}	
		if(GetFunAbility(gDevice.Ability.OtherFunction.SupportOnvifClient)){
			$("#SearchPro").append('<option value="' + Protocol_V2.PROTOCOL_ONVIF + '">ONVIF</option>');
		}
		if(GetFunAbility(gDevice.Ability.NetServerFunction.MACProtocol)){
			$("#SearchPro").append('<option value="' + Protocol_V2.PROTOCOL_MAC + '">MAC</option>');
		}
		$("#SearchPro").append('<option value="65535">'+ lg.get("IDS_CFG_ALL") +'</option>');
		if(!GetFunAbility(gDevice.Ability.OtherFunction.SupportSetDigIP)){
			$("#NetWorkSet").css("display", "none");
		}
		if(NetConfig == null){
			$("#CfgName").val("chConfig" + (nChannelNum + 1));
			$("#RemoteCh").val(1);
			$("#RemoteIP").val("192.168.1.20");
			$("#RemotePort").val("34567");
			$("#RemoteUser").val("admin");
			EnableButton(0, "#NetWorkSet");
		}else{
			if(NetConfig.IPAddress != ""){
				$("#CfgName").val(NetConfig.ConfName);
				$("#RemoteCh").val(NetConfig.Channel + 1);
				$("#RemoteIP").val(NetConfig.IPAddress);
				$("#RemotePort").val(NetConfig.Port);
				$("#RemoteUser").val(NetConfig.UserName);
				$("#RemotePWD").val(NetConfig.PassWord);
				$("#ReDevType").empty();
				$("#ReDevType").append('<option value="IPC">IPC</option>\
										<option value="DVR">DVR</option>\
										<option value="HVR">HVR</option>');
				if(NetConfig.DevType!="IPC"&&NetConfig.DevType!="DVR"&&NetConfig.DevType!="HVR"){
					$("#ReDevType").append('<option value="'+NetConfig.DevType+'">'+NetConfig.DevType +'</option>');
				}
				$("#ReDevType").val(NetConfig.DevType);
				$("#StreamType").val(NetConfig.StreamType);
				
				if(s_ProtocolType_V2[NetConfig.Protocol] == 3){
					$("#Protocol").val(3);
					$("#RemotePortDiv, #SearchBox").css("display", "none");
					RemoteIPL.innerHTML = lg.get("IDS_VER_SerialID");
				}else if(s_ProtocolType_V2[NetConfig.Protocol] == 5){
					$("#Protocol").val(5);
					$("#ProTypeBox, #SearchBox").css("display", "none");
					$("#RTSPTypeBox").css("display", "");
					$("#RemoteCh, #ReDevType, #StreamType").prop("disabled", true);
					$("#RTSPMain").val(NetConfig.MainRtspUrl);
					$("#RTSPSub").val(NetConfig.SubRtspUrl);
				}else{
					$("#Protocol").val(s_ProtocolType_V2[NetConfig.Protocol]);
				}
				
				EnableButton(0, "#NetWorkSet");
				if(s_DevType[NetConfig.DevType] == 3){
					$("#ReDevType, #RemoteCh, #RemoteIP, #Protocol").prop("disabled", true);
					EnableButton(1, "#NetWorkSet");
				}
			}
		}
		if(GetFunAbility(gDevice.Ability.OtherFunction.SupportNVR)){
			$("#StreamTypeDiv").css("display", "none");
		}
		if(GetFunAbility(gDevice.Ability.OtherFunction.SupportWIFINVR)){
			$("#CfgName, #ReDevType, #Protocol, #RemoteCh, #StreamType").prop("disabled", false);
			EnableButton(0, "#NetWorkSet");
		}
		$("#RemoteOK").click(function(){
			if(NetConfig == null){
				NetConfig = {
					"Channel": 0,
					"ConfName":"",
					"DevType": "IPC",
					"Enable": false,
					"IPAddress": "",
					"Interval": 0,
					"MacAddr": "",
					"MainRtspUrl": "",
					"Protocol": "TCP",
					"SerialNo": "",
					"StreamType": "MAIN",
					"SubRtspUrl": "",
				};
			}
			NetConfig.ConfName = $("#CfgName").val();
			if(s_DevType[NetConfig.DevType] != 3){
				NetConfig.DevType = $("#ReDevType").val();
			}
			
			var nProtocol = $("#Protocol").val() * 1;
			NetConfig.Protocol = sProtocolV2[nProtocol];
			if(nProtocol == Protocol_V2.PROTOCOL_RTSP){
				var strUrl = $("#RTSPMain").val();
				strUrlTemp = strUrl.substr(0, 7);
				if(strUrlTemp != "rtsp://"){
					ShowPaop(lg.get("IDS_REMOTE_CHANNEL"), lg.get("IDS_REMOTE_RTSPBEGINERROR"));
					return;
				}
				var strData = strUrl.substr(7);
				var strIPandPort;
				var nPos = strData.indexOf('/');
				if(nPos == -1){
					strIPandPort = strData;
				}else{
					strIPandPort = strData.substr(0, nPos);
				}
				
				var strIP = "";
				var strPort = "554";	//不存AtPort，默认554
				var nPosIP = strIPandPort.indexOf(':');
				if (nPosIP == -1) {		
					strIP = strIPandPort;
				} else {
					strIP = strIPandPort.substr(0, nPosIP);
					var nLen = strIPandPort.length;
					strPort = strIPandPort.substr(nPosIP + 1);
				}
				
				NetConfig.MainRtspUrl = strUrl;
				strUrl = $("#RTSPSub").val();
				NetConfig.SubRtspUrl = strUrl;
				$("#RemoteIP").val(strIP);
				$("#RemotePort").val(strPort);
			}
			NetConfig.Channel = $("#RemoteCh").val() * 1 - 1;
			NetConfig.StreamType = $("#StreamType").val();
			
			var str = $("#RemoteIP").val();;
			if(str == gDevice.ip){
				ShowPaop(lg.get("IDS_REMOTE_CHANNEL"), lg.get("IDS_REMOTE_FORBITLOCALIP"));
				return;
			}
			NetConfig.IPAddress = str;
			str = $("#RemotePort").val();
			NetConfig.Port = parseInt(str);
			NetConfig.UserName = $("#RemoteUser").val();
			NetConfig.PassWord = $("#RemotePWD").val();
			
			if(nSelectRow != -1){
				var Data = listData[nSelectRow].Data
				if(s_netProtocolTypeMap[Data.MonMode] == 2 && nProtocol == Protocol_V2.PROTOCOL_MAC){
					if($("#RemoteIP").val() != Data.MAC){
						ShowPaop(lg.get("IDS_REMOTE_CHANNEL"), lg.get("IDS_REMOTE_MACERROR"));
					}
				}
			}
			_opts.SaveCallback(bAdd, nChannelNum, NetConfig);
			
			$("#Config_dialog").hide();
			MasklayerHide();
		});
		$("#Protocol").change(function(){
			$("#ReDevType, #RemoteCh, #RemoteIP").prop("disabled", false);
			$("#ProTypeBox, #RemotePortDiv, #SearchBox").css("display", "");
			$("#RTSPTypeBox").css("display", "none");
			
			EnableButton(0, "#NetWorkSet");
			var Data = null;
			var nIndex = nSelectRow;
			var netProtocol = -1;
			if(nIndex >= 0 && listData.length > nIndex) {
				Data = listData[nIndex].Data;
				netProtocol = s_netProtocolTypeMap[Data.MonMode];
				if((netProtocol == 0 && Data.pAddr == "")|| netProtocol == 2){
					EnableButton(1, "#NetWorkSet");
				}
			}
			
			var nProtocol = $(this).val() * 1;
			if(nProtocol == Protocol_V2.PROTOCOL_NAT){
				$("#RemotePortDiv, #SearchBox").css("display", "none");
				RemoteIPL.innerHTML = lg.get("IDS_VER_SerialID");
			}else if(nProtocol == Protocol_V2.PROTOCOL_RTSP){
				$("#ProTypeBox, #SearchBox").css("display", "none");
				$("#RTSPTypeBox").css("display", "");
				$("#RemoteCh, #ReDevType, #StreamType").prop("disabled", true);
			}else{
				RemoteIPL.innerHTML = lg.get("IDS_NET_IPADDR");
				if(listData.length == 0 || nIndex == -1){
					return;
				}			
	
				if(netProtocol != 2){
					return;
				}else{
					if(nProtocol == Protocol_V2.PROTOCOL_NETIP){
						$("#RemoteIP").val(HexIpToDecIp(Data.HostIP));
						RemoteIPL.innerHTML = lg.get("IDS_NET_IPADDR");
					}else if(nProtocol == Protocol_V2.PROTOCOL_MAC){
						$("#RemoteIP").val(Data.MAC);
						RemoteIPL.innerHTML = lg.get("IDS_VER_SerialID");
					}
				}
			}
		});

		function SDKRemoteSearchDevCallaback(a)
		{
			if(typeof a.Msg != "undefined")
			{
				if(a.Ret == 100)
				{
					bSearching = false;
				}
				else
				{
					if(a.Ret == 1020)		// 插件不SupportSDKSearch，则使用CGISearch方式
					{
						CGISearchDev();
						return;
					}
					EnableBox(1, "#RemotePage");		
					ShowPaop(pageTitle, lg.get("GetConfigFail"));
				}
				return;
			} 

			// SearchDevice Info回调返回
			var nIndex = a.Index;
			var nTotal = a.Total;
			var listSearchDev = a.OPLocalSearch;

			if(listSearchDev.length > 0)
			{
				NetIPDevList = NetIPDevList.concat(listSearchDev);
			}

			if(nIndex == nTotal)		// Finally一个包
			{
				var lCbm = $("#SearchPro").val() * 1;
				var bNat = false;
				if($("#Protocol").val() * 1 == Protocol_V2.PROTOCOL_NAT){
					bNat = true;
				}

				switch(lCbm)
				{
					case Protocol_V2.PROTOCOL_NETIP:
						{
							for(var i = 0; i < NetIPDevList.length; i++){
								var temp = {};
								temp.No = i + 1;
								temp.DevName = NetIPDevList[i].HostName;
								temp.DevInfo = NetIPDevList[i].MAC;
								if(bNat){
									temp.IP = NetIPDevList[i].SN;
								}else{
									temp.IP = HexIpToDecIp(NetIPDevList[i].HostIP);
								}
								temp.Port = NetIPDevList[i].TCPPort;
								if(NetIPDevList[i].pAddr != ""){
									NetIPDevList[i].pLocalLinkAddr = "";							
									NetIPDevList[i].pAddr = "";
									NetIPDevList[i].pGateway = "";
								}
								temp.SN = NetIPDevList[i].SN;
								temp.Data = NetIPDevList[i];
								listData.push(temp);
							}			
							listDataCall(listData);
						}
						break
					case Protocol_V2.PROTOCOL_NETIPV6:
						{
							var nIndex = 0;
							for(var i = 0; i < NetIPDevList.length; i++){
								if(NetIPDevList[i].pAddr == ""){
									continue;
								}
								var temp = {};
								temp.No = nIndex + 1;
								temp.DevName = NetIPDevList[i].HostName;
								temp.DevInfo = NetIPDevList[i].MAC;
								if(bNat){
									temp.IP = NetIPDevList[i].SN;
								}else{
									temp.IP = HexIpToDecIp(NetIPDevList[i].pAddr);
								}
								temp.Port = NetIPDevList[i].TCPPort;
								NetIPDevList[i].HostIP = "";
								NetIPDevList[i].Submask = "";
								NetIPDevList[i].GateWay = "";
								temp.SN = '';
								temp.Data = NetIPDevList[i];
								listData.push(temp);
								nIndex++;
							}
							listDataCall(listData);
						}
						break;
					case 65535:
						{
							var DevList = null;
							if(NetIPDevList && NetIPDevList.length > 0){
								DevList = cloneObj(NetIPDevList);
								if(OnvifDevList && OnvifDevList.length > 0){								
									for(var i = 0; i < OnvifDevList.length; i++){
										var onvifMac = OnvifDevList[i].MAC.toLowerCase(); 
										if(onvifMac.indexOf("-") >= 0){
											onvifMac = onvifMac.replace(/-/g,":")
										}
										var bExist = false;
										for(var j = 0; j < NetIPDevList.length; j++){
											if(onvifMac == NetIPDevList[j].MAC.toLowerCase()){
												bExist = true;
											}
										}
										
										if(!bExist){
											DevList.push(OnvifDevList[i]);
										}
									}
								}
							}else if(OnvifDevList && OnvifDevList.length > 0){
								DevList = OnvifDevList;
							}else{
								return;
							}
							
							var DevIPV6list = cloneObj(DevList);
							if(DevList.length == 0)
								return;
							var nIndex = 0;
							for(var i = 0; i < DevList.length; i++){
								var temp = {};
								temp.No = nIndex + 1;
								temp.DevName = DevList[i].HostName;
								temp.DevInfo = DevList[i].MAC;
								if(bNat){
									temp.IP = DevList[i].SN;
								}else{
									temp.IP = HexIpToDecIp(DevList[i].HostIP);
								}
								temp.Port = DevList[i].TCPPort;
								if(DevList[i].pAddr != ""){
									DevList[i].pLocalLinkAddr = "";							
									DevList[i].pAddr = "";
									DevList[i].pGateway = "";
								}
								temp.SN = DevList[i].SN;
								temp.Data = DevList[i];
								listData.push(temp);
								nIndex++;
								if(DevIPV6list[i].pAddr != ""){
									temp = {};
									temp.No = nIndex + 1;
									temp.DevName = DevIPV6list[i].HostName;
									temp.DevInfo = DevIPV6list[i].MAC;
									if(bNat){
										temp.IP = DevIPV6list[i].SN;
									}else{
										temp.IP = DevIPV6list[i].pAddr;
									}
									temp.Port = DevIPV6list[i].TCPPort;
									DevIPV6list[i].HostIP = "";
									DevIPV6list[i].Submask = "";
									DevIPV6list[i].GateWay = "";
									temp.SN = '';
									temp.Data = DevIPV6list[i];
									listData.push(temp);
									nIndex++;
								}
							}

							listDataCall(listData);
						}
						break;
				}

				EnableBox(1, "#RemotePage");
				EnableButton(0, "#NetWorkSet");
				var sIP;
				sIP = $("#RemoteIP").val();
				if(sIP != ""){
					for(var i = 0; i < listData.length; i++){
						if(sIP == listData[i].IP){
							nSelectRow = i;
							$(".CustomRemoteClass").attr("d", "not-active");		
							$(".CustomRemoteClass").eq(i).attr("d", "active");
							SelectRow(nSelectRow);
							break;
						}
					}
				}
			}
		}

		SDKRemoteSearchDevEventCallback = SDKRemoteSearchDevCallaback;
		
		function CGISearchDev()
		{
			var lCbm = $("#SearchPro").val() * 1;
			var bNat = false;
			if($("#Protocol").val() * 1 == Protocol_V2.PROTOCOL_NAT){
				bNat = true;
			}
			switch(lCbm)
			{
				case Protocol_V2.PROTOCOL_NETIP:
					{
						SearchRemoteDevice(lCbm, function(a){
							if(!a[a.Name]) return;
							var DevList = a[a.Name];
							if(DevList.length == 0)
								return;
							for(var i = 0; i < DevList.length; i++){
								var temp = {};
								temp.No = i + 1;
								temp.DevName = DevList[i].HostName;
								temp.DevInfo = DevList[i].MAC;
								if(bNat){
									temp.IP = DevList[i].SN;
								}else{
									temp.IP = HexIpToDecIp(DevList[i].HostIP);
								}
								temp.Port = DevList[i].TCPPort;
								if(DevList[i].pAddr != ""){
									DevList[i].pLocalLinkAddr = "";							
									DevList[i].pAddr = "";
									DevList[i].pGateway = "";
								}
								temp.SN = DevList[i].SN;
								temp.Data = DevList[i];
								listData.push(temp);
							}
	
							listDataCall(listData);
						});
					}
					break;
				case Protocol_V2.PROTOCOL_NETIPV6:
					{
						SearchRemoteDevice(lCbm, function(a){
							if(!a[a.Name]) return;
							var DevList = a[a.Name];
							if(DevList.length == 0)
								return;
							
							var nIndex = 0;
							for(var i = 0; i < DevList.length; i++){
								if(DevList[i].pAddr == ""){
									continue;
								}
								var temp = {};
								temp.No = nIndex + 1;
								temp.DevName = DevList[i].HostName;
								temp.DevInfo = DevList[i].MAC;
								if(bNat){
									temp.IP = DevList[i].SN;
								}else{
									temp.IP = HexIpToDecIp(DevList[i].pAddr);
								}
								temp.Port = DevList[i].TCPPort;
								DevList[i].HostIP = "";
								DevList[i].Submask = "";
								DevList[i].GateWay = "";
								temp.SN = '';
								temp.Data = DevList[i];
								listData.push(temp);
								nIndex++;
							}
	
							listDataCall(listData);
						});
					}
					break;
				case Protocol_V2.PROTOCOL_ONVIF:
					{
						SearchRemoteDevice(lCbm, function(a){
							if(!a[a.Name]) return;
							var DevList = a[a.Name];
							var len = DevList.length;
							if(len == 0)
								return;
							for(var i = 0;i < len;i++){
								var temp = {};
								temp.No = i + 1;
								temp.DevName = DevList[i].HostName;
								temp.DevInfo = DevList[i].MAC;
								if(bNat){
									temp.IP = DevList[i].SN;
								}else{
									temp.IP = HexIpToDecIp(DevList[i].HostIP);
								}
								temp.Port = DevList[i].TCPPort;
								temp.SN = DevList[i].SN;
								temp.Data = DevList[i];
								listData.push(temp);
							}
	
							listDataCall(listData);
						});
					}
					break;
				case Protocol_V2.PROTOCOL_MAC:
					{
						SearchRemoteDevice(lCbm, function(a){
							if(!a[a.Name]) return;
							var DevList = a[a.Name];
							var len = DevList.length;
							if(len == 0)
								return;
							for(var i = 0;i < len;i++){
								var temp = {};
								temp.No = i + 1;
								temp.DevName = DevList[i].HostName;
								temp.DevInfo = DevList[i].MAC;
								if(bNat){
									temp.IP = DevList[i].SN;
								}else{
									temp.IP = HexIpToDecIp(DevList[i].HostIP);
								}
								temp.Port = DevList[i].TCPPort;
								temp.SN = DevList[i].SN;
								temp.Data = DevList[i];
								listData.push(temp);
							}
	
							listDataCall(listData);
						});
					}
					break;
				case 65535:
					{
						SearchRemoteDevice(Protocol_V2.PROTOCOL_NETIP, function(a){
							var DevList = null;
							if(a[a.Name] && a[a.Name].length > 0){
								DevList = cloneObj(a[a.Name]);
								if(OnvifDevList && OnvifDevList.length > 0){								
									for(var i = 0; i < OnvifDevList.length; i++){
										var onvifMac = OnvifDevList[i].MAC.toLowerCase(); 
										if(onvifMac.indexOf("-") >= 0){
											onvifMac = onvifMac.replace(/-/g,":")
										}
										var bExist = false;
										for(var j = 0; j < a[a.Name].length; j++){
											if(onvifMac == a[a.Name][j].MAC.toLowerCase()){
												bExist = true;
											}
										}
										
										if(!bExist){
											DevList.push(OnvifDevList[i]);
										}
									}
								}
							}else if(OnvifDevList && OnvifDevList.length > 0){
								DevList = OnvifDevList;
							}else{
								return;
							}
							
							var DevIPV6list = cloneObj(DevList);
							if(DevList.length == 0)
								return;
							var nIndex = 0;
							for(var i = 0; i < DevList.length; i++){
								var temp = {};
								temp.No = nIndex + 1;
								temp.DevName = DevList[i].HostName;
								temp.DevInfo = DevList[i].MAC;
								if(bNat){
									temp.IP = DevList[i].SN;
								}else{
									temp.IP = HexIpToDecIp(DevList[i].HostIP);
								}
								temp.Port = DevList[i].TCPPort;
								if(DevList[i].pAddr != ""){
									DevList[i].pLocalLinkAddr = "";							
									DevList[i].pAddr = "";
									DevList[i].pGateway = "";
								}
								temp.SN = DevList[i].SN;
								temp.Data = DevList[i];
								listData.push(temp);
								nIndex++;
								if(DevIPV6list[i].pAddr != ""){
									temp = {};
									temp.No = nIndex + 1;
									temp.DevName = DevIPV6list[i].HostName;
									temp.DevInfo = DevIPV6list[i].MAC;
									if(bNat){
										temp.IP = DevIPV6list[i].SN;
									}else{
										temp.IP = DevIPV6list[i].pAddr;
									}
									temp.Port = DevIPV6list[i].TCPPort;
									DevIPV6list[i].HostIP = "";
									DevIPV6list[i].Submask = "";
									DevIPV6list[i].GateWay = "";
									temp.SN = '';
									temp.Data = DevIPV6list[i];
									listData.push(temp);
									nIndex++;
								}
							}

							listDataCall(listData);
						}, true);
					}
					break;
			}
		}

		$("#RemoteSearch").click(function(){
			if(bSearchbyDev){
				var lCbm = $("#SearchPro").val() * 1;
				bSearching = true;
				EnableBox(0, "#RemotePage");
				if(listData.length > 0){
					listData = [];
					listDataCall(listData);
				}

				switch(lCbm){
					case Protocol_V2.PROTOCOL_NETIP:
						{
							if(strSearchType == "Plugin")		// 使用插件SDKSearch，JIUANProtocol
							{
								NetIPDevList = [];
								gDevice.SDKRemoteSearchDevs(SDKRemoteSearchDevCallaback);
							}
							else
							{
								CGISearchDev();
							}
						}
						break;
					case Protocol_V2.PROTOCOL_NETIPV6:
						{
							if(strSearchType == "Plugin")		// 使用插件SDKSearch，JIUANProtocol
							{
								NetIPDevList = [];
								gDevice.SDKRemoteSearchDevs(SDKRemoteSearchDevCallaback);
							}
							else
							{
								CGISearchDev();
							}

						}
						break;
					case Protocol_V2.PROTOCOL_ONVIF:
						{
							CGISearchDev();
						}
						break;
					case Protocol_V2.PROTOCOL_MAC:
						{
							CGISearchDev();
						}
						break;
					case 65535:{
							SearchRemoteDevice(Protocol_V2.PROTOCOL_ONVIF, function(b){
								OnvifDevList = b[b.Name];
								if(strSearchType == "Plugin")		// 使用插件SDKSearch，JIUANProtocol
								{
									NetIPDevList = [];
									gDevice.SDKRemoteSearchDevs(SDKRemoteSearchDevCallaback);
								}
								else
								{
									CGISearchDev();
								}
							}, true);
						}
						break;
				}
			}
		});
		$("#NetWorkSet").click(function(){
			NetSet_Dialog_Title.innerHTML = lg.get("IDS_REMOTE_NETWORK");
			NetSetIPL.innerHTML = lg.get("IDS_NET_IPADDR");
			NetSetMaskL.innerHTML = lg.get("IDS_NET_MASK");
			NetSetGetWayL.innerHTML = lg.get("IDS_NET_GATEWAY");
			NetSetUserL.innerHTML = lg.get("IDS_USERNAME");
			NetSetPWDL.innerHTML = lg.get("IDS_PSW");
			NetSetAuto.innerHTML = lg.get("IDS_REMOTE_AUTO");
			NetSetOK.innerHTML = lg.get("IDS_OK");
			NetSetCancle.innerHTML =lg.get("IDS_CANCEL");
			
			var nIndex = nSelectRow;
			if(nIndex == -1){
				return;
			}
			$("#NetSet_Dialog").show(function(){
				EnableBox(0, "#RemotePage");
				$("#RemotePage").css("cursor", "default");
				ShowNetSet(nIndex);
			});
		});
		
		RfParamCall(function(a,b){
			NetCommCfg = a;
		}, pageTitle, "NetWork.NetCommon", -1, WSMsgID.WsMsgID_CONFIG_GET, null, 1);
	}	
};