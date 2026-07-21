//# sourceURL=class.js
function HashmapCom() {
	b(this);

	function b(c) {
		c.map = new a()
	}

	function a() {
		this.length = 0;
		this.set = function(c, d) {
			this[c] = d;
			this[this.length] = c;
			this.length++
		};
		this.up = function(c, d) {
			(typeof this[c] != "undefined") ? (this[c] = d) : alert("hashmap: key " + c + " undefined")
		};
		this.get = function(c) {
			return ((typeof this[c] == "undefined") ? c : this[c])
		}
		this.getEx = function(c) {
			return ((typeof this[c] == "undefined" || c == "0") ? c : this[c])
		}
	}
	this.refresh = function() {
		this.map = null;
		this.map = new a();
		this.map.length = 0;
	};
	this.clear = function() {
		delete this.map
	};
	this.length = function() {
		return (this.map.length)
	};
	this.set = function(c, d) {
		this.map.set(c, d)
	};
	this.get = function(c) {
		return (this.map.get(c))
	};
	this.up = function(c, d) {
		this.map.up(c, d)
	}
	this.getEx = function(c) {
		return (this.map.getEx(c))
	};
}

function AlarmCenter(){
	this.bOpen = false;
	this.bStop = false;
	this.url = null;
}
AlarmCenter.prototype.OpenAlarmChannel = function(ip, httpPort, salt, callback){
	var isIPv6 = ip.indexOf("[") == -1 ? false : true;
	if(isIPv6 && g_BrowseType == BrowseType.BrowseMSIE){	 	// UNC 和 IPV6地址兼容 (IE问题)
		var st = ip.indexOf("[");
		var ed = ip.indexOf("]");
		var temp = ip.substr(st + 1, ed - 1);
		temp = temp.split(':').join('-');
		ip = temp + ".ipv6-literal.net";
	}
	var ptr = this;
	if(window.location.protocol.indexOf("https:") != -1){
		ptr.url = "wss://"+ ip;
	} else {
		ptr.url = "ws://"+ ip;
	}
	if(httpPort != 80) ptr.url += ":" + httpPort;
	ptr.url +="/websocket-bin/Type=Alarm?Salt="+salt;
	ptr.wsSocket = new WebSocket(ptr.url);
	ptr.wsSocket.onopen = function (msg) {
		ptr.bOpen = true;
		callback && callback({Ret:WEB_ERROR.RR_SUCESS});
	}
	ptr.wsSocket.onmessage = function (msg) {
		var a =gNet.isAesEncrypt?JSON.parse(AesDecrypt(msg.data,gNet.aesKeyAndIv)): JSON.parse(msg.data);
		if(typeof a === "object" && a[a.Name].Status == "Start"){
//			if($("#alarm").attr("data-name") != "notLoad"){
				a.MainEvent = MainEventEnum.MainEventAlarm;
				a.SubEvent = AlarmEvent.SubEventAlarmInfo;
				AlarmInfoEventCallBack(a);
//			}
		}
	}
	ptr.wsSocket.onclose = function(event){
		ptr.bOpen = false;
		ptr.bStop = false;
		ptr.url = null;
	}
	ptr.wsSocket.onerror = function (error) {
	};
}
AlarmCenter.prototype.CloseAlarmChannel = function(){
	if(this.wsSocket){
		if(this.wsSocket.readyState == 1 || this.wsSocket.readyState == 0){
			this.wsSocket.close();
		}else if(this.wsSocket.readyState == 3 || this.wsSocket.readyState == 2){
		}
	}
}

function CGIClass(canvas){
	this.bInit = false;
	this.Salt = null;
	this.Sign = null;
	this.initUrl = "/cgi-bin/";
	this.randomData = "";
	this.run = false;
	this.alarmCenter;
	this.downloadWorker=[];
	this.decodeWorker = [];
	this.parserWorker = [];
	this.m_bStartAlarm = false;
	this.m_LastErrCode = WEB_ERROR.ERR_UNKNOW;
	this.canvas = canvas;
	this.isAesEncrypt=false;
	this.isGetKey=false;
	this.aesKeyAndIv;
	this.playtype = PlayType.TypeNoPlay;
	this.m_playstatus = [];
	this.streamPerWnd = [];
	this.channelPerWnd = [];//每个窗口对应的通道
	this.callback = null;
	
	this.fileInfo = null;
	this.renderCallback = null;
	this.talker = null;
	this.pcmPlayer = null;
	this.bRangeEnble = false;
	this.mousePosX = -1;
	this.mousePosY = -1;
	this.bMouseDown = false;
	this.oldDigitRange = {left:0, top:0, right:0, bottom:0};
	this.interval=null;
	this.speed = 4;
    this.playBackSpeed = 1.0;
	this.nTimeTotal = 0;
	this.nPauseFlag = 0;
	this.wndNum = MAX_PLAY_WND_NUM;
	this.talkParam = {};
	this.m_bDownDataEnd = false;
	this.nCurWnd = 0;
	this.bLogin = false;
	this.PTZTimerId=-1;
	this.UpgradeStatus = UpgradeStatus.UpgradeStatusStop;
	this.UpgradeType = UpgradeType.UpgradeTypeUnknow;
	this.init = function(){
		var h = this;
		for(var i = 0; i < h.wndNum; i++){
			h.m_playstatus[i] = PlayStatus.StatusNoPlay;
			h.channelPerWnd[i] = -1;
		}
		h.alarmCenter = new AlarmCenter();
		/* a使用哪个cgi命令 b 表示数据 c 表示同步方式 d 函数 k超时时间*/
		h.sendRequest = function(a, b, c, d, k,y){
			d == void 0 && (d = function(f,g) {});
			k == void 0 && (k = 8000);
			if(h.run) {
				DebugStringEvent("sendRequest running");
				var ret = {"Name":"","Ret":WEB_ERROR.ERR_RUNNING};
				d(ret,"");
				return false;
			}
			h.run = true;
			var req = JSON.stringify(b);
			DebugStringEvent(req);
			if (y) {
				req = AesEncrypt(req, gNet.aesKeyAndIv);
			}
			if(h.request != null)
			  h.request.abort();
			  var contentType =y?"text/plain":"application/x-www-form-urlencoded";
			  if(!g_bDebug) contentType=y?"text/plain":"application/json";
			h.request = $.ajax({
				type: "post",
				url: h.initUrl + a + ".cgi",
				data: req,
				contentType:contentType + ";charset=utf-8",
				datatype: y?"text":"json",
				async:c,
				timeout:k,
				dataFilter:function(f){
					if (typeof f == "string") {
						f = f.replace(/\n/g, "");
						f = f.replace(/\r/g, "");
					}
					if(y){
						var o = JSON.parse(f);	//针对一些字符串长度比较大，设备返回字符串不加密的情况（如获取64个通道的"Record"配置）
						if(typeof o == "object" && o.Name != ""){ 
							return f;
						}
						f=AesDecrypt(f, gNet.aesKeyAndIv);
					}
					return f;
				},
				success: function(f,g) {
					h.run = false;
					var result = f;
					if(typeof f == "string"){
						DebugStringEvent("[success]"+f);
						result = JSON.parse(f);					
					}else{
						DebugStringEvent("[success]"+JSON.stringify(f));
					}
					d(result,g);
				},
				error: function(f,g) {
					h.run = false;
					var ret = {"Name":"","Ret":-1};
					if(g == "timeout"){
						ret.Ret = -2;
					}
					DebugStringEvent("[error]"+JSON.stringify(ret));
					d(ret,g);
				}
			});
			return true;
		}
		h.SendRequestV2 = function (a, b, c, d, k) {
			if ((a != "resetpwd") && h.Salt == null) {
				var msg = { "Name": "", "Ret": WEB_ERROR.ERR_SALT_INVALID };
				d(msg);
				return;
			} else if(a != "resetpwd" ){
				b.Salt = h.Salt;
			}
            var m = gNet.isAesEncrypt;
            if(a === "upgrade" || a === "cldupgrade"){
                m = false;
            }
			h.sendRequest(a, b, c, d, k, m);
		}
		h.bInit = true;
	}
}

CGIClass.prototype.CgiLogin = function(ip, port, username,password,callback){
	var self = this;
	self.m_bStartAlarm = !1;
	gNet.isAesEncrypt = false;
	self.sendRequest("login",{"Name":"GetSalt"}, true, function(a){
		if(a.Ret == 100){
			self.Salt = a.Salt;
			var user = username;
			var obj = {"Name":"Login"};
			if(a.LoginEncryptionType.indexOf("RSA") >= 0){
				var PublicKeyInfo = a.PublicKey;
				var Pubres =PublicKeyInfo.split(",");
				var rsa = new RSAKey();
				rsa.setPublic(Pubres[0],Pubres[1]);
				self.Sign = rsa.encrypt(gOemInfo.oemHeader+a.Salt+hex_md5(password));
				user = rsa.encrypt(username);
				obj.LoginEncryptionType = "RSA";
				self.randomData = new Uint16Array(48);
				var hexData = "";
				for(var i =0; i < 48;i++){
					self.randomData[i] = randomNum(1,256)-1;
					hexData += toHex(self.randomData[i],2);
				}
				obj.VERK = rsa.encrypt(hexData);
				if(a.DataEncryptionType == "AES"){
					gNet.aesKeyAndIv = {};
					gNet.aesKeyAndIv.key = randomASCII16();
					gNet.aesKeyAndIv.iv = "";
					obj.DTAK = rsa.encrypt(gNet.aesKeyAndIv.key);
				}
			}else{
				self.Sign = MD5_8(a.Salt + gOemInfo.oemHeader + MD5_8(password));
				obj.LoginEncryptionType = "MD5_8";
			}
			obj.User = user;
			obj.Sign = self.Sign;
			self.SendRequestV2("login",obj, true, function(b){
				if(b.Ret == 100){
					gNet.isAesEncrypt = a.DataEncryptionType == "AES" ? true : false;
					self.bLogin = true;
					self.alarmCenter.OpenAlarmChannel(ip, port,self.Salt,function(c){
						if(c.Ret == WEB_ERROR.ERR_SUCESS){
							self.m_bStartAlarm = !0;
						}
					});
				}
				callback(b);
			});
		}else{
			callback(a);
		}
	},null,gNet.isAesEncrypt);
	for(var i =0;i < this.wndNum;i++){
		this.m_playstatus[i] = PlayStatus.StatusNoPlay;
		this.channelPerWnd[i] = -1;
	}
}

CGIClass.prototype.LogoutCgi = function(callback){
	var self = this;
	if(self.bLogin){
		if(self.m_bStartAlarm){
			var obj = {"Name" : "Alarm","Alarm" : {"Opr" : "Stop"}}
			obj.SessionID = "0x"+toHex(gDevice.nSessionID,8);
			self.SendRequestV2("websocket", obj, true, function(a,b){
				DebugStringEvent("Alarm stop");
				self.alarmCenter.CloseAlarmChannel();
				setTimeout(function(){
					var b = {"Name":"Logout"};
					self.SendRequestV2("login",b, true, function(a){
						self.Salt = null;
						self.bLogin = false;
						callback(a);
					}, 2000);
				}, 500);
			}, 2000);
		}else{
			var b = {"Name":"Logout"};
			this.SendRequestV2("login",b, true, function(a){
				self.Salt = null;
				self.bLogin = false;
				callback(a);
			});
		}
	}else{
		self.bLogin = false;
		var msg = {"Name":"","Ret":WEB_ERROR.ERR_SUCESS};
		callback(msg);
	}
}

CGIClass.prototype.SendStrMsg = function(id,name,callback){
	var cmd = "";
	var timeout = 8000;
	if(id == WSMsgID.WsMsgID_ABILITY_GET){
		cmd = "getability";
	}else if(id == WSMsgID.WsMsgID_SYSINFO_REQ){
		cmd = "getinfo";
	}else if(id == WSMsgID.WsMsgID_CONFIG_GET || id == WSMsgID.WsMsgID_CONFIG_CHANNELTILE_GET){
		cmd = "getconfig";
	}else if(id == WSMsgID.WSMsgID_TIMEQUERY_REQ || id== WSMsgID.WsMsgID_CONFIG_EXPORT_REQ){
		cmd = "opdev";
		if(id== WSMsgID.WsMsgID_CONFIG_EXPORT_REQ){
			timeout = 20000;
		}
	}else if(id == WSMsgID.WSMsgID_USERS_GET ||id == WSMsgID.WSMsgID_GROUPS_GET || 
	id == WSMsgID.WSMsgID_FULLAUTHORITYLIST_GET){
		cmd = "usermanager";
	}else if(id == WSMsgID.WSMsgID_CHANNEL_ABILITY_GET_REQ){
		cmd = "getchannelability";
	}else if(id == WSMsgID.WsMsgID_LOG_EXPORT_REQ){
		cmd = "getlog";
		timeout = 20000;
	}else if(id == WSMsgID.WsMsgID_DEFAULTCONFIG_GET){
		cmd = "getdefault";
	}
	if(cmd != ""){
		var b = {
			"Name" : name
		};
		b.SessionID = "0x"+toHex(gDevice.nSessionID,8);
		this.SendRequestV2(cmd, b, true, callback, timeout);
	}else{
		DebugStringEvent("WSMsgID="+id+"no support");
	}
}

CGIClass.prototype.SendObjMsg = function(id,obj,callback){
	var cmd = "";
	var timeout = 8000;
	if(id == WSMsgID.WsMsgID_CONFIG_SET || id == WSMsgID.WsMsgID_CONFIG_CHANNELTILE_SET
	|| id == WSMsgID.WSMsgID_SET_INTELL_ALL_INFO_REQ){
		cmd = "setconfig";
		if(id == WSMsgID.WsMsgID_CONFIG_SET){
			timeout = 60000;
			if(obj.Name == "NetWork.NetCommon"){
				timeout = 15000;
			}
		}
	}else if(id == WSMsgID.WSMsgID_SYSMANAGER_REQ || id == WSMsgID.WSMsgID_DSIKMANAGER_REQ
	|| id == WSMsgID.WsMsgID_SYSTEM_DEBUG_REQ){
		cmd = "opdev";
		if(id == WSMsgID.WSMsgID_DSIKMANAGER_REQ){
			timeout = 180000;
		}
	}else if(id == WSMsgID.WSMsgID_LOGSEARCH_REQ){
		cmd = "getlog";
		timeout = 15000;
	}else if(id == WSMsgID.WSMsgID_MODIFYUSER_REQ || id == WSMsgID.WSMsgID_ADDUSER_REQ
	|| id == WSMsgID.WSMsgID_DELETEUSER_REQ || id == WSMsgID.WSMsgID_MODIFYPASSWORD_REQ 
	|| id == WSMsgID.WSMsgID_ADDGROUP_REQ || id == WSMsgID.WSMsgID_MODIFYGROUP_REQ || id==WSMsgID.WSMsgID_DELETEGROUP_REQ){
		cmd = "usermanager";
	}else if(id == WSMsgID.WsMsgID_AUTHORIZATION){
		cmd = "resetpwd";
	}else if(id == WSMsgID.WSMsgID_NET_MAILTEST_REQ || id == WSMsgID.WSMsgID_NET_FTPTEST_REQ
	|| id == WSMsgID.WSMsgID_SET_DIG_IP_REQ || id == WSMsgID.WsMsgID_CONFIG_SCALTWOLENS
	|| id == WSMsgID.WSMsgID_SET_IPC_REBOOT_REQ || id == WSMsgID.WSMsgID_OSD_MENU){
		cmd = "opcontrol";
		if(id == WSMsgID.WSMsgID_NET_MAILTEST_REQ){
			timeout = 15000;
		}
	}else if(id == WSMsgID.WSMsgID_GET_INTELL_ABILITY){
		cmd = "getability";
	}else if(id == WSMsgID.WSMsgID_GET_INTELL_INFO_REQ || id == WSMsgID.WSMsgID_GET_IPC_SYSINFO_REQ){
		cmd = "getconfig";
	}else if(id == WSMsgID.WSMsgID_NET_LOCALSEARCH_REQ || id == WSMsgID.WSMsgID_FLOW_REQ){
		cmd = "getinfo";
		timeout = 30000;
	}else if(id == WSMsgID.WsMsgID_UPGRADE_REQ){
		cmd = "upgrade";
	}
	if(cmd != ""){
		obj.SessionID = "0x"+toHex(gDevice.nSessionID,8);
		this.SendRequestV2(cmd, obj, true, callback, timeout);
	}else{
		DebugStringEvent("WSMsgID="+id+" no support");
	}
}

