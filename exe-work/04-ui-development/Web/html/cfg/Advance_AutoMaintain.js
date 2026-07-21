$(function() {
	var AutoMaintain = {};
	var AutoUpgradeCfg = {};
	var pageTitle = $("#Advance_AutoMaintain").text();
	var arrWeek = ["Never", "Everyday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	function showData() {
		var cfg = AutoMaintain[AutoMaintain.Name];
		var i;
		for(i = 0; i < arrWeek.length; i++){
			if(arrWeek[i] == cfg.AutoRebootDay) {
				break;
			};
		}
		$("#weekSel").val(i);
		$("#weekSel").change();
		$("#timeSel").val(cfg.AutoRebootHour);
		var bShowDelFiles = cfg.AutoDeleteFilesDays > 0 ? true : false;
		if (bShowDelFiles) {
			$("#delFileSel").val(1);
			$("#AutoDelDayInput").val(cfg.AutoDeleteFilesDays);
		}else {
			$("#delFileSel").val(0);
			$("#AutoDelDayInput").val(1);
		}
		$("#delFileSel").change();
	}
	function LoadConfig() {
		RfParamCall(function(a){
			AutoMaintain = a;
			showData();
			MasklayerHide();
		}, pageTitle, "General.AutoMaintain", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	function SaveConfig() {
		var cfg = AutoMaintain[AutoMaintain.Name];
		var nRebootWeek = $("#weekSel").val() *1;
		cfg.AutoRebootDay = arrWeek[nRebootWeek];
		cfg.AutoRebootHour = $("#timeSel").val()*1;
		
		var bDelFilesEnable = $("#delFileSel").val() *1 == 1 ? true : false;
		if (bDelFilesEnable) {
			cfg.AutoDeleteFilesDays = $("#AutoDelDayInput").val() * 1;
		}else {
			cfg.AutoDeleteFilesDays = 0;
		}
		RfParamCall(function(a){
			ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
		}, pageTitle, AutoMaintain.Name, -1, WSMsgID.WsMsgID_CONFIG_SET, AutoMaintain);
	}
	$(function(){
		$("#weekSel").empty();
		var i;
		for (i=0; i < arrWeek.length; i++) {
			$("#weekSel").append('<option value="'+ i +'">'+ lg.get("IDS_MATI_Reboot" + arrWeek[i]) +'</option>');
		}
		$("#timeSel").empty();
		for (i=0; i < 24; i++) {
			var time = "";
			if (i < 10) {
				time = "0" + i + ":00";
			}else {
				time = i + ":00";
			}
			$("#timeSel").append('<option value="'+ i +'">'+ time +'</option>');
		}
		$("#delFileSel").empty();
		$("#delFileSel").append('<option value="0">'+ lg.get("IDS_MATI_DelNever") +'</option>');
		$("#delFileSel").append('<option value="1">'+ lg.get("IDS_MATI_DelCustom") +'</option>');
		$("#weekSel").change(function(){
			var nValue = $(this).val()*1;
			if (nValue == 0) {
				$("#timeLimit").css("display", "none");
				$("#AutoRebootTime").css("display", "none");
			}else {
				$("#timeLimit").css("display", "");
				$("#AutoRebootTime").css("display", "");
			}
		});
		$("#delFileSel").change(function(){
			var nValue = $(this).val()*1;
			if (nValue == 0) {
				$("#AutoDelDay").css("display", "none");
				$("#AutoDelDayUnit").css("display", "none");
			}else {
				$("#AutoDelDay").css("display", "");
				$("#AutoDelDayUnit").css("display", "");
			}
		});
		$("#AutoMaintainRf").click(function() {
			LoadConfig();
		});
		$("#AutoMaintainSave").click(function() {
			SaveConfig();
		});
		LoadConfig();
	});
});
