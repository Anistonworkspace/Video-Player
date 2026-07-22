//# sourceURL=Info_Version.js
$(function() {
	var NetInfo = {};
	var bDeviceDesc = false;
	var DeviceDescCfg;
	var nPlayBlackNum = 0;
	var bSupportNat = false;
	var bShowProductType = GetFunAbility(gDevice.Ability.OtherFunction.SupportShowProductType);
	var bAutoCreateDestory = GetFunAbility(gDevice.Ability.OtherFunction.SupportAutoCreateDestory);
	var bAcquisition = false;
	var MaxPreviewNum = null;
	var cfgFunctionEnable = null;
	var cfgSystemInfoEx = null;
	var sDevInfoTitle = lg.get("IDS_VER_DeviceInfo");
	var bReboot = false;
	var bSupportMCUVer = GetFunAbility(gDevice.Ability.OtherFunction.SupportGetMcuVersion);
	var padRemoteCfg = {};
	padRemoteCfg.PadType = [{ "ShowName" : "General", "Value" : 0 },
		{ "ShowName" : "GFDS_11K4L", "Value" : 1 }, 
		{ "ShowName" : "DVR_17K4L", "Value" : 2 }, 
		{ "ShowName" : "GZHS_18K4L", "Value" : 3 }, 
		{ "ShowName" : "TS8OB_7K4L", "Value" : 4 }, 
		{ "ShowName" : "ZHJD_16K3L", "Value" : 5 }, 
		{ "ShowName" : "XFWS_13K3L", "Value" : 6 }, 
		{ "ShowName" : "XFWS_17K3L", "Value" : 7 }, 
		{ "ShowName" : "SZYL_15K4L", "Value" : 8 }, 
		{ "ShowName" : "SZPNK_16K3L", "Value" : 9 }, 
		{ "ShowName" : "TST_3L", "Value" : 10 } ];
	padRemoteCfg.RemoteType = [ { "ShowName" : "General", "Value" : 0 }, 
		{ "ShowName" : "AnJF", "Value" : 1 },
		{ "ShowName" : "SiL", "Value" : 2 }, 
		{ "ShowName" : "DuoPWS", "Value" : 3 }, 
		{ "ShowName" : "TaiA", "Value" : 4 }, 
		{ "ShowName" : "XinDGC", "Value" : 5 } ,
		{ "ShowName" : "MeiF", "Value" : 6 }, 
		{ "ShowName" : "HaiRSX", "Value" : 7 }, 
		{ "ShowName" : "KaiKD", "Value" : 8 }, 
		{ "ShowName" : "DeJL", "Value" : 9 },
		{ "ShowName" : "R8CA", "Value" : 10 }, 
		{ "ShowName" : "XinKA", "Value" : 11 }, 
		{ "ShowName" : "GuoF", "Value" : 12 }, 
		{ "ShowName" : "QiH", "Value" : 13 }, 
		{ "ShowName" : "YiTS", "Value" : 14 }, 
		{ "ShowName" : "GuoFDS", "Value" : 15 }, 
		{ "ShowName" : "MeiDWS", "Value" : 16 },
		{ "ShowName" : "CYSD", "Value" : 18 },
		{ "ShowName" : "Weida", "Value" : 19 } 
		] ;
	var remoteType = [
		"General", "AnJF", "SiL", "DuoPWS", "TaiA", "XinDGC", "MeiF",
		"HaiRSX", "KaiKD", "DeJL", "R8CA", "XinKA", "GuoF",
		"QiH", "YiTS", "GuoFDS", "MeiDWS", "XuFWS", "CYSD"
	];
	var padType = [
		"General", "GFDS_11K4L", "DVR_17K4L", "GZHS_18K4L", "TS8OB_7K4L",
		"ZHJD_16K3L", "XFWS_13K3L", "XFWS_17K3L", "SZYL_15K4L", "SZPNK_16K3L"
	];
	var pageTitle = $("#Info_Version").text();
	function ShowData(){
		$("#VersionSystem").val(gDevice.loginRsp.SoftWareVersion);
		$("#VersionChannel").val(gDevice.loginRsp.ChannelNum);
		$("#VersionExChan").val(gDevice.loginRsp.ExtraChannel);
		$("#VersionAlarmIn").val(gDevice.loginRsp.AlarmInChannel);
		$("#VersionAlarmOutput").val(gDevice.loginRsp.AlarmOutChannel);
		$("#VersionBuildDate").val(gDevice.loginRsp.BuildTime);
		if (gDevice.loginRsp.DeviceRunTime) {
			var nRunTime = 0;
			var nDay = 0; 
			var nHour = 0;
			var nMin = parseInt(gDevice.loginRsp.DeviceRunTime);
			if ( nMin >= 60) {
				nHour = parseInt(nMin / 60);
				nMin = parseInt(nMin % 60);
				if ( nHour > 0) {
					nDay = parseInt(nHour / 24);
					nHour = parseInt(nHour % 24);
				}
			}
			if (nDay) {
				nRunTime = nDay*24+nHour
			} else {
				nRunTime = nHour;
			}
			var Type = parseInt(gDevice.loginRsp.UpdataType);
			if (Type) {
				var temp, temp1, temp2, temp3;
				temp = gDevice.loginRsp.UpdataTime;
				var nCount=0;
				for (var i=0;i < temp.length;i++)
				{
					var ch = temp.charAt(i);
					if (ch == ' ') {
						break;
					}
					if (ch == '.') {
						nCount=0;
						break;
					}else if (ch == '-') {
						nCount=1;
						break;
					}else if(ch == '/') {
						nCount=2;
						break;
					}
				
				}
				var count1,count2;
				if (nCount==0)
				{
					count1 = temp.indexOf('.');
				}else if (nCount==1)
				{
					count1 = temp.indexOf('-');
				}else
				{
					count1 = temp.indexOf('/');
				}
				temp1 = temp.substr(0,count1);
				temp1 = temp1.charAt(temp1.length-2) + temp1.charAt(temp1.length-1);
				if (nCount==0)
				{
					count2 = temp.lastIndexOf('.');
				}else if (nCount==1)
				{
					count2 = temp.lastIndexOf('-');
				}else
				{
					count2 = temp.lastIndexOf('/');
				}
				temp2 = parseInt(temp.substr(count1+1, count2-count1-1));
				if (temp2 < 10) {
					temp2 = "0" + temp2;
				}
				var count4 = temp.lastIndexOf(' ');
				temp3 = parseInt(temp.substr(count2+1, count4-count2-1));
				if (temp3 < 10) {
					temp3 = "0" + temp3;
				}
				nRunTime += "-";
				nRunTime += temp1 + temp2 + temp3;
				temp1 = parseInt(gDevice.loginRsp.UpdataType);
				if (temp1 < 10) {
					temp1 = "00" + temp1;
				}else if (temp1 < 100) {
					temp1 = "0" + temp1;
				}
				nRunTime += temp1;
				 
			}
			$("#VersionSystemStatus").val(nRunTime);
			$("#table_Sys_status").css("display", "");
		}
		if(bSupportNat){
			$("#VersionNatStatus").val(lg.getEx(NetInfo[NetInfo.Name].NatStatus));
			$("#VersionNatStatusCode").val(NetInfo[NetInfo.Name].NaInfoCode);
			$("#table_nat_status").css("display", "");
			$("#table_nat_status_code").css("display", "");
		}
		$("#VersionSerialID").val(gDevice.loginRsp.SerialNo);
		if(bSupportMCUVer && cfgSystemInfoEx != null)
		{
			$("#table_mcu_version").css("display", "");
			$("#MCUVersion").val(cfgSystemInfoEx[cfgSystemInfoEx.Name].McuVersion);
		}
		// 福克斯子客户定制
		if(typeof g_customSerialIDLan != "undefined" && typeof g_customSerialIDLan == "string"
			&& g_customSerialIDLan != "")
		{
			$("#Version_Serial_ID").html(g_customSerialIDLan);
		}
		if(typeof g_customSerialID != "undefined" && typeof g_customSerialID == "string"
			&& g_customSerialID != "")
		{
			$("#VersionSerialID").val(g_customSerialID);
		}
		if(typeof g_customNatStatusLan != "undefined" && typeof g_customNatStatusLan == "string"
			&& g_customNatStatusLan != "")
		{
			$("#Version_Nat_Status").html(g_customNatStatusLan);
		}
		if(typeof g_customNatStatus != "undefined" && typeof g_customNatStatus == "string"
			&& g_customNatStatus != "")
		{
			$("#VersionNatStatus").val(g_customNatStatus);
		}
		MasklayerHide();
	}
	//人脸、虚拟Net Card配置
	function GetFunctionEnable()
	{
		if(gDevice.devType != devTypeEnum.DEV_IPC && (GetFunAbility(gDevice.Ability.PreviewFunction.NetVniceControl) 
			|| GetFunAbility(gDevice.Ability.PreviewFunction.FaceFuntionControl)))
		{
			RfParamCall(function(a){
				cfgFunctionEnable = null;
				if(a.Ret == 100)
				{
					cfgFunctionEnable = a;
				}
				GetMCUVersion();
			}, pageTitle, "Ability.FunctionEnable", -1, WSMsgID.WsMsgID_CONFIG_GET, null, true);
		}
		else
		{
			GetMCUVersion();
		}
	}
	// MCUVersion号
	function GetMCUVersion()
	{
		if(bSupportMCUVer)
		{
			RfParamCall(function(a){
				cfgSystemInfoEx = null;
				if(a.Ret == 100)
				{
					cfgSystemInfoEx = a;
				}
				ShowData();
			}, pageTitle, "SystemInfoEx", -1, WSMsgID.WsMsgID_SYSINFO_REQ, null, true);
		}
		else
		{
			ShowData();
		}
	}
	function SetFunctionEnable()
	{
		if(gDevice.devType != devTypeEnum.DEV_IPC && cfgFunctionEnable != null)
		{
			cfgFunctionEnable[cfgFunctionEnable.Name].FaceFunctionEnable = $("#FaceDetectSwitch").prop("checked");
			cfgFunctionEnable[cfgFunctionEnable.Name].VNICFunctionEnable = $("#EnableVirtualNetworkCard").prop("checked");
			RfParamCall(function(a){
				if(a.Ret == 603)
				{
					bReboot = true;
				}
				SaveMaxPreviewNum();
			}, sDevInfoTitle, "ProductTrail", -1, WSMsgID.WsMsgID_CONFIG_SET, cfgFunctionEnable, true);
		}
		else
		{
			SaveMaxPreviewNum();
		}
	}
	function SaveMaxPreviewNum(){
		if(bAutoCreateDestory && MaxPreviewNum != null){
			var nSel = $("#PreviewMaxChannel").val() * 1;
			var bSaveAuto = false;
			var SupportChannel = MaxPreviewNum[MaxPreviewNum.Name].SupportChannel;
			if(MaxPreviewNum[MaxPreviewNum.Name].PreviewNum != SupportChannel[nSel]){
				MaxPreviewNum[MaxPreviewNum.Name].PreviewNum = SupportChannel[nSel];
				MaxPreviewNum[MaxPreviewNum.Name].SupportChannel = [];
				bSaveAuto = true;
			}
			if(bSaveAuto){
				RfParamCall(function(a){
					closeDialog();
					if(a.Ret == 100){
						ShowPaop(sDevInfoTitle, lg.get("IDS_ELECT_SUCCESS"));
						window.setTimeout(function() {
							AutoClose(sDevInfoTitle)
						}, 1000);
					}else{
						if(a.Ret == 603){
							bReboot = true;
						}
						if(bReboot)
						{
							RebootDev(sDevInfoTitle, lg.get("IDS_CONFIRM_RESTART"), true);
						}
						else
						{
							ShowPaop(sDevInfoTitle, lg.get("IDS_SAVE_SUCCESS"));
						}
					}
				}, sDevInfoTitle, "fVideo.MaxPreviewNum", -1, WSMsgID.WsMsgID_CONFIG_SET, MaxPreviewNum, true);
			}else{
				closeDialog();
				if(bReboot)
				{
					RebootDev(sDevInfoTitle, lg.get("IDS_CONFIRM_RESTART"), true);
				}
				else
				{
					ShowPaop(sDevInfoTitle, lg.get("IDS_SAVE_SUCCESS"));
				}
			}
		}
		else{
			closeDialog();
			if(bReboot)
			{
				RebootDev(sDevInfoTitle, lg.get("IDS_CONFIRM_RESTART"), true);
			}
			else
			{
				ShowPaop(sDevInfoTitle, lg.get("IDS_SAVE_SUCCESS"));
			}
		}
	}
	function GetAudioAcquisitionMode(){
		bAcquisition = false;
		if(gDevice.devType != devTypeEnum.DEV_IPC && gDevice.loginRsp.VideoInChannel > 0){
			RfParamCall(function(a){
				if(a.Ret == 100){
					if(a[a.Name]["AudioAcquisitionMode"][0] > 0){
						bAcquisition = true;
					}
				}
				GetFunctionEnable();
			}, pageTitle, "fVideo.AudioAcquisitionMode", -1,WSMsgID.WsMsgID_CONFIG_GET, null, true);
		}else {
			GetFunctionEnable();
		}
	}
	function GetAbilitySeriaNo(){
		if(bShowProductType){
			$("#table_product_type").css("display", "");
			if(typeof g_defalutProductTypeKey == "string" && g_defalutProductTypeKey != "")
			{
				$("#Version_Product_Type").html(g_defalutProductTypeKey);
			}
			RfParamCall(function(a){
				$("#ProductType").val(a[a.Name].ProductType);
				GetAudioAcquisitionMode();
			}, pageTitle, "Ability.SerialNo", -1,WSMsgID.WsMsgID_CONFIG_GET, null, true);
		}else{
			GetAudioAcquisitionMode();
		}
	}
	function GetVersionCfg(){
		var SystemVersion = gDevice.loginRsp.SoftWareVersion;
		bSupportNat = false;
		var arr = SystemVersion.split(".");
		if (arr!= null && arr.length > 4) {
			if (arr[4].substr(0,1) == "1") {
				RfParamCall(function(a){
					NetInfo = a;
					bSupportNat = true;
					GetAbilitySeriaNo();
				}, pageTitle, "Status.NatInfo", -1, WSMsgID.WsMsgID_CONFIG_GET);
			}else{
				GetAbilitySeriaNo();
			}
		}else{
			GetAbilitySeriaNo();
		}
	}
	$(function() {
		$("#DevInfoBtn").click(function(){
			if(!bDeviceDesc){
				return;
			}

			SetWndTop("#DevInfo_Dialog");
			MasklayerShow(1);
			$("#DevInfo_Dialog").show(function(){
				DevInfo_Title.innerHTML = lg.get("IDS_VER_DeviceInfo");
				AudioInChannelL.innerHTML = lg.get("IDS_VER_NumAudioIn");
				AlarmInChannelL.innerHTML = lg.get("IDS_VER_NumAlarmIn");
				AlarmOutChannelL.innerHTML = lg.get("IDS_VER_NumAlarmOut");
				RemoteTypeL.innerHTML = lg.get("IDS_VER_RemoteType");
				PadTypeL.innerHTML = lg.get("IDS_VER_PadType");
				MaxPlaybackL.innerHTML = lg.get("IDS_VER_MaxPalyNumber");
				DefaultPBL.innerHTML = lg.get("IDS_VER_DefualtPalyNumber");
				BuzzerL.innerHTML = lg.get("IDS_VER_BUZZER");
				RS232L.innerHTML = lg.get("IDS_VER_EnableComm");
				PTZL.innerHTML = lg.get("IDS_VER_EnablePtz");
				FaceDetectL.innerHTML = lg.get("IDS_VER_EnableFaceDetect");
				EnableVisualNetworkCardL.innerHTML = lg.get("IDS_EnableVirtualNetworkcard");
				DevInfo_Confirm.innerHTML = lg.get("IDS_OK");
				DevInfo_Cancel.innerHTML = lg.get("IDS_CANCEL");
				if(bAutoCreateDestory){
					$("#MaxPlayback_Div, #DefaultPB_Div").css("display", "none");
					PreviewMaxChannelL1.innerHTML = lg.get("IDS_MODE_PREVIEWMAXSUPPORT") + " :";
					$("#PreviewMaxDiv").css("display", "");

				}
				var cfg = DeviceDescCfg[DeviceDescCfg.Name];
				if(bAcquisition){
					$("#AudioInChannel").val("0");
					$("#AudioInChannel").prop("disabled", true);
				}else{
					$("#AudioInChannel").val(cfg.AudioInChannel);
					$("#AudioInChannel").prop("disabled", false);
				}
				$("#AlarmInChannel").val(cfg.AlarmInChannel);
				$("#AlarmOutChannel").val(cfg.AlarmOutChannel);
				$("#MaxPlayback").val(cfg.localPalyMax)
				$("#DefaultPBSwitch").prop("checked", cfg.EnablePlayDefault);
				$("#DefaultPB").val(cfg.localPalyDefault);
				if(cfg.EnablePlayDefault){
					$("#DefaultPB").css("display", "");
				}else{
					$("#DefaultPB").css("display", "none");
				}

				$("#RemoteType_Div").css("display", "");
				$("#PadType_Div").css("display", "");

				// Buzzer常显, PTZ和Comm隐藏
				var nBeep = cfg.EnableBeep.substr(cfg.EnableBeep.length - 1) * 1;
				$("#BuzzerSwitch").prop("checked", nBeep ? true : false);
				$("#Buzzer_Div").css("display", "");

				$("#RemoteType").empty();
				var strHtml = "";
				for(var i = 0; i < padRemoteCfg.RemoteType.length; i++){
					strHtml += "<option value='"+padRemoteCfg.RemoteType[i].Value+"'>" + padRemoteCfg.RemoteType[i].ShowName + "</option>"
				}
				$("#RemoteType").append(strHtml);

				$("#PadType").empty();
				strHtml = "";
				for(var i = 0; i < padRemoteCfg.PadType.length; i++)
				{
					strHtml += "<option value='"+padRemoteCfg.PadType[i].Value+"'>" + padRemoteCfg.PadType[i].ShowName + "</option>"
				}

				if(bAutoCreateDestory){
					RfParamCall(function(a){
						if(a.Ret == 100)
						{
							MaxPreviewNum = a;
							$("#PreviewMaxChannel").empty();
							var SupportChannel = MaxPreviewNum[MaxPreviewNum.Name].SupportChannel;
							var nIndex = 0;
							for(i = 0; i < SupportChannel.length; i++){
								$("#PreviewMaxChannel").append('<option value="' + i + '">' + SupportChannel[i] + '</option>');
								if(MaxPreviewNum[MaxPreviewNum.Name].PreviewNum == SupportChannel[i]){
									nIndex = i;
								}
							}
							$("#PreviewMaxChannel").val(nIndex);
						}
					}, sDevInfoTitle, "fVideo.MaxPreviewNum", -1, WSMsgID.WsMsgID_CONFIG_GET, null, true);
				}
				

				$("#PadType").append(strHtml);

				$("#RemoteType").val(cfg.RemoteType); 
				$("#PadType").val(cfg.PadType);

				if(cfgFunctionEnable != null)
				{
					if(GetFunAbility(gDevice.Ability.PreviewFunction.FaceFuntionControl))
					{
						//人脸
						$("#FaceDetect_Div").css("display", "");
						$("#FaceDetectSwitch").prop("checked", cfgFunctionEnable[cfgFunctionEnable.Name].FaceFunctionEnable);
					}
					if(GetFunAbility(gDevice.Ability.PreviewFunction.NetVniceControl))
					{
						//虚拟Net Card
						$("#EnableVirtualNetworkCard_Div").css("display", "");
						$("#EnableVirtualNetworkCard").prop("checked", cfgFunctionEnable[cfgFunctionEnable.Name].VNICFunctionEnable);
					}
				}

				$("#DefaultPBSwitch").unbind().click(function(a){
					var bEnable = $(this).prop("checked");
					if(bEnable){
						$("#DefaultPB").css("display", "");
					}else{
						$("#DefaultPB").css("display", "none");
					}
				});

				$("#DevInfo_Dialog .inputTxt").unbind();
				$("#DevInfo_Dialog .inputTxt").keyup(function(){
					var id = $(this).prop("id");
					var nMax = 0;
					var nMin = 0;
					switch (id){
						case "AudioInChannel":
							nMax = gDevice.loginRsp.AudioInChannel;
							break;
						case "AlarmInChannel":
							nMax = gDevice.loginRsp.AlarmInChannel; 
							break;
						case "AlarmOutChannel":
							nMax = gDevice.loginRsp.AlarmOutChannel; 
							break;
						case "MaxPlayback":
							nMax = nPlayBlackNum;
							nMin = 1;
							break;
						case "DefaultPB":
							nMax = nPlayBlackNum;
							nMin = 1;
							break;
						default:
							break;
					}
					if(keyboardFilter(event)) {
						NumberRange(this, nMin, nMax, -1);
					}
				});

				$("#DevInfo_Dialog .inputTxt").blur(function(){
					var id = $(this).prop("id");
					var nMax = 0;
					var nMin = 0;
					switch (id){
						case "AudioInChannel":
							nMax = gDevice.loginRsp.AudioInChannel;
							break;
						case "AlarmInChannel":
							nMax = gDevice.loginRsp.AlarmInChannel; 
							break;
						case "AlarmOutChannel":
							nMax = gDevice.loginRsp.AlarmOutChannel; 
							break;
						case "MaxPlayback":
							nMax = nPlayBlackNum;
							nMin = 1;
							break;
						case "DefaultPB":
							nMax = nPlayBlackNum;
							nMin = 1;
							break;
						default:
							break;
					}
					NumberRange(this, nMin, nMax, -1);
				});

				$("#DevInfo_Confirm").unbind().click(function(){
					var localPalyDefault = $("#DefaultPB").val() * 1;
					var localPalyMax = $("#MaxPlayback").val() * 1;
					if(localPalyDefault > localPalyMax){
						ShowPaop(pageTitle, lg.get("IDS_VER_PlayDefaultError"));
						return;
					}
					var cfg = DeviceDescCfg[DeviceDescCfg.Name];
					if(!bAcquisition){
						cfg.AudioInChannel = $("#AudioInChannel").val() * 1;
					}
					cfg.AlarmInChannel = $("#AlarmInChannel").val() * 1;
					cfg.AlarmOutChannel = $("#AlarmOutChannel").val() * 1;
					cfg.localPalyMax = localPalyMax;
					cfg.EnablePlayDefault = $("#DefaultPBSwitch").prop("checked");
					if(cfg.EnablePlayDefault){
						cfg.localPalyDefault = localPalyDefault;
					}

					cfg.EnableComm = $("#RS232Switch").prop("checked");
					cfg.EnablePtz = $("#PTZSwitch").prop("checked");
					cfg.RemoteType = $("#RemoteType").val()*1;
					cfg.PadType = $("#PadType").val()*1;	

					var mask = $("#BuzzerSwitch").prop("checked") ? "0x00000081" : "0x00000080";
					cfg.EnableBeep = mask;
					
					bReboot = false;
					RfParamCall(function(a){
						if(a.Ret == 603){
							bReboot = true;
						}
						SetFunctionEnable();
					}, sDevInfoTitle, "Ability.DeviceDesc", -1, WSMsgID.WsMsgID_CONFIG_SET, DeviceDescCfg);
				});
			});
		});

		if(gDevice.devType != devTypeEnum.DEV_IPC){
			RfParamCall(function(a, b){
				if(a.Ret == 100){
					padRemoteCfg = a[a.Name];
				}
				RfParamCall(function(c, d){
					if(a.Ret == 100){
						bDeviceDesc = true;
						DeviceDescCfg = c;
						$("#DevInfo_btn_box").css("display", "");
						RfParamCall(function(e, f){
							var nCurChnsMode = e[e.Name].CurChnsMode;
							var cfg = e[e.Name].TotalChnsMode[nCurChnsMode];
							nPlayBlackNum = cfg.DigitalCapPlay;
							GetVersionCfg();
						}, pageTitle, "NetWork.ChnMode", -1, WSMsgID.WsMsgID_CONFIG_GET);
					}else{
						GetVersionCfg();
					}
				}, pageTitle, "Ability.DeviceDesc", -1, WSMsgID.WsMsgID_CONFIG_GET, null, true);
			}, pageTitle, "RemoteAndPadType", -1, WSMsgID.WsMsgID_ABILITY_GET, null, true);
		}else{
			GetVersionCfg();
		}
	});
});