CGIClass.prototype.SendBinaryData = function(nType, nParam1, nParam2, nParam3, Data, callback) {
	var obj = {
		"DataType" : "BinaryBase64"
	};
	var cmd = "";
	if(nType == BinaryType.TypeChannelTitleDot || nType == BinaryType.TypeOSDDot){
		var buf = new Uint8Array(Data.length+16);
		buf[0] = nParam1 & 0xff;
		buf[1] = ((nParam1 & 0xff00)>> 8);
		buf[2] = (nParam3*nParam2) & 0xff;
		buf[3] = (((nParam3*nParam2) & 0xff00)>> 8);
		buf.set(Data,16);
		var str = bytesToBase64(buf);
		DebugStringEvent(str);
		if(nType == BinaryType.TypeChannelTitleDot){
			obj.Name = "SetChannelTitleDot";
		} else{
			obj.Name = "SetOSDINFODot";
		}
		obj.Data = str;
		cmd = "setconfig";
	}else if(nType == BinaryType.TypeConfigImport){
		var str = bytesToBase64(Data);
		DebugStringEvent(str);
		obj.Name = "ConfigImport";
		obj.Data = str;
		cmd = "opdev";
	}
	obj.SessionID = "0x"+toHex(gDevice.nSessionID,8);
	this.SendRequestV2(cmd, obj, true, callback);
}

CGIClass.prototype.PTZcontrol = function(nCmdType, nCh, nParam1, nParam2, nParam3, callback) {
	var szCmd = "";
	var szMenuOpts = "Enter";
	var nPreset = 0;
	var nTour = 0;
	var nStep = 0;
	var szNormalCmd = ["DirectionUp", "DirectionDown", "DirectionLeft", "DirectionRight", 
							"DirectionLeftUp", "DirectionLeftDown", "DirectionRightUp", "DirectionRightDown",
							"ZoomWide", "ZoomTile", "FocusFar", "FocusNear", "IrisLarge", "IrisSmall" /*, "Menu"*/];
	var szPresetCmd = ["SetPreset", "ClearPreset", "GotoPreset"];
	var  szTourCmd = ["AddTour", "DeleteTour", "StartTour", "StopTour", "ClearTour"];
	if (nCmdType >=0 && nCmdType <= 7){				//方向控制：nParam1为步长; nParam2为是否停止,1停止,0打开
		szCmd = szNormalCmd[nCmdType];
		nStep = nParam1;
		nPreset = nParam2 == 1 ? -1 : 65535;
	}else if(nCmdType >= 8 && nCmdType <= 13){		//变倍、变焦、光圈：nParam1为步长; nParam2为是否停止,1停止,0打开
		szCmd = szNormalCmd[nCmdType];
		nStep = nParam1;
		nPreset = nParam2 == 1 ? -1 : 65535;
	
	}/*else if(14 == nCmdType) {						// OSD菜单
		szCmd = szNormalCmd[nCmdType];
		nStep = nParam1;
		nPreset = nParam2 == 1 ? -1 : 65535;
	}*/else if (nCmdType >= 17 && nCmdType <= 19){	//预置点设置：nParam1为预置点
		szCmd = szPresetCmd[nCmdType-17];
		nPreset = nParam1;
	}else if(nCmdType == 26 || nCmdType == 27){		//加入、删除预置点到巡航：nParam1为巡航线路值，nParam2为预置点值,nParam3为时间间隔
		szCmd = szTourCmd[nCmdType-26];
		nTour = nParam1;
		nPreset = nParam2;
		nStep = nParam3;
	}else if(nCmdType >= 28 && nCmdType <= 30){		//开始、结束、清除巡航：nParam1为巡航线路值
		szCmd = szTourCmd[nCmdType-26];
		nTour = nParam1;
	}else {
		return;
	}
	var obj = {
		"Name" : "OPPTZControl",
		"OPPTZControl" : {
			"Command" : szCmd,
			"Parameter":{
				"AUX": {"Number":0, "Status":"On"},
				"Channel" : nCh,
				"MenuOpts" : "Enter",
				"POINT" : {"bottom":0, "left":0, "right":0, "top":0},
				"Pattern": "SetBegin",
				"Preset": nPreset,
				"Step":nStep,
				"Tour":nTour
			}
		}
	};
	var that = this;
	(function (nChannel, callback) {
		//关闭消费类IPC云台镜像翻转功能改成true
		if (false) {
			callback({ FlipOperation: false, MirrorOperation: false });
		}
		if (nCmdType < 8 /*|| nCmdType == 14 */) {
			// if (gDevice.devType != devTypeEnum.DEV_IPC && nChannel < gDevice.loginRsp.VideoInChannel) {
			// 	callback({ FlipOperation: false, MirrorOperation: false });
			// 	return;
			// }
			var name = {};
			if (gDevice.devType == devTypeEnum.DEV_IPC) {
				name = { "Name": "Uart.PTZControlCmd" };
			} else {
				name = { "Name": "Uart.PTZControlCmd.[" + nChannel + "]" };
			}
			that.SendRequestV2("getconfig", name, false, function (o) {
				if (o["Ret"] == 100) {
					if (o[o.Name][0] && o[o.Name][0]["ModifyCfg"]) {
						callback(o[o.Name][0]);
						return;
					} else {
						CheckTranditionalPTZNormalDirect(nChannel, function (bTraditionalIPC) {
							var o = { FlipOperation: false, MirrorOperation: true };
							if (bTraditionalIPC) {
								o.FlipOperation = false;
								o.MirrorOperation = false;
								callback(o);
							} else {
								CheckCustomIPC(nChannel, function (bIsCustomIPC) {
									if (bIsCustomIPC) {
										o.FlipOperation = false;
										o.MirrorOperation = true;
									} else {
										o.FlipOperation = false;
										o.MirrorOperation = false;
									}
									callback(o);
								})
							}
						});
					}
				} else {
					CheckCustomIPC(nChannel, function (bIsCustomIPC) {
						if (bIsCustomIPC) {
							o.FlipOperation = false;
							o.MirrorOperation = true;
						} else {
							o.FlipOperation = false;
							o.MirrorOperation = false;
						}
						callback(o);
					})
				}

			}, 3000);
		}
		else {
			callback();
		}
	})(nCh, function (o) {
		if (o) {
			if (o.FlipOperation == true) {
				if (nCmdType == 0 || nCmdType == 1) {
					nCmdType = nCmdType == 1 ? 0 : 1;
				} else if (nCmdType == 4 || nCmdType == 5) {
					nCmdType = nCmdType == 4 ? 5 : 4;
				} else if (nCmdType == 6 || nCmdType == 7) {
					nCmdType = nCmdType == 6 ? 7 : 6;
				}
			}
			if (o.MirrorOperation == true) {
				if (nCmdType == 2 || nCmdType == 3) {
					nCmdType = nCmdType == 2 ? 3 : 2;
				} else if (nCmdType == 4 || nCmdType == 6) {
					nCmdType = nCmdType == 4 ? 6 : 4;
				} else if (nCmdType == 5 || nCmdType == 7) {
					nCmdType = nCmdType == 5 ? 7 : 5;
				}
			}
		}
		if(nCmdType >=0 && nCmdType <= 13){
			obj["OPPTZControl"]["Command"] = szNormalCmd[nCmdType];
		}	

		obj.SessionID = "0x" + toHex(gDevice.nSessionID, 8);
		if (nCmdType <= 13) {
			if (nParam2 == 0) {
				if (that.PTZTimerId == -1) {
					that.SendRequestV2("opptz", obj, false, callback, 3000);
					that.PTZTimerId = setInterval(function () {
						that.SendRequestV2("opptz", obj, false, callback, 3000);
					}, 400);
				}
			} else {
				if (that.PTZTimerId != -1) {
					clearInterval(that.PTZTimerId);
					that.PTZTimerId = -1;
					that.SendRequestV2("opptz", obj, false, callback, 3000);
				}
			}
		} else {
			that.SendRequestV2("opptz", obj, false, callback, 3000);
		}
	}
	);
}
CGIClass.prototype.GetScaleTwoLensAbility = function (channel, callback) {
	if (gDevice.devType != devTypeEnum.DEV_IPC && channel >= gDevice.loginRsp.VideoInChannel) {
		var ch = channel - gDevice.loginRsp.VideoInChannel;
		var name = "bypass@SystemFunction.[" + ch + "]";
		var timeout = 3000;
		var cmd = "getchannelability";
		var b = {
			"Name": name
		};
		b.SessionID = "0x" + toHex(gDevice.nSessionID, 8);
		this.SendRequestV2(cmd, b, false, function (a) {
			if (isObject(a)) {
				if (a.Ret != 100) {
					callback(false);
				} else {
					callback(a[a.Name]["OtherFunction"]["SupportScaleTwoLens"]);
				}
			}
		}, timeout);
	} else {
		callback(GetFunAbility(gDevice.Ability.OtherFunction.SupportScaleTwoLens));
	}

}
CGIClass.prototype.GetOpSensor = function(channel,stream,nSpeed,callback){
	var name = "OPSensorGet";
	if(gDevice.devType != devTypeEnum.DEV_IPC){
		name = "OPSensorGet.[" + channel + "]";
	}
	var obj = {};
	var tmpObj = [{"StreamType":stream}];
	obj["Name"] = name;
	obj[name] = cloneObj(tmpObj);
	var callbackfunc = callback;
	var curChannel = channel;
	var curSpeed = nSpeed;
	gDevice.SendMsg(WSMsgID.WsMsgID_CONFIG_SCALTWOLENS,obj,function(a){
		if(isObject(a)){
			if(a.Ret == 100){
				var cfg = a[a.Name][0];
				var curTimes = cfg.Times;
				var setTimes = curTimes;
				var streamType = cfg.StreamType;
				if(!gVar.ScalAdd){
					setTimes -= curSpeed * 0.1;
					if(setTimes <= 0){
						setTimes = 0;
					}
				}else{
					setTimes += curSpeed * 0.1;
					if(setTimes >= 7){
						setTimes = 7;
					}
				}
				var SetName = "OPScaleTimesSwitch";
				if(gDevice.devType != devTypeEnum.DEV_IPC){
					SetName = "OPScaleTimesSwitch.[" + curChannel + "]";
				}
				var setObj = {};
				var tmpsetObj = [{
					"StreamType":streamType,
					"TimesOri":curTimes,
					"Times":setTimes
				}];
				setObj["Name"] = SetName;
				setObj[SetName] = cloneObj(tmpsetObj);
				gDevice.SendMsg(WSMsgID.WsMsgID_CONFIG_SCALTWOLENS,setObj,callbackfunc);
			}else{
				callbackfunc;
			}
		}
		
	});
}
CGIClass.prototype.SearchRecord = function(obj, callback) {
	this.callback = callback;
	obj.SessionID = "0x"+toHex(gDevice.nSessionID,8);
	this.SendRequestV2("opdev", obj, true, callback);
}

CGIClass.prototype.FindWndByChannel = function(channel){
	var nLen = this.channelPerWnd.length;
	var nWnd = -1;
	for(var i =0;i < nLen;i++){
		if(this.channelPerWnd[i] == channel){
			nWnd = i;
			break;
		}
	}
	return nWnd;
}

CGIClass.prototype.FindChannelByWnd = function(wnd){
	var chn = -1;
	if(wnd >= 0 && wnd < this.channelPerWnd.length){
		chn = this.channelPerWnd[wnd];
	}
	return chn;
}

CGIClass.prototype.GetPlayStatus = function(wnd){
	return this.m_playstatus[wnd];
}

CGIClass.prototype.CheckDevVersion = function (callback) {
    var ver = gDevice.loginRsp.SoftWareVersion.split(".");
    var c = "";
    for(var i = 3; i < ver.length; i ++){
        c += ver[i];
    }
    var b = {
        "Name": "OPVersionReq",
        "OPVersionReq": {
          "CurVersion": gDevice.loginRsp.BuildTime,
          "DevID": c,
          "DevType": gDevice.devType,
          "Expect": 0,
          "Language": "English",
          "Manual": 1,
          "UUID": gDevice.loginRsp.SerialNo
        }
      }
    this.SendRequestV2("cldupgrade", b, true, function(c){
        if(c.Ret == 100){
            c.NewVersion = c[c.Name].FileName;
            gDevice.onlineVersion =  c[c.Name];
        }
        callback(c);
    });
}
CGIClass.prototype.StartOnlineUpgrade = function(callback){
	this.UpgradeType = UpgradeType.UpgradeTypeOnline;
    var b = {
        "Name": "OPCloudUpgradeStart"
    }
    this.SendRequestV2("cldupgrade", b, true, function(a){
		if(a.Ret == 100){
			gNet.UpgradeStatus = UpgradeStatus.UpgradeStatusDown;
		}
		callback(a);
	});
}
CGIClass.prototype.GetUpgradeProgress = function(callback){
	var b = {};
	var cmd = "";
	if(this.UpgradeType == UpgradeType.UpgradeTypeOnline){
		if(gNet.UpgradeStatus == UpgradeStatus.UpgradeStatusDown){
			b.Name = "OPCloudFileGetDownloadState";
			cmd = "cldupgrade";
		}else if(gNet.UpgradeStatus == UpgradeStatus.UpgradeStatusUpgrade){
			b.Name = "OPCloudUpgradeGetBurnProgress";
			cmd = "cldupgrade";
		}
	}else if(this.UpgradeType == UpgradeType.UpgradeTypeLocal){
		b.Name = "UpgradeStatus";
		cmd = "upgrade";
	}else{
		var c = {};
		c.Ret = WEB_ERROR.ERR_UnknowUpgradeType;
		callback(c);
		return;
	}
    this.SendRequestV2(cmd, b, true, function(a){
		if(gNet.UpgradeType == UpgradeType.UpgradeTypeLocal){
			if(a.Status == "Finish"){
				a.UpgradeStatus = gNet.UpgradeStatus = UpgradeStatus.UpgradeStatusFinish;
			}else if(a.Status == "Abort"){
				a.UpgradeStatus = gNet.UpgradeStatus = UpgradeStatus.UpgradeStatusAbort;
			}else{
                a.UpgradeStatus = gNet.UpgradeStatus = UpgradeStatus.UpgradeStatusUpgrade;
            }
		}else{
			if(gNet.UpgradeStatus == UpgradeStatus.UpgradeStatusUpgrade){
				if(a.Ret == 515){
					a.UpgradeStatus = UpgradeStatus.UpgradeStatusFinish;
				}else{
                    a.UpgradeStatus =UpgradeStatus.UpgradeStatusUpgrade;
                }
			}else if(gNet.UpgradeStatus == UpgradeStatus.UpgradeStatusDown){
                a.UpgradeStatus = UpgradeStatus.UpgradeStatusDown;
				if(a.Ret == 100){
					gNet.UpgradeStatus = UpgradeStatus.UpgradeStatusUpgrade;
				}
			}
		}
		callback(a);
	});
}
CGIClass.prototype.StartLocalUpgrade = function(file, callback){
	this.UpgradeType = UpgradeType.UpgradeTypeLocal;
	var b = {
		"Name": "UpgradeStart",
 		"FileLength" : file.size,
	}
	this.SendRequestV2("upgrade", b, true, function(a){
		gNet.UpgradeStatus = UpgradeStatus.UpgradeStatusDown;
		callback(a);
	}, 30000);
}

