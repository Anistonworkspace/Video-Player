//# sourceURL=common.js
var LanguageArray = [
	["Arabic","عربي"],
	["Brazilian","brasileiro"],
	["Bulgarian","български"],
	["Czech","čeština"],
	["Dansk","dansk"],
	["Dutch","Nederlands"],
	["English", "English"],
	["Estonian","Eesti"],
	["Farsi","فارسی"],
	["Finnish","Suomalainen"],
	["French","français"],
	["German","Deutsch"],
	["Greek","Ελληνικά"],
	["Hebrew","עִברִית"],
	["Hungarian","Magyar"],
	["Indonesian","Indonesia"],
	["Italian","italiano"],
	["Japanese", "日本語"],
	["Korean","한국어"],
	["Poland","Polska"],
	["Portugal","Portugal"],
	["Romanian","Română"],
	["Russian","Русский"],
	["SimpChinese", "简体中文"],
	["Slovakia","Slovenčina"],
	["Spanish","Español"],
	["Swedish","svenska"],
	["TradChinese","繁體中文"],
	["Thai","ไทย"],
	["Turkey","Türkiye"],
	["Ukrainian","український"],
	["Vietnamese","Tiếng Việt"],
];

var defaultTimeSection = "0 00:00:00-24:00:00";

var PASSWORD_STRENTH = {
	DANGER: 0,
	WEAK: 1,
	MEDIUM: 2,
	STRONG: 3,
	TYPE_NUM: 4
};
var devTypeEnum = {
	DEV_DVR: 0,
	DEV_NVS:1,
	DEV_IPC: 2,
	DEV_HVR:3,
	DEV_IVR:4,
	DEV_MVR:5,
	DEV_IOT:6
}

var CHNStatus = {
	CHN_CONNECTED:1,
	CHN_DISCONNECTED:2
}

var g_recTypeEnum={
	RECORD_COMMON: 0,	 //普通文件(R)
	RECORD_ALERT: 1,	 //外部报警(A)
	RECORD_DYNAMIC: 2,	 //动态检测(M)
	RECORD_CARD: 3,		 //卡号录像(C)
	RECORD_HAND: 4,		 //手动录像(H)
	RECORD_INVASION: 5,	 //入侵(I)
	RECORD_STRANDED: 6,	 //盗移, 滞留(S)
	RECORD_FACE: 7,		 //人脸识别录像(F)
	RECORD_CARNO: 8,	 //车牌识别(N)
	RECORD_IMP: 9,		 //关键录像(K)
	RECORD_DIAGOSIS: 10, //场景切换(G)
	RECORD_HUMAN: 11,	 //人形检测
	RECORD_PIR: 12,		 //PIR检测(P)
	RECORD_CARSHAPE: 13, //车形检测(T)
	RECORD_LCD: 14,		 //单绊线检测(L)
	RECORD_NR: 15
};

var OSDCmdEnum = {
	OSDCMD_SET: 1,
	OSDCMD_UP: 2,
	OSDCMD_DOWN: 3,
	OSDCMD_LEFT: 4,
	OSDCMD_RIGHT: 5
}

var recColor = [
	"rgb(0,255,0)",  //NormalRecord
	"rgb(255,0,0)",//AlarmRecord
	"rgb(255,0,0)",//MotionRecord
	"rgb(220,90,200)", //CardRecord
	"rgb(247,241,93)",//HandRecord
	"rgb(163,73,164)",//InvasionRecord
	"rgb(163,73,164)",//StrandedRecord
	"rgb(0,0,0)", //FaceRecord,暂未使用
	"rgb(0,0,0)",//CarNoRecord,暂未使用
	"rgb(0,0,0)",//ImpRecord,暂未使用
	"rgb(163,73,164)", //DiagosisRecord
	"rgb(255,0,0)",//HumanRecord
	"rgb(0,0,0)", //PirRecord,暂未使用
	"rgb(0,0,0)", //CarShapeRecord,暂未使用
	"rgb(0,0,0)", //LCDRecord,暂未使用
	"rgb(0,0,0)" 
]

