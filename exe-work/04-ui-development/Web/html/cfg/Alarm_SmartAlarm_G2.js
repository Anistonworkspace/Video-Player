//# sourceURL=Alarm_SmartAlarm_G2.js
$(function () {
	var pageTitle = $("#Alarm_SmartAlarm").text();
	var bGet = new Array;
	var motionCfg = new Array;
	var HumanCfg = new Array;
	var humanAbility = new Array;
	var digitalHumanAbility = new Array;
	var bGetIPCMotion = new Array;
	var IPCMotionCfg = new Array;
	var chPeaInHumanPed = new Array;
	var faceCfg = new Array;
	var faceFuncAry = new Array;
	var VoiceTipFunc = new Array;
	var motionArea = null;
	var chnIndex = -1;
	var bNVRHuman = GetFunAbility(gDevice.Ability.AlarmFunction.HumanDectionNVRNew);
	var bSendEmail = !GetFunAbility(gDevice.Ability.TipShow.NoEmailTipShow);
	var bFtp = !GetFunAbility(gDevice.Ability.TipShow.NoFTPTipShow);
	var bWriteLog = GetFunAbility(gDevice.Ability.OtherFunction.SupportWriteLog);
	function GetHumanRule(chn, iRule, iTrack) {
		var cfg = HumanCfg[chn][HumanCfg[chn].Name];
		cfg.ShowRule = iRule;
		cfg.ShowTrack = iTrack;
	}
	function drawGrid(nRow, nCol) {
		var cvs = document.getElementById("SA_motion_cvs");
		var ctx = cvs.getContext('2d');
		var wCell = bkWidth / nCol;
		var hCell = bkHeight / nRow;
		ctx.clearRect(0, 0, bkWidth, bkHeight);
		ctx.strokeStyle = "#0f0";
		ctx.fillStyle = "#f00";
		ctx.globalAlpha = 0.2;
		var xPos = 0;
		var yPos = 0;
		for (var i = 0; i < nRow; i++) {
			for (var j = 0; j < nCol; j++) {
				ctx.strokeRect(xPos, yPos, wCell, hCell);
				if (nRegion[i][j]) {
					ctx.fillRect(xPos, yPos, wCell, hCell);
				}
				xPos += wCell;
			}
			yPos += hCell;
			xPos = 0;
		}
	}
	function drawPolygon(pts, nRow, nCol) {
		var cvs = document.getElementById("SA_motion_cvs");
		var ctx = cvs.getContext('2d');
		ctx.clearRect(0, 0, bkWidth, bkHeight);
		ctx.strokeStyle = "#f00";
		ctx.globalAlpha = 1;
		ctx.beginPath();
		var wSpace = parseInt((bkWidth / nCol) / 2) < 5 ? parseInt((bkWidth / nCol) / 2) : 5;
		var hSpace = parseInt((bkHeight / nRow) / 2) < 5 ? parseInt((bkHeight / nRow) / 2) : 5;
		var points = [];
		for (var i = 0; i < pts.length; i++) {
			var x, y;
			if (pts[i].x <= wSpace) {
				x = wSpace;
			} else if (pts[i].x >= bkWidth - wSpace) {
				x = bkWidth - wSpace;
			} else {
				x = pts[i].x
			}
			if (pts[i].y <= hSpace) {
				y = hSpace;
			} else if (pts[i].y >= bkHeight - hSpace) {
				y = bkHeight - hSpace;
			} else {
				y = pts[i].y;
			}
			points.push({ x: x, y: y });
		}
		ctx.moveTo(points[0].x, points[0].y);
		for (var i = 1; i < points.length; i++) {
			ctx.lineTo(points[i].x, points[i].y);
		}
		ctx.lineTo(points[0].x, points[0].y);
		ctx.stroke();
	}
	function showHumanArea(nChn, _nRow, _nCol) {
		MasklayerShow(1);
		$("#SA_Region_dialog").show(function () {
			var region = motionCfg[nChn][motionCfg[nChn].Name].Region;
			bkWidth = $("#SA_motion_cvs").width();
			bkHeight = $("#SA_motion_cvs").height();
			var wCell = bkWidth / _nCol;
			var hCell = bkHeight / _nRow;
			var pointNum = 4;
			var nState = -1;		//鼠标左键按下的位置：1-选择坐标,2-选择边框, 3-选择矩形内部
			var nPointId = -1;		//按顺序左下右上
			var humanPts = [];
			InitArea();
			function InitArea() {
				var leftTop = { x: 50, y: 40 };
				var rightBottom = { x: 150, y: 85 };
				var leftPt = false;
				for (var i = 0; i < _nRow; i++) {
					for (var j = 0; j < _nCol; j++) {
						if (region[i] & (1 << j)) {
							var x = j * wCell;
							var y = i * hCell;
							if (!leftPt) {
								leftTop.x = x;
								leftTop.y = y;
								leftPt = true;
							}
							rightBottom.x = x + wCell;
							rightBottom.y = y + hCell;
							if (j == _nCol - 1) {
								if (bkWidth - rightBottom.x < wCell && bkWidth - rightBottom.x > 0) {
									rightBottom.x = bkWidth;
								}
							}
							if (i == _nRow - 1) {
								if (bkHeight - rightBottom.y < hCell && bkHeight - rightBottom.y > 0) {
									rightBottom.y = bkHeight;
								}
							}
						}
					}
				}
				humanPts.push({ x: leftTop.x, y: leftTop.y });
				humanPts.push({ x: leftTop.x, y: rightBottom.y });
				humanPts.push({ x: rightBottom.x, y: rightBottom.y });
				humanPts.push({ x: rightBottom.x, y: leftTop.y });
			}
			var offset = $("#SA_motion_cvs").offset();
			$("#SA_motion_cvs").unbind();
			$("#SA_motion_cvs").mousedown(function (e) {
				if (e.button == 0) {		//鼠标左键
					var beginPos = { "x": e.pageX - offset.left, "y": e.pageY - offset.top };
					nState = -1;
					nPointId = -1;
					CheckSelect(beginPos);
					$(this).bind("mousemove", function (ev) {
						var endPos = { "x": ev.pageX - offset.left, "y": ev.pageY - offset.top };
						var points = humanPts;

						if (nState == 3) {
							var temp = cloneObj(points);
							for (var i = 0; i < 4; i++) {
								temp[i].x += endPos.x - beginPos.x;
								temp[i].y += endPos.y - beginPos.y;
								if (!CheckPoint(temp[i])) {
									return;
								}
							}
							for (var i = 0; i < 4; i++) {
								points[i].x = temp[i].x;
								points[i].y = temp[i].y;
							}
							beginPos = endPos;
						} else if (nState == 1) {
							var temp = cloneObj(points);
							var nNextPointId = nPointId + 1;
							if (nPointId == pointNum - 1) {
								nNextPointId = 0;
							}
							if (temp[nNextPointId].x == points[nPointId].x) {
								temp[nNextPointId].x = temp[nPointId].x += endPos.x - beginPos.x;
							}
							if (temp[nNextPointId].y == points[nPointId].y) {
								temp[nNextPointId].y = temp[nPointId].y += endPos.y - beginPos.y;
							}
							/*设置矩形最小长宽为30*/
							if (nPointId == 0 && temp[nPointId + 2].x - temp[nPointId].x <= 30) {
								temp[nNextPointId].x = temp[nPointId].x = temp[nPointId + 2].x - 30;
							}
							if (nPointId == 1 && temp[nPointId].y - temp[nPointId + 2].y <= 30) {
								temp[nNextPointId].y = temp[nPointId].y = temp[nPointId + 2].y + 30;
							}
							if (nPointId == 2 && temp[nPointId].x - temp[nPointId - 2].x <= 30) {
								temp[nNextPointId].x = temp[nPointId].x = temp[nPointId - 2].x + 30;
							}
							if (nPointId == 3 && temp[nPointId - 2].y - temp[nPointId].y <= 30) {
								temp[nNextPointId].y = temp[nPointId].y = temp[nPointId - 2].y - 30;
							}
							if (!CheckPoint(temp[nPointId]) || !CheckPoint(temp[nNextPointId])) {
								return;
							}
							points[nPointId].x = temp[nPointId].x;
							points[nPointId].y = temp[nPointId].y;
							points[nNextPointId].x = temp[nNextPointId].x;
							points[nNextPointId].y = temp[nNextPointId].y;
							beginPos = endPos;
						}
						drawPolygon(humanPts, _nRow, _nCol);
					});
				}
			}).mouseup(function (e) {
				$(this).unbind("mousemove");
			}).mouseout(function (e) {
				$(this).unbind("mousemove");
			});
			drawPolygon(humanPts, _nRow, _nCol);
			function CheckPoint(pt) {
				if (pt.x >= 0 && pt.x <= bkWidth && pt.y >= 0 && pt.y <= bkHeight) {
					return true;
				}
				return false;
			}
			function CheckSelect(pt) {
				var bFinded = false;
				var points = humanPts;
				for (var n = 0; n < points.length; n++) {
					if (Math.abs(pt.x - points[n].x) < 5 && Math.abs(pt.y - points[n].y) < 5) {
						bFinded = true;
						nState = 2;
						nPointId = n;
					}
				}
				if (nState == -1) {
					var lna = 0;
					var lnb = 0;
					var lnc = 0;
					for (var j = 0; j < pointNum; j++) {
						var k = j + 1 < pointNum ? j + 1 : 0;
						lna = (points[j].x - points[k].x) * (points[j].x - points[k].x) +
							(points[j].y - points[k].y) * (points[j].y - points[k].y);
						lnb = (pt.x - points[k].x) * (pt.x - points[k].x) +
							(pt.y - points[k].y) * (pt.y - points[k].y);
						lnc = (pt.x - points[j].x) * (pt.x - points[j].x) +
							(pt.y - points[j].y) * (pt.y - points[j].y);

						if ((Math.sqrt(lnb) + Math.sqrt(lnc)) < (Math.sqrt(lna) + 1)) {
							nState = 1;
							nPointId = j;
							bFinded = true;
						}
					}
				}
				if (nState == -1) {
					if (PtInPolygon(pt, points, pointNum)) {
						bFinded = true;
						nState = 3;
					}
				}
				return bFinded;
			}
			$("#SA_SaveRegionBtn").unbind().click(function () {
				var leftTop = HitTest(humanPts[0]);
				var rightBottom = HitTest(humanPts[2]);
				for (var i = 0; i < _nRow; i++) {
					var Region_temp = region[i];
					Region_temp = Region_temp.substring(2);
					var mask = [];
					mask[1] = parseInt(Region_temp.substr(0, 4), 16);
					mask[0] = parseInt(Region_temp.substr(4, 4), 16);
					for (var j = 0; j < 32; j++) {
						var m = parseInt(j / 16);
						var n = j % 16;
						if(j < _nCol)
						{
							if (j >= leftTop.x && j <= rightBottom.x && i >= leftTop.y && i <= rightBottom.y) {
								mask[m] |= 1 << n;
							} else {
								mask[m] = mask[m] & ~(1 << n);
							}
						}
						else
						{
							mask[m] = mask[m] & ~(1 << n);
						}
					}
					region[i] = "0x" + toHex(mask[1], 4) + toHex(mask[0], 4);
				}
				closeDialog();
			});
			function HitTest(point) {
				var pos = { x: 0, y: 0 };
				if (point.x < 0) {
					point.x = 0;
				}

				if (point.y < 0) {
					point.y = 0;
				}

				if (wCell && hCell) {
					pos.x = parseInt(point.x / wCell);	//列
					pos.y = parseInt(point.y / hCell);	//行
				}
				return pos;
			}
		});

	}
	function showMotionArea(nChn, _nRow, _nCol) {
		MasklayerShow(1);
		$("#SA_Region_dialog").show(function () {
			var region = motionCfg[nChn][motionCfg[nChn].Name].Region;
			bkWidth = $("#SA_motion_cvs").width();
			bkHeight = $("#SA_motion_cvs").height();
			var wCell = bkWidth / _nCol;
			var hCell = bkHeight / _nRow;
			nRegion = [];
			for (var i = 0; i < _nRow; i++) {
				nRegion[i] = [];
				for (var j = 0; j < _nCol; j++) {
					nRegion[i][j] = ExtractMask(region[i], j) ? true : false;
				}
			}
			var offset = $("#SA_motion_cvs").offset();
			$("#SA_motion_cvs").unbind();
			$("#SA_motion_cvs").mousedown(function (e) {
				if (e.button == 0) {
					var pt = {
						x: e.pageX - offset.left,
						y: e.pageY - offset.top
					};
					var pos = GetPos(pt);
					if (pos.x > _nCol || pos.y > _nRow) return;
					nRegion[pos.y][pos.x] = !nRegion[pos.y][pos.x];
					drawGrid(_nRow, _nCol);
					$(this).bind("mousemove", function (ev) {
						var pt2 = {
							x: ev.pageX - offset.left,
							y: ev.pageY - offset.top
						};
						var pos2 = GetPos(pt2);
						if (pos2.x > _nCol || pos2.y > _nRow) return;
						var bx = pos.x > pos2.x ? pos2.x : pos.x;
						var ex = pos.x > pos2.x ? pos.x : pos2.x;
						var by = pos.y > pos2.y ? pos2.y : pos.y;
						var ey = pos.y > pos2.y ? pos.y : pos2.y;
						for (var i = by; i <= ey; i++) {
							for (var j = bx; j <= ex; j++) {
								nRegion[i][j] = nRegion[pos.y][pos.x];
							}
						}
						drawGrid(_nRow, _nCol);
					});
				}
			}).mouseup(function (e) {
				$(this).unbind("mousemove");
			}).mouseout(function (e) {
				$(this).unbind("mousemove");
			});
			function GetPos(pt) {
				if (pt.x < 0) pt.x = 0;
				if (pt.y < 0) pt.y = 0;
				var pos = { x: 0, y: 0 };
				if (hCell && wCell) {
					pos.x = parseInt(pt.x / wCell);
					pos.y = parseInt(pt.y / hCell);
				}
				return pos;
			}
			drawGrid(_nRow, _nCol);
			$("#SA_SaveRegionBtn").unbind().click(function () {
				for (var i = 0; i < _nRow; i++) {
					var Region_temp = region[i];
					Region_temp = Region_temp.substring(2);
					var mask = [];
					mask[1] = parseInt(Region_temp.substr(0, 4), 16);
					mask[0] = parseInt(Region_temp.substr(4, 4), 16);
					for (var j = 0; j < 32; j++) {
						var m = parseInt(j / 16);
						var n = j % 16;
						if(j < _nCol){
							if (nRegion[i][j]) {
								mask[m] |= 1 << n;
							} else {
								mask[m] = mask[m] & ~(1 << n);
							}
						}
						else
						{
							mask[m] = mask[m] & ~(1 << n);
						}
					}
					region[i] = "0x" + toHex(mask[1], 4) + toHex(mask[0], 4);
				}
				$(".dialog_role").css("display", "none");
				MasklayerHide();
			});
		});
	}
	function ShowAreaSet(nChn, nRow, nCol) {
		var bEnable = $("#SA_HumanEnable").attr("data") * 1 ? true : false;
		if (!bEnable) {
			if (nRow == 0 || nCol == 0) {
				MasklayerHide();
				ShowPaop(pageTitle, lg.get("IDS_INFO_NO_SUPPORT"));
				return;
			}
			gDevice.ParamCapture(nChn, function (a) {
				if (a.Ret == WEB_ERROR.ERR_SUCESS) {
					var timeStamp = (new Date).getTime();
					var imgUrl = gVar.captureUrl + "?update=" + timeStamp;
					$("#SA_motion_Img").attr("src", imgUrl);
					$("#SA_motion_Img").css("display", "");
					showMotionArea(nChn, nRow, nCol);
				} else {
					$("#SA_motion_Img").css("display", "none");
					showMotionArea(nChn, nRow, nCol);
				}
			});
		} else {
			if (((bNVRHuman) && chPeaInHumanPed[nChn])) {
				MasklayerShow(1);
				var _parent = "#Config_dialog .content_container";
				gVar.LoadChildConfigPage("PEA_Zone", "Human_Zone", _parent, function () {
					Config_Title.innerHTML = lg.get("IDS_CA_RULE");
					lan("PEA_Zone");
					SetWndTop("#Config_dialog");
					$("#Config_dialog").css("width", '650px');
					var cfg = HumanCfg[nChn][HumanCfg[nChn].Name];
					gDevice.ParamCapture(nChn, function (a) {
						MasklayerShow(1);
						if (a.Ret == WEB_ERROR.ERR_SUCESS) {
							var timeStamp = (new Date).getTime();
							var imgUrl = gVar.captureUrl + "?update=" + timeStamp;
							$("#PEA_Img").attr("src", imgUrl);
							$("#PEA_Img").css("display", "");
							$("#Config_dialog").show(500);
							HumanZoneObj = new HumanZone({
								nChannel: nChn,
								iShowRule: cfg.ShowRule,
								iShowTrack: cfg.ShowTrack,
								humanAbility: humanAbility[nChn],
								PedRule: cfg.PedRule,
								SaveCallback: GetHumanRule
							});
						} else {
							$("#PEA_Img").css("display", "none");
							$("#Config_dialog").show(500);
							HumanZoneObj = new HumanZone({
								nChannel: nChn,
								iShowRule: cfg.ShowRule,
								iShowTrack: cfg.ShowTrack,
								humanAbility: humanAbility[nChn],
								PedRule: cfg.PedRule,
								SaveCallback: GetHumanRule
							});
						}
					});
				});
			} else {
				if (nRow == 0 || nCol == 0) {
					MasklayerHide();
					ShowPaop(pageTitle, lg.get("IDS_INFO_NO_SUPPORT"));
					return;
				}
				gDevice.ParamCapture(nChn, function (a) {
					if (a.Ret == WEB_ERROR.ERR_SUCESS) {
						var timeStamp = (new Date).getTime();
						var imgUrl = gVar.captureUrl+ "?update=" + timeStamp;
						$("#SA_motion_Img").attr("src", imgUrl);
						$("#SA_motion_Img").css("display", "");
						showHumanArea(nChn, nRow, nCol);
					} else {
						$("#SA_motion_Img").css("display", "none");
						showHumanArea(nChn, nRow, nCol);
					}
				});
			}
		}
	}
	function CHOSDSaveSel(nIndex) {
		var chn=nIndex==gDevice.loginRsp.ChannelNum?0:nIndex;
		var Motion = motionCfg[chn][motionCfg[chn].Name];
		Motion.Enable=$("#SA_Enable").attr("data")*1?true:false;
		Motion.Level=$("#SA_SensitivenessS").val()*1;
		if(faceFuncAry[chn]){
			var Face = faceCfg[chn][faceCfg[chn].Name];
			Face.Enable=$("#SA_FaceEnable").attr("data")*1?true:false;
		}
		if(bNVRHuman&&digitalHumanAbility[chn].HumanDection){
			HumanCfg[chn][HumanCfg[chn].Name].Enable=$("#SA_HumanEnable").attr("data")*1?true:false;
		}
	}
	function OnClickedEnable() {
		var Enable = $("#SA_Enable").attr("data") * 1;
		DivBox(Enable, "#SA_CfgBox");
	}
	function OnClickHumanSwh() {
		if ($("#SA_HumanEnable").attr("data") * 1 == 1) {
			SA_RuleAndRegionBtn.innerHTML = lg.get("IDS_CA_RULE");
		} else {
			SA_RuleAndRegionBtn.innerHTML = lg.get("IDS_Region");
			$("#SA_FaceEnable").attr("data", 0);
			InitButton2();
		}
	}
	function OnClickFaceEnableBtn() {
		var FaceEnable = $("#SA_FaceEnable").attr("data") * 1;
		if (FaceEnable) {
			$("#SA_HumanEnable").attr("data", 1);
			InitButton2();
		}
	}
	function ShowData(chn) {
		var SAEnable = !1;
		var SensitivenessLev;
		var FaceFunc = !1;
		var FaceEnable = !1;
		var HumanFunc = !1;
		var HumanEnable = !1;
		try {
			var Motion = motionCfg[chn][motionCfg[chn].Name];
			SAEnable = Motion.Enable ? 1 : 0;
			SensitivenessLev = Motion.Level;
		} catch (error) {
			DebugStringEvent("Motion Config Error");
			SAEnable = 0;
			SensitivenessLev = 0;
		}

		if(faceFuncAry[chn]){
			FaceFunc = faceFuncAry[chn];
			FaceEnable = faceCfg[chn][faceCfg[chn].Name].Enable?1:0;
		}
		if(chn >= gDevice.loginRsp.VideoInChannel && bNVRHuman){
			HumanFunc = (digitalHumanAbility[chn].HumanDection && bNVRHuman);
			if(HumanFunc){
				HumanEnable = HumanCfg[chn][HumanCfg[chn].Name].Enable ? 1 : 0;
			}
		}
		$("#SA_Enable").attr("data", SAEnable);
		$("#SA_SensitivenessS").val(SensitivenessLev);
		$("#SA_HumanDetectBox").css("display", chnIndex != gDevice.loginRsp.ChannelNum && HumanFunc ? "" : "none");
		$("#SA_HumanEnable").attr("data", HumanEnable);
		$("#SA_FaceDetectBox").css("display",chnIndex != gDevice.loginRsp.ChannelNum &&  FaceFunc ? "" : "none");
		$("#SA_FaceEnable").attr("data", FaceEnable);
		if(chnIndex == gDevice.loginRsp.ChannelNum){
			$("#SA_RuleAndRegionBtn").hide();
		}else{
			$("#SA_RuleAndRegionBtn").show();
		}
		MasklayerHide();
		OnClickedEnable();
		OnClickHumanSwh();
		OnClickFaceEnableBtn();
		InitButton2();
	}
	function GetDetectIPC(nChn, callback){
		if (digitalHumanAbility[nChn].SupportAlarmLinkLight || digitalHumanAbility[nChn].SupportAlarmVoiceTips){
			bGetIPCMotion[nChn] = false;
			RfParamCall(function(a){
				IPCMotionCfg[nChn] = a;
				bGetIPCMotion[nChn] = true;
				callback();
			}, pageTitle, "Detect.MotionDetectIPC", nChn, WSMsgID.WsMsgID_CONFIG_GET);
		}else{
			callback();
		}
	}
	function GetDigitalHuman(nChn, callback) {
		if (nChn < gDevice.loginRsp.VideoInChannel || !bNVRHuman) {
			callback();
			return;
		}
		RfParamCall(function (a) {
			if (typeof a[a.Name] == 'undefined') {
				digitalHumanAbility[nChn] = {};
				digitalHumanAbility[nChn].HumanDection = false;
				digitalHumanAbility[nChn].SupportAlarmLinkLight = false;
				digitalHumanAbility[nChn].SupportAlarmVoiceTips = false;
				digitalHumanAbility[nChn].SupportAlarmVoiceTipsType = false;
			} else {
				digitalHumanAbility[nChn] = a[a.Name];
			}
			RfParamCall(function (a) {
				VoiceTipFunc[nChn] = a[a.Name];
				if (!digitalHumanAbility[nChn].HumanDection) {
					GetDetectIPC(nChn, function(){
						callback();
					});
				}else{
					RfParamCall(function (a) {
						chPeaInHumanPed = a[a.Name];
						RfParamCall(function (a) {
							humanAbility[nChn] = a[a.Name];
							RfParamCall(function (a) {
								HumanCfg[nChn] = a;
								GetDetectIPC(nChn, function(){
									callback();
								});
							}, pageTitle, "Detect.HumanDetection", nChn, WSMsgID.WsMsgID_CONFIG_GET);
						}, pageTitle, "ChannelHumanRuleLimit", nChn, WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ);
					}, pageTitle, "ChannelSystemFunction@SupportPeaInHumanPed", -1, WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ);
				}
			}, pageTitle, "Ability.VoiceTipType", nChn, WSMsgID.WsMsgID_CONFIG_GET, "", false, true);
		}, pageTitle, "NetUse.DigitalHumanAbility", nChn, WSMsgID.WsMsgID_CONFIG_GET);
	}
	function GetFaceCfg(nIndex) {
		RfParamCall(function (a) {
			faceCfg[nIndex] = a;
			var timeSection = faceCfg[nIndex][faceCfg[nIndex].Name].EventHandler.TimeSection;
			for(var i = 0; i < timeSection.length; i++){
				if(isObject(timeSection[i])){
					for(var j = 0; j < timeSection[i].length ; j++){
						if(timeSection[i][j] == ""){
							timeSection[i][j] = "0 00:00:00-00:00:00";
						}
					}
				}
			}
			faceCfg[nIndex][faceCfg[nIndex].Name].EventHandler.TimeSection = timeSection;
			GetDigitalHuman(nIndex, function () {
				ShowData(nIndex);
				MasklayerHide();
			});
		}, pageTitle, "Detect.FaceDetection", nIndex, WSMsgID.WsMsgID_CONFIG_GET);
	}
	function GetMotionCfg(nIndex) {
		if (!bGet[nIndex]) {
			RfParamCall(function (a) {
				motionCfg[nIndex] = a;
				var timeSection = motionCfg[nIndex][motionCfg[nIndex].Name].EventHandler.TimeSection;
				for(var i = 0; i < timeSection.length; i++){
					if(isObject(timeSection[i])){
						for(var j = 0; j < timeSection[i].length ; j++){
							if(timeSection[i][j] == ""){
								timeSection[i][j] = "0 00:00:00-00:00:00";
							}
						}
					}
				}
				motionCfg[nIndex][motionCfg[nIndex].Name].EventHandler.TimeSection = timeSection;
				bGet[nIndex] = true;
				if(faceFuncAry[nIndex]){
					GetFaceCfg(nIndex);
				}else{
					GetDigitalHuman(nIndex, function () {
						ShowData(nIndex);
						MasklayerHide();
					});
				}
			}, pageTitle, "Detect.MotionDetect", nIndex, WSMsgID.WsMsgID_CONFIG_GET);
		}else{
			ShowData(nIndex);
		}
	}
	function InitSmartAlarmPage() {
		bCopy = false;
		copyCfg = null;
		for (var j = 0; j < gDevice.loginRsp.ChannelNum; j++) {
			bGet[j] = false;
			motionCfg[j] = null;
			HumanCfg[j] = null;
			humanAbility[j] = null;
			digitalHumanAbility[j] = null;
			bGetIPCMotion[j] = false;
			IPCMotionCfg[j] = null;
			chPeaInHumanPed[j] = null;
			faceCfg[j] = null;
			faceFuncAry[j] = null;
		}
		var nIndex = chnIndex;
		if (nIndex >= gDevice.loginRsp.ChannelNum || nIndex < 0) {
			nIndex = 0;
		}
		RfParamCall(function (a) {
			faceFuncAry = a[a.Name];
			RfParamCall(function (a) {
				motionArea = a;
				GetMotionCfg(nIndex);
			}, pageTitle, "MotionArea", -1, WSMsgID.WsMsgID_ABILITY_GET);
		}, pageTitle, "ChannelSystemFunction@SupportFaceDetectV2", -1, WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ, "", false, true);

	}
	$(function () {
		$("#SA_SendEmailBox").css("display", bSendEmail ? "" : "none");
		$("#SA_FTPBox").css("display", bFtp ? "" : "none");
		$("#SA_WriteLogBox").css("display", bWriteLog ? "" : "none");
		$("#SA_PhoneUp_line").css("display", GetFunAbility(gDevice.Ability.NetServerFunction.NetPMS) ? "" : "none");
		$("#SA_Record_line").css("display", !GetFunAbility(gDevice.Ability.OtherFunction.NOHDDRECORD) ? "" : "none");
		$("#SA_Channel").empty();
		var dataHtml = '';
		for (var j = 0; j < gDevice.loginRsp.ChannelNum; j++) {
			dataHtml += '<option value="' + j + '">' + gDevice.getChannelName(j) + '</option>';
		}
		if (gDevice.loginRsp.ChannelNum > 1) {
			dataHtml += '<option value="' + j + '">' + lg.get("IDS_CFG_ALL") + '</option>';
		}
		$("#SA_Channel").append(dataHtml);
		if (chnIndex == -1) {
			chnIndex = 0;
		}
		$("#SA_Channel").val(chnIndex);
		for (var j = 1; j <= 6; j++) {
			var level = lg.get("IDS_SSV_" + j);
			$("#SA_SensitivenessS").append('<option value="' + j + '">' + level + '</option>');
		}
		ChangeBtnState2();
		function SaveFaceCfg(nIndex){
			if(nIndex <  gDevice.loginRsp.ChannelNum){
				if(bGet[nIndex]&&faceFuncAry[nIndex]){
					RfParamCall(function (data){
						SaveFaceCfg(nIndex + 1);
					}, pageTitle, "Detect.FaceDetection", nIndex, WSMsgID.WsMsgID_CONFIG_SET, faceCfg[nIndex]);
				}else{
					SaveFaceCfg(nIndex + 1);
				}
			}else{
				ShowPaop(pageTitle,lg.get("IDS_SAVE_SUCCESS"));
			}
		}
		function SaveIPCMotion(nIndex){
			if(nIndex < gDevice.loginRsp.ChannelNum){
				if (bNVRHuman && isObject(digitalHumanAbility[nIndex]) && (digitalHumanAbility[nIndex].SupportAlarmLinkLight || digitalHumanAbility[nIndex].SupportAlarmVoiceTips)
				&& bGetIPCMotion[nIndex]){
					IPCMotionCfg[nIndex][IPCMotionCfg[nIndex].Name].Enable = motionCfg[nIndex][motionCfg[nIndex].Name].Enable;
					RfParamCall(function(a){
						SaveIPCMotion(nIndex + 1);
					}, pageTitle, "Detect.MotionDetectIPC", nIndex, WSMsgID.WsMsgID_CONFIG_SET, IPCMotionCfg[nIndex]);
				}else{
					SaveIPCMotion(nIndex + 1);
				}
			}else{
				SaveFaceCfg(0);
			}
		}
		function SaveHumanCfg(nIndex){
			if(nIndex < gDevice.loginRsp.ChannelNum){
				if (bGet[nIndex] && ((bNVRHuman && isObject(digitalHumanAbility[nIndex])
					&& digitalHumanAbility[nIndex].HumanDection))){
					RfParamCall(function(a){
						SaveHumanCfg(nIndex + 1);
					}, pageTitle, "Detect.HumanDetection", nIndex, WSMsgID.WsMsgID_CONFIG_SET, HumanCfg[nIndex]);
				}else{
					SaveHumanCfg(nIndex + 1);
				}
			}else{
				if(bNVRHuman){
					SaveIPCMotion(gDevice.loginRsp.VideoInChannel);
				}else{
					ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
				}
			}
		}
		function SaveCfg(nIndex){
			if(nIndex < gDevice.loginRsp.ChannelNum){
				if(bGet[nIndex]){
					RfParamCall(function (data){
						SaveCfg(nIndex + 1);
					}, pageTitle, "Detect.MotionDetect", nIndex, WSMsgID.WsMsgID_CONFIG_SET, motionCfg[nIndex]);
				}else{
					SaveCfg(nIndex + 1);
				}
			}else{
				if(bNVRHuman){
					SaveHumanCfg(0);
				}else{
					ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
				}
			}
		}
		function SaveAllCfg(){
			var CfgData = {
				"Name": "Detect.MotionDetect.[ff]",
				"Detect.MotionDetect.[ff]": cloneObj(motionCfg[0][motionCfg[0].Name])
			};
			if(CfgData[CfgData.Name].EventHandler.RecordEnable){
				CfgData[CfgData.Name].EventHandler.RecordMask="0xffffffffffffffff";
			}else{
				CfgData[CfgData.Name].EventHandler.RecordMask="0x0";
			}
	
			if(CfgData[CfgData.Name].EventHandler.TourEnable){
				CfgData[CfgData.Name].EventHandler.TourMask="0xffffffffffffffff";
			}else{
				CfgData[CfgData.Name].EventHandler.TourMask="0x0";
			}
			
			RfParamCall(function (data){
				if(bNVRHuman && isObject(IPCMotionCfg[0])){
					CfgData = null;
					CfgData = {
						"Name": "Detect.MotionDetectIPC.[ff]",
						"Detect.MotionDetectIPC.[ff]": cloneObj(IPCMotionCfg[0][IPCMotionCfg[0].Name])
					};
					RfParamCall(function (data){
						ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
					}, pageTitle, CfgData.Name, -1, WSMsgID.WsMsgID_CONFIG_SET, CfgData)
				}else{
					ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
				}
			}, pageTitle, CfgData.Name, -1, WSMsgID.WsMsgID_CONFIG_SET, CfgData);
		}
		$("#SA_Save").click(function(){
			var nChn = $("#SA_Channel").val() * 1;
			CHOSDSaveSel(nChn);
			if (nChn == gDevice.loginRsp.ChannelNum && (gDevice.loginRsp.SoftWareVersion > "V2.62.R07" || gDevice.loginRsp.BuildTime > "2024-04-01")){
				SaveAllCfg();
			}else{
				SaveCfg(nChn);
			}
		})
		$("#SA_Rf").click(function () {
			InitSmartAlarmPage();
		})
		$("#SA_FaceEnable").click(function () {
			OnClickFaceEnableBtn();
		})
		$("#SA_HumanEnable").click(function () {
			OnClickHumanSwh();
		})
		$("#SA_Enable").click(function () {
			OnClickedEnable();
			OnClickFaceEnableBtn();
		});
		$("#SA_Channel").change(function () {
			var nChn = $("#SA_Channel").val() * 1;
			var bAllChn = (nChn == gDevice.loginRsp.ChannelNum ? true : false);
			$("#SA_RuleAndRegion").css("display", bAllChn ? "none" : "");
			if (chnIndex != gDevice.loginRsp.ChannelNum) {
				CHOSDSaveSel(chnIndex);
			}
			chnIndex = nChn;
			GetMotionCfg(bAllChn ? 0 : nChn);
		})
		$("#SA_RuleAndRegionBtn").click(function () {
			var nChn = $("#SA_Channel").val() * 1;
			if (nChn < 0) {
				return;
			}
			if (nChn == gDevice.loginRsp.ChannelNum) {
				nChn = 0;
			}
			var nRow = 0;
			var nCol = 0;
			if (nChn >= gDevice.loginRsp.VideoInChannel) {
				if (GetFunAbility(gDevice.Ability.OtherFunction.ShowAlarmLevelRegion)) {
					RfParamCall(function (a) {
						if (a.Ret == 100) {
							motionAreaDig = a;
							nRow = a[a.Name].GridRow;
							nCol = a[a.Name].GridColumn;
							ShowAreaSet(nChn, nRow, nCol);
						} else {
							ShowPaop(pageTitle, lg.get("IDS_NET_TIP_OTHER"));
							MasklayerHide();
							return;
						}
					}, pageTitle, "MotionArea", nChn, WSMsgID.WsMsgID_ABILITY_GET);
				} else {
					motionAreaDig = cloneObj(motionArea);
					nRow = motionAreaDig[motionAreaDig.Name].GridRow;
					nCol = motionAreaDig[motionAreaDig.Name].GridColumn;
					ShowAreaSet(nChn, nRow, nCol);
				}
			} else {
				nRow = motionArea[motionArea.Name].GridRow;
				nCol = motionArea[motionArea.Name].GridColumn;
				ShowAreaSet(nChn, nRow, nCol);
			}
		});
		$("#SA_PeriodBtn").unbind().click(function () {
			MasklayerShow(1);
			$("#period_dialog").show(function () {
				var chn = chnIndex == gDevice.loginRsp.ChannelNum ? 0 : chnIndex;
				var timeSection = motionCfg[chn][motionCfg[chn].Name].EventHandler.TimeSection;
				var AlarmType = AlarmTypeEnum.Motion;
				ShowPeriodWnd(timeSection, AlarmType, true, function () {
					if(faceFuncAry[chn]){
						$.extend(true, faceCfg[chn][faceCfg[chn].Name].EventHandler.TimeSection,timeSection);
					}
					if(bNVRHuman && digitalHumanAbility[chn].SupportAlarmVoiceTips && digitalHumanAbility[chn].SupportAlarmVoiceTipsType){
						$.extend(true, IPCMotionCfg[chn][IPCMotionCfg[chn].Name].EventHandler.TimeSection, timeSection);
					}
					MasklayerHide();
				});
			});
		});
		$("#SA_AdvanceSetBtn").click(function () {
			MasklayerShow(1);
			var chn = chnIndex == gDevice.loginRsp.ChannelNum ? 0 : chnIndex;
			var cfg = null;
			cfg = motionCfg[chn][motionCfg[chn].Name];
			if ($("#SA_HumanEnable").attr("data") * 1) {
				if (digitalHumanAbility[chn].SupportAlarmVoiceTips && digitalHumanAbility[chn].SupportAlarmVoiceTipsType) {
					$("#SA_VoiceTipDiv").css("display", "");
					$("#SA_VoiceTip").empty();
					var dataHtml;
					for (var i = 0; i < VoiceTipFunc[chn].VoiceTip.length; i++) {
						dataHtml += '<option value="' + VoiceTipFunc[chn].VoiceTip[i].VoiceEnum + '">' + VoiceTipFunc[chn].VoiceTip[i].VoiceText + '</option>';
					}
					$("#SA_VoiceTip").append(dataHtml);
					var nVoice = IPCMotionCfg[chn][IPCMotionCfg[chn].Name].EventHandler.VoiceType;
					$("#SA_VoiceTip").val(nVoice);
				} else {
					$("#SA_VoiceTipDiv").css("display", "none");
				}
			} else {
				$("#SA_VoiceTipDiv").css("display", "none");
			}

			GetAlarmToneType("Detect.MotionDetect", "#SA_Alarm_tone", "#SA_AbAlarmToneType", "#SA_AbAlarmTone");
			SetAlarmToneType(cfg.EventHandler, "#SA_AbAlarmToneType", "#SA_AbAlarmTone");
			ChangeVoiceType("#SA_AbAlarmToneType", "#SA_alarmAndCustom");
	
			$("#SA_Interval").val(cfg.EventHandler.EventLatch);
			$("#SA_RecordDelay").val(cfg.EventHandler.RecordLatch);
			if(bSendEmail){
				$("#SA_SendEmail").attr("data", cfg.EventHandler.MailEnable?1:0);
			}
			if(bFtp){
				$("#SA_FTP").attr("data", cfg.EventHandler.FTPEnable?1:0);
			}
			if(bWriteLog){
				$("#SA_WriteLog").attr("data", cfg.EventHandler.LogEnable?1:0);
			}
			$("#SA_PhoneUpChk").attr("data", cfg.EventHandler.MessageEnable?1:0);
			$("#SA_RecordChk").attr("data", cfg.EventHandler.RecordEnable?1:0);
			InitButton2();
			
			$("#SA_AbAlarmToneCustomButton").unbind().click(function () {
				var cmd = {
					"KeepMaskLayer": true,
					"FilePurpose": 7
				};
				$("#SA_Advance_Dialog").css("display","none");
				ShowVoiceCustomDlg(-1, cmd, pageTitle, function () {
					$("#SA_Advance_Dialog").css("display","");
				});
			})
			$("#SA_VoiceTipBtn").unbind().click(function () {
				var cmd = {
					"KeepMaskLayer": true,
					"FilePurpose": 0
				};
				$("#SA_Advance_Dialog").css("display","none");
				var nChn = $("#SA_Channel").val() * 1;
				if(nChn == gDevice.loginRsp.ChannelNum)
				{
					nChn = 0;
				}
				ShowVoiceCustomDlg(nChn, cmd, pageTitle, function () {
					$("#SA_Advance_Dialog").css("display","");
				});
			})
			$("#SA_AbAlarmToneType").unbind().change(function () {
				ChangeVoiceType("#SA_AbAlarmToneType", "#SA_alarmAndCustom");
			})
			$("#SA_Advance_Cancel").unbind().click(function () {
				$(".btn_cancle").click();
			})
			$("#SA_Advance_Confirm").unbind().click(function () {
				cfg.EventHandler.MailEnable = $("#SA_SendEmail").attr("data") * 1?true:false;
				cfg.EventHandler.FTPEnable = $("#SA_FTP").attr("data") * 1?true:false;
				cfg.EventHandler.LogEnable = $("#SA_WriteLog").attr("data") * 1?true:false;
				cfg.EventHandler.MessageEnable=$("#SA_PhoneUpChk").attr("data") * 1?true:false;
			    cfg.EventHandler.RecordEnable=$("#SA_RecordChk").attr("data") * 1?true:false;
				cfg.EventHandler.RecordLatch = $("#SA_RecordDelay").val()*1;
				cfg.EventHandler.EventLatch = $("#SA_Interval").val()*1;
				if (cfg.EventHandler.RecordEnable) {
					if(chnIndex != gDevice.loginRsp.ChannelNum){
						var num = 1 << chn;
						cfg.EventHandler.RecordMask = "0x" + num.toString(16);
					}
				} else {
					cfg.EventHandler.RecordMask = "0x0";
				}
				SaveAlarmToneType(cfg.EventHandler, "#SA_AbAlarmToneType", "#SA_AbAlarmTone");
				if(faceFuncAry[chn]){
					var temp = faceCfg[chn][faceCfg[chn].Name];
					temp.EventHandler.MailEnable = cfg.EventHandler.MailEnable;
					temp.EventHandler.LogEnable = cfg.EventHandler.LogEnable;
					temp.EventHandler.FTPEnable = cfg.EventHandler.FTPEnable;
					temp.EventHandler.MessageEnable = cfg.EventHandler.MessageEnable;
					temp.EventHandler.RecordEnable = cfg.EventHandler.RecordEnable;
					temp.EventHandler.RecordLatch=cfg.EventHandler.RecordLatch;
					temp.EventHandler.EventLatch = cfg.EventHandler.EventLatch;
					if(chnIndex != gDevice.loginRsp.ChannelNum){
						if(temp.EventHandler.RecordEnable){
							temp.EventHandler.RecordMask = cfg.EventHandler.RecordMask;
						}else{
							cfg.EventHandler.RecordMask = "0x0";
						}
					}
					SaveAlarmToneType(temp.EventHandler, "#SA_AbAlarmToneType", "#SA_AbAlarmTone");
				}
				if (bNVRHuman && digitalHumanAbility[chn].SupportAlarmVoiceTips && digitalHumanAbility[chn].SupportAlarmVoiceTipsType) {
					if($("#SA_HumanEnable").attr("data") * 1){
						IPCMotionCfg[chn][IPCMotionCfg[chn].Name].EventHandler.VoiceType = $("#SA_VoiceTip").val()*1;
					}
				}
				$(".second_close").click();
			})
			$("#SA_Advance_Dialog").show();
		});
		InitSmartAlarmPage();
	})
})