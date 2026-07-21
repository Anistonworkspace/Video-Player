//# sourceURL=Record_Manager_jh.js
$(function () {
    var chnIndex = -1;
    var Schedule = new ScheduleFun();
    var colorArr = ["rgb(80, 160, 55)", "rgb(255, 210, 0)", "rgb(255, 0, 0)"];
    var recOptArr = ["Normal", "Motion", "Alarm"];
    var recOptTrans = [lg.get("IDS_REC_GENERAL"), lg.get("IDS_REC_DETECT"), lg.get("IDS_REC_ALARM")];
	var recordCfg = new Array;
	var chnIndex = -1;
	var pageTitle = $("#Record_Manager_jh").text();
	var weekIndex = 0;
	var bGet = new Array;
	var copyCfg;
	var bCopy;

	function GetReocrdCfg(nChn){
		if(!bGet[nChn]){
			RfParamCall(function(a){
				recordCfg[nChn] = a;
				var timeSection = recordCfg[nChn][recordCfg[nChn].Name].TimeSection;
				for(var i = 0; i < timeSection.length; i++){
					if(isObject(timeSection[i])){
						for(var j = 0; j < timeSection[i].length ; j++){
							if(timeSection[i][j] == ""){
								timeSection[i][j] = "0 00:00:00-00:00:00";
							}
						}
					}
				}
				recordCfg[nChn][recordCfg[nChn].Name].TimeSection = timeSection;
				bGet[nChn] = true;				
				ShowData(nChn);
			}, pageTitle, "Record", nChn, WSMsgID.WsMsgID_CONFIG_GET);
		}else{
			ShowData(nChn);
		}
	}

    function ShowData(nChn) {
        var colorArray = colorArr;
        var recOptTransArr = recOptTrans;
		var _selectRadio = 1;
        Schedule.CreateSchedule("weekData", {
            color: colorArray,
            option: recOptTransArr,
            date: gVar.weekArr,
            cellheight: gVar.S_Style.cellH * 1,
            cellwidth: gVar.S_Style.cellW * 1,
            parentcolor: "rgb(28,29,34)",
            controlbar: gVar.S_Style.controlbarFlag,
            bordercolor: gVar.S_Style.bColor,
            fontcolor: gVar.S_Style.fColor,
			_selectRadio: _selectRadio,
			pageTitle:pageTitle,
			limitTips:lg.get("IDS_LimitSection")
        });

        var data = [];	
		var cfg = recordCfg[nChn][recordCfg[nChn].Name];
		
        for (var k = 0; k < recOptArr.length; ++k) {
            data.push([]);
			var nFlag = 0x01;
			if(recOptArr[k] == "Normal"){
				nFlag = 0x01;
			}else if(recOptArr[k] == "Motion"){
				nFlag = 0x01 << 2;
			}else if(recOptArr[k] == "Alarm"){
				nFlag = 0x01 << 1;
			}
            for (var i = 0; i < gVar.weekArr.length; ++i) {
                data[k].push([]);
				var nMask = [0x0,0x00];
				for (var j = 0; j < 6; j++) {
					if(cfg.Mask[i][j] & nFlag){
						var itime = cfg.TimeSection[i][j];
						itime = itime.split(" ");
						itime = itime[1].split("-");
						var itime1 = itime[0].split(":");
						var itime2 = itime[1].split(":");
						var nStartMin = parseInt(itime1[0])*60+parseInt(itime1[1]);
						var nEndMin = parseInt(itime2[0])*60 + parseInt(itime2[1]);
						var sIndex = parseInt(nStartMin / 30);
						var eIndex = parseInt(nEndMin / 30);
						if(sIndex >= 0 && sIndex <= 48 && eIndex >=0 && eIndex <=48){
							for(var m=sIndex;m<eIndex;m++){
								if(m < 24){
									nMask[0] = nMask[0] | (0x01 << m);
								}else if(m < 48){
									nMask[1] = nMask[1] | (0x01 << (m-24));
								}
							}
						}
					}
				}
                for (var j = 0; j < 48; ++j) {
					if (j < 24) {
						var s = nMask[0] >> j & 0x01;
						data[k][i].push(s);
					} else {
						var s = nMask[1] >> (j-24) & 0x01;
						data[k][i].push(s);
					}
                }
            }
        }
        Schedule.SetData(data);
		MasklayerHide();
    }
	function FillDate(){
		var nChn = chnIndex == gDevice.loginRsp.ChannelNum ? 0 : chnIndex;
		GetReocrdCfg(nChn);
	}
	function LoadCfg(){
		RfParamCall(function(a, b){
			SupExtRec = a;
			FillDate();
		}, pageTitle, "SupportExtRecord", -1, WSMsgID.WsMsgID_ABILITY_GET);
	}

    function CHOSDSaveSel() {
		var nChn = chnIndex == gDevice.loginRsp.ChannelNum ? 0 : chnIndex;
		var cfg = recordCfg[nChn][recordCfg[nChn].Name];
        var data = Schedule.GetData();
		for (var i = 0; i < gVar.weekArr.length; ++i) {
			var bFound = false;
			var nStartMin = 0;
			var nEndMin = 0;
			var Index = 0;
			for(var j = 0;j< 6;j++){
				cfg.TimeSection[i][j] = "1 00:00:00-00:00:00";
				cfg.Mask[i][j] = "0x00000000";
			}
			var nMask =0x00;
			for (var k = 0; k < recOptArr.length; ++k) {
			    var nFlag = 0x01;
			    if(recOptArr[k] == "Normal"){
			    	nFlag = 0x01;
			    }else if(recOptArr[k] == "Motion"){
			    	nFlag = 0x01 << 2;
			    }else if(recOptArr[k] == "Alarm"){
					nFlag = 0x01 << 1;
				}			
				for (var j = 0; j < 48; ++j) {
					var temp = data[k][i][j];
					if(temp){
						if(!bFound){
							bFound = true;
							nStartMin = j*30;
							nEndMin = nStartMin;
						}else{
							nEndMin += 30;
						}
					}else if(!temp){
						if(bFound){
							nEndMin += 30;
							var nEHour = parseInt(nEndMin / 60);
							var nEMin = nEndMin % 60;
							var nSHour = parseInt(nStartMin/60);
							var nSMin = nStartMin%60;
							var time = "1 " + prefixInteger(nSHour,2)+ ":" +prefixInteger(nSMin,2) + ":" + "00" + 
								"-" + prefixInteger(nEHour,2) + ":"+ prefixInteger(nEMin,2)+ ":"+ "00";
							var m =0;
							for(m = 0;m < 6;m++){
								if(cfg.TimeSection[i][m] == time){
									break;
								}
							}
							if(m < 6){							
								var nTempMask = cfg.Mask[i][m] | nFlag;
								cfg.Mask[i][m] = "0x" + toHex(nTempMask,8);
							}else if(Index < 6){
								nMask = nFlag;
								cfg.TimeSection[i][Index] = time;
								cfg.Mask[i][Index] = "0x" + toHex(nMask,8);
								Index += 1;
							}
							bFound = false;
						}
					}
				}
				if(bFound){
					nEndMin += 30;
					var nEHour = parseInt(nEndMin / 60);
					var nEMin = nEndMin % 60;
					var nSHour = parseInt(nStartMin/60);
					var nSMin = nStartMin%60;
					var time = "1 " + prefixInteger(nSHour,2)+ ":" +prefixInteger(nSMin,2) + ":" + "00" + 
						"-" + prefixInteger(nEHour,2) + ":"+ prefixInteger(nEMin,2)+ ":"+ "00";
					var m =0;
					for(m = 0;m < 6;m++){
						if(cfg.TimeSection[i][m] == time){
							break;
						}
					}
					if(m < 6){						
						var nTempMask = cfg.Mask[i][m] | nFlag;
						cfg.Mask[i][m] = "0x" + toHex(nTempMask,8);
					}else if(Index < 6){
						nMask = nFlag;
						cfg.TimeSection[i][Index] = time;
						cfg.Mask[i][Index] = "0x" + toHex(nMask,8);
						Index += 1;
					}
					bFound = false;
				}
			}
			for(var j = Index;j< 6;j++){
				cfg.TimeSection[i][j] = "1 00:00:00-00:00:00";
				cfg.Mask[i][j] = "0x00000000";
			}
		}
    }

    $("#LXJH_CPXQQD").click(function () {
        var q = $("#LXJH_CPQXQ").val() * 1;
        var h = $("#LXJH_CPHXQ").val() * 1;
        if (q == h) return;
        CHOSDSaveSel();
		var nChn = chnIndex == gDevice.loginRsp.ChannelNum ? 0 : chnIndex;
		var cfg = recordCfg[nChn][recordCfg[nChn].Name];
        if (h == 7) {
            for (var i = 0; i < gVar.weekArr.length; i++) {
				if(i != q){
					for(var j = 0;j< 6;j++){
						cfg.TimeSection[i][j] = cfg.TimeSection[q][j];
						cfg.Mask[i][j] = cfg.Mask[q][j];
					}
				}
            }
        } else {
			for(var j = 0;j< 6;j++){
				cfg.TimeSection[h][j] = cfg.TimeSection[q][j];
				cfg.Mask[h][j] = cfg.Mask[q][j];
			}
        }
        ShowData(nChn);
        ShowPaop(pageTitle, lg.get("IDS_COPY_SUC"));
    });

    $("#RECconfigRF").click(function () {
        Init();
    });
	
	function SaveAllCfg(callback){
		RfParamCall(function(a){
			var RecordAll = a;
			for(var i = 0; i < gDevice.loginRsp.ChannelNum; i++){
				var sRecordMode = a[a.Name][i].RecordMode;
				a[a.Name][i] = cloneObj(recordCfg[0][recordCfg[0].Name]);
				a[a.Name][i].RecordMode = sRecordMode;
			}
			RfParamCall(function(a){
				if(parseInt(SupExtRec[SupExtRec.Name].AbilityPram) == 1 || parseInt(SupExtRec[SupExtRec.Name].AbilityPram) == 2){
					RfParamCall(function(a){
						var RecordAllEx = a;
						for(var i = 0; i < gDevice.loginRsp.ChannelNum; i++){
							var sRecordMode = RecordAllEx[RecordAllEx.Name][i].RecordMode;
							RecordAllEx[RecordAllEx.Name][i] = cloneObj(recordCfg[0][recordCfg[0].Name]);
							var sRecordMode = a[a.Name].RecordMode;
							if(parseInt(SupExtRec[SupExtRec.Name].AbilityPram) == 1 && recordCfg[0][recordCfg[0].Name].RecordMode !== "ClosedRecord"){
								sRecordMode = "ClosedRecord";
							}
							RecordAllEx[RecordAllEx.Name][i].RecordMode = sRecordMode;
						}
						RfParamCall(function(a){
							callback(true);
						}, pageTitle, "ExtRecord", -1, WSMsgID.WsMsgID_CONFIG_SET, RecordAllEx);
					}, pageTitle, "ExtRecord", -1, WSMsgID.WsMsgID_CONFIG_GET);
				}else{
					callback(true);
				}
			}, pageTitle, "Record", -1, WSMsgID.WsMsgID_CONFIG_SET, RecordAll);
		}, pageTitle, "Record", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	function SaveAllChnCfg(){
		if(parseInt(SupExtRec[SupExtRec.Name].AbilityPram) == 1 || parseInt(SupExtRec[SupExtRec.Name].AbilityPram) == 2){
			SaveAllCfg(function(a){
				if(a){
					ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
				}
			})
		}else{
			var cfg = {};
			var cfgName = "Record.[ff]";
			cfg[cfgName] = cloneObj(recordCfg[0][recordCfg[0].Name]);
			cfg.Name = cfgName;
			RfParamCall(function (data){
			ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, cfgName, -1, WSMsgID.WsMsgID_CONFIG_SET, cfg);
		}
	}
	function SaveChnCfg(nIndex){
		if(nIndex < gDevice.loginRsp.ChannelNum){
			if(bGet[nIndex]){
				var CfgData = recordCfg[nIndex];
				RfParamCall(function (data){					
					if(parseInt(SupExtRec[SupExtRec.Name].AbilityPram) == 1 || parseInt(SupExtRec[SupExtRec.Name].AbilityPram) == 2){
						RfParamCall(function(a){
							var recordCfgEx = {};
							recordCfgEx.Name = "ExtRecord.[" + nIndex + "]";
							recordCfgEx[recordCfgEx.Name]= cloneObj(CfgData[CfgData.Name]);
							var sRecordMode = a[a.Name].RecordMode;
							if(parseInt(SupExtRec[SupExtRec.Name].AbilityPram) == 1 && CfgData[CfgData.Name].RecordMode !== "ClosedRecord"){
								sRecordMode = "ClosedRecord";
							}
							recordCfgEx[recordCfgEx.Name].RecordMode = sRecordMode;
							RfParamCall(function(data){
								SaveChnCfg(nIndex + 1);
							},pageTitle , "ExtRecord", nIndex, WSMsgID.WsMsgID_CONFIG_SET, recordCfgEx);
						},pageTitle, "ExtRecord", nIndex, WSMsgID.WsMsgID_CONFIG_GET);		
					}else{
						SaveChnCfg(nIndex + 1);
					}
				}, pageTitle, "Record", nIndex, WSMsgID.WsMsgID_CONFIG_SET, CfgData);
			}else{
				SaveChnCfg(nIndex + 1);
			}
		}else{
			SaveExCfg();
		}
	}

	function Init(){
		bCopy = false;
		copyCfg = null;
		for (var i = 0; i < gDevice.loginRsp.ChannelNum; i++) {
			bGet[i] = false;
			recordCfg[i] = null;
		}
		LoadCfg();
	}
	
	$(function () {
		if(gDevice.bGetDefault){
			$("#RECconfigDE").css("display", "");
		}
        $("#LXJH_CPHTD").append('<option class="option" value="' + gDevice.loginRsp.ChannelNum + '">' + lg.get("IDS_PATH_ALL") + '</option>');
        for (var i = 0; i < gDevice.loginRsp.ChannelNum; i++) {
            $("#RECConfigChid, #LXJH_CPQTD, #LXJH_CPHTD").append('<option class="option" value="' + i + '">' + gDevice.getChannelName(i) + '</option>');
		}
		if(gDevice.loginRsp.ChannelNum > 1){
			$("#RECConfigChid").append('<option class="option" value="' + i + '">' + lg.get("IDS_CFG_ALL") + '</option>');
		}
		$("#LXJH_CPHXQ").append('<option value="7">'+ lg.get("IDS_PATH_ALL") +'</option>');
		for (var j = 0; j < gVar.weekArr.length; j++) {
			$("#LXJH_CPQXQ, #LXJH_CPHXQ").append('<option value="'+ j +'">'+ gVar.weekArr[j] +'</option>');
		}		
		if(chnIndex == -1){
			chnIndex = 0;
			var d = new Date();
		}
		$("#RECConfigChid").val(chnIndex);
		
		$("#RECConfigChid").change(function () {
			var nChannel = $(this).val() * 1;
			if (nChannel == gDevice.loginRsp.ChannelNum){
				GetReocrdCfg(0);
				chnIndex = nChannel;
			}else if (chnIndex == gDevice.loginRsp.ChannelNum){
				GetReocrdCfg(nChannel);
				chnIndex = nChannel;
			}else{
				CHOSDSaveSel(chnIndex);
				GetReocrdCfg(nChannel);
				chnIndex = nChannel;
			}
		});
		$("#RECconfigCP").click(function () {
			CHOSDSaveSel();
			var nChn = chnIndex == gDevice.loginRsp.ChannelNum ? 0 : chnIndex;
			copyCfg = cloneObj(recordCfg[nChn]);
			bCopy = true;
		});
		$("#RECconfigPA").click(function(){
			if(!bCopy) return;
				
			var colorArray = colorArr;
			var recOptTransArr = recOptTrans;
			var _selectRadio = 1;
			Schedule.CreateSchedule("weekData", {
				color: colorArray,
				option: recOptTransArr,
				date: gVar.weekArr,
				cellheight: gVar.S_Style.cellH * 1,
				cellwidth: gVar.S_Style.cellW * 1,
				parentcolor: "rgb(28,29,34)",
				controlbar: gVar.S_Style.controlbarFlag,
				bordercolor: gVar.S_Style.bColor,
				fontcolor: gVar.S_Style.fColor,
				_selectRadio: _selectRadio,
				pageTitle:pageTitle,
				limitTips:lg.get("IDS_LimitSection")
			});

			var data = [];	
			var cfg = copyCfg[copyCfg.Name];
			
			for (var k = 0; k < recOptArr.length; ++k) {
				data.push([]);
				var nFlag = 0x01;
				if(recOptArr[k] == "Normal"){
					nFlag = 0x01;
				}else if(recOptArr[k] == "Motion"){
					nFlag = 0x01 << 2;
				}else if(recOptArr[k] == "Alarm"){
					nFlag = 0x01 << 1;
				}
				for (var i = 0; i < gVar.weekArr.length; ++i) {
					data[k].push([]);
					var nMask = [0x0,0x00];
					for (var j = 0; j < 6; j++) {
						if(cfg.Mask[i][j] & nFlag){
							var itime = cfg.TimeSection[i][j];
							itime = itime.split(" ");
							itime = itime[1].split("-");
							var itime1 = itime[0].split(":");
							var itime2 = itime[1].split(":");
							var nStartMin = parseInt(itime1[0])*60+parseInt(itime1[1]);
							var nEndMin = parseInt(itime2[0])*60 + parseInt(itime2[1]);
							var sIndex = parseInt(nStartMin / 30);
							var eIndex = parseInt(nEndMin / 30);
							if(sIndex >= 0 && sIndex <= 48 && eIndex >=0 && eIndex <=48){
								for(var m=sIndex;m<eIndex;m++){
									if(m < 24){
										nMask[0] = nMask[0] | (0x01 << m);
									}else if(m < 48){
										nMask[1] = nMask[1] | (0x01 << (m-24));
									}
								}
							}
						}
					}
					for (var j = 0; j < 48; ++j) {
						if (j < 24) {
							var s = nMask[0] >> j & 0x01;
							data[k][i].push(s);
						} else {
							var s = nMask[1] >> (j-24) & 0x01;
							data[k][i].push(s);
						}
					}
				}
			}
			Schedule.SetData(data);
			MasklayerHide();		
		});
		$("#RECconfigSave").click(function () {
			CHOSDSaveSel();
			var nChn = $("#RECConfigChid").val() * 1;
			if (nChn == gDevice.loginRsp.ChannelNum){
				if(gDevice.loginRsp.SoftWareVersion > "V2.62.R07" || gDevice.loginRsp.BuildTime > "2024-04-01"){
					SaveAllChnCfg();
				}else{
					for (i = 1; i < nChn; i++ ){
						if(bGet[i] && isObject(recordCfg[i])){
							recordCfg[i][recordCfg[i].Name] = cloneObj(recordCfg[0][recordCfg[0].Name]);
						}else{
							var cfg = {};
							var cfgName = "Record.[" + i + "]";
							cfg[cfgName] = cloneObj(recordCfg[0][recordCfg[0].Name]);
							cfg.Name = cfgName;
							recordCfg[i] = cfg;
							bGet[i] = true;
						}
					}
					SaveChnCfg(0);
				}
			}else{
				SaveChnCfg(0);
			}
		});
		$("#RECconfigDE").click(function(){	
			var nChn = chnIndex == gDevice.loginRsp.ChannelNum ? 0 : chnIndex;
			RfParamCall(function(a){
				recordCfg[nChn] = a;
				var timeSection = recordCfg[nChn][recordCfg[nChn].Name].TimeSection;
				for(var i = 0; i < timeSection.length; i++){
					if(isObject(timeSection[i])){
						for(var j = 0; j < timeSection[i].length ; j++){
							if(timeSection[i][j] == ""){
								timeSection[i][j] = "0 00:00:00-00:00:00";
							}
						}
					}
				}
				recordCfg[nChn][recordCfg[nChn].Name].TimeSection = timeSection;
				bGet[nChn] = true;				
				ShowData(nChn);
			}, pageTitle, "Record", nChn, WSMsgID.WsMsgID_DEFAULTCONFIG_GET);			
		});
		
        Init();
    });
});