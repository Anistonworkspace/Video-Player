//# sourceURL=client.js
$(function() {
	var pageTitle = $("#clientBtn").text();
	var curVersion = "";
	var dataHtml = "";
	$("#RecordTypeSelect").empty();
	dataHtml += '<option value="' + 0 + '">' + "h265x" + '</option>';
	//禁用AVI格式，V3Version插件使用老SDK有快进的Question且不再维护，V4Version插件使用二次封装SDK弃用了该格式
	//dataHtml += '<option value="' + 2 + '">' + "avi" + '</option>';
	dataHtml += '<option value="' + 3 + '">' + "mp4" + '</option>';
	$("#RecordTypeSelect").append(dataHtml);

	$("#imageTypeSelect").empty();
	dataHtml = "";
	dataHtml += '<option value="' + 0 + '">' + "BMP" + '</option>';
	dataHtml += '<option value="' + 1 + '">' + "JPG" + '</option>';
	$("#imageTypeSelect").append(dataHtml);

	$("#videoTypeSelect").empty();
	dataHtml = "";
	dataHtml += '<option value="' + 1 + '">' + "DirectX" + '</option>';
	dataHtml += '<option value="' + 2 + '">' + "GDI" + '</option>';
	$("#videoTypeSelect").append(dataHtml);

	var UpdateStatusContent = document.getElementById("UpdateStatusContent");
	var curVersionContent = document.getElementById("CurVersionContent");
	var CurWebVersionContent = document.getElementById("CurWebVersionContent");

	var name = WebCms.plugin.setupname + ".exe";
	$('#clientDownBtn').attr({href: WebCms.plugin.downloadaddr, download: name || ''});

	$(".browserBtn").click(function() {
		MasklayerShow();
		var c = $(this).attr("id").split("PathBtn_")[1] * 1;
		if(c == 2){
			gDevice.GetConfigPath(48,function(a){
				if(a.Path != ""){
					$("#Path_" + 2).val(a.Path);
				}
				MasklayerHide();
			});
		}else if(c == 1){
			gDevice.GetConfigPath(49,function(a){
				if(a.Path != ""){
					$("#Path_" + 1).val(a.Path);
				}
				MasklayerHide();	
			});
		}else if(c == 0){
			gDevice.GetConfigPath(53,function(a){
				if(a.Path != ""){
					$("#Path_" + 0).val(a.Path);
				}
				MasklayerHide();
			});
		}
	});
	$("#pathSave").click(function(){
		gDevice.SaveConfigPath($("#Path_2").val(),$("#Path_1").val(),$("#Path_0").val(),
			$("#RecordTypeSelect").val()*1, $("#imageTypeSelect").val()*1, $("#videoTypeSelect").val() * 1, function(a){
			if (a.Ret == 100) {
				ShowPaop(pageTitle,lg.get("IDS_SAVE_SUCCESS"));
			}
		});
	});
	$("#PathConfig_Btn").click(function() {
		$("#Version_Btn").attr("name","");
		$("#PathConfig_Btn").attr("name","active");
		$("#PathConfig_Page").css("display","");
		$("#VersionInfo_Page").css("display","none");
	});
	$("#Version_Btn").click(function() {
		$("#Version_Btn").attr("name","active");
		$("#PathConfig_Btn").attr("name","");
		$("#PathConfig_Page").css("display","none");
		$("#VersionInfo_Page").css("display","");
	});
	$("#CheckVersionBtn").click(function() {
		gDevice.CheckWebVersion(1, function(){
			gDevice.CheckToolVersion(1,function(){
				$("#CheckResultBox").css("display","");
				var Version= "";
				Version = curVersion + lg.get("IDS_CLIENT_Get_New");
				var checkResult = document.getElementById("UpdateStatusContent");
				checkResult.innerHTML = Version;
				$("#CheckVersionBtn").attr("disabled",true);
				MasklayerHide();
			});
		});
	});
	$("#SoftwareLicenses").click(function(){
		gDevice.GetSoftwareLicensesInfo(1, function(){
			MasklayerHide();
		});
	});
	function LoadClientCfg(){
		gDevice.CheckWebVersion(1, function(a){
			if(WebCms.plugin.isLoaded){
				gDevice.CheckToolVersion(1, function() {
					gDevice.LoadClientConfig(51, function(a){
						if (a.Ret == 100) {
							$("#Path_2").val(a.RecPath);
							$("#Path_1").val(a.CapPath);
							$("#Path_0").val(a.DownPath);
							curVersionContent.innerHTML = a.ToolVersion;
							$("#CheckResultBox").css("display","none");
							$("#RecordTypeSelect").val(a.RecordFileType);
							$("#imageTypeSelect").val(a.ImageType);
							if (a.VideoType == undefined || a.VideoType == null)
							{
								$("#videoTypebox").css("display", "none");
							} else {
								$("#videoTypebox").css("display", "");
								$("#videoTypeSelect").val(a.VideoType);
							}
							
							if(gVar.bNewVersion){
								var  Version= "";
								Version = lg.get("IDS_CLIENT_New") + gVar.newVersion;
								UpdateStatusContent.innerHTML = Version;
								$("#CheckResultBox").css("display","");
								$("#clientDownBtn").css("display","");
							}
						}else if(a.Ret == 101){
							ShowPaop(pageTitle,"IDS_CLIENT_Browse_Failed");
						}
						MasklayerHide();
					});
				});
			}else{
				CurWebVersionContent.innerHTML = a;
				MasklayerHide();
			}
		});
	}
	function ClientConfigResultEvent(a){
		if(a.SubEvent == ClientCofigEvent.SubEventLoadClientCofig){
			LoadClientCfg();
		}else if(a.SubEvent == ClientCofigEvent.subEventManualCheckToolVersion){
			var Version= "";
			gVar.bNewVersion = a.bNew;
			gVar.newVersion = a.newVersion;
			if(a.bNew){
				Version = lg.get("IDS_CLIENT_New") + a.newVersion;
				$("#clientDownBtn").css("display","");
				if (a.VideoPlayToolUpdateLog != null && typeof a.VideoPlayToolUpdateLog == "string"){
					$("#updateLogdiv").empty();
					var logs = a.VideoPlayToolUpdateLog;
					if(logs.indexOf("\r\n") >= 0){
						logs = logs.split("\r\n");
						for (var i = 0; i < logs.length; i++) {
							$("#updateLogdiv").append('<p>'+ logs[i] + '</p>');
						}
					}else{
						$("#updateLogdiv").html(a.VideoPlayToolUpdateLog);
					}
					$("#updateLogdiv").css("display","");
				} else {
					$("#updateLogdiv").css("display","none");
				}
			}else{
				$("#clientDownBtn").css("display","none");
				$("#updateLogdiv").css("display","none");
				Version = lg.get("IDS_CLIENT_No_New");
			}
			curVersionContent.innerHTML = a.curVersion;
			UpdateStatusContent.innerHTML = Version;
			$("#CheckVersionBtn").attr("disabled",false);
		}else if(a.SubEvent == ClientCofigEvent.SubEventManualCheckWebVersion){
			CurWebVersionContent.innerHTML = a.curVersion;
		}
	}
	ClientConfigEventCallBack = ClientConfigResultEvent;

	if(!WebCms.plugin.isLoaded){
		$("#PathConfig_Btn").css("display","none");
		$("#PathConfig_Page").css("display","none");
		$(".pluginInfoClass").css("display", "none");
		$("#VersionInfo_Page").css("display","");
	}

	LoadClientCfg();
});