function BrowseCtrl(url){
	this.url = url;
	this.bInit = !1;
	this.port= 80;
	this.ws = null;
	this.bOpen = !1;
	this.bLogin = !1;
	this.screenLeft = window.screenLeft;
	this.callback = DebugStringEventFunc;
	this.webCtrlCall = null;
	this.loginfail = !1;
	this.pluginPostion = {
		Width:0,
		Height:0,
		Left:0,
		Top:0,
		bVisibility:2,
		checkPluginPositionId:0,
		windowsize:{
			width:0,
			height:0
		}
	};
	this.focus = !1;
	this.eventCallback = {};
	this.msgCallback = {};
	this.httpUrl = "";
	this.enableToolEncrypt = false;
	this.toolAesKeyAndIv;
	this.init = function () {
		var h = this;
		h.eventCallback[MainEventEnum.MainEventPreview]=function(rsp){previewEventCallBack(rsp);};
		h.eventCallback[MainEventEnum.MainEventPlayBlack]=function(rsp){playbackEventCallBack(rsp);};
		h.eventCallback[MainEventEnum.MainEventAlarm] = function (rsp) { };
		h.eventCallback[MainEventEnum.MainEventUpgrade] = function (rsp) { UpgradeEventCallBack(rsp); };
		h.eventCallback[MainEventEnum.MainEventClient] = function (rsp) { ClientConfigEventCallBack(rsp); };
		h.eventCallback[MainEventEnum.MainEventDisconnet] = function (rsp) {
			if (!gVar.bUpgrade && !g_bDisconneting) {
				g_bDisconneting = true;
				var iframe = document.getElementById('MaskLayout');
				var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
				iframedoc.getElementById("WaitTip").innerHTML = lg.get("IDS_DISCONNECT_TIP");
				MasklayerShow();
				DebugStringEvent("WebSocket DisConnect");
				gNet.LogoutCgi(function (a) {
					DebugStringEvent("CGI Logout");
					gDevice.startReconnect();
				});
			}
		};
		h.eventCallback[MainEventEnum.MainEventVoiceCustom] = function (rsp) { RemainTimeCallback(rsp);};
		h.eventCallback[MainEventEnum.MainEventOtherLogin]=function(rsp){
			if (!gVar.bUpgrade) {
				gBrowseCtrl.LogoutPlugin();
				b.WebsocketID = 0;
				gNet.LogoutCgi(function () {
					window.location.reload(true);
				});
			}
		};
		h.eventCallback[MainEventEnum.MainEventRemoteSearchDev] = function(rsp){ SDKRemoteSearchDevEventCallback(rsp);};

		$("body").mousemove(function(event){
			if(gVar.adjustBytool){
				return;
			}
			updatePositionInfo(event || window.event);
			if(gVar.bInitBrowseFrame){
				gVar.InitBrowseFrameInfo(gVar.positionInfo);
			}
		})
		if(g_BrowseType == BrowseType.BrowseMSIE){
			$(window).on("mousewheel", function(event){
				var event = event || window.event;
				if (event.deltaY === 0)
					return;
				if (event.deltaY > 0) {
					event.preventDefault();
				} else {
					event.preventDefault();
				}
			});
		}
		if(WebCms.plugin.isLoaded){
			$("#ipcplugin").click(function(event){
				var u = GetDevicePixelRatio();
				var t = {
					Left: Math.round(event.offsetX*u),
					Top: Math.round(event.offsetY*u),
					Width : 0,
					Height: 0
				}
				gVar.AdjustPlugin2(6,t,function(){
	
				});
			});
		}
		h.httpUrl = "http://"+ WebCms.web.PcIP + ":" + WebCms.plugin.httpport +"/Cmd-WebLocalCtrl";
		h.bInit = !0;
	};
	this.connectToPlugin = function() {
		var that = this;
		var a = WebCms.plugin.setupname;
		gVar.PrintLogEn = true;
		postJson(that.httpUrl, { "MainType":33, "SubType":0, "WebStyle":WebCms.web.webstyle,"SetupName":a}).done(function(a){
			if (a.Ret == 100) {
				gVar.PrintLogEn = a.PrintLogEn;
			}
			postJson(that.httpUrl, { "MainType": 99, "SubType": 0 }).done(function(a){
				if (that.ws) that.ws.close();
					that.ws = null;
					that.ws = new WebSocket("ws://127.0.0.1:" + a.port+"/VideoPlay");
					that.ws.onopen = function (msg) {
						that.bOpen = !0;
					};
					that.ws.onmessage = function (msg) {
						var data = that.enableToolEncrypt ? AesDecrypt(msg.data, that.toolAesKeyAndIv) : msg.data;
						var rsp = typeof data == "string" ? JSON.parse(data) : data;
						if (rsp.MainEvent != undefined) {
							if (!((rsp.MainEvent == 0 && rsp.SubEvent == 5) || (rsp.MainEvent == 1 && rsp.SubEvent == 7)
							||(rsp.MainEvent == 1 && rsp.SubEvent == 3))) {
								DebugStringEvent(data);
							}
							that.eventCallback[rsp.MainEvent]&&that.eventCallback[rsp.MainEvent](rsp);
						} else {
							DebugStringEvent(data);
							that.msgCallback && that.msgCallback[rsp.MsgID] && that.msgCallback[rsp.MsgID](rsp);
						}
					}
					that.ws.onerror = function (msg) {
						if (that.ws) {
							that.ws.close();
						}
					}
					that.ws.onclose = function (msg) {
						if (!that.bLogin && !that.loginfail) {
							that.callback({ "Ret": WEB_ERROR.ERR_FAIL_CONNECT_PLAYER });
						} else {
							that.bOpen = !1;
							that.bLogin = !1;
						}
					}
			}).fail();
		}).fail();
	};
	this.runAutoCheckWnd = function(){
		var h = this;
		clearTimeout(h.pluginPostion.checkPluginPositionId);
		var pt = GetAbsoluteLocationEx($("#ipcplugin")[0]);
		if (h.pluginPostion.windowsize.width != window.innerWidth || h.pluginPostion.windowsize.height != window.innerHeight
			|| pt.Width != h.pluginPostion.Width || pt.Height != h.pluginPostion.Height
			|| pt.Left != h.pluginPostion.Left || pt.Top != h.pluginPostion.Top) {
			if ((gVar.sPage == "live" || gVar.sPage == "playback"
				|| (gVar.sPage == "config" && (gVar.SubPage == "System_ColorParam" || gVar.SubPage == "System_ROI" ||gVar.SubPage == "IPCParam_ImageSet")))
				&& gVar.bShowPlugin && !gVar.bFreeze&&gBrowseCtrl.pluginPostion.bVisibility==2) {
				DebugStringEvent("runAutoCheckWnd adjustplugin2");
				h.pluginPostion.windowsize.width = window.innerWidth;
				h.pluginPostion.windowsize.height = window.innerHeight;
				gVar.AdjustPlugin2(4, pt, function () {
					$.extend(h.pluginPostion, pt);
					h.pluginPostion.checkPluginPositionId = setTimeout(function () {
						h.runAutoCheckWnd()
					}, 100);
				});
			} else {
				h.pluginPostion.checkPluginPositionId = setTimeout(function () {
					h.runAutoCheckWnd()
				}, 200);
			}
		} else {
			h.pluginPostion.checkPluginPositionId = setTimeout(function () {
				h.runAutoCheckWnd()
			}, 100);
		}
	};
	this.sendMessage = function(msg){
		var req = msg;
		var temp = JSON.stringify(req);
		DebugStringEvent(temp);
		if(this.ws.readyState == 1){
			temp=this.enableToolEncrypt?AesEncrypt(temp,this.toolAesKeyAndIv):temp;
			this.ws.send(temp);
			return true;
		}else{
			return false;
		}
		
	};
}

BrowseCtrl.prototype.PluginLogin = function (ip, port, username, password, callback) {
    var url = "http://"+WebCms.web.PcIP + ":"+WebCms.plugin.httpport+"/Cmd-WebLocalCtrl";
    var req = {"MainType":1,"SubType":0, "WebStyle":WebCms.web.webstyle,"SetupName":WebCms.plugin.setupname};
    getPluginVer(url, req).done(function(a){
        WebCms.plugin.autopreviewnum = a.AutoPreviewNum;
        var sampleRate_16 = false;
        if(typeof g_SampleRate_16 != "undefined") {
            sampleRate_16 = g_SampleRate_16;
        }
        var sTitle = document.title;
        if(typeof sTitle != "string" || sTitle == ""){
            sTitle = 'Web Viewer'
        }
        var that = this;
        var cmd = {
            'MainType': 8,
            'SubType': 0,
            'Device': { "IP": ip, "Port": port, "User": username, "Password": password },
            'WebType': WebCms.web.webstyle,
            'Browse': g_BrowseType,
            'ClientLanguage' : WebCms.web.language,
            'Title': sTitle,
            'SampleRate_16': sampleRate_16,
            'SetupName':WebCms.plugin.setupname
        };
        if(WebCms.plugin.autopreviewnum > 0) cmd.DefaultWndNum = WebCms.plugin.autopreviewnum;
        that.loginfail = !1;
        SendMsgToPlugin(cmd, function (rsp) {
            if (rsp.Ret == 100) {
                that.bLogin = !0;
            } else {
                that.loginfail = !0;
                that.bLogin = !1;
            }
            callback(rsp);
        });
    }).fail(function(xhr){
		var url = 'VideoPlayTool://1';
    	location.href = url;
		var a = {};
		a.Ret = WEB_ERROR.ERR_WebServerNoRun;
		callback(a);
	});
}

BrowseCtrl.prototype.LogoutPlugin = function(){
	//TODO
	//this.ws && WebSocket.OPEN === this.ws.readyState && this.ws.close()
}

