//# sourceURL=NetService_FTP.js
$(function() {
	var ftpCfg = {};
	var pageTitle = lg.get("IDS_NETS_NetFTP");
	function ShowData() {
		var cfg = ftpCfg[ftpCfg.Name];
		$("#FTP_Switch").attr("data", 1 - cfg.Enable * 1);
		if(cfg.Enable){
			$("#Ftp_Anonymity").css("pointer-events","all");
		}else{
			$("#Ftp_Anonymity").css("pointer-events","none");
		}
		$("#FtpNameInput").val(cfg.Server.UserName);
		$("#FTP_PW").val(cfg.Server.Password)
		$("#FtpPortInput").val(cfg.Server.Port);
		$("#FtpLengthInput").val(cfg.MaxFileLen);
		$("#FtpDirNameInput").val(cfg.Directory);
		$("#FtpIpAddrInput").val(cfg.Server.Name);
		var nAnonymity = cfg.Server.Anonymity ? 1 : 0;
		$("#Ftp_Anonymity").attr("data", nAnonymity);
		InitButton();
		MasklayerHide();
		$("#FTP_Switch").click()
	}
	function GetConfig(){
		RfParamCall(function(a){
			ftpCfg = a;
			ShowData();
		}, pageTitle, "NetWork.NetFTP", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	function e() {
		if ($("#FTP_Switch").attr("data") == 1) {
			if ($("#FtpIpAddrInput").val() == "") {
				ShowPaop(pageTitle, lg.get("IDS_FTP_IpEmpty"));
				return false
			}
			if ($("#FtpPortInput").val() == "") {
				ShowPaop(pageTitle, lg.get("IDS_FTP_PortEmpty"));
				return false
			}
		}
		return true
	}
	function SaveFTP() {
		var cfg = ftpCfg[ftpCfg.Name];
		cfg.Enable = $("#FTP_Switch").attr("data") * 1 ? true :false;
		cfg.Server.UserName = $("#FtpNameInput").val();
		cfg.Server.Password = $("#FTP_PW").val();
		cfg.Server.Port = $("#FtpPortInput").val() * 1;
		cfg.MaxFileLen = $("#FtpLengthInput").val() * 1;
		cfg.Directory = $("#FtpDirNameInput").val();
		cfg.Server.Name = $("#FtpIpAddrInput").val();
		cfg.Server.Anonymity = $("#Ftp_Anonymity").attr("data") * 1 ? true:false;
	}
	$(function() {
		ChangeBtnState();
		$("#FTP_Switch").click(function() {
			$("#FtpTest").prop("disabled", 1 - $("#FTP_Switch").attr("data"));
			if ($("#FTP_Switch").attr("data") == 0) {
				$("#FtpTest").stop().addClass("btn-disable").fadeTo("slow", 0.2);
				$("#Ftp_Anonymity").css("pointer-events","none");
			} else {
				$("#FtpTest").stop().removeClass("btn-disable").fadeTo("slow", 1);
				$("#Ftp_Anonymity").css("pointer-events","all");
			}
			DivBox_Net("#FTP_Switch", "#FtpDivBox");
			var bAnonymity = $("#Ftp_Anonymity").attr("data") * 1 ? true:false;
			if($("#FTP_Switch").attr("data") * 1){
				if(bAnonymity){
					DivBox(0, "#FtpLoginBox");
				}else{
					DivBox(1, "#FtpLoginBox");
				}
			}else{
				$("#FtpLoginBox").css("opacity", "1");
			}
		});
		$("#Ftp_Anonymity").click(function() {
			DivBox_Net($("#Ftp_Anonymity").attr("data") * 1 ? 0 : 1, "#FtpLoginBox");
		});
		$("#FTPSV").click(function() {
			if (!e()) {
				return
			}
			SaveFTP();
			RfParamCall(function(b) {
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, ftpCfg.Name, -1, WSMsgID.WsMsgID_CONFIG_SET, ftpCfg);
		});
		$("#FTPRf").click(function() {
			GetConfig();
		});
		$("#FtpTest").click(function() {
			if (!e()) {
				return;
			}
			SaveFTP();
			var l;
			var m = {};
			FtpTest.innerHTML = lg.get("IDS_FTP_Testing");
			$("#FtpTest").prop("disabled", true);
			
			var data = {
				"Name":"OPFTPTest",
				"OPFTPTest":ftpCfg[ftpCfg.Name]	//OPFTPTest	
			};
			RfParamCall(function(a){
				$("#FtpTest").prop("disabled", false);
				FtpTest.innerHTML = lg.get("IDS_FTP_Test");
				if (a.Ret == 100) {
					ShowPaop(pageTitle, lg.get("IDS_FTP_TestSuccess"));
				} else if (a.Ret == 101) {
					ShowPaop(pageTitle, lg.get("IDS_SERVER_CONNECT_ERR"));
				} else if (a.Ret == 106) {
					ShowPaop(pageTitle, lg.get("IDS_TEST_ACCOUNT_ERR"));
				} else {
					ShowPaop(pageTitle, lg.get("IDS_FTP_TestFailed"));
				}
			}, pageTitle, "OPFTPTest", -1, WSMsgID.WSMsgID_NET_FTPTEST_REQ, data);
		});
		
		GetConfig();
	});
});