var WSMsgID = {
    WsMsgID_ABILITY_GET:0,
    WsMsgID_SYSINFO_REQ:1,
    WsMsgID_CONFIG_CHANNELTILE_GET:2,
    WsMsgID_CONFIG_GET:3,
    WsMsgID_CONFIG_CHANNELTILE_SET:4,
    WsMsgID_CONFIG_SET:5,
	WSMsgID_NET_LOCALSEARCH_REQ:6,
	WSMsgID_CHANNEL_ABILITY_GET_REQ:7,
	WSMsgID_NET_MAILTEST_REQ:8,
	WSMsgID_NET_FTPTEST_REQ:9,
	WSMsgID_LOGSEARCH_REQ:10,
	WSMsgID_SYSMANAGER_REQ:11,
	WSMsgID_DSIKMANAGER_REQ:12,
	WSMsgID_TIMEQUERY_REQ:13,
	WSMsgID_FULLAUTHORITYLIST_GET:14,
	WSMsgID_USERS_GET:15,
	WSMsgID_GROUPS_GET:16,
	WSMsgID_ADDUSER_REQ:17,
	WSMsgID_MODIFYUSER_REQ:18,
	WSMsgID_DELETEUSER_REQ:19,
	WSMsgID_ADDGROUP_REQ:20,
	WSMsgID_MODIFYGROUP_REQ:21,
	WSMsgID_DELETEGROUP_REQ:22,
	WSMsgID_MODIFYPASSWORD_REQ:23,
	WSMsgID_GET_INTELL_ABILITY:24,
	WSMsgID_GET_INTELL_INFO_REQ:25,
	WSMsgID_SET_INTELL_ALL_INFO_REQ:26,
	WSMsgID_SET_DIG_IP_REQ:27,
	WsMsgID_AUTHORIZATION:28,
	WsMsgID_GUARD_REQ:29,
	WsMsgID_UNGUARD_REQ:30,
	WsMsgID_CONFIG_EXPORT_REQ:31,
	WsMsgID_LOG_EXPORT_REQ:32,
	WsMsgID_FILE_TRANS_REQ:33,
	WsMsgID_UPGRADE_REQ:34,
	WsMsgID_SYSTEM_DEBUG_REQ:35,
	WsMsgID_CONFIG_SCALTWOLENS:36,
	WSMsgID_GET_IPC_SYSINFO_REQ: 37,
	WSMsgID_SET_IPC_REBOOT_REQ: 38,
	WSMsgID_OSD_MENU: 39,
	WSMsgID_FLOW_REQ: 40,
	WsMsgID_DEFAULTCONFIG_GET:41,
}

var AlarmTypeEnum = {
	Motion: 0,
	Blind: 1,
	Loss: 2,
	Input: 3,
	Human: 4,
	Face: 5,
	Intelligent: 6,
	CapShape:7
};
var Protocol_V2 = {
	PROTOCOL_NETIP: 0,
	PROTOCOL_ONVIF: 1,
	PROTOCOL_MAC: 2,
	PROTOCOL_NAT: 3,
	PROTOCOL_DAHUA: 4,
	PROTOCOL_RTSP: 5,
	PROTOCOL_NETIPV6: 6,
	PROTOCOL_NR_V2: 8,
	PROTOCOL_ONVIF_DEFAULT: 128,
	PROTOCOL_ONVIF_NR_V2: 129
};
var sProtocolV2 = ["TCP", "ONVIF", "MAC", "NAT", "DAHUA", "RTSP", "TCP-ipv6", "ALL", "ONVIF-Default"];
var s_DevType = {
	"IPC":  0,
	"DVR": 1,
	"HVR": 2,
	"POEIPC": 3,
	"RTSP": 4	
};

var PlayType={
	TypeNoPlay:0,
	TypeRealPlay:1,
	TypePlaybackLocalFile:2,
	TypePlaybackByName:3,
	TypePlaybackByTime:4,
}
var PlayStatus = {
	StatusNoPlay:0,
	StatusReady:1,
	StatusPlaying:2,
	StatusStop:3,
	StatusPause:4,
	StatusSlow:5,
	StatusFast:6,
	StatusNextFrame:7,
	StatusPrevFrame:8
}
var PlaybackCtrl = {
	PlaybackPause:2,
	PlaybackContinue:3,
	PlaybackSetPos:4,
	PlaybackFast:10,
	PlaybackSlow:11,
	PlaybackNextFrame:100,
	PlaybackPrevFrame:101
}
var PlayBackType = {
	PBK_TYPE_LOCAL:0,
	PBK_TYPE_REMOTE_FILE:1,
	PBK_TYPE_REMOTE_TIME:2
}
var WEB_ERROR = {
	ERR_SUCESS:100,
	ERR_NOFINDDEVICE:999,
	ERR_BINDBROWSEFAIL:1003,
	ERR_TIMEOUT:1006,
	ERR_DISABLE_INLINE_UPGRADE:1007,
	ERR_DEV_INFO_ABNORMAL:1008,
	ERR_DownloadPathNotExists:1009,
	ERR_OTHER_CLIENT_UPGRADING:1011,
	ERR_CPU_FULLLOAD: 1032,			// CPU负载高
	ERR_MEMORY_FULLLOAD: 1033,		// 内存负载高
	ERR_PLAYSTATUS_ABNORMAL:-10000,
	ERR_OPEN_DECODER_FAIL:-10001,
	ERR_CREATE_DOWN_CHANNEL_FAIL:-10002,
	ERR_NO_BIND_PLAY_WND:-10003,
	ERR_WEBSOCKET_OPEN_FAIL:-10004,
	ERR_ALARM_RECV_NO_START:-10005,
	ERR_SALT_INVALID:-10006,
	ERR_UNKNOW:-10007,
	ERR_JSON_INVALID:-10008,
	ERR_UNCONNECTED:-10009,
	ERR_UNLOADPUGIN:-10010,
	ERR_FAIL_CONNECT_PLAYER:-10011,
	ERR_RUNNING:-10012,
	ERR_TOKEN_INVALID:-10013,
	ERR_NoSupport:-10014,
	ERR_CLOUD_ERROR:-10015,
	ERR_WebServerNoRun:-10016,
	ERR_UnknowUpgradeType:-10017
}

