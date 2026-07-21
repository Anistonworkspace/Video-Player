$(document).ready(function () {
    var chnIndex = -1;
	var CameraCfg;
	var CameraExCfg;
	var CameraAblity;
	var SpecialNightCfg;
	var pageTitle = $("#System_CameraParam_Simp").text();
	var _bWidth = GetFunAbility(gDevice.Ability.OtherFunction.SupportBT);
	var _bHumanCfg = GetFunAbility(gDevice.Ability.AlarmFunction.HumanDection);
	var motionCfg;
	var humanCfg;
	var _bCorridorMode = GetFunAbility(gDevice.Ability.OtherFunction.SupportCorridorMode);
	var _bSpecialNight = GetFunAbility(gDevice.Ability.OtherFunction.SpecialNight);
	var _bLP4G = GetFunAbility(gDevice.Ability.OtherFunction.LP4GSupportDoubleLightSwitch);
	var LP4GLedParameter;
	var _bListCameraDayLightModes = GetFunAbility(gDevice.Ability.OtherFunction.SupportListCameraDayLightModes);
	var CameraDayLightModes;
	
	function UpdateDNMode(){
		$("#Cam_DNMode").empty();
		if(_bLP4G){
			$("#Cam_DNMode").append('<option value="' + 0 + '">' + lg.get("IDS_CAM_StarIR") + '</option>');
			$("#Cam_DNMode").append('<option value="' + 1 + '">' + lg.get("IDS_CAM_Color") + '</option>');
			return;
		}

		if(_bListCameraDayLightModes && typeof CameraDayLightModes != 'undefined' && CameraDayLightModes.length > 0){
			var strModes = [lg.get("IDS_CAM_StarIR"), lg.get("IDS_CAM_Color"), lg.get("IDS_CAM_BlackWhite"),
			lg.get("IDS_CAM_IntelMotionDetect"), lg.get("IDS_CAM_WarmLight"), lg.get("IDS_CAM_InteligentInfrared"), lg.get("IDS_CAM_LicensePlate")];

			for(var i = 0; i < CameraDayLightModes.length; i++){
				var nMode = CameraDayLightModes[i].value;
				$("#Cam_DNMode").append('<option value="' + nMode + '">' + strModes[nMode] + '</option>');
			}
		}else{
			if(!GetFunAbility(gDevice.Ability.OtherFunction.SupportHideNormalDLMode)){
				$("#Cam_DNMode").append('<option value="' + 0 + '">' + lg.get("IDS_CAM_StarIR") + '</option>');
				$("#Cam_DNMode").append('<option value="' + 1 + '">' + lg.get("IDS_CAM_Color") + '</option>');
				$("#Cam_DNMode").append('<option value="' + 2 + '">' + lg.get("IDS_CAM_BlackWhite") + '</option>');
			}
			if((isObject(CameraAblity) && CameraAblity.SupportIntellDoubleLight == 1)){
				$("#Cam_DNMode").append('<option value="' + 3 + '">' + lg.get("IDS_CAM_IntelMotionDetect") + '</option>');
			}

			if(GetFunAbility(gDevice.Ability.OtherFunction.SupportSoftPhotosensitive)){
				$("#Cam_DNMode").append('<option value="' + 4 + '">' + lg.get("IDS_CAM_WarmLight") + '</option>');
				$("#Cam_DNMode").append('<option value="' + 5 + '">' + lg.get("IDS_CAM_InteligentInfrared") + '</option>');	
			}

			if(GetFunAbility(gDevice.Ability.OtherFunction.SupportPlateDetect)){
				$("#Cam_DNMode").append('<option value="' + 6 + '">' + lg.get("IDS_CAM_LicensePlate") + '</option>');
			}
		}
	}
	function ShowLevel(id){
		var mode = "#" + id;
		switch(id){
		case "Cam_DwdrMode": 
			if ($(mode).val() * 1 == 1) {
				DivBox(1, "#digital_wide");
			} else {
				DivBox(0, "#digital_wide");
			}
			break;
		case "Cam_GainMode":
			if($(mode).val() * 1 == 1){
				DivBox(1, "#Gainwide");
			} else {
				DivBox(0, "#Gainwide");
			}
			break;
		}
	}
	function ShowAdjustVlaue() {
		var DNval = $("#Cam_DNMode").val() * 1;
        if($("#Cam_DNMode").val() != null && DNval < 3){
			$("#RDNC").css("display", "block");
			$("#Auto_Adjustment").css("display", "none");
			$("#RDNC").slider("setValue", CameraCfg[CameraCfg.Name].DncThr);
		}else{
			$("#RDNC").css("display", "none");
			if(_bWidth){
				$("#Auto_Adjustment").css("display", "block");
				$("#Auto_Adjustment").slider("setValue", CameraExCfg[CameraExCfg.Name].AutomaticAdjustment);
			}else{
				$("#Auto_Adjustment").css("display", "none");
			}
		}
    }
	function ShowData() {
		var cfg = CameraCfg[CameraCfg.Name];	
		UpdateDNMode();
		$("#Cam_DNMode").val(0);
		if(_bLP4G){
			$("#Cam_DNMode").val(LP4GLedParameter[LP4GLedParameter.Name].Type - 1);
		}else{
			SetCurComboData("#Cam_DNMode", parseInt(cfg.DayNightColor, 16));
		}
		ShowAdjustVlaue();

		$("#Cam_BLC").val(parseInt(cfg.BLCMode, 16));
		if(_bWidth && isObject(CameraExCfg)){
			$("#BT_Div").css("display", "");
			var cfgEx = CameraExCfg[CameraExCfg.Name];

			$("#Cam_DwdrMode").val(cfgEx.BroadTrends.AutoGain);
			ShowLevel("Cam_DwdrMode");
			$("#Cam_DwdrStrength").val(cfgEx.BroadTrends.Gain);

			if (isObject(CameraAblity) && CameraAblity.SupportPreventOverExpo == 1) {
				var CfgEx = CameraExCfg[CameraExCfg.Name];
				$("#PreOverExposureSpan").css("display", "");
				$("#PreOverExposureSwitch").prop("checked", parseInt(CfgEx.PreventOverExpo) ? true : false);
			}else {
				$("#PreOverExposureSpan").css("display", "none");
			}
		}else{
			$("#BT_Div").css("display", "none");
			$("#PreOverExposureSpan").css("display", "none");
		}

		$("#Cam_GainMode").val(cfg.GainParam.AutoGain);
		ShowLevel("Cam_GainMode");
		$("#Cam_GainStrength").val(cfg.GainParam.Gain);


		$("#day_dn_id").val(cfg.Day_nfLevel);
		$("#night_dn_id").val(cfg.Night_nfLevel);
		$("#MirrorSwitch").prop("checked", parseInt(cfg.PictureMirror, 16) ? true : false);
		$("#FlipSwitch").prop("checked", parseInt(cfg.PictureFlip, 16) ? true : false);
		$("#AntiSwitch").prop("checked", parseInt(cfg.RejectFlicker, 16) ? true : false);
		$("#IrSwapSwitch").prop("checked", parseInt(cfg.IrcutSwap) ? true : false);
		if(_bSpecialNight){
			cfg = SpecialNightCfg[SpecialNightCfg.Name];
			$("#SpecialNightSwitch").prop("checked", cfg.enable);
		}
		InitButton();
		MasklayerHide();
    }
	
	function GetSpecialNight(){
		if(_bSpecialNight){
			RfParamCall(function(a){
				SpecialNightCfg = a;
				ShowData();
			}, pageTitle, "Camera.SpecialNight", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}else{
			ShowData();
		}
	}
	function GetLP4GLedParameter(){
		if(_bLP4G){
			var fName = "Dev.LP4GLedParameter";
			RfParamCall(function(a){
				LP4GLedParameter = a;
				GetSpecialNight();
			}, pageTitle, fName, -1, WSMsgID.WsMsgID_CONFIG_GET, null, true);
		}else{
			GetSpecialNight();
		}
	}
	function GetDetectCfg(){
		RfParamCall(function(a){
			motionCfg = a;
			RfParamCall(function(a){
				humanCfg = a;
				GetLP4GLedParameter();
			}, pageTitle, "Detect.HumanDetection", chnIndex, WSMsgID.WsMsgID_CONFIG_GET);
		}, pageTitle, "Detect.MotionDetect", chnIndex, WSMsgID.WsMsgID_CONFIG_GET);
	}
	
	function GetCameraCfg(){
		RfParamCall(function(a){
			CameraCfg = a;
			if(_bWidth){
				CameraExCfg = null;
				RfParamCall(function(a){
					CameraExCfg = a;					
					if(_bHumanCfg){
						GetDetectCfg();
					}else{
						GetLP4GLedParameter();
					}		
				}, pageTitle, "Camera.ParamEx", chnIndex, WSMsgID.WsMsgID_CONFIG_GET);
			}else{
				if(_bHumanCfg){
					GetDetectCfg();
				}else{
					GetLP4GLedParameter();
				}
			}
		}, pageTitle, "Camera.Param", chnIndex, WSMsgID.WsMsgID_CONFIG_GET);
	}
	function GetCameraAblity(){
		RfParamCall(function(a){
			CameraAblity = a[a.Name];
			if(_bListCameraDayLightModes){
				RfParamCall(function(a){
					if(a.Ret == 100){
						CameraDayLightModes = a[a.Name];
					}
					GetCameraCfg();
				}, pageTitle, "CameraDayLightModes", -1, WSMsgID.WsMsgID_ABILITY_GET, null, true);
			}else{
				GetCameraCfg();
			}
		}, pageTitle, "Camera", -1, WSMsgID.WsMsgID_ABILITY_GET);
	}
	function SaveSelChn() {
		var cfg = CameraCfg[CameraCfg.Name];
		cfg.BLCMode = '0x' + toHex($("#Cam_BLC").val(), 8);
		cfg.GainParam.AutoGain = $("#Cam_GainMode").val() * 1;
		cfg.GainParam.Gain = $("#Cam_GainStrength").val() *1
		cfg.Day_nfLevel = $("#day_dn_id").val() * 1;
		cfg.Night_nfLevel = $("#night_dn_id").val() * 1;
		cfg.PictureMirror = '0x' + toHex($("#MirrorSwitch").prop("checked") * 1, 8);
		cfg.PictureFlip = '0x' + toHex($("#FlipSwitch").prop("checked") * 1, 8);
		cfg.RejectFlicker = '0x' + toHex($("#AntiSwitch").prop("checked") * 1, 8);
		cfg.IrcutSwap = $("#IrSwapSwitch").prop("checked") * 1;
		var DNval = $("#Cam_DNMode").val() * 1;
		if($("#Cam_DNMode").val() != null){
			if(_bLP4G){
				LP4GLedParameter[LP4GLedParameter.Name].Type = $("#Cam_DNMode").val() * 1 + 1;
			}else{
				cfg.DayNightColor = '0x' + toHex(DNval, 8);
				if(DNval < 3){
					cfg.DncThr = $("#RDNC").slider("getValue");
				}
			}
		}
		if(_bWidth && isObject(CameraExCfg)){
			var cfgEx = CameraExCfg[CameraExCfg.Name];

			cfgEx.BroadTrends.AutoGain = $("#Cam_DwdrMode").val() * 1;
			cfgEx.BroadTrends.Gain = $("#Cam_DwdrStrength").val() *1;
			if($("#Cam_DNMode").val() != null && DNval >= 3){
				cfgEx.AutomaticAdjustment = $("#Auto_Adjustment").slider("getValue");
			}
			if (isObject(CameraAblity) && CameraAblity.SupportPreventOverExpo == 1) {
				cfgEx.PreventOverExpo = $("#PreOverExposureSwitch").prop("checked") *1;
			}
		}

		if(_bSpecialNight){
			cfg = SpecialNightCfg[SpecialNightCfg.Name];
			cfg.enable = $("#SpecialNightSwitch").prop("checked");
		}
	}
	function SaveSpecialNight(){
		if(_bSpecialNight){
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "Camera.SpecialNight", -1, WSMsgID.WsMsgID_CONFIG_SET, SpecialNightCfg);
		}else{
			ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
		}
	}
	function SaveLP4GLedParameter(){
		if(_bLP4G){
			var fName = "Dev.LP4GLedParameter";
			RfParamCall(function(a){
				SaveSpecialNight();
			}, pageTitle, fName, -1, WSMsgID.WsMsgID_CONFIG_SET, LP4GLedParameter);
		}else{
			SaveSpecialNight();
		}
	}
	function SaveHumanCfg(){
		if(!humanCfg[humanCfg.Name].Enable){
			humanCfg[humanCfg.Name].Enable = true;
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "Detect.HumanDetection", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, humanCfg);
		}else{
			SaveLP4GLedParameter();	
		}
	}
	function SaveMotionCfg(){	
		if(!motionCfg[motionCfg.Name].Enable){
			motionCfg[motionCfg.Name].Enable = true;
			RfParamCall(function(a){
				SaveHumanCfg();
			}, pageTitle, "Detect.MotionDetect", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, motionCfg);
		}else{
			SaveHumanCfg();
		}
	}
	function SaveClearFog(){
		var cfg = CameraCfg[CameraCfg.Name];
		var bSaveDetect = false;
		if(parseInt(cfg.DayNightColor, 16) == 3){
			bSaveDetect = true;
		}
			
		if(_bHumanCfg && bSaveDetect){
			SaveMotionCfg();
		}else{
			ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
		}
	}
    $(function () {
		if(_bSpecialNight){
			$("#SpecialNightSpan").css("display", "");
		}
	
		$("#Cam_BLC").empty();
		$("#Cam_BLC").append('<option value="0">'+ lg.get("IDS_CAM_Close") +'</option>');
		$("#Cam_BLC").append('<option value="1">'+ lg.get("IDS_CAM_Open") +'</option>');
		
		$("#Cam_DwdrMode").empty();
		$("#Cam_DwdrMode").append('<option value="0">'+ lg.get("IDS_CAM_Close") +'</option>');
		$("#Cam_DwdrMode").append('<option value="1">'+ lg.get("IDS_CAM_Open") +'</option>');

		$("#Cam_GainMode").empty();
		$("#Cam_GainMode").append('<option value="0">'+ lg.get("IDS_CAM_Close") +'</option>');
		$("#Cam_GainMode").append('<option value="1">'+ lg.get("IDS_CAM_Open") +'</option>');


		$("#day_dn_id").empty();
		$("#night_dn_id").empty();
		for (var i=0; i < 6; i++) {
			$("#day_dn_id").append('<option value="'+i+'">'+i+'</option>');
			$("#night_dn_id").append('<option value="'+i+'">'+i+'</option>');
		}

		$("#RDNC").slider({width: 130, minValue: 10, maxValue: 50, mouseupCallback: null});
		$("#Auto_Adjustment").slider({width:130, minValue:1, maxValue:5, mouseupCallback:null});
		$("#Cam_DwdrMode, #Cam_GainMode").change(function () {
			ShowLevel($(this).attr('id'));
		});
		$("#Cam_DNMode").change(function () {
			ShowAdjustVlaue();
		});

		$("#ChncamRf").click(function () {		
			GetCameraAblity();
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

		chnIndex = 0;
		GetCameraAblity();
    });
});