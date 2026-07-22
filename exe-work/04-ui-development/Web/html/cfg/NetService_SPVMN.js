//# sourceURL=NetService_SPVMN.js
$(document).ready(function(){
	var NetVsp;
	var NetSipIP;
	var NetGBProType;
	var NetAudioOutID;
	var bSipProtocol = false;
	var nSelChan = -1;
	var nSelAlarm = -1;
	var nChanNum = gDevice.loginRsp.ChannelNum;
	var nAlarmInChn = gDevice.loginRsp.AlarmInChannel;
	var bAbilityNetSPVMNSIP = GetFunAbility(gDevice.Ability.NetServerFunction.NetSPVMNSIP);
	var bAbilityNetSPVStreamType = GetFunAbility(gDevice.Ability.NetServerFunction.NetSPVStreamType);
	var bSupportSIP = bAbilityNetSPVMNSIP || bAbilityNetSPVStreamType;
	var pageTitle= lg.get("IDS_NETS_NetSPVMN");

	if(!bAbilityNetSPVMNSIP){
		$("#SipBox52").css("display", "none");
	}
	if(!bAbilityNetSPVStreamType){
		$("#StreamTypeBox").css("display", "none");
	}

	function ShowAudioOutID(){
		if(typeof NetAudioOutID == "undefined"){
			$("#AudioOut").css("display", "none");
			$("#TalkProtocol").removeClass("second");
			$("#TalkProtocol").addClass("first");
		}
		else{
			var audioOutCfg = NetAudioOutID[NetAudioOutID.Name];
			$("#TalkAudioOut").val(audioOutCfg.AudioOutDevID);
		}
	}

	function ShowSipTalkTransProtocol(){
		if(typeof NetGBProType == "undefined"){
			$("#SipTransProBox").css("display", "none");
			$("#StreamTypeBox").removeClass("second");
			$("#StreamTypeBox").addClass("first");
			$("#SipBox9").css("display", "none");
		}
		else{
			var cfg = NetGBProType[NetGBProType.Name];
			if(cfg.SIPTranType == 3){						// 1: udp 2: tcp 3: udp和tcpAdaptive就YESudp
				$("#SipTransPro").val(1);
			}
			else{
				$("#SipTransPro").val(cfg.SIPTranType);
			}
			$("#TalkTransPro").val(cfg.TalkTransType);		// 0: udp 1: tcp
		}
	}
	function ShowCurCamrea() {
		var cfg = NetVsp[NetVsp.Name];
		$("#InputChanNo").val(cfg.Camreaid[nSelChan]);
		$("#InputAlarmLev").val(cfg.CamreaLevel[nSelChan]);
	}
	function SaveCurCamrea() {
		var cfg = NetVsp[NetVsp.Name];
		cfg.Camreaid[nSelChan] = $("#InputChanNo").val();
		cfg.CamreaLevel[nSelChan] = $("#InputAlarmLev").val() *1;
	}
	function SaveCurAlarm() {
		var cfg = NetVsp[NetVsp.Name];
		cfg.Alarmid[nSelAlarm] = $("#InputAlarmNo").val();
		cfg.AlarmLevel[nSelAlarm] = $("#InputAlarmLev2").val() *1;
	}
	function ShowCurAlarm() {
		var cfg = NetVsp[NetVsp.Name];
		$("#InputAlarmNo").val(cfg.Alarmid[nSelAlarm]);
		$("#InputAlarmLev2").val(cfg.AlarmLevel[nSelAlarm]);
	}
	function CheckEnable() {
		var nEnable = $("#SwitchEnable").attr("value") *1;
		DivBox(nEnable, $("#SipBox1"));
		DivBox(nEnable, $("#SipBox2"));
		DivBox(nEnable, $("#SipBox22"));
		DivBox(nEnable, $("#SipBox3"));
		DivBox(nEnable, $("#SipBox4"));
		DivBox(nEnable, $("#SipBox5"));
		DivBox(nEnable, $("#SipBox6"));
		DivBox(nEnable, $("#SipBox7"));
		DivBox(nEnable, $("#SipBox8"));
		DivBox(nEnable, $("#SipBox9"));
		DivBox(nEnable, $("#AlarmBox"));
	}
	function ShowData() {
		bSipProtocol = false;
		var cfg = NetVsp[NetVsp.Name];
		if (cfg.bCsEnable) {
			$("#SwitchEnable").removeClass("selectDisable").addClass("selectEnable").attr("value", "1");
		}else {
			$("#SwitchEnable").removeClass("selectEnable").addClass("selectDisable").attr("value", "0");
		}
		$("#InputSerNo").val(cfg.szServerNo);
		$("#InputSerDNS").val(cfg.szServerDn);
		$("#InputSerIP").val(cfg.szCsIP);
		$("#InputSerPort").val(cfg.sCsPort&0xffff);
		$("#InputDevNo").val(cfg.szDeviceNO);
		$("#InputRegPasswd").val(cfg.szConnPass);
		$("#InputLocalSer").val(cfg.sUdpPort&0xffff);
		$("#InputValidity").val(cfg.iRsAgedTime);
		$("#InputCardiac").val(cfg.iHsIntervalTime);
		if (bSupportSIP) {	
			var SipCfg = NetSipIP[NetSipIP.Name];
			if(bAbilityNetSPVMNSIP){
				$("#InputSipIP").val(SipCfg.SIPDevIP);
			}
			if(bAbilityNetSPVStreamType){
				$("#StreamTypeSel").val(SipCfg.SPVStreamType * 1);
			}
		}
		ShowCurCamrea();
		ShowCurAlarm();
		ShowAudioOutID();
		$("#SipBox9").css("display", "");
		ShowSipTalkTransProtocol();
		CheckEnable();
		MasklayerHide();
	}
	function LoadConfig() {
		RfParamCall(function(a){
			NetVsp = a;
			RfParamCall(function(a){
				NetGBProType = a;
				RfParamCall(function(a){
					NetAudioOutID = a;
					if(bSupportSIP) {
						RfParamCall(function(a){
							NetSipIP = a;
							ShowData();
						}, pageTitle, "NetWork.SPVSIP", -1, WSMsgID.WsMsgID_CONFIG_GET);
					}else {
						ShowData();
					}
				}, pageTitle, "NetWork.BellAudioOutID", -1, WSMsgID.WsMsgID_CONFIG_GET);
			}, pageTitle, "NetWork.GBProType", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}, pageTitle, "NetWork.SPVMN", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	$(function(){
		$("#SelChannel").empty();
		for (var i=0; i < nChanNum; ++i) {
			$("#SelChannel").append('<option value="'+i+'">'+(i+1)+'</option>')
		}
		$("#SelChannel").append('<option value="'+nChanNum+'">'+ lg.get("IDS_PATH_ALL") +'</option>')

		$("#SelAlarm").empty();
		for (var j=0; j < nAlarmInChn; ++j) {
			$("#SelAlarm").append('<option value="'+j+'">'+(j+1)+'</option>')
		}
		if(nAlarmInChn > 0){
			$("#SelAlarm").append('<option value="'+nAlarmInChn+'">'+ lg.get("IDS_PATH_ALL") +'</option>')
		}

		$("#SipTransPro").empty();
		$("#SipTransPro").append('<option value="' + 1 + '">'  + "UDP" + '</option>');
		$("#SipTransPro").append('<option value="' + 2 + '">'  + "TCP" + '</option>');

		$("#TalkTransPro").empty();
		$("#TalkTransPro").append('<option value="' + 0 + '">'  + "UDP" + '</option>');
		$("#TalkTransPro").append('<option value="' + 1 + '">'  + "TCP" + '</option>');

		$("#StreamTypeSel").empty();
		$("#StreamTypeSel").append('<option value="' + 0 + '">' + lg.get("IDS_FULL_MAINSTREAM") + '</option>')
		$("#StreamTypeSel").append('<option value="' + 1 + '">' + lg.get("IDS_FULL_SUBSTREAM") + '</option>') 
 
		// 2023-04-06
		// if(nAlarmInChn == 0) {
		// 	$("#AlarmBox").css("display", "none");
		// }
		
		nSelChan = 0;
		nSelAlarm = 0;
		$("#SelChannel").val(nSelChan);
		$("#SelAlarm").val(nSelAlarm);
		
		$("#SipTransPro").change(function(){
			bSipProtocol = !bSipProtocol;
		});
		$("#SelChannel").change(function(){
			var nSel = $(this).val() *1;
			if (nSel != nSelChan) {
				SaveCurCamrea();
				if (nSel == nChanNum) {
					nSelChan = 0;
				}else {
					nSelChan = nSel;
				}
				ShowCurCamrea();
			}
		});
		$("#SelAlarm").change(function(){
			var nSel = $(this).val() *1;
			if (nSel != nSelAlarm) {
				SaveCurAlarm();
				if (nSel == nAlarmInChn) {
					nSelAlarm = 0;
				}else {
					nSelAlarm = nSel;
				}
				ShowCurAlarm();
			}
		});
		$("#SwitchEnable").click(function(){
			if ($(this).attr("value") == "0") {
				$(this).removeClass("selectDisable").addClass("selectEnable").attr("value", "1");
			}else {
				$(this).removeClass("selectEnable").addClass("selectDisable").attr("value", "0");
			}
			CheckEnable();
		});
		$("#BtnSave").click(function(){
			var cfg = NetVsp[NetVsp.Name];
			SaveCurCamrea();
			SaveCurAlarm();
			var i = 0;
			if ($("#SelChannel").val()*1 == nChanNum) {
				for (i = 1; i < nChanNum; ++i) {
					cfg.Camreaid[nSelChan] = cfg.Camreaid[0];
					cfg.CamreaLevel[nSelChan] = cfg.CamreaLevel[0];
				}
			}
			if ($("#SelAlarm").val() *1 == nAlarmInChn) {
				for (i = 1; i < nAlarmInChn; ++i) {
					cfg.Alarmid[nSelAlarm] = cfg.Alarmid[0];
					cfg.AlarmLevel[nSelAlarm] = cfg.AlarmLevel[0];
				}
			}
			cfg.bCsEnable = $("#SwitchEnable").attr("value") == "1" ? true : false;
			cfg.szServerNo = $("#InputSerNo").val();
			cfg.szServerDn = $("#InputSerDNS").val();
			cfg.szCsIP = $("#InputSerIP").val();
			cfg.sCsPort = $("#InputSerPort").val() *1;
			cfg.szDeviceNO = $("#InputDevNo").val();
			cfg.szConnPass = $("#InputRegPasswd").val();
			cfg.sUdpPort = $("#InputLocalSer").val() *1;
			cfg.iRsAgedTime = $("#InputValidity").val() *1;
			cfg.iHsIntervalTime = $("#InputCardiac").val() *1;
			RfParamCall(function(a){
				if(typeof NetGBProType != "undefined"){
					var procfg = NetGBProType[NetGBProType.Name];
					procfg.TalkTransType = $("#TalkTransPro").val() * 1;
					if(bSipProtocol){
						procfg.SIPTranType = $("#SipTransPro").val() * 1
					}
				}
				RfParamCall(function(a){
					if(typeof NetAudioOutID != "undefined"){
						var audiooutCfg = NetAudioOutID[NetAudioOutID.Name];
						audiooutCfg.AudioOutDevID = $("#TalkAudioOut").val();
					}
					RfParamCall(function(a){
						if (bSupportSIP && isObject(NetSipIP)) {
							var SipCfg = NetSipIP[NetSipIP.Name];
							if(bAbilityNetSPVMNSIP){
								SipCfg.SIPDevIP = $("#InputSipIP").val();
							}
							if(bAbilityNetSPVStreamType){
								SipCfg.SPVStreamType = $("#StreamTypeSel").val() * 1 ? true : false;
							}
							RfParamCall(function(a){
								if(a.Ret == 603){
									RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), true);
								}
								else{
									ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
								}
							}, pageTitle, "NetWork.SPVSIP", -1, WSMsgID.WsMsgID_CONFIG_SET, NetSipIP);
						}else {
							ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
						}
					}, pageTitle, "NetWork.BellAudioOutID", -1, WSMsgID.WsMsgID_CONFIG_SET, NetAudioOutID);
				}, pageTitle, "NetWork.GBProType", -1, WSMsgID.WsMsgID_CONFIG_SET, NetGBProType);
			}, pageTitle, "NetWork.SPVMN", -1, WSMsgID.WsMsgID_CONFIG_SET, NetVsp);
		});
		$("#BtnRf").click(function(){
			LoadConfig();
		});

		LoadConfig();
	});
});