var CustomVoiceCmd = {
    CVC_START_RECORD:0,
    CVC_STOP_RECORD:1,
    CVC_TEST_RECORD_FILE:2,
    CVC_SEND_RECORD_FILE:3,
    CVC_STOP_TEST:4
};

/*SubEvent*/
var PreviewEvent = {
	SubEventPreviewSelectWndChanged:0,
	SubEventPlayModeInit:1,
	SubEventSingleChnStatus:2,
	SubEventAllChnStatus:3,
	SubEventAutoCheckVersion:4,
	SubEventShowSystemStatus:5,
	SubEventShowPTZElectronic:6,
	SubEventAutoCheckWebVersion:7,
	SubEventShowCorridorMode:8
}
var PlaybackEvent = {
	SubEventPlaybackSelectWndChanged:0,
	SubEventPlaybackStart:1,
	SubEventPlaybackEnd:2,
	SubEventPlaybackPos:3,
	SubEventPlaybackDownloadPos:4,
	SubEventPlaybackDownloadEnd:5,
	SubEventPlaybackLayoutReset:6,
	SubEventPlaybackLayoutReLogin:7
};
var AlarmEvent = {
	SubEventAlarmInfo:0,
	SubEventAlarmInit:1
}
var ClientCofigEvent = {
	SubEventBrowseRecPath:48,
	SubEventBrowseCapPath:49,
	SubEventSavePath:50,
	SubEventLoadClientCofig:51,
	SubEventInitClientConfig:52,
	subEventManualCheckToolVersion:54,
	SubEventManualCheckWebVersion:59,
};
var VoiceCustomEvent={
    SubEventVoiceRecordPos:0,
    SubEventVoiceRecordEnd:1,
    SubEventVoiceSendEnd:2,
    SubEventVoiceTestEnd:3
};
/*notify message:MainEvent*/
var MainEventEnum={
    MainEventPreview:0, //SubEvent:PreviewEvent
    MainEventPlayBlack:1,//SubEvent:PlaybackEvent
    MainEventAlarm:2,   //SubEvent::AlarmEvent
    MainEventUpgrade:3,
    MainEventClient:4,//SubEvent::ClientCofigEvent
    MainEventDisconnet:5,
    MainEventVoiceCustom:6,  //subEvent:VoiceCustomEvent
    MainEventOtherLogin:7,
	MainEventRemoteSearchDev:9
}

var BinaryType={
	TypeChannelTitleDot:0,
	TypeOSDDot:1,
	TypeConfigImport:2
}

var ColorType = {
	ColorBrightness:0,
	ColorContrast:1,
	ColorSaturation:2,
	ColorHue:3,
	ColorDefault:4
}
var UpgradeType = {
	UpgradeTypeUnknow:0,
	UpgradeTypeLocal:1,
	UpgradeTypeOnline:2
}
var UpgradeStatus = {
	UpgradeStatusStop:0,
	UpgradeStatusStart:1,
	UpgradeStatusDown:2,
	UpgradeStatusUpgrade:3,
	UpgradeStatusFinish:4,
	UpgradeStatusAbort:5
}

var FILE_CHUNK_SIZE = 8*1024;
var MAX_PLAY_WND_NUM = 1;
var g_bDebug = true;
let translations = {};
var loadTranslations = function(){};
var t = function(key){return key;};

var WebCms = window.WebCms || {};
WebCms.ensure = function (path, val) {
    var parts = path.split('.');
    var obj = WebCms;
    for (var i = 0; i < parts.length - 1; i++) {
        var k = parts[i];
        if (!obj[k]) obj[k] = {};
        obj = obj[k];
    }
    var last = parts[parts.length - 1];
    if (!obj[last]) obj[last] = val;
};

function getPluginVer(url, data, onSuccess, onError){
    return $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(data || {}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 2000,
        cache: false,
        success: onSuccess || $.noop,
        error: onError || function(xhr) {
        }
    });
}

function compareVersion(a, f) {
	var d = a.split(".");
	var e = f.split(".");
	if (d.length != e.length) {
		return false;
	}
	for (var b = 0; b < d.length; ++b) {
		if (d[b] * 1 < e[b] * 1) {
			return false;
		}
	}
	return true;
}

