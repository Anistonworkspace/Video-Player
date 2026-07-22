//# sourceURL=NetService_AlarmCenter.js
$(document).ready(function() {
	var AlarmServer = {};
	var pageTitle = lg.get("IDS_NETS_NetAlarmCenter");
	var sel = -1;
	var bSupportHeartBeatUpload = GetFunAbility(gDevice.Ability.NetServerFunction.AlarmCenterHeartBeat);
	function UpdataProtoType(){
		var cfg = AlarmServer[AlarmServer.Name][sel];
		$("#Enable_Switch").attr("data", 1 - cfg.Enable * 1);
		if(cfg.Enable){
			$("#Log_Report").css("pointer-events","all");
			$("#Alarm_Report").css("pointer-events","all");
		}else{
			$("#Log_Report").css("pointer-events","none");
			$("#Alarm_Report").css("pointer-events","none");
		}
		$("#IpAddrInput").val(cfg.Server.Name);
		$("#PortInput").val(cfg.Server.Port);
		$("#Alarm_Report").attr("data", cfg.Alarm * 1);
		$("#Log_Report").attr("data", cfg.Log * 1);

		// Heartbeat report
		if(bSupportHeartBeatUpload)
		{
			$("#HeartBeatUploadEnableDiv").css("display", "");
			$("#HeartBeatPeriodDiv").css("display", "");
			$("#HeartBeatUploadEnable").attr("data", cfg.HeartBeatEnable * 1);
			$("#HeartBeatPeriod").val(cfg.HeartBeatInterval * 1);

			if(cfg.Enable)
			{
				$("#HeartBeatUploadEnable").css("pointer-events","all");
			}
			else
			{
				$("#HeartBeatUploadEnable").css("pointer-events","none");
			}
		}

		InitButton();
		$("#Enable_Switch").click();
	}
	function ShowData() {
		var cfg = AlarmServer[AlarmServer.Name];
		$("#ProtoType").empty();
		for (var i = 0; i < cfg.length; i++) {
			if (cfg[i].Protocol == "NONE") {
				continue;
			}
			if(sel == -1) sel = i;
			$("#ProtoType").append('<option value="'+ i +'">'+ cfg[i].Protocol +'</option>');
		}
		$("#ProtoType").val(sel);
		UpdataProtoType();
		MasklayerHide();
	}
	function GetConfig(){
		RfParamCall(function(a){
			AlarmServer = a;
			ShowData();
		}, pageTitle, "NetWork.AlarmServer", -1, WSMsgID.WsMsgID_CONFIG_GET);	
	}
	function SaveLastAlarm() {
		var cfg = AlarmServer[AlarmServer.Name][sel];
		cfg.Enable = $("#Enable_Switch").attr("data") * 1 ? true :false;
		cfg.Server.Name = $("#IpAddrInput").val();
		cfg.Server.Port = parseInt($("#PortInput").val());
		cfg.Alarm = $("#Alarm_Report").attr("data") * 1 ? true :false;
		cfg.Log = $("#Log_Report").attr("data") * 1 ? true :false;

		if(bSupportHeartBeatUpload)
		{
			cfg.HeartBeatEnable = $("#HeartBeatUploadEnable").attr("data") * 1 ? true : false;
			cfg.HeartBeatInterval = $("#HeartBeatPeriod").val() * 1;
		}
	}
	$(function() {
		ChangeBtnState();
		$("#Enable_Switch").click(function() {
			DivBox_Net("#Enable_Switch", "#CenterDivBox");
			if ($("#Enable_Switch").attr("data") == 0) {
				$("#Log_Report").css("pointer-events","none");
				$("#Alarm_Report").css("pointer-events","none");
				if(bSupportHeartBeatUpload)
				{
					$("#HeartBeatUploadEnable").css("pointer-events","none");
				}
			} else {
				$("#Log_Report").css("pointer-events","all");
				$("#Alarm_Report").css("pointer-events","all");
				if(bSupportHeartBeatUpload)
				{
					$("#HeartBeatUploadEnable").css("pointer-events","all");
				}
			}
			
		});
		$("#ProtoType").change(function(){
			SaveLastAlarm();
			sel = $("#ProtoType").val() * 1;
			UpdataProtoType();
		});
		$("#CenterSV").click(function() {
			SaveLastAlarm();
			RfParamCall(function(a) {
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, AlarmServer.Name, -1, WSMsgID.WsMsgID_CONFIG_SET, AlarmServer);
		});
		$("#CenterRf").click(function() {
			GetConfig();
		});
		GetConfig();
	});
});