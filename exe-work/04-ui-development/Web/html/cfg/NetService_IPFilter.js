$(function () {
	var ipFilterCfg;
	var pageTitle = lg.get("IDS_NETS_NetIPFilter");
	$("#Head_Address").html(lg.get("IDS_NET_Abled_Ip"));
	function GetIPFromString(str) {
		var ret = {};
		ret.type = "err";
		var ip = new Array(16);
		if (isIPv4(str)) {
			ret.type = 0;
			str = str.split('.');
			for (var i = 0; i < 16; ++i) {
				if (i < str.length) {
					ip[i] = str[i] * 1;
				} else {
					ip[i] = 0;
				}
			}
		}
		ret.ip = ip;
		return ret;
	}
	function FindUsedIPIndex(type){
		var cfg = ipFilterCfg[ipFilterCfg.Name];
		var nIndex = -1;
		var singleIp=type==0?cfg.Trusted:cfg.Banned;
		var nLen = singleIp.length;
		for(var i =0; i < nLen;i++){
			if(singleIp[i] === "0x00000000"){
				nIndex = i;
				break;
			}
		}
		return nIndex;
	}
	function StringIPToHex(str){
		var pp = str.split('.');
		var ip = '0x' + toHex(parseInt(pp[3]),2) + toHex(parseInt(pp[2]),2) + toHex(parseInt(pp[1]),2) +toHex(parseInt(pp[0]),2);
		return ip;
	}
	function CheckRepeat(sHex, eHex, type) {
		var cfg = ipFilterCfg[ipFilterCfg.Name];
		var singleIp=type==0?cfg.Trusted:cfg.Banned;
		var nLen = singleIp.length;
		for(var i =0; i < nLen;i++){
			if(singleIp[i] === sHex){
				return false;
			}
		}
		return true;
	}
	function listDataCall() {
		var cfg = ipFilterCfg[ipFilterCfg.Name];
		var type = $("#IPFilterlist_Restricted").val();
		if(type == 0){
			$("#Head_Address").html(lg.get("IDS_NET_Abled_Ip"));
		}else if(type == 1){
			$("#Head_Address").html(lg.get("IDS_NET_Disabled_Ip"));
		}
		var SingleIP = type==0?cfg.Trusted:cfg.Banned;
		var arrData = [];
		var nIndex = 0;
		var i = 0;
		for(; i < SingleIP.length; i++){
			if(SingleIP[i] != "0x00000000"){
				var sIP = HexIpToDecIp(SingleIP[i]);
				var temp = {
					"IPAddress": sIP,
					"nArrIndex": i
				};
				arrData.push(temp);
				nIndex += 1;
			}
		}
		var table = $("#NetServiceTable")[0];
		var nClearRow = table.rows.length;
		for (i = 0; i < nClearRow; i++) {
			table.deleteRow(0);
		}
		for (i = 0; i < arrData.length; i++) {
			var tr = table.insertRow(i);
			var td1 = tr.insertCell(0);
			var td2 = tr.insertCell(1);
			var td3 = tr.insertCell(2);
			td1.innerHTML = i + 1;
			td2.innerHTML = '<input class="CustomIPFilterClass" type="checkbox" value="'+ arrData[i].nArrIndex +'">';
			td3.innerHTML = toHtmlEncode(arrData[i].IPAddress);
		}
		var nHeight = $("#IPFilterList .table-responsive").height()-$("#IPFilterList .table-head").height();
		var nHeadPadding = 0;
		if(arrData.length * 30 > nHeight){
			nHeadPadding = TableRightPadding;
		}
		$("#IPFilterList .table-head").css("padding-right", nHeadPadding+"px");
		$("#IPFilterList .table-content").css("height", nHeight+'px');
		$("#IPFilterCheckAll").prop("checked", false);
		$(".CustomIPFilterClass").click(function(){
			var nCheckCount = 0;
			$(".CustomIPFilterClass").each(function(){
				if ($(this).prop("checked")) {
					++nCheckCount;
				}
			});
			if (nCheckCount == arrData.length && nCheckCount != 0) {
				$("#IPFilterCheckAll").prop("checked", true);
			}else {
				$("#IPFilterCheckAll").prop("checked", false);
			}
		});
	}
	function deleteBtnClick(Index, bRefresh) {
		var cfg = ipFilterCfg[ipFilterCfg.Name];
		var type = $("#IPFilterlist_Restricted").val();
		var SingleIP = type==0?cfg.Trusted:cfg.Banned;
		SingleIP[Index] = "0x00000000";
		if(bRefresh) listDataCall();
	}
	function ShowData() {
		var cfg = ipFilterCfg[ipFilterCfg.Name];
		var btnFlag = cfg.Enable?1:0;
		$("#IPFilterlist_enable_switch").attr("data", btnFlag);
		$("#IPFilterlist_Restricted").val(0).change();
		DivBox_Net("#IPFilterlist_enable_switch", "#EnableBox");
		DivBox_Net("#IPFilterlist_enable_switch","#DelBox");
		InitButton();
	}
	function GetIPFilterCfg(){
		RfParamCall(function(a){
			ipFilterCfg = a;
			ShowData();
			MasklayerHide();
		}, pageTitle, "NetWork.NetIPFilter", -1, WSMsgID.WsMsgID_CONFIG_GET);
	}
	$(function () {
		$("#IPFilterlist_Restricted").empty();
		$("#IPFilterlist_Restricted").append('<option value="0">'+ lg.get("IDS_IPLIST_WhiteList") +'</option>');
		$("#IPFilterlist_Restricted").append('<option value="1">'+ lg.get("IDS_IPLIST_BlackList") +'</option>');
		ChangeBtnState();
		$("#IPFilterlist_enable_switch").click(function() {
			DivBox_Net("#IPFilterlist_enable_switch", "#EnableBox");
			DivBox_Net("#IPFilterlist_enable_switch","#DelBox");
		});
		$("#IPFilterlist_Restricted").change(function () {
			listDataCall();
		});
		$("#IPFilterCheckAll").click(function(){
			var bCheck = $(this).prop("checked");
			$(".CustomIPFilterClass").each(function(){
				$(this).prop("checked", bCheck);
			});
		});
		$("#IPFilterlist_SingleAdd").click(function () {
			var type = $("#IPFilterlist_Restricted").val() * 1;
			var sIP = $("#IPFilterlist_StartAddress").val();
			var ipAddr = GetIPFromString(sIP);
			if (ipAddr.type == "err") {
				ShowPaop($("#IPFilter_list").text(), lg.get("IDS_IPLIST_INVALIDE"));
				return;
			}
			var cfg = ipFilterCfg[ipFilterCfg.Name];
			var singleIp=type==0?cfg.Trusted:cfg.Banned;
			var nIndex = FindUsedIPIndex(type);
			if(nIndex >= 0 && nIndex < 64){
				var tempIP = StringIPToHex(sIP);
				var bRepeat;
				if(type == 0){
					bRepeat = CheckRepeat(tempIP,"",0);
					if(!bRepeat){
						ShowPaop($("#IPFilter_list").text(), lg.get("IDS_IPLIST_EXSIT"));
						return;
					}
					bRepeat = CheckRepeat(tempIP,"",1);
					if(!bRepeat){
						ShowPaop($("#IPFilter_list").text(), lg.get("IDS_IPLIST_IPInBlackList"));
						return;
					}
				}else{
					bRepeat = CheckRepeat(tempIP,"",1);
					if(!bRepeat){
						ShowPaop($("#IPFilter_list").text(), lg.get("IDS_IPLIST_EXSIT"));
						return;
					}
					bRepeat = CheckRepeat(tempIP,"",0);
					if(!bRepeat){
						ShowPaop($("#IPFilter_list").text(), lg.get("IDS_IPLIST_IPInTrustList"));
						return;
					}
				}
				singleIp[nIndex] = tempIP;
			}else{
				var tip = type == 1?"IDS_IPLIST_BLACKLIMIT":"IDS_IPLIST_WHITELIMIT";
				ShowPaop($("#IPFilter_list").text(), lg.get(tip));
				return;
			}
			listDataCall();
		});
		$("#IPFilterlist_Del").click(function () {
			var arrDelRow = [];
			$(".CustomIPFilterClass").each(function(){
				if ($(this).prop("checked")) {
					var nIndex = $(this).prop("value") *1;
					arrDelRow.push(nIndex);
				}
			});
			if (arrDelRow.length == 0) {
				ShowPaop(pageTitle, lg.get("IDS_SELECT_IP"));
				return ;
			}
			for (var i = 0; i < arrDelRow.length; i++) {
				deleteBtnClick(arrDelRow[i],false);
			}
			listDataCall();
		});
		$("#IPFilterlist_Save").click(function () {
			var cfg = ipFilterCfg[ipFilterCfg.Name];
			cfg.Enable = $("#IPFilterlist_enable_switch").attr("data") * 1 == 0?false:true;
			RfParamCall(function(data){
				ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
			}, pageTitle, ipFilterCfg.Name, -1, WSMsgID.WsMsgID_CONFIG_SET, ipFilterCfg);
		});
		$("#IPFilterlist_Rf").click(function () {
			$("#IPFilterlist_StartAddress").val("");
			GetIPFilterCfg();
		});
		GetIPFilterCfg();
	});
});