function DeviceInfo() {
	this.loginRsp = {};
	this.bInit = 0;
	this.id = 0;
	this.devState = [];
	this.Ability={};
	this.DecoderPram={};
	this.LocalVoiceTipType={};
	this.LocalVoiceTipCustom=false;
	this.ExtRecSupport = {}
	this.devType = devTypeEnum.DEV_HVR;
	this.streamTypeArr=[];
	this.ip = "";
	this.httpPort = "";
	this.tcpPort = "";
	this.wsPort = "";
	this.username = "";
	this.password = "";
	this.nSessionID = 0x0;
	this.WebsocketID = 0;
	this.AlarmType = {};
	this.AutoPreviewNum = 8;
	this.programLogo = {bLoginTopLogo: false, bLogo: false};
	this.bGetDefault=false;
	this.SafetyAbility=null;
	this.player = null;
	this.oldChn = -1;
	this.bAudio = false;
	this.bRecord = false;
	this.reconnectID = -1;
	this.nReDevCount = 0;
    this.downloadQueue = null;
    this.downloadState  = null;
	function DisconnectDev(){
		MasklayerShow();
		var iframe = document.getElementById('MaskLayout');
		var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
		iframedoc.getElementById("WaitTip").innerHTML =lg.get("IDS_DISCONNECT_TIP");
		if(!gVar.bUpgrade){
			DebugStringEvent("CGI DisConnect");
			gNet.LogoutCgi(function(a){
				DebugStringEvent("CGI Logout");
				gDevice.startReconnect();
			});
		}
	}
	function KeepAliveProcess(){
		if(gNet.run == true || !g_bKeepAlive || g_bDisconneting == true || g_bReConnect == true
         ) {
			DebugStringEvent("gNet.run == true");
			return;
		}
		var request=null;
		var d = function (c) {
			if (request != null)
				request.abort();
			if (c.Ret == 100) {
				if (g_bReConnect) {
					DebugStringEvent("login");
				}
				nKeepAliveCount=0;
			} else if (c.Ret == 105||c.Ret==136) {
				if(!g_bDisconneting){
					g_bDisconneting = true;
					DisconnectDev();
				}
				DebugStringEvent("no login");
			} else{
				if (!g_bReConnect) {
					nKeepAliveCount += 1;
					DebugStringEvent("recv keepalive fail,num=" + nKeepAliveCount);
					if (nKeepAliveCount >= 4) {
						if(!g_bDisconneting){
							g_bDisconneting = true;
							DisconnectDev();
						}					
					}
				} else {
					MasklayerShow();
				}
			}
		}
		var a = { "Name": "KeepAlive" };
		a.Salt = gNet.Salt;
		var req = JSON.stringify(a);
		req = gNet.isAesEncrypt ? AesEncrypt(req, gNet.aesKeyAndIv) : req;
		var contentType = gNet.isAesEncrypt ? "text/plain" : "application/x-www-form-urlencoded";
		if (!g_bDebug) contentType =gNet.isAesEncrypt ? "text/plain" : "application/json";
        DebugStringEvent("KeepAlive");
		request=$.ajax({
			type: "post",
			url: gNet.initUrl + "login.cgi",
			data: req,
			contentType: contentType + ";charset=utf-8",
			datatype: gNet.isAesEncrypt ? "text" : "json",
			async: true,
			timeout: 8000,
			dataFilter: function (f) {
				if (typeof f == "string") {
					f = f.replace(/\n/g, "");
					f = f.replace(/\r/g, "");
				}
				var f = gNet.isAesEncrypt ? AesDecrypt(f,gNet.aesKeyAndIv) : f;
				return f;
			},
			success: function (f,g) {
				var result = f;
				if(typeof f == "string"){
					result = JSON.parse(f);
				}
				d(result);
			},
			error: function (f, g) {
				var ret = { "Name": "", "Ret": -1 };
				d(ret);
			}
		});
	}
	function ReLoginDev(type, callback){
		gDevice.ReLogin(function(a){
			if(a.Ret == 100){
				gDevice.GetBaseInfo(type, function(a){
					callback(a);
				});
			}else{
				callback(a.Ret);
			}
		});
	}
	function ReconnectProcess(){
		gNet.isAesEncrypt = false;
		gNet.sendRequest("login", { "Name": "GetSalt" }, true, function (a) {
			if(a.Ret == 100){
				setTimeout(function(){
					ReLoginDev(1, function(a){
						if(a == 100){
							gDevice.resetReconnect();
							MasklayerHide();
							var iframe = document.getElementById('MaskLayout');
							var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
							iframedoc.getElementById("WaitTip").innerHTML =lg.get("IDS_WAIT_TIP");
							DebugStringEvent("Websocket ReConnect");
							if(gVar.sPage == "live"){
								DebugStringEvent("Begin restore preivew!");
								gDevice.SetPageIndex(0, function(){
									DebugStringEvent("End restore preivew!");
								});	
							}else if(gVar.sPage == "playback"){
								var msg = {
									MainEvent:MainEventEnum.MainEventPlayBlack,
									SubEvent:PlaybackEvent.SubEventPlaybackLayoutReLogin
								};
								playbackEventCallBack(msg);
							}
						}else{
							gDevice.nReDevCount += 1;
							if(gDevice.nReDevCount >= 5){
								gDevice.resetReconnect();
								closewnd(0);
							}
						}
					});
				}, 500);
			}
		}, 3000);
	}
	this.setLoginRsp = function(c) {
		$.extend(true, this.loginRsp, c);
		for (var b = 0; b < this.loginRsp.ChannelNum; b++) {
			this.streamTypeArr.push(g_defaultStreamType);
			this.devState[b] = {};
			var vl=0;
			var chn=CHNStatus.CHN_CONNECTED;
			if(b >= this.loginRsp.VideoInChannel){
				vl=1;
				chn=CHNStatus.CHN_DISCONNECTED;
			}
			this.devState[b].VLossState = vl;
			this.devState[b].CurChnState = chn;
		}
	};
	this.getChannelName = function (chIndex) {
		var channelName;
		var analogNum = this.loginRsp.VideoInChannel;
		var chnNum = chIndex < 9 ? '0' + (chIndex + 1) : (chIndex + 1);
		if(chIndex < analogNum){
			channelName = lg.get('IDS_CH') + chnNum;
		}else{
			var _IPChnNum = (chIndex - analogNum) < 9 ? '0' + (chIndex - analogNum + 1) : (chIndex - analogNum + 1);
			var _IPChnStr = "IP " + lg.get("IDS_CH");//IP CH
			channelName = _IPChnStr + _IPChnNum;
		}
		return channelName;
	};
	this.GetWndShowMode = function(wndNum){
		var nSplitMode = 0;
		if(wndNum == 1){
			nSplitMode = 0;
		}else if(wndNum <= 4){
			nSplitMode = 1;
		}else if(wndNum <= 9){
			nSplitMode = 2;
		}else if(wndNum <= 16){
			nSplitMode = 3;
		}else if(wndNum <= 25){
			nSplitMode = 4;
		}else if(wndNum <= 36){
			nSplitMode = 5;
		}else if(wndNum <= 64){
			nSplitMode = 6;
		}
		return nSplitMode;
	}
	this.ConvetDevType = function(type){
        var n = devTypeEnum.DEV_HVR;
        if(type == "DVR"){
            n = devTypeEnum.DEV_DVR;
        }else if(type == "NVS"){
            n = devTypeEnum.DEV_NVS;
        }else if (type == "IPC") {
            n = devTypeEnum.DEV_IPC;
        }else if(type == "HVR"){
            n = devTypeEnum.DEV_HVR;
        }else if(type == "IVR"){
            n = devTypeEnum.DEV_IVR;
        }else if(type == "MVR"){
            n = devTypeEnum.DEV_MVR;
        }else if(type == "IOT"){
            n = devTypeEnum.DEV_IOT;
        }
        return n;
    }
	this.startKeepAlive = function(){
		if (g_keepAliveID == -1) {
			g_bReConnect = false;
			g_keepAliveID = setInterval(KeepAliveProcess, 10000);
		}
	}
	this.resetKeepAlive = function() {
		if (g_keepAliveID != -1) {
			window.clearInterval(g_keepAliveID);
			g_keepAliveID = -1;
			g_bReConnect = false;
		}
	}
	this.startReconnect = function(){
		if (this.reconnectID == -1) {
			this.nReDevCount = 0;
			g_bReConnect = true;
			this.reconnectID = setInterval(ReconnectProcess, 6000);
		}
	}
	this.resetReconnect = function(){
		if(this.reconnectID != -1){
			window.clearInterval(this.reconnectID);
			this.reconnectID = -1;
		}
		nKeepAliveCount = 0;
		this.nReDevCount = 0;
		g_bReConnect = false;
		g_bDisconneting = false;
	}
	a(this);
	function a(b) {
		b.Init = function(canvas){
			gNet = new CGIClass(canvas);
			gNet.init();
			if(WebCms.plugin.isLoaded && gNet.bInit){
				gBrowseCtrl = new BrowseCtrl();
				gBrowseCtrl.init();
				b.bInit = gBrowseCtrl.bInit;
				gBrowseCtrl.connectToPlugin();
			}else{
				b.bInit = gNet.bInit;
			}
			$(window).resize(function () {
				if (g_videomovetime != -1) {
					clearTimeout(g_videomovetime);
					g_videomovetime = -1
				}
				g_videomovetime = setTimeout(function() {
					if (gVar.sPage == "config") {
						if (gVar.childPage != "config") {
							SetResize(gVar.sPage);
							SetResize(gVar.childPage);
							var o = [],
								j = 0,
								k;
							var tableList = [];
							switch (gVar.childPage) {
								case "System_NetService":
									tableList.push("#NetServiceList");
									break;
								case "Advance_HddManager":
									tableList.push("#HDDList");
									break;
								case "Advance_Account":
									tableList.push("#AccountList");
								case "Info_HddInfo":
									tableList.push("#TypeCapacityList");
									tableList.push("#RecordTimeList");
									break;
								case "Info_Log":
									tableList.push("#LogList");
									break;
								case "Info_ChanStatus":
									tableList.push("#ChnStstusList");
									break;
								case "Info_CustomerFlow":
									tableList.push("#FlowList");
									break;
							}
							for (j=0; j < tableList.length; j++) {
								var nHeight = $(tableList[j]+" .table-responsive").height()-$(tableList[j]+" .table-head").height();
								$(tableList[j]+" .table-content").css("height", nHeight+'px');
							}
							for (j=0; j < o.length; j++) {
								var l = $("#" + o[j]);
								if (l.children().length > 0) {
									k = setLigerGridSize(o[j], ".cfg_container");
									var m = $(".cfg_container").height() * 1;
									var f = $(".cfg_container").width() * 1;
									var n = l.attr("rowNum") * 1;
									var p = 0;
									var h = (n + 1) * 23;
									if (o[j] == "ChnMode_ligerGrid"){
										h = (n + 2) * 23;
									}
									if (g_BrowseType == BrowseType.BrowseSafari || g_BrowseType == BrowseType.BrowseChrome) {
										if (o[j] != "Analog_ligerGrid") {
											h = h + 16;
											p = 1
										}
									}
									if (h > m - 100) {
										h = m - 100;
										k = k + 20
									} else {
										if (k >= f - 50 && p == 0) {
											h = h + 18
										}
									}
									if (o[j] == "searchDataGrid" && g_BrowseType == BrowseType.BrowseChrome) {
										k = k - 1
									}
									l.ligerGrid().setHeight(h);
									if (o[j] == "ChnInfo_ligerGrid" || o[j] == "RecInfo_ligerGrid") {
										k = k - 3
									}
									l.css("width", k + "px")
								}
								l = null
							}
							o = null;
							k = null;
							j = null
						} 
						if (gVar.SubPage == "System_ColorParam") {
						}else if(gVar.SubPage == "System_ROI"){
						}else if(gVar.SubPage == "Info_CustomerFlow"){
							GraphCanvasResizeCallBack();
						}
					} else {
						SetResize(gVar.sPage);
						if (gVar.sPage == "playback"){
							timeLineResizeCallBack();
						}else if (gVar.sPage == "alarm"){
							var nHeight = $("#AlarmList .table-responsive").height()-$("#AlarmList .table-head").height();
							$("#AlarmList .table-content").css("height", nHeight+'px');
						}else if(gVar.sPage == "live"){
						}else{
						}
					}
					g_videomovetime = -1
				}, 300)
			});
			return b.bInit;
		}
		b.runAutoCheckWnd = function(){
			if(WebCms.plugin.isLoaded){
				gBrowseCtrl.runAutoCheckWnd();
			}
		} 
		b.GetPreLoginInfo = function (callback) {
			gNet.sendRequest("login", { "Name": "GetPreLoginInfo" }, true, callback);
		}
		b.LoginDev = function (callback) {
			function cgiLogin(d){
				gNet.CgiLogin(b.ip, b.httpPort, b.username, b.password, function (a) {
					if (a.Ret == 100) {
						if(typeof a.DeviceType === "string"){
							b.devType =b.ConvetDevType(a["DeviceType"]);
						}else{
							b.devType =b.ConvetDevType(a["DeviceType "]);
						}
						b.nSessionID = parseInt(a.SessionID, 16) >>> 0;
					}
					d(a);
				});
			}
			if(WebCms.plugin.isLoaded){
				gBrowseCtrl.PluginLogin(b.ip, b.tcpPort, b.username, b.password, function (a) {
					if (a.Ret == 100) {
						b.WebsocketID = a.Id;
						if (a.DPIRadio != undefined) {
							gVar.pcDpiRadio = a.DPIRadio * 1.0 / 100;
							if (g_BrowseType == BrowseType.BrowseMSIE) {
								gVar.pcDpiRadio = 1.0;
							}
						}
						gVar.adjustBytool = a.adjustBytool;
						if (!gVar.adjustBytool) {
							function funcVisibilitychange() {
								if (document.visibilityState !== "visible" || document.hidden == !0) {
									gBrowseCtrl.pluginPostion.bVisibility = 1;
								} else {
									gBrowseCtrl.pluginPostion.bVisibility = 2;
								}
								if ((gVar.sPage == "live" || gVar.sPage == "playback" ||
									(gVar.sPage == "config" && (gVar.SubPage == "System_ColorParam" || gVar.SubPage == "System_ROI" || gVar.SubPage == "IPCParam_ImageSet")))) {
									DebugStringEvent("funcVisibilitychange AdjustPlugin2");
									gVar.AdjustPlugin2(gBrowseCtrl.pluginPostion.bVisibility, null, function () {
										gVar.bShowPlugin = gBrowseCtrl.pluginPostion.bVisibility == 2 ? true : false;
									});
								}
							};
							var visProp = getHiddenProp();
							if (visProp) {
								if (document.addEventListener) {
									document.addEventListener(visProp["replace"](/[H|h]idden/, '') + "visibilitychange", funcVisibilitychange, ![]);
								} else if (document.attachEvent) {
									document.attachEvent(visProp["replace"](/[H|h]idden/, '') + "onvisibilitychange", funcVisibilitychange);
								}
							}
							if (document.visibilityState !== "visible" || document.hidden == !0) {
								gBrowseCtrl.pluginPostion.bVisibility = 1;
							} else {
								gBrowseCtrl.pluginPostion.bVisibility = 2;
							}
							gVar.InitBrowseFrameInfo(gVar.positionInfo);
						}
						gVar.bInitBrowseFrame = !0;
						gVar.captureUrl = "http://"+ WebCms.web.PcIP + ":" + g_PluginPort;
						gVar.captureUrl += "/Cfg/capture.bmp";
						cgiLogin(function(e){
							if(e.Ret != 100){
								var obj = { "MainType": 9, "SubType": 0 };
								SendMsgToPlugin(obj, function (b) { });
								gBrowseCtrl.LogoutPlugin();
								b.WebsocketID = 0;
							}
							callback(e);
						});
					} else {
						gBrowseCtrl.LogoutPlugin();
						callback(a);
					}
				});
			}else{
				cgiLogin(callback);
			}
		}
		b.GetBaseInfo = function (type, callback){
			gDevice.GetMsg(WSMsgID.WsMsgID_ABILITY_GET, "SystemFunction", function(a){
				if(a.Ret == 100){
					gDevice.Ability = a[a.Name];
					if(gDevice.Ability.CommFunction == null){
						gDevice.Ability.CommFunction = {};
					}
					gDevice.GetMsg(WSMsgID.WsMsgID_CONFIG_GET, "Ability.LocalVoiceTipType",function(a){
						if (typeof a == "string") {
							a=JSON.parse(a);
						}
						gDevice.LocalVoiceTipType=a[a.Name];
						gDevice.GetMsg(WSMsgID.WsMsgID_SYSINFO_REQ, "SystemInfo", function(a){
							if(a.Ret == 100){
								if(type == 1){
									if(a[a.Name].SerialNo != gDevice.loginRsp.SerialNo){
										MasklayerShow();
										gDevice.LogoutDev(function(a){
											var d = lg.get("IDS_RECONNECT");
											window.setTimeout(function() {
												AutoClose(d, 2);
											}, 1000);
										});
										return;
									}
								}
								var rsp = a[a.Name];
								rsp.ChannelNum = rsp.VideoInChannel + rsp.DigChannel;
								gDevice.setLoginRsp(rsp);
								gDevice.GetMsg(WSMsgID.WsMsgID_DEFAULTCONFIG_GET, "General.General", function(a){
									if(a.Ret == 100){
										gDevice.bGetDefault = true;
									}
									gDevice.GetMsg(WSMsgID.WsMsgID_ABILITY_GET, "SupportExtRecord", function(a){
										if(a.Ret == 100){
											gDevice.ExtRecSupport = a[a.Name];
											if(GetFunAbility(gDevice.Ability.OtherFunction.AudioTalkUseOtherFormat)){
												gDevice.GetMsg(WSMsgID.WsMsgID_ABILITY_GET, "DecoderPram", function(a, b){
													if(a.Ret == 100){
														gDevice.DecoderPram = a[a.Name];
													}
													callback(100);
												});
											}else{
												callback(100);
											}
										}else{
											callback(a.Ret);
										}
									});
								});
							}else{
								callback(a.Ret);
							}
						})
					})
					
				}else{
					callback(a.Ret);
				}
			});
		}
		b.LogoutDev = function (callback) {
			if (WebCms.plugin.isLoaded){
				var obj = {"MainType":9,"SubType":0};
				SendMsgToPlugin(obj, function(a){});
				gBrowseCtrl.LogoutPlugin();
				b.WebsocketID = 0;
			}	
			gNet.LogoutCgi(callback);
		}
		b.ReLogin = function(callback){
			function cgiLogin(d){
				gNet.CgiLogin(b.ip, b.httpPort, b.username, b.password, function (a) {
					if (a.Ret == 100) {
						if(typeof a.DeviceType === "string"){
							b.devType =b.ConvetDevType(a["DeviceType"]);
						}else{
							b.devType =b.ConvetDevType(a["DeviceType "]);
						}
						b.nSessionID = parseInt(a.SessionID, 16) >>> 0;
					}
					d(a);
				});
			}
			if(WebCms.plugin.isLoaded){
				var cmd = {'MainType': 28, 'SubType': 0};
				SendMsgToPlugin(cmd, function(a){
					if(a.Ret == 100){
						if(a.SerialNo != gDevice.loginRsp.SerialNo){
							MasklayerShow();
							gDevice.LogoutDev(function(a){
								var d = lg.get("IDS_RECONNECT");
								window.setTimeout(function() {
									AutoClose(d, 2);
								}, 1000);
							});
							return;
						}
						cgiLogin(function(b){
							callback(b);
						});
					} else {
						callback(a);
					}
				});
			}else{
				cgiLogin(callback);
			}
		}
		b.GetMsg = function(id, name, callback){
			gNet.SendStrMsg(id, name,callback);
		}
		b.SendMsg = function(id, obj,callback){
			gNet.SendObjMsg(id, obj,callback);
		}
		b.SendBinaryData = function(nType, nParam1, nParam2, nParam3, Data, callback){
			gNet.SendBinaryData(nType, nParam1, nParam2, nParam3, Data, callback);
		}
		b.PTZcontrol = function(nCmdType, nCh, nParam1, nParam2, nParam3, callback){
			return gNet.PTZcontrol(nCmdType, nCh, nParam1, nParam2, nParam3, callback);
		}
		b.GetScaleTwoLensAbility = function(channel,callback){
			return gNet.GetScaleTwoLensAbility(channel,callback);
		}
		b.GetOpSensor = function(channel,stream,nSpeed,callback){
			return gNet.GetOpSensor(channel,stream,nSpeed,callback);
		}
		b.ScaleSwitch = function(type,speed,callback){
			var obj = {"MainType":29,"SubType":type,"Speed":speed};
			SendMsgToPlugin(obj, callback);
		}
		b.CheckWebVersion = function(type, callback){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":36, "SubType":type};
				SendMsgToPlugin(obj, callback);
			}else{
				var url = WebCms.web.downloadAddr + "/" + WebCms.web.webstyle + "Version.txt";
				var url = g_webAddr + "/" + g_WebStyle + "/" + g_WebStyle + "/" + g_WebStyle + "Version.txt?time=";
				var e = new Date;
				url += e.getTime();
				DebugStringEvent(url);
				WebCms.util.gettextfile([
					url
				]).done(function (a) {
					var lines = a.split('\n');
					var idx = lines[0].indexOf(':');
					var str = idx === -1 ? '' : lines[0].substring(idx + 1).trim();
					callback(str);
				}).fail(function (err) {
					callback(err);
				});
			}
		}
		b.HidePlugin = function (bHide, callback) {
			if (WebCms.plugin.isLoaded && (bHide ^ !gVar.bShowPlugin)&&gBrowseCtrl.pluginPostion.bVisibility==2) {
				DebugStringEvent("HidePlugin:" + bHide + " bShowPlugin:" + gVar.bShowPlugin);
				var obj={ "MainType": 12, "SubType": bHide ? 1 : 2 };
				obj.Pos = GetAbsoluteLocationEx($("#ipcplugin")[0]);
				SendMsgToPlugin(obj, function (a) {
					gVar.bShowPlugin = !bHide;
					callback();
				});
			} else {
				callback();
			}
		}
		b.CheckDevVersion = function (callback) {
            gNet.CheckDevVersion(callback);
        }
		b.StartOnlineUpgrade = function(callback){
			if(!WebCms.plugin.isLoaded || gDevice.devType == devTypeEnum.DEV_IPC){
                gNet.StartOnlineUpgrade(callback);
			}else{
				var obj = {"MainType":21,"SubType":1};
				SendMsgToPlugin(obj,callback);
			}
		}
		b.GetUpgradeProgress = function(callback){
            if(!WebCms.plugin.isLoaded || gDevice.devType == devTypeEnum.DEV_IPC){
                gNet.GetUpgradeProgress(callback);
            }else{
                var c = {"Ret":WEB_ERROR.ERR_NoSupport,"UpgradeType":-1};
                callback(c);
            }
        }
		b.BrowseLocalUpgradeFile = function(callback){
			var obj = {"MainType":25,"SubType":0};
			SendMsgToPlugin(obj,callback);
		}
		b.StartLocalUpgrade = function(filename,callback){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType": 25, "SubType": 1, "FileName": filename};
                SendMsgToPlugin(obj, callback);
            }else{
                gNet.StartLocalUpgrade(filename, callback);
            }
		}
		b.SetPageIndex = function(pageIndex, callback){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":2,"SubType":pageIndex};
				SendMsgToPlugin(obj, callback);
			}else{
				callback();
			}
		}
		b.PreviewPlay = function(chn, stream, callback){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":4,"SubType":0,"Channel":chn,"Stream":stream};
				SendMsgToPlugin(obj, callback);
			}else{
				syncCanvasSize($("#playCanvas")[0], { highDPI: true });
				function d(e){
					var f = {};
					switch (e.ret) {
						case CallBack_Error: //抛出异常
							break;
						case CallBack_Loading: //加载中
							break;
						case CallBack_Stop: //播放停止
							break;
						case CallBack_Pause: //播放暂停
							break;
						case CallBack_Playing: //播放中
							f.Ret = WEB_ERROR.ERR_SUCESS;
							f.Chn = chn;
							f.Stream = stream;
							f.oldChn = b.oldChn;
							callback(f);
							b.oldChn = chn;
							break;
						case CallBack_Finished: //播放完成
							break;
						case CallBack_Timeout: //请求超时
							break;
						case CallBack_Abort: //请求中断
							break;
						case CallBack_PlaybackMsg: //回放消息推送
							break;
						case CallBack_HttpErrMsg: //http请求异常消息推送
							break;
						case CallBack_parseFrame:
							break;
						case CallBack_playReconnect:
							break;
						case CallBack_ChangeDecodeMode:
							break;
                        case CallBack_DevicePRI_Msg:
                            try {
                                if(typeof e.message === 'string')
                                {
                                    var msgObj = JSON.parse(e.message);
                                    f.Ret = msgObj.Ret;
                                }else{
                                    f.Ret = e.message.Ret;
                                }
                            } catch (err) {
                                f.Ret = 101;
                            }
							f.Chn = chn;
							f.Stream = stream;
							f.oldChn = b.oldChn;
                            if(f.Ret!=WEB_ERROR.ERR_SUCESS&&f.Ret!=136)
                            {
                                callback(f);
                            }
                            break;
						default:
							break;
					}
				}
				var f = stream?"Sub":"Main";
				var t = "ws://";
				var m = false;
				if(window.location.protocol.indexOf("https:") != -1){
					t = "wss://";
					m = true;
				}
				var url = t+b.ip+"/websocket-bin/Type=HttpRealplay?Salt="+gNet.Salt+"&Channel="+chn+"&Stream="+f+"&XMHead=1";
				b.player.fnPlay({
					url: url, //播放地址
					isStream: true, //预览，回放,
					urlProto: "pri",
					elemVideo:$("#playCanvas")[0],
					enableHEVC:false,
					secure:m,
                    scaleMode:"cover"
				}, $("#playCanvas")[0], d, null);
			}
		}
		b.PreviewStop = function(chn, callback){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":4,"SubType":1,"Channel":chn};
				SendMsgToPlugin(obj, callback);
			}else{
                if(b.player){
                    b.player.fnDestroy();   
                }
                b.bRecord = false;
                b.bAudio = false;
				callback();
			}
		}
		b.FullScreen = function(val){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":4,"SubType":5,"FullScreen":val};
				SendMsgToPlugin(obj,function(a){});
			}else{
				b.player.fnFullscreen();
			}
		}
		b.LocalRecord = function(chn, bRecord, callback){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":4, "SubType":10};
				obj.Record = bRecord;
				obj.Channel = chn;
				SendMsgToPlugin(obj, callback);
			}else{
                var fileName = "";
                if(chn < 10){
                    fileName = "0";
                }
                fileName = fileName + chn + "_" + getCurTime(0);
				b.player.fnRecoderDownload(fileName);
				b.bRecord = !b.bRecord;
				var e = {};
				e.Record = b.bRecord;
				e.Chn = chn;
				e.Ret = WEB_ERROR.ERR_SUCESS;
				callback(e);
			}
		}
		b.LocalCapture = function(chn,callback){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":4,"SubType":9,"Channel":chn};
				SendMsgToPlugin(obj,callback);
			}else{
                var fileName = "";
                if(chn < 10){
                    fileName = "0";
                }
                fileName = fileName + chn + "_" + getCurTime(0) + ".png";
				b.player.fnCapture(fileName);
				var e = {};
				e.CapPath = "";
				e.Ret = WEB_ERROR.ERR_SUCESS;
				callback(e);
			}
		}
		b.SetSound = function(chn,callback) {
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":4,"SubType":8,"Channel":chn};
				SendMsgToPlugin(obj,callback);
			}else{
				b.player.fnChangeSound(b.bAudio?0:1);
				b.bAudio = !b.bAudio;
				var e = {};
				e.Audio = b.bAudio;
				callback(e);
			}
		}
		b.SetColor = function(nType, nValue, callback){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":4,"SubType":3,"Type":nType,"Value":nValue};
				SendMsgToPlugin(obj,callback);
			}else{
				switch(nType){
					case ColorType.ColorBrightness:{
						nValue = nValue*512/128-256;
						b.player.fnSetBrightness(nValue);
						break;
					}
					case ColorType.ColorContrast:{
						nValue = nValue*256/128;
						b.player.fnSetContrast(nValue);
						break;
					}
					case ColorType.ColorSaturation:{
						b.player.fnSetSaturation(nValue);
						break;
					}
					case ColorType.ColorHue:{
						nValue = nValue*360/128 - 180;
						b.player.fnSetHue(nValue);
						break;
					}
					case ColorType.ColorDefault:{
						b.player.fnSetDefaultColor();
						break;
					}
				}
				callback();
			}
		}
		b.ParamCapture = function(chn, callback){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":19,"SubType":chn};
				SendMsgToPlugin(obj,callback);
			}else{
				var a = {};
				a.Ret = WEB_ERROR.ERR_SUCESS;
				var curDate = new Date;
				a.url = "http://" + b.ip + "/webcapture.jpg?time="+curDate.getTime()+"&command=snap&channel=" +(chn+1) + "&user=" + b.username + "&password=" + b.password;
				callback(a);
			}
		}
		b.ColorSetPreviewPlay = function(chn, stream, callback){
			var obj = {"MainType":6,"SubType":0,"Channel":chn,"Stream":stream};
			SendMsgToPlugin(obj, callback);
		}
		b.ColorSetPreviewStop = function(callback){
			var obj = {"MainType":6,"SubType":1};
			SendMsgToPlugin(obj, callback);
		}
		b.ShowROIRegion = function(roiInfo, callback){
			var obj = {"MainType":6,"SubType":2};
			obj.RoiInfo = roiInfo;
			SendMsgToPlugin(obj, callback);
		}
		b.clearROIRegion = function(callback){
			var obj = {"MainType":6,"SubType":3};
			SendMsgToPlugin(obj, callback);
		}
		b.getROIRegion = function(callback){
			var obj = {"MainType":6,"SubType":4};
			SendMsgToPlugin(obj, callback);
		}
		b.GetSelectChannel = function(callback){
			var obj = {"MainType":4,"SubType":7};
			SendMsgToPlugin(obj, function(a){
				if(a.Chn < 0 || a.Chn >= b.loginRsp.ChannelNum){
					a.Chn = -1;
				} 
				callback(a.Chn);
			});
		}
		b.DigitalZoom = function(callback){
			var obj = {"MainType":4,"SubType":6};
			SendMsgToPlugin(obj,callback);	
		}
		b.GetColor = function(chn, callback){
			var obj = {"MainType":4,"SubType":2,"Channel":chn};
			SendMsgToPlugin(obj, callback);
		}
		b.PlayOriginal = function(callback){
			var obj = {"MainType":4,"SubType":12};
			SendMsgToPlugin(obj,callback);
		}
		b.PlayCoverWnd = function(callback){
			var obj = {"MainType":4,"SubType":13};
			SendMsgToPlugin(obj,callback);
		}
		b.PlayRatio = function(nRatio, callback){
			var obj = {"MainType":4,"SubType":18,"Ratio":nRatio};
			SendMsgToPlugin(obj,callback);
		}
		b.SetWndShowMode = function(nSplitMode, callback){
			var obj = {"MainType":3,"SubType":nSplitMode};
			SendMsgToPlugin(obj, callback);	
		}
		b.SetSelectWnd = function(nWnd, callback){
			var obj = {"MainType":11,"SubType":nWnd};
			SendMsgToPlugin(obj, callback);
		}
		b.LoadClientConfig = function(nSub,callback){
			var obj = {"MainType":18,"SubType":nSub};
			SendMsgToPlugin(obj, callback);
		}
		b.GetConfigPath = function(nSub,callback){
			var obj = {"MainType":18,"SubType":nSub};
			SendMsgToPlugin(obj, callback);
		}
		b.SaveConfigPath = function(RecPath,CapPath,DownPath,RecordType,imageType,VideoType,callback){
			var obj = {"MainType":18,"SubType":50,"RecPath":RecPath,"CapPath":CapPath,"DownPath":DownPath,"RecordType":RecordType, 
			"ImageType":imageType, "VideoType":VideoType};
			SendMsgToPlugin(obj, callback);
		}
		b.GetAllPlayStatus = function(chn, callback){
			var obj = {"MainType":4,"SubType":17,"Channel":chn};
			SendMsgToPlugin(obj,callback);
		}
		b.LocalBackPlay = function(callback) {
			var obj = {"MainType":5,"SubType":33};
			SendMsgToPlugin(obj, callback);
		}
		b.PlaybackPlay = function(playMode, chn, stream, fileinfo, nSelectWnd, callback){
			var nMode = 0;
			if(playMode == PlayBackType.PBK_TYPE_REMOTE_FILE){
				nMode = 1;
			}else if(playMode == PlayBackType.PBK_TYPE_REMOTE_TIME){
				nMode = 2;
			}
            if (WebCms.plugin.isLoaded) {
                var obj = {"MainType":5,"SubType":34,"Mode":nMode,"Channel":chn,"Stream":stream,
			    "SelectWnd": nSelectWnd, "FileInfo":fileinfo};
			    SendMsgToPlugin(obj,callback);
            }else{
                if(b.player){
                    b.player.fnDestroy();
                }
                function d(e){
					var f = {};
					switch (e.ret) {
						case CallBack_Error: //抛出异常
							break;
						case CallBack_Loading: //加载中
							break;
						case CallBack_Stop: //播放停止
                            if(typeof playbackEventCallBack === 'function'){
                                playbackEventCallBack({
                                    SubEvent: PlaybackEvent.SubEventPlaybackEnd,
                                    Ret: WEB_ERROR.ERR_SUCESS,
                                    Data: { Wnd: 0 }
                                });
                            }
							break;
						case CallBack_Pause: //播放暂停
                            if(typeof playbackEventCallBack === 'function'){
                                playbackEventCallBack({
                                    SubEvent: PlaybackEvent.SubEventPlaybackSelectWndChanged,
                                    Ret: WEB_ERROR.ERR_SUCESS,
                                    Data: { 
                                        Wnd: 0, 
                                        Status: PlayStatus.StatusPause,
                                        Mode: -1,
                                        Record: b.bRecord,
                                        Audio: b.bAudio,
                                        Zoom: false
                                    }
                                });
                            }
							break;
						case CallBack_Playing: //播放中
							//f.Ret = WEB_ERROR.ERR_SUCESS;
							//callback(f);
                            if(typeof playbackEventCallBack === 'function'){
                                playbackEventCallBack({
                                    SubEvent: PlaybackEvent.SubEventPlaybackStart,
                                    Ret: WEB_ERROR.ERR_SUCESS,
                                    Data: { Wnd: 0 },
                                    PlayIndex: 0
                                });
                                // 同时触发窗口选择事件，更新按钮状态
                                playbackEventCallBack({
                                    SubEvent: PlaybackEvent.SubEventPlaybackSelectWndChanged,
                                    Ret: WEB_ERROR.ERR_SUCESS,
                                    Data: { 
                                        Wnd: 0, 
                                        Status: PlayStatus.StatusPlaying,
                                        Mode: -1,
                                        Record: b.bRecord,
                                        Audio: b.bAudio,
                                        Zoom: false
                                    }
                                });
                                var timeTrack = document.getElementById("PlaySlider");
								var timeLabel = document.getElementById("timeLabel");
								var progressBarModal = document.getElementById("SliderBox");
								b.player.fnSetTrack(timeTrack, timeLabel, progressBarModal);
                            }
							break;
						case CallBack_Finished: //播放完成
                            if(typeof playbackEventCallBack === 'function'){
                                playbackEventCallBack({
                                    SubEvent: PlaybackEvent.SubEventPlaybackEnd,
                                    Ret: WEB_ERROR.ERR_SUCESS,
                                    Data: { Wnd: 0 }
                                });
                                if(typeof $ !== 'undefined' && $("#PlaySlider").length > 0){
									$("#PlaySlider").slider("setValue", 1000);
								}
                            }
							break;
						case CallBack_Timeout: //请求超时
							break;
						case CallBack_Abort: //请求中断
							break;
						case CallBack_PlaybackMsg: //回放消息推送
                            var duration = e.message.duration;
							var currentSec = e.message.second;
                            if(duration > 0 && currentSec >= 0)
                            {
                                var progress = Math.floor((currentSec / duration) * 1000);
								if(progress > 1000) progress = 1000;
                                if(typeof $ !== 'undefined' && $("#PlaySlider").length > 0){
									$("#PlaySlider").slider("setValue", progress);
								}
                            }
							break;
						case CallBack_HttpErrMsg: //http请求异常消息推送
							break;
						case CallBack_parseFrame:
							break;
						case CallBack_playReconnect:
							break;
						case CallBack_ChangeDecodeMode:
							break;
                        case CallBack_DevicePRI_Msg:
                            try {
                                var msgObj = JSON.parse(e.message);
                                f.Ret = msgObj.Ret;
                            } catch (err) {
                                f.Ret = 101;
                            }
                            f.Ret =  msgObj.Ret;
							f.Chn = chn;
							f.Stream = stream;
							f.oldChn = b.oldChn;
                            //callback(f);
                            break;
						default:
							break;
					}
				}
                
                var f = stream?"Sub":"Main";
				var t = "ws://";
				var m = false;
				if(window.location.protocol.indexOf("https:") != -1){
					t = "wss://";
					m = true;
				}
                var playbackOptions = {
					"Name": "HttpPlayBack",
					"HttpPlayBack": {
						"Opr": "StartPlay",
						"Channel": chn,
						"Stream": f,
						"ExactSeek": 1
					},
					"Salt": gNet.Salt
				};
                if(playMode == PlayBackType.PBK_TYPE_REMOTE_FILE && fileinfo && fileinfo.length > 0){
					// 按文件回放
					playbackOptions.HttpPlayBack.PlayMode = "PlayByName";
					playbackOptions.HttpPlayBack.PlayByName = {
						"LocalTime": fileinfo[0].BeginTime || "",
						"FileName": fileinfo[0].FileName || fileinfo[0].File || ""
					};
				}else if(playMode == PlayBackType.PBK_TYPE_REMOTE_TIME){
					// 按时间回放
					playbackOptions.HttpPlayBack.PlayMode = "PlayByTime";
					if(fileinfo && fileinfo.length > 0){
						playbackOptions.HttpPlayBack.PlayByTime = {
							"BeginTime": fileinfo[0].BeginTime || "",
							"EndTime": fileinfo[0].EndTime || ""
                            
						};
					}
				}
                var url = t+b.ip+"/websocket-bin/Type=HttpPlayBack?Salt="+gNet.Salt+"&Channel="+chn+"&Stream="+f+"&XMHead=1";
                var fnPlayConfig = {
                    url: url,
					isStream: false, 
					urlProto: "pri",
					enableHEVC:false,
					secure:m,
                    scaleMode:"cover",
                    playbackOptions: playbackOptions

                };
                if(fileinfo && fileinfo.length > 0){
					fnPlayConfig.startDate = fileinfo[0].BeginTime || "";
					fnPlayConfig.endDate = fileinfo[0].EndTime || "";
				}
				
                b.player.fnPlay(fnPlayConfig, $("#playCanvas")[0], d, null);
            }
			
		}
		b.PlaybackStop = function(chn,callback){
            if (WebCms.plugin.isLoaded){
                var obj = {"MainType":5,"SubType":35,"Channel":chn};
			    SendMsgToPlugin(obj,callback);
            }else{
                b.player.fnDestroy();
                b.bRecord = false;
                b.bAudio = false;
                if (typeof callback === 'function') {
                    callback({Ret: WEB_ERROR.ERR_SUCESS});
                }
            }
			
		}
		b.PlaybackDownload = function(filetype, chn, stream, fileinfo, callback, sEvent){
			if(sEvent == void 0){
				sEvent = "";
			}
            if (WebCms.plugin.isLoaded)
            {
                var obj = {"MainType":5,"SubType":39,"FileType":filetype,"Channel":chn,"Stream":stream,"FileInfo":fileinfo, "Event": sEvent};					
			    SendMsgToPlugin(obj,callback);
            }else{

                if (!fileinfo || fileinfo.length === 0) {
					callback({Ret: WEB_ERROR.ERR_PARAM});
					return;
				}

                b.downloadQueue = {
                    files: fileinfo,
					curIndex: 0,
					chn: chn,
					stream: stream,
					filetype: filetype,
					callback: callback,
					downloadedFiles: []
			    };
                downloadNextFile();
            }		
		}
        function downloadNextFile() {
            var queue = b.downloadQueue;
			if (!queue || queue.curIndex >= queue.files.length) {
				// 所有文件下载完成
				b.downloadQueue = null;
				return;
			}
            var curFile = queue.files[queue.curIndex];
			var fileIndex = queue.curIndex;

            b.downloadState = {
				running: true,
				totalSize: 0,
				chunks: [],
				fileName: curFile.FileName || curFile.File,
				fileSize: curFile.Size || 0,
				callback: queue.callback,
				ws: null,
				fileIndex: fileIndex,
				totalFiles: queue.files.length
			};

            if (curFile.FileLength) {
				var fileLengthStr = curFile.FileLength;
				var fileSizeKB = 0;
				if (fileLengthStr.indexOf("0x") === 0 || fileLengthStr.indexOf("0X") === 0) {
					fileSizeKB = parseInt(fileLengthStr, 16);
				} else {
					fileSizeKB = parseInt(fileLengthStr, 10);
				}
				b.downloadState.fileSize = fileSizeKB * 1024;
				console.log("=== DOWNLOAD [" + (fileIndex + 1) + "/" + queue.files.length + "] FileLength:", fileLengthStr, "=> fileSize:", b.downloadState.fileSize);
			}

            queue.callback({
				Ret: WEB_ERROR.ERR_SUCESS,
				DownPath: curFile.FileName || curFile.File,
				FileIndex: fileIndex,
				TotalFiles: queue.files.length
			});

            var streamType = queue.stream ? "Sub" : "Main";
			var wsProtocol = "ws://";
			if (window.location.protocol.indexOf("https:") !== -1) {
				wsProtocol = "wss://";
			}
			var wsUrl = wsProtocol + b.ip + "/websocket-bin/Type=HttpPlayBack?Salt=" + gNet.Salt + "&Channel=" + queue.chn + "&Stream=" + streamType + "&XMHead=1";

			var downloadOptions = {
				"Name": "HttpPlayBack",
				"HttpPlayBack": {
					"Opr": "StartDownLoad",
					"PlayMode": "PlayByName",
					"Channel": queue.chn,
					"Stream": streamType,
					"ExactSeek": 1,
					"PlayByName": {
						"LocalTime": curFile.BeginTime || "",
						"FileName": curFile.FileName || curFile.File || ""
					}
				},
				"Salt": gNet.Salt
			};
            try {
                var ws = new WebSocket(wsUrl);
                b.downloadState.ws = ws;
				ws.binaryType = 'arraybuffer';

                ws.onmessage = function(event) {
					if (event.data instanceof ArrayBuffer) {
						if (!b.downloadState || !b.downloadState.running) {
							return;
						}
						b.downloadState.chunks.push(event.data);
						b.downloadState.totalSize += event.data.byteLength;
						var fileSize = b.downloadState.fileSize || 0;
						var pos = 0;
						if (fileSize > 0) {
							pos = Math.min(1000, Math.floor((b.downloadState.totalSize / fileSize) * 1000));
						}
						if (typeof playbackEventCallBack === 'function') {
							playbackEventCallBack({
								SubEvent: PlaybackEvent.SubEventPlaybackDownloadPos,
								Ret: WEB_ERROR.ERR_SUCESS,
								Data: { 
									Pos: pos,
									FileIndex: b.downloadState.fileIndex,
									TotalFiles: b.downloadState.totalFiles
								}
							});
						}
					} else if (typeof event.data === 'string') {
						try {
							var msg = JSON.parse(event.data);
							if (msg.Ret !== undefined && msg.Ret !== 0 && msg.Ret !== 100) {
								ws.close();
							} else if (msg.Ret === 100 && msg.State === "Begin") {
								gNet.SendRequestV2("websocket", downloadOptions, true, function(resp) {
									if (resp.Ret !== undefined && resp.Ret !== 0 && resp.Ret !== 100) {
										ws.close();
									}
								});
							}
						} catch (e) {}
					}
				};

                ws.onerror = function(error) {
					console.log("=== DOWNLOAD WebSocket ERROR ===");
				};

                ws.onclose = function() {
					if (b.downloadState && b.downloadState.running) {
						var blob = new Blob(b.downloadState.chunks, {type: 'application/octet-stream'});
						var url = URL.createObjectURL(blob);
						var a = document.createElement('a');
						a.href = url;
						a.download = b.downloadState.fileName;
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						URL.revokeObjectURL(url);

						b.downloadQueue.downloadedFiles.push(b.downloadState.fileName);

						if (typeof playbackEventCallBack === 'function') {
							playbackEventCallBack({
								SubEvent: PlaybackEvent.SubEventPlaybackDownloadEnd,
								Ret: WEB_ERROR.ERR_SUCESS,
								Data: { 
									DownPath: b.downloadState.fileName,
									FileIndex: b.downloadState.fileIndex,
									TotalFiles: b.downloadState.totalFiles
								}
							});
						}

						// 继续下载下一个文件
						b.downloadState = null;
						b.downloadQueue.curIndex++;
						if (b.downloadQueue.curIndex < b.downloadQueue.files.length) {
							// 延迟一小段时间再下载下一个文件
							setTimeout(downloadNextFile, 500);
						} else {
							// 所有文件下载完成
							var queue = b.downloadQueue;
							b.downloadQueue = null;
							console.log("=== DOWNLOAD ALL COMPLETE: " + queue.downloadedFiles.length + " files ===");
						}
					} else {
						b.downloadState = null;
					}
				};

            } catch (e) {
                b.downloadState = null;
				b.downloadQueue = null;
            }
            
        }
		b.PlaybackCancelDownload = function(callback){
            if(WebCms.plugin.isLoaded){
                var obj = {"MainType":5,"SubType":46};
			    SendMsgToPlugin(obj,callback);
            }else{
                if (b.downloadState) {
                    b.downloadState.running = false;
                    if (b.downloadState.ws) {
                        b.downloadState.ws.close();
                        b.downloadState.ws = null;
                    }
                    b.downloadState.chunks = [];
                    b.downloadState = null;
                }
                if (typeof callback === 'function') {
                    callback({Ret: WEB_ERROR.ERR_SUCESS});
                }
            }
			
		}
		b.PlaybackCapture = function(chn, callback){
            if (WebCms.plugin.isLoaded) {
                var obj = {"MainType":5,"SubType":41,"Channel":chn};
			    SendMsgToPlugin(obj, callback);
            }else{
                var fileName = "";
                if(chn < 10){
                    fileName = "0";
                }
                fileName = fileName + chn + "_" + getCurTime(0) + ".png";
                b.player.fnCapture(fileName);
                var e = {};
                e.CapPath = "";
                e.Ret = WEB_ERROR.ERR_SUCESS;
                callback(e);
            }
			
		}
		b.PlaybackSound= function(chn, callback){
            if (WebCms.plugin.isLoaded){
                var obj = {"MainType":5,"SubType":42,"Channel":chn};
			    SendMsgToPlugin(obj,callback);
            }
            else{
                b.player.fnChangeSound(b.bAudio?0:1);
                b.bAudio = !b.bAudio;
				var e = {};
				e.Audio = b.bAudio;
				callback(e);
            }
			
		}
		b.PlaybackZoom = function(chn, callback){
			var obj = {"MainType":5,"SubType":43,"Channel":chn};
			SendMsgToPlugin(obj,callback);
		}
		b.PlaybackRecord = function(chn, callback){
            if(WebCms.plugin.isLoaded){
                var obj = {"MainType":5,"SubType":44,"Channel":chn};
			    SendMsgToPlugin(obj,callback);
            }else{
                var fileName = "";
                if(chn < 10){
                    fileName = "0";
                }
                fileName = fileName + chn + "_" + getCurTime(0);
                b.player.fnRecoderDownload(fileName);
                b.bRecord = !b.bRecord;
                var e = {};
                e.Record = b.bRecord;
                e.Chn = chn;
                e.Ret = WEB_ERROR.ERR_SUCESS;
                callback(e);
            }
			
		}
		b.SetPlaybackMode = function(playMode, callback){
			var nMode = 0;
			if(playMode == PlayBackType.PBK_TYPE_REMOTE_FILE){
				nMode = 1;
			}else if(playMode == PlayBackType.PBK_TYPE_REMOTE_TIME){
				nMode = 2;
			}
            if (WebCms.plugin.isLoaded) {
                var obj = {"MainType":5,"SubType":36, "Mode": nMode};
			    SendMsgToPlugin(obj, callback);  
            }else{
                callback({Ret: WEB_ERROR.ERR_SUCESS});
            }
			
		}
		b.GetPlaybackStatus = function(chn, callback){
			var obj = {"MainType":5,"SubType":45,"Channel":chn};
			SendMsgToPlugin(obj,callback);
		}
		b.SearchRecord = function( obj, callback){
	
            return gNet.SearchRecord(obj, callback);
		}
		b.PlayBackControl = function(chn, cmd, param,callback){
			if (WebCms.plugin.isLoaded) {
                var obj = {"MainType":5,"SubType":40,"Channel":chn,"Cmd":cmd,"Param":param};
                SendMsgToPlugin(obj, callback);
            } else {
                var retObj = {
                    Ret: WEB_ERROR.ERR_SUCESS,
                    Cmd: cmd,
                    ChnStatus: []
                };
                var chnStatus = {
                    Wnd: 0,
                    Ret: WEB_ERROR.ERR_SUCESS,
                    Status: PlayStatus.StatusPlaying,
                    Mode: -1
                };
                switch(cmd) {
                    case PlaybackCtrl.PlaybackPause:
                        // 暂停
                        b.player.fnPause();
                        chnStatus.Status = PlayStatus.StatusPause;
                        break;
                    case PlaybackCtrl.PlaybackFast:
                        // 快放
                        var fastSpeeds = [1.0, 2.0, 4.0, 8.0];
                        var currentIdx = fastSpeeds.indexOf(b.playbackSpeed);
                        if (currentIdx === -1 || currentIdx >= fastSpeeds.length - 1) {
                            b.playbackSpeed = fastSpeeds[1];
                        } else {
                            b.playbackSpeed = fastSpeeds[currentIdx + 1];
                        }
                        b.player.fnSetSpeed(b.playbackSpeed);
                        chnStatus.Status = PlayStatus.StatusFast;
                        chnStatus.Mode = b.playbackSpeed;
                        break;
                    case PlaybackCtrl.PlaybackSlow:
                        // 慢放
                        var slowSpeeds = [1.0, 0.5, 0.25, 0.125];
                        var currentIdx = slowSpeeds.indexOf(b.playbackSpeed);
                        if (currentIdx === -1 || currentIdx >= slowSpeeds.length - 1) {
                            b.playbackSpeed = slowSpeeds[1];
                        } else {
                            b.playbackSpeed = slowSpeeds[currentIdx + 1];
                        }
                        b.player.fnSetSpeed(b.playbackSpeed);
                        chnStatus.Status = PlayStatus.StatusSlow;
                        chnStatus.Mode = b.playbackSpeed;
                        break;
                    case PlaybackCtrl.PlaybackContinue:
                        b.player.fnResume();
                        chnStatus.Status = PlayStatus.StatusPlaying;
                        break;
                    case PlaybackCtrl.PlaybackNextFrame:
                        //下一帧
                        b.player.fnPlayNextFrame();
                        chnStatus.Status = PlayStatus.StatusNextFrame;
                        break;
                    case PlaybackCtrl.PlaybackSetPos:
                        if(b.player.m_fDurationSecs)
                        {
                            var skipTime = Math.floor((param / 1000) * b.player.m_fDurationSecs);
                            b.player.fnPlayerSkipTime(skipTime);
                        }
                        
                        break;
                    default:
                        break;
                }
                retObj.ChnStatus.push(chnStatus);
                if (typeof callback === 'function') {
                    callback(retObj);
                }
            }
		}
		b.GetTalkAbility = function(callback){
			var obj = {"MainType":16,"SubType":3};
			SendMsgToPlugin(obj,callback);
		}
		b.StartChannelTalk = function(Chn,callback){
            if (WebCms.plugin.isLoaded)
            {
                var obj = {"MainType":16,"SubType":0,"Channel":Chn};
                if(Chn != -1){
                    GetIpcDecoderPram(Chn, function(a){
                        if($.isArray(a.Audio)){
                            obj["SampleRate"] = a.Audio[0]["SR"][0];
                        }
                        SendMsgToPlugin(obj, callback);
                    });
                }else{
                    SendMsgToPlugin(obj, callback);
                }
            }
			else{
                var talkParams = {
                    "Salt": gNet.Salt,                         
                    "Channel": Chn,              
                    "XMHead": 1,                     
                    "deviceType":  gDevice.devType == devTypeEnum.DEV_IPC ? 0 : 1,           
                    "Stream": gDevice.streamTypeArr[gVar.CurChannel] == 0 ? "Main" : "Sub", 
                    "host": gDevice.ip,                         
                    "port": gDevice.httpPort
                };
                var audioParams = {
                    "sampleBits":gDevice.DecoderPram.Audio[0]["SB"][0],
                    "sampleRate":gDevice.DecoderPram.Audio[0]["SR"][0]
                }
                b.player.fnVoiceCollection(6, talkParams, audioParams, function(result) {
                    console.log("talkcallback:", result);
                    var f = {};
					switch (result.ret) {
                        case CallBack_Talk_Start:
                            f.Ret = WEB_ERROR.ERR_SUCESS;
                            break;
                        case CallBack_Talk_Failed:
                            f.Ret = 101;
                            break;
						default:
							break;
					}

                    callback(f);
                });
            }
		}
		b.StartDeviceTalk = function(callback){
            if (WebCms.plugin.isLoaded) {
                var obj = {"MainType":16,"SubType":1,"Channel":0};
                if($.isArray(gDevice.DecoderPram.Audio)){
                    obj["SampleRate"] = gDevice.DecoderPram.Audio[0]["SR"][0];
                }
                SendMsgToPlugin(obj, callback);
            }
            else{
                var talkParams = {
                    "Salt": gNet.Salt,                         
                    "Channel": gVar.CurChannel >= 0 ? gVar.CurChannel : 0,              
                    "XMHead": 1,                     
                    "deviceType":  gDevice.devType == devTypeEnum.DEV_IPC ? 0 : 1,           
                    "Stream": gDevice.streamTypeArr[gVar.CurChannel] == 0 ? "Main" : "Sub", 
                    "host": gDevice.ip,                         
                    "port": gDevice.httpPort
                };
                var audioParams = {
                    "sampleBits":gDevice.DecoderPram.Audio[0]["SB"][0],
                    "sampleRate":gDevice.DecoderPram.Audio[0]["SR"][0]
                }
                b.player.fnVoiceCollection(6, talkParams, audioParams, function(result) {
                    console.log("talkcallback:", result);
                    var f = {};
					switch (result.ret) {
                        case CallBack_Talk_Start:
                            f.Ret = WEB_ERROR.ERR_SUCESS;
                            break;
                        case CallBack_Talk_Failed:
                            f.Ret = 101;
                            break;
                        // case CallBack_DevicePRI_Msg:
                        //     break;
						default:
							break;
					}

                    callback(f);
                });
                
            }
			
		}
		b.StopTalk = function(callback){
			if (WebCms.plugin.isLoaded) {
                var obj = {"MainType":16,"SubType":1,"Channel":0};
                if($.isArray(gDevice.DecoderPram.Audio)){
                    obj["SampleRate"] = gDevice.DecoderPram.Audio[0]["SR"][0];
                }
                SendMsgToPlugin(obj, callback);
            }
            else{
                b.player.fnVoiceCollection();
                callback({Ret:WEB_ERROR.ERR_SUCESS});
            }
		}
		b.LocalAudioCtrl = function(nCmd){
			return gNet.LocalAudioCtrl(nCmd);
		}
		b.getAlarmType = function(callback){
			if(WebCms.plugin.isLoaded){
				var obj = {"MainType":15,"SubType":0};
				SendMsgToPlugin(obj,callback);
			}else{
				var a = JSON.parse(localStorage.getItem("alarm") || "{}");
                if(!isObject(a.alarmtype)){
                    a.alarmtype = {
                        "all":false,
                        "Prompt":false,
                        "Motion":false,
                        "Blind":false,
                        "Loss":false,
                        "IO":false,
                        "Analyze":false,
                        "Human":false,
                        "FaceDetect":false,
                        "DiskError":false,
                        "DiskFull":false,
                        "Carshape":false,
                        "Falldown":false,
                        "LeavePostDetect":false
                    };
                }
				a.Ret = WEB_ERROR.ERR_SUCESS;
				callback(a);
			}
		}
		b.storeAlarmType = function(obj,callback){
            if(WebCms.plugin.isLoaded){
                SendMsgToPlugin(obj,callback);
            }else{
                localStorage.setItem("alarm", JSON.stringify(obj));
                var c = {"Ret": WEB_ERROR.ERR_SUCESS};
                callback(c);
            }
		}
		b.VoiceRecord=function(type,callback){
			var obj = {"MainType": 20,"SubType": type}
			if($.isArray(gDevice.DecoderPram.Audio) && (type == CustomVoiceCmd.CVC_START_RECORD 
				|| type ==  CustomVoiceCmd.CVC_TEST_RECORD_FILE))
			{
				obj["SampleRate"] = gDevice.DecoderPram.Audio[0]["SR"][0];
			}
			SendMsgToPlugin(obj,callback);
		}
		b.sendHumanCfg = function(obj, callback){
			SendMsgToPlugin(obj, callback);
		}
		b.SendLocalFile = function(chn, FilePurpose,callback){
			var obj = {
				"MainType": 20,
				"SubType": CustomVoiceCmd.CVC_SEND_RECORD_FILE,
				"Channel": chn,
				"FilePurpose":FilePurpose
			};
			if($.isArray(gDevice.DecoderPram.Audio))
			{
				obj["SampleRate"] = gDevice.DecoderPram.Audio[0]["SR"][0];
			}
			SendMsgToPlugin(obj,callback);
		}
		b.CheckToolVersion = function(type,callback){
			var obj = {"MainType":22,"SubType":type,"Language":WebCms.web.language};
			SendMsgToPlugin(obj,callback);
		}
		b.GetSoftwareLicensesInfo = function(type, callback){
			var obj = {"MainType":37, "SubType":type};
			SendMsgToPlugin(obj, callback);
		}
		b.PTZElect= function(Chn, type, num, callback) {
			var obj = {};
			if (type == 9 || type == 10 || type == 11) {
				obj = {"MainType":24,"SubType":type, "Channel":Chn};
			} else if(type >= 6 && type <= 8){
				obj = {"MainType":24,"SubType":type, "Channel":Chn, "Preset":num};
			}else {
				obj = {"MainType":24,"SubType":type, "Channel":Chn, "Step":num};
			}
			SendMsgToPlugin(obj,callback);
		}
		b.GetProgramHardware = function(filename,callback){
			var obj = {"MainType":201,"SubType":101,"FileName":filename};
			SendMsgToPlugin(obj, callback);
		}
		b.SDKRemoteSearchDevs = function(callback){
			var obj = {"MainType": 38, "SubType": 0};
			SendMsgToPlugin(obj, callback);
		}
	}
}

