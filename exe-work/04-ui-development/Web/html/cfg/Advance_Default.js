//# sourceURL=Advance_Default.js
$(function() {
	var bRecord = true;
	var bCommPTZ = true;
	var bEncode = true;
	var bCamera = false;
	var pageTitle = $("#Advance_Default").text();
	$(".StyleV1").css("display", "none");
	$(".StyleV2").css("display", "none");
	$(function () {
		if(!GetFunAbility(gDevice.Ability.OtherFunction.SupportRestoreConfigV2)){
			$(".StyleV1").css("display", "");
			$(".StyleV2").css("display", "none");
		}else{
			$(".StyleV1").css("display", "none");
			$(".StyleV2").css("display", "");
		}

		if(!GetFunAbility(gDevice.Ability.CommFunction.CommRS485) && !GetFunAbility(gDevice.Ability.CommFunction.CommRS232)){
			$("#CommBox").css("display", "none");
			bCommPTZ = false;
		}
		if(GetFunAbility(gDevice.Ability.OtherFunction.NOHDDRECORD)){
			$("#RecodeBox").css("display", "none");
			bRecord = false;
		}
		if(gDevice.loginRsp.DigChannel == gDevice.loginRsp.ChannelNum){
			$("#EncodeBox").css("display", "none");
			bEncode = false;
		}
		$("#AllDefault").click(function() {
			var bCheck = $(this).prop("checked");
			$("#DefaultCfg input").prop("checked", bCheck);
			if (!bRecord) {
				$("#RecordCfg").prop("checked", true);
			}
			if (!bCommPTZ) {
				$("#CommCfg").prop("checked", true);
			}
			if (!bEncode) {
				$("#EncodeCfg").prop("checked", true);
			}
			if (!bCamera) {
				$("#CameraCfg").prop("checked", true);
			}
		});
		$("#DefaultCfg input").click(function() {
			var bCheckNum = 0;
			$("#DefaultCfg input").each(function(){
				if($(this).prop("checked")){
					bCheckNum++;
				}
			});
			if(bCheckNum == $("#DefaultCfg").find("input").length){
				$("#AllDefault").prop("checked", true);
			}else{
				$("#AllDefault").prop("checked", false);
			}
	
		});
		$("#DefaultSave").click(function() {
			var DefaultConfig = {
				"CameraPARAM" : false,
				"CommPtz" : false,
				"Record" : false,
				"Encode" :false,
				"XMModeSwitch" :false,
				"RestoreDefaultConfig" : false,
				"RestoreFactoryConfig" : false
			};
			DefaultConfig.Account = $("#AccountCfg").prop("checked");
			DefaultConfig.Alarm = $("#AlarmCfg").prop("checked");
			DefaultConfig.General = $("#GeneralCfg").prop("checked");
			DefaultConfig.NetCommon = $("#NetworkCfg").prop("checked");
			DefaultConfig.NetServer = $("#NetServerCfg").prop("checked");
			DefaultConfig.Preview =  $("#DisplayCfg").prop("checked");
			if(bCommPTZ){
				DefaultConfig.CommPtz = $("#CommCfg").prop("checked");
			}
			if(bEncode){
				DefaultConfig.Encode = $("#EncodeCfg").prop("checked");
			}
			if(bRecord){
				DefaultConfig.Record = $("#RecordCfg").prop("checked");
			}
			if(bCamera){
				DefaultConfig.CameraPARAM = $("#CameraCfg").prop("checked");
			}
			var data = {
				"Name" : "OPDefaultConfig",
				"OPDefaultConfig" : DefaultConfig
			};
			RfParamCall(function(a,b){
				if (a.Ret == 100) {
					// 若是爱芯IPC设备，恢复默认了报警设置
					if(DefaultConfig.Alarm && gDevice.devType == devTypeEnum.DEV_IPC && GetFunAbility(gDevice.Ability.AlarmFunction.HumanDection))
					{
						// 若是支持客户端绘制规则框，需要重置一下插件的显示使能
						RfParamCall(function(a){
							if(a.Ret == 100){
								var humanAbility = a[a.Name];
								if(isObject(humanAbility) && humanAbility.ShowRule)
								{
									RfParamCall(function(a){
										if(a.Ret == 100){
											var HumanCfg = a; 
											msg = {
												"MainType": 34,
												"SubType": 1,
												"Channel": 0,
												"ShowRule": HumanCfg[HumanCfg.Name].ShowRule,
												"AreaNum": humanAbility.AreaNum,
												"LineNum": humanAbility.LineNum,
												"PedRule": HumanCfg[HumanCfg.Name].PedRule,							
											};
											gDevice.sendHumanCfg(msg, function(a){
												if(a.Ret == 100){
													ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
												}
												else
												{
													ShowPaop(pageTitle, lg.get("IDS_SAVE_FAILED"));
												}
											});
										}
										else
										{
											ShowPaop(pageTitle, lg.get("GetConfigFail"));
										}
									}, pageTitle, "Detect.HumanDetection", 0, WSMsgID.WsMsgID_CONFIG_GET, null, true);
								}
								else
								{
									ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
								}
							}
							else
							{
								ShowPaop(pageTitle, lg.get("GetConfigFail"));
							}
						}, pageTitle, "HumanRuleLimit", -1, WSMsgID.WsMsgID_ABILITY_GET, null, true);
					}
					else
					{
						ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
					}
				} else if (a.Ret == 603) {
					var req = {
						"Name": "OPMachine",
						"OPMachine": { "Action": "Reboot" }
					};
					RfParamCall(function (a, b) {
						if (a.Ret == 100 || a.Ret == -2) {
							ShowPaop(pageTitle, lg.get("IDS_DVR_REBOOT"));
							AutoClose(pageTitle);
						} else {
							ShowPaop(pageTitle, lg.get("IDS_SEND_FAILED"));
						}
					}, "", "OPMachine", -1, WSMsgID.WSMsgID_SYSMANAGER_REQ, req);
				} else {
					if (DefaultConfig.NetCommon || DefaultConfig.Account) {
						closewnd(2);
					}
				}
			}, pageTitle, "OPDefaultConfig", -1, WSMsgID.WSMsgID_SYSMANAGER_REQ, data);
		});
		$("#DefaultReset").click(function() {
			var DefaultConfig = {
				"CameraPARAM" : true,
				"CommPtz" : true,
				"Record" : true,
				"Encode" :true,
				"XMModeSwitch" :true,
				"RestoreDefaultConfig" : true,
				"RestoreFactoryConfig" : true
			};
			DefaultConfig.Account = false;
			DefaultConfig.Alarm = true;
			DefaultConfig.General = true;
			DefaultConfig.NetCommon = false;
			DefaultConfig.NetServer = true;
			DefaultConfig.Preview =  true;
			if(bCommPTZ){
				DefaultConfig.CommPtz = true;
			}
			if(bEncode){
				DefaultConfig.Encode = true;
			}
			if(bRecord){
				DefaultConfig.Record = true;
			}
			if(bCamera){
				DefaultConfig.CameraPARAM = true;
			}
			var data = {
				"Name" : "OPDefaultConfig",
				"OPDefaultConfig" : DefaultConfig
			};
			RfParamCall(function(a,b){
				if (a.Ret == 100) {
					ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
				} else if (a.Ret == 603) {
					var req = {
						"Name": "OPMachine",
						"OPMachine": { "Action": "Reboot" }
					};
					RfParamCall(function (a, b) {
						if (a.Ret == 100 || a.Ret == -2) {
							ShowPaop(pageTitle, lg.get("IDS_DVR_REBOOT"));
							AutoClose(pageTitle);
						} else {
							ShowPaop(pageTitle, lg.get("IDS_SEND_FAILED"));
						}
					}, "", "OPMachine", -1, WSMsgID.WSMsgID_SYSMANAGER_REQ, req);
				} else {
					if (DefaultConfig.NetCommon || DefaultConfig.Account) {
						closewnd(2);
					}
				}
			}, pageTitle, "OPDefaultConfig", -1, WSMsgID.WSMsgID_SYSMANAGER_REQ, data);
		});
		$("#FactoryReset").click(function() {
			function b(){
				var DefaultConfig = {
					"CameraPARAM" : true,
					"CommPtz" : true,
					"Record" : true,
					"Encode" :true,
					"XMModeSwitch" :true,
					"RestoreDefaultConfig" : true,
					"RestoreFactoryConfig" : true
				};
				DefaultConfig.Account = true;
				DefaultConfig.Alarm = true;
				DefaultConfig.General = true;
				DefaultConfig.NetCommon = true;
				DefaultConfig.NetServer = true;
				DefaultConfig.Preview =  true;
				if(bCommPTZ){
					DefaultConfig.CommPtz = true;
				}
				if(bEncode){
					DefaultConfig.Encode = true;
				}
				if(bRecord){
					DefaultConfig.Record = true;
				}
				if(bCamera){
					DefaultConfig.CameraPARAM = true;
				}
				var data = {
					"Name" : "OPDefaultConfig",
					"OPDefaultConfig" : DefaultConfig
				};
				RfParamCall(function(a,b){
					if (a.Ret == 100) {
						ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
					} else if (a.Ret == 603) {
						RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), false);
					} else if (a.Ret == -2) {
						MasklayerShow();
						ShowPaop(pageTitle, lg.get("IDS_DEF_FactoryResetNeedReboot"));
						window.setTimeout(function() {
							closewnd(2);
						}, 5000);
					}else {
						if (DefaultConfig.NetCommon || DefaultConfig.Account) {
							closewnd(2);
						}
					}
				}, pageTitle, "OPDefaultConfig", -1, WSMsgID.WSMsgID_SYSMANAGER_REQ, data);
			}
			
			var dataHtml = 
			'	<div id="login_box">\n' + 
			'		<div class="cfg_row">\n' +
			'			<div class="cfg_row_left">'+ lg.get("IDS_USERNAME") +'</div>\n' +
			'			<div class="cfg_row_right" style="width: auto">\n' +
			'				<input class="inputTxt" type="text" id="confirm_UserName" value='+ gDevice.username +' autocomplete="off" disabled="true"/>\n' +
			'			</div>\n' +
			'		</div>\n' +
			'       <div class="cfg_row">\n' +
			'          	<div class="cfg_row_left">'+ lg.get("IDS_PSW") +'</div>\n' +
			'          	<div class="cfg_row_right" style="width: auto">\n' +
			'				<div class="cfg_row_pwd" style="width: 298px">\n' +
			'					<input class="inputTxt PswEyeShow" type="text" id="confirm_Pwd" autocomplete="off"/>\n' +
			'					<div class="psw_eye_arc">\n' +
			'						<div class="psw_eye_cicle" style="margin-top:-4px; margin-left:10px;"></div>\n' +
			'					</div>\n' +
			'				</div>\n' +
			'           </div>\n' +
			'		</div>\n' +
			'	</div>\n' +	
		
			'	<div class="btn_box" style="padding-left:150px;">\n' +
			'		<button id="confirmBtnOk" class="btn">' + lg.get("IDS_OK") + '</button>\n' +
			'		<button class="btn btn_cancle" id="btnCancel">' + lg.get("IDS_CANCEL") + '</button>\n' +
			'	</div>\n';
			$("#Config_dialog .content_container").html(dataHtml);
			Config_Title.innerHTML = lg.get("IDS_CONFIRM_PWD");
			SetWndTop("#Config_dialog", 60);						
			$("#Config_dialog").css("width", '550px');
			MasklayerShow(1);
			$("#Config_dialog").show();
			
			$("#confirmBtnOk").click(function(){
				var confirmPwd = $("#confirm_Pwd").val();
				if(confirmPwd == gDevice.password){
					closeDialog();
					b();
				}else{
					ShowPaop(pageTitle, lg.get("IDS_PSWERROR1"));
				}
			});
		});
		ChangeBtnState2();
		
		if(gDevice.devType == devTypeEnum.DEV_IPC){
			RfParamCall(function(a,b){
				if (a.Ret == 100) {
					$("#CameraBox").css("display", "");
					bCamera = true;
					MasklayerHide();
				}
			}, pageTitle, "Camera", -1, WSMsgID.WsMsgID_ABILITY_GET);
		}else{
			MasklayerHide();
		}
	});
});
