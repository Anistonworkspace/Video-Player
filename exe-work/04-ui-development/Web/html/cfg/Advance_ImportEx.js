//# sourceURL=Advance_ImportEx.js
$(function(){
	var pageTitle = $("#Advance_ImportEx").text();
	var OPLogQuery = {};
	var LogPath;
	var LogPageList = [];
	var nGetPage;
	var color = gVar.skin_mColor;
    var bColor = gVar.skin_bColor;
	var bSupportIPCConfigExport = GetFunAbility(gDevice.Ability.OtherFunction.SupportExportIPCLog);
	var bIPC = gDevice.devType == devTypeEnum.DEV_IPC;
	var nDigChannel = gDevice.loginRsp.DigChannel;
	var nAnaChannel = gDevice.loginRsp.VideoInChannel;

	function SearchLog(){
		var req = {};
		req.Name = "OPLogQuery";
		req.OPLogQuery = OPLogQuery;
		RfParamCall(function(a){
			var nLen;
			if(a.Ret == 100){
				if(a.OPLogQuery){
					nLen = a.OPLogQuery.length;
					LogPageList[nGetPage] = a.OPLogQuery;
					nGetPage++;
				}
				if(a.OPLogQuery == null || nLen < 128){
					WriteLogInfo();
					MasklayerHide();
				}else if(nLen >= 128){
					OPLogQuery.LogPosition = LogPageList[nGetPage - 1][nLen-1].Position + 1;
					SearchLog();
				}
			}else if(a.Ret == 107){
				MasklayerHide();
				ShowPaop(pageTitle, lg.get("IDS_NO_POWER"));
			}else{
				MasklayerHide();
				ShowPaop(pageTitle, lg.get("IDS_IMEX_ExportFail"));
			}
		}, pageTitle, "OPLogQuery", -1, WSMsgID.WSMsgID_LOGSEARCH_REQ, req, false, true);
	}
	function WriteLogInfo(){
		var logInfo = "";
		for (var i = 0; i < nGetPage; i++){
			if (LogPageList[i] == null) {
				break;
			}
			for(var j = 0; j < LogPageList[i].length; j++){
				var info = GetLogType(i, j);
				logInfo += prefixInteger(j+i*128, 5) + '\t';
				logInfo += info.Time + '\t';;
				logInfo += info.Con + '\r\n';
			}
		}
		SaveFileToLocal(logInfo, LogPath);
	}
	function GetLogType(nCurPage, i){
		var objLog = LogPageList[nCurPage][i];
		var info={
			Time: objLog.Time,
			Con: lg.getEx(objLog.Type)
		};
		if(objLog.Data != ""){
			info.Con = lg.getEx(objLog.Type) + ' [' + lg.getEx(objLog.Data) + ']'
		}
		var type = objLog.Type;
		switch(type){
			case "EventStart":
			case "EventStop":
				info.Type = lg.get("IDS_LOGTYPE_ALARM");
				var channel;
				if(objLog.Data.indexOf(',') != -1){
					var data = objLog.Data.split(',');
					channel = parseInt(data[1]) + ' ' + lg.get("IDS_CHANNEL");
					info.Con = lg.getEx(objLog.Type) + ' [' + lg.getEx(data[0]) + ', ' + channel + ']';
				}else{
					channel = '1 ' + lg.get("IDS_CHANNEL");
					info.Con = lg.getEx(objLog.Type) + ' [' + lg.getEx(objLog.Data) + ', ' + channel + ']';
				}
				break;
			case "Reboot":
			case "SaveSystemState":
			case "ShutDown":
			case "ClearLog":
			case "ModifyTime":
			case "ZeroBitrate":
			case "Upgrade":
			case "Exception":
			case "Update":
			case "SetTime":
			case "RecoverTime":
				info.Type = lg.get("IDS_LOGTYPE_SYSTEM");
				break;
			case "Record":
				info.Type = lg.get("IDS_LOGTYPE_RECORD");
			case "LogIn": 
			case "LogOut":
			case "AddUser":
			case "DeleteUser":
			case "ModifyUser":
			case "ModifyPassword":
			case "AddGroup":
			case "DeleteGroup":
			case "ModifyGroup":
			case "AccountRestore":
				info.Type = lg.get("IDS_LOGTYPE_ACCOUNT");
				info.Con = lg.getEx(type);
				if(objLog.Data != ""){
					info.Con = lg.getEx(type) + ' [' + objLog.Data + ']';
				}
				break;
			case "SaveConfig":
				info.Type = lg.get("IDS_LOGTYPE_CONFIG");
				if(objLog.Data.indexOf("&Title.NetCamera") >=0 ){
					var reg;
					var context = objLog.Data;
					if(context.indexOf('<')){
						context = context.split('<');
						var str = context[0].replace(/\s/g,"");
						if(str.indexOf(".") >= 0){
							var dataType = str.split('.');
							context = lg.getEx(dataType[1]) + ' &lt;' + context[1];
						}else{
							context = lg.getEx(str) + ' &lt;' + context[1];
						}
					}
					reg = new RegExp("&Title.NetCamera","g");
					context = context.replace(reg,lg.getEx("DigitalChannel"));
					info.Con = lg.getEx(type) + ' [' + context + ']';
				}else{
					info.Con = lg.getEx(type) + ' [' + lg.getEx(objLog.Data) + ']';
				}
				break;
			case "SetDriverType":
			case "ClearDriver":
			case "StorageDeviceError":
			case "DiskChanged":
			case "DiskOver":
				info.Type = lg.get("IDS_LOGTYPE_STORAGE");
				if(type == "DiskOver"){
					var nSATA = objLog.Data * 1 + 1;
					info.Con = lg.getEx(objLog.Type) + ' [' + nSATA + ']';
				}
				break;
			case "FileAccessError":
			case "FileSearch":
			case "FileAccess":
				info.Type = lg.get("IDS_LOGTYPE_FILEACCESS");
				break;
			default:
				info.Type = lg.getEx(type);
				info.Con = '[' + objLog.Data + ']';
				break;
		}
		return info;
	}

	$(function(){
		if(bSupportIPCConfigExport)
		{
			LogImExTitle.innerHTML = lg.get("IPC " + lg.get("LogExport"));
			$("#IPCLogChannelDiv").css("display", "");
			$("#SelectAll_CheckBox").css("display", "");
			recChannel("IPCLogChannelDiv", color, bColor);
			ChannelH = $("#IPCLogChannelDiv").height();
			$("#IPCLogChannelDiv .MaskDiv").css("height", ChannelH + "px");
			ShowMask("#IPCLogChannelDiv > div[name!='all']", "0x00000000");
			$("#ImportExportBox").css("height", ChannelH + 30 + "px");
			$("#ExportIPCLog").css("margin-top", "16px");
			$("#LogImExTitle").css("display", "");
			$("#IPCLogExportDiv").css("display", "");

			if(nDigChannel > 0 && !bIPC)
			{
				RfParamCall(function(a){
					if(a.Ret == 100){
						ssDigitChStatus = a[a.Name];

						RfParamCall(function(b){
							if(b.Ret == 100){
								ssRemoteDevice = b[b.Name];

								var allChnDisabled = true;
								// 禁用未连接Channel, 禁用非TCPProtocol
								for (var i = nAnaChannel; i < gDevice.loginRsp.ChannelNum; i++) {
									var m = i - nAnaChannel;
									var nIndex = ssRemoteDevice[m].SingleConnId - 1;	//配置的第几个
									if (ssDigitChStatus[m].Status != "Connected" ||
										ssRemoteDevice[m].ConnType == "SINGLE" && nIndex >= 0 && (ssRemoteDevice[m].Decoder[nIndex].Protocol == "ONVIF" || ssRemoteDevice[m].Decoder[nIndex].Protocol == "RTSP")) 
									{
										$("#IPCLogChannelDiv div[index='" + m + "']").unbind().css("background-color", "#C1C1C1").attr("status", "disabled");
									}	
									else
									{
										allChnDisabled = false;
										$("#IPCLogChannelDiv div[index='" + m + "']").click(function(){
											var allAvaiableChn = $("#IPCLogChannelDiv").find("div[name!='all']");
											
											var bSelectAll = true;
											for(var i = 0; i < allAvaiableChn.length; i++)
											{
												if($(allAvaiableChn[i]).attr("status") != "disabled")
												{
													if($("#IPCLogChannelDiv div[index='" + i + "']").css("background-color") != color)
													{
														bSelectAll = false;
														break;
													}
												}
											}
											$("#SelectAll_Check").prop("checked", bSelectAll);
										});
									}
								}
								if(allChnDisabled)
								{
									DivBox(0, "#SelectAll_CheckBox");
								}
								
								// 禁用All选
								var allSelect = $("#IPCLogChannelDiv").find("div[name='all']");
								for(var i = 0; i < allSelect.length; i++){
									allSelect.eq(i).unbind().css("opacity", 0.0);
								}

								$("#SelectAll_Check").click(function(){
									var bSelectAll = $(this).prop("checked");
									var allAvaiableChn = $("#IPCLogChannelDiv").find("div[name!='all']");

									for(var i = 0; i < allAvaiableChn.length; i++)
									{
										if($(allAvaiableChn[i]).attr("status") != "disabled")
										{
											$("#IPCLogChannelDiv div[index='" + i + "']").css({
												"background-color" : (bSelectAll ? color : "transparent"),
												"color" : (bSelectAll ? "#FFFFFF" : "inherit") });
										}
									}
								});

								MasklayerHide();
							}
							else
							{
								MasklayerHide();
								ShowPaop(pageTitle, lg.get("GetConfigFail"));
							}
						}, pageTitle, "NetWork.RemoteDeviceV3", -1, WSMsgID.WsMsgID_CONFIG_GET);
					}
					else
					{
						MasklayerHide();
						ShowPaop(pageTitle, lg.get("GetConfigFail"));
					}
                }, pageTitle, "NetWork.ChnStatus", -1, WSMsgID.WsMsgID_CONFIG_GET);
			}
		}

		$("#ImportCfg").click(function(){
			$("#InputFileChoose").val("");
			$("#InputFileChoose").click();
		});
		$("#ExportCfg").click(function(){
			RfParamCall(function(a){
				if (a.Ret == 100){
					var outArr = base64ToBytes(a.Data);
					var curTime = new Date();
					var fileName = "Cfg_" + gDevice.loginRsp.SoftWareVersion + "_";
					fileName += curTime.getFullYear();
					fileName += prefixInteger(curTime.getMonth()+1, 2);
					fileName += prefixInteger(curTime.getDate(), 2);
					fileName += prefixInteger(curTime.getHours(), 2);
					fileName += prefixInteger(curTime.getMinutes(), 2);
					fileName += ".cfg";
					SaveFileToLocal(outArr, fileName);
					MasklayerHide();
				}else if(a.Ret == 107){
					MasklayerHide();
					return;
				}else{
					MasklayerHide();
					ShowPaop(pageTitle, lg.get("Channel") + chn + " " + lg.get("IDS_IMEX_ExportFail"));
				}
			}, pageTitle, "ConfigExport", -1, WSMsgID.WsMsgID_CONFIG_EXPORT_REQ,null, false, true);
		});

		$("#ExportDevLog").click(function(){
			var curTime = new Date();
			LogPath = "Log__";
			LogPath += curTime.getFullYear();
			LogPath += prefixInteger(curTime.getMonth()+1, 2);
			LogPath += prefixInteger(curTime.getDate(), 2);
			LogPath += prefixInteger(curTime.getHours(), 2);
			LogPath += prefixInteger(curTime.getMinutes(), 2);
			
			if( gDevice.devType == devTypeEnum.DEV_IPC){
				LogPath += prefixInteger(curTime.getSeconds(), 2);
				LogPath += ".log";
				OPLogQuery.Type = "LogAll";
				OPLogQuery.BeginTime = "2000-0-0 0:0:0";
				OPLogQuery.EndTime = curTime.getFullYear() + "-" + (curTime.getMonth() + 1) + "-" + curTime.getDate() + " "
					+ curTime.getHours() + ":" + curTime.getMinutes() + ":"+ curTime.getSeconds();
				OPLogQuery.LogPosition = 0;
				nGetPage = 0;
				LogPageList = [];
				SearchLog();
			}else{
				LogPath += ".zip";
				RfParamCall(function(a){
					if (a.Ret == 100) {
						var outArr = base64ToBytes(a.Data);
						SaveFileToLocal(outArr, LogPath);
						MasklayerHide();
					}else if(a.Ret == 107){
						MasklayerHide();
						ShowPaop(pageTitle, lg.get("IDS_NO_POWER"));
					}else{
						MasklayerHide();
						ShowPaop(pageTitle, lg.get("IDS_IMEX_ExportFail"));
					}
				}, pageTitle, "OPLogExport", -1, WSMsgID.WsMsgID_LOG_EXPORT_REQ, null, false, true);
			}
		});

		$("#ExportIPCLog").click(function(){
			var curTime = new Date();
			LogPath = "Log__";
			LogPath += curTime.getFullYear();
			LogPath += prefixInteger(curTime.getMonth()+1, 2);
			LogPath += prefixInteger(curTime.getDate(), 2);
			LogPath += prefixInteger(curTime.getHours(), 2);
			LogPath += prefixInteger(curTime.getMinutes(), 2);
			
			var selsectChn = GetMasksNormal("#IPCLogChannelDiv > div[name!='all']");
			var nChn = parseInt(selsectChn, 16);

			ExportChnLog(0);

			function ExportChnLog(chn)
			{
				if(chn >= gDevice.loginRsp.ChannelNum)
					return;
			
				if((BigInt(nChn) & (BigInt(1) << BigInt(chn))) == 0)	// 位运算防止溢出截断
				{
					ExportChnLog(chn + 1);
					return;
				}

				var exportLogPath = LogPath.substr(0, 4) + ("0" + (chn + 1)).substr(-2) + "_" + LogPath.substr(5) + ".zip";
				
				var req = {
					"Name" : "OPLogExportIPC",
					"Channel" : chn
				}
				
				RfParamCall(function(a){
					if (a.Ret == 100) {
						var outArr = base64ToBytes(a.Data);
						SaveFileToLocal(outArr, exportLogPath);
						ExportChnLog(chn + 1);
					}else if(a.Ret == 107){
						ShowPaop(pageTitle, lg.get("IDS_NO_POWER"));
						return;
					}else{
						ShowPaop(pageTitle, lg.get("Channel") + (chn + 1) + " " + lg.get("IDS_IMEX_ExportFail"));
						ExportChnLog(chn + 1);
					}
				}, pageTitle, "OPLogExportIPC", -1, WSMsgID.WSMsgID_LOGSEARCH_REQ, req, false, true);
			}
		});
		$("#InputFileChoose").change(function(e){	
			var file = $(this)[0].files[0];
			if (file.name.indexOf(".cfg") == -1){
				ShowPaop(pageTitle, lg.get("IDS_UP_InvalidFile"))
				return;
			}
			var nFileSize = file.size;
			MasklayerShow();
			var arrData = new Uint8Array(file.size);
			ReadLocalFile(file, function(a){
				if (a) {
					var buffer = a;
					if (buffer.byteLength != nFileSize) {
						return;
					}
					var dataView = new DataView(buffer);
					for (var i = 0; i < buffer.byteLength; i++){
						arrData[i] = dataView.getUint8(i);
					}
				}
				gDevice.SendBinaryData(BinaryType.TypeConfigImport, nFileSize, 0, 0, arrData, function(a){
					MasklayerHide();
					if (a.Ret == 603 || a.Ret == 100){
						RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), false);
					}else if(a.Ret == 107){
						ShowPaop(pageTitle, lg.get("IDS_NO_POWER"));
					}else{
						ShowPaop(pageTitle, lg.get("IDS_IMEX_ImportFail"));
					}
				})
			});
		});
		MasklayerHide();
	});	
});