function GlobalVar() {
	this.adjustBytool=0;
	this.bWebInit = false;
	this.errTitle = "";
	this.sPage = "login";
	this.childPage = "";
	this.nWeekStart = 0;
	this.runTime = {};
	this.pswMinLen = 0;
	this.pswMaxLen = 64;
	this.userNameLen = 16;
	this.skin_mColor = "rgb(50, 159, 224)";
	this.skin_bColor = "#D3E3F6";
	this.weekArr = new Array();
	this.ChangePage;
	this.nModeItem = 0;
	this.curAlarmType = 0;
	this.BrowseMenuH = 0;
	this.BrowseMenuW = 0;
	this.bShowPlugin = false;
	this.bEditTour = false;
	this.CurChannel = -1;
	this.ScalAdd = false;
	this.SupportScaleTwoLens = false;
	this.bUpgrade = false;
	this.bNewVersion = false;
	this.newVersion = "";
	this.SubPage="";
	this.bFreeze=!1;
	this.pcDpiRadio = 1.0;
	this.positionInfo={};
	this.captureUrl="";
	this.bInitBrowseFrame = !1;
	this.PrintLogEn = 1;
	this.S_Style = {
		bColor: "#6D6D6D",
		fColor: "#6D6D6D",
		controlbarFlag: "vertical",
		cellH: 18,
		cellW: 15
	};
	a(this);
	this.InitBrowseFrameInfo = function (positionInfo) {
		var browserScalingRadio = positionInfo.browserScalingRadio;
		var DisplayScalingRadio = g_BrowseType == BrowseType.BrowseChrome ? gVar.pcDpiRadio : browserScalingRadio;
		var MousePosScalingRadio = g_BrowseType == BrowseType.BrowseFirefox && g_browserVer >= 99 ? browserScalingRadio : gVar.pcDpiRadio;
		var BrowseMenuH = positionInfo.MousePos.screenY * MousePosScalingRadio - positionInfo.MousePos.clientY * browserScalingRadio - positionInfo.screenY * DisplayScalingRadio;
		var BrowseMenuW = positionInfo.MousePos.screenX * MousePosScalingRadio - positionInfo.MousePos.clientX * browserScalingRadio - positionInfo.screenX * DisplayScalingRadio;
		if (Math.abs(BrowseMenuW - gVar.BrowseMenuW) > 4 * browserScalingRadio || Math.abs(BrowseMenuH - gVar.BrowseMenuH) > 4 * browserScalingRadio) {
			gVar.BrowseMenuH = parseInt(BrowseMenuH);
			gVar.BrowseMenuW = parseInt(BrowseMenuW);
		}
	}
	this.LoadChildConfigPage = function (a,c,d,e) {
		$("#IndexObj").append($("#ipcplugin").detach());
		gVar.childPage = a;
		var f = a;
		if(c != null && c != "" && typeof c != "undefined"){
			f = c;
		}
		var g = "#chlidCfgContent";
		if(d != null && typeof d != "undefined"){
			g = d;
		}
		var p = a;
		if(a === "Alarm_SmartAlarm" && g_productID === "G2"){
			p += "_";
			p += g_productID;
		}
		WebCms.util.loadhtml({
			webUrl: "html/cfg/" + p + ".html",
			callback: function(b) {
				$(g).html(b).css("display", "block");
				SetResize(a);
				
				function loadCfgJs(){
					lan(a);
					p = f;
					if(a === "Alarm_SmartAlarm" && g_productID === "G2"){
						p += "_";
						p += g_productID;
					}
					WebCms.util.loadjs({
						webUrl: "html/cfg/" + p + ".js",
						callback: function() {
							if(f == "System_ColorParam" || gVar.SubPage == "System_ROI" || f == "IPCParam_ImageSet"){
							}else{
								if($.isFunction(e)){
									e();
								}
							}
							$('input:not([autocomplete]),textarea:not([autocomplete])').attr('autocomplete', 'off');
							if (g_BrowseType != BrowseType.BrowseChrome) {
								if (g_BrowseType != BrowseType.BrowseOpera) {
									$(".PswEyeShow").attr("type", "password");
								}
							}
						}
					})
				}
				if(f == "System_ColorParam" || f == "System_ROI" ||f == "IPCParam_ImageSet"){
					var ocxObj = "#colorsetOcx";
					if(f == "IPCParam_ImageSet"){
						ocxObj = "#imagesetOcx";
					}else if(f == "System_ROI"){
						ocxObj = "#roiSetOcx";
					}
					if ($(ocxObj).length != 0) {
						$(ocxObj).append($("#ipcplugin").detach());
						$("#ipcplugin").css({
							width: "100%",
							height: "100%"
						});
					}
					gDevice.HidePlugin(false, function(){
						loadCfgJs();
					});
				}else if(f == "Advance_Account" || (f ==  "Alarm_SmartAlarm" && g_productID != "G2") 
				|| (f == "Info_Version" && gDevice.devType != devTypeEnum.DEV_IPC)){
					var sDlg = "#add_user_group";
					var swebUrl = "html/cfg/Advance_UserDlg.html";
					if(f == "Alarm_SmartAlarm"){
						sDlg = "#SA_Advance_Dialog";
						swebUrl = "html/cfg/Alarm_AdvanceDlg.html";
					}else if(f == "Info_Version"){
						sDlg ="#DevInfo_Dialog";
						swebUrl = "html/cfg/Info_DevInfo.html";
					}
					if(gVar.bShowPlugin){
						gDevice.ColorSetPreviewStop(function(){
							gDevice.HidePlugin(true, function(){
								if($(sDlg).length > 0){
									$(sDlg).remove();
								}
								WebCms.util.loadhtml({
									webUrl: swebUrl,
									callback: function(n) {
										$("body").append(n);
										loadCfgJs();
									}
								});
							});
						});
					}else{
						if($(sDlg).length > 0){
							$(sDlg).remove();
						}
						WebCms.util.loadhtml({
							webUrl: swebUrl,
							callback: function(n) {
								$("body").append(n);
								loadCfgJs();
							}
						});
					}
				}else{
					if(gVar.bShowPlugin){
						gDevice.ColorSetPreviewStop(function(){
							gDevice.HidePlugin(true, function(){
								loadCfgJs();
							});
						});
					}else{
						loadCfgJs();
					}
				}
				
			}
		});
	}	
	function LoadLoginPage() {
		if(typeof g_productID  !== "string"){
			window.g_productID="G1";
		}
		// 取消main.js 针对密码框绑定的click事件
		$("body").unbind("click");
		$("body").on("click", ".btn_cancle,.second_close", function() {
			if(this.id=="AudioDLgClose"){
				return;
			}
			$("#SecondaryContent, #ForgetPwdContent, .dialog_role").css("display", "none");
			MasklayerHide();
		})
		if (g_BrowseType == BrowseType.BrowseChrome || g_BrowseType == BrowseType.BrowseOpera) {
			$("body").off("mousedown mouseup", ".psw_eye_arc");
			$("body").off("focus keyup", ".PswEyeShow"); 
			$("body").on("mousedown", ".psw_eye_arc", function() {
				var b = $(this).siblings("input.PswEyeShow").eq(0);
				if (b.attr("style") == "-webkit-text-security:none") {
					b.attr("style", "-webkit-text-security:disc");
					$(this).children().attr("status", "");
				} else {
					b.attr("style", "-webkit-text-security:none");
					$(this).children().attr("status", "active");
				}
			});
			$("body").on("focus keyup", ".PswEyeShow", function() {
				var b = $(this);
				$(".psw_eye_arc").css("display", "none");
				if ($(this).val() != "") {
					b.next().css("display", "block");
				} else {
					b.next().css("display", "none");
				}

				var reg = /[^\w\s\`~!@#$%^&*\(\)\-+=\[\]\{\}|;:\',.\<\>/?\\"]/g
				var tmp = b.val().replace(reg, '');
				// 不以 \ 为开始
				reg = /^[\\]*/g
				tmp = tmp.replace(reg, '');
				// 不以 \ " 为结尾
				reg = /[\\"]*$/g
				tmp = tmp.replace(reg, '');
				b.val(tmp);
			});
		}
		else{
			$("body").off("mousedown mouseup", ".psw_eye_arc");
			$("body").off("focus keyup", ".PswEyeShow");
			$("body").on("mousedown", ".psw_eye_arc", function() {
				var b = $(this).siblings("input.PswEyeShow").eq(0);
				if (b.attr("type") == "password") {
					b.attr("type", "text");
					$(this).children().attr("status", "active")
				} else {
					b.attr("type", "password");
					$(this).children().attr("status", "")
				}
			});
			$("body").on("focus keyup", ".PswEyeShow", function() {
				var b = $(this);
				$(".psw_eye_arc").css("display", "none");
				if ($(this).val() != "") {
					b.next().css("display", "block")
				} else {
					b.next().css("display", "none")
				}

				var reg = /[^\w\s\`~!@#$%^&*\(\)\-+=\[\]\{\}|;:\',.\<\>/?\\"]/g
				var tmp = b.val().replace(reg, '');
				// 不以 \ 为开始
				reg = /^[\\]*/g
				tmp = tmp.replace(reg, '');
				// 不以 \ " 为结尾
				reg = /[\\"]*$/g
				tmp = tmp.replace(reg, '');
				b.val(tmp);
			});
		}
		WebCms.util.batchloadjs([
			'crypt-js/crypto-js.min.js',
			'html/timeline.js'
		],0, function () {
			WebCms.util.loadhtml({
				webUrl:"html/login.html",
				callback:function(g){
					$("#login").html(g).css("display", "block");
					$(".login_main").css("display", "block");
					WebCms.util.loadjs({
						webUrl: "html/login.js",
						callback:function(g){
							gVar.bWebInit = true;
						}
					});
				}
			});
		});
	}
	function WebProc() {
		$(function() {
			$(".menuBox").click(function() {
				var btnId = $(this).attr("id");
				if($(this).attr("data-name") != "active"){
					$(".menuBox").attr("data-name", "");
					$(this).attr("data-name", "active");
					MasklayerShow();
					var pageId;
					var nPlayId =0;
					if(btnId == "LiveMenu"){
						pageId = "live";
						nPlayId =0;
					} else if(btnId == "PlayBackMenu"){
						pageId = "playback";
						nPlayId =1;
					} else if(btnId == "AlarmMenu"){
						pageId = "alarm";
						nPlayId =3;
					} else if(btnId == "ConfigMenu"){
						pageId = "config";
						nPlayId =2;
					} else if(btnId == "ClientMenu"){
						pageId = "client";
						nPlayId =4;
					}
					if(pageId != "live"){
						$("#wndModeBar, #StreamBar, #videoRatioBar").hide();
						$(this).attr("name", "");
					}
					if(WebCms.plugin.isLoaded){
						gDevice.HidePlugin(true, function(){
							gDevice.SetPageIndex(nPlayId, function(){
								gVar.ChangePage(pageId);
							});	
						});
					}else{
						gDevice.PreviewStop(-1, function(){
                            gVar.CurChannel = -1;
						    // 清理所有通道的播放按钮和录像状态
                            for(var i = 0; i < gDevice.loginRsp.ChannelNum; i++){
                                $("#chnMainPlay_" + i).attr("name", "");
                                $("#chnExtraPlay_" + i).attr("name", "");
                                $("#chnRecord_" + i).attr("name", "");
                            }
                            gVar.ChangePage(pageId);
                        });
					}
				}
			});
		})
	}
	function a(c) {
		c.AdjustPlugin2 = function (b, pos, callback) {
			if (gVar.bEditTour) {
				b = 1;
			}
			var req = { "MainType": 12, "SubType": b };
			if (b == 4 || b == 6) {
				req.Pos = pos;
			} else if (b == 2) {
				req.Pos = GetAbsoluteLocationEx($("#ipcplugin")[0]);
			}
			SendMsgToPlugin(req,function(rsp){callback(rsp)});
		}
		c.ChangeLang = function (g, callback) {
			if (gDevice.bInit == 0) return;
			function loadLanuage(lang){
				var url = "lg/" + lang + ".xml";
				WebCms.util.loadhtml({
					webUrl: url,
					callback: function (j) {
						gVar.XmlParsing(lg, j, "StringTable");
						if (!gVar.bWebInit) {
							WebProc();
							$("#webplugins").hide();
							CheckProgramLogoExist(function(){
								LoadLoginPage();
							});
						} else {
							lan("login");
							var h = function () {
                                $('#userName').prop('placeholder', lg.get("IDS_USERNAME"));
                                $('#loginPsw').prop('placeholder', lg.get("IDS_PSW"));
								if(typeof callback != "undefined"){
									callback();
								}
							};
							h();
						}
					}
				});
			}
			if(!gOemInfo.bInit){
				gOemInfo.init();
				if(isObject(gVar.SafetyAbility)){
					// 兼容老的设备网页，main.js加载后这个配置会自动获取
					gDevice.SafetyAbility = gVar.SafetyAbility;
					loadLanuage(WebCms.web.language);
				}else{
					var req = {"Name": "GetSafetyAbility"};
					RfParamCall(function (b, c){
						if(b.Ret == 100){
							gDevice.SafetyAbility = b;
						}else{
							gDevice.SafetyAbility = null;
						}
						loadLanuage(WebCms.web.language);
					}, "Prompt", "GetSafetyAbility", -1, WSMsgID.WsMsgID_AUTHORIZATION, req);
				}
			}else{
				gOemInfo.setCurLang(g);
				loadLanuage(WebCms.web.language);
			}
		}
		c.ChangePage = function (f) {
			$("#SecondaryContent").css("display", "none");
			var pageStatus = $("#" + f).attr("data-name");
			DebugStringEvent("old page:" + gVar.sPage + " new Page:" + f + " pageStatus:" + pageStatus);
			if ("live" == f) {
				if (gVar.sPage == f) {
					MasklayerHide();
					return;
				}
				var e = gVar.sPage;
				$(".Page").css("display", "none");
				$("#live").css("display", "block");
				c.sPage = f;
				function adjustLivePage(bLoad, ele, callback) {
					$("#liveOcx").append($("#ipcplugin").detach());
					$("#ipcplugin").css({ width: "100%", height: "100%" });
					SetResize(c.sPage);
					callback();
				}
				function LoadLivePage() {
					function d(){
						WebCms.util.loadhtml({
							webUrl: "html/live.html",
							callback: function (b) {
								$("#live").html(b).css("display", "block");
								lan("live");
								adjustLivePage(1, e, function () {
									gDevice.HidePlugin(false, function (a) {
										WebCms.util.loadjs({
											webUrl: "html/live.js",
											callback: function () {
												gVar.bFreeze = !1;
												$("#" + e).attr("data-name", "inactive");
												$("#live").attr("data-name", "active");
											}
										})
									});
								});
							}
						})
					}
					if(!WebCms.plugin.isLoaded){
                        WebCms.util.loadjs({
                            webUrl: "plugin/extend.js",
                            callback:function(b){
                                $("#ipcplugin").html('<canvas id="playCanvas"></canvas>');
                                var varList = [
                                    'Logger',
                                    'emState_Idle',
                                    'emState_Running',
                                    'emState_Pausing',
                                    'g_playDecodeType',
                                    'CallBack_Error',
                                    'CallBack_Loading',
                                    'CallBack_Stop',
                                    'CallBack_Pause',
                                    'CallBack_Playing',
                                    'CallBack_Finished',
                                    'CallBack_Timeout',
                                    'CallBack_Abort',
                                    'CallBack_PlaybackMsg',
                                    'CallBack_HttpErrMsg',
                                    'CallBack_parseFrame',
                                    'CallBack_playReconnect',
                                    'CallBack_ChangeDecodeMode',
                                    'CallBack_OutputConsole',
                                    'CallBack_DevicePRI_Msg',
                                    'CallBack_Talk_Start',
                                    'CallBack_Talk_Failed',
                                    'CallBack_Talk_Stop',
                                    'g_nLogLv_Error',
                                    'g_nLogLv_Warn',
                                    'g_nLogLv_Info',
                                    'g_nLogLv_Debug',
                                    'g_nLogLv_All'
                                ];
                                WebCms.util.importEs6Global('/common.js', varList).then(function() {
                                    WebCms.util.loadEs6Module('/player.js').then(function(module){
                                        if(gDevice.player == null){
                                            gDevice.player = new module.Player({
                                                //dir: WebCms.webplayer.downloadAddr,
                                                dir:".",
                                                appkey: "676d13fa8928d6cd2aa54e49b274a151", //鉴权配置 appKey
                                                uuid: "684a85d39476c5d206e989da", //鉴权配置 uuid
                                                appsecret: "39ec6320761b455eb56affd926427a62", //鉴权配置 appSecret
                                                movedcard: 4, //鉴权配置 movedcard
                                            });
                                        }
                                        d();
                                    });
                                });
                            }
                        });
					}else{
						d();
					}
				}
				if (pageStatus == "notLoad") {
					DebugStringEvent("LLoadLivePage begin");
					gVar.bFreeze =!0;
					LoadLivePage();
				}
				else if (pageStatus == "inactive") {
					DebugStringEvent("adjustLivePage2 begin");
					adjustLivePage(0, e, function(){
						DebugStringEvent("adjustLivePage2 end");
						gDevice.HidePlugin(false, function(a){
							$("#" + e).attr("data-name", "inactive");
							$("#live").attr("data-name", "active");
							MasklayerHide();
							var msg = {
								MainEvent:MainEventEnum.MainEventPreview,
								SubEvent:PreviewEvent.SubEventShowCorridorMode
							};
							previewEventCallBack(msg);
						});
					});
				}
			} else if ("playback" == f) {
				if (gVar.sPage == f) {
					MasklayerHide();
					return;
				}
				function LoadPlaybackPage() {
                    WebCms.util.loadhtml({
                        webUrl: "html/playback.html",
                        callback: function(b) {
                            $("#playback").html(b).css("display", "block");
                            lan("playback");
                            adjustPlaybackPage(e, function(){
                                SetResize(c.sPage);
                                WebCms.util.loadjs({
                                    webUrl: "html/playback.js",
                                    callback: function() {
                                        gVar.bFreeze =!1;
                                        $("#" + e).attr("data-name", "inactive");
                                        $("#playback").attr("data-name", "active");
                                    }
                                })
                            });
                        }
                    })
				}
				function adjustPlaybackPage(ele, callback){
					$("#playbackOcx").append($("#ipcplugin").detach());
					$("#ipcplugin").css({width: "100%",height: "100%"});
					$("#" + ele).attr("data-name", "inactive");
					$("#playback").attr("data-name", "active");
					gDevice.HidePlugin(false, function(a){
						callback();
					});
				}
				var e = gVar.sPage;
				$(".Page").css("display", "none");
				$("#playback").css("display", "block");
				c.sPage = f;
				if (pageStatus == "notLoad") {
					gVar.bFreeze =!0;
					LoadPlaybackPage();
				}
				else if (pageStatus == "inactive") {
					adjustPlaybackPage(e, function(){
						$("#" + e).attr("data-name", "inactive");
						$("#playback").attr("data-name", "active");
						SetResize(c.sPage);
						var msg = {
							MainEvent:MainEventEnum.MainEventPlayBlack,
							SubEvent:PlaybackEvent.SubEventPlaybackLayoutReset
						};
						playbackEventCallBack(msg);
					});
				}
			}else if("alarm" == f){
				if(gVar.sPage == f){
					MasklayerHide();
					return;
				}
				function adjustAlarmPage(ele){
					SetResize(c.sPage);
					$("#" + ele).attr("data-name", "inactive");
					$("#alarm").attr("data-name", "active");
					$(".alarmShowTip").hide();
				}
				var e = gVar.sPage;
				$(".Page").css("display", "none");
				$("#alarm").css("display", "block");
				c.sPage = f;
				if(pageStatus == "notLoad") {
					lan("alarm");
					adjustAlarmPage(e);
					MasklayerHide();
				}
				else if (pageStatus == "inactive") {
					adjustAlarmPage(e);
					var msg = {
						MainEvent:MainEventEnum.MainEventAlarm,
						SubEvent:AlarmEvent.SubEventAlarmInit
					};
					AlarmInfoEventCallBack(msg);
				}
			}else if ("config" == f) {
				if (gVar.sPage == f) {
					MasklayerHide();
					return;
				}
				function adjustConfigPage(ele){
					SetResize(c.sPage);
					if(c.SubPage=="System_ColorParam" || c.SubPage == "System_ROI" || c.SubPage == "IPCParam_ImageSet"){
						SetResize(c.SubPage);
					}
				}
				function LoadConfigPage() {
					WebCms.util.loadjs({
						webUrl: "plugin/schedule.js",
						callback: function() {
							WebCms.util.loadhtml({
								webUrl: "html/config.html",
								callback: function(c) {
									$("#config").html(c).css("display", "block");
									$(".content_Box").css("display", "block");
									lan("config");
									adjustConfigPage(e);
									WebCms.util.loadjs({
										webUrl: "html/config.js",
										callback: function() {
											gVar.bFreeze =!1;
											$("#" + e).attr("data-name", "inactive");
											$("#config").attr("data-name", "active");
										}
									});
								}
							})
						}
					})
				}
				var e = gVar.sPage;
				$(".Page").css("display", "none");
				$("#config").css("display", "block");
				c.sPage = f;
				if (pageStatus == "notLoad") {
					gVar.bFreeze =!0;
					LoadConfigPage();
				}else if (pageStatus == "inactive") {
					adjustConfigPage(e);
					$("#" + e).attr("data-name", "inactive");
					$("#config").attr("data-name", "active");
					$(".RemoteSet_Menu_list").each(function() {
						if ($(this).hasClass("RemoteSet_Menu_list_active")) {
							$(this).click()
						}
					})
				}
			}else if("client" == f){
				if(gVar.sPage == f){
					MasklayerHide();
					return;
				}
				function LoadClientPage() {
					WebCms.util.loadhtml({
						webUrl: "html/client.html",
						callback: function(b) {
							$("#client").html(b).css("display", "block");
							lan("client");
							WebCms.util.loadjs({
								webUrl: "html/client.js",
								callback: function() {
									gVar.bFreeze =!1;
									$("#" + e).attr("data-name", "inactive");
									$("#client").attr("data-name", "active");
								}
							})
						}
					})
				}
				var e = gVar.sPage;
				$(".Page").css("display", "none");
				$("#client").css("display", "block");
				c.sPage = f;					
				SetResize(c.sPage);
				if (pageStatus == "notLoad") {
					gVar.bFreeze =!0;
					LoadClientPage();
				}else if (pageStatus == "inactive") {
					$("#" + e).attr("data-name", "inactive");
					$("#client").attr("data-name", "active");
					var msg = {
						MainEvent:MainEventEnum.MainEventClient,
						SubEvent:ClientCofigEvent.SubEventLoadClientCofig
					};
					ClientConfigEventCallBack(msg);
				}
			}
		}
	}
	this.XmlParsing = function(g, c, e) {
		var b;
		g.refresh();
		if (g_BrowseType == BrowseType.BrowseMSIE) {
			var f = new ActiveXObject("Microsoft.XMLDOM");
			f.loadXML(c);
			if (f.childNodes[0] != null) {
				c = f
			}
		}
		if ((typeof c == "string") && c.constructor == String) {
			c = ("<xml>" + c + "</xml>")
		}
		if (g_BrowseType == BrowseType.BrowseMSIE) {
			var h = c.getElementsByTagName(e)[0].ownerDocument.getElementsByTagName("string");
			for (var d = 0; d < h.length; ++d) {
				g.set(h[d].attributes.getNamedItem("id").text, h[d].text)
			}
		} else {
			$(c).find(e).children().each(function() {
				b = $(this);
				g.set(b.attr("id"), b.text())
			})
		}
	};
}

function OemInfo() {
	this.mul = [];// 防止老网页报错
	this.langArray = [];
	this.defaultLg = "English";
	this.logo = "";
	this.skin = "";
	this.oemHeader = "";
	this.bInit = !1;
	this.init = function(){
		if(WebCms.web.oemname == "GIGA"){
			this.oemHeader = WebCms.web.oemname + "_";
		}
		var c = WebCms.web.languageList.split(" ");
		this.langArray = [];
		var d = 0;
		for (var m = 0; m < c.length; m++) {
			for (var n = 0; n < LanguageArray.length; n++) {
				if (c[m] == LanguageArray[n][0]) {
					var k = {};
					k.value = LanguageArray[n][0];
					k.text = LanguageArray[n][1];
					this.langArray[d] = k;
					d++;
					break;
				}
			}
		}

		var lang =  this.defaultLg;
        if(typeof g_devLanuage == "string"){
            lang = g_devLanuage;
        }
		lang = $.cookie("Language") || lang;

		// 获取到的预登录语言
		this.setCurLang(lang);
		this.bInit = !0;
	}
	this.setCurLang = function(lang){
		var bFind = !1;
		for(var i =0; i < this.langArray.length;i++){
			if(this.langArray[i].value == lang){
				bFind = !0;
				WebCms.web.language = lang;
				break;
			}
		}
		if(!bFind){
			WebCms.web.language = this.defaultLg;
		}
	}
}
