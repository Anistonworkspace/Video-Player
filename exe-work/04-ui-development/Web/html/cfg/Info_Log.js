//# sourceURL=Info_Log.js
$(function() {
	var OPLogQuery = {};
	var pageTitle = $("#Info_Log").text();
	var pageMaxNum = 128;
	var LogPageList = [];
	var nCurPage = -1;					//当前页
	var nTotalPage = -1;				//总页数
	var nGetPage = 0;					//获取页
	function UpdateDays(ctrl,a,b,c){
		var D = new Date(a, b, 0);
		var nDays = D.getDate();
		$(ctrl).empty();
		for (var i=0; i < nDays; i++) {
			$(ctrl).append("<option value=" + i + ">" + (i + 1) + "</option>")
		}
		$(ctrl).val(c - 1);
	}
	function GetLogType(i){
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
				break;
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
					if(objLog.Data == "Manual"){
						objLog.Data = "AccountManual";
					}
					var value = "";
					if(type != "LogIn" && type != "LogOut" && type != "AccountRestore")
					{
						value = objLog.Data;
					}
					else
					{
						value = lg.getEx(objLog.Data);
					}
					info.Con = lg.getEx(type) + ' [' + value + ']';
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
			case "IOTAlarm": //物联事件
				if (objLog.Data.indexOf("<") >= 0 && objLog.Data.indexOf(".") >= 0) {
					var str1 = objLog.Data.split('<');
					var str2 = objLog.Data.split('.');
					info.Con = lg.getEx(type) + ' [' + lg.getEx(str1[0]) + lg.getEx(str2[1]) + ']';
				}
				break;
			default:
				info.Type = lg.getEx(type);
				info.Con = '[' + lg.getEx(objLog.Data) + ']';
				break;
		}
		return info;
	}
	function SearchLog(){
		var req = {};
		req.Name = "OPLogQuery";
		req.OPLogQuery = OPLogQuery;
		RfParamCall(function(a,b){
			var nLen;
			if(a.OPLogQuery){
				var tmpLogType= $("#logType").val() * 1;
				if(tmpLogType == 8){
					a.OPLogQuery = a.OPLogQuery.filter(item => item.Type === "IOTAlarm");
				}
				nLen = a.OPLogQuery.length;
				LogPageList[nGetPage] = a.OPLogQuery;
				nCurPage++;
				nGetPage++;
			}
			if(a.OPLogQuery == null || nLen < 128){
				SetBtnEnable("#log_NextPage", false);
				nTotalPage = nGetPage;
			}else if(nLen >= 128){
				OPLogQuery.LogPosition = LogPageList[nCurPage][nLen-1].Position + 1;
				SetBtnEnable("#log_NextPage", true);
			}
			ShowPage(nCurPage);
			ShowPaop(pageTitle, lg.get("IDS_REFRESH_SUCCESS"));
		}, pageTitle, "OPLogQuery", -1, WSMsgID.WSMsgID_LOGSEARCH_REQ,req);
	}
	
	function ShowPage(nPage){
		var table = $("#LogTable")[0];
		var nClearRow = table.rows.length;
		for (var n = 0; n < nClearRow; ++n) {
			table.deleteRow(0);
		}
		if (LogPageList[nPage] == null) {
			return;
		}
		for(var i=0; i < LogPageList[nPage].length; i++) {
			var info = GetLogType(i);
			
			var tr = table.insertRow(i);
			var td1 = tr.insertCell(0);
			var td2 = tr.insertCell(1);
			var td3 = tr.insertCell(2);
			td1.innerHTML = pageMaxNum * nPage + i + 1;
			td2.innerHTML = info.Time;
			td3.innerHTML = info.Con;
			$(td3).prop("title",info.Con);
		}
		
		var nHeadPadding = 0;
		var contentH = $("#LogList .table-responsive").height()-$("#LogList .table-head").height();
		if(LogPageList[nPage].length * 30 > contentH){
			nHeadPadding = TableRightPadding;
		}
		$("#LogList .table-head").css("padding-right", nHeadPadding+"px");
	}
	function SetBtnEnable( obj,bEnable) {
		if (bEnable) {
			$(obj).attr("disabled", false);
			$(obj).stop().fadeTo("slow", 1)
		} else {
			$(obj).attr("disabled", true);
			$(obj).stop().fadeTo("slow", 0.4)
		}
	}
	$(function() {
		$("#logType").empty();
		var arr = ["ALL","SYSTEM","CONFIG","STORAGE","ALARM","RECORD","ACCOUNT","FILEACCESS"];
		if (GetFunAbility(gDevice.Ability.OtherFunction.SupportIOTOperateWithServer)) {
			arr.splice(8,0,"IOTAlarm");
		}
			
		for(var i =0;i < arr.length;i++){
			$("#logType").append('<option value="'+i+'">'+ lg.get("IDS_LOGTYPE_"+arr[i]) +'</option>');
		}
		
		$("#begin_Ttime").timer({Type: 1});
		$("#end_Ttime").timer({Type: 1});
		var J, H, I;
		var G;
		G = new Date();
		J = G.getFullYear();
		H = G.getMonth() + 1;
		I = G.getDate();
		var baseYear = G.getFullYear() - 15;
		$("#years,#endyears,#months,#endmonths").empty();
		for(var i =0;i< 31;i++){
			$("#years,#endyears").append("<option value=" + i + ">" + (i + baseYear) + "</option>")
		}
		for(var i =0;i< 12;i++){
			$("#months,#endmonths").append("<option value=" + i + ">" + (i + 1) + "</option>")
		}
		$("#years,#endyears").val(parseInt(J) - baseYear);
		$("#months,#endmonths").val(parseInt(H) - 1);
		UpdateDays("#days",parseInt(J), parseInt(H),parseInt(I));
		UpdateDays("#enddays",parseInt(J), parseInt(H),parseInt(I));
		$("#end_Ttime").timer.SetTimeIn24("23:59:59", $("#end_Ttime"));
		
		var contentH = $("#LogList .table-responsive").height()-$("#LogList .table-head").height();
		$("#LogList .table-content").css("height", contentH+'px');
		
		SetBtnEnable("#log_PrePage", false);
		SetBtnEnable("#log_NextPage", false);

		$("#years").change(function(){
			UpdateDays("#days",$("#years").val() * 1 + baseYear, $("#months").val() * 1 + 1,1);
		});
		$("#months").change(function(){
			UpdateDays("#days",$("#years").val() * 1 + baseYear, $("#months").val() * 1 + 1,1);
		});
		$("#endyears").change(function(){
			UpdateDays("#enddays",$("#endyears").val() * 1 + baseYear, $("#endmonths").val() * 1 + 1,1);
		});
		$("#endmonths").change(function(){
			UpdateDays("#enddays",$("#endyears").val() * 1 + baseYear, $("#endmonths").val() * 1 + 1,1);
		});
		$("#log_search").click(function () {
			var beginTime = ($("#years").val() * 1 + baseYear) + "-";
			var nTemp = $("#months").val() * 1 + 1;
			if(nTemp >= 0 && nTemp <= 9) beginTime += "0";
			beginTime += nTemp + "-";
			nTemp = $("#days").val() * 1 + 1;
			if(nTemp >= 0 && nTemp <= 9) beginTime += "0";
			beginTime += nTemp + " "+$("#begin_Ttime").timer.GetTimeFor24($("#begin_Ttime"));
			
			var endTime = ($("#endyears").val() * 1 + baseYear) + "-";
			var nTemp = $("#endmonths").val() * 1 + 1;
			if(nTemp >= 0 && nTemp <= 9) endTime += "0";
			endTime += nTemp + "-";
			nTemp = $("#enddays").val() * 1 + 1;
			if(nTemp >= 0 && nTemp <= 9) endTime += "0";
			endTime += nTemp + " "+$("#end_Ttime").timer.GetTimeFor24($("#end_Ttime"));
			$("#log_list").prop("innerHTML", "");
			
			var sDate=str2Date(beginTime);
			var eDate=str2Date(endTime);
			if(sDate.getTime()>eDate.getTime())
			{
				ShowPaop(pageTitle,lg.get("IDS_PBK_InvalidTime"));
				return;
			}
			LogPageList.splice(0);
			nCurPage = -1;
			nTotalPage = -1;
			nGetPage = 0;
			SetBtnEnable("#log_PrePage", false);
			SetBtnEnable("#log_NextPage", false);
			var arrType = ["LogAll","LogSystem","LogConfig","LogStorage","LogAlarm","LogRecord","LogAccount", "LogFile","LogAll"];
			OPLogQuery.Type = arrType[$("#logType").val() * 1];
			OPLogQuery.BeginTime = beginTime;
			OPLogQuery.EndTime = endTime;
			OPLogQuery.LogPosition = 0;
			SearchLog();
		});
		$("#log_clear").click(function(){
			var tip = lg.get("IDS_LOG_SURETOREMOVE");
			var dataHtml = '<div class="confirm_prompt"><div>\n' +
				'<div class="confirm_str">'+tip+'</div></div>' +
				'<div class="btn_box">\n' +
				'<input type="button" class="btn" id="clearBtnOk" value='+lg.get("IDS_OK")+' />\n' +
				'<input type="button" class="btn btn_cancle" value='+lg.get("IDS_CANCEL")+' />' +
				'</div></div>';
			RenderSencondShow(lg.get("IDS_ALARM_PROMPT"),dataHtml,'Tips_Content',true);
			
			$("#clearBtnOk").click(function(a){
				$(".btn_cancle").click();
				var req = {
					"Name" : "OPLogManager",
					"OPLogManager" : {
						"Action" : "RemoveAll"
					}
				};
				RfParamCall(function(a){
					var table = $("#LogTable")[0];
					var nClearRow = table.rows.length;
					for (var n = 0; n < nClearRow; ++n) {
						table.deleteRow(0);
					}
					SetBtnEnable("#log_PrePage", false);
					SetBtnEnable("#log_NextPage", false);
					ShowPaop(pageTitle, lg.get("IDS_LOG_REMOVE_SUCCESS"));
				}, pageTitle, "OPLogManager", -1, WSMsgID.WSMsgID_SYSMANAGER_REQ, req);
			});		
		});
		$("#log_PrePage").click(function () {
			nCurPage--;
			ShowPage(nCurPage);
			if (nCurPage == 0) {
				SetBtnEnable("#log_PrePage", false);
			}
			SetBtnEnable("#log_NextPage", true);
		});
		$("#log_NextPage").click(function () {
			if (nGetPage != nCurPage + 1) {
				nCurPage++;
				ShowPage(nCurPage);
				if (nCurPage >= 0) {
					SetBtnEnable("#log_PrePage", true);
				}
				if (nTotalPage == nCurPage + 1) {
					SetBtnEnable("#log_NextPage", false);
				}
				return;
			}
			SearchLog();
			SetBtnEnable("#log_PrePage", true);
		});
		MasklayerHide();
	});
});
