//# sourceURL=forgetpwd.js
$(document).ready(function() {
	var nQR = gDevice.SafetyAbility["GetSafetyAbility"]["VerifyQRCode"];
	var nQuestion = gDevice.SafetyAbility["GetSafetyAbility"]["Question"];
	var nAnyAccount=gDevice.SafetyAbility["GetSafetyAbility"]["SetResetUser"];
	var bGetQRCode = false;
	var SafetyQues;
	var VerifyCode;
	var AppCode;
	var IOSCode;
	var bIOS = false;
	var nSel = -1;
	var pageTitle = lg.get("IDS_RETRIEVE_PWD");
	var PWDInvalid = '';
	var PWDFormatError = "";
	var PwdStrength = 0;
	if (gVar.pswMinLen == gVar.pswMaxLen) {
		PWDInvalid = lg.get("IDS_CHECKPW_LENGTH") + ' ' + gVar.pswMinLen + ' ' + lg.get("IDS_CHECKPW_LENGTHU");
	} else {
		PWDInvalid = lg.get("IDS_CHECKPW_LENGTH") + ' ' + gVar.pswMinLen + ' ~ ' + gVar.pswMaxLen + ' ' + lg.get("IDS_CHECKPW_LENGTHU");
	}
	PWDFormatError = lg.get("IDS_CHECKPW_Format");
	$("#ForgetPwdContent #content_title").text(lg.get("IDS_RESET"));
	$("#pwdFormatInfo").val(PWDInvalid);
	$("#NewResetPWD, #ConResetPWD").prop("maxlength", gVar.pswMaxLen);
	
	function GetQuestions(){
		var req = {
			"Name": "GetSafetyQuestion"	
		}
		RfParamCall(function (a, b){
			if(a.Ret == 100){
				SafetyQues = a;
			}
			ShowSafty();
		}, "", "GetSafetyQuestion", -1, WSMsgID.WsMsgID_AUTHORIZATION, req, true);
	}
	
	function GetCode(){
		bGetQRCode = true;
		var req = {
			"Name": "GetVerifyQRCode"	
		}
		RfParamCall(function(a, b){
			if(a.Ret == 100){
				VerifyCode = a;
				req.Name = "GetAppQRCode";
				RfParamCall(function(a, b){
					if(a.Ret == 100){
						AppCode = a;
						req.Name = "GetIOSAppQRCode";
						RfParamCall(function(a, b){
							if(a.Ret == 100){
								IOSCode = a;
								if(AppCode[AppCode.Name].AppQRCode.Text != IOSCode[IOSCode.Name].IOSAppQRCode.Text){
									bIOS = true;
								}
							}
							ShowSafty();
						}, "", "GetIOSAppQRCode", -1, WSMsgID.WsMsgID_AUTHORIZATION, req, true);
					}
				}, "", "GetAppQRCode", -1, WSMsgID.WsMsgID_AUTHORIZATION, req, true);
			}
		}, "", "GetVerifyQRCode", -1, WSMsgID.WsMsgID_AUTHORIZATION, req, true);
	}
	function ShowSafty(){
		if(nSel == 1 && bGetQRCode == false){
			GetCode();
			return;
		}
		if(nSel == 0){
			$("#Question").css("display", "");
			$("#QR_Code").css("display", "none");
			if(typeof SafetyQues != "undefined"){
				var vQuestion;
				vQuestion = SafetyQues[SafetyQues.Name]["Question"][0];
				$("#question1").append("<option>" + vQuestion + "</option>");
				vQuestion = SafetyQues[SafetyQues.Name]["Question"][1];
				$("#question2").append("<option>" + vQuestion + "</option>");
			}
			$("#answer1, #answer2").val("");
			$("#Confirm_Ques").css("display", "");
			$("#Confirm_Code").css("display", "none");
		}else {
			$("#Question").css("display", "none");
			$("#QR_Code").css("display", "");
			$("#Confirm_Ques").css("display", "none");
			$("#Confirm_Code").css("display", "");
			$("#CodeInfo").val("");
			$(".QR").empty();
			$("#VerifyQR").qrcode({
				render: "canvas",//canvas和table两种渲染方式
				width: 120,
				height: 120,
				text: VerifyCode[VerifyCode.Name].VerifyQRCode.Text
			});
			$("#App").qrcode({
				render: "canvas",
				width: 120,
				height: 120,
				text: AppCode[AppCode.Name].AppQRCode.Text
			});

			if(bIOS){
				$("#QRCode .single-qr").css("margin-right", "50px");
				$("#IOSAppDiv").css("display", "");
				$("#Android_APP").text("Android APP");
				$("#IOSApp").qrcode({
					render: "canvas",
					width: 120,
					height: 120,
					text: IOSCode[IOSCode.Name].IOSAppQRCode.Text
				});
			}
		}
		$("#ForgetPwdContent").show();
		if (g_BrowseType != BrowseType.BrowseChrome) {
			if (g_BrowseType != BrowseType.BrowseOpera) {
				$(".PswEyeShow").attr("type", "password");
			}
		}
	}
	function ShowPWDPage() {
		$("#ResetPage, #Confirm_Code, #Confirm_Ques, .btn_cancle").css("display", "none");
		$("#PWDPage, #SavePWD").css("display", "");
		$("#SavePWD").css("margin-left", "78px");
		$("#ForgetPwdContent #content_title").text(lg.get("IDS_MOD_PWD"));
		$("#user").val($("#userName").val());
		if($("#userName").val() == "")			// 补充一个默认值
		{
			$("#user").val("admin");
		}
		else
		{
			$("#user").val($("#userName").val());
		}
		$("#user").attr("disabled", true);		
		$("#user").fadeTo("slow", 0.6);
		if (!nAnyAccount) {						// 0 表示只支持对admin用户重置密码
			$("#user").val("admin");
		}else{					
			GetRandomFunc(function(a){
				if(a != null && typeof a.RandomUser == 'string'){
					$("#user").val(a.RandomUser);
				}
			});
		}
	}
	
	$("#ResetType").change(function(){
		$("#Forget_false").css("display", "none");
		nSel = $(this).val();
		ShowSafty();
	});
	
	$("#Confirm_Ques").click(function(){
		var req = {
			"Name": "CheckSafetyAnswer",
			"CheckSafetyAnswer": {
				"Answer": [$("#answer1").val(), $("#answer2").val()]
			}
		};

		RfParamCall(function (a, b){
			if(a.Ret == 100){
				$("#Forget_false").css("display", "none");
				ShowPWDPage();
			}else if(a.Ret == 219){
				$("#Forget_false").html(lg.get("IDS_VerifyTimes_Limit")).css("color", "red").css("display", "");
			}else if(a.Ret == 220){
				$("#Forget_false").html(lg.get("IDS_Error_Answer")).css("color", "red").css("display", "");
			}
		}, "", "CheckSafetyAnswer", -1, WSMsgID.WsMsgID_AUTHORIZATION, req, true);
	});
	
	$("#Confirm_Code").click(function(){
		var req = {
			"Name": "CheckVerifyCode",
			"CheckVerifyCode" : {"VerifyCode": $("#CodeInfo").val()}
		};
		RfParamCall(function (a, b){
			if(a.Ret == 100){
				$("#Forget_false").css("display", "none");
				ShowPWDPage();
			}else if(a.Ret == 221){
				$("#Forget_false").html(lg.get("IDS_VerifyTimes_Limit")).css("color", "red").css("display", "");
			}else if(a.Ret == 222){
				$("#Forget_false").html(lg.get("IDS_Error_Verify")).css("color", "red").css("display", "");
			}
		}, "", "CheckVerifyCode", -1, WSMsgID.WsMsgID_AUTHORIZATION, req, true);
	});
	$("#user").keyup(function () {
		var realValue = checkSpecialCharacter($(this).val());
		$(this).val(realValue);
	});
	$("#SavePWD").click(function(){
		$("#Forget_false").css("display","none");
		var UserName=$("#user").val();
		if(UserName==""){
			$("#Forget_false").text(lg.get("IDS_NO_USERNAME"));
			$("#Forget_false").css("display","");
			return;
		}
		var newPsw = $("#NewResetPWD").val();
		var confirmPsw = $("#ConResetPWD").val();
		if(newPsw == "")
		{
			$("#Forget_false").html(lg.get("IDS_NO_PASSWORD")).css("color", "red").css("display", "");
			return;
		}
		if (newPsw != confirmPsw) {
			$("#Forget_false").html(lg.get("IDS_ACC_PwdDiffrent")).css("color", "red").css("display", "");
			$("#NewResetPWD").focus().select();
			return;
		}
		PwdStrength = CheckPasswordStrength(newPsw);
		if(PwdStrength == PASSWORD_STRENTH.DANGER && gDevice.devType != devTypeEnum.DEV_IPC){
			$("#Forget_false").text(lg.get("IDS_PWD_DANGER_STRENGTH"));
			$("#Forget_false").css("display","");
			return;
		}
		var nPswLen = newPsw.length;
		if (gVar.pswMinLen > nPswLen || nPswLen > gVar.pswMaxLen) {
			$("#Forget_false").html(PWDInvalid).css("color", "red").css("display", "");
			$("#NewResetPWD").focus().select();
			return;
		}
		
		var req = {
			"Name": "SetNewPassword",
			"SetNewPassword": {"UserName":UserName,"NewPassword": newPsw}
		};
		
		RfParamCall(function (a, b){
			$(".btn_cancle").click();
			if(a.Ret == 100){
				Web_prompt(lg.get("IDS_SetPWD_Success"), true);
			}else{
				Web_prompt(lg.get("IDS_SAVE_FAILED"), true);
			}
		}, "", "SetNewPassword", -1, WSMsgID.WsMsgID_AUTHORIZATION, req);

	});
	
	$("#NewResetPWD").keyup(function () {
		var value = $(this).val();
		if (value.length > 0) {
			$("#strengthDiv").css("display", "block");
			CPswStrength($(this).prop("value"));
			PwdStrength = CheckPasswordStrength($(this).prop("value"));
		} else {
			$("#strengthDiv").css("display", "none");
		}
    });
	
    $(function() {
		$("#Forget_false").css("display", "none");
		$("#ResetType").empty();
		var nCount = 0;
		if (nQuestion == 1) {
			$("#ResetType").append("<option value='0'>" + lg.get("IDS_SAFE_QUESTION") + "</option>");
			nCount++;
			nSel = 0;
		}
		
		if (nQR == 1) {
			$("#ResetType").append("<option value='1'>" + lg.get('IDS_QR_CODE') + "</option>");
			nCount++;
			if(nSel == -1){
				nSel = 1;
			}
		}
		
		if(nCount == 0){
			$(".btn_cancle").click();
			var msg = "";
			if(nQR == 2){
				msg = lg.get("IDS_Need_Lan")	
			}else if(nQuestion == 2){
				msg = lg.get("IDS_No_SafeProblem");
			}else{
				msg = lg.get("IDS_Unsupport_Reset");
			}
			Web_prompt(msg, true);
			return;
		}
		$("#ResetPage").css("display", "");
		$("#PWDPage").css("display", "none");
		$("#ResetType").val(nSel);
		var req = {
			"Name":"SetLanguage",
			"SetLanguage":{"Language":WebCms.web.language}			
		}
		RfParamCall(function(a, b){
			if(a.Ret == 100){
				if(nQuestion == 1){
					GetQuestions();
				}else if(nQR == 1){
					GetCode();
				}
			}
		}, "", "SetLanguage", -1, WSMsgID.WsMsgID_AUTHORIZATION, req, true);
	});
});