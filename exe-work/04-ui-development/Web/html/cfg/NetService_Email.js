$(function() {
	var NetEmail = {};
	var pageTitle = lg.get("IDS_NETS_NetEmail");
	function ShowData() {
		var cfg = NetEmail[NetEmail.Name];
		if (cfg.Enable) {
			$("#EmailEnable").removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
		} else {
			$("#EmailEnable").removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
		}
		var Etype = cfg.UseSSL;
		if(typeof Etype == "boolean") {
			Etype = Etype ? 1 : 0;
		}
		$("#EncryptType").val(Etype);
		$("#EmailPort").val(cfg.MailServer.Port);
		$("#EmailSMTP").val(cfg.MailServer.Name);
		$("#EmailUserName").val(cfg.MailServer.UserName);
		$("#EmailPasswd").val(cfg.MailServer.Password);
		$("#EmailSender").val(cfg.SendAddr);
		$("#Title").val(cfg.Title);
		var rec = "";
		for (var i=0; i < cfg.Recievers.length; i++) {
			if (cfg.Recievers[i] != "none") {
				rec += cfg.Recievers[i];
				rec += ";";
			}
		}
		$("#EmailRecv").val(rec);
		DivBox_Net("#EmailEnable", "#EmDivBox");
		DivBox_Net("#EmailEnable", "#EmailTest_box");
		MasklayerHide();
	}
	function SaveData() {
		var cfg = NetEmail[NetEmail.Name];
		cfg.Enable = $("#EmailEnable").attr("data") *1 == 1 ? true:false;
		cfg.MailServer.Name = $("#EmailSMTP").val();
		cfg.MailServer.Port = $("#EmailPort").val() *1;
		cfg.Title = $("#Title").val();
		var EType = $("#EncryptType").val() *1;
		if (typeof cfg.UseSSL == "boolean") {
			cfg.UseSSL = EType == 1 ? true : false;
		}else {
			cfg.UseSSL = EType;
		}
		cfg.MailServer.UserName = $("#EmailUserName").val();
		cfg.SendAddr = $("#EmailSender").val();
		cfg.MailServer.Password = $("#EmailPasswd").val();
		var iIndex = 0;
		var strTemp = $("#EmailRecv").val();
		for (var i = 0; i < cfg.Recievers.length; i++){
			var iPos = strTemp.indexOf(";", iIndex);
			if (iPos < 0){
				var strMail = strTemp.substr(iIndex);
				if (0 == strMail.length){
					cfg.Recievers[i] = "none";
				}else{
					cfg.Recievers[i] = strMail;
				}
				iIndex += strMail.length;
				continue;
			}
			cfg.Recievers[i] = strTemp.substr(iIndex, iPos - iIndex);
			iIndex = iPos + 1;
		}
	}
	function Load() {
		RfParamCall(function(a){
			NetEmail = a;
			ShowData();
		}, pageTitle, "NetWork.NetEmail", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	$(function(){
		if(GetFunAbility(gDevice.Ability.NetServerFunction.NetEmailTLS)){
			$("#EncryptType").append('<option value="2">TLS</option>');
		}
		$("#EmailEnable").click(function() {
			if ($(this).attr("data") != "1") {
				$(this).removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
			} else {
				$(this).removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
			}
			DivBox_Net("#EmailEnable", "#EmDivBox");
			DivBox_Net("#EmailEnable", "#EmailTest_box");
		});
		$("#EncryptType").change(function() {
			var sel = $(this).val() * 1;
			if(sel == 0){
				$("#EmailPort").val("25");
			}else if(sel == 1){
				$("#EmailPort").val("465");
			}else if(sel == 2){
				$("#EmailPort").val("587");
			}
			if(NetEmail[NetEmail.Name].UseSSL == sel){
				$("#EmailPort").val(NetEmail[NetEmail.Name].MailServer.Port);
			}
		});
		$("#EmailRf").click(function() {
			Load();
		});
		$("#EmailSV").click(function() {
			SaveData();
			RfParamCall(function(a){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, "NetWork.NetEmail", -1, WSMsgID.WsMsgID_CONFIG_SET, NetEmail);
		});
		$("#EmailTest").click(function() {
			if ($("#EmailSMTP").val() == "") {
				ShowPaop(pageTitle, lg.get("IDS_EMAIL_NOT_SMTP"));
				return;
			}
			if ($("#EmailUserName").val() == "") {
				ShowPaop(pageTitle, lg.get("IDS_EMAIL_NOT_USERNAME"));
				return;
			}
			SaveData();
			EmailTest.innerHTML = lg.get("IDS_EMAILTESTING");
			$("#EmailTest").prop("disabled", true);
			var data = {
				"Name":"OPMailTest",
				"OPMailTest":NetEmail[NetEmail.Name]	//OPMailTest	
			};
			RfParamCall(function(a){
				EmailTest.innerHTML = lg.get("IDS_EMAILTEST");
				$("#EmailTest").prop("disabled", false);
				if (a.Ret == 100) {
					ShowPaop(pageTitle, lg.get("IDS_TESTEMAIL_SUC"));
				} else if (a.Ret == 101) {
					ShowPaop(pageTitle, lg.get("IDS_SERVER_CONNECT_ERR"));
				} else if (a.Ret == 106) {
					ShowPaop(pageTitle, lg.get("IDS_TEST_ACCOUNT_ERR"));
				} else if (a.Ret == 108) {
					ShowPaop(pageTitle, lg.get("IDS_TESTEMAIL_SEND_ERR"));
				} else if (a.Ret == 109) {
					ShowPaop(pageTitle, lg.get("IDS_TESTEMAIL_BLOCK_ERR"));
				} else {
					ShowPaop(pageTitle, lg.get("IDS_TESTEMAIL_FAILED"));
				}
			}, pageTitle, "OPMailTest", -1, WSMsgID.WSMsgID_NET_MAILTEST_REQ, data);
		});
		Load();
	});
});