function isLoadPlugin(){
	if(!compareVersion(version_web,"5.0.0.0")){
		WebCms.plugin.isLoaded = true;
	}else{
		WebCms.plugin.isLoaded = window.g_bLoadPlugin;
	}
}
function getDownloadAddr(){
	if(WebCms.web.embedded){
		WebCms.web.downloadAddr = "";
	}else{
		if(WebCms.web.serveronline && !WebCms.plugin.isLoaded){
			var addr = window.g_webAddr || "https://ocx.jftechws.com/web";
			WebCms.web.downloadAddr = addr + "/" + WebCms.web.webstyle + "/" + WebCms.web.webstyle;
		}else{
			WebCms.web.downloadAddr = "http://"+ WebCms.web.PcIP + ":"+ WebCms.plugin.httpport;
			if(WebCms.web.webstyle != ""){
				WebCms.web.downloadAddr +="/WebStyle_"+ WebCms.web.webstyle;
			}
		}
	}
	return WebCms.web.downloadAddr;
}

WebCms.ensure('plugin.version', "4.0.2.2");
WebCms.ensure('plugin.setupname', window.g_SetupName || "VideoPlayToolSetup");
WebCms.ensure('plugin.downloadaddr', window.downloadAddr || "https://ocx.jftechws.com/ocx/VideoPlayToolSetup.exe");
WebCms.ensure('plugin.httpport', window.g_PluginPort || 54455);
WebCms.ensure('plugin.autopreviewnum', 1);
WebCms.ensure('plugin.isLoaded', !1);
WebCms.ensure('webplayer.downloadAddr', "https://ocx.jftechws.com/web/webplayer");
WebCms.ensure('web.version', version_web);
WebCms.ensure('web.embedded', !window.g_b8M || !1);
WebCms.ensure('web.serveronline', window.g_bServerAccessible || !1);
WebCms.ensure('web.languageList', window.g_defaultLanguageList||"Arabic Brazilian Bulgarian Czech Dansk English Estonian Farsi Finnish French German Greek Hebrew Hungarian Indonesian Italian Japanese Korean Poland Portugal Romanian Russian SimpChinese Spanish Swedish TradChinese Thai Turkey Ukrainian Vietnamese");
WebCms.ensure('web.language', window.g_defaultLanguage || "");
WebCms.ensure('web.oemname', window.g_oemName || "");
WebCms.ensure('web.webstyle', window.g_WebStyle || "Web");
WebCms.ensure('web.visibleForgetPwd', window.g_visibleForgetPwd || !0);
WebCms.ensure('web.visiblePlayBackMenu', window.g_visiblePlayBackMenu || !0);
WebCms.ensure("web.bHLCEnable", window.g_bHLC == true);
WebCms.ensure('web.printlog', !0);
WebCms.ensure('web.PcIP', window.g_PCIP || "127.0.0.1");
isLoadPlugin();
WebCms.ensure('web.downloadAddr', getDownloadAddr());
WebCms.ensure('util.batchloadjs', function batchloadjs(urls, module, cb) {
	var remaining = urls.length,
        head = document.getElementsByTagName('head')[0];
    urls.forEach(function (src, idx) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
		if(g_b8M){
			src = WebCms.web.downloadAddr + "/" + src;
		}
        script.src = src;
        var done = function () {
            if (--remaining === 0 && cb) cb();
        };
        script.onreadystatechange = function () {
            if (this.readyState === 'loaded' || this.readyState === 'complete') {
                this.onreadystatechange = null;
                done();
            }
        };
        script.onload = script.onerror = done;
        head.appendChild(script);
    });
});
WebCms.ensure('util.loadhtml', function(b){
	var c = $.extend({
		webUrl: "",
		callback: function(d) {}
	}, b);
	c.webUrl = WebCms.web.downloadAddr + "/" + b.webUrl;
	$.get(c.webUrl+"?version=" + version_web, "", c.callback, "html")
});
WebCms.ensure('util.loadjs', function(b){
	var c = $.extend({
		webUrl: "",
		callback: function(d) {}
	}, b);
	c.webUrl = WebCms.web.downloadAddr + "/" + b.webUrl;
	$.getScript(c.webUrl+"?version="+version_web+"&SetupName="+WebCms.plugin.setupname).done(c.callback).fail(function(jqxhr, settings, exception) {
		alert("Error : " + b.webUrl + " Style : " + WebCms.web.webstyle);
	});
});
WebCms.ensure('util.downloadJpg', function (url, fileName) {
	$.ajax({
	  url: url,
	  method: 'GET',
	  xhrFields: { responseType: 'blob' },
	  success: function (blob) {
		const blobUrl = URL.createObjectURL(blob);
		$('<a>')
		  .attr({ href: blobUrl, download: fileName })
		  .appendTo('body')[0]
		  .click();
		URL.revokeObjectURL(blobUrl);
	  },
	  error: function () {
	  }
	});
});
WebCms.ensure('util.gettextfile', function getTextFile(url) {
    return $.ajax({
        url: url,
        type: 'GET',
        dataType: 'text',
        cache: false,
        timeout: 2000
    }).then(
        function (text) {
            return text;
        },
        function (xhr) {
            return xhr.statusText || 'Network Error';
        }
    );
});

