//# sourceURL=IPCParam_LightSet.js
$(function() {
	var chnIndex = -1;
	var pageTitle = $("#IPCParam_LightSet").text();
	var channelFun;
    var WhiteLightCfg;
	var bSupportWhiteLight = false;
	var strWorkMode = ["KeepOpen","Auto","Timing","Intelligent","Atmosphere","Glint","Close" ];	

	function ShowData(){
		if(!bSupportWhiteLight){
			$("#LightDivBoxAll").css("display", "none");
			$("#LightSetSv").attr("disabled", true);
			$("#LightSetSv").stop().addClass("btn-disable").fadeTo("slow", 0.2);
			$("#WorkMode").empty();
			$("#WorkMode").append('<option value="6">'+ lg.get("IDS_CAM_WorkModeChoose7") +'</option>');
			DivBox(0, "#WorkMode_Div");
			$("#WorkMode_Div").css("display", "");
			$("#DNMode_Div").css("display", "none");
			MasklayerHide();
			return;
		}
		var cfg = WhiteLightCfg[WhiteLightCfg.Name];
		var i;
		if(channelFun.SupportDoubleLightBoxCamera[chnIndex]){
			$("#DurationSlider").slider({width: 280, minValue: 1, maxValue: 120, mouseupCallback: null});
			$("#DurationSlider .slider-entire").css("margin-top", "5px");
			$("#LightDNMode").empty();
			$("#LightDNMode").append('<option value="1">'+ lg.get("IDS_CAM_WarmLight") +'</option>');
			$("#LightDNMode").append('<option value="3">'+ lg.get("IDS_CAM_IntelMotionDetect") +'</option>');
			$("#LightDNMode").append('<option value="6">'+ lg.get("IDS_CAM_InteligentInfrared") +'</option>');
			for(i = 0; i < strWorkMode.length; i++){
				if(strWorkMode[i] == cfg.WorkMode){
					break;
				}
			}
			$("#LightDNMode").val(i);
			$("#DNMode_Div").css("display", "");
			$("#WorkMode_Div").css("display", "none");
			UpdatDNMode();

			$("#LightLevel").empty();
			$("#LightLevel").append('<option value="1">'+ lg.get("IDS_CAM_WEAK") +'</option>');
			$("#LightLevel").append('<option value="3">'+ lg.get("IDS_CAM_MIDD") +'</option>');
			$("#LightLevel").append('<option value="5">'+ lg.get("IDS_CAM_STRONG") +'</option>');
		}else{
			$("#DurationSlider").slider({width: 280, minValue: 1, maxValue: 60, mouseupCallback: null});
			$("#DurationSlider .slider-entire").css("margin-top", "5px");
			UpdateWorkMode();
			for(i = 0; i < strWorkMode.length; i++){
				if(strWorkMode[i] == cfg.WorkMode){
					break;
				}
			}
			$("#WorkMode").val(i);

			$("#WorkMode_Div").css("display", "");
			$("#DNMode_Div").css("display", "none");
			$("#LightLevel").empty();
			$("#LightLevel").append('<option value="1">1</option>');
			$("#LightLevel").append('<option value="2">2</option>');
			$("#LightLevel").append('<option value="3">3</option>');
			$("#LightLevel").append('<option value="4">4</option>');
			$("#LightLevel").append('<option value="5">5</option>');

			$("#LightDivBoxAll").css("display", "");
			$("#WorkPeriod_Box").css("display", "");
		}
		$("#LightLevel").val(cfg.MoveTrigLight.Level);
		$("#DurationSlider").slider("setValue", cfg.MoveTrigLight.Duration);
		$("#StartHour").val(cfg.WorkPeriod.SHour);
		$("#StartMinute").val(cfg.WorkPeriod.SMinute);
		$("#EndHour").val(cfg.WorkPeriod.EHour);
		$("#EndMinute").val(cfg.WorkPeriod.EMinute);

		DivBox(1, "#WorkMode_Div");
		$("#LightSetSv").attr("disabled", false);
		$("#LightSetSv").stop().removeClass("btn-disable").fadeTo("slow", 1);
		MasklayerHide();
	}
	function UpdatDNMode(){
		var nMode = $("#LightDNMode").val() * 1;
		if(nMode == 3){
			$("#LightDivBoxAll").css("display", "");
			$("#WorkPeriod_Box").css("display", "none");
		}else{
			$("#LightDivBoxAll").css("display", "none");
		}
	}

	function UpdateWorkMode(){
		$("#WorkMode").empty();
		if(channelFun.SupportCameraWhiteLight[chnIndex]){
			$("#WorkMode").append('<option value="0">'+ lg.get("IDS_CAM_WorkModeChoose1") +'</option>');
			$("#WorkMode").append('<option value="1">'+ lg.get("IDS_CAM_WorkModeChoose2") +'</option>');
			$("#WorkMode").append('<option value="2">'+ lg.get("IDS_CAM_WorkModeChoose3") +'</option>');
			$("#WorkMode").append('<option value="6">'+ lg.get("IDS_CAM_WorkModeChoose7") +'</option>');
		}else if(channelFun.SupportDoubleLightBulb[chnIndex]){
			$("#WorkMode").append('<option value="0">'+ lg.get("IDS_CAM_WorkModeChoose1") +'</option>');
			$("#WorkMode").append('<option value="1">'+ lg.get("IDS_CAM_WorkModeChoose2") +'</option>');
			$("#WorkMode").append('<option value="2">'+ lg.get("IDS_CAM_WorkModeChoose3") +'</option>');
			$("#WorkMode").append('<option value="3">'+ lg.get("IDS_CAM_WorkModeChoose4") +'</option>');
			$("#WorkMode").append('<option value="6">'+ lg.get("IDS_CAM_WorkModeChoose7") +'</option>');
		}else if(channelFun.SupportMusicLightBulb[chnIndex]){
			$("#WorkMode").append('<option value="0">'+ lg.get("IDS_CAM_WorkModeChoose1") +'</option>');
			$("#WorkMode").append('<option value="1">'+ lg.get("IDS_CAM_WorkModeChoose2") +'</option>');
			$("#WorkMode").append('<option value="2">'+ lg.get("IDS_CAM_WorkModeChoose3") +'</option>');
			$("#WorkMode").append('<option value="4">'+ lg.get("IDS_CAM_WorkModeChoose5") +'</option>');
			$("#WorkMode").append('<option value="5">'+ lg.get("IDS_CAM_WorkModeChoose6") +'</option>');
			$("#WorkMode").append('<option value="6">'+ lg.get("IDS_CAM_WorkModeChoose7") +'</option>');
		}
	}

	function GetWhiteLightCfg(){
		bSupportWhiteLight = (channelFun.SupportDoubleLightBoxCamera[chnIndex] || (channelFun.SupportCameraWhiteLight[chnIndex]
			|| channelFun.SupportDoubleLightBulb[chnIndex] || channelFun.SupportMusicLightBulb[chnIndex]));
        if(bSupportWhiteLight){
            RfParamCall(function(a){
                WhiteLightCfg = a;
				ShowData();
            }, pageTitle, "Camera.WhiteLight", chnIndex, WSMsgID.WsMsgID_CONFIG_GET);
         }else {
             ShowData();
         }
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
			if(typeof channelFun.SupportCameraWhiteLight == 'undefined'){
				channelFun.SupportCameraWhiteLight = [];
				for(var i = 0; i < gDevice.loginRsp.ChannelNum; i++){
					channelFun.SupportCameraWhiteLight[i] = 0;
				}
			}
			if(typeof channelFun.SupportDoubleLightBulb == 'undefined'){
				channelFun.SupportDoubleLightBulb = [];
				for(var i = 0; i < gDevice.loginRsp.ChannelNum; i++){
					channelFun.SupportDoubleLightBulb[i] = 0;
				}
			}
			if(typeof channelFun.SupportMusicLightBulb == 'undefined'){
				channelFun.SupportMusicLightBulb = [];
				for(var i = 0; i < gDevice.loginRsp.ChannelNum; i++){
					channelFun.SupportMusicLightBulb[i] = 0;
				}
			}

			GetWhiteLightCfg(); 
		}, pageTitle, "ChannelSystemFunction", -1, WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ);
	}

	function InitChannel(){
		$("#IPCChannelNum").empty();
		IPArry = [];
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
							$("#IPCChannelNum").append(dataHtml);
						}
					}
					if(chnArry.length > 0){
						if($.inArray(chnIndex, chnArry) < 0){
							chnIndex = chnArry[0];
						}
						$("#IPCChannelNum").val(chnIndex);
						GetChannelFunc();
						MasklayerHide();
					}else{
						MasklayerHide();
						$("#IPCLightSet_page").hide();
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

	$(function() {
		$("#IPCChannelNum").change(function(){
			var nChn = $("#IPCChannelNum").val() * 1;
			chnIndex = nChn;
			GetWhiteLightCfg();
		});
		$("#LightDNMode").change(function(){
			UpdatDNMode();
		});
		$("#LightSetRf").click(function(){
			InitChannel();
		});
		$("#LightSetSv").click(function(){
			if(!bSupportWhiteLight){
				return;
			}

			var cfg = WhiteLightCfg[WhiteLightCfg.Name];
			var nMode = 0;
			if(channelFun.SupportDoubleLightBoxCamera[chnIndex]){
				nMode = $("#LightDNMode").val() * 1
			}else{
				nMode = $("#WorkMode").val() * 1;
			}
			cfg.WorkMode = strWorkMode[nMode];
			cfg.MoveTrigLight.Level = $("#LightLevel").val() * 1;
			cfg.MoveTrigLight.Duration = $("#DurationSlider").slider("getValue");
			cfg.WorkPeriod.SHour = $("#StartHour").val() * 1;
			cfg.WorkPeriod.SMinute = $("#StartMinute").val() * 1;
			cfg.WorkPeriod.EHour = $("#EndHour").val() * 1;
			cfg.WorkPeriod.EMinute = $("#EndMinute").val() * 1;

			RfParamCall(function(a){
                ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
            }, pageTitle, "Camera.WhiteLight", chnIndex, WSMsgID.WsMsgID_CONFIG_SET, WhiteLightCfg);
		});
		$("#WorkPeriod_Box input").unbind();
		$("#WorkPeriod_Box input").keyup(function(){
			var tmp = $(this).val().replace(/\D/g,'');
            $(this).val(tmp);
            var nWitch;
            var b = $("#WorkPeriod_Box input");	
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
		$("#WorkPeriod_Box input").blur(function (){
            var i;
            var nWitch;	
            var b = $("#WorkPeriod_Box input");	
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
        });

		InitChannel();
	});
});