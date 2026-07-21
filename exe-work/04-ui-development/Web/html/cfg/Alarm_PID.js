var cfgData;
var pageTitle;
var chnIndex;
function SetEventHandler(data, index, Title){
	cfgData = data;
	chnIndex = index;
	pageTitle = Title;
}
function GetEventHandler(){
	return cfgData;
}
$(function () {
	var color = gVar.skin_mColor;
    var bColor = gVar.skin_bColor;
	var eventerCfg = new Array;
	var bRecord = !GetFunAbility(gDevice.Ability.OtherFunction.NOHDDRECORD);
	var bSnap = (GetFunAbility(gDevice.Ability.EncodeFunction.SnapStream) || GetFunAbility(gDevice.Ability.OtherFunction.SupportSnapSchedule));
	var bNoMulityAlarmLink = GetFunAbility(gDevice.Ability.OtherFunction.NoSupportMulityAlarmLink);
	GetAlarmToneType("Detect.Analyze","#pid_Alarm_tone","#pid_AbAlarmToneType","#pid_AbAlarmTone");
	function ShowData() {
		$(".rightEx > div[name='all']").css({
			"background-color": "transparent",
			color: "inherit"
		});
		$("#PZLights").attr("data", eventerCfg.ShowInfo?1:0);
		$("#PZEventLatch").val(eventerCfg.EventLatch);	
        $("#PZSendEmail").prop("checked", eventerCfg.MailEnable);
        $("#PZShowMessage").prop("checked", eventerCfg.TipEnable);       
        $("#PZPhone").prop("checked", eventerCfg.MessageEnable);
        $("#PZFTP").prop("checked", eventerCfg.FTPEnable);
        $("#PZWriteLog").prop("checked", eventerCfg.LogEnable );
		
		if(gDevice.loginRsp.AlarmOutChannel > 0){
			$("#PZAODelay").val(eventerCfg.AlarmOutLatch);
			ShowMask("#PZ_AOChannelDiv > div[name!='all']", eventerCfg.AlarmOutMask);
		}
		if(bRecord){
			$("#PZRecordDelay").val(eventerCfg.RecordLatch);
			if(bNoMulityAlarmLink){
				$("#PZRecord").prop("checked", eventerCfg.RecordEnable);
			}else{
				ShowMask("#PZ_RecChannelDiv > div[name!='all']", eventerCfg.RecordMask);
			}
		}
		if(bNoMulityAlarmLink){
			$("#PZTour").prop("checked", eventerCfg.TourEnable);
		}else{
			ShowMask("#PZ_TourChannelDiv > div[name!='all']", eventerCfg.TourMask);
		}
		if(bSnap){
			if(bNoMulityAlarmLink){
				$("#PZSnap").prop("checked", eventerCfg.SnapEnable);
			}else{
				ShowMask("#PZ_SnapChannelDiv > div[name!='all']", eventerCfg.SnapShotMask);
			}
		}
		if(GetFunAbility(gDevice.Ability.OtherFunction.SupportAlarmVoiceTips)){
			$("#PZVoice").prop("checked", eventerCfg.VoiceEnable);
		}else{
			SetAlarmToneType(eventerCfg,"#pid_AbAlarmToneType","#pid_AbAlarmTone");
			ChangeVoiceType("#pid_AbAlarmToneType","#pid_alarmAndCustom");
		}
    }
	function SaveEventCfg(){
		if(gDevice.loginRsp.AlarmOutChannel > 0){
			eventerCfg.AlarmOutLatch = $("#PZAODelay").val() * 1;
			eventerCfg.AlarmOutMask = GetMasks("#PZ_AOChannelDiv > div[name!='all']");
			eventerCfg.AlarmOutEnable = false;
			if (parseInt(eventerCfg.AlarmOutMask) > 0){
				eventerCfg.AlarmOutEnable = true;
			}
		}
		if(bRecord){
			eventerCfg.RecordLatch = $("#PZRecordDelay").val() * 1;
			if (bNoMulityAlarmLink){
				eventerCfg.RecordEnable = $("#PZRecord").prop("checked");
				eventerCfg.RecordMask = GetSingleChnMasks(eventerCfg.RecordEnable, chnIndex);
			}else{				
				eventerCfg.RecordMask = GetMasks("#PZ_RecChannelDiv > div[name!='all']");
				eventerCfg.RecordEnable = false;
				if (parseInt(eventerCfg.RecordMask) > 0) {
					eventerCfg.RecordEnable = true;
				}
			}
		}
		if (bNoMulityAlarmLink){
			eventerCfg.TourEnable = $("#PZTour").prop("checked");
			eventerCfg.TourMask = GetSingleChnMasks(eventerCfg.TourEnable, chnIndex);
		}else{
			eventerCfg.TourMask = GetMasks("#PZ_TourChannelDiv > div[name!='all']");
			eventerCfg.TourEnable = false;
			if (parseInt(eventerCfg.TourMask)){
				eventerCfg.TourEnable = true;
			}
		}
		if(bSnap){
			if (bNoMulityAlarmLink){
				eventerCfg.SnapEnable = $("#PZSnap").prop("checked");
				eventerCfg.SnapShotMask = GetSingleChnMasks(eventerCfg.SnapEnable, chnIndex);
			}else{
				eventerCfg.SnapShotMask = GetMasks("#PZ_SnapChannelDiv > div[name!='all']");
				eventerCfg.SnapEnable = false;
				if (parseInt(eventerCfg.SnapShotMask) > 0) {
					eventerCfg.SnapEnable = true;
				}
			}
		}
		
		eventerCfg.EventLatch = $("#PZEventLatch").val() * 1;
		eventerCfg.MailEnable = $("#PZSendEmail").prop("checked");
        eventerCfg.TipEnable = $("#PZShowMessage").prop("checked");       
        eventerCfg.MessageEnable = $("#PZPhone").prop("checked");
        eventerCfg.FTPEnable = $("#PZFTP").prop("checked");
        eventerCfg.LogEnable = $("#PZWriteLog").prop("checked");
		if(GetFunAbility(gDevice.Ability.OtherFunction.SupportAlarmVoiceTips)){
			eventerCfg.VoiceEnable = $("#PZVoice").prop("checked");
		}else{
			SaveAlarmToneType(eventerCfg,"#pid_AbAlarmToneType","#pid_AbAlarmTone");
		}
	}
    $(function () {
			if (bNoMulityAlarmLink){
				$("#AlarmLinkBox").css("display", "");
				$("#MulityAlarmLinkBox").css("display", "none");
				$("#PZ_enableBox").addClass("group-box").css("margin-top", "5px");
			}else{
				$("#AlarmLinkBox").css("display", "none");
				$("#MulityAlarmLinkBox").css("display", "");
			}
		if (GetFunAbility(gDevice.Ability.TipShow.NoEmailTipShow)) {
			$("#PZ_SendEmailBox").css("display", "none")
		}
		if (!bRecord) {
			$("#PZ_DivBoxRecord, #PZ_RecordDelayDiv, #PZ_RecordBox").css("display", "none");
		}else {
			recChannel("PZ_RecChannelDiv", color, bColor);
		}
		if(!bSnap) {
			$("#PZ_DivBoxSnap, #PZ_SnapBox").css("display", "none");
		}else {
			recChannel("PZ_SnapChannelDiv", color, bColor);
		}
		
		if(!GetFunAbility(gDevice.Ability.NetServerFunction.NetPMS)){
			$("#PZ_PhoneBox").css("display", "none");
		}
		if (GetFunAbility(gDevice.Ability.TipShow.NoFTPTipShow) || !GetFunAbility(gDevice.Ability.NetServerFunction.NetFTP)){
			$("#PZ_FTPBox").css("display", "none");
		}
		if (!GetFunAbility(gDevice.Ability.OtherFunction.SupportWriteLog)) {
			$("#PZ_WriteLogBox").css("display", "none");
		}
		if(!GetFunAbility(gDevice.Ability.OtherFunction.SupportAlarmVoiceTips)){
			$("#PZ_VoiceBox").css("display", "none");
		}
		if(gDevice.loginRsp.BuildTime >= "2011-11-14 13:53:32"){
			var bPtz = GetFunAbility(gDevice.Ability.CommFunction.CommRS485);
			bPtz &= (gDevice.loginRsp.ChannelNum > 0);
			if(bPtz){
				$("#PZ_PTZSetDiv").css("display", "");
				$("#PZ_RecordDelayDiv").css("margin-left", "400px");
			}else{
				$("#PZ_PTZSetDiv").css("display", "none");
				$("#PZ_RecordDelayDiv").css("margin-left", "0px");
				$("#PZRecordDelay").removeClass("timeTxt");
			}
		}
		recChannel("PZ_TourChannelDiv", color, bColor);
		if(gDevice.loginRsp.AlarmOutChannel == 0){
			$("#PZ_AOEvent").css("display", "none");
		}else {
			recChannel("PZ_AOChannelDiv", color, bColor, gDevice.loginRsp.AlarmOutChannel);
		}
		$("#DivBoxAll .rightEx > div").css("margin-top", "3px");
		$('#DivBoxAll :checked').prop("checked",false);
		if (GetFunAbility(gDevice.Ability.AlarmFunction.ScreenTip)){
			$("#PZ_ShowMessageBox").css("display", "");
		}
		if(gDevice.devType == devTypeEnum.DEV_IPC){
			 $("#PZ_DivBoxTour, #PZ_ShowMessageBox").css("display", "none");
		}
		$("#PZ_SV").click(function () {
			SaveEventCfg();
			closeDialog();
		});
		
		$("#PZ_Period").click(function() {
			SetWndTop("#period_dialog", 60);
			$("#period_dialog").show(function(){
				var timeSection = eventerCfg.TimeSection;
				$("#Config_dialog").css("opacity", 0);
				ShowPeriodWnd(timeSection, AlarmTypeEnum.Intelligent);
			});
		});
		
		$("#PZ_PTZSet").click(function() {
			if(gDevice.loginRsp.ChannelNum <= 32){
				SetWndTop("#PtzLink_dialog", 60);
			}else{
				SetWndTop("#PtzLink_dialog");
			}
			$("#PtzLink_dialog").show(function(){
				var PtzCfg = eventerCfg.PtzLink;
				$("#Config_dialog").css("opacity", 0);
				ShowPTZ(PtzCfg, AlarmTypeEnum.Intelligent);
			});
		});
        setTimeout(function(){
			eventerCfg = GetEventHandler();
			if(isObject(eventerCfg)){
				ShowData();
			}
		}, 50);
		$("#pid_AbAlarmToneType").change(function(){
			ChangeVoiceType("#pid_AbAlarmToneType","#pid_alarmAndCustom");
		})
		$("#pid_AbAlarmToneCustomButton").click(function () {
			var cmd={
				"KeepMaskLayer":true,
				"FilePurpose":7
			};
			$("#Config_dialog").css("display","none");
			ShowVoiceCustomDlg(-1,cmd,pageTitle,function(){
				$("#Config_dialog").css("display","");
			});
		});
    });
});