var TableRightPadding = g_BrowseType == BrowseType.BrowseMSIE ?  17 : 8;

var autoCloseTime = 10;
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(e) {
		var a = this.length;
		var b = -1;
		for (var d = 0; d < a; d++) {
			if (e === this[d]) {
				b = d;
				break
			}
		}
		return b
	}
}
if (!Object.keys) {
	Object.keys = (function() {
		var d = Object.prototype.hasOwnProperty;
		var a = !({
			toString: null
		}).propertyIsEnumerable("toString");
		var b = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable",
			"constructor"
		];
		var e = b.length;
		return function(h) {
			if (typeof h !== "object" && typeof h !== "function" || h === null) {
				throw new TypeError("Object.keys called on non-object")
			}
			var f = [];
			for (var j in h) {
				if (d.call(h, j)) {
					f.push(j)
				}
			}
			if (a) {
				for (var g = 0; g < e; g++) {
					if (d.call(h, b[g])) {
						f.push(b[g])
					}
				}
			}
			return f
		}
	})()
}
if (!window.console) {
	var c = {};
	c.log = c.warn = c.debug = c.info = c.error = c.assert = function() {};
	window.console = c
}

function AutoClose(b, a) {
	a = a == void 0 ? 0:a;
	autoCloseTime--;
	MasklayerShow();
	if (autoCloseTime <= 0) {
		if(a == 2){
			if (g_BrowseType == BrowseType.BrowseMSIE) {
				window.opener = null;
				window.open("", "_self", "");
				window.close();
			} else {
				window.location.href = "about:blank";
				window.close();
			}
		}else{
			//计时结束后关闭当前页面
			window.location.href = "about:blank";
			window.close();
		}
	} else {
		var tip = "IDS_DVR_REBOOT";
		if(a == 2){
			tip = "IDS_DEVICE_CHANGED";
		}
		var tip2 ="IDS_LATER_START";
		if (g_BrowseType != BrowseType.BrowseMSIE) {
			tip2 = "IDS_LATER_RELOGIN";
		}
		ShowPaop(b, lg.get(tip) + " " + autoCloseTime.toString() + " " + lg.get(tip2));
		window.setTimeout(function() {
			AutoClose(b, a)
		}, 1000)
	}
}

function DivBox(a, b, val) {
	var d = $(b);
	if (typeof a == "string" && ($(a).prop("checked") * 1 != 1) || (typeof a == "number" && a == 0)) {
		d.find("select").prop("disabled", true);
		d.find("div").prop("disabled", true);
		d.find("input").prop("disabled", true);
		d.children().prop("disabled", true);
		if (d.css("display") != "none") {
			if(val == null) val = 0.6;
			d.stop().fadeTo("slow", val);
		}
		d.find("button").prop("disabled", true).addClass("btn-disable")
		d.find(".psw_eye_arc").css("display", "none")
		d.find(".psw_eye_cicle").attr("status", "")
		if(g_BrowseType == BrowseType.BrowseChrome || g_BrowseType == BrowseType.BrowseOpera){
			d.find("input.PswEyeShow").attr("style", "-webkit-text-security:disc");
		}else{
			d.find("input.PswEyeShow").attr("type", "password");
		}
	} else {
		d.find("select").prop("disabled", false);
		d.find("div").prop("disabled", false);
		d.find("input").prop("disabled", false);
		if (d.css("display") != "none") {
			d.stop().fadeTo("slow", 1, function() {
			});
		}
		d.children().prop("disabled", false);
		d.find("button").prop("disabled", false).removeClass("btn-disable")
	}
	d = null
}

function DivBox_Net(a, b) {
	var d = $(b);
	if (typeof a == "string" && ($(a).attr("data") * 1 != 1) || (typeof a == "number" && a == 0)) {
		d.find("select,input,textarea").prop("disabled", true);
		d.children().prop("disabled", true);
		d.find("div[data]").prop("disabled", true);
		if (d.css("display") != "none") {
			d.stop().fadeTo("slow", 0.6)
		}
		d.find("button").prop("disabled", true).addClass("btn-disable")
		d.find(".psw_eye_arc").css("display", "none")
		d.find(".psw_eye_cicle").attr("status", "")
		if(g_BrowseType == BrowseType.BrowseChrome || g_BrowseType == BrowseType.BrowseOpera){
			d.find("input.PswEyeShow").attr("style", "-webkit-text-security:disc");
		}else{
			d.find("input.PswEyeShow").attr("type", "password");
		}
	} else {
		d.find("select,input,textarea").prop("disabled", false);
		if (d.css("display") != "none") {
			d.stop().fadeTo("slow", 1, function() {
			})
		}
		d.children().prop("disabled", false);
		d.find("div[data]").removeProp("disabled");
		d.find("button").prop("disabled", false).removeClass("btn-disable")
	}
	d = null
}

