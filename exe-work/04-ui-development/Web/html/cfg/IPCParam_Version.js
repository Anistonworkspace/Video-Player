//# sourceURL=IPCParam_Version.js
$(function() {
	var IPCInfo = {};
	var ChnName;
	var chnIndex = -1;
	var IPArry = [];
	var pageTitle = $("#IPCParam_Version").text();

	function ShowData(){
		var sName = ChnName[ChnName.Name][chnIndex];
		$("#IPCName").val(sName);
		$("#IPCIP").val(IPArry[chnIndex]);

		$("#IPCQR_SN").html("");
		if(IPCInfo.Ret == 100){
			var info = IPCInfo[IPCInfo.Name]
			$("#IPCSystem").val(info.SoftWareVersion);
			$("#IPCBuildDate").val(info.BuildTime);
			var sIPCSN = info.SerialNo;
			$("#IPCSerialID").val(sIPCSN);
			$("#IPCQR_SN").qrcode({
				render: "canvas",
				width: 130,
				height: 130,
				text: sIPCSN
			});
			$("#IPCVersion_Box").css("display", "");
		}else{
			$("#IPCVersion_Box").css("display", "none");
		}

		MasklayerHide();
	}

	function GetChannelParam(chn){
		RfParamCall(function(a){
			ChnName = a;
			
			req = {"Name" : "OPFileUpgradeIPCReq","OPFileUpgradeIPCReq":{"Channel" : chn}  };
			RfParamCall(function(a){
				IPCInfo = a;
				ShowData();
			}, pageTitle, "OPFileUpgradeIPCReq", -1, WSMsgID.WSMsgID_GET_IPC_SYSINFO_REQ, req, true);
		}, pageTitle, "ChannelTitle", -1, WSMsgID.WsMsgID_CONFIG_CHANNELTILE_GET);
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
							IPArry[i] = ssRemoteDevice[m].Decoder[nIndex].IPAddress;
							var dataHtml = '<option value="' + i + '">' + gDevice.getChannelName(i) + '</option>';
							$("#IPCChannelNum").append(dataHtml);
						}
					}
					if(chnArry.length > 0){
						if($.inArray(chnIndex, chnArry) < 0){
							chnIndex = chnArry[0];
						}
						$("#IPCChannelNum").val(chnIndex);
						GetChannelParam(chnIndex);
					}else{
						MasklayerHide();
						$("#IPCVersion_page").hide();
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
			GetChannelParam(nChn);
			chnIndex = nChn;
		});
		$("#IPCVersionRf").click(function(){
			InitChannel();
		});
		$("#IPCVersionSave").click(function(){
			var ipcChannelName = $("#IPCName").val();
			if(ipcChannelName.indexOf('"') != -1 || ipcChannelName.indexOf('\\') != -1){
				ShowPaop(pageTitle, lg.get("IDS_DISP_ChannelNameInvalid"));
				return;
			}
			ChnName[ChnName.Name][chnIndex] = ipcChannelName;
			$("#IPCIP").val(IPArry[chnIndex]);
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "ChannelTitle", -1, WSMsgID.WsMsgID_CONFIG_CHANNELTILE_SET, ChnName);
		});

		InitChannel();
	});
});