//# sourceURL=Advance_HddManager.js
$(function () {
	var sel = 0;				//当前选择硬盘
	var hddInfoArr = [];		//硬盘信息数组
	var strTotalSpace = "";
	var strRemainSpace = "";

	var GeneralInfo = {};		//通用配置
	var AutoMaintain = {};		//自动维护功能
	var columnsData = [];
	var listData = [];
	var pageTitle = $("#Advance_HddManager").text();
	
	var HddHtml = 	'<div class="cfg_row">\n' +
		'				<div class="cfg_row_left">'+ lg.get("IDS_HDDM_Disk") +'</div>\n' +
		'				<div class="cfg_row_right" style="width: auto">\n' +
		'					<select class="select" id="disk_No"></select>\n' +
		'				</div>\n' +
		'            </div>\n' +
		
		'			<div id="partiton_cfg">\n' + 
		'				<div class="cfg_row">\n' +
		'					<div class="cfg_row_left">'+ lg.get("IDS_HDDM_RecordPartition") +'</div>\n' +
		'					<div class="cfg_row_right" style="width: auto">\n' +
		'						<input class="inputTxt" type="text" id="disk_Record" autocomplete="off"/>\n' +
		'						<span class="unit-indicator">%</span>\n' +
		'					</div>\n' +
		'				</div>\n' +

		'            	<div class="cfg_row">\n' +
		'                	<div class="cfg_row_left">'+ lg.get("IDS_HDDM_ImagePartition") +'</div>\n' +
		'                	<div class="cfg_row_right" style="width: auto">\n' +
		'                    	<input class="inputTxt" type="text" id="disk_Image" autocomplete="off"/>\n' +
		'    					<span class="unit-indicator"></span>\n' +
		'                	</div>\n' +
		'            	</div>\n' +
		'            </div>\n' +
		
		'			 <div id="DiskOpTips">\n' +
		'			 </div>\n' +

		'            <div class="cfg_row">\n' +
		'                <div class="btn_box" style="height: 30px;margin-top: 6px">\n' +
		'                    <button id="diskBtnOk" class="btn">' + lg.get("IDS_OK") + '</button>\n' +
		'                    <button class="btn btn_cancle" id="btnCancel">' + lg.get("IDS_CANCEL") + '</button>\n' +
		'                </div>\n' +
		'			</div>';
	function DiskOperator (nCtrlType, data) {
		RfParamCall(function(Result) {
			if (Result.Ret == 100) {
				if (nCtrlType == 2)	{		//磁盘分区
					ShowPaop(pageTitle, lg.get("IDS_HDDM_OperatorSuc"));
				}else{
					LoadConfig();
					ShowPaop(pageTitle, lg.get("IDS_HDDM_OperatorSuc"));
				}
			} else if(Result.Ret == 603){
				if (nCtrlType == 2)	{		//磁盘分区
					RebootDev(pageTitle, lg.get("IDS_HDDM_PartitionSuc"), false);
				}else if (nCtrlType == 3){	//清除操作
					RebootDev(pageTitle, lg.get("IDS_HDDM_ClearSuc"), false);
				}else {
					RebootDev(pageTitle, lg.get("IDS_HDDM_OperatorSuc"), false);
				}
			}
		}, pageTitle, "OPStorageManager", -1, WSMsgID.WSMsgID_DSIKMANAGER_REQ, data);
	}
	function ShowData() {
		listData = [];
		if (hddInfoArr != null) {
			var supportPercent = GetFunAbility(gDevice.Ability.PreviewFunction.StorageSpaceUsePercent);						 
			var Index =0;
			for (var i=0; i < hddInfoArr.length; i++) {
				if(hddInfoArr[i].PartNumber == 255){
					Index+=1;
					var temp = {
						"Index": Index,
						"Disk":hddInfoArr[i].PlysicalNo+1 +"-1",
						"Type":"?",
						"Status":lg.get("IDS_HDD_Unformatted"),
						"TotalSpace":"",
						"LeftCapacity":""
					};
					listData.push(temp);
					continue;
				}
				for (var j=0; j < hddInfoArr[i].PartNumber; j++) {
					var strType = lg.get("IDS_HDD_TYPE_ReadWrite");
					var nDriverType = hddInfoArr[i].Partition[j].DirverType;
					if (nDriverType == 0) {
						strType = lg.get("IDS_HDD_TYPE_ReadWrite");
					}else if(nDriverType == 1) {
						strType = lg.get("IDS_HDD_TYPE_ReadOnly");
					}else if (nDriverType == 2) {
						strType = lg.get("IDS_HDD_TYPE_EventDriver");
					}else if (nDriverType == 3) {
						strType = lg.get("IDS_HDD_TYPE_ReduDriver");
					}else if (nDriverType == 4) {
						strType = lg.get("IDS_HDD_TYPE_SnapShotDriver");
					}
					Index+=1;
					var strStatus = "Normal";
					if (hddInfoArr[i].Partition[j].Status != 0) {
						strStatus = "Error";
					}
					var TotalSpace = parseInt(hddInfoArr[i].Partition[j].TotalSpace);
					var LeftCapacity = parseInt(hddInfoArr[i].Partition[j].RemainSpace);
					var temp = {
						"Index": Index,
						"Disk":hddInfoArr[i].PlysicalNo+1 +"-"+ (j+1),
						"Type":strType,
						"Status":lg.getEx(strStatus),
					};
					if (supportPercent) {
                    	temp.TotalSpace = "100%";
                    	temp.LeftCapacity = getRemainPercentStr(LeftCapacity, TotalSpace, 2);
                	} else {
                    	temp.TotalSpace = ChangeSpaceToString(TotalSpace);
                    	temp.LeftCapacity = ChangeSpaceToString(LeftCapacity);
                	}
					listData.push(temp);
				}
			}

			var table = $("#HDDTable")[0];
			var nClearRow = table.rows.length;
			for (var n = 0; n < nClearRow; ++n) {
				table.deleteRow(0);
			}
			for (var n = 0; n < listData.length; ++n) {
				tr = table.insertRow(n);
				var td1 = tr.insertCell(0);
				var td2 = tr.insertCell(1);
				var td3 = tr.insertCell(2);
				var td4 = tr.insertCell(3);
				var td5 = tr.insertCell(4);
				var td6 = tr.insertCell(5);
				td1.innerHTML = listData[n].Index;
				td2.innerHTML = listData[n].Disk;
				td3.innerHTML = listData[n].Type;
				td4.innerHTML = listData[n].Status;
				td5.innerHTML = listData[n].TotalSpace;
				td6.innerHTML = listData[n].LeftCapacity;
			}
			var nHeadPadding = 0;
			var contentH = $("#HDDList .table-responsive").height()-$("#HDDList .table-head").height();
			if(listData.length * 30 > contentH){
				nHeadPadding = TableRightPadding;
			}
			$("#HDDList .table-head").css("padding-right", nHeadPadding+"px");
		} else {
			DivBox(0, "#OperatorBtn");
		}
	}
	function LoadConfig() {
		RfParamCall(function(a){
			hddInfoArr = a[a.Name];
			ShowData();
			MasklayerHide();
		}, pageTitle, "StorageInfo", -1, WSMsgID.WsMsgID_SYSINFO_REQ); 
	}
	$(function() {
		if (GetFunAbility(gDevice.Ability.EncodeFunction.SnapStream) || GetFunAbility(gDevice.Ability.OtherFunction.SupportSnapSchedule)) {
			$("#HddSetSnapShot").css("display", "");
		}
		var contentH = $("#HDDList .table-responsive").height()-$("#HDDList .table-head").height();
		$("#HDDList .table-content").css("height", contentH+'px');
		function DiskOperatorSetType(nSetType) {
			if (listData.length <=0) {
				return;
			}
			var strTitle = "";
			var strTips = "";
			var strSetType = "";
			if (nSetType == 0) {									//ReadWrite
				strTitle = lg.get("IDS_HDDM_SetReadWrite")
				strTips =lg.get("IDS_HDDM_TipSetReadWriteDriver");
				strSetType = "ReadWrite";
			}else if (nSetType == 1) {								//ReadOnly
				strTitle = lg.get("IDS_HDDM_SetReadonly");
				strTips =lg.get("IDS_HDDM_TipSetReadOnlyDriver");
				strSetType = "ReadOnly";
			}else if (nSetType == 2) {								//Events
				// strTitle = lg.get("IDS_HDDM_SetReadWrite")
			}else if (nSetType == 3) {								//Redundant
				strTitle = lg.get("IDS_HDDM_SetRedu");
				strTips =lg.get("IDS_HDDM_TipSetReduDriver");
				strSetType = "Redundant";
			}else if (nSetType == 4) {								//SnapShot
				strTitle = lg.get("IDS_HDDM_SetSnapshot");
				strTips =lg.get("IDS_HDDM_TipSetSnapShotDriver");
				strSetType = "SnapShot";
			}
			
			var dataHtml = '<div id="cfg_box">' + HddHtml + '</div>';
			RenderSencondShow(strTitle, dataHtml, '', true);
	
			$("#DiskOpTips").html(strTips);
			$("#partiton_cfg").css("display", "none");
	
			for (var i=0; i < hddInfoArr.length; i++) {
				if(hddInfoArr[i].PartNumber == 255){
					continue;
				}
				for (var j=0; j < hddInfoArr[i].PartNumber; j++) {
					$("#disk_No").append('<option value="'+ i +'">'+ (hddInfoArr[i].PlysicalNo+1) +'-'+ (j+1) +'</option>')
				}
			}
			if($("#disk_No").find("option").length <= 0){
				$(".btn_cancle").click();
				return;
			}
			$("#diskBtnOk").click(function() {
				var nLogicNo = $("#disk_No").val() *1;						//逻辑磁盘号
				var selText = $("#disk_No").find("option:selected").text();
				var nPartNo = (selText.split("-")[1]) *1 -1;				//分区号
	
				var OPStorageManager = {
					"Action":"SetType",
					"SerialNo":nLogicNo,
					"PartNo":nPartNo,
					"Type":strSetType
				};
				var data = {
					"Name":"OPStorageManager",
					"OPStorageManager":OPStorageManager
				};
				$("#btnCancel").click();
				DiskOperator(0, data);			//0, CONTROL_SETTYPE
			});
		}
		function DiskOperatorClear() {
			if (listData.length <=0) {
				return;
			}
			var dataHtml = '<div id="HddFormat">' + HddHtml + '</div>';
			RenderSencondShow(lg.get("IDS_HDDM_ClearTitle"), dataHtml, '', true);
			$("#DiskOpTips").html(lg.get("IDS_HDDM_TipFormatDisk"));
			$("#partiton_cfg").css("display", "none");
			for (var i=0; i < hddInfoArr.length; i++) {
				if(hddInfoArr[i].PartNumber == 255){
					$("#disk_No").append('<option value="'+ i +'">'+ (hddInfoArr[i].PlysicalNo+1) +'-1'+ '</option>')
					continue;
				}
				for (var j=0; j < hddInfoArr[i].PartNumber; j++) {
					$("#disk_No").append('<option value="'+ i +'">'+ (hddInfoArr[i].PlysicalNo+1) +'-'+ (j+1) +'</option>')
				}
			}
			if($("#disk_No").find("option").length <= 0){
				$(".btn_cancle").click();
				return;
			}
			$("#diskBtnOk").click(function() {
				var nLogicNo = $("#disk_No").val() *1;						//逻辑磁盘号
				var selText = $("#disk_No").find("option:selected").text();
				var nPartNo = (selText.split("-")[1]) *1 -1;	//分区号
				if (hddInfoArr[nLogicNo].Partition[nPartNo].DirverType == 1) {	//readonly
					$("#btnCancel").click();
					ShowPaop(pageTitle, lg.get("IDS_HDDM_CannotClear"));
					return;
				}
				var OPStorageManager = {
					"Action":"Clear",
					"SerialNo":nLogicNo,
					"PartNo":nPartNo
				};
				var data = {
					"Name":"OPStorageManager",
					"OPStorageManager":OPStorageManager
				};
				$("#btnCancel").click();
				ShowPaop(pageTitle, lg.get("IDS_HDDM_ClearStart"));
				DiskOperator(3, data);
			});
		}
		function DiskOperatorRecover() {
			if (listData.length <=0) {
				return;
			}
			var dataHtml = '<div id="cfg_box">' + HddHtml + '</div>';
			RenderSencondShow(lg.get("IDS_HDDM_RecoverError"), dataHtml, '', true);
			$("#partiton_cfg").css("display", "none");
			for (var i=0; i < hddInfoArr.length; i++) {
				if(hddInfoArr[i].PartNumber == 255){
					continue;
				}
				for (var j=0; j < hddInfoArr[i].PartNumber; j++) {
					$("#disk_No").append('<option value="'+ i +'">'+ (hddInfoArr[i].PlysicalNo+1) +'-'+ (j+1) +'</option>')
				}
			}
			if($("#disk_No").find("option").length <= 0){
				$(".btn_cancle").click();
				return;
			}
			$("#diskBtnOk").click(function() {
				var nLogicNo = $("#disk_No").val() *1;						//逻辑磁盘号
				var selText = $("#disk_No").find("option:selected").text();
				var nPartNo = (selText.split("-")[1]) *1 -1;	//分区号
				
				var OPStorageManager = {
					"Action":"Recover",
					"SerialNo":nLogicNo,
					"PartNo":nPartNo
				};
				var data = {
					"Name":"OPStorageManager",
					"OPStorageManager":OPStorageManager
				};
				$("#btnCancel").click();
				DiskOperator(1, data);
			});
		}
		function DiskOperatorPartition() {
			if (listData.length <=0) {
				return;
			}
    		var supportPercent =  GetFunAbility(gDevice.Ability.PreviewFunction.StorageSpaceUsePercent);
			var dataHtml = '<div id="Partition">' + HddHtml + '</div>';
			RenderSencondShow(lg.get("IDS_HDDM_PartitionTitle"), dataHtml, '', true);
			$(".unit-indicator").text(supportPercent ? "%" : "MB");
			for (var i=0; i < hddInfoArr.length; i++) {
				if(hddInfoArr[i].PartNumber == 255){
					continue;
				}
				$("#disk_No").append('<option value="'+ i +'">'+ (hddInfoArr[i].PlysicalNo+1) +'</option>');
			}
			if($("#disk_No").find("option").length <= 0){
				$(".btn_cancle").click();
				return;
			}
			var bHasReadOnly=false;
			var recordVal=0;
			var ImageVal=0;
			var nSel = $("#disk_No").val() * 1;
			for (var i=0; i < hddInfoArr[nSel].PartNumber; i++) {
				if (hddInfoArr[nSel].Partition[i].DirverType != 4) {
					recordVal += parseInt(hddInfoArr[nSel].Partition[i].TotalSpace);
				}
				if (hddInfoArr[nSel].Partition[i].DirverType == 4) {
					ImageVal += parseInt(hddInfoArr[nSel].Partition[i].TotalSpace);
				}
				if (hddInfoArr[nSel].Partition[i].DirverType == 1) {
					bHasReadOnly = true;
				}
			}
			var totalVal = recordVal + ImageVal;
			if (supportPercent) {
				var recordPercent = toFixedNoRound(recordVal / totalVal * 100, 2);
				var imagePercent = toFixedNoRound(100 - parseFloat(recordPercent), 2);
				$("#disk_Record").val(recordPercent);
				$("#disk_Image").val(imagePercent);
			} else {
				$("#disk_Record").val(recordVal);
				$("#disk_Image").val(ImageVal);
			}
			$("#disk_No").change(function() {
				var sel = $(this).val() *1;
				recordVal = 0;
				ImageVal = 0;
				bHasReadOnly = false;
				for (var i=0; i < hddInfoArr[sel].PartNumber; i++) {
					if (hddInfoArr[sel].Partition[i].DirverType != 4) {
						recordVal += parseInt(hddInfoArr[sel].Partition[i].TotalSpace);
					}
					if (hddInfoArr[sel].Partition[i].DirverType == 4) {
						ImageVal += parseInt(hddInfoArr[sel].Partition[i].TotalSpace);
					}
					if (hddInfoArr[sel].Partition[i].DirverType == 1) {
						bHasReadOnly = true;
					}
				}
				totalVal = recordVal + ImageVal;
				if (supportPercent) {
					var recordPercent = Math.round(recordVal * 100 / totalVal);
					var imagePercent = 100 - recordPercent;
					$("#disk_Record").val(recordPercent);
					$("#disk_Image").val(imagePercent);
				} else {
					$("#disk_Record").val(recordVal);
					$("#disk_Image").val(ImageVal);
				}
					});
			$("#disk_Record, #disk_Image").off('keyup blur');
			$("#disk_Record, #disk_Image").on('keyup blur', function() {
				var $this = $(this);
				var $other = $this.is("#disk_Record") ? $("#disk_Image") : $("#disk_Record");
				var min = 0;
				var max = supportPercent ? 100 : totalVal;
				NumberRange(this, min, max, -1);
				var curVal = parseInt($this.val(), 10) || 0;
				if (supportPercent) {
					// 百分比模式：同步另一个为 100 - curVal
					var otherVal = 100 - curVal;
					if (otherVal < 0) otherVal = 0;
					$other.val(otherVal);
				} else {
					// 数值模式：同步另一个为 totalVal - curVal
					var otherVal = totalVal - curVal;
					if (otherVal < 0) otherVal = 0;
					$other.val(otherVal);
				}
			});
			$("#diskBtnOk").off('click').on('click', function() {
				if (bHasReadOnly) {
					$("#btnCancel").click();
					ShowPaop(pageTitle, lg.get("IDS_HDDM_CannotPartition"));
					return;
				}

				var sel = $("#disk_No").val() * 1;
				var PartitionSize = [];
				var recordSize, diskCaptureImg;
				if (supportPercent) {
					var recordPercent = parseFloat($("#disk_Record").val());
					var capturePercent = parseFloat($("#disk_Image").val());
					if (Math.abs(recordPercent + capturePercent - 100) > 0.01) {
						capturePercent = 100 - recordPercent;
					}
					
				recordSize = Math.round(recordPercent * totalVal / 100);
				diskCaptureImg = totalVal - recordSize;
				} else {
					recordSize = $("#disk_Record").val() * 1;
					diskCaptureImg = $("#disk_Image").val() * 1;
				}
				
				if(diskCaptureImg > 0 && diskCaptureImg <= 1024){
					ShowPaop(pageTitle, lg.get("IDS_HDDM_CapturePartitionSizeError"));
					return;
				}
			if (recordSize <= 1024) {
					
					ShowPaop(pageTitle, lg.get("IDS_HDDM_RecordPartitionSizeError"));
					return;
				}
				
			var snapShotSize = { "SnapShot": diskCaptureImg };
			var activeSize = { "Action": 0 };
			var otherSize = { "": 0 };
			PartitionSize[0] = { "Record": recordSize };
			PartitionSize[1] = snapShotSize;
			PartitionSize[2] = activeSize;
			PartitionSize[3] = otherSize;

			var OPStorageManager = {
				"Action": "Partition",
				"PartNo": 0,
				"PartitionSize": PartitionSize,
				"SerialNo": sel
			};
			var data = {
				"Name": "OPStorageManager",
				"OPStorageManager": OPStorageManager
			};
			$("#btnCancel").click();
			ShowPaop(pageTitle, lg.get("IDS_HDDM_PartitionStart"));
			DiskOperator(2, data);
		});
}
		
		$("#HddSetReadWrite").click(function () {
			DiskOperatorSetType(0);
		});
		$("#HddSetSnapShot").click(function () {
			DiskOperatorSetType(4);
		});
		$("#HddSetReadOnly").click(function () {
			DiskOperatorSetType(1);
		});
		$("#HddSetRedu").click(function () {
			DiskOperatorSetType(3);
		});
		$("#HddClearDisk").click(function () {
			DiskOperatorClear();
		});
		$("#HddRecoverError").click(function() {
			DiskOperatorRecover()
		});
		$("#HddPartition").click(function () {
			DiskOperatorPartition();
		});
		LoadConfig();
	});
});