function EnableButton(a, b){
	if($(b).css("display") == "none"){
		return;
	}
	$(b).prop("disabled", a == 0 ? true : false);
	if (a == 0) {
		$(b).stop().addClass("btn-disable").fadeTo("slow", 0.4)
	} else {
		$(b).stop().removeClass("btn-disable").fadeTo("slow", 1)
	}
}

Date.prototype.Format = function(a) {
	var d = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		S: this.getMilliseconds()
	};
	if (/(y+)/.test(a)) {
		a = a.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
	}
	for (var b in d) {
		if (new RegExp("(" + b + ")").test(a)) {
			a = a.replace(RegExp.$1, (RegExp.$1.length == 1) ? (d[b]) : (("00" + d[b]).substr(("" + d[b]).length)))
		}
	}
	return a
};

function InitButton() {
	$("input[data],div[data]").each(function() {
		if ($(this).attr("data") * 1 == 1) {
			$(this).removeClass("switch").addClass("selectEnable")
		} else {
			$(this).addClass("switch")
		}
	})
}

function ChangeBtnState() {
	$("input[data],div[data]").click(function() {
		if ($(this).attr("data") == "0") {
			$(this).removeClass("switch").addClass("selectEnable").attr("data", "1")
		} else {
			$(this).removeClass("selectEnable").addClass("switch").attr("data", "0")
		}
	})
}
function InitButton2() {
	$("input[data],div[data]").each(function() {
		if ($(this).attr("data") * 1 == 1) {
			$(this).removeClass("selectDisable").addClass("selectEnable");
		} else {
			$(this).removeClass("selectEnable").addClass("selectDisable");
		}
	})
}
function ChangeBtnState2() {
	$("input[data],div[data]").click(function() {
		if ($(this).attr("data") == "0") {
			$(this).removeClass("selectDisable").addClass("selectEnable").attr("data", "1");
		} else {
			$(this).removeClass("selectEnable").addClass("selectDisable").attr("data", "0");
		}
	})
}
function MasklayerShow(hideTip) {
	hideTip = hideTip == void 0?0:hideTip;
	var a = document.getElementById("MaskLayout");
	a.style.width = document.body.offsetWidth + "px";
	a.style.height = document.body.offsetHeight + "px";
	a.style.display = "block";
	var iframe = document.getElementById('MaskLayout');
	var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
	if(hideTip) iframedoc.getElementById("WaitTip")&&(iframedoc.getElementById("WaitTip").style.display= "none");
	else iframedoc.getElementById("WaitTip") && (iframedoc.getElementById("WaitTip").style.display= "");
}

function MasklayerHide() {
	var a = document.getElementById("MaskLayout");
	a.style.display = "none"
}

function CheckPwdFormat(e) {
	var nun = 0;
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
	if (e.match(/\d/g)) nun++;  //判断是否有数字
	if (e.match(/[a-z]/ig)) nun++; //判断是否有字母
	if (pattern.test(e)) nun++; //判断是否有符号

	if(nun > 1){
		return true;
	}else{
		return false;
	}

};
var g_showPaopTimer = -1;
function ShowPaop(b, a) {
	if(g_showPaopTimer != -1)clearTimeout(g_showPaopTimer);
	$("#PopPormptTitle").html(b);
	$("#PopPormptContant").html(a);
	var a =  GetPageOffset();
	$("#PopPormptBox").css("display", "");
	if ($("#PopPormptBox").attr("name") != "in"){
		$("#PopPormptBox").slideDown("slow").attr("name", "in");
	}
	g_showPaopTimer = setTimeout(function(){
		HidePaop();
	}, 3000);
}
function HidePaop(){
	$("#PopPormptBox").fadeOut("slow").slideUp("slow", function(){
		$(this).css("display", "none");
	}).attr("name", "out");
}
var g_webPromptTimmer = -1;
function Web_prompt(b, a) {
	MasklayerHide();
	if (b == "" || b == null || b == "undefined") {
		b = ""
	}
	if ($("#Web_false").length) {
		$("#Web_false").html(b).css("color", "red")
	}
	if (g_webPromptTimmer != -1) {
		clearTimeout(g_webPromptTimmer)
	}
	if (a) {
		$("#Web_false").fadeIn("slow");
		g_webPromptTimmer = setTimeout('$("#Web_false").fadeOut("slow")', 5000)
	} else {
		$("#Web_false").fadeIn("fast")
	}
}

