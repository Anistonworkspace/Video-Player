//# sourceURL=IPCParam_ImageSet.js
$(function(){
    var chnIndex = -1;
    var VideoColor;
    var oldVideoColor;
    var CameraCfg = null;
    var CameraExCfg = null;
    var nAnaChannel = gDevice.loginRsp.VideoInChannel;
    var nDigChannel = gDevice.loginRsp.DigChannel;
    var nTotalChannel = gDevice.loginRsp.ChannelNum;
    var pageTitle = $("#IPCParam_ImageSet").text();
    $("#IPC_TimeEnable, #IPC_BH, #IPC_BM, #IPC_EH, #IPC_EM").prop("disabled", true);
    var _bWidth = false;
    var _bImgStyle = false;
    var _bCorridorMode = false;
    var channelFun;
    var CameraAblity;
    var WhiteLightCfg;
    var strImgStyle = ["typedefault", "type1", "type2"];
    var strWorkMode = ["Auto", "Close", "Intelligent"];
    var bReboot = false;
    var bGetCamera = false;
    var _bNVRHuman = GetFunAbility(gDevice.Ability.AlarmFunction.HumanDectionNVR) || GetFunAbility(gDevice.Ability.AlarmFunction.HumanDectionNVRNew);
    var motionCfg;
    var humanCfg;
    var digitalHumanAbility;
    var digitalSystemFunc;
    var _bLP4G = false;
    var LP4GLedParameter;
    var _bListCameraDayLightModes = false;
    var CameraDayLightModes;
    var currentGearCtrlBox = null;
    var currentDNCDiv = null;
    var bSupportFullColorLightWorkPeriod = false;

    function UpdateDNMode(){
		$("#IPC_DNMode").empty();
        if(_bLP4G){
            $("#IPC_DNMode").append('<option value="' + 0 + '">' + lg.get("IDS_CAM_StarIR") + '</option>');
			$("#IPC_DNMode").append('<option value="' + 1 + '">' + lg.get("IDS_CAM_Color") + '</option>');
            return;
        }

        if(_bListCameraDayLightModes && typeof CameraDayLightModes != 'undefined' && CameraDayLightModes.length > 0){
            var strModes = [lg.get("IDS_CAM_StarIR"), lg.get("IDS_CAM_Color"), lg.get("IDS_CAM_BlackWhite"),
            lg.get("IDS_CAM_IntelMotionDetect"), lg.get("IDS_CAM_WarmLight"), lg.get("IDS_CAM_InteligentInfrared"), lg.get("IDS_CAM_LicensePlate")];

            for(var i = 0; i < CameraDayLightModes.length; i++){
                var nMode = CameraDayLightModes[i].value;
                $("#IPC_DNMode").append('<option value="' + nMode + '">' + strModes[nMode] + '</option>');
            }
        }
        else if(channelFun.SupportDoubleLightBoxCamera[chnIndex]){
            $("#IPC_DNMode").append('<option value="' + 0 + '">' + lg.get("IDS_CAM_WorkMode_Auto") + '</option>');
            $("#IPC_DNMode").append('<option value="' + 1 + '">' + lg.get("IDS_CAM_WorkMode_Close") + '</option>');
            $("#IPC_DNMode").append('<option value="' + 2 + '">' + lg.get("IDS_CAM_WorkMode_Intelligente") + '</option>');
        }
        else{
            var bSupportHideNormalDLMode = (typeof channelFun.SupportHideNormalDLMode == 'undefined') ? 0 : 
                                        channelFun.SupportHideNormalDLMode[chnIndex];
            if(!bSupportHideNormalDLMode){
                $("#IPC_DNMode").append('<option value="' + 0 + '">' + lg.get("IDS_CAM_StarIR") + '</option>');
                $("#IPC_DNMode").append('<option value="' + 1 + '">' + lg.get("IDS_CAM_Color") + '</option>');
                $("#IPC_DNMode").append('<option value="' + 2 + '">' + lg.get("IDS_CAM_BlackWhite") + '</option>');
            }
            if((isObject(CameraAblity) && CameraAblity.SupportIntellDoubleLight == 1)){
                $("#IPC_DNMode").append('<option value="' + 3 + '">' + lg.get("IDS_CAM_IntelMotionDetect") + '</option>');
            }

            if(channelFun.SoftPhotoSensitiveMask[chnIndex] == 1){
                $("#IPC_DNMode").append('<option value="' + 4 + '">' + lg.get("IDS_CAM_WarmLight") + '</option>');
                $("#IPC_DNMode").append('<option value="' + 5 + '">' + lg.get("IDS_CAM_InteligentInfrared") + '</option>');
            }
            if(GetFunAbility(gDevice.Ability.OtherFunction.SupportPlateDetect)){
                $("#IPC_DNMode").append('<option value="' + 6 + '">' + lg.get("IDS_CAM_LicensePlate") + '</option>');
            }
        }
	}

    function ShowLevel(id){
        var mode = "#" + id;
        var bEnable = $(mode).prop("checked");
        switch(id){
        case "IPC_DwdrModeSwitch": 
            if (bEnable) {
                DivBox(1, "#ipc_digital_wide");
            } else {
                DivBox(0, "#ipc_digital_wide");
            }
            break;
        }
    }

    function ShowAdjustVlaue(div, dncdiv) {
        $(div).slider({width:120, minValue:1, maxValue:5, mouseupCallback:SetCameraEx});
        $(dncdiv).slider({width: 120, minValue: 10, maxValue: 50, mouseupCallback: SetCamera});
        var DNval = $("#IPC_DNMode").val() * 1;

        if(channelFun.SupportDoubleLightBoxCamera[chnIndex])
        {
            DNval = parseInt(CameraCfg[CameraCfg.Name].DayNightColor, 16);
        }

        if(channelFun.SupportDoubleLightBoxCamera[chnIndex]){
            $(dncdiv).css("display", "none");
            $(div).css("display", "block");
            $(div).slider("setValue", CameraExCfg[CameraExCfg.Name].AutomaticAdjustment);
        }else{
            if(DNval < 3)
            {
                $(div).css("display", "none"); 
                $(dncdiv).css("display", "block");
                $(dncdiv).slider("setValue", CameraCfg[CameraCfg.Name].DncThr);
            }
            else
            {
                $(dncdiv).css("display", "none");
                if(_bWidth){
                    $(div).css("display", "block");
                    $(div).slider("setValue", CameraExCfg[CameraExCfg.Name].AutomaticAdjustment);
                }else{
                    $(div).css("display", "none");
                }
            }
        }
    }
    function UpdateDayNightSwitch(){
        // 隐藏Regular档位配置
        $("#IPC_GearCtrlBox").css("display", "none");
        $("#IPC_DayNightSwitch, #IPC_DayNightSwitchExBox").css("display", "");
        $("#IPC_DayNightSwtichSelect").empty();
        $("#IPC_DayNightSwtichSelect").append('<option value="0">' + lg.get("IDS_DayNightSwitch_AutoChange") + '</option>');
        $("#IPC_DayNightSwtichSelect").append('<option value="1">' + lg.get("IDS_DayNightSwitch_DayMode") + '</option>');
        $("#IPC_DayNightSwtichSelect").append('<option value="2">' + lg.get("IDS_DayNightSwitch_NightMode") + '</option>');
        $("#IPC_DayNightSwtichSelect").append('<option value="3">' + lg.get("IDS_DayNightSwitch_ClockMode") + '</option>');
        currentGearCtrlBox = "#IPC_Auto_Adjustment2";
        currentDNCDiv = "#IPC_RDNC2";
        var cfgEx = CameraExCfg[CameraExCfg.Name];
        if(isObject(cfgEx.DayNightSwitch)){
            ShowAdjustVlaue("#IPC_Auto_Adjustment2", "#IPC_RDNC2");
            var switchMode = cfgEx["DayNightSwitch"]["SwitchMode"] * 1;
            if(switchMode == 0){
                // 显示Dnc Threshold，隐藏Time设置
                DivBox(1, "#IPC_GearCtrlBox2");
                DivBox(0, "#IPC_KeepDayPeriodBox");
                $("#IPC_GearCtrlBox2 .MaskDiv").css("display", "none");
            }else if(switchMode == 1 || switchMode == 2){
                // 隐藏日夜切换的 Dnc Threshold和Time设置
                $("#IPC_DayNightSwitchExBox").css("display", "none");			
            }else if(switchMode == 3){
                // 因此Dnc Threshold，显示Time设置
                DivBox(0, "#IPC_GearCtrlBox2");
                DivBox(1, "#IPC_KeepDayPeriodBox");
                $("#IPC_GearCtrlBox2 .MaskDiv").css("display", "block");
            }else{
                //...
            }
            $("#IPC_DayNightSwtichSelect").val(switchMode);
            ShowTimeSection(cfgEx["DayNightSwitch"]["KeepDayPeriod"]);
        }
    }
    function ShowDayNightSwitchControl(){
        var currentIndex = $("#IPC_DayNightSwtichSelect").val() * 1;
        $("#IPC_DayNightSwitchExBox").css("display", "");
        if(currentIndex == 0){
            DivBox(1, "#IPC_GearCtrlBox2");
            DivBox(0, "#IPC_KeepDayPeriodBox");
            $("#IPC_GearCtrlBox2 .MaskDiv").css("display", "none");
        }else if(currentIndex == 1 || currentIndex == 2){
            $("#IPC_DayNightSwitchExBox").css("display", "none");
        }else if(currentIndex == 3){
            DivBox(0, "#IPC_GearCtrlBox2");
            DivBox(1, "#IPC_KeepDayPeriodBox");
            $("#IPC_GearCtrlBox2 .MaskDiv").css("display", "block");
        }else{
            //...
        }
        SetCameraEx();
    }
    function ShowTimeSection(time){
        if(typeof time == "undefined"){
            $("#IPC_KeepDayPeriod_BH").val("00");
            $("#IPC_KeepDayPeriod_BM").val("00");
            $("#IPC_KeepDayPeriod_EH").val("24");
            $("#IPC_KeepDayPeriod_EM").val("00");
            return;
        }

        var sect = time.split(" ");
        var tSect = sect[1].split("-");
        var bSect = tSect[0].split(":");
        var eSect = tSect[1].split(":");

        $("#IPC_KeepDayPeriod_BH").val(bSect[0]);
        $("#IPC_KeepDayPeriod_BM").val(bSect[1]);
        $("#IPC_KeepDayPeriod_EH").val(eSect[0]);
        $("#IPC_KeepDayPeriod_EM").val(eSect[1]);
    }
    function GetWhiteLightCfg(callback){
        if(channelFun.SupportDoubleLightBoxCamera[chnIndex] || bSupportFullColorLightWorkPeriod){
            RfParamCall(function(a){
                WhiteLightCfg = a;
                GetDigitalHumanMotion(function(b){
                    callback(b);
                });
            }, pageTitle, "Camera.WhiteLight", chnIndex, WSMsgID.WsMsgID_CONFIG_GET, null, true);
        }else {
            GetDigitalHumanMotion(function(b){
                callback(b);
            });
        }
    }
	function GetDigitalHumanMotion(callback){
        if(_bNVRHuman){
            RfParamCall(function(a){
                if (typeof a[a.Name] == 'undefined'){
                    digitalHumanAbility = {};
                    digitalHumanAbility.HumanDection = false;
                    digitalHumanAbility.SupportAlarmLinkLight = false;
                    digitalHumanAbility.SupportAlarmVoiceTips = false;
                    digitalHumanAbility.SupportAlarmVoiceTipsType = false;
                }else{
                    digitalHumanAbility = a[a.Name];
                }
                if(!digitalHumanAbility.HumanDection){
    				callback(100);
                }else{
                    RfParamCall(function(a){
                        motionCfg = a;
                        RfParamCall(function(a){
                            humanCfg = a;
                            callback(a.Ret);
                        }, pageTitle, "Detect.HumanDetection", chnIndex, WSMsgID.WsMsgID_CONFIG_GET);
                    }, pageTitle, "Detect.MotionDetect", chnIndex, WSMsgID.WsMsgID_CONFIG_GET);
                }	
            }, pageTitle, "NetUse.DigitalHumanAbility", chnIndex, WSMsgID.WsMsgID_CONFIG_GET);
        }else{
            callback(100);
        }
	}

    function GetLP4GLedParameter(callback){
		if(_bLP4G){
			fName = "bypass@Dev.LP4GLedParameter"
			RfParamCall(function(a){
				LP4GLedParameter = a;
                GetWhiteLightCfg(function(b){
                    callback(b);
                });
			}, pageTitle, fName, chnIndex - nAnaChannel, WSMsgID.WsMsgID_CONFIG_GET, null, true);
		}else{
            GetWhiteLightCfg(function(b){
                callback(b);
            });
        }
	}
    function GetCameraCfg(callback){
        RfParamCall(function(a){
            if(a.Ret != 100){
                callback(a.Ret);
                return;
            }
            CameraCfg = a;
            if(_bWidth){
                CameraExCfg = null;
                RfParamCall(function(a){
                    if(a.Ret != 100){
                        callback(a.Ret);
                        return;
                    }
                    CameraExCfg = a;
                    GetLP4GLedParameter(function(b){
                        callback(b);
                    });
                }, pageTitle, "Camera.ParamEx", chnIndex, WSMsgID.WsMsgID_CONFIG_GET, null, true);
            }else{
                GetLP4GLedParameter(function(b){
                    callback(b);
                });
            }
        }, pageTitle, "Camera.Param", chnIndex, WSMsgID.WsMsgID_CONFIG_GET, null, true);
    }
    function GetChannelFunc(callback){
        RfParamCall(function(a){
			if(a.Ret == 100){
				digitalSystemFunc = a[a.Name];
				bLP4G = GetFunAbility(digitalSystemFunc.OtherFunction.LP4GSupportDoubleLightSwitch);
                bListCameraDayLightModes = GetFunAbility(digitalSystemFunc.OtherFunction.SupportListCameraDayLightModes);
                bSupportFullColorLightWorkPeriod = GetFunAbility(digitalSystemFunc.OtherFunction.SupportFullColorLightWorkPeriod);
			}
			RfParamCall(function(a){
                channelFun = a[a.Name];
                if(typeof channelFun.SupportDoubleLightBoxCamera == 'undefined'){
                    channelFun.SupportDoubleLightBoxCamera = [];
                    for(var i = 0; i < gDevice.loginRsp.ChannelNum; i++){
                        channelFun.SupportDoubleLightBoxCamera[i] = 0;
                    }
                }
                _bWidth = channelFun.BroadTrends[chnIndex];
                _bImgStyle = channelFun.CamareStyle[chnIndex];
                _bCorridorMode = channelFun.CorridorMode[chnIndex];
    
                RfParamCall(function(a){
                    if(a.Ret != 100){
                        callback(a.Ret);
                        return;
                    }
                    CameraAblity = a[a.Name];
                    if(_bListCameraDayLightModes){
                        RfParamCall(function(a){
                            if(a.Ret == 100){
                                CameraDayLightModes = a[a.Name];
                            }
                            GetCameraCfg(function(b){
                                callback(b);
                            });
                        }, pageTitle, "bypass@CameraDayLightModes", chnIndex - nAnaChannel, WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ, null, true)
                    }else{
                        GetCameraCfg(function(b){
                            callback(b);
                        });
                    }
                }, pageTitle, "ChannelCameraAbility", chnIndex, WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ, null, true);
            }, pageTitle, "ChannelSystemFunction", -1, WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ);
		}, pageTitle, "bypass@SystemFunction", chnIndex - nAnaChannel, WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ, null, true);
	}

    function EnableSlider(){
        var nStatus = 1;
        if(bGetCamera && CameraCfg[CameraCfg.Name].IRCUTMode == 1){
            var bEnable2 = $("#IPC_TimeEnable2").prop("checked");
            if(!bEnable2){
                nStatus = 0;
            }	
        }

        $("#VideoColor_Box .MaskDiv").css({
            "width": "100%",
            "left": 0
        });
        $("#VideoColor_Box .slider").css({
            "opacity": 1,
        });
        if(nStatus == 0){
            $("#IPC_BrightnessDiv, #IPC_ContrastDiv, #IPC_SaturationDiv, #IPC_HorizontalDiv, #IPC_HueDiv, #IPC_GainDiv, #IPC_VerticalDiv").find(".MaskDiv")
            .css({
                "display": "block",
                "width": "50%",
                "left": "165px"
            });
            $("#IPC_BrightnessDiv, #IPC_ContrastDiv, #IPC_SaturationDiv, #IPC_HorizontalDiv, #IPC_HueDiv, #IPC_GainDiv, #IPC_VerticalDiv").find(".second").fadeTo("slow", 0.6);
        }
    }
    function FillData(nColor, nCamera){
        bGetCamera = nCamera == 100 ? true : false;
        try{
            if(nColor == 100){
                // Period 1配置
                $("#IPC_TimeEnable").prop("checked", VideoColor[VideoColor.Name][0].Enable ? true : false);
                var sect = VideoColor[VideoColor.Name][0].TimeSection.split(" ");
                var tSect = sect[1].split("-");
                var btSect = tSect[0].split(":");
                var etSect = tSect[1].split(":");
                $("#IPC_BH").val(btSect[0]);
                $("#IPC_BM").val(btSect[1]);
                $("#IPC_EH").val(etSect[0]);
                $("#IPC_EM").val(etSect[1]);
                // 图像Color1
                var cfg = VideoColor[VideoColor.Name][0].VideoColorParam;
                $("#IPCBrightness_Slider").slider("setValue", cfg.Brightness);			
                $("#IPCContrast_Slider").slider("setValue", cfg.Contrast);		
                $("#IPCSaturation_Slider").slider("setValue", cfg.Saturation);		
                $("#IPCHue_Slider").slider("setValue", cfg.Hue);		
                $("#IPCGain_Slider").slider("setValue", cfg.Gain);	
                $("#IPCHorizontal_Slider").slider("setValue", cfg.Acutance & 0x00000000f);
                $("#IPCVertical_Slider").slider("setValue", (cfg.Acutance & 0x000000f00) >> 8);
                // Period 2配置
                $("#IPC_TimeEnable2").prop("checked", VideoColor[VideoColor.Name][1].Enable ? true : false);
                var sect = VideoColor[VideoColor.Name][1].TimeSection.split(" ");
                var tSect = sect[1].split("-");
                var btSect = tSect[0].split(":");
                var etSect = tSect[1].split(":");
                $("#IPC_BH2").val(btSect[0]);
                $("#IPC_BM2").val(btSect[1]);
                $("#IPC_EH2").val(etSect[0]);
                $("#IPC_EM2").val(etSect[1]);
                // 图像Color2
                cfg = VideoColor[VideoColor.Name][1].VideoColorParam;
                $("#IPCBrightness_Slider2").slider("setValue", cfg.Brightness);			
                $("#IPCContrast_Slider2").slider("setValue", cfg.Contrast);		
                $("#IPCSaturation_Slider2").slider("setValue", cfg.Saturation);		
                $("#IPCHue_Slider2").slider("setValue", cfg.Hue);		
                $("#IPCGain_Slider2").slider("setValue", cfg.Gain);	
                $("#IPCHorizontal_Slider2").slider("setValue", cfg.Acutance & 0x00000000f);
                $("#IPCVertical_Slider2").slider("setValue", (cfg.Acutance & 0x000000f00) >> 8);
                var bEnable2 = $("#IPC_TimeEnable2").prop("checked");
                $("#TimeSection2 input").prop("disabled", !bEnable2);
                $("#IPCBrightness_Slider2, #IPCContrast_Slider2, #IPCSaturation_Slider2, #IPCHue_Slider2, #IPCGain_Slider2, #IPCHorizontal_Slider2, #Vertical_Slider2").prop("disabled", !bEnable2);
        
                $("#IPC_IR_Cut_0").css("display", "");          // Period控制
                $("#IPC_IR_Cut_1").css("display", "none");      // 红外灯OpenClose
                if(nCamera == 100){
                    if(CameraCfg[CameraCfg.Name].IRCUTMode == 0){
                        $("#IPC_IR_Cut_0").css("display", "none");
                        $("#IPC_IR_Cut_1").css("display", "");
                    }
                }
                $("#VideoColor_Box .MaskDiv").css("display", "none");
                DivBox(1, "#VideoColor_Box");
                $("#ImageSet_Ok").attr("disabled", false);
                $("#ImageSet_Ok").stop().removeClass("btn-disable").fadeTo("slow", 1);
                // 禁用Period
                DivBox(0, "#IPC_Sect");
                DivBox(bEnable2 ? 1 : 0, "#TimeSection2");
                EnableSlider();
            }else{
                // All禁用显示
                $("#VideoColor_Box .MaskDiv").css("display", "block");
                DivBox(0, "#VideoColor_Box");
                $("#CameraSet_Box .MaskDiv").css("display", "block");
                $("#ipc_digital_wide").css("opacity", "1");
                DivBox(0, "#CameraSet_Box");               
                $("#ImageSetdefault, #ImageSet_Ok").attr("disabled", true);
			    $("#ImageSetdefault, #ImageSet_Ok").stop().addClass("btn-disable").fadeTo("slow", 0.2);
                return;
            }

            if(nCamera == 100){
                $("#CameraSet_Box .MaskDiv").css("display", "none");
                DivBox(1, "#CameraSet_Box"); 
                
                // 获取填充日夜Mode
                UpdateDNMode();
                $("#IPC_DNMode").val(0);
                var i;
                var nDNval = 0;
                var cfgCamera = CameraCfg[CameraCfg.Name];
                if(channelFun.SupportDoubleLightBoxCamera[chnIndex]){
                    for(i = 0; i < strWorkMode.length; i++){
                        if(strWorkMode[i] == WhiteLightCfg[WhiteLightCfg.Name].WorkMode){
                            nDNval = i;
                            break;
                        }
                    }
                }else{
                    nDNval = parseInt(cfgCamera.DayNightColor, 16);
                }
                if(_bLP4G){
                    nDNval = LP4GLedParameter[LP4GLedParameter.Name].Type - 1;
                }
                SetCurComboData("#IPC_DNMode", nDNval);
                // 白Day黑夜切换
                if(isObject(CameraAblity) && CameraAblity.SupManualSwitchDayNight == 1){
                    UpdateDayNightSwitch();
                }else{
                    // 隐藏白Day黑夜Mode的 日夜切换Mode下拉框和Time设置
                    $("#IPC_DayNightSwitch, #IPC_DayNightSwitchExBox").css("display", "none");
                    // 显示RegularDnc Threshold
                    $("#IPC_GearCtrlBox").css("display", "");
                    // 档位1~5 和阈值10~50
                    ShowAdjustVlaue("#IPC_Auto_Adjustment", "#IPC_RDNC");
                    currentDNCDiv = "#IPC_RDNC";
                    currentGearCtrlBox = "#IPC_Auto_Adjustment";
                }
				
                $("#IPC_WBMode").val(parseInt(cfgCamera.WhiteBalance, 16));
                $("#IPC_MirrorSwitch").prop("checked", parseInt(cfgCamera.PictureMirror, 16) ? true : false);
                $("#IPC_FlipSwitch").prop("checked", parseInt(cfgCamera.PictureFlip, 16) ? true : false);
                $("#IPC_IrSwapSwitch").prop("checked", parseInt(cfgCamera.IrcutSwap) ? true : false);

                if(_bWidth && isObject(CameraExCfg)){
                    $("#IPC_BT_Div").css("display", "");
                    var cfgEx = CameraExCfg[CameraExCfg.Name];
                    if(_bImgStyle){
                        $("#IPC_Image_Style_Div").css("display", "");
                        for (i = 0; i < strImgStyle.length; i++) {
                            if (strImgStyle[i] == cfgEx.Style) {
                                $("#IPC_Image_Style").val(i);
                                break;
                            }
                        }
                    }else{
                        $("#IPC_Image_Style_Div").css("display", "none");
                    }
                    $("#IPC_DwdrModeSwitch").prop("checked", cfgEx.BroadTrends.AutoGain ? true: false);
                    ShowLevel("IPC_DwdrModeSwitch");
                    $("#IPC_DwdrStrength").val(cfgEx.BroadTrends.Gain);
                    if(_bCorridorMode){
                        $("#IPC_CorridorMode").prop("checked", cfgEx.CorridorMode ? true : false);
                        $("#CorridorModeSpan").css("display", "");
                    }else{
                        $("#CorridorModeSpan").css("display", "none");
                    }
                }else{
                    $("#IPC_BT_Div, #IPC_DayNightSwitch, #IPC_DayNightSwitchExBox").css("display", "none");
                }   
                
                // Full ColorMode才显示 Light Up Time
                $("#IPC_WhiteLightUpBox").css("display", "none");
                if(bSupportFullColorLightWorkPeriod && WhiteLightCfg != null)
                {
                    $("#LU_BH, #LU_BM, #LU_EH, #LU_EM").prop("disabled", true);
                    DivBox(1, "#LightUpTimeSection");

                    if(parseInt(cfgCamera.DayNightColor, 16) == 1)
                    {
                        $("#IPC_WhiteLightUpBox").css("display", "");
                    }

                    function PadZero(num, length)
                    {
                        return ("0000000000000000" + num).substr(-length);
                    }

                    if(typeof WhiteLightCfg[WhiteLightCfg.Name] != "undefined" && typeof WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod != "undefined")
                    {
                        $("#LightUp_TimeEnable").prop("checked", WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.Enable ? true : false);
                        $("#LU_BH, #LU_BM, #LU_EH, #LU_EM").prop("disabled", WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.Enable ? false : true);
                        $("#LU_BH").val(PadZero(WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.SHour, 2));
                        $("#LU_BM").val(PadZero(WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.SMinute, 2));
                        $("#LU_EH").val(PadZero(WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.EHour, 2));
                        $("#LU_EM").val(PadZero(WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.EMinute, 2));
                        DivBox(WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.Enable * 1, "#LightUpTimeSection");
                    }

                    $("#LightUp_TimeEnable").click(function(){
                        var bCheck = $("#LightUp_TimeEnable").prop("checked");
                        $("#LU_BH, #LU_BM, #LU_EH, #LU_EM").prop("disabled", !bCheck);
                        DivBox(bCheck * 1, "#LightUpTimeSection");
                    });

                    $("#LightUpTimeSection input").keyup(function(){
                        var tmp = $(this).val().replace(/\D/g,'');
                        $(this).val(tmp);
                        var nWitch;
                        var b = $("#LightUpTimeSection input");	
                        for(var i = 0; i < 4; i++){
                            if(b.eq(i).prop("id") == $(this).prop("id")){
                                nWitch = i;
                                break;
                            }
                        }
                        
                        var timeArr = [b.eq(0).val() * 1, b.eq(1).val() * 1,
                                        b.eq(2).val() * 1, b.eq(3).val() * 1];		
                        if (0 == nWitch || 2 == nWitch){
                            if (timeArr[nWitch] >= 24){
                                timeArr[nWitch] = 0;
                                if(nWitch == 0){
                                    timeArr[nWitch+1] = 0;
                                }
                            }
                        }else{
                            var iEh2 = timeArr[nWitch - 1];
                            if (iEh2 != 24 && timeArr[nWitch] > 59){
                                timeArr[nWitch] = 59;
                            }
            
                            if(timeArr[0] == timeArr[2] && timeArr[1] == timeArr[3]){
                                timeArr[3] += 1;
                                if(timeArr[3] == 60){
                                    timeArr[3] = 0;
                                    timeArr[2] = (timeArr[2] + 1) % 24;
                                }
                            }
                        }
            
                        for(i = 0; i < 4; i++){
                            if(i != nWitch){
                                b.eq(i).val(timeArr[i] < 10 ? '0' + timeArr[i] : timeArr[i]);
                            }else{					
                                if (tmp != ''){
                                    b.eq(i).val(timeArr[i]);
                                }
                            }
                        }
                    });

                    $("#LightUpTimeSection input").focusout(function(){
                        var tmp = $(this).val().replace(/\D/g,'');
                        $(this).val(tmp);
                        var nWitch;
                        var b = $("#LightUpTimeSection input");	
                        for(var i = 0; i < 4; i++){
                            if(b.eq(i).prop("id") == $(this).prop("id")){
                                nWitch = i;
                                break;
                            }
                        }
                        
                        var timeArr = [b.eq(0).val() * 1, b.eq(1).val() * 1,
                                        b.eq(2).val() * 1, b.eq(3).val() * 1];		
                        if (0 == nWitch || 2 == nWitch){
                            if (timeArr[nWitch] >= 24){
                                timeArr[nWitch] = 0;
                                if(nWitch == 0){
                                    timeArr[nWitch+1] = 0;
                                }
                            }
                        }else{
                            var iEh2 = timeArr[nWitch - 1];
                            if (iEh2 != 24 && timeArr[nWitch] > 59){
                                timeArr[nWitch] = 59;
                            }
            
                            if(timeArr[0] == timeArr[2] && timeArr[1] == timeArr[3]){
                                timeArr[3] += 1;
                                if(timeArr[3] == 60){
                                    timeArr[3] = 0;
                                    timeArr[2] = (timeArr[2] + 1) % 24;
                                }
                            }
                        }
            
                        for(i = 0; i < 4; i++){
                            var strPad = timeArr[i];
                            if(strPad == 0)
                                strPad = "00";
                            else if(strPad < 10)
                                strPad = '0' + timeArr[i];

                            b.eq(i).val(strPad);
                        }
                    });
                }
            }else{
                $("#CameraSet_Box .MaskDiv").css("display", "block");
                $("#ipc_digital_wide").css("opacity", "1");
                DivBox(0, "#CameraSet_Box"); 
                $("#ImageSetdefault").attr("disabled", true);
			    $("#ImageSetdefault").stop().addClass("btn-disable").fadeTo("slow", 0.2);
                if(nCamera == 107){
                    ShowPaop(pageTitle, lg.get("IDS_NO_POWER"));
                }
                else{
                    ShowPaop(pageTitle, lg.get("GetConfigFail"));          
                }
            }
            if(nColor == 100 && nCamera == 100){
                $("#ImageSetdefault").attr("disabled", false);
			    $("#ImageSetdefault").stop().removeClass("btn-disable").fadeTo("slow", 1);
            }
        }catch (b) {
            VideoColor = null;
            ShowPaop(pageTitle, lg.get("IDS_REFRESH_FAILED"));
        }
    }
    function SaveCamera(){
        RfParamCall(function(a, b){
            if (a.Ret == 603 ){
                bReboot = true;
            }
            if(_bWidth && isObject(CameraExCfg)){
                WndToCameraEx();
                RfParamCall(function(a){
                    SaveLP4GLedParameter();
                }, pageTitle, "Camera.ParamEx", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, CameraExCfg, true);
            }else{
                SaveLP4GLedParameter();
            }
        }, pageTitle, "Camera.Param", 0, WSMsgID.WsMsgID_CONFIG_SET, CameraCfg);
    }
    function SaveLP4GLedParameter(){
		if(_bLP4G){
            LP4GLedParameter[LP4GLedParameter.Name].Type = $("#IPC_DNMode").val() * 1 + 1;
			fName = "bypass@Dev.LP4GLedParameter"
			RfParamCall(function(a){
                SaveWhiteLight();
			}, pageTitle, fName, chnIndex - nAnaChannel, WSMsgID.WsMsgID_CONFIG_SET,LP4GLedParameter);
		}else{
            SaveWhiteLight();
        }
	}
    function SaveWhiteLight(){
        if(channelFun.SupportDoubleLightBoxCamera[chnIndex] || bSupportFullColorLightWorkPeriod){
            if(bSupportFullColorLightWorkPeriod){
                WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.Enable = $("#LightUp_TimeEnable").prop("checked") * 1;
                WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.SHour = $("#LU_BH").val() * 1;
                WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.SMinute = $("#LU_BM").val() * 1;
                WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.EHour = $("#LU_EH").val() * 1;
                WhiteLightCfg[WhiteLightCfg.Name].WorkPeriod.EMinute = $("#LU_EM").val() * 1;
            }
            RfParamCall(function(a){
                IsRebootDev();
            }, pageTitle, "Camera.WhiteLight", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, WhiteLightCfg, true);
        }else{
            SaveMotionCfg();
        }
    }
    function SaveMotionCfg(bRealSetCamera){
        bRealSetCamera = (bRealSetCamera == true ? true : false);
        var bSaveMotionAndHuman = false;
        if(parseInt(CameraCfg[CameraCfg.Name].DayNightColor, 16) == 3){
            if((_bNVRHuman && isObject(digitalHumanAbility) && digitalHumanAbility.HumanDection)){
                if(!motionCfg[motionCfg.Name].Enable || !humanCfg[humanCfg.Name].Enable){
                    bSaveMotionAndHuman = true;
                }
            }
        }
        if(bSaveMotionAndHuman){
            if(!motionCfg[motionCfg.Name].Enable){
                motionCfg[motionCfg.Name].Enable = true;
                RfParamCall(function(a){
                    SaveHumanCfg(bRealSetCamera);
                }, pageTitle, "Detect.MotionDetect", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, motionCfg);
            }else{
                SaveHumanCfg(bRealSetCamera);
            }
        }else{
            if(!bRealSetCamera){
                IsRebootDev();
            }
        }
    }
    function SaveHumanCfg(bRealSetCamera){
        if(!humanCfg[humanCfg.Name].Enable){
            humanCfg[humanCfg.Name].Enable = true;
            RfParamCall(function(a){
                if(!bRealSetCamera){
                    IsRebootDev();
                }
            }, pageTitle, "Detect.HumanDetection", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, humanCfg);
        }else{
            if(!bRealSetCamera){
                IsRebootDev();
            }
        }
    }
    function IsRebootDev(){
		if(bReboot){
			RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), true);
		}else{
			ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
		}
	}
    function SaveColorToDev(){
        if(!isObject(VideoColor)){
            return;
        }
        bReboot = false
        RfParamCall(function(a, b){
            oldVideoColor = cloneObj(VideoColor);
            if(bGetCamera){
                SaveCamera();
            }else{
                if (bReboot){
                    RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), true);
                }else{
                    ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
                }
            }           
        }, pageTitle, "AVEnc.VideoColor",  $("#ImageChid").val()*1, WSMsgID.WsMsgID_CONFIG_SET, VideoColor);
    }
    function SetColor(){
        if(!isObject(VideoColor)){
            return;
        }
        WndToObject();
        RfParamCall(function(a, b){
            oldVideoColor = cloneObj(VideoColor);
        }, pageTitle, "AVEnc.VideoColor",  $("#ImageChid").val()*1, WSMsgID.WsMsgID_CONFIG_SET, VideoColor,true);
    }
    function SetCamera(){
        MasklayerShow();
        WndToCamera();
        RfParamCall(function(a){
            SaveMotionCfg(true);
            MasklayerHide();
        }, pageTitle, "Camera.Param", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, CameraCfg, true);
    }
    function SetCameraEx(){
        if(_bWidth && isObject(CameraExCfg)){
            MasklayerShow();
            WndToCameraEx();
            RfParamCall(function(a){
                MasklayerHide();
            }, pageTitle, "Camera.ParamEx", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, CameraExCfg, true);
        }
    }
    function SetWhiteLight(){
        if(channelFun.SupportDoubleLightBoxCamera[chnIndex]){
            WhiteLightCfg[WhiteLightCfg.Name].WorkMode = strWorkMode[$("#IPC_DNMode").val() * 1];
            RfParamCall(function(a){
                
            }, pageTitle, "Camera.WhiteLight", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, WhiteLightCfg, true);
        }
    }
    function SetLP4GLedParameter(){
        LP4GLedParameter[LP4GLedParameter.Name].Type = $("#IPC_DNMode").val() * 1 + 1;
        RfParamCall(function(a){
                
        }, pageTitle, "bypass@Dev.LP4GLedParameter", chnIndex - nAnaChannel, WSMsgID.WsMsgID_CONFIG_SET, LP4GLedParameter, true);
    }
    function LoadConfig(callback) {
        MasklayerShow();
        RfParamCall(function(a){
            if(a.Ret==100){
                VideoColor = a;
                GetChannelFunc(function(b){
                    FillData(a.Ret, b);
                    callback(a.Ret);
                });
            }else{
                FillData(a.Ret, -1);
                callback(a.Ret);
            }
        }, pageTitle, "AVEnc.VideoColor", $("#ImageChid").val()*1, WSMsgID.WsMsgID_CONFIG_GET, null,true);
	}
    function WndToObject(){
        if(!isObject(VideoColor)){
            return;
        }
        VideoColor[VideoColor.Name][0].Enable = $("#IPC_TimeEnable").prop("checked") ? 1 : 0;
        VideoColor[VideoColor.Name][1].Enable = $("#IPC_TimeEnable2").prop("checked") ? 1 : 0;
        
        var ts = "0 ";
        ts += GetTimeVal($("#IPC_BH2")) + ":" + GetTimeVal($("#IPC_BM2")) + ":00-";
        ts += GetTimeVal($("#IPC_EH2")) + ":" + GetTimeVal($("#IPC_EM2")) + ":00";
        VideoColor[VideoColor.Name][1].TimeSection = ts;
        
        var EndT = [$("#IPC_BH2").val() * 1, $("#IPC_BM2").val() * 1, $("#IPC_EH2").val() * 1, $("#IPC_EM2").val() * 1];
        if((!$("#IPC_TimeEnable2").prop("checked")) || (EndT[0] == 0 && EndT[1] == 0 && EndT[2] == 0 && EndT[3] == 0)){
            $("#IPC_BH").val("00");
            $("#IPC_BM").val("00");
            $("#IPC_EH").val("24");
            $("#IPC_EM").val("00");
            
            $("#IPC_BH2").val("19");
            $("#IPC_BM2").val("07");
            $("#IPC_EH2").val("00");
            $("#IPC_EM2").val("00");
        }else{
            if($("#IPC_EH2").val() * 1 != 24){
                $("#IPC_BH").val(GetTimeVal($("#IPC_EH2")));
            }else{
                $("#IPC_BH").val("00");
            }
            if($("#IPC_BH2").val() * 1 != 0){
                $("#IPC_EH").val(GetTimeVal($("#IPC_BH2")));
            }else{
                $("#IPC_EH").val("00");
            }
            
            $("#IPC_BM").val(GetTimeVal($("#IPC_EM2")));
            $("#IPC_EM").val(GetTimeVal($("#IPC_BM2")));
        }
        
        ts = "0 ";
        ts += GetTimeVal($("#IPC_BH")) + ":" + GetTimeVal($("#IPC_BM")) + ":00-";
        ts += GetTimeVal($("#IPC_EH")) + ":" + GetTimeVal($("#IPC_EM")) + ":00";
        VideoColor[VideoColor.Name][0].TimeSection = ts;
            
        var cfg = VideoColor[VideoColor.Name][0].VideoColorParam;
        cfg.Brightness = $("#IPCBrightness_Slider").slider("getValue") * 1;		
        cfg.Contrast = $("#IPCContrast_Slider").slider("getValue") * 1;		
        cfg.Saturation = $("#IPCSaturation_Slider").slider("getValue") * 1;	
        cfg.Hue = $("#IPCHue_Slider").slider("getValue") * 1;	
        cfg.Gain = $("#IPCGain_Slider").slider("getValue") * 1;
        var Horizontal_Acutance1= $("#IPCHorizontal_Slider").slider("getValue") * 1;
        var Vertical_Acutance1=($("#IPCVertical_Slider").slider("getValue") * 1 )<< 8;
        cfg.Acutance=0;
        cfg.Acutance |= Horizontal_Acutance1;
        cfg.Acutance |=Vertical_Acutance1;

        cfg = VideoColor[VideoColor.Name][1].VideoColorParam;
        cfg.Brightness = $("#IPCBrightness_Slider2").slider("getValue") * 1;			
        cfg.Contrast = $("#IPCContrast_Slider2").slider("getValue") * 1;
        cfg.Saturation = $("#IPCSaturation_Slider2").slider("getValue") * 1;
        cfg.Hue = $("#IPCHue_Slider2").slider("getValue") * 1;		
        cfg.Gain = $("#IPCGain_Slider2").slider("getValue") * 1;
        var Horizontal_Acutance2= $("#IPCHorizontal_Slider2").slider("getValue") * 1;
        var Vertical_Acutance2=($("#IPCVertical_Slider2").slider("getValue") * 1 )<< 8;
        cfg.Acutance=0;
        cfg.Acutance |= Horizontal_Acutance2;
        cfg.Acutance |=Vertical_Acutance2;
    }

    function WndToCamera(){
        var cfg = CameraCfg[CameraCfg.Name];
        cfg.WhiteBalance = '0x' + toHex($("#IPC_WBMode").val(), 8);
		cfg.PictureMirror = '0x' + toHex($("#IPC_MirrorSwitch").prop("checked") * 1, 8);
		cfg.PictureFlip = '0x' + toHex($("#IPC_FlipSwitch").prop("checked") * 1, 8);
		cfg.IrcutSwap = $("#IPC_IrSwapSwitch").prop("checked") * 1;
		var DNval = $("#IPC_DNMode").val() * 1;
        if(!channelFun.SupportDoubleLightBoxCamera[chnIndex]){
            if($("#IPC_DNMode").val() != null){
                cfg.DayNightColor = '0x' + toHex(DNval, 8);
            }
        }
        cfg.DncThr = $(currentDNCDiv).slider("getValue");
    }

    function WndToCameraEx(){
        var cfgEx = CameraExCfg[CameraExCfg.Name];
        if(_bImgStyle){
            cfgEx.Style = strImgStyle[$("#IPC_Image_Style").val()*1];
        }
        cfgEx.BroadTrends.AutoGain = $("#IPC_DwdrModeSwitch").prop("checked") * 1;
        cfgEx.BroadTrends.Gain = $("#IPC_DwdrStrength").val() * 1;
        
        var DNval = $("#IPC_DNMode").val() * 1;
        if(!channelFun.SupportDoubleLightBoxCamera[chnIndex] && DNval >= 3 
            || channelFun.SupportDoubleLightBoxCamera[chnIndex]){
                cfgEx.AutomaticAdjustment = $(currentGearCtrlBox).slider("getValue");
        }
       
        if(_bCorridorMode){
            cfgEx.CorridorMode = $("#IPC_CorridorMode").prop("checked") * 1;
        }
        if(isObject(CameraAblity) && CameraAblity.SupManualSwitchDayNight == 1){
            var currentIndex = $("#IPC_DayNightSwtichSelect").val() * 1;
            if(isObject(cfgEx.DayNightSwitch)){
                cfgEx.DayNightSwitch.SwitchMode = currentIndex;
                if(currentIndex == 3){
                    var ts = "0 ";
                    ts += GetTimeVal($("#IPC_KeepDayPeriod_BH")) + ":" + GetTimeVal($("#IPC_KeepDayPeriod_BM")) + ":00-";
                    ts += GetTimeVal($("#IPC_KeepDayPeriod_EH")) + ":" + GetTimeVal($("#IPC_KeepDayPeriod_EM")) + ":00";
                    cfgEx.DayNightSwitch.KeepDayPeriod = ts; 
                }
            }
        }
    }
    
    function CheckEnable2(){
        var bEnable2 = $("#IPC_TimeEnable2").prop("checked");
        var EndT = [$("#IPC_BH2").val() * 1, $("#IPC_BM2").val() * 1, $("#IPC_EH2").val() * 1, $("#IPC_EM2").val() * 1];
        if(!bEnable2 || (EndT[0] == 0 && EndT[1] == 0 && EndT[2] == 0 && EndT[3] == 0)){
            $("#IPC_BH").val("00");
            $("#IPC_BM").val("00");
            $("#IPC_EH").val("24");
            $("#IPC_EM").val("00");
        }else{
            if($("#IPC_EH2").val() * 1 != 24){
                $("#IPC_BH").val(GetTimeVal($("#IPC_EH2")));
            }else{
                $("#IPC_BH").val("00");;
            }
            if($("#IPC_BH2").val() * 1 != 0){
                $("#IPC_EH").val(GetTimeVal($("#IPC_BH2")));
            }else{
                $("#IPC_EH").val("00");
            }
            $("#IPC_BM").val(GetTimeVal($("#IPC_EM2")));
            $("#IPC_EM").val(GetTimeVal($("#IPC_BM2")));
            if(24 == $("#IPC_EH").val() * 1){
                $("#IPC_EM").val("00");
            }
        }
        
        $("#TimeSection2 input").prop("disabled", !bEnable2);
        DivBox(bEnable2 ? 1 : 0,"#TimeSection2");
        $("#VideoColor_Box .MaskDiv").css({
            "display": "none",
            "width": "100%",
            "left": 0
        });
        $("#VideoColor_Box .slider").css({
            "opacity": 1,
        });
        if(!bEnable2){
            $("#IPC_BrightnessDiv, #IPC_ContrastDiv, #IPC_SaturationDiv, #IPC_HorizontalDiv, #IPC_HueDiv, #IPC_GainDiv, #IPC_VerticalDiv").find(".MaskDiv")
            .css({
                "display": "block",
                "width": "50%",
                "left": "165px"
            });
            $("#IPC_BrightnessDiv, #IPC_ContrastDiv, #IPC_SaturationDiv, #IPC_HorizontalDiv, #IPC_HueDiv, #IPC_GainDiv, #IPC_VerticalDiv").find(".second").fadeTo("slow", 0.6);
        }
    }
    
    $(function(){
        // Image Style
        $("#IPC_Image_Style").empty();
		for (var i = 0; i < 3; i++) {
			$("#IPC_Image_Style").append('<option value="'+i+'">'+ (lg.get("IDS_CAM_Style") + (i+1)) +'</option>');
		} 

        // Profiles
        $("#IPC_WBMode").empty();
		$("#IPC_WBMode").append('<option value="0">'+ lg.get("IDS_CAM_AutoOper") +'</option>');
		$("#IPC_WBMode").append('<option value="1">'+ lg.get("IDS_CAM_Indoor") +'</option>');
		$("#IPC_WBMode").append('<option value="2">'+ lg.get("IDS_CAM_Outdoor") +'</option>');

        //DWDR
        $("#IPC_DwdrModeSwitch").click(function () {
			ShowLevel($(this).attr('id'));
		});

        var oldChannel = 0;
        $("#ImageChid").change(function(){
            var nChannelNum = $(this).val() * 1;
            if(oldChannel != nChannelNum){
                oldChannel = nChannelNum;
                chnIndex = nChannelNum;
                LoadConfig(function(a){
                    if(a == 100){
                        gDevice.ColorSetPreviewPlay(nChannelNum,1,function(a){
                            MasklayerHide();
                        });
                    }else{
                        if(a == 107){
                            ShowPaop(pageTitle, lg.get("IDS_NO_POWER"));
                        }else{
                            ShowPaop(pageTitle, lg.get("IDS_REFRESH_FAILED"));
                        }                     
                        gDevice.ColorSetPreviewStop(function(){
							MasklayerHide();
						});
                    }
                });
            }
        });
        var nTmpWidth = 120;
        $("#IPCBrightness_Slider").slider({width: nTmpWidth, minValue: 1, maxValue: 100, mouseupCallback: SetColor});
        $("#IPCBrightness_Slider2").slider({width: nTmpWidth, minValue: 1, maxValue: 100, mouseupCallback: SetColor});		
        $("#IPCContrast_Slider").slider({width: nTmpWidth, minValue: 1, maxValue: 100, mouseupCallback: SetColor});
        $("#IPCContrast_Slider2").slider({width: nTmpWidth, minValue: 1, maxValue: 100, mouseupCallback: SetColor});	
        $("#IPCSaturation_Slider").slider({width: nTmpWidth, minValue: 1, maxValue: 100, mouseupCallback: SetColor});
        $("#IPCSaturation_Slider2").slider({width: nTmpWidth, minValue: 1, maxValue: 100, mouseupCallback: SetColor});
        $("#IPCHue_Slider").slider({width: nTmpWidth, minValue: 1, maxValue: 100, mouseupCallback: SetColor});
        $("#IPCHue_Slider2").slider({width: nTmpWidth, minValue: 1, maxValue: 100, mouseupCallback: SetColor});
        $("#IPCGain_Slider").slider({width: nTmpWidth, minValue: 0, maxValue: 100, mouseupCallback: SetColor});
        $("#IPCGain_Slider2").slider({width: nTmpWidth, minValue: 0, maxValue: 100, mouseupCallback: SetColor});
        $("#IPCHorizontal_Slider").slider({width: nTmpWidth, minValue: 0, maxValue: 15, mouseupCallback: SetColor});
        $("#IPCHorizontal_Slider2").slider({width: nTmpWidth, minValue: 0, maxValue: 15, mouseupCallback: SetColor});
        $("#IPCVertical_Slider").slider({width: nTmpWidth, minValue: 0, maxValue: 15, mouseupCallback: SetColor});
        $("#IPCVertical_Slider2").slider({width: nTmpWidth, minValue: 0, maxValue: 15, mouseupCallback: SetColor});

        // Period 和 日夜Mode切换Period初始化
        $("#TimeSection2 input, #IPC_KeepDayPeriod input").unbind();
        $("#TimeSection2 input, #IPC_KeepDayPeriod input").keyup(function(){
            var tmp = $(this).val().replace(/\D/g,'');
            $(this).val(tmp);
            var nWitch;
            var b = $(this).parent().find("input");
            for(var i = 0; i < 4; i++){
                if(b.eq(i).prop("id") == $(this).prop("id")){
                    nWitch = i;
                    break;
                }
            }
            
            var timeArr = [b.eq(0).val() * 1, b.eq(1).val() * 1,
                            b.eq(2).val() * 1, b.eq(3).val() * 1];		
            if (0 == nWitch || 2 == nWitch){
                if (timeArr[nWitch] > 24){
                    timeArr[nWitch] = 24;
                }
            }else{
                var iEh2 = timeArr[nWitch - 1];
                if (iEh2 != 24 && timeArr[nWitch] > 59){
                    timeArr[nWitch] = 59;
                }
                if(iEh2 == 24){
                    timeArr[nWitch] = 0;
                }
            }
            if (timeArr[0] == 24){
				timeArr[1] = 0;
			}	
	
			if (timeArr[2] == 24){
				timeArr[3] = 0;
			}	

            for(i = 0; i < 4; i++){
                if(i != nWitch){
                    b.eq(i).val(timeArr[i] < 10 ? '0' + timeArr[i] : timeArr[i]);
                }else{					
                    if (tmp != ''){
                        b.eq(i).val(timeArr[i]);
                    }
                }
            }
        });
        $("#TimeSection2 input, #IPC_KeepDayPeriod input").blur(function (){
            var i;
            var nWitch;	
            var b = $(this).parent().find("input");
            for(i = 0; i < 4; i++){
                if(b.eq(i).prop("id") == $(this).prop("id")){
                    nWitch = i;
                    break;
                }
            }
            
            var timeArr = [b.eq(0).val() * 1, b.eq(1).val() * 1,
                            b.eq(2).val() * 1, b.eq(3).val() * 1];		
            if (0 == nWitch || 2 == nWitch){
                if (timeArr[nWitch] < 0){
                    timeArr[nWitch] = 0;
                }
                if (timeArr[nWitch] > 24){
                    timeArr[nWitch] = 24;
                }
            }else{
                var iEh2 = timeArr[nWitch - 1];
                if (timeArr[nWitch] < 0){
                    timeArr[nWitch] = 0;
                }
                if (iEh2 != 24 && timeArr[nWitch] > 59){
                    timeArr[nWitch] = 59;
                }
                if(iEh2 == 24){
                    timeArr[nWitch] = 0;
                }
            }
    
            for(i = 0; i < 4; i++){
                b.eq(i).val(timeArr[i] < 10 ? '0' + timeArr[i] : timeArr[i]);
            }
			
            var parentId = $(this).parent().prop("id");
            if(parentId == "TimeSection2"){
                CheckEnable2();
            }
        });
        $("#IPC_TimeEnable2").unbind().click(function(){
            CheckEnable2();
        });
        $("#ImageSetdefault").unbind().click(function(){
            var tip = lg.get("IDS_CAM_DefaultCameraParam");
            var dataHtml = '<div class="confirm_prompt"><div>\n' +
                '<div class="confirm_str">'+tip+'</div></div>' +
                '<div class="btn_box" style="padding-left:100px;">\n' +
                '<input type="button" class="btn" id="defaultBtnOk" value='+lg.get("IDS_OK")+' />\n' +
                '<input type="button" class="btn btn_cancle" value='+lg.get("IDS_CANCEL")+' />' +
                '</div></div>';
            $("#Config_dialog .content_container").html(dataHtml);
            MasklayerShow();
            Config_Title.innerHTML = lg.get("IDS_ALARM_PROMPT");
            SetWndTop("#Config_dialog", 150);
            $("#Config_dialog").css("left", "350px");				
            $("#Config_dialog").css("width", "456px");
            
            $("#Config_dialog").show(function () {
               
            });
            
            $("#defaultBtnOk").unbind().click(function(a){
                closeDialog();
                $("#IPCBrightness_Slider").slider("setValue", 50);			
                $("#IPCContrast_Slider").slider("setValue", 50);		
                $("#IPCSaturation_Slider").slider("setValue", 50);		
                $("#IPCHue_Slider").slider("setValue", 50);		
                $("#IPCGain_Slider").slider("setValue", 0);	
                $("#IPCHorizontal_Slider").slider("setValue", 8);
                $("#IPCVertical_Slider").slider("setValue", 15);
        
                $("#IPCBrightness_Slider2").slider("setValue", 50);			
                $("#IPCContrast_Slider2").slider("setValue", 50);		
                $("#IPCSaturation_Slider2").slider("setValue", 50);		
                $("#IPCHue_Slider2").slider("setValue", 50);		
                $("#IPCGain_Slider2").slider("setValue", 0);	
                $("#IPCHorizontal_Slider2").slider("setValue", 8);
                $("#IPCVertical_Slider2").slider("setValue", 15);
                
                $(currentDNCDiv).slider("setValue", 30)
                $("#IPC_WBMode").val(0);
                $("#IPC_MirrorSwitch, #IPC_FlipSwitch, #IPC_IrSwapSwitch").prop("checked", false);
                if(_bWidth){
                    $("#IPC_DwdrModeSwitch").prop("checked", false);
                    ShowLevel("IPC_DwdrModeSwitch");
                    $("#IPC_DwdrStrength").val(50);
                    $(currentGearCtrlBox).slider("setValue", 3);
                    if(_bImgStyle){
                        $("#IPC_Image_Style").val(1);
                    }
                    if(_bCorridorMode){
                        $("#IPC_CorridorMode").prop("checked", false);
                    }
                    if(isObject(CameraAblity) && CameraAblity.SupManualSwitchDayNight == 1){
                        $("#IPC_DayNightSwtichSelect").val(0);
                        $("#IPC_DayNightSwitchExBox").css("display", "");
                        DivBox(1, "#IPC_GearCtrlBox2");
                        DivBox(0, "#IPC_KeepDayPeriodBox");
                        $("#IPC_GearCtrlBox2 .MaskDiv").css("display", "none");
                    }
                }
                if(channelFun.SupportDoubleLightBoxCamera[chnIndex]){
                    $("#IPC_DNMode").val(0);
                }else{
                    var count = $('#IPC_DNMode option').length;
                    if(count <= 3){
                        $("#IPC_DNMode").val(0);
                    }
                }
                $("#IPC_IR_Cut_0").css("display", "none");
                $("#IPC_IR_Cut_1").css("display", "");
                CameraCfg[CameraCfg.Name].IRCUTMode = 0;
                
                WndToObject();
                WndToCamera();
                if(_bWidth && isObject(CameraExCfg)){
                    WndToCameraEx();
                }
                if(channelFun.SupportDoubleLightBoxCamera[chnIndex]){
                    WhiteLightCfg[WhiteLightCfg.Name].WorkMode = strWorkMode[$("#IPC_DNMode").val() * 1];
                }
                SaveColorToDev();
            });
        });
        $("#ImageSet_Ok").unbind().click(function(){
            WndToObject();
            if(bGetCamera){
                WndToCamera();
                if(_bWidth && isObject(CameraExCfg)){
                    WndToCameraEx();
                }
                if(channelFun.SupportDoubleLightBoxCamera[chnIndex]){
                    WhiteLightCfg[WhiteLightCfg.Name].WorkMode = strWorkMode[$("#IPC_DNMode").val() * 1];
                }
            }
            SaveColorToDev();
        });
        $("#ImageSet_Rf").unbind().click(function(){
            LoadConfig(function(a){
                MasklayerHide();
                if(a == 107){
                    ShowPaop(pageTitle, lg.get("IDS_NO_POWER"));
                }else if(a != 100){
                    if(a == WEB_ERROR.ERR_RUNNING){
                        ShowPaop(pageTitle, lg.get("IDS_WAIT_TIP"));
                    }else{
                        ShowPaop(pageTitle, lg.get("IDS_REFRESH_FAILED"));
                    }
                }
            });
        });
        $(".cfg_container").unbind().scroll(function(event){
            $("#imagesetOcx").css("top",$(".cfg_container")[0].scrollTop+20);
		});

        $("#IPC_DNMode").change(function(){
            ShowAdjustVlaue(currentGearCtrlBox, currentDNCDiv);
            if(bSupportFullColorLightWorkPeriod)
			{
				$("#IPC_WhiteLightUpBox").css("display", $("#IPC_DNMode").val() * 1 == 1 ? "" : "none");
			}
            if(_bLP4G){
                SetLP4GLedParameter();
                return;
            }
            if(channelFun.SupportDoubleLightBoxCamera[chnIndex]){
                SetWhiteLight();
            }else{
                SetCamera();
            }
        });
        $("#IPC_DayNightSwtichSelect").change(function(){
            ShowDayNightSwitchControl();
        });
        $("#IPC_WBMode").change(function(){
            SetCamera();
        })
        $("#IPC_MirrorSwitch, #IPC_FlipSwitch, #IPC_IrSwapSwitch").click(function(){
            SetCamera();
        });
        $("#IPC_DwdrModeSwitch, #IPC_CorridorMode").click(function(){
            SetCameraEx();
        });
        $("#IPC_DwdrStrength").blur(function(){
            SetCameraEx();
        });
        $("#IPC_Image_Style").change(function(){
            SetCameraEx();
        });
       
        function initImageSet(){
            var chnArry = [];
            $("#ImageChid").empty();
            if(nDigChannel > 0){
                var ssDigitChStatus;
                var ssRemoteDevice;
                function AddDigitChannels(){
                    var digStatus = 0;
                    // 初始化ChannelList
                    for (var i = nAnaChannel; i < gDevice.loginRsp.ChannelNum; i++) {
						var m = i - nAnaChannel;
                        if (ssDigitChStatus[m].Status != "Connected") {
							if (++digStatus == gDevice.loginRsp.DigChannel){						
								chnIndex = -1;
							}
							continue;
						}

                        var nIndex = ssRemoteDevice[m].SingleConnId - 1;//配置的第几个
                        if (ssRemoteDevice[m].ConnType == "SINGLE" && nIndex >= 0
                            && ssRemoteDevice[m].Decoder[nIndex].Protocol == "TCP"){
                            var dataHtml = '<option value="' + i + '">' + gDevice.getChannelName(i) + '</option>';
                            $("#ImageChid").append(dataHtml);
                            if(chnIndex == -1){
                                chnIndex = i;
                            }
							chnArry.push(i);
                        }					
					}
                    if(chnArry.length > 0){
						if($.inArray(chnIndex, chnArry) < 0){
							chnIndex = chnArry[0];
						}
                        $("#ImageChid").val(chnIndex);
                        LoadConfig(function(a){
                            if(a == 100){
                                gDevice.ColorSetPreviewPlay(chnIndex,1,function(a){
                                    MasklayerHide();
                                });
                            }else if(a == 107){
                                MasklayerHide();
                                ShowPaop(pageTitle, lg.get("IDS_NO_POWER"));
                            }else{
                                MasklayerHide();
                                ShowPaop(pageTitle, lg.get("IDS_REFRESH_FAILED"));
                            }
                        });
                    }else{
                        $(".cfg_container").css("visibility", "hidden");
                        gDevice.HidePlugin(true,function(){
                            MasklayerHide();
                            ShowPaop(pageTitle, lg.get("IDS_CHSTA_NoConfig"));
                        });
                    }
                }
                RfParamCall(function(a){
                    ssDigitChStatus = a[a.Name];
                    RfParamCall(function(b){
                        ssRemoteDevice = b[b.Name];
                        AddDigitChannels();
                    }, pageTitle, "NetWork.RemoteDeviceV3", -1, WSMsgID.WsMsgID_CONFIG_GET);
                }, pageTitle, "NetWork.ChnStatus", -1, WSMsgID.WsMsgID_CONFIG_GET);
            }else{
				$(".cfg_container").css("visibility", "hidden");
                MasklayerHide();
                ShowPaop(pageTitle, lg.get("IDS_CHSTA_NoConfig"));
			}
        }
        initImageSetEvent = initImageSet;
        initImageSet();
	});
});