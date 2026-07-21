$(function() {
	var Delivery;
	var PwdSafety;
	var pageTitle = "Security";
	pageTitle = lg.get("IDS_SAFETY_TITLE");
	var bCHS = ("SimpChinese" == WebCms.web.language ?  true : false);
	var bMd5Flag = [false, false];
	var verifyType;
	
	var bSendMethod = true;	//验证码发送方式(1为电话号码,0为邮箱)//验证码发送方式(1为电话号码,0为邮箱)
	var bContactInfo = GetFunAbility(gDevice.Ability.OtherFunction.SupportAdminContactInfo);				
	var bQuestion = !GetFunAbility(gDevice.Ability.OtherFunction.NoSupportSafetyQuestion);
	function SetContact(bMethod){
		if (!bCHS){
			bMethod = true;
		}
		var cfg = PwdSafety[PwdSafety.Name];
		if(bMethod){
			$("#contactInput").val(cfg.SecurityEmail);
			$("#contactInput").attr("maxlength", "40");
		}else{
			$("#contactInput").val(cfg.SecurityPhone);
			$("#contactInput").attr("maxlength", "11");
		}

		bSendMethod = bMethod;
		$("#contactSel").val(bMethod ? 1 : 0);
	}
	function ShowData(){
		$("#question1, #question2").empty();
		$("#answer1, #answer2").val("");
		var cfg = Delivery[Delivery.Name];
		for(var i = 0; i < cfg.length; i++){
			$("<option value='" + i + "'>" + cfg[i] + "</ption>").appendTo("#question1, #question2");
		}
		cfg = PwdSafety[PwdSafety.Name];
		$("#question1").val(cfg.PwdReset[0].QuestionIndex);
		$("#question2").val(cfg.PwdReset[1].QuestionIndex);
		if(cfg.PwdReset[0].QuestionIndex == 0){
			$("#answer1").prop("disabled", true);
		}else{
			$("#answer1").val(cfg.PwdReset[0].QuestionAnswer);
			bMd5Flag[0] = true;
		}
		if(cfg.PwdReset[1].QuestionIndex == 0){
			$("#answer2").prop("disabled", true);
		}else{
			$("#answer2").val(cfg.PwdReset[1].QuestionAnswer);
			bMd5Flag[1] = true;
		}
		if(bContactInfo){
			$("#contactSel").empty();
			if(bCHS){
				$("#contactSel").append('<option value="0">' + lg.get("IDS_SECU_phoneNum") + '</option>');
				$("#contactSel").append('<option value="1">' + lg.get("IDS_SECU_SafeEmail") + '</option>');
				if(cfg.SecurityEmail != "" || cfg.SecurityPhone == ""){
					SetContact(true);
				}else{
					SetContact(false);
				}
			}else{
				$("#contactSel").append('<option value="1">' + lg.get("IDS_SECU_SafeEmail") + '</option>');
				SetContact(true);
			}
		}
		var _width = $("#SafetyTitle").width();
		$("#SafetySplit").css("width", 600-_width-15+'px');
		_width = $("#VerifyTitle").width();
		$("#VerifySplit").css("width", 600-_width-15+'px');
		MasklayerHide();
		if(cfg.VerifyCodeRestorePwdType == 0){
			$("#verifyApp").click();
		}else{
			$("#verifyContact").click();
		}
		// 福克斯子客户定制
		if(typeof g_visibleVerifyApp != "undefined" && g_visibleVerifyApp * 1 == 0)
		{
			$($("#VerifyDiv .radio-btn-box")[0]).css("display", "none");
			$("#verifyContact").click();
		}
	}
	function GetConfig(){
		RfParamCall(function(a){
			Delivery = a;
			RfParamCall(function(a){
				PwdSafety = a;
				ShowData();
			}, pageTitle, "General.PwdSafety", -1, WSMsgID.WsMsgID_CONFIG_GET);
		}, pageTitle, "QuestionDelivery", -1, WSMsgID.WsMsgID_ABILITY_GET);
	}
	
	$(function() {
		if(!bQuestion){
			$("#QuestionsDiv").css("display", "none");
		}	
		if(!bContactInfo){
			$("#VerifyDiv").css("display", "none");
		}
		$("#question1, #question2").change(function(){
			var id = $(this).attr("id");
			var answerDiv;
			if(id == "question1"){
				answerDiv = "#answer1";
			}else if(id == "question2"){
				answerDiv = "#answer2";
			}
			var nSel = $(this).val()
			if (nSel == 0)
			{
				$(answerDiv).val("");
				$(answerDiv).prop("disabled", true);
			}else {	
				$(answerDiv).val("");
				$(answerDiv).prop("disabled", false);
			}
		});
		$("#answer1, #answer2").focus(function (){
			var id = $(this).attr("id");
			switch(id){
				case "answer1":
					if(bMd5Flag[0]){
						bMd5Flag[0] = false;
						$(this).val("");
						$(this).next().css("display", "none")
					}
					break;
				case "answer2":
					if(bMd5Flag[1]){
						bMd5Flag[1] = false;
						$(this).val("");
						$(this).next().css("display", "none")
					}
					break;
				default:
					break;
			}
		});
		$("#answer1, #answer2").keyup(function(){
			var tmp = $(this).val().replace(/[^0-9a-zA-Z.@]/g, '');
			$(this).val(tmp);
		});
		$("#contactInput").keyup(function (){
			var tmp = $(this).val();
			var nSel = $("#contactSel").val();
			if(nSel == 1){
				tmp = tmp.replace(/[\\\"]/g, '');
			}else{
				tmp = tmp.replace(/\D/g, '');
			}
			$(this).val(tmp);
		});
		$("input[name='verify']").click(function (){
			var id = $(this).attr("id");
			switch(id){
				case "verifyApp":
					DivBox(0, "#contactDiv");
					verifyType = 0;
					break;
				case "verifyContact":
					DivBox(1, "#contactDiv");
					verifyType = 1;
					break;
				default:
					break;
			}
		});
		$("#contactSel").change(function (){
			//处理中文有2个选项非中文1个选项的问题.
			if ($(this).val() == 0 && bCHS){
				SetContact(false);
			}else{
				SetContact(true);
			}
		});
		$("#SecurityRf").click(function(){
			GetConfig();
		});
		$("#SecuritySV").click(function(){
			var cfg = PwdSafety[PwdSafety.Name];
			if (bQuestion){
				if ($("#question1").val() == 0 || $("#question2").val() == 0){
					ShowPaop(pageTitle, lg.get("IDS_MustSetIssues"));
					return ;
				}
				
				if ($("#question1").val() == $("#question2").val()){
					ShowPaop(pageTitle, lg.get("IDS_QUES_SAME"));
					return;
				}
				
				if ((($("#question1").val() * 1 != 0) && ($("#answer1").val() == ""))
					||(($("#question2").val() * 1 != 0) && ($("#answer2").val() == ""))){
					ShowPaop(pageTitle, lg.get("IDS_Answer_Empty"));
					return;
				}
				
				cfg.PwdReset[0].QuestionIndex = $("#question1").val() * 1;
				if ($("#answer1").val() != cfg.PwdReset[0].QuestionAnswer){
					cfg.PwdReset[0].QuestionAnswer = MD5_8($("#answer1").val());
				}
	
				cfg.PwdReset[1].QuestionIndex = $("#question2").val() * 1;
				if ($("#answer1").val() != cfg.PwdReset[1].QuestionAnswer){
					cfg.PwdReset[1].QuestionAnswer = MD5_8($("#answer2").val());
				}
	
			}
			//联系方式不能为空
			if ("" == $("#contactInput").val() && (verifyType > 0) && bContactInfo){
				ShowPaop(pageTitle, lg.get("IDS_Contact_Empty"));
				return;
			}
	
			//仅在支持联系方式时才设置数据
			if (bContactInfo){
				if(verifyType > 0){
					//检测邮箱和电话格式
				if (bSendMethod){
						var re = /^\w+[\w-.]*@[\w-.]+\.\w+$/; 
						if(!re.test($("#contactInput").val())){
							ShowPaop(pageTitle, lg.get("IDS_Mailbox_FormatError"));
							return;
						}
					}
			
					if (bSendMethod){
						cfg.SecurityEmail = $("#contactInput").val();
						cfg.SecurityPhone = "";
					}else{
						cfg.SecurityPhone = $("#contactInput").val();
						cfg.SecurityEmail = "";
					}
			
				}else{
					cfg.SecurityEmail = "";
					cfg.SecurityPhone = "";
				}
				//验证码发送对象
				cfg.VerifyCodeRestorePwdType = verifyType;
	
			}
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "General.PwdSafety", -1, WSMsgID.WsMsgID_CONFIG_SET, PwdSafety);
		});
		$("#SecurityExit").click(function(){
			MasklayerShow();
			gVar.LoadChildConfigPage("Advance_Account");
		});
		GetConfig();
	});
});