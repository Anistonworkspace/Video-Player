//# sourceURL=System_Network.js
$(function () {
	var PhysBandwidths = null;
	var NetCommon;
	var NetDNS;
	var NetCommonEx;
	var NetDHCP;
	var NetAdap;
	var OnvifCheck;
	var NetOnvif;
	var NetRTSP;
	var oldIP = "";
	var oldGateway = "";
	var oldSubmask = "";
	var oldTcpPort;
	var oldHttpPort;
	var lastNetCarID = 0;
	var curNetcardID = 0;			// Net Card序号
	var initialNetMode = -1;		// 初始NIC Mode
	var targetNetMode = -1;			// 目标NIC Mode
	var pageTitle = $("#System_Network").text();
	var arrTransferPlan = ["AutoAdapt", "Quality", "Fluency", "Transmission"];
	var bNetDHCP = GetFunAbility(gDevice.Ability.NetServerFunction.NetDHCP);
	var bNetDNS = GetFunAbility(gDevice.Ability.NetServerFunction.NetDNS);
	var bIPAdaptive = GetFunAbility(gDevice.Ability.NetServerFunction.IPAdaptive);
	var bOnvifPwdCheckout = GetFunAbility(gDevice.Ability.NetServerFunction.OnvifPwdCheckout);
	var bPoeDualEthernet = GetFunAbility(gDevice.Ability.NetServerFunction.POEDualEthernet);
	var bDualEthernet = GetFunAbility(gDevice.Ability.NetServerFunction.DualEthernet) || bPoeDualEthernet;
	var bNormalDualEthernet = GetFunAbility(gDevice.Ability.NetServerFunction.DualEthernet) && !bPoeDualEthernet;		// 常规双Net Card设备
	var bChangeOnvifPort = GetFunAbility(gDevice.Ability.OtherFunction.SuppportChangeOnvifPort);
	var bSupportRTSP = GetFunAbility(gDevice.Ability.NetServerFunction.NetRTSP);
	var bReboot = false;
	var UnsafeHttpPorts = [1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 
		53, 77, 79, 87, 95, 101, 102, 103, 104, 109, 110, 111, 113, 115, 117, 119, 
		123, 135, 139, 143, 179, 389, 465, 512, 513, 514, 515, 526, 530, 531, 532, 540, 
		556, 563, 587, 601, 636, 993, 995, 2049, 3659, 4045, 6000, 6665, 6666, 6667, 6668, 6669];

	function UpdateTransferPolicy() {
		$("#SelTransferPolicy").empty();
		$("#SelTransferPolicy").append('<option value="0">'+ lg.get("IDS_NETW_Adaptive") +'</option>');
		$("#SelTransferPolicy").append('<option value="1">'+ lg.get("IDS_NETW_QualityPre") +'</option>');
		$("#SelTransferPolicy").append('<option value="2">'+ lg.get("IDS_NETW_FluencyPre") +'</option>');
		if (gDevice.devType == devTypeEnum.DEV_IPC) {
			$("#SelTransferPolicy").append('<option value="3">'+ lg.get("IDS_NETW_TransMission") +'</option>');
		}
	}
	function SetIpBoxEnable(bEnable) {
		if (bEnable) {
			DivBox(0, "#IpBox");
		}else {
			DivBox(1, "#IpBox");
		}
	}
	function StrToHex(pp) {
		var test = new Array();
		test[0] = parseInt(pp[3]).toString(16);
		test[1] = parseInt(pp[2]).toString(16);
		test[2] = parseInt(pp[1]).toString(16);
		test[3] = parseInt(pp[0]).toString(16);
		for (var i = 0; i < 4; i++) {
			if (test[i].length < 2) {
				test[i] = "0" + test[i];
			}
		}
		var ssip = "0x" + test[0] + test[1] + test[2] + test[3];
		return ssip;
	}
	function listDataCall(){
		nSelectRow = -1;
		var table = $("#NetCardTable")[0];
		var nClearRow = table.rows.length;
		var i;
		for (i = 0; i < nClearRow; ++i) {
			table.deleteRow(0);
		}

		$("#SelectDefaultNetcard").empty();
		var net = NetCommon[NetCommon.Name];
		var netEx = NetCommonEx[NetCommonEx.Name];
		var netcardNums = 0;
		var bChangeNetMode = changeNetMode(initialNetMode, targetNetMode);
		if(targetNetMode == 0)		// SingleMode
		{
			netcardNums = 2;
			// Wire Netcard1
			var tr = table.insertRow(0);
			tr.classList.add("NetCardTableClass");
			$(tr).attr("d", "not-active");
			var td1 = tr.insertCell(0);
			var td2 = tr.insertCell(1);
			var td3 = tr.insertCell(2);
			var td4 = tr.insertCell(3);
			var td5 = tr.insertCell(4);
			
			td1.innerHTML = lg.get("IDS_NETW_Wirecard") + "-1";
			td2.innerHTML = bChangeNetMode ? "-" : HexIpToDecIp(net.HostIP);
			td3.innerHTML = lg.get("IDS_NETW_SingleNetcard");
			td4.innerHTML = "1";
			td5.innerHTML = "<div index='0'><div class='EditBtnClass'></div></div>";

			// Wire Netcard2
			tr = table.insertRow(1);
			tr.classList.add("NetCardTableClass");
			$(tr).attr("d", "not-active");
			td1 = tr.insertCell(0);
			td2 = tr.insertCell(1);
			td3 = tr.insertCell(2);
			td4 = tr.insertCell(3);
			td5 = tr.insertCell(4);

			td1.innerHTML = lg.get("IDS_NETW_Wirecard") + "-2";
			td2.innerHTML = bChangeNetMode ? "-" : HexIpToDecIp(netEx.HostIP);
			td3.innerHTML = lg.get("IDS_NETW_SingleNetcard");
			td4.innerHTML = "2";
			td5.innerHTML = "<div index='1'><div class='EditBtnClass'></div></div>";

			$("#SelectDefaultNetcard").append('<option value="0">'+ lg.get("IDS_NETW_Wirecard") + "-1" +'</option>');
			$("#SelectDefaultNetcard").append('<option value="1">'+ lg.get("IDS_NETW_Wirecard") + "-2" +'</option>');
			$("#SelectDefaultNetcard").val(netEx.PriorityRoute);
		}
		else
		{
			netcardNums = 1;
			// Bind network card1
			var tr = table.insertRow(0);
			tr.classList.add("NetCardTableClass");
			$(tr).attr("d", "not-active");
			var td1 = tr.insertCell(0);
			var td2 = tr.insertCell(1);
			var td3 = tr.insertCell(2);
			var td4 = tr.insertCell(3);
			var td5 = tr.insertCell(4);

			td1.innerHTML = lg.get("IDS_NETW_BindNetcard") + "-1";
			td2.innerHTML = bChangeNetMode ? "-" : HexIpToDecIp(net.HostIP);
			td3.innerHTML = netEx.BondMode == 1 ? lg.get("IDS_NETW_LoadBalance") : lg.get("IDS_FaultTolerant");
			td4.innerHTML = "1,2";
			td5.innerHTML = "<div index='4'><div class='EditBtnClass'></div><div class='UnbindBtnClass'></div></div>";

			$("#SelectDefaultNetcard").append('<option value="0">'+ lg.get("IDS_NETW_BindNetcard") + "-1" +'</option>');
			$("#SelectDefaultNetcard").val(0);
		}

		$(".EditBtnClass").addClass("EditBtn");
		$(".UnbindBtnClass").addClass("UnbindBtn");

		$(".EditBtnClass").unbind().on("click", function(e){
			EditNetcardInfo(this, e)
		});
		function EditNetcardInfo(obj, event){
			var dataHtml = 
			'	<div id="edit_netcard_div">\n' + 
			'		<div class="cfg_row">\n' +
			'			<div class="SN_InputClass">'+ lg.get("IDS_NETW_NetworkCard") +'</div>\n' +
			'			<div class="SN_InputClass" style="width: auto">\n' +
			'				<input class="inputTxt" type="text" id="EditWireNetcard" value='+ "AAAA" +' autocomplete="off" disabled="true" style="margin-top:-5px;"/>\n' +
			'			</div>\n' +
			'		</div>\n' +
			'       <div class="cfg_row" id="SingleNetcardCheckBoxDiv">\n' +
			'          	<div class="SN_InputClass">'+ lg.get("IDS_NETW_NetworkMode") +'</div>\n' +
			'          	<div class="cfg_row_right radio-btn-box" style="height: 30px; margin-left: -6px" id="SingleNetcardCheckBox">\n' +
			'					<span>\n'+
			'						<input type="radio" id="SingleNetcardInput" autocomplete="off" style="margin-top: 10px;">\n' +
			'						<label for="SingleNetcardInput" style="margin-left: 4px;">' + lg.get("IDS_NETW_SingleNetcard") + '</label>\n' + 
			'					</span>\n'+
			'           </div>\n' +
			'		</div>\n' +
			'       <div class="cfg_row" style="margin-top: 10px">\n' +
			'          	<div class="SN_InputClass"></div>\n' +
			'          	<div class="cfg_row_right" style="height: 30px; margin-left: -6px" id="LoadBalanceCheckBox">\n' +
			'					<span>\n'+
			'							<input type="radio" id="LoadBalanceInput" autocomplete="off" style="margin-top: 10px;">\n' +
			'							<label for="LoadBalanceInput" style="margin-left: 4px;">' + lg.get("IDS_NETW_LoadBalance") + '</label>\n' + 
			'					</span>\n'+
			'           </div>\n' +
			'          	<div class="cfg_row_right" style="margin-left: 40px; height: 30px" id="FaultTolerantCheckBox">\n' +
			'					<span>\n'+
			'							<input type="radio" id="FaultTolerantInput" autocomplete="off" style="margin-top: 10px;">\n' +
			'							<label for="FaultTolerantInput" style="margin-left: 4px;">' + lg.get("IDS_FaultTolerant") + '</label>\n' + 
			'					</span>\n'+
			'           </div>\n' +
			'		</div>\n' +
			'		<div class="cfg_row" class="NT_SplitLine">\n' +
			'			<div class="split"></div>\n' +
			'		</div>\n' +
			'		<div class="cfg_row">\n' +
			'			<div class="SN_InputClass">MAC</div>\n' +
			'			<div class="SN_InputClass" style="width: auto">\n' +
			'				<input class="inputTxt" id="EditMac" value='+ "AAAA" +' autocomplete="off" disabled="true" style="margin-top:-5px;"/>\n' +
			'			</div>\n' +
			'		</div>\n' +
			'       <div class="cfg_row">\n' +
			'          	<div class="SN_InputClass" id="EditIPAddressL">' + lg.get("IDS_NET_IPADDR") + '</div>\n' +
			'          	<div class="cfg_row_right" style="width: 320px">\n' +
			'					<input id="EditIPAddressInput" class="inputTxt" style="width: 150px;float:left" autocomplete="off">\n' +
			'					<div style="margin-left: 10px; margin-top: 8px;float:left"><span id="EditDHCPEnable">\n' + 
			'						<input id="EditDHCP" type="checkbox"/>\n' +
			'						<label for="EditDHCP">' + lg.get("IDS_NETW_DHCPEnable") +'</label>\n' +
			'					</span></div>\n' +
			'           </div>\n' +
			'		</div>\n' +
			'       <div class="cfg_row">\n' +
			'          	<div class="SN_InputClass" id="EditNetMaskL">' + lg.get("IDS_NETW_NetMask") + '</div>\n' +
			'          	<div class="cfg_row_right" style="width: auto">\n' +
			'					<input class="inputTxt" id="EditNetMaskInput" style="width: 150px" autocomplete="off">\n' +
			'           </div>\n' +
			'		</div>\n' +
			'       <div class="cfg_row">\n' +
			'          	<div class="SN_InputClass" id="EditGatewayL">' + lg.get("IDS_NETW_Gateway") + '</div>\n' +
			'          	<div class="cfg_row_right" style="width: auto">\n' +
			'					<input class="inputTxt" id="EditGatewayInput" style="width: 150px" autocomplete="off">\n' +
			'           </div>\n' +
			'		</div>\n' +
			'	</div>\n' +	
			'	<div class="btn_box" style="padding-left:150px;">\n' +
			'		<button id="btnEditOK" class="btn">' + lg.get("IDS_OK") + '</button>\n' +
			'		<button class="btn btn_cancle" id="btnCancel">' + lg.get("IDS_CANCEL") + '</button>\n' +
			'	</div>\n';
			$("#Config_dialog .content_container").html(dataHtml);
			Config_Title.innerHTML = lg.get("IDS_LIVE_EditTour");
			SetWndTop("#Config_dialog", 60);						
			$("#Config_dialog").css("width", '500px');

			$("#EditIPAddressInput, #EditNetMaskInput, #EditGatewayInput").unbind().blur(function(){
				LimitIP(this);
			}).keyup(function(){
				if(keyboardFilter(event)) {LimitIP(this); }
			});

			$("#SingleNetcardInput, #LoadBalanceInput, #FaultTolerantInput").unbind().click(function () {
				if ($(this).attr("d") != "active") {
					var targetBonMode = -1;
					$("#SingleNetcardInput, #LoadBalanceInput, #FaultTolerantInput").attr("d", "").prop("checked", false);
					$(this).attr("d", "active");
					$(this).prop("checked", true);
					if($("#SingleNetcardInput").attr("d") == "active")
					{
						targetBonMode = 0;
					}
					else if($("#LoadBalanceInput").attr("d") == "active")
					{
						targetBonMode = 1;
					}
					else if($("#FaultTolerantInput").attr("d") == "active")
					{
						targetBonMode = 2;
					}
					var bChangeNetMode = changeNetMode(initialNetMode, targetBonMode);

					if(bChangeNetMode)
					{
						$("#EditMac").val("-");
						$("#EditIPAddressInput").val("0.0.0.0");
						$("#EditNetMaskInput").val("0.0.0.0");
						$("#EditGatewayInput").val("0.0.0.0");
						DisableIPConfig(true);
						if(targetBonMode != 0)
						{
							$("#EditDHCP").prop("checked", NetDHCP[NetDHCP.Name][4].Enable);
						}
						else
						{
							$("#EditDHCP").prop("checked", NetDHCP[NetDHCP.Name][curNetcardID].Enable);
						}
					}
					else
					{
						if(targetBonMode != 0)
						{
							$("#EditMac").val(net.MAC);
							$("#EditIPAddressInput").val(HexIpToDecIp(net.HostIP));
							$("#EditNetMaskInput").val(HexIpToDecIp(net.Submask));
							$("#EditGatewayInput").val(HexIpToDecIp(net.GateWay));
							$("#EditDHCP").prop("checked", NetDHCP[NetDHCP.Name][4].Enable);
							DisableIPConfig($("#EditDHCP").prop("checked"));
						}
						else
						{
							if(curNetcardID == 0)
							{
								$("#EditMac").val(net.MAC);
								$("#EditIPAddressInput").val(HexIpToDecIp(net.HostIP));
								$("#EditNetMaskInput").val(HexIpToDecIp(net.Submask));
								$("#EditGatewayInput").val(HexIpToDecIp(net.GateWay));
							}
							else
							{
								$("#EditMac").val(netEx.MAC);
								$("#EditIPAddressInput").val(HexIpToDecIp(netEx.HostIP));
								$("#EditNetMaskInput").val(HexIpToDecIp(netEx.Submask));
								$("#EditGatewayInput").val(HexIpToDecIp(netEx.GateWay));
							}
							$("#EditDHCP").prop("checked", NetDHCP[NetDHCP.Name][curNetcardID].Enable);
							DisableIPConfig($("#EditDHCP").prop("checked"));
						}
					}
				}
			});

			function SaveIPAddressCfg(bChangeNetMode, curNetcardID)
			{
				if(!bChangeNetMode){
					// IP Address
					if (!CheckIP($("#EditIPAddressInput").val())) {
						ShowPaop(pageTitle, lg.get("IDS_IPLIST_INVALIDE"));
						return;
					}
					var iptemp_arr = [];
					iptemp_arr = $("#EditIPAddressInput").val().split(".");
					
					// Subnet Mask
					if (!CheckMask($("#EditNetMaskInput").val())) {
						ShowPaop(pageTitle, lg.get("IDS_NETMASK_ERR"));
						return;
					}
					var masktemp_arr = [];
					masktemp_arr = $("#EditNetMaskInput").val().split(".");

					// 网Close
					var gwtemp_arr = [];
					if (CheckIP($('#EditGatewayInput').val())) {
						gwtemp_arr = $("#EditGatewayInput").val().split(".");
						if (!CheckGateway(iptemp_arr, masktemp_arr, gwtemp_arr)) {
							ShowPaop(pageTitle, lg.get("IDS_GATE_ERR"));
							return;
						}
					} else {
						ShowPaop(pageTitle, lg.get("IDS_GATE_ERR"));
						return;
					}
				}

				// DHCPAt任何情况下都会Save
				if (curNetcardID == 0 || curNetcardID == 4) {
					if(!bChangeNetMode){
						var net = NetCommon[NetCommon.Name];
						net.HostIP = StrToHex(iptemp_arr);
						net.Submask = StrToHex(masktemp_arr);
						net.GateWay = StrToHex(gwtemp_arr);
					}
					if (bNetDHCP && isObject(NetDHCP)) {
						var cfgDHCP = NetDHCP[NetDHCP.Name];
						if (curNetcardID == 4 || targetNetMode != 0) {
							cfgDHCP[4].Enable = $("#EditDHCP").prop("checked");
						}else {
							cfgDHCP[0].Enable = $("#EditDHCP").prop("checked");
						}
					}
				}
				else
				{
					if(!bChangeNetMode && targetNetMode == 0){
						var netEx = NetCommonEx[NetCommonEx.Name];
						netEx.HostIP = StrToHex(iptemp_arr);
						netEx.Submask = StrToHex(masktemp_arr);
						netEx.GateWay = StrToHex(gwtemp_arr);
					}
					if (bNetDHCP && isObject(NetDHCP)) {
						var cfgDHCP = NetDHCP[NetDHCP.Name];
						if(targetNetMode != 0)
						{
							cfgDHCP[4].Enable = $("#EditDHCP").prop("checked");
						}
						else
						{
							cfgDHCP[1].Enable = $("#EditDHCP").prop("checked");
						}
					}
				}

				return 0;
			}

			$("#btnEditOK").unbind().click(function(){
				if($("#SingleNetcardInput").attr("d") == "active")
				{
					targetNetMode = 0;
				}
				else if($("#LoadBalanceInput").attr("d") == "active")
				{
					targetNetMode = 1;
				}
				else if($("#FaultTolerantInput").attr("d") == "active")
				{
					targetNetMode = 2;
				}
				netEx.BondMode = targetNetMode;
				var bChangeNetMode = changeNetMode(initialNetMode, targetNetMode);
				var ret = SaveIPAddressCfg(bChangeNetMode, curNetcardID);
				if(ret != 0) return;
				$("#Config_dialog").hide();
				listDataCall();
				if(!bChangeNetMode && targetNetMode == 0)
				{
					$(".NetCardTableClass")[curNetcardID].click();
				}
				else
				{
					$(".NetCardTableClass")[0].click();
				}
				MasklayerHide();
			});

			$("#EditDHCP").unbind().click(function(){
				var targetBonMode = -1;
				if($("#SingleNetcardInput").attr("d") == "active")
				{
					targetBonMode = 0;
				}
				else if($("#LoadBalanceInput").attr("d") == "active")
				{
					targetBonMode = 1;
				}
				else if($("#FaultTolerantInput").attr("d") == "active")
				{
					targetBonMode = 2;
				}
				if(!changeNetMode(initialNetMode, targetBonMode))
				{
					DisableIPConfig($("#EditDHCP").prop("checked"));
				}
			});

			function DisableIPConfig(bEnable)
			{
				DivBox(!bEnable * 1, "#EditIPAddressL");
				DivBox(!bEnable * 1, "#EditIPAddressInput");
				DivBox(!bEnable * 1, "#EditNetMaskL");
				DivBox(!bEnable * 1, "#EditNetMaskInput");
				DivBox(!bEnable * 1, "#EditGatewayL");
				DivBox(!bEnable * 1, "#EditGatewayInput");
				$("#EditIPAddressL").attr("disabled", bEnable);
				$("#EditIPAddressInput").attr("disabled", bEnable);
				$("#EditNetMaskL").attr("disabled", bEnable);
				$("#EditNetMaskInput").attr("disabled", bEnable);
				$("#EditGatewayL").attr("disabled", bEnable);
				$("#EditGatewayInput").attr("disabled", bEnable);
			}
			var eventType = event.type;
			if(eventType == "click")
			{
				curNetcardID = $(obj).parent().attr("index") * 1;
			}
			else
			{
				curNetcardID = $($(obj).find("div[index]")[0]).attr("index") * 1;
			}
			var bChangeNetMode = changeNetMode(initialNetMode, targetNetMode);
			if(targetNetMode == 0)
			{
				$("#EditWireNetcard").val(lg.get("IDS_NETW_Wirecard") + "-" + (curNetcardID + 1));
				$("#SingleNetcardCheckBox").css("display", "");
				$("#SingleNetcardInput").attr("d", "active").prop("checked", true);
				$("#LoadBalanceInput").attr("d", "").prop("checked", false);
				$("#FaultTolerantInput").attr("d", "").prop("checked", false);

				if(bChangeNetMode)
				{
					$("#EditMac").val("-");
					$("#EditIPAddressInput").val("0.0.0.0");
					$("#EditNetMaskInput").val("0.0.0.0");
					$("#EditGatewayInput").val("0.0.0.0");
				}
				else
				{
					if(curNetcardID == 0)
					{
						$("#EditMac").val(net.MAC);
						$("#EditIPAddressInput").val(HexIpToDecIp(net.HostIP));
						$("#EditNetMaskInput").val(HexIpToDecIp(net.Submask));
						$("#EditGatewayInput").val(HexIpToDecIp(net.GateWay));
					}
					else
					{
						$("#EditMac").val(netEx.MAC);
						$("#EditIPAddressInput").val(HexIpToDecIp(netEx.HostIP));
						$("#EditNetMaskInput").val(HexIpToDecIp(netEx.Submask));
						$("#EditGatewayInput").val(HexIpToDecIp(netEx.GateWay));
					}
				}
				$("#EditDHCP").prop("checked", NetDHCP[NetDHCP.Name][curNetcardID].Enable);
				DisableIPConfig(bChangeNetMode ? true : $("#EditDHCP").prop("checked"));
			}
			else
			{
				$("#EditWireNetcard").val(lg.get("IDS_NETW_BindNetcard") + "-1");
				$("#SingleNetcardCheckBox").css("display", "none");
				$("#LoadBalanceInput").attr("d", targetNetMode == 1 ? "active" : "").prop("checked", targetNetMode == 1);
				$("#FaultTolerantInput").attr("d", targetNetMode == 2 ? "active": "").prop("checked", targetNetMode == 2);
				
				if(bChangeNetMode)
				{
					$("#EditMac").val("-");
					$("#EditIPAddressInput").val("0.0.0.0");
					$("#EditNetMaskInput").val("0.0.0.0");
					$("#EditGatewayInput").val("0.0.0.0");
				}
				else
				{
					$("#EditMac").val(net.MAC);
					$("#EditIPAddressInput").val(HexIpToDecIp(net.HostIP));
					$("#EditNetMaskInput").val(HexIpToDecIp(net.Submask));
					$("#EditGatewayInput").val(HexIpToDecIp(net.GateWay));
				}
				$("#EditDHCP").prop("checked", NetDHCP[NetDHCP.Name][4].Enable);
				DisableIPConfig(bChangeNetMode ? true : $("#EditDHCP").prop("checked"));
			}

			MasklayerShow(1);
			$("#Config_dialog").show();
		}
		$(".UnbindBtnClass").click(function(){
			$(".NetCardTableClass").unbind();
			targetNetMode = 0;
			netEx.BondMode = targetNetMode;
			listDataCall();
			$(".NetCardTableClass")[0].click();
		});

		//表格Support单选行
		$(".NetCardTableClass").unbind().click(function(){
			nSelectRow = $(this)[0].rowIndex;
			$(".NetCardTableClass").attr("d", "not-active");
			$(this).attr("d", "active");
			var bChangeNetMode = changeNetMode(initialNetMode, targetNetMode);

			if(targetNetMode != 0)
			{
				$("#NT_IpAddressLabel").val(bChangeNetMode ? "-" : HexIpToDecIp(net.HostIP));
				$("#NT_GateWayLabel").val(bChangeNetMode ? "-" : HexIpToDecIp(net.GateWay));
				$("#NT_NetModeLabel").val(NetDHCP[NetDHCP.Name][4].Enable ? "DHCP" : lg.get("IDS_NETW_STATIC"));
				$("#NT_MacLabel").val(bChangeNetMode ? "-" : net.MAC);
				$("#NT_SubMaskLabel").val(bChangeNetMode ? "-" : HexIpToDecIp(net.Submask));
			}
			else
			{
				if(nSelectRow == 0)
				{
					$("#NT_IpAddressLabel").val(bChangeNetMode ? "-" : HexIpToDecIp(net.HostIP));
					$("#NT_GateWayLabel").val(bChangeNetMode ? "-" : HexIpToDecIp(net.GateWay));
					$("#NT_NetModeLabel").val(NetDHCP[NetDHCP.Name][0].Enable ? "DHCP" : lg.get("IDS_NETW_STATIC"));
					$("#NT_MacLabel").val(bChangeNetMode ? "-" : net.MAC);
					$("#NT_SubMaskLabel").val(bChangeNetMode ? "-" : HexIpToDecIp(net.Submask));
				}
				else
				{
					$("#NT_IpAddressLabel").val(bChangeNetMode ? "-" : HexIpToDecIp(netEx.HostIP));
					$("#NT_GateWayLabel").val(bChangeNetMode ? "-" : HexIpToDecIp(netEx.GateWay));
					$("#NT_NetModeLabel").val(NetDHCP[NetDHCP.Name][1].Enable ? "DHCP" : lg.get("IDS_NETW_STATIC"));
					$("#NT_MacLabel").val(bChangeNetMode ? "-" : netEx.MAC);
					$("#NT_SubMaskLabel").val(bChangeNetMode ? "-" : HexIpToDecIp(netEx.Submask));
				}
			}
		}).dblclick(function(e){ EditNetcardInfo(this, e); });

		var nHeight = $("#SystemNetWork .table-responsive").height()-$("#SystemNetWork .table-head").height();
		var nHeadPadding = 0;
		if(netcardNums * 30 > nHeight){
			nHeadPadding = TableRightPadding;
		}
		$("#SystemNetWork .table-head").css("padding-right", nHeadPadding+"px");
		$("#SystemNetWork .table-content").css("height", nHeight+'px');
	}

	function changeNetMode(startNetMode, targetNetMode){
		if(startNetMode == 0 && (targetNetMode == 1 || targetNetMode == 2))
		{
			return true;
		}
		if((startNetMode == 1 || startNetMode == 2) && targetNetMode == 0)
		{
			return true;
		}
		return false;
	}

	function ShowData() {
		if(bNormalDualEthernet)
		{
			initialNetMode = NetCommonEx[NetCommonEx.Name].BondMode;
			targetNetMode = initialNetMode;
			listDataCall();
			$(".NetCardTableClass")[0].click();
		}

		bReboot = false;
		var net = NetCommon[NetCommon.Name];
		if (bDualEthernet && !bNormalDualEthernet) {
			var netEx = NetCommonEx[NetCommonEx.Name];
			$("#SelNetCard").empty();
			
			if (netEx.BondMode != 0) {
				$("#SelNetCard").append('<option value="0">'+ lg.get("IDS_NETW_BindNetcard") +'</option>');
			}else {										//双Net Card
				$("#SelNetCard").append('<option value="0">'+ lg.get("IDS_NETW_Wirecard")+ "1" +'</option>');
				$("#SelNetCard").append('<option value="1">'+ lg.get("IDS_NETW_Wirecard")+ "2" +'</option>');
			}
			$("#SelNetCard").val(lastNetCarID);
		}
		if (!bDualEthernet || (bDualEthernet && lastNetCarID == 0)) {
			$("#HSDSwitch").prop("checked", net.UseHSDownLoad);
			$("#IpAddressInput").val(HexIpToDecIp(net.HostIP));
			$("#SubnetMaskInput").val(HexIpToDecIp(net.Submask));
			$("#GatewayInput").val(HexIpToDecIp(net.GateWay));
			$("#DeviceInfoInput").val(net.MAC);
		}else if (bDualEthernet && lastNetCarID == 1) {
			var netEx = NetCommonEx[NetCommonEx.Name];
			$("#IpAddressInput").val(HexIpToDecIp(netEx.HostIP));
			$("#SubnetMaskInput").val(HexIpToDecIp(netEx.Submask));
			$("#GatewayInput").val(HexIpToDecIp(netEx.GateWay));
			$("#DeviceInfoInput").val(netEx.MAC);
		}
		$("#MediaPortInput").val(net.TCPPort);
		$("#HttpPortInput").val(net.HttpPort);
		UpdateTransferPolicy();
		for (var i=0; i < 4; i++) {
			if (arrTransferPlan[i] == net.TransferPlan) {
				$("#SelTransferPolicy").val(i);
				break;
			}
		}
		if(isObject(PhysBandwidths)){
			$("#table_PhysBandwidths").show();
			var nSize = PhysBandwidths.length;
			for(var i =0;i < nSize;i++){
				if(PhysBandwidths[i].PhyName == "eth0"){
					$("#SelPhysBandwidths").empty();
					var strHtml = "";
					for(var j = 0; j < PhysBandwidths[i].SupportModes.length; j++){
						strHtml += "<option value='"+PhysBandwidths[i].SupportModes[j]+"'>" + lg.get(PhysBandwidths[i].SupportModes[j]) + "</option>"
					}
					$("#SelPhysBandwidths").append(strHtml);
					break;
				}
			}
			$("#SelPhysBandwidths").val(net.EthPhySpeedMode);
		}
		if (bNetDHCP) {
			var cfg = NetDHCP[NetDHCP.Name];
			var strSelCard = $("#SelNetCard").find("option:selected").text();
			if (strSelCard == lg.get("IDS_NETW_Wirecard") + "2") {
				$("#DHCPSwitch").prop("checked", cfg[1].Enable);
			}else if (strSelCard == lg.get("IDS_NETW_BindNetcard")) {
				$("#DHCPSwitch").prop("checked", cfg[4].Enable);
			}else {
				$("#DHCPSwitch").prop("checked", cfg[0].Enable);
			}
			
			var bEnable = $("#DHCPSwitch").prop("checked");
			SetIpBoxEnable(bEnable);
		}
		if (bNetDNS) {
			var dns = NetDNS[NetDNS.Name];
			$("#DNSBox").css("display", "");
			var firstDNS = HexIpToDecIp(dns.Address);
			var secondDNS = HexIpToDecIp(dns.SpareAddress);
			$("#PrimaryDNSInput").val(firstDNS);
			$("#SecondaryDNSInput").val(secondDNS);
		}
		if (bIPAdaptive) {
			var IpAdapCfg = NetAdap[NetAdap.Name];
			$("#AdaptiveSpan").css("display", "");
			$("#AdaptiveSwitch").prop("checked", IpAdapCfg.IPAdaptive);
			
			var bEnable = $("#AdaptiveSwitch").prop("checked");
			SetIpBoxEnable(bEnable);
		}
		if (bOnvifPwdCheckout && isObject(OnvifCheck)) {
			var cfg = OnvifCheck[OnvifCheck.Name];
			$("#OnvifCheckBox").css("display", "");
			$("#OnvifCheckSwitch").prop("checked", cfg.Enable);
		}
		if (bChangeOnvifPort && isObject(NetOnvif)) {
			var cfg = NetOnvif[NetOnvif.Name];
			$("#OnvifPortInput").val(cfg.Port);
		}

		// POE双Net Card设备禁用第二PicturesNet Card的设置，eth1YESPOE专用，驱动写死，不允许Modify
		var bDisableNetSet = (bPoeDualEthernet && lastNetCarID == 1) ? 0 : 1;
		DivBox(bDisableNetSet, "#AdaptiveIP_div");
		if(lastNetCarID == 1 && bPoeDualEthernet)
			DivBox(0, "#IpBox");
		DivBox(bDisableNetSet, "#DNSBox");
		DivBox(bDisableNetSet, "#MediaBox");
		DivBox(bDisableNetSet, "#HttpBox");
		DivBox(bDisableNetSet, "#OnvifBox");
		DivBox(bDisableNetSet, "#DevInfo_div");
		DivBox(bDisableNetSet, "#OnvifCheckBox");
		DivBox(bDisableNetSet, "#HSDownload_div");
		DivBox(bDisableNetSet, "#table_transfer_policy");
		DivBox(bDisableNetSet, "#table_Network_Encryption");

		MasklayerHide();
	}
	function GetRTSPCfg(){
		if(bSupportRTSP){
			RfParamCall(function(a, b){
				NetRTSP = a;
				ShowData();
			}, pageTitle, "NetWork.RTSP", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}else{
			ShowData();
		}
	}
	function GetCorrespondentCfg(){
		if (bChangeOnvifPort) {
			$("#OnvifBox").css("display", "");
			RfParamCall(function(a,b){
				NetOnvif = a;
				GetRTSPCfg();
			}, pageTitle, "OEMcfg.Correspondent", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}else {
			$("#OnvifBox").css("display", "none");
			GetRTSPCfg();
		}
	}
	function GetOnvifCheckCfg() {
		if (bOnvifPwdCheckout) {
			RfParamCall(function(a,b){
				OnvifCheck = a;
				GetCorrespondentCfg();
			}, pageTitle, "NetWork.OnvifPwdCheckout", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}else {
			GetCorrespondentCfg();
		}
	}
	function GetIPAdaptiveCfg() {
		if (bIPAdaptive) {
			RfParamCall(function(a,b){
				NetAdap = a;
				GetOnvifCheckCfg();
			}, pageTitle, "NetWork.IPAdaptive", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}else {
			GetOnvifCheckCfg();
		}
	}
	function GetDNSCfg(){
		if (bNetDNS) {
			RfParamCall(function(a,b){
				NetDNS = a;
				GetIPAdaptiveCfg()
			}, pageTitle, "NetWork.NetDNS", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}else {
			GetIPAdaptiveCfg();
		}
	}
	function GetDualEthernetCfg() {
		if (bDualEthernet) {
			RfParamCall(function(a,b){
				lastNetCarID = 0;
				NetCommonEx = a;
				GetDNSCfg();
			}, pageTitle, "NetWork.NetCommonEx", -1, WSMsgID.WsMsgID_CONFIG_GET);
			
		}else {
			GetDNSCfg();
		}
	}
	function GetDHCPCfg(){
		if (bNetDHCP) {
			$("#DHCPSpan").css("display", "");
			RfParamCall(function(a,b){
				NetDHCP = a;
				GetDualEthernetCfg();
			}, pageTitle, "NetWork.NetDHCP", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}else {
			$("#DHCPSpan").css("display", "none");
			GetDualEthernetCfg();
		}
	}
	function GetNetCommCfg(){
		RfParamCall(function(a,b){
			if(a.Ret == 100){
				PhysBandwidths = a[a.Name];
			}
			RfParamCall(function(a,b){
				NetCommon= a;
				oldIP = HexIpToDecIp(a[a.Name].HostIP);
				oldGateway = HexIpToDecIp(a[a.Name].Submask);
				oldSubmask = HexIpToDecIp(a[a.Name].GateWay);
				oldTcpPort = a[a.Name].TCPPort;
				oldHttpPort = a[a.Name].HttpPort;
				GetDHCPCfg();
			},pageTitle, "NetWork.NetCommon", -1, WSMsgID.WsMsgID_CONFIG_GET);
		},pageTitle, "PhysBandwidths", -1, WSMsgID.WsMsgID_ABILITY_GET,null, true);
	}
	function SaveIPAddressCfgNormal()
	{
		// IP Address
		if (!CheckIP($("#IpAddressInput").val())) {
			ShowPaop(pageTitle, lg.get("IDS_IPLIST_INVALIDE"));
			return;
		}
		var iptemp_arr = [];
		iptemp_arr = $("#IpAddressInput").val().split(".");
		
		// Subnet Mask
		if (!CheckMask($("#SubnetMaskInput").val())) {
			ShowPaop(pageTitle, lg.get("IDS_NETMASK_ERR"));
			return;
		}
		var masktemp_arr = [];
		masktemp_arr = $("#SubnetMaskInput").val().split(".");
	
		// 网Close
		var gwtemp_arr = [];
		if (CheckIP($('#GatewayInput').val())) {
			gwtemp_arr = $("#GatewayInput").val().split(".");
			if (!CheckGateway(iptemp_arr, masktemp_arr, gwtemp_arr)) {
				ShowPaop(pageTitle, lg.get("IDS_GATE_ERR"));
				return;
			}
		} else {
			ShowPaop(pageTitle, lg.get("IDS_GATE_ERR"));
			return;
		}

		if (lastNetCarID == 0) {
			var net = NetCommon[NetCommon.Name];
			net.HostIP = StrToHex(iptemp_arr);
			net.Submask = StrToHex(masktemp_arr);
			net.GateWay = StrToHex(gwtemp_arr);
			if (bNetDHCP && isObject(NetDHCP)) {
				var cfgDHCP = NetDHCP[NetDHCP.Name];
				var strSelCard = $("#SelNetCard").find("option:selected").text();
				if (strSelCard == lg.get("IDS_NETW_BindNetcard")) {
					cfgDHCP[4].Enable = $("#DHCPSwitch").prop("checked");
				}else {
					cfgDHCP[0].Enable = $("#DHCPSwitch").prop("checked");
				}
			}
			if (bIPAdaptive && isObject(NetAdap)) {
				var IpAdapCfg = NetAdap[NetAdap.Name];
				IpAdapCfg.IPAdaptive = $("#AdaptiveSwitch").prop("checked");
			}
			net.EthPhySpeedMode = $("#SelPhysBandwidths").val();
		}
		else
		{
			var netEx = NetCommonEx[NetCommonEx.Name];
			netEx.HostIP = StrToHex(iptemp_arr);
			netEx.Submask = StrToHex(masktemp_arr);
			netEx.GateWay = StrToHex(gwtemp_arr);
			if (bNetDHCP && isObject(NetDHCP)) {
				var cfgDHCP = NetDHCP[NetDHCP.Name];
				cfgDHCP[1].Enable = $("#DHCPSwitch").prop("checked");
			}
		}
		return 0;
	}
	function SaveData(optype){
		var net = NetCommon[NetCommon.Name];
		if (bNetDNS) {
			if (!CheckIP($("#PrimaryDNSInput").val())) {
				ShowPaop(pageTitle, lg.get("IDS_PrimaryDNS_ERR"));
				return;
			}
			var dns1 = [];
			var dns2 = [];
			dns1 = $("#PrimaryDNSInput").val().split(".");
			if (!CheckIP($("#SecondaryDNSInput").val())) {
				ShowPaop(pageTitle, lg.get("IDS_SecondaryDNS_ERR"));
				return;
			}
			dns2 = $("#SecondaryDNSInput").val().split(".");
			var dns = NetDNS[NetDNS.Name];
			dns.Address = StrToHex(dns1);
			dns.SpareAddress = StrToHex(dns2);
		}
		if (lastNetCarID == 0) {
			net.UseHSDownLoad = $("#HSDSwitch").prop("checked");
			net.HttpPort = $("#HttpPortInput").val() *1;
			net.TCPPort = $("#MediaPortInput").val() *1;
			net.TransferPlan = arrTransferPlan[$("#SelTransferPolicy").val() *1];
			if (bOnvifPwdCheckout && isObject(OnvifCheck)) {
				var cfg = OnvifCheck[OnvifCheck.Name];
				cfg.Enable = $("#OnvifCheckSwitch").prop("checked");
			}
			if (bChangeOnvifPort && isObject(NetOnvif)) {
				var cfg = NetOnvif[NetOnvif.Name];
				cfg.Port = $("#OnvifPortInput").val() *1;
			}
		}else if(lastNetCarID == 1 && bDualEthernet) {
			// 2023-05-26： 多Net Card的HttpPort，tcpPort，YESNO使用HS Download，Transfer Policy使用  NetCommon 配置Save
			net.HttpPort = $("#HttpPortInput").val() *1;
			net.TCPPort = $("#MediaPortInput").val() *1;
			net.UseHSDownLoad = $("#HSDSwitch").prop("checked");
			net.TransferPlan = arrTransferPlan[$("#SelTransferPolicy").val() *1];
		}

		// SingleMode下, 双Net CardSaveIP AddressHour候，IP设置为同网段Hour，Prompt"Wire Netcard1和Wire Netcard2的IP冲突"
		if(bDualEthernet && optype == 1)
		{
			var netEx = NetCommonEx[NetCommonEx.Name];
			if(netEx.BondMode == 0 && ((netEx.Submask & netEx.HostIP) == (net.Submask & net.HostIP)))
			{
				ShowPaop(pageTitle, lg.get("IDS_NETW_DualEthernetIPConflict"));
				return;
			}
			// SaveDefault NIC
			if(!changeNetMode(initialNetMode, targetNetMode))
			{
				if(targetNetMode == 0)
				{
					netEx.PriorityRoute = $("#SelectDefaultNetcard").val() * 1;
				}
				else
				{
					netEx.PriorityRoute = 0;
				}
			}
		}
		
		var arrPort = [0, 0, 0, 0];
		arrPort[0] = $("#MediaPortInput").val() *1;
		arrPort[1] = $("#HttpPortInput").val() *1;
		if(bSupportRTSP){
			arrPort[2] = NetRTSP[NetRTSP.Name].Server.Port;
		}
		if (bChangeOnvifPort) {
			arrPort[3] = $("#OnvifPortInput").val() *1;
		}
		
		var i=0;
		var j=0;
		for(i=0; i < 4; i++) {
			if ((!bSupportRTSP && (i == 2)) || (!bChangeOnvifPort && (i == 3))){
				continue;
			}
			if(arrPort[i] <= 0 || arrPort[i] > 65535){
				ShowPaop(pageTitle, lg.get("IDS_NETW_PortError"));
				return -2;
			}
			if (arrPort[i] == 34568 || arrPort[i] == 34569 || arrPort[i] == 34570 ){
				ShowPaop(pageTitle, lg.get("IDS_NETW_PortConflict"));
				return -2;
			}
		}
		
		for(i = 0; i < 4; i++) {
			for(j = i + 1; j < 4; j++) {
				if ((!bSupportRTSP && (i == 2 || j == 2)) || (!bChangeOnvifPort && (i == 3 || j == 3))){
					continue;
				}
				if (i == 1 && j == 3 && arrPort[i] == arrPort[j]){
					continue;
				}
				if (arrPort[i] == arrPort[j]) {
					ShowPaop(pageTitle, lg.get("IDS_NETW_PortConflict"));
					return -2;
				}
			}
		}
		if(UnsafeHttpPorts.indexOf(arrPort[1]) >= 0){
			return -3;
		}
		return 0;
	}
	function CloseWndDialog(title, tip, c){
		var dataHtml = '<div class="confirm_prompt"><div>\n' +
		'                    <div class="confirm_str">'+tip+'</div>\n' +
		'                </div>' +
		'<div class="btn_box">\n' +
		'    <input type="button" class="btn" id="btn_confirm_ok" value='+lg.get("IDS_OK")+' />\n' +
		'    <input type="button" class="btn btn_cancle" value='+lg.get("IDS_CANCEL")+' />' +
		'</div></div>';
	
		RenderSencondShow(title,dataHtml,'Tips_Content',c);
		$("#btn_confirm_ok").unbind().click(function(){
			$("#SecondaryContent").css("display", "none");
			MasklayerHide();
			closewnd(2);	
		});

	}
	function SaveNetCommCfg() {
		RfParamCall(function(a){
			if (a.Ret == 100 || a.Ret == 603){
				if (a.Ret == 603) {
					bReboot = true;
				}
			}else {
				if(a.Ret == -2){
					var strIP = HexIpToDecIp(NetCommon[NetCommon.Name].HostIP);
					var strGateway = HexIpToDecIp(NetCommon[NetCommon.Name].Submask);
					var strSubmask = HexIpToDecIp(NetCommon[NetCommon.Name].GateWay);
					if((strIP != oldIP || strGateway != oldGateway || strSubmask != oldSubmask) &&
					(oldTcpPort != NetCommon[NetCommon.Name].TCPPort || oldHttpPort != NetCommon[NetCommon.Name].HttpPort)){
						CloseWndDialog(pageTitle,lg.get("IDS_NETW_RebootByManually"),true);
					}else if(oldTcpPort != NetCommon[NetCommon.Name].TCPPort || oldHttpPort != NetCommon[NetCommon.Name].HttpPort){
						ShowPaop(pageTitle, lg.get("IDS_NETW_PortModify"));
						closewnd(2);
					}else if(strIP != oldIP || strGateway != oldGateway || strSubmask != oldSubmask){
						CloseWndDialog(pageTitle,lg.get("IDS_NETW_NETCHANGE"),true);
					}
				}else{
					ShowPaop(pageTitle, lg.get("IDS_SAVE_FAILED"));
				}
				return;
			}
			if (bReboot) {
				RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), true);
			}else {
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}
		},pageTitle, "NetWork.NetCommon", -1, WSMsgID.WsMsgID_CONFIG_SET, NetCommon,0,1);
	}
	function SaveCorrespondentCfg(){
		if (bChangeOnvifPort && isObject(NetOnvif)) {
			var req = {
				"Name" : "OEMcfg.Correspondent", 
				"OEMcfg.Correspondent" : NetOnvif[NetOnvif.Name]
			}
			RfParamCall(function(a){
				if(a.Ret == 603) {
					bReboot = true;
				}
				SaveNetCommCfg();
			}, pageTitle, "OEMcfg.Correspondent", -1, WSMsgID.WsMsgID_CONFIG_SET, req);
		}else {
			SaveNetCommCfg();
		}
	}
	function SaveDNSCfg(){
		if (bNetDNS && isObject(NetDNS)) {
			var req = {
				"Name" : "NetWork.NetDNS", 
				"NetWork.NetDNS" : NetDNS[NetDNS.Name]
			}
			RfParamCall(function(a){
				if (a.Ret == 603) {
					bReboot = true;
				}
				SaveCorrespondentCfg();
			}, pageTitle, "NetWork.NetDNS", -1, WSMsgID.WsMsgID_CONFIG_SET, req);
		}else {
			SaveCorrespondentCfg();
		}
	}
	function SaveOnvifCheckCfg() {
		if (bOnvifPwdCheckout && isObject(OnvifCheck)) {
			var req = {
				"Name" : "NetWork.OnvifPwdCheckout", 
				"NetWork.OnvifPwdCheckout" : OnvifCheck[OnvifCheck.Name]
			}
			RfParamCall(function(a){
				if (a.Ret == 603) {
					bReboot = true;
				}
				SaveDNSCfg();
			}, pageTitle, "NetWork.OnvifPwdCheckout", -1, WSMsgID.WsMsgID_CONFIG_SET, req);
		}else {
			SaveDNSCfg();
		}
	}
	function SaveIPAdaptiveCfg() {
		if (bIPAdaptive && isObject(NetAdap)) {
			var req = {
				"Name" : "NetWork.IPAdaptive", 
				"NetWork.IPAdaptive" : NetAdap[NetAdap.Name]
			}
			RfParamCall(function(a){
				if (a.Ret == 603) {
					bReboot = true;
				}
				SaveOnvifCheckCfg();
			}, pageTitle, "NetWork.IPAdaptive", -1, WSMsgID.WsMsgID_CONFIG_SET, req);
		}else {
			SaveOnvifCheckCfg();
		}
	}
	function SaveDHCPCfg() {
		if (bNetDHCP && isObject(NetDHCP)) {
			var req = {
				"Name" : "NetWork.NetDHCP", 
				"NetWork.NetDHCP" : NetDHCP[NetDHCP.Name]
			}
			RfParamCall(function(a){
				if (a.Ret == 603) {
					bReboot = true;
				}
				SaveIPAdaptiveCfg();
			}, pageTitle, "NetWork.NetDHCP", -1, WSMsgID.WsMsgID_CONFIG_SET, req);
		}else {
			SaveIPAdaptiveCfg();
		}
	}
	function SaveDualEthernetCfg() {
		if (bDualEthernet && isObject(NetCommonEx)) {
			var req = {
				"Name" : "NetWork.NetCommonEx", 
				"NetWork.NetCommonEx" : NetCommonEx[NetCommonEx.Name]
			}
			RfParamCall(function(a) {
				if (a.Ret == 603) {
					bReboot = true;
				}
				SaveDHCPCfg();
			}, pageTitle, "NetWork.NetCommonEx", -1, WSMsgID.WsMsgID_CONFIG_SET, req);
		}else {
			SaveDHCPCfg();
		}
	}
	$(function(){
		$("#NetCardList").css("display",  bNormalDualEthernet ? "" : "none");
		$(".NT_SplitLine").css("display", bNormalDualEthernet ? "" : "none");
		$("#NT_NetcardInfoDiv").css("display", bNormalDualEthernet ? "" : "none");
		$("#Default_NetcardDiv").css("display", bNormalDualEthernet ? "" : "none");
		$("#NetCardSelectDiv").css("display", bNormalDualEthernet ? "none" : "");
		$("#AdaptiveIP_div").css("display", bNormalDualEthernet ? "none" : "");
		$("#IpBox").css("display", bNormalDualEthernet ? "none" : "");
		$("#DevInfo_div").css("display", bNormalDualEthernet ? "none" : "");

		$("#SelNetCard").empty();
		$("#SelNetCard").append('<option value="0">'+ lg.get("IDS_NETW_Wirecard") +'</option>');
		$("#SelNetCard").val(0);
		$("#SelNetCard").change(function(){
			SaveIPAddressCfgNormal();
			SaveData(0);
			lastNetCarID = $(this).val() *1;
			ShowData();
		});
		$("#DHCPSwitch").click(function(){
			var bEnable = $(this).prop("checked");	
			if(!bEnable){
				if($("#AdaptiveSwitch").prop("checked")){
					bEnable = true;
				}
			}
			SetIpBoxEnable(bEnable);
		});
		$("#AdaptiveSwitch").click(function(){
			var bEnable = $(this).prop("checked");
			if(bEnable){
				ShowPaop(pageTitle, lg.get("IDS_NETW_ADAPCLOSE"));
			}else{
				if($("#DHCPSwitch").prop("checked")){
					bEnable = true;
				}
			}
			SetIpBoxEnable(bEnable);
		});
		$("#NetworkSave").click(function(){
			var ret = -1;
			if(!bDualEthernet)
			{
				ret = SaveIPAddressCfgNormal();
				if(ret != 0)  return;
			}
			ret = SaveData(1);
			if(ret == 0){
				SaveDualEthernetCfg();
			}else if(ret == -1){
				ShowPaop(pageTitle, lg.get("IDS_INVALID_SETTING"));
			}else if(ret == -3){
				var tip = lg.get("IDS_NETW_UnsafeHttpPort");
				var dataHtml = '<div class="confirm_prompt"><div>\n' +
					'<div class="confirm_str">'+tip+'</div></div>' +
					'<div class="btn_box">\n' +
					'<input type="button" class="btn" id="BtnOk" value='+lg.get("IDS_OK")+' />\n' +
					'<input type="button" class="btn btn_cancle" value='+lg.get("IDS_CANCEL")+' />' +
					'</div></div>';
				RenderSencondShow(lg.get("IDS_ALARM_PROMPT"),dataHtml,'Tips_Content',true);
				$("#BtnOk").click(function(a){
					$(".btn_cancle").click();
					SaveDualEthernetCfg();
				});	
			}
		});
		$("#NetworkRf").click(function() {
			GetNetCommCfg();
		});
		GetNetCommCfg();
	});
});