function forbidSelect() {
	var a = event.srcElement;
	if (!((a.tagName == "INPUT" && a.type.toLowerCase() == "password") || (a.tagName == "INPUT" && a.type.toLowerCase() ==
			"text") || a.tagName == "TEXTAREA")) {
		return false
	}
	return true
}

function keyboardFilter(a) {
	a = a || window.event;
	if (!a.srcElement) {
		a.srcElement = a.target
	}
	if ((a.keyCode >= 37 && a.keyCode <= 40) || (a.keyCode == 8) || (a.keyCode == 9)) {
		return false
	}
	return true
}

function NumberRangeMax(b, e) {
	var pnumber = $(b).val();
	if (!/^[1-9]\d*$/.test(pnumber)) {
		var tmp = /^[1-9]\d*/.exec($(b).val());
		if(tmp == null){
			tmp = 1;
		}
		$(b).val(tmp);
	}

	var d = $(b).val() * 1;
	if (d > e) {
		$(b).val(e);
	}else{
		$(b).val(d);
	}
}

function NumberRangeMaxEx(b, e) {
	var pnumber = ($(b).val()).replace(/\D/g, "");
	if(pnumber != ""){
		var d = pnumber * 1;
		if (d > e) {
			$(b).val(e);
		}else{
			$(b).val(d);
		}
	}else{
		$(b).val("");
	}
}

function NumberRangeMin(b, e) {
	var d = ($(b).val()).replace(/\D/g, "") * 1;
	if (d < e) {
		$(b).val(e);
	}else{
		$(b).val(d);
	}
}

function NumberRange(b, s, e, d){
	var a = ($(b).val()).replace(/\D/g, "") * 1;
	if(a < s){
		var n = d == -1?s:d;
		$(b).val(n);
	}else if(a > e){
		var n = d == -1?e:d;
		$(b).val(n);
	}else{
		$(b).val(a);
	}
}

function FloatRange(b,s,e,d){
	var a = $(b).val();
	a = a.replace(/[^\d\.]/g,'');
	a = a.replace(/^\./g,'');
	a = a.replace(/\.{2,}/g,'.')*1;
	if(a*1.0 < s){
		var n = d == -1?s:d;
		$(b).val(n);
	}else if(a*1.0 > e){
		var n = d == -1?e:d;
		$(b).val(n);
	}
}

function prefixInteger(b, a) {
	return (Array(a).join("0") + b).slice(-a)
}

function recChannel(m, o, l, d, h) {
	var d = d == void 0 ? gDevice.loginRsp.ChannelNum:d,
		j = false,
		e = o;
	var	m = m;
	if (gDevice.devType != devTypeEnum.DEV_IPC) {
		j = true;
	}
	var rowNum = 16;
	var k = {
		number: d,
		bkColor: e,
		borderColor: l,
		ExType: true,
		parentLev: 1,
		activeTextClr: "#FFFFFF",
		rowNum: rowNum,
		bAlarm: true,
		bDownID:m
	};
	if (h) {
		k.bDisabled = true
	}
	var a = $("#" + m);
	a.divBox(k);
	if (j) {
		$("#" + m + " > div[name='all']").click(function() {
			var all = a.find("div[name='all']");
			var id = $(this).prop("id");
			
			var color = gVar.skin_mColor;
			var bCheck = ($(this).css("background-color").replace(/\s/g, "") == e.replace(/\s/g, "") && $(this).css("display") != "none") ? true : false;
			var i = 0;
			for(i; i < all.length; i++){
				if(id == all.eq(i).prop("id")){
					break;
				}
			}
				
			var b = a.find("div[name!='all']");
			for(var j = i * rowNum; j <= i * rowNum + (rowNum - 1); j++){
				if(b.eq(j).attr("status") == "disabled")
					continue;
				if(bCheck){
					b.eq(j).css({
						"background-color": e,
						color: "#FFFFFF"
					});
				}else{
					b.eq(j).css({
						"background-color": "transparent",
						color: "inherit"
					});
				}
			}
		});
	}

	$("#" + m + " > div[name!='all']").mousedown(function() {
		if(d >= rowNum){
			b(j)
		}
	}).mouseover(function() {
		if(d >= rowNum){
			b(j)
		}
	});

	function b(p) {
		if (p) {
			var all = a.find("div[name='all']");
			var s = [true, true, true, true];
			$("#" + m + " > div[name!='all']").each(function(t) {
				if ($(this).css("background-color").replace(/\s/g, "") != e.replace(/\s/g, "")
				 && $(this).attr("status") != "disabled") {
					s[parseInt(t/rowNum)] = false;
				}
				if(t%rowNum == (rowNum - 1)){
					var u = parseInt(t/rowNum)
					if(s[u]){
						all.eq(u).css({
							"background-color": e,
							color: "#FFFFFF"
						});
					}else{
						all.eq(u).css({
							"background-color": "transparent",
							color: "inherit"
						});
					}
				}
			});
		}
	}
}

