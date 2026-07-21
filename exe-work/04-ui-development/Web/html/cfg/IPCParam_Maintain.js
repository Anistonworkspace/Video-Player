//# sourceURL=IPCParam_Maintain.js
$(function() {
	var chnIndex = -1;
	var pageTitle = $("#IPCParam_Maintain").text();

	function InitChannel(){
		$("#IPCChannelNum").empty();
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
						MasklayerHide();
					}else{
						MasklayerHide();
						$("#IPCMaintain_page").hide();
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
		});
		$("#IPCMaintainRf").click(function(){
			InitChannel();
		});
		$("#IPCReboot").click(function(){
			var sName = "OPIPCControl.[" + chnIndex + "]";
			var req = {};
			req["Name"] = sName;
			req[req.Name] = {
				"Command":	"RebootDev"
			}

			RfParamCall(function(a,b){
				if (a.Ret == 100){
					ShowPaop(pageTitle, lg.get("IDS_ELECT_SUCCESS"));
				}
			}, pageTitle, sName, chnIndex, WSMsgID.WSMsgID_SET_IPC_REBOOT_REQ, req);
		})

		InitChannel();
	});
});