//# sourceURL=IPCParam_Advanced.js
$(document).ready(function () {
    var chnIndex = -1;
	var CameraCfg;
	var CameraExCfg;
	var ClearFogCfg;
	var CameraAblity;
	var _Defaultelect=50;
	var pageTitle = $("#IPCParam_Advanced").text();
	var _bWidth = false;
	var _bClearFog = false;
	var channelFun;
	var VolumeCfg;
	var _bSupportSetVolume = false;

	function ShowLevel(id){
		var mode = "#" + id;
		var bEnable = $(mode).prop("checked");
		switch(id){
		case "IPC_GainModeSwitch":
			if(bEnable){
				DivBox(1, "#IPC_Gainwide");
			} else {
				DivBox(0, "#IPC_Gainwide");
			}
			break;
		case "IPC_DefogModeSwitch":
			if(bEnable){
				DivBox(1, "#IPC_Defog_level");
			} else {
				DivBox(0, "#IPC_Defog_level");
			}
			break;
		}
	}

	function ShowData() {
		EnableBox(false);
		var cfg = CameraCfg[CameraCfg.Name];	
		$("#IPCExposure_Mode").val(cfg.ExposureParam.Level);
		$("#IPCExposure_Mode").change();
		if(0.0 == parseInt(cfg.ExposureParam.LeastTime,16) || 0.0 == parseInt(cfg.ExposureParam.MostTime,16)){
			$("#min_time_id").val("0.0");
			$("#max_time_id").val("80.0");
		} else {
			$("#min_time_id").val(parseInt(cfg.ExposureParam.LeastTime,16)/1000);
			$("#max_time_id").val(parseInt(cfg.ExposureParam.MostTime,16)/1000);
		}

		var nApertureMode = parseInt(cfg.ApertureMode, 16)
		$("#IPC_Cam_Iris").prop("checked", nApertureMode ? true : false);
		var nBLCMode = parseInt(cfg.BLCMode, 16);
		$("#IPC_Cam_BLC").prop("checked", nBLCMode ? true : false);
		$("#IPC_Cam_AE").val(cfg.ElecLevel);
		$("#IPC_Cam_AE_Default").text(_Defaultelect);
		if(_bWidth && isObject(CameraExCfg)){
			var CfgEx = CameraExCfg[CameraExCfg.Name];
			if (isObject(CameraAblity) && CameraAblity.SupportPreventOverExpo == 1) {
				$("#PreOverExposureSpan").css("display", "");
				$("#IPC_PreOverExposureSwitch").prop("checked", parseInt(CfgEx.PreventOverExpo) ? true : false);
			}else {
				$("#PreOverExposureSpan").css("display", "none");
			}
		}else{
			$("#PreOverExposureSpan").css("display", "none");
		}
		$("#IPC_Cam_Sen").slider("setValue", cfg.AeSensitivity);
		if(_bClearFog){
			$("#IPC_DefogModeSwitch").prop("checked", ClearFogCfg[ClearFogCfg.Name].enable);
			ShowLevel("IPC_DefogModeSwitch");
			$("#IPCCam_DefogThreshTarget").val(ClearFogCfg[ClearFogCfg.Name].level);
			$("#IPC_Defog_Mode_Div").css("display", "");
		}else{
			$("#IPC_Defog_Mode_Div").css("display", "none");
		}
		$("#IPC_GainModeSwitch").prop("checked", cfg.GainParam.AutoGain ? true : false);
		ShowLevel("IPC_GainModeSwitch");

		$("#IPC_Cam_GainStrength").val(cfg.GainParam.Gain);
		$("#IPCCam_Slow_shutter").val(parseInt(parseInt(cfg.EsShutter, 16)/2));
		$("#IPC_IR_CUTR").val(cfg.IRCUTMode);
		$("#IPCday_dn_id").val(cfg.Day_nfLevel);
		$("#IPCnight_dn_id").val(cfg.Night_nfLevel);
		$("#IPC_AntiSwitch").prop("checked", parseInt(cfg.RejectFlicker, 16) ? true : false);

		if(_bSupportSetVolume){
			$("#IPC_Volume_Div").css("display", "");
			$("#IPC_Volume").slider("setValue", VolumeCfg[VolumeCfg.Name][0].LeftVolume);
		}else{
			$("#IPC_Volume_Div").css("display", "none");
		}

		InitButton();
		MasklayerHide();
    }
	function EnableBox(bShow, Ret){
		if(bShow){
			$("#AdvacedSet_Box .MaskDiv").css("display", "block");
			$("#IPC_Gainwide, #IPC_Defog_level").css("opacity", "1");
			DivBox(0, "#AdvacedSet_Box");
			$("#ChncamSV").attr("disabled", true);
			$("#ChncamSV").stop().addClass("btn-disable").fadeTo("slow", 0.2);
			if(typeof Ret != "undefinded" && Ret == 107){
				ShowPaop(pageTitle, lg.get("IDS_NO_POWER"));
			}
			else{
				ShowPaop(pageTitle, lg.get("GetConfigFail"));
			}
		}else{
			$("#AdvacedSet_Box .MaskDiv").css("display", "none");
			DivBox(1, "#AdvacedSet_Box");
			$("#ChncamSV").attr("disabled", false);
			$("#ChncamSV").stop().removeClass("btn-disable").fadeTo("slow", 1);
		}	
	}
	function GetVolumeCfg(){
		if(_bSupportSetVolume){
			RfParamCall(function(a){
				VolumeCfg = a;
				ShowData();
			}, pageTitle, "fVideo.Volume", chnIndex, WSMsgID.WsMsgID_CONFIG_GET);
		}else{
			ShowData();
		}
	}

	function GetClearFog(){
		RfParamCall(function(a){
			_bClearFog = false;
			if(a.Ret == 100){
				ClearFogCfg = a;
				_bClearFog = true;
			}
			GetVolumeCfg();
		}, pageTitle, "Camera.ClearFog", chnIndex, WSMsgID.WsMsgID_CONFIG_GET);
	}
	function GetCameraCfg(){
		RfParamCall(function(a){
			if(a.Ret != 100){
				EnableBox(true, a.Ret);
				MasklayerHide();
				return;
			}
			CameraCfg = a;
			if(_bWidth){
				CameraExCfg = null;
				RfParamCall(function(a){
					if(a.Ret != 100){
						EnableBox(true, a.Ret);
						MasklayerHide();
						return;
					}
					CameraExCfg = a;
					GetClearFog();
				}, pageTitle, "Camera.ParamEx", chnIndex, WSMsgID.WsMsgID_CONFIG_GET, null, true);
			}else{
				GetClearFog();
			}
		}, pageTitle, "Camera.Param", chnIndex, WSMsgID.WsMsgID_CONFIG_GET, null, true);
	}
	function GetCameraAblity(){
		_bWidth = channelFun.BroadTrends[chnIndex];
		_bSupportSetVolume = channelFun.SupportSetVolume[chnIndex];

		$("#IPCExposure_Mode").empty();
		$("#IPCExposure_Mode").append('<option value="0">' + lg.get("IDS_CAM_ExposureAuto") + '</option>');
		RfParamCall(function(a){
			CameraAblity = a[a.Name];
			if(a.Ret != 100){
				EnableBox(true, a.Ret);
				MasklayerHide();
				return;
			}
			if (isObject(CameraAblity)) {
				_Defaultelect = CameraAblity.ElecLevel;
				for (var m = 0; m < CameraAblity.Count; m++) {
					for (var n = m; n < CameraAblity.Count - 1; n++) {
						var ntemp = 0;
						if (CameraAblity.Speeds[m] < CameraAblity.Speeds[n + 1]) {
							ntemp = CameraAblity.Speeds[m];
							CameraAblity.Speeds[m] = CameraAblity.Speeds[n + 1];
							CameraAblity.Speeds[n + 1] = ntemp;
						}
					}
				}
				for (var j = 0; j < CameraAblity.Count; j++) {
					var temp = "1/" + parseInt(1000000 / parseInt(CameraAblity.Speeds[j]));				
					$("#IPCExposure_Mode").append('<option value="' + (j + 1) + '">' + (lg.get("IDS_CAM_ExposureManual")+"_"+temp) + '</option>');
				}
			}
			GetCameraCfg();
		}, pageTitle, "ChannelCameraAbility", chnIndex, WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ, null, true);
	}
	function GetChannelFunc(){
		RfParamCall(function(a){
			channelFun = a[a.Name];
			if(typeof channelFun.SupportDoubleLightBoxCamera == 'undefined'){
				channelFun.SupportDoubleLightBoxCamera = [];
				for(var i = 0; i < gDevice.loginRsp.ChannelNum; i++){
					channelFun.SupportDoubleLightBoxCamera[i] = 0;
				}
			}
			GetCameraAblity();
		}, pageTitle, "ChannelSystemFunction", -1, WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ);
	}
	function InitChannel(){
		$("#ChncamChannelMask").empty();
		var chnArry = [];
		if(gDevice.loginRsp.DigChannel > 0){
			RfParamCall(function(a){
				var ssDigitChStatus = a[a.Name];
				RfParamCall(function(b){
					var ssRemoteDevice = b[b.Name];
					for (var i = gDevice.loginRsp.VideoInChannel; i < gDevice.loginRsp.ChannelNum; i++) {
						var m = i - gDevice.loginRsp.VideoInChannel;
						if (ssDigitChStatus[m].Status != "Connected") {
								continue;
						}
						var nIndex = ssRemoteDevice[m].SingleConnId - 1;
						if	(ssRemoteDevice[m].ConnType == "SINGLE" && nIndex >= 0
							&& ssRemoteDevice[m].Decoder[nIndex].Protocol == "TCP"){
							if(chnIndex == -1){
								chnIndex = i;
							}
							chnArry.push(i);
							var dataHtml = '<option value="' + i + '">' + gDevice.getChannelName(i) + '</option>';
							$("#ChncamChannelMask").append(dataHtml);
						}
					}
					if(chnArry.length > 0){
						if($.inArray(chnIndex, chnArry) < 0){
							chnIndex = chnArry[0];
						}
						$("#ChncamChannelMask").val(chnIndex);
						GetChannelFunc();
					}else{
						MasklayerHide();
						$("#IPCAdvanced_page").hide();
						ShowPaop(pageTitle, lg.get("IDS_CHSTA_NoConfig"));
					}
				}, pageTitle, "NetWork.RemoteDeviceV3", -1, WSMsgID.WsMsgID_CONFIG_GET); 
			}, pageTitle, "NetWork.ChnStatus", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}else{
			ShowChildConfigFrame(pageTitle, false, false);
			ShowPaop(pageTitle, lg.get("IDS_CHSTA_NoConfig"));
			MasklayerHide();
		}
	}
	function SaveSelChn() {
		var cfg = CameraCfg[CameraCfg.Name];
		cfg.ExposureParam.Level = $("#IPCExposure_Mode").val() * 1;
		var temp = '0x' + toHex($("#min_time_id").val() * 1000, 8);
		cfg.ExposureParam.LeastTime = temp;
		temp = '0x' + toHex($("#max_time_id").val() * 1000, 8);
		cfg.ExposureParam.MostTime = temp;
		cfg.ApertureMode = '0x' + toHex($("#IPC_Cam_Iris").prop("checked") * 1, 8);
		cfg.BLCMode = '0x' + toHex($("#IPC_Cam_BLC").prop("checked") * 1, 8);
		cfg.ElecLevel = $("#IPC_Cam_AE").val() * 1;
		cfg.AeSensitivity = $("#IPC_Cam_Sen").slider("getValue");
		cfg.GainParam.AutoGain = $("#IPC_GainModeSwitch").prop("checked") * 1;
		cfg.GainParam.Gain = $("#IPC_Cam_GainStrength").val() *1
		cfg.EsShutter = '0x' + toHex($("#IPCCam_Slow_shutter").val() * 2, 8);
		cfg.IRCUTMode = $("#IPC_IR_CUTR").val() * 1;
		cfg.Day_nfLevel = $("#IPCday_dn_id").val() * 1;
		cfg.Night_nfLevel = $("#IPCnight_dn_id").val() * 1;
		cfg.RejectFlicker = '0x' + toHex($("#IPC_AntiSwitch").prop("checked") * 1, 8);

		if(_bWidth && isObject(CameraExCfg)){
			var cfgEx = CameraExCfg[CameraExCfg.Name];
			if (isObject(CameraAblity) && CameraAblity.SupportPreventOverExpo == 1) {
				cfgEx.PreventOverExpo = $("#IPC_PreOverExposureSwitch").prop("checked") *1;
			}
		}
		if(_bClearFog){
			ClearFogCfg[ClearFogCfg.Name].enable = $("#IPC_DefogModeSwitch").prop("checked");
			ClearFogCfg[ClearFogCfg.Name].level = $("#IPCCam_DefogThreshTarget").val() *1;
		}

		if(_bSupportSetVolume){
			VolumeCfg[VolumeCfg.Name][0].LeftVolume = $("#IPC_Volume").slider("getValue");
			VolumeCfg[VolumeCfg.Name][0].RightVolume = $("#IPC_Volume").slider("getValue");
		}
	}
	
	function SaveClearFog(){
		if(_bClearFog){
			RfParamCall(function(a){
				SaveVolumeCfg();
			}, pageTitle, "Camera.ClearFog", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, ClearFogCfg);
		}else{
			SaveVolumeCfg();
		}
	}

	function SaveVolumeCfg(){
		if(_bSupportSetVolume){
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "fVideo.Volume", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, VolumeCfg);
		}else{
			ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
		}
	}
    $(function () {
		$("#IPCCam_Slow_shutter").empty();
		var strArr = ["None", "Low", "Mid", "High"]
		for (var i=0; i < 4; i++) {
			$("#IPCCam_Slow_shutter").append('<option value="'+i+'">'+ lg.get("IDS_CAM_Shutter"+strArr[i]) +'</option>');
		}
		$("#IPC_IR_CUTR").empty();
		$("#IPC_IR_CUTR").append('<option value="0">'+ lg.get("IDS_CAM_SyncSwitch") +'</option>');
		$("#IPC_IR_CUTR").append('<option value="1">'+ lg.get("IDS_CAM_AutoSwitch") +'</option>');
		$("#IPCday_dn_id").empty();
		$("#IPCnight_dn_id").empty();
		for (var i=0; i < 6; i++) {
			$("#IPCday_dn_id").append('<option value="'+i+'">'+i+'</option>');
			$("#IPCnight_dn_id").append('<option value="'+i+'">'+i+'</option>');
		}

		$("#IPC_Cam_Sen").slider({width: 130, minValue: 1, maxValue: 10, mouseupCallback: null});
		$("#IPC_Volume").slider({width: 130, minValue: 0, maxValue: 100, mouseupCallback: null});

		$("#IPC_GainModeSwitch, #IPC_DefogModeSwitch").click(function () {
			ShowLevel($(this).attr('id'));
		});

		$("#IPCExposure_Mode").change(function () {
			if($("#IPCExposure_Mode").val() * 1 == 0){
				$("#exposure_autoDiv").css("display", "");
			}else{
				$("#exposure_autoDiv").css("display", "none");
			}
		});
		$("#ChncamChannelMask").change(function () {
			chnIndex = $("#ChncamChannelMask").val() * 1;
			GetChannelFunc();
		});
		$("#ChncamRf").click(function () {
			InitChannel();
		});
		$("#min_time_id, #max_time_id").keyup(function () {
			if (!/^\d+\.?\d*$/.test($(this).val())) {
				var tmp = /^\d+\.?\d*/.exec($(this).val());
				if(tmp == null){
					tmp = '';
				}
				$(this).val(tmp);
			}
			if(parseFloat($(this).val()) > 80){
				$(this).val(80);
			}
		});
		$("#min_time_id, #max_time_id").blur(function () {
			if(parseFloat($(this).val()) < 0.1 || $(this).val() == ''){
				$(this).val(0.1);
			}
			$(this).val(parseFloat($(this).val()));
			
			var LeastTime = parseFloat($("#min_time_id").val());
			var MostTime = parseFloat($("#max_time_id").val());
			if(MostTime < LeastTime){
				$("#max_time_id").val(LeastTime);
				$("#min_time_id").val(LeastTime);
			}
		});
		$("#ChncamSV").click(function () {
			SaveSelChn();
			RfParamCall(function(a,b){
				if(_bWidth && isObject(CameraExCfg)){
					RfParamCall(function(a, b){
						SaveClearFog();
					}, pageTitle, "Camera.ParamEx", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, CameraExCfg);
				}else{
					SaveClearFog();
				}
			}, pageTitle, "Camera.Param", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, CameraCfg);
		});

		ChangeBtnState();
		InitChannel();
    });
});