$.fn.extend({
	BtnDisable: function() {
		$(this).mouseover(function() {
			$(this).css({
				cursor: "auto",
				"background-color": "#252525",
				color: "#353535"
			})
		}).mouseout(function() {
			$(this).css({
				cursor: "auto",
				"background-color": "#252525",
				color: "#353535"
			})
		});
		$(this).mouseout()
	},
	BtnEnable: function() {
		$(this).mouseover(function() {
			$(this).css({
				cursor: "pointer",
				"background-color": "#32A0E1",
				color: "#353535"
			})
		}).mouseout(function() {
			$(this).css({
				"background-color": "#1e3b56",
				color: "#e6ebf0"
			})
		});
		$(this).mouseout()
	}
});

function CheckPageControl(b, a) {
	return (((gDevice.loginRsp.PageControl >> b) & 1) == a)
}

function setLigerGridSize(d, g) {
	var b = 0;
	var f = 0;
	var a = {};
	var e = 0;
	if (g_BrowseType == BrowseType.BrowseSafari || g_BrowseType == BrowseType.BrowseChrome) {
		e = 1
	}
	$("#" + d + " .l-grid2 .l-grid-header-table .l-grid-hd-cell").each(function() {
		var h = $(this);		
		if (h.css("display") != "none" && $(h).attr('class').indexOf("l-grid-hd-cell-mul") == -1) {
			b = b + parseInt(h.css("width"))
		}
		e++;
		h = null
	});
	b = b + e;
	f = $(g).width() * 1;
	if (b > f - 50) {
		b = f - 50
	}
	a = b;
	return a
}

function DataLength(a) {
	var d = 0;
	for (var b = 0; b < a.length; b++) {
		if ((a.charCodeAt(b) < 0) || (a.charCodeAt(b) > 255)) {
			d = d + 2
		} else {
			d = d + 1
		}
	}
	return d
}

function keeplength(b, a) {
	while (DataLength(b) > a) {
		b = b.substr(0, b.length - 1)
	}
	return b
}

function limitInputLength(b, a) {
	var d = $(b).val();
	if (DataLength(d) > a) {
		$(b).val(keeplength(d, a))
	}
}

function letterFourCheck(p) {
	var l = p;
	var k = "!@#$%^&*()_+{}|:\"\\<>?~`-=[]|;',./ ";
	var h = false;
	for (var m = 0; m < k.length; m++) {
		var a = k[m];
		if (l.indexOf(a) != -1) {
			h = true;
			break
		}
	}
	var s = /[A-Z]+/g;
	var d = l.match(s);
	var n = /[a-z]+/g;
	var o = l.match(n);
	var q = /[0-9]+/g;
	var j = l.match(q);
	var b = 0;
	var g = 0;
	var r = 0;
	var e = 0;
	if (h) {
		b = 1
	}
	if (d) {
		g = 1
	}
	if (o) {
		r = 1
	}
	if (j) {
		e = 1
	}
	var f = b + g + r + e;
	return f
}

function formatDate(j) {
	var a, i, h, d, f, e, b;
	if (!Array.isArray(j)) {
		var g = (j + ((new Date()).getTimezoneOffset() * 60)) * 1000;
		a = new Date(g);
		i = a.getFullYear();
		h = a.getMonth() + 1;
		d = a.getDate();
		f = a.getHours() < 10 ? "0" + a.getHours() : a.getHours();
		e = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
		b = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds()
	} else {
		i = j[0] + 2000;
		h = j[1];
		d = j[2];
		f = j[3] < 10 ? "0" + j[3] : j[3];
		e = j[4] < 10 ? "0" + j[4] : j[4];
		b = j[5] < 10 ? "0" + j[5] : j[5]
	}
	return i + "-" + h + "-" + d + "   " + f + ":" + e + ":" + b
}

function fixedNumber(e, d) {
	var a = 1;
	for (var b = 0; b < d; b++) {
		a = a * 10
	}
	return (Math.floor(e * a) / a)
}

function GetTimeVal(el){
	var tmp = $(el).val() * 1;
	if(tmp <= 9){
		return '0' + tmp;
	}else{
		return tmp;
	}
}

function DebugStringEventFunc(a) {
	if(WebCms.web.printlog == 0){
		return;
	}
	var debugstr = a;
	if(typeof a == "object"){
		debugstr = JSON.stringify(a);
	}
	if (window.console) {
		window.console.log("PluginDebugInfo:" + debugstr)
	}
}
DebugStringEvent = DebugStringEventFunc;