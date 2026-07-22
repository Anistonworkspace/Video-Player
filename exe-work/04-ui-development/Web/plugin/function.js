//# sourceURL=function.js
// 保留两位小数，不四舍五入（截断）
function toFixedNoRound(num, decimals) {
    var factor = Math.pow(10, decimals);
    return Math.floor(num * factor) / factor;
}
function getRemainPercentStr(used, total, decimals) {
    if (total <= 0) return "0%";
    var percent = (used * 1.0 / total) * 100;
    if (decimals !== undefined && decimals >= 0) {
        percent = percent.toFixed(decimals);
    } else {
        percent = Math.round(percent);
    }
    return percent + "%";
}
function getScrollTop() {
	var a = 0;
	if (document.documentElement && document.documentElement.scrollTop) {
		a = document.documentElement.scrollTop
	} else {
		if (document.body) {
			a = document.body.scrollTop
		}
	}
	return a
}
function getScrollLeft() {
	var a = 0;
	if (document.documentElement && document.documentElement.scrollLeft) {
		a = document.documentElement.scrollLeft
	} else {
		if (document.body) {
			a = document.body.scrollLeft
		}
	}
	return a
}

function writeObj(obj){ 
   var description = ""; 
   for(var i in obj){   
       var property=obj[i];   
        description+=i+" = "+property+"\n";  
   }   
    alert(description); 
}

function ExtractMask(msak, chan) {
	msak = msak.substring(2); //去掉"0x"
	var temp = msak.substr(parseInt(chan / 32) * 8, 8);
	msak = temp;
	var pos = msak.length - 1 - parseInt(chan / 4);
	msak = msak.substr(pos, 1);
	var nData = parseInt(msak, 16);
	var bit = nData & (1 << parseInt(chan % 4));
	return bit;
}
function toHex(num, n){
	var a = num.toString(16);
	var len = a.length;
	while(len < n) {
		a = "0" + a;
		len++;
	}
	return a;
}

function HexIpToDecIp(hexIp){
	var IP0 = hexIp & 0xff;
	var IP1 = "0x" + (hexIp >> 8 >>> 0).toString(16) & 0xff;
	var IP2 = "0x" + (hexIp >> 16 >>> 0).toString(16) & 0xff;
	var IP3 = "0x" + (hexIp >> 24 >>> 0).toString(16) & 0xff;
	var ip = IP0.toString() + "." + IP1.toString() + "." + IP2.toString() + "." + IP3.toString();
	return ip;
}

function DecIpToHexIp(HexIp) {
	var pp = HexIp.split(".");
	var test = new Array();
	test[0] = parseInt(pp[3]).toString(16);
	test[1] = parseInt(pp[2]).toString(16);
	test[2] = parseInt(pp[1]).toString(16);
	test[3] = parseInt(pp[0]).toString(16);
	for (var i = 0; i < 4; i++) {
		if (test[i].length < 2) {
			test[i] = "0" + test[i];
		}
	}
	var ssip = "0x" + test[0] + test[1] + test[2] + test[3];
	return ssip;
}

// 判断IP输入YESNO合理
function CheckIP(ip) {
	obj = ip;
	var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	var reg = obj.match(exp);
	if (reg == null) {
		return false;
	} else {
		return true;
	}
}

// 判断Subnet Mask输入YESNO合理
function CheckMask(mask) {
	obj = mask;
	var exp = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
	var reg = obj.match(exp);
	if (reg == null) {
		return false;
	} else {
		return true;
	}
}

// 判断输入网CloseYESNO合理
function CheckGateway(ip, mask, getway) {
	var res0 = parseInt(ip[0]) & parseInt(mask[0]);
	var res1 = parseInt(ip[1]) & parseInt(mask[1]);
	var res2 = parseInt(ip[2]) & parseInt(mask[2]);
	var res3 = parseInt(ip[3]) & parseInt(mask[3]);

	var res0_gw = parseInt(getway[0]) & parseInt(mask[0]);
	var res1_gw = parseInt(getway[1]) & parseInt(mask[1]);
	var res2_gw = parseInt(getway[2]) & parseInt(mask[2]);
	var res3_gw = parseInt(getway[3]) & parseInt(mask[3]);

	if (res0 == res0_gw && res1 == res1_gw && res2 == res2_gw && res3 == res3_gw) {
		return true;
	} else {
		return false;
	}
}

function LimitIP(b){
	var a = $(b).val();
	a = a.replace(/[^\d\.]/g,'');
	a = a.replace(/^\./g,'');
	a = a.replace("..",".");
	var e = a.charAt(a.length-1);
	var f = 0;
	if(e == '.'){
		a = a.substr(0,a.length-1);
		f = 1;
	}
	var c = a.split('.');
	var d = "";
	var size = c.length > 4?4:c.length;
	for(var i = 0;i < size;i++){
		var t = c[i].substr(0, 3);
		if(t*1 > 255){
			t = t.substr(0,2);
		}
		d+= t;
		if(i != size-1) d += ".";
	}
	if(f && i != 4) d += ".";
	$(b).val(d);
}
function isIPv4(d) {
	var a = /^0*(\d+\.)0*(\d+\.)0*(\d+\.)0*(\d+)$/;
	var b =
		/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	d = d.replace(a, "$1$2$3$4");
	return b.test(d)
}

function isIPv6(e) {
	var b = false;
	var a =
		/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
	var d = e.match(a);
	if (d) {
		return true
	} else {
		return false
	}
}

function isObject(obj){
	return null !== obj && 'object' === typeof obj;
}

function ChangeSpaceToString(Space) {
	var	unit = ["KB","MB","GB","TB"];
	var i, PointSpace;
	for(i=1, PointSpace = 0; (Space >= 1024)&&(i < 3); i++) {
		PointSpace = Space % 1024;
		Space = parseInt(Space / 1024);
	}
	var strSpace = "" + Space + "." + prefixInteger(parseInt(PointSpace * 100 /1024),2) + unit[i];
	return strSpace;
}

var cloneObj = function (obj) {  
    var newObj = {};  
    if (obj instanceof Array) {  
        newObj = [];  
    }  
    for (var key in obj) {  
        var val = obj[key]; 
        if(typeof val === 'object' && val != null ) {
			newObj[key] = cloneObj(val);
		}else{
			newObj[key] =  val;
		} 
    }
    return newObj;  
}

function PtInPolygon (p, ptPolygon, nCount) {
	// 交点个数  
	var nCross = 0;
	for (var i = 0; i < nCount; i++) {
		var p1 = ptPolygon[i];
		var p2 = ptPolygon[(i + 1) % nCount];// 点P1与P2形成连线 
		if ( p1.y == p2.y )
			continue;
		if ( p.y < Math.min(p1.y, p2.y) )
			continue;
		if ( p.y >= Math.max(p1.y, p2.y) )
			continue;
		// 求交点的x坐标（由直线两点式方程转化而来）
		var x = 1.0 *(p.y - p1.y) * (p2.x - p1.x) /(p2.y - p1.y) + p1.x;
		// 只Countp1p2与p向右射线的交点  
		if ( x > p.x ){
			nCross++;
		}
	}
	if ((nCross % 2) == 1){
		return true;
	}else{
		return false;
	}
}

function checkSpecialCharacter(inValue){
	var tmp = inValue.replace(/[.\[\]\%\&]/g, '');
	return tmp;
}

function getHiddenProp() {
	var arr = ["webkit", "moz", 'ms', 'o'];
	if ("hidden" in document) {
		return "hidden";
	}
	for (var i = 0x0; i < arr["length"]; i++) {
		if (arr[i] + "Hidden" in document) {
			return arr[i] + "Hidden";
		}
	}
	return null;
}

function GetDevicePixelRatio(){
	return window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
}

function GetPageOffset() {
	var bGetPos = window.pageXOffset !== undefined;
	var bStandard = (document.compatMode || '') === "CSS1Compat";
	var posX = bGetPos ? window.pageXOffset : bStandard ? document.documentElement.scrollLeft:
		document.body.scrollLeft;
	var posY = bGetPos ? window.pageYOffset : bStandard ? document.documentElement.scrollTop:
		document.body.scrollTop;
	return {
		'x': posX,
		'y': posY
	};
}

function GetAbsoluteLocationEx(ele) {
	if (ele == null) {
		return null;
	}
	
	var u = GetDevicePixelRatio();
	var a = GetPageOffset();
	var q = ele.getBoundingClientRect();
	var offsetT = ele.offsetTop;
	var offsetL = ele.offsetLeft;
	while (ele = ele.offsetParent) {
		offsetT += ele.offsetTop;
		offsetL += ele.offsetLeft;
		offsetT-=ele.scrollTop;
		offsetL-=ele.scrollLeft;
	}
	
	var t = {
		Left: q.left > 0 ? q.left : 0,
		Top: q.top > 0 ? q.top : 0,
		Width: q.width,
		Height: q.height
	}

	if (q.left < 0) {
		t.Width += q.left;
	}
	if (q.top < 0) {
		t.Height += q.top;
	}
	if ((q.height + offsetT) > (window.innerHeight + a.y))
		t.Height -= ((q.height + offsetT) - (window.innerHeight + a.y));
	if ((q.width + offsetL) > (window.innerWidth + a.x))
		t.Width -= ((q.width + offsetL) - (window.innerWidth + a.x));

	t.Left *= u;
	t.Top *= u;
	t.Width *= u;
	t.Height *= u;
	if(!gVar.adjustBytool){
		t.Top += gVar.BrowseMenuH;
		if (g_BrowseType != BrowseType.BrowseFirefox) {
			t.Left += gVar.BrowseMenuW;
		}
	}
	t.Left = Math.round(t.Left);
	t.Top = Math.round(t.Top);
	t.Width = Math.round(t.Width);
	t.Height = Math.round(t.Height);

	return t;
}

function ltrim(str){
	if(str==""||str==undefined){
		return "";
	}
	var n=0;
	for(var i=0,length=str.length;i<length;i++){
		var c=str.charAt(i);
		if(c!=" "){ 
			break;
		}
		n++;
	}
	return str.substring(n);
}

function rtrim(str){
	if(str==""||str==undefined){
		return "";
	}
	var n=str.length;
	for(var i=str.length-1;i>=0;i--){
		var c=str.charAt(i);
		if(c!=" "){ 
			break;
		}
		n--;
	}
	return str.substring(0,n);
}

function trim(str){
	return rtrim(ltrim(str));
}

function ValidateNumber(e) {
	var pnumber = $(e).val();
	if (!/^[1-9]\d*$/.test(pnumber)) {
		var tmp = /^[1-9]\d*/.exec($(e).val());
		if(tmp == null){
			tmp = 1;
		}
		$(e).val(tmp);
	}

	if(e[0].id == "EmailPort"){
		if (parseInt(pnumber) >= 65535) {
			e[0].value = 65535;
		}
	} else if (e[0].id == "YTAddr") {
		if( parseInt(pnumber) >= 255) {
			$(e).val(255);
		}
	}
}

function textSize(fontSize,fontFamily,text){
	var span = document.createElement("span");
	var result = {};
	result.width = span.offsetWidth;
	result.height = span.offsetHeight;
	span.style.visibility = "hidden";
	span.style.fontSize = fontSize;
	span.style.fontFamily = fontFamily;
	span.style.display = "inline-block";
	document.body.appendChild(span);
	if(typeof span.textContent != "undefined"){
		span.textContent = text;
	}else{
		span.innerText = text;
	}
	result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
	result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
	span.textContent = "";
	span.innerText = "";
	return result;
}

function GetTotalSeconds(strTime){
	var a = strTime.split(" ");
	var SysBDate = a[0];
	var SysBTime = a[1];
	var b = SysBDate.split("-");
	var c = SysBTime.split(":");
	var d = Date.UTC(b[0]*1, b[1]*1, b[2]*1, c[0]*1, c[1]*1, c[2]*1)/1000;
	return d;
}

function randomNum(minNum,maxNum){ 
	switch(arguments.length){ 
		case 1: 
			return parseInt(Math.random()*minNum+1,10); 
		break; 
		case 2: 
			return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
		break; 
			default: 
				return 0; 
			break; 
	} 
}

function randomASCII16() {
	var s = '';
	for (var i = 0; i < 16; i++) {
	  s += String.fromCharCode(48 + Math.floor(Math.random() * 43));
	}
	return s;
}

function getCurTime(a){
	var newDate = new Date();
	var newMonth = newDate.getMonth() + 1;
	if (newMonth < 10) {
		newMonth = "0" + newMonth;
	}
	var newDay = newDate.getDate();
	if (newDay < 10) {
		newDay = "0" + newDay;
	}
	var newHour = newDate.getHours();
	if (newHour < 10) {
		newHour = "0" + newHour;
	}
	var newMinute = newDate.getMinutes();
	if (newMinute < 10) {
		newMinute = "0" + newMinute;
	}
	var newSecond = newDate.getSeconds();
	if (newSecond < 10) {
		newSecond = "0" + newSecond;
	}
    if(a == 0){
        return "" + newDate.getFullYear() + newMonth + newDay + "_" + newHour + newMinute + newSecond;
    }else{
        return "" + newDate.getFullYear() + "-" + newMonth + "-" + newDay + " " + newHour + ":" + newMinute + ":" + newSecond;
    }
}

function str2Date(strDate){
	var fullDate = strDate.split(" ")[0].split("-");
	var fullTime = strDate.split(" ")[1].split(":");
	return new Date(fullDate[0], fullDate[1]-1, fullDate[2], (fullTime[0] != null ? fullTime[0] : 0), (fullTime[1] != null ? fullTime[1] : 0), (fullTime[2] != null ? fullTime[2] : 0));
}

function toHtmlEncode(str){
	function a(ori){
		switch (ori) {
			case ' ': return "&nbsp;"; //space
			case '\"': return "&quot;"; //"
			case '\&': return "&amp;"; //&
			case '\'': return "&#x27;"; //'
			case '\\': return "&#x2F;"; ///
			case '\<': return "&lt;"; //<
			case '\>': return "&gt;"; //>
			default: return ori;
		}
	}
	if(typeof str!="string"){
		return str;
	}
	var retStr="";
	for(var i = 0; i < str.length; i++){
		retStr = retStr + a(str[i]);
	}
	return retStr;

}
function antiXSS(obj){
	function ergodicJSON(obj){
		if(obj!=null&&typeof obj=="object"){
			$.each(obj,function(key,value){
				if(typeof obj[key]=="object"){
					ergodicJSON(obj[key]);
				}
				if(typeof value=="string"){
					obj[key]=toHtmlEncode(value);
				}
			})
		}
	}
	ergodicJSON(obj)
}

function postJson(url, data, onSuccess, onError) {
    return $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(data || {}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 3000,
        cache: false,
        success: onSuccess || $.noop,
        error: onError || function(xhr) {
        }
    });
}

function syncCanvasSize(canvas, options) {
	const highDPI = options.highDPI || false;
	const dpr = highDPI ? (window.devicePixelRatio || 1) : 1;
	
	// 获取 CSS 显示尺寸（不含单位）
	const displayWidth = canvas.clientWidth;
	const displayHeight = canvas.clientHeight;
	
	// 设置实际渲染尺寸（物理像素）
	canvas.width = displayWidth * dpr;
	canvas.height = displayHeight * dpr;
  }

function ReadLocalFile(fileObj, callback){
	var file = fileObj;
	var reader = new FileReader();
	var fileLength = file.size;
	var filePos = 0;
	if(file == null){
		return;
	}
	var i_stream_size = 0;
	reader.onload = function() {
		filePos += this.result.byteLength;
		callback(this.result);
		if(filePos >= fileLength){
			DebugStringEvent("file is read end");
		}
	}
	reader.onloadend = function(){
	}
	var sPos = filePos;
	var ePos = fileLength;
	var file_slice;
	if (file.slice) {
	    file_slice = file.slice(sPos, ePos);
	}
	if (file.mozSlice) {
	    file_slice = file.mozSlice(sPos, ePos);
	}
	if (file.webkitSlice) {
	    file_slice = file.webkitSlice(sPos, ePos);
	}
	reader.readAsArrayBuffer(file_slice);
}

function GetFunAbility(sAbility){
	return sAbility == true ? true : false;
}

function base64ToBytes(b64) {
    // 1. Base64 → crypto-js WordArray
    var wa = CryptoJS.enc.Base64.parse(b64);

    // 2. WordArray → Uint8Array
    var len = wa.sigBytes;
    var u8 = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        // 从 32-bit 小端字里取单BYTE
        u8[i] = (wa.words[Math.floor(i / 4)] >>> (24 - (i % 4) * 8)) & 0xFF;
    }
    return u8;          // 需要 ArrayBuffer 就再返回 u8.buffer
}
function bytesToBase64(bin){
	var wa = CryptoJS.lib.WordArray.create(bin);
    var b64 = CryptoJS.enc.Base64.stringify(wa);
	return b64;
}

function SaveFileToLocal(content, filename) {
	// 字符内容转变成blobAddress
	var stype = "";
	if(filename.match(/.csv/ig)){
		stype = "data:text/csv;charset=utf-8";
	}
	var blob = new Blob([content], {type:stype});
	if(g_BrowseType == BrowseType.BrowseMSIE){
		if(window.navigator.msSaveOrOpenBlob){
		  window.navigator.msSaveOrOpenBlob(blob, filename);
		}  
	}else{
		// 创建隐藏的可Download链接
		var eleLink = document.createElement('a');
		eleLink.download = filename;
		eleLink.style.display = 'none';
		eleLink.href = URL.createObjectURL(blob);
		// 触发点击
		document.body.appendChild(eleLink);
		eleLink.click();
		// 然后移除
		document.body.removeChild(eleLink);
	}
};

function SetCurComboData(ComBoxID, data){
	var nSel = -1;
	$(ComBoxID).children("option").each(function(){
		if($(this).val()*1 == data){
			nSel = $(this).val()*1;
			$(ComBoxID).val(nSel);
			return nSel;
		}
	});

	return nSel;
}

function CheckPasswordStrength(strPwd){
	if (strPwd == ""){
		return PASSWORD_STRENTH.DANGER;
	}

	// 弱密码Parity
	var WeakPwdList = [
		"123", "1234", "12345", "123456", "1234567", "12345678", "123456789", "1234567890",
		"147258369", "987654321", "123123", "123321", "654321", "123456a", "114514",
		"letmein", "admin", "admin123", "password", "password1", "qwerty", "qwer123456",
		"qwertyuiop", "11111111", "00000000", "123123123", "88888888", "111111111", "66666666",
		"aaaaaaaa", "Million2", "picture1", "asdfghjkl", "senha", "abc123", 
		"iloveyou", "aaron431", "qqww1122", "omgpop"
	];
	for (var i = 0; i < WeakPwdList.length; i++){
		if (strPwd == WeakPwdList[i]){
			return PASSWORD_STRENTH.DANGER;
		}
	}

	var  pwdlen = strPwd.length;

	//密码Length为1，直接YESdanger
	//密码Length为2，如果两个字符相同就YESdanger，不同就YESweak
	//密码Length大于等于3，YES常见的弱密码就YESdanger，NO则往后判断字符Type数
	//字符Type数为1，Length  3-5:weak   6-8:medium   >8:strong
	//字符Type数为2，Length  3  :weak   4-6:medium   >6:strong
	//字符Type数为3，Length             3-4:medium   >4:strong
	//字符Type数为4，Length                         >=4:strong

	// 通用限制
	var minlen = gDevice.devType == devTypeEnum.DEV_IPC ? 2 : 5;
	var samecharweak = 7;
	var onecharTypeNumWeak = 6;
	var onecharTypeNumMedium = 9;
	var onecharTypeNumStrong = 17;
	var onecharTypeWeak = 3;
	var onecharTypeMedium = 6;
	var onecharTypeStrong = 9;
	var twocharTypeWeak = 3;
	var twocharTypeMedium = 4;
	var twocharTypeStrong = 7;
	var threecharTypeMedium = 3;
	var threecharTypeStrong = 5;

	if (pwdlen <= minlen){
		return PASSWORD_STRENTH.DANGER;
	}

	//Min别标记密码中YESNO存At：Digital、小写字母、大写字母、其它字符
	var typeFlag = [0, 0, 0, 0];
	for(var j = 0; j < pwdlen; j++){
		if(strPwd[j]>='0' && strPwd[j]<='9'){
			typeFlag[0]++;
		}else if(strPwd[j]>='a' && strPwd[j]<='z'){
			typeFlag[1]++;
		}else if(strPwd[j]>='A' && strPwd[j]<='Z'){
			typeFlag[2]++;
		}else{
			typeFlag[3]++;
		}
	}

	var charTypeCnt = 0;
	for (var k = 0; k < 4; k++){
		if (typeFlag[k] > 0){
			charTypeCnt++;
		}
	}

	if (charTypeCnt == 1){
		// 重复检查
		if(typeFlag[0] == pwdlen || typeFlag[1] == pwdlen || typeFlag[2] == pwdlen || typeFlag[3] == pwdlen)
		{
			var bRepeat = true;
			for(var i = 0; i < pwdlen; i++)
			{
				if(strPwd[0] != strPwd[j]){
					bRepeat = false;
					break;
				}
			}
			if(bRepeat){
				return pwdlen > samecharweak ? PASSWORD_STRENTH.WEAK : PASSWORD_STRENTH.DANGER;
			}
		}

		if(typeFlag[0] > 0)
		{
			if(pwdlen < onecharTypeNumWeak){
				return PASSWORD_STRENTH.DANGER;
			}else if(pwdlen >= onecharTypeNumWeak && pwdlen < onecharTypeNumMedium)
			{
				return PASSWORD_STRENTH.MEDIUM;
			}else if(pwdlen >= onecharTypeNumMedium && pwdlen < onecharTypeNumStrong)
			{
				return PASSWORD_STRENTH.MEDIUM;
			}else{
				return PASSWORD_STRENTH.STRONG;
			}
		}
		else
		{
			if (pwdlen >= onecharTypeWeak && pwdlen < onecharTypeMedium){
				return PASSWORD_STRENTH.WEAK;
			}else if (pwdlen >= onecharTypeMedium && pwdlen < onecharTypeStrong){
				return PASSWORD_STRENTH.MEDIUM;
			}else{
				return PASSWORD_STRENTH.STRONG;
			}
		}
	}else if (charTypeCnt == 2){
		if(pwdlen >= twocharTypeWeak && pwdlen < twocharTypeMedium){
			return PASSWORD_STRENTH.WEAK;
		}else if (pwdlen >= twocharTypeMedium && pwdlen < twocharTypeStrong){
			return PASSWORD_STRENTH.MEDIUM;
		}else{
			return PASSWORD_STRENTH.STRONG;
		}
	}else if (charTypeCnt == 3){
		if (pwdlen >= threecharTypeMedium && pwdlen < threecharTypeStrong){
			return PASSWORD_STRENTH.MEDIUM;
		}else{
			return PASSWORD_STRENTH.STRONG;
		}
	}else{
		return PASSWORD_STRENTH.STRONG;
	}
}

function CPswStrength(b) {
	var a = CheckPasswordStrength(b);
	$(".progress-bar_wrap .progress-bar_item").each(function() {
		$(this).removeClass("PasswordStrength_Danger");
		$(this).removeClass("PasswordStrength_Weak");
		$(this).removeClass("PasswordStrength_Medium");
		$(this).removeClass("PasswordStrength_Strong");
	});
	if (a == PASSWORD_STRENTH.DANGER){
		$(".progress-bar_wrap .progress-bar_item").removeClass("active");
		$(".progress-bar_item-0").addClass("PasswordStrength_Danger");
		$(".progress-bar_text").text(lg.get("IDS_CAM_DANGER")).css("color", "#FF4B47")
	}else if (a == PASSWORD_STRENTH.WEAK) {
		$(".progress-bar_wrap .progress-bar_item").removeClass("active");
		$(".progress-bar_item-0").addClass("PasswordStrength_Weak");
		$(".progress-bar_item-1").addClass("PasswordStrength_Weak");
		$(".progress-bar_text").text(lg.get("IDS_CAM_WEAK")).css("color", "#FF4B47")
	} else if(a == PASSWORD_STRENTH.MEDIUM){
		$(".progress-bar_wrap .progress-bar_item").removeClass("active");
		$(".progress-bar_wrap span:not(.progress-bar_item-3)").addClass("PasswordStrength_Medium");
		$(".progress-bar_text").text(lg.get("IDS_CAM_MIDD")).css("color", "#F9AE35")
	} else if (a == PASSWORD_STRENTH.STRONG) {
		$(".progress-bar_wrap .progress-bar_item").each(function() {
			$(this).addClass("PasswordStrength_Strong")
		});
		$(".progress-bar_text").text(lg.get("IDS_CAM_STRONG")).css("color", "#2DAF7D")
	}
}

function closeDialog(){
	$(".dialog_role").css("display", "none");
	MasklayerHide();
}

function SetWndTop(obj, nTop, nLeft){
	nTop = nTop == void 0 ? 0 : nTop;
	var nHeight = $(".headerMenu").height() + nTop;
	$(obj).css("top", nHeight+'px');
	nLeft = nLeft == void 0 ? 20: nLeft;
	if(nLeft != 0){
		$(obj).css("left", nLeft + '%');
	}
}

function PluginsMove(a) {
	$("#IndexObj").css({
		width: "0px",
		height: "0px"
	})
}

function SetResize(f) {
	var i = (f === "live" || f === "login") ? 0 : 60;
	$(".container").css({
		"margin-left": i,
		"margin-right": i,
	});
	var d = document.body.offsetWidth;
	var h = document.body.offsetHeight;
	var c = $(".header").outerHeight(true);
	var e = $(".mfoot").height();
	
	switch (f) {
		case "live":
			var b = d - i * 2;
			var g = h - c - e;
			var s = 48;
			document.getElementById("live").style.height = g + "px";
			document.getElementById("live").style.width = b + "px";
			$(".channelListBox").css("left", s+'px');
			$(".rightContent").css("right", s+'px');
			$(".centerContent").css({ left: 220+s, right: 220+s});
			PluginsMove($("#liveOcx"));
            if (!WebCms.plugin.isLoaded && $("#playCanvas").length > 0) {
				syncCanvasSize($("#playCanvas")[0], { highDPI: true });
			}
			break;
		case "playback":
			var b = d - i * 2;
			document.getElementById("playback").style.width = b + "px";
			var g = h - c - e;
			document.getElementById("playback").style.height = g + "px";
			PluginsMove($("#playbackOcx"));
			$("#pbControlBtn_Box").css("width", $("#playbackOcx").width()*1 +"px");
			//$("#SliderBox").css("width", ($("#playbackOcx").width()*1-42*10-30)+"px");
			//$("#PlaySlider").slider("resize");
			break;
		case "alarm":
		case "client":
			var b = d - i * 2;
			document.getElementById(f).style.width = b + "px";
			var g = h - c - e;
			document.getElementById(f).style.height = g + "px";
			if(f == "alarm"){
				var contentH = $("#AlarmList .table-responsive").height()-$("#AlarmList .table-head").height();
				$("#AlarmList .table-content").css("height", contentH+'px');
				var table = $("#AlarmTable")[0];
				var nRowNum = table.rows.length; 
				if(nRowNum * 30 > contentH){
					$("#AlarmList .table-head").css("padding-right",  TableRightPadding + "px");
				}else{
					$("#AlarmList .table-head").css("padding-right",  "0px");
				}
			}
			PluginsMove($("#IndexObj"))
			break;
		case "config":
			var b = d - i * 2;
			document.getElementById(f).style.width = b + "px";
			var g = h - c - e;
			document.getElementById(f).style.height = g + "px";
			PluginsMove($("#IndexObj"))
			
			var nMenu = 0;
			var menus = $("#"+f).find(".RemoteSet_Menu");//
			for(var i = 0; i < menus.length; i++){
				if(menus.eq(i).css("display") != "none"){
					nMenu++;
				}
			}
			var listBoxH = g - 2 - nMenu * 50;
			$(".RemoteSet_Menu_listBox").css("max-height", listBoxH + "px").css("overflow-x", "hidden");
			
			break;
		case "Alarm_Motion":
			PluginsMove($("#MotionSP"))
			break;
		case "System_ColorParam":
		case "System_ROI":
		case "IPCParam_ImageSet":
			var containerHeight=$(".cfg_container").height()-20;
			containerHeight=containerHeight<0?0:containerHeight;
			var pluginHeight=250;
			if(containerHeight<pluginHeight){
				pluginHeight=containerHeight;
			}
			var ocxId = "colorsetOcx";
			if (f == "IPCParam_ImageSet"){
				ocxId = "imagesetOcx";
			}else if(f =="System_ROI") {
				ocxId = "roiSetOcx";
			}
			document.getElementById(ocxId).style.height = pluginHeight+"px";
			break;
		default:
			if (g_BrowseType != BrowseType.BrowseMSIE) {
				PluginsMove($("#IndexObj"))
			}
			break
	}
	if($("#"+f).parent().prop("id") == "System_NetService_item"){
		SetNetServiceSize();
	}

	var a = document.getElementById("MaskLayout");
	a.style.width = document.body.offsetWidth + "px";
	a.style.height = document.body.offsetHeight + "px"
}

function RenderSencondShow(e, b, d, a) {
	$("#SecondaryContent #content_title").text(e);
	$("#SecondaryContent .content_container").html(b);
	if (d) {
		$("#SecondaryContent").removeClass().addClass(d)
	} else {
		$("#SecondaryContent").removeClass()
	}
	MasklayerShow();
	$("#SecondaryContent").show();
	if (a != undefined) {
		if (a) {
			$(".second_close").show();
			$("#btn_confirm_ok").css("width", "auto");
		} else {
			$(".second_close").hide();
			$("#btn_confirm_ok").css("width", "90%");
			$(".btn_cancle").css("display", "none");
		}
	}
}

function RebootDev(title, tip, c){
	var dataHtml = '<div class="confirm_prompt"><div>\n' +
	'                    <div class="confirm_str">'+tip+'</div>\n' +
	'                </div>' +
	'<div class="btn_box">\n' +
	'    <input type="button" class="btn" id="btn_confirm_ok" value='+lg.get("IDS_OK")+' />\n' +
	'    <input type="button" class="btn btn_cancle" value='+lg.get("IDS_CANCEL")+' />' +
	'</div></div>';

	RenderSencondShow(title,dataHtml,'Tips_Content',c);

	$("#btn_confirm_ok").unbind().click(function(){
		$("#RemoteReboot").prop("disabled",true);
		$('#SecondaryContent').css("display", "none");
		MasklayerHide();
	
		var req = { 
		"Name" : "OPMachine", 
		"OPMachine" : { "Action" : "Reboot" }
		};

		RfParamCall(function(a,b){
			if (a.Ret == 100 || a.Ret == -2){
				ShowPaop(title, lg.get("IDS_DVR_REBOOT"));
				$("#RemoteReboot").prop("disabled", false);
				window.setTimeout(function() {
					AutoClose(title)
				}, 1000);
			}else {
				ShowPaop(title, lg.get("IDS_SEND_FAILED"));
				$("#RemoteReboot").prop("disabled", false);
			}
		}, "", "OPMachine", -1, WSMsgID.WSMsgID_SYSMANAGER_REQ, req);
	});
}

function encodePassword(psw){
	var psw2 = "";
	if(psw.length > 0){
		var basePsw = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(psw));
		var ch1= basePsw[0];
		var ch2 = basePsw[basePsw.length-1];
		var swapPsw=basePsw.substring(1,basePsw.length-1);
		psw2 = "00"+ prefixInteger(basePsw.length-1,2)+ch2 + swapPsw + ch1;
	}
	return psw2;
}

function ShowMask(ev, mask){
	$(ev).css({
		"background-color": "transparent",
		color: "inherit"
	});
	$(ev).each(function (i) {
		var tempmask = ExtractMask(mask, i);
		if (tempmask) {
			$(this).mousedown().mouseup();
		}
	});
}

function GetMasks(divItems){
	var color = gVar.skin_mColor;
	var mask;
	var nArr = [0,0,0,0];
	$(divItems).each(function (i) {
		bCheckd = ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, "") && $(this).css("display") != "none") ? 1 : 0;
		var m = parseInt(i/16);
		var n = i % 16;
		nArr[m] |= bCheckd << n;
	});
	if(gDevice.loginRsp.ChannelNum > 32){
		mask="0x"+toHex(nArr[1], 4) + toHex(nArr[0], 4)+toHex(nArr[3], 4)+toHex(nArr[2], 4);;
	}else{
		mask="0x"+toHex(nArr[1], 4) + toHex(nArr[0], 4);
	}
	
	return mask;
}

function GetMasksNormal(divItems){
	var color = gVar.skin_mColor;
	var mask;
	var nArr = [0,0,0,0];
	$(divItems).each(function (i) {
		bCheckd = ($(this).css("background-color").replace(/\s/g, "") == color.replace(/\s/g, "") && $(this).css("display") != "none") ? 1 : 0;
		var m = parseInt(i/16);
		var n = i % 16;
		nArr[m] |= bCheckd << n;
	});

	mask="0x"+toHex(nArr[3], 4) + toHex(nArr[2], 4)+toHex(nArr[1], 4)+toHex(nArr[0], 4);;

	return mask;
}

function GetSingleChnMasks(bCheckd, chn){
	var mask;
	var nArr = [0,0,0,0];
	var m = parseInt(chn/16);
	var n = chn % 16;
	nArr[m] |= bCheckd * 1 << n;		
	if(gDevice.loginRsp.ChannelNum > 32){
		mask="0x"+toHex(nArr[1], 4) + toHex(nArr[0], 4)+toHex(nArr[3], 4)+toHex(nArr[2], 4);;
	}else{
		mask="0x"+toHex(nArr[1], 4) + toHex(nArr[0], 4);
	}
	
	return mask;
}
function SetAlarmLinkAllEnable(CfgData){
	if(GetFunAbility(gDevice.Ability.OtherFunction.NoSupportMulityAlarmLink)){
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
		if(CfgData[CfgData.Name].EventHandler.SnapEnable){
			CfgData[CfgData.Name].EventHandler.SnapShotMask="0xffffffffffffffff";
		}else{
			CfgData[CfgData.Name].EventHandler.SnapShotMask="0x0";
		}
	}
}

function SetNetServiceSize(){
	var $item = $("#System_NetService_item");
	var menuW = $item.width();
	$item.find(".content-menu-item").css("display", "");
	var b = $item.find(".content-menu-item");
	var childW = 0;
	
	$item.find(".arrow_left, .arrow_right").css("display", "none");
	for (var i = 0; i < b.length; i++) {
		childW += $(b[i]).width() + 15 * 2 + 3;
	}
	
	childW = Math.ceil(childW);
	if(childW + 1 <= menuW){
		$item.attr("leftIndex", 0);
		$item.attr("rightIndex", b.length - 1);
	}else{
		var leftIndex = $item.attr("leftIndex") * 1;
		var rightIndex = $item.attr("rightIndex") * 1
		var h = leftIndex;
		rightIndex = (rightIndex >= b.length - 4) ? (b.length - 1) : rightIndex;
		childW = 0;
		if(leftIndex == 0){
			for (h; h < b.length; h++) {
				childW += $(b[h]).width() + 15 * 2 + 3;				
				if(childW + 26 >= menuW){
					$item.attr("rightIndex", (h-1));
					$item.find(".arrow_right").css("display", "");
					break;
				}
			}
			if(h < b.length){
				for(h; h < b.length; h++){
					$(b[h]).css("display", "none");
				}
			}else{
				$item.attr("rightIndex", b.length - 1);
			}
		}else if(rightIndex == b.length - 1){
			h = rightIndex;
			$item.attr("rightIndex", rightIndex);
			for(; h >= 0; h--){
				childW += $(b[h]).width() + 15 * 2 + 3;				
				if(childW + 26 >= menuW){
					$item.attr("leftIndex", h + 1);
					$(".arrow_left").css("display", "");
					break;
				}
			}
			
			if(h >= 0){
				for(var j = 0; j <= h; j++){
					$(b[j]).css("display", "none");
				}
			}else{
				$item.attr("leftIndex", 0);
			}
		}else{
			for(var j = 0; j < h; j++){
				$(b[j]).css("display", "none");
			}
			$item.find(".arrow_left").css("display", "");
			for (h; h < b.length; h++) {
				childW += $(b[h]).width() + 15 * 2 + 3;				
				if(childW + 26 * 2 >= menuW){
					$item.attr("rightIndex", (h-1));
					$item.find(".arrow_right").css("display", "");
					break;
				}
			}
			if(h < b.length){
				for(h; h < b.length; h++){
					$(b[h]).css("display", "none");
				}
			}else{
				$item.attr("rightIndex", b.length - 1);
			}
		}	
	}
}
function closewnd(a) {
	if(a == 2){
		MasklayerShow();
		gDevice.resetKeepAlive();
		gDevice.resetReconnect();
		gDevice.LogoutDev(function(b){
			MasklayerHide();
			if(g_BrowseType == BrowseType.BrowseMSIE){
				window.opener = null;
				window.open("", "_self");
				window.close();
			}else{
				window.location.href = "about:blank";
				window.close();
			}
		});
	}else{
		MasklayerShow();
		gDevice.resetKeepAlive();
		gDevice.resetReconnect();
		gDevice.LogoutDev(function(b){
			MasklayerHide();
			window.location.reload(true);
		});
	}
}

function GetLocalVoiceTipType(Alarm_Type, callback){
	if (GetFunAbility(gDevice.Ability.OtherFunction.SupportCustomLocalAlarmAudio)){
		var sName = "Ability.LocalVoiceTipType";
		if(Alarm_Type != "" && isObject(gDevice.LocalVoiceTipType[Alarm_Type])){
			var cfg = gDevice.LocalVoiceTipType[Alarm_Type];
			if($.isArray(cfg) && $.inArray(-2, cfg) >= 0){
				callback();
				return;
			}
		}
		gDevice.GetMsg(WSMsgID.WsMsgID_CONFIG_GET, sName,function(a){
			if (typeof a == "string") {
				a=JSON.parse(a);
			}
			if(a.Ret == 100){
				gDevice.LocalVoiceTipType = a[a.Name];
			}
			callback();
		});
	}else{
		callback();
	}
}

function ShowChildConfigFrame(Paop, bShow, bRetResult){
	try{
		if(bRetResult){
			$(".cfg_container").css("visibility", "visible");
		}else{
			if(Paop != "live" && Paop != "main" && Paop != "Security" && Paop != "Prompt"){
				var state = bShow?"visible":"hidden";
				$(".cfg_container").css("visibility", state);
			}
		}
	}catch(e){

	}
}
function RfParamCall(CallBack, Paop, Name, nChannel, cmd, jsonData, bHideTip, bRetResult) {
	bHideTip = bHideTip == void 0?false:bHideTip;
	bRetResult = bRetResult == void 0?false:bRetResult;
	if (Name == null || typeof Name == 'undefined' || !jQuery.isFunction(CallBack)) {
		return (null);
	}
	if(!bHideTip){
		MasklayerShow();
	} 
	{
		var bSave = false;
		if(cmd == WSMsgID.WsMsgID_CONFIG_CHANNELTILE_SET || cmd == WSMsgID.WsMsgID_CONFIG_SET || cmd == WSMsgID.WSMsgID_DSIKMANAGER_REQ
		 || cmd == WSMsgID.WSMsgID_ADDUSER_REQ || cmd == WSMsgID.WSMsgID_MODIFYUSER_REQ || cmd == WSMsgID.WSMsgID_DELETEUSER_REQ
		 || cmd == WSMsgID.WSMsgID_MODIFYPASSWORD_REQ || cmd == WSMsgID.WSMsgID_ADDGROUP_REQ || cmd == WSMsgID.WSMsgID_MODIFYGROUP_REQ
		 || cmd == WSMsgID.WSMsgID_DELETEGROUP_REQ || cmd == WSMsgID.WSMsgID_LOGSEARCH_REQ
		 || cmd == WSMsgID.WSMsgID_SET_DIG_IP_REQ || cmd == WSMsgID.WsMsgID_AUTHORIZATION ||
		(cmd >= WSMsgID.WSMsgID_GET_INTELL_ABILITY && cmd <= WSMsgID.WSMsgID_SET_INTELL_ALL_INFO_REQ) ||
		cmd == WSMsgID.WsMsgID_FILE_TRANS_REQ || cmd == WSMsgID.WsMsgID_UPGRADE_REQ 
		|| cmd == WSMsgID.WSMsgID_NET_MAILTEST_REQ || cmd == WSMsgID.WSMsgID_NET_FTPTEST_REQ
		|| cmd == WSMsgID.WsMsgID_SYSTEM_DEBUG_REQ || cmd == WSMsgID.WSMsgID_NET_LOCALSEARCH_REQ 
		|| cmd == WSMsgID.WSMsgID_GET_IPC_SYSINFO_REQ || cmd == WSMsgID.WSMsgID_SET_IPC_REBOOT_REQ
		|| cmd == WSMsgID.WSMsgID_OSD_MENU || cmd == WSMsgID.WSMsgID_FLOW_REQ){
			bSave  = true;
		}else if(cmd == WSMsgID.WSMsgID_SYSMANAGER_REQ){
			if(Name == "OPTimeSetting" || Name == "OPLogManager" || Name=="OPUTCTimeSetting") bSave = true;
			if(Name == "OPDefaultConfig" || Name == "OPMachine" || Name == "OPVersionReq") bSave = true;
		}
		if(!bSave){
			var fname = Name;
			if(nChannel != -1) {
				fname += ".[" + nChannel + "]";
			}
			gDevice.GetMsg(cmd, fname, function(a){
				if(bHideTip){
					CallBack(a);
				}else{
					if(Name == "MotionArea" || Name == "PMS.num" || Name == "MaxPreRecord" 
					|| Name == "NetWork.DigTimeSyn" || Name == "VencMaxFps" || Name == "EncStaticParam" 
					|| Name == "NetOrder" || Name == "HumanRuleLimit" || Name == "" || Name == "ConfigExport" 
					|| Name == "System.ExUserMap" || Name == "NetUse.DigitalEncode" || bRetResult){
						ShowChildConfigFrame(Paop, true, bRetResult);
						CallBack(a);
						return;
					}
					
					if(a.Ret == 100){
						ShowChildConfigFrame(Paop, true, bRetResult);
						CallBack(a);
					}else if(a.Ret == 107){
						ShowChildConfigFrame(Paop, false, bRetResult);
						MasklayerHide();
						ShowPaop(Paop, lg.get("IDS_NO_POWER"));
					}else{
						ShowChildConfigFrame(Paop, false, bRetResult);
						MasklayerHide();
						ShowPaop(Paop, lg.get("IDS_REFRESH_FAILED"));
					}
				}
			})
		}else{
			gDevice.SendMsg(cmd, jsonData, function(a){			
				if(bHideTip){
					CallBack(a);
				}else{
					MasklayerHide();
					if(cmd == WSMsgID.WSMsgID_GET_INTELL_ABILITY || cmd == WSMsgID.WSMsgID_GET_INTELL_INFO_REQ 
					|| cmd == WSMsgID.WsMsgID_AUTHORIZATION || cmd == WSMsgID.WSMsgID_NET_MAILTEST_REQ 
					|| cmd == WSMsgID.WSMsgID_NET_FTPTEST_REQ || cmd == WSMsgID.WSMsgID_GET_IPC_SYSINFO_REQ 
					|| bRetResult){
						CallBack(a);
						return;
					}
					
					if(a.Ret == 100 || a.Ret == 603 || a.Ret == 150){
						CallBack(a);
					}else{
						if(a.Ret == -2){
							if(cmd == WSMsgID.WSMsgID_SYSMANAGER_REQ){
								CallBack(a);
							}else{
								ShowPaop(Paop, lg.get("IDS_RECEIVE_TIMEOUT"));
							}
						}else if (a.Ret == 107){
							ShowPaop(Paop, lg.get("IDS_NO_POWER"));
						}else{
							var errTip = lg.get("IDS_SAVE_FAILED");
							if(a.Ret == 606 && (Name.indexOf("Detect.") >= 0 || Name.indexOf("Alarm.LocalAlarm") >= 0 || Name.indexOf("Alarm.IPCAlarm") >= 0)){
								var eventHandler = jsonData[jsonData.Name].EventHandler;
								if(typeof(eventHandler) != "undefined" && eventHandler.AlarmOutLatch < 10){
									errTip = lg.get("IDS_ALARMDELAY_TIP");
								}
							}
							ShowPaop(Paop, errTip);
						}
					}
				}
			})
		}
	}
}

function GetAlarmToneType(Alarm_Type,Alarm_tone,AbAlarmToneType,AbAlarmTone){
	var flag = true;
	$(AbAlarmToneType).empty();
	$(AbAlarmTone).empty();
	if (GetFunAbility(gDevice.Ability.OtherFunction.SupportCustomLocalAlarmAudio)) {
		if (isObject(gDevice.LocalVoiceTipType[Alarm_Type])) {
			$(AbAlarmToneType).append('<option class="option" value="1">' + lg.get("IDS_VOICE_PROMPT") + '</option>');
			for (var i = 0; i < gDevice.LocalVoiceTipType[Alarm_Type].length; i++) {
				for (var j = 0; j < gDevice.LocalVoiceTipType.VoiceTip.length; j++) {
					if (gDevice.LocalVoiceTipType.VoiceTip[j].VoiceEnum == gDevice.LocalVoiceTipType[Alarm_Type][i]) {
						$(AbAlarmTone).append('<option class="option" voiceEnum="' + gDevice.LocalVoiceTipType.VoiceTip[j].VoiceEnum + '" value="' + i + '">' + gDevice.LocalVoiceTipType.VoiceTip[j].VoiceText + '</option>');
						flag = false;
					}
				}
			}
		} else {
			$(AbAlarmToneType).append('<option class="option" value="1">' + lg.get("IDS_VOICE_PROMPT") + '</option>');
			$(AbAlarmTone).append('<option class="option" voiceEnum="' + gDevice.LocalVoiceTipType.VoiceTip[0].VoiceEnum + '" value="' + 0 + '">' + gDevice.LocalVoiceTipType.VoiceTip[0].VoiceText + '</option>');
			flag = false;
		}
	}
	if (!GetFunAbility(gDevice.Ability.TipShow.NoBeepTipShow)) {
		$(AbAlarmToneType).append('<option class="option" value="2">' + lg.get("IDS_BUZZER") + '</option>');
		flag = false;
	}
	$(AbAlarmToneType).append('<option class="option" value="3">' + lg.get("IDS_SHUTDOWN") + '</option>');
	if (flag) {
		$(Alarm_tone).css("display", "none");
	}
}
function ChangeVoiceType(AbAlarmToneType,AlarmSpan){
	if (!GetFunAbility(gDevice.Ability.OtherFunction.SupportCustomLocalAlarmAudio) && GetFunAbility(gDevice.Ability.TipShow.NoBeepTipShow)){
		return;
	}
	if($(AbAlarmToneType).val()*1==1){
		if(!WebCms.plugin.isLoaded){
			$(AlarmSpan +"> button").hide();
		}
		$(AlarmSpan).css("display","");
	}else{
		$(AlarmSpan).css("display","none");
	}
}
function SaveAlarmToneType(EventHandler,AbAlarmToneType,AbAlarmTone){
	if (!GetFunAbility(gDevice.Ability.OtherFunction.SupportCustomLocalAlarmAudio) && GetFunAbility(gDevice.Ability.TipShow.NoBeepTipShow)){
		return;
	}
	do{
		var AlarmToneType=$(AbAlarmToneType).val()*1;
		if(AlarmToneType==3){
			if(GetFunAbility(gDevice.Ability.OtherFunction.SupportCustomLocalAlarmAudio)){
				EventHandler.VoiceEnable=false;
			}
			if(!GetFunAbility(gDevice.Ability.TipShow.NoBeepTipShow)){
				EventHandler.BeepEnable=false;
			}
			break;
		}
		if(GetFunAbility(gDevice.Ability.OtherFunction.SupportCustomLocalAlarmAudio)){
			if(AlarmToneType==1){
				EventHandler.VoiceEnable=true;
				if(!GetFunAbility(gDevice.Ability.TipShow.NoBeepTipShow)){
					EventHandler.BeepEnable=false;
				}
				var VoiceType=$(AbAlarmTone).find("option:selected").attr("voiceEnum")*1;
				EventHandler.VoiceType=isNaN(VoiceType)?EventHandler.VoiceType:VoiceType;
			}
		}
		if(!GetFunAbility(gDevice.Ability.TipShow.NoBeepTipShow)){
			if(AlarmToneType==2){
				EventHandler.BeepEnable=true;
				if(GetFunAbility(gDevice.Ability.OtherFunction.SupportCustomLocalAlarmAudio)){
					EventHandler.VoiceEnable=false;
				}
			}
		}
	}while(false)
}
function SetAlarmToneType(EventHandler,AbAlarmToneType,AbAlarmTone){
	if (!GetFunAbility(gDevice.Ability.OtherFunction.SupportCustomLocalAlarmAudio) && GetFunAbility(gDevice.Ability.TipShow.NoBeepTipShow)){
		return;
	}
	var ret=-1;
	if(EventHandler.VoiceEnable){
		ret=SetCurComboData(AbAlarmToneType,1);
		$(AbAlarmTone).val($(AbAlarmTone+" option[voiceEnum='"+EventHandler.VoiceType+"']").val());
	}else if(EventHandler.BeepEnable){
		ret=SetCurComboData(AbAlarmToneType,2);
	}else{
		SetCurComboData(AbAlarmToneType,3);
	}
	if(ret==-1){
		SetCurComboData(AbAlarmToneType,3);
	}
}
function ShowVoiceCustomDlg(chn,cmd,pageTitle,callback){
	var oprType = 0;
	var KeepMaskLayer=cmd.KeepMaskLayer;
	var FilePurpose=cmd.FilePurpose;
	Audio_Title.innerHTML = lg.get("IDS_CUSTOM_AUDIO");
	Remainning_Time_Left.innerHTML = lg.get("IDS_ALARM_REMAINING_TIME");
	StartRecAudioBtn.innerHTML = lg.get("IDS_ALARM_RECORD_START");
	StopRecAudioBtn.innerHTML = lg.get("IDS_ALARM_STOP_RECORD");
	PlayRecAudioBtn.innerHTML = lg.get("IDS_ALARM_TEST_LISTEN");
	SendAudioBtn.innerHTML = lg.get("IDS_ALARM_SEND_RECORD");
	function DisableAllRecBtn(){
		$("#StartRecAudioBtn").addClass("btn-disable");
		$("#StartRecAudioBtn").prop("disabled", true);
		$("#StopRecAudioBtn").addClass("btn-disable");
		$("#StopRecAudioBtn").prop("disabled", true);
		$("#PlayRecAudioBtn").addClass("btn-disable");
		$("#PlayRecAudioBtn").prop("disabled", true);
		$("#SendAudioBtn").addClass("btn-disable");
		$("#SendAudioBtn").prop("disabled", true);
	}
	function EnableAllRecBtn(){
		$("#StartRecAudioBtn").removeClass("btn-disable");
		$("#StartRecAudioBtn").prop("disabled", false);
		$("#StopRecAudioBtn").addClass("btn-disable");
		$("#StopRecAudioBtn").prop("disabled", true);
		$("#PlayRecAudioBtn").removeClass("btn-disable");
		$("#PlayRecAudioBtn").prop("disabled", false);
		$("#SendAudioBtn").removeClass("btn-disable");
		$("#SendAudioBtn").prop("disabled", false);
	}
	RemainTimeCallback = function (a) {
		if(a.SubEvent == VoiceCustomEvent.SubEventVoiceRecordPos){
			Remaining_Time_Right.innerHTML = a.Pos;
		}else if(a.SubEvent == VoiceCustomEvent.SubEventVoiceRecordEnd){
			EnableAllRecBtn();
			Remaining_Time_Right.innerHTML = 5;
		}else if(a.SubEvent == VoiceCustomEvent.SubEventVoiceSendEnd){
			EnableAllRecBtn();
			$("#AudioDLgClose").click();
			if (a.Ret == 100) {
				ShowPaop(pageTitle, lg.get("IDS_ALARM_AUDIO_SEND_SUC"));
			}else {
				ShowPaop(pageTitle,getCodeErrorString(a.Ret));
			}
		}else if(a.SubEvent == VoiceCustomEvent.SubEventVoiceTestEnd){
			EnableAllRecBtn();
		}
	}
	$("#StartRecAudioBtn").unbind().click(function () {
		DisableAllRecBtn();
		gDevice.VoiceRecord(CustomVoiceCmd.CVC_START_RECORD, function (obj) {
			if (obj.Ret == 100) {
				$("#StopRecAudioBtn").removeClass("btn-disable");
				$("#StopRecAudioBtn").prop("disabled", false);
			} else {
				EnableAllRecBtn();
				ShowPaop(pageTitle, lg.get("IDS_ALARM_START_RECORD_FAIL"));
			}
		});
	})
	$("#StopRecAudioBtn").unbind().click(function () {
		DisableAllRecBtn();
		gDevice.VoiceRecord(CustomVoiceCmd.CVC_STOP_RECORD, function (obj) {});
	})
	$("#PlayRecAudioBtn").unbind().click(function () {
		DisableAllRecBtn();
		gDevice.VoiceRecord(CustomVoiceCmd.CVC_TEST_RECORD_FILE, function (obj) {
			if (obj.Ret != 100) {
				EnableAllRecBtn();
				ShowPaop(pageTitle, lg.get("IDS_ALARM_TEST_FAIL"));
			}
		});
	})
	$("#SendAudioBtn").unbind().click(function () {
		DisableAllRecBtn();
		gDevice.SendLocalFile(chn,FilePurpose, function (obj) {
			if (obj.Ret != 100) {
				EnableAllRecBtn();
				ShowPaop(pageTitle, getCodeErrorString(obj.Ret));
			}
		});
	})
	$("#AudioDLgClose").unbind().click(function () {
		DisableAllRecBtn();
		gDevice.VoiceRecord(CustomVoiceCmd.CVC_STOP_RECORD, function (obj) {
			gDevice.VoiceRecord(CustomVoiceCmd.CVC_STOP_TEST, function (obj) {
				EnableAllRecBtn();
				$("#Audio_dialog").css("display", "none");
				if($.isFunction(callback)){
					callback();
				}
				if (!KeepMaskLayer) {
					MasklayerHide();
				}
			});
		});
	})
	MasklayerShow(1);
	$("#StopRecAudioBtn").addClass("btn-disable");
	$("#StopRecAudioBtn").prop("disabled", true);
	$("#Audio_dialog").css("width", '650px');
	$("#Audio_dialog").show();
}
function getStrBytes (str) {
	if (str == null || str === undefined) return 0;
	if (typeof str != "string") {
		return 0;
	}
	var total = 0, charCode, i, len;
	for (i = 0, len = str.length; i < len; i++) {
		charCode = str.charCodeAt(i);
		if (0x00000000 <= charCode && charCode <= 0x0000007f) {
			total += 1;
		} else if (0x00000080 <= charCode && charCode <= 0x000007FF) {
			total += 2;
		} else if (0x00000800 <= charCode && charCode <= 0x0000FFFF) {
			total += 3;
		} else if (0x00010000 <= charCode && charCode <= 0x001FFFFF) {
			total += 4;
		} else if (0x00200000 <= charCode && charCode <= 0x03FFFFFF) {
			total += 5;
		} else if (0x04000000 <= charCode && charCode <= 0x7FFFFFFF) {
			total += 6;
		}
	}
	return total;
}
function BytesRangeMax(b, e) {
	var value = $(b).val();
	while (getStrBytes(value) > e) {
		value = value.substring(0, value.length - 1);
	}
	$(b).val(value);
}
function AesEncrypt(data,obj, callback) {
	try {
		var key = CryptoJS.enc.Utf8.parse(obj.key); 
		var iv = CryptoJS.enc.Utf8.parse(obj.iv);
		var src= CryptoJS.enc.Utf8.parse(data);
		var encrypted = CryptoJS.AES.encrypt(src, key,{iv: iv,mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.ZeroPadding});
		var str=encrypted.toString()
		if($.isFunction(callback)){
			callback(str);
		}
	} catch (error) {
		console.error("key:"+obj.key+" iv:"+obj.iv+" data:"+data);
		str = data;
	}

    return str;     
}
function AesDecrypt(data,obj,callback) {
	var decrypted;
	var str;
	try{
		var key = CryptoJS.enc.Utf8.parse(obj.key);
		var iv = CryptoJS.enc.Utf8.parse(obj.iv);
		decrypted=CryptoJS.AES.decrypt(data,key,{iv:iv,mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding});
		str=decrypted.toString(CryptoJS.enc.Utf8)
		if($.isFunction(callback)){
			callback(str);
		}
	}catch(error){
		try {
			str=decrypted.toString(CryptoJS.enc.Latin1)
			if($.isFunction(callback)){
				callback(str);
			}
		} catch (error) {
			console.error("key:"+obj.key+" iv:"+obj.iv+" data:"+data);
			str = data;
		}
	}
    return str;     
}

function GetRandomFunc(callback){
	var req = {
		"Name": "GetDevInfo"	
	}
	RfParamCall(function(a, b){
		if(a.Ret != 100){
			callback(null);
			return;
		}
		var SN = a[a.Name].SerialNo;
		var req = {
			"Name": "GetRandomUser"	
		}
		RfParamCall(function(a, b){
			if(a.Ret != 100){
				callback(null);
				return;
			}
			var data = "";
			if(typeof a[a.Name].InfoUser != "undefined"){
				data = a[a.Name].InfoUser;
			}else{
				data = a[a.Name].Info;
			}
			var decrypted;
			var str;
			var obj = {
				"key" : SN.substring(5,11) + SN.substring(1, 7) + SN.substring(8, 12),
				"iv" : ""
			};
			try{
				var key = CryptoJS.enc.Utf8.parse(obj.key);
				var iv = CryptoJS.enc.Utf8.parse(obj.iv);
				decrypted = CryptoJS.AES.decrypt(data,key,{iv:iv,mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding});
				str = decrypted.toString(CryptoJS.enc.Utf8)
			}catch(error){
				try {
					str = decrypted.toString(CryptoJS.enc.Latin1)
				} catch (error) {
					callback(null);
					return;
				}
			}
			var obj = {};
			obj.RandomUser = str.split(" ")[0].split(":")[1];
			obj.RandomPwd = str.split(" ")[1].split(":")[1];
			callback(obj);
		}, "", "GetRandomUser", -1, WSMsgID.WsMsgID_AUTHORIZATION, req, true);
	}, "", "GetDevInfo", -1, WSMsgID.WsMsgID_AUTHORIZATION, req, true);
}

function updatePositionInfo(event,from)
{
	gVar.positionInfo.screenX=window.screenX || window.screenLeft;
	gVar.positionInfo.screenY=window.screenY || window.screenTop;
	if(g_BrowseType == BrowseType.BrowseFirefox && gVar.positionInfo.screenX == -8
		&& gVar.positionInfo.screenY == -8) {
		gVar.positionInfo.screenX=0;
		gVar.positionInfo.screenY=0;
	}
	gVar.positionInfo.MousePos={};
	gVar.positionInfo.MousePos.clientX=event.clientX;
	gVar.positionInfo.MousePos.clientY=event.clientY;
	gVar.positionInfo.MousePos.screenX=event.screenX;
	gVar.positionInfo.MousePos.screenY=event.screenY;
	gVar.positionInfo.browserScalingRadio=GetDevicePixelRatio();
}
var g_incrementMsgID=0;
function SendMsgToPlugin(msg, callback) {
	msg.Id = gDevice.WebsocketID;
	msg.MsgID=g_incrementMsgID++;
	gBrowseCtrl.callback=callback;
	gBrowseCtrl.msgCallback[msg.MsgID] = function (rsp) { callback&&callback(rsp); delete gBrowseCtrl.msgCallback[msg.MsgID];};
	if (!gBrowseCtrl.sendMessage(msg)) {
		callback({ Ret: WEB_ERROR.ERR_UNCONNECTED });
	}
	return "";
}

function CheckProgramFileExist(url, callback){
	var path = url + "?version=" + version_web;
	$.ajax({
		url: path,
		type: "GET",
		contentType:"application/x-www-form-urlencoded;charset=utf-8",
		datatype: "application/json",
		async:true,
		timeout:5000,
		success: function(f, g) {
			if(f.match(/404 File Not Found/ig)){
				callback(-1, g);
			}else{
				callback(100, g);
			}
		},
		error: function(f, g) {
			callback(-1, g);
		}
	});
}

function CheckProgramLogoExist(callback){
	CheckProgramFileExist("/LoginTopLogo.png", function(a, b){
		if(a == 100){
			gDevice.programLogo.bLoginTopLogo = true;
		}
		CheckProgramFileExist("/logo.png", function(a, b){
			if(a == 100){
				gDevice.programLogo.bLogo = true;
			}
			callback();
		});
	});
}



function GetIpcSystemFunction(nChn, callback) {
	if (gDevice.devType == devTypeEnum.DEV_IPC || nChn < gDevice.loginRsp.VideoInChannel) {
		callback(gDevice.Ability);
	}else {
		var ch = nChn - gDevice.loginRsp.VideoInChannel;
		var b = {
			"Name": "bypass@SystemFunction.[" + ch + "]"
		};
		b.SessionID = "0x" + toHex(gDevice.nSessionID, 8);
		gNet.SendRequestV2("getchannelability", b, false, function (a) {
			if(a["Ret"] == 100){ 
				callback(a[a.Name]);
			}
			else{
				callback(void 0);
			}
		}, 3000);
	}
}
function GetIpcDecoderPram(nChn, callback) {
	if (gDevice.devType == devTypeEnum.DEV_IPC || nChn < gDevice.loginRsp.VideoInChannel) {
		callback(gDevice.DecoderPram);
	}else{
		GetIpcSystemFunction(nChn, function (a) {
			if(a == undefined){
				callback({});
			}else{
				var ch = nChn - gDevice.loginRsp.VideoInChannel;
				var b = {
					"Name": "bypass@DecoderPram.[" + ch + "]"
				};
				b.SessionID = "0x" + toHex(gDevice.nSessionID, 8);
				gNet.SendRequestV2("getchannelability", b, false, function (a) {
					if(a["Ret"] == 100){ 
						callback(a[a.Name]);
					}
					else{
						callback({});
					}
				}, 3000);
			}
		});
	}
}
function GetIpcSoftVersion(nChn, callback) {
	if (gDevice.devType == devTypeEnum.DEV_IPC || nChn < gDevice.loginRsp.VideoInChannel) {
		callback(gDevice.loginRsp.SoftWareVersion);
	} else {
		var req = {"Name": "OPFileUpgradeIPCReq","OPFileUpgradeIPCReq":{"Channel": nChn}};
		req.SessionID = "0x" + toHex(gDevice.nSessionID, 8);
		gNet.SendRequestV2("getconfig", req, false, function(a){
			if(a.Ret == 100){
				callback(a[a.Name].SoftWareVersion);
			}else{
				if (GetFunAbility(gDevice.Ability.OtherFunction.SupportAPPGetCameraVersion)) {
					var b = {
						"Name": "CameraVersionInfo.[" + nChn + "]"
					};
					b.SessionID = "0x" + toHex(gDevice.nSessionID, 8);
					gNet.SendRequestV2("getconfig", b, false, function (a) {
						if (a.Ret == 100) {
							callback(a[a.Name]["SoftWareVersion"]);
						} else {
							callback("");
						}
					}, 3000);
				} else {
					callback("");
				}
			}
		});
	}
}
function CheckCustomIPC(nChn, callback) {
	if (gDevice.devType != devTypeEnum.DEV_IPC && nChn < gDevice.loginRsp.VideoInChannel) {
		callback(false);
		return;
	}
	GetIpcSoftVersion(nChn, function (strSoftVersion) {
		var bSupportOnvif = true;
		var verisonList = strSoftVersion.split(".");
		if (verisonList.length == 7) {
			var cOvifServer = verisonList[4];
			if (cOvifServer[3] == '0') {
				bSupportOnvif = false;
			}
		} else {
			bSupportOnvif = true;  //获取不To默认Supportonvif
		}
		GetIpcSystemFunction(nChn, function (a) {
			if(a == undefined){
				callback(false);
			}
			else{
				var bFlag1 = !GetFunAbility(a.OtherFunction.SupportTraditionalPtzNormalDirect) && GetFunAbility(a.NetServerFunction.NetWifi) && !bSupportOnvif;
				var bFlag2 = GetFunAbility(a.OtherFunction.SupportConsumerPtzMirrorDirect);
				callback(bFlag1 || bFlag2);
			}
		});
	})
}
function CheckTranditionalPTZNormalDirect(nChn, callback) {
	if (gDevice.devType != devTypeEnum.DEV_IPC && nChn < gDevice.loginRsp.VideoInChannel) {
		callback(true);
		return;
	}
	GetIpcSystemFunction(nChn, function (a) {
		if(a == undefined){
			callback(false);
		}
		else{
			callback(a && a["OtherFunction"] && a["OtherFunction"]["SupportTraditionalPtzNormalDirect"]);
		}
	});
}

function ShowPeriod(timeSection, nAlarmType,KeepMask,callback){
	var tsCpy = timeSection;
	var tsCfg = cloneObj(timeSection);
	var color = "#59BB60";
	var strWeek = [lg.get("IDS_WD_Sunday"), lg.get("IDS_WD_Monday"),lg.get("IDS_WD_Tuesday"),
	lg.get("IDS_WD_Wednesday"),lg.get("IDS_WD_Thursday"),lg.get("IDS_WD_Friday"),
	lg.get("IDS_WD_Saturday")];
	$("#WeekChild, #dayList").empty();
	for(var i = 0; i < 7; i++){
		$("#WeekChild").append('<option value="'+ i +'">'+ strWeek[i] +'</option>');
		$("#dayList").append('<li value="'+ i +'">'+ strWeek[i] +'</li>');
	}
	$("#WeekChild").append('<option value="7">'+ lg.get("IDS_CFG_ALL") +'</option>');
	$(".time-div input").prop("maxlength", 2);
	var d = new Date();
	var weekIndex = d.getDay();
	$("#WeekChild").val(weekIndex);
	ShowTime(weekIndex);
	
	function ShowTime(nIndex){
		if(nIndex == 7){
			nIndex = 0;
		}
		for (var i = 1; i <= 4; ++i) {
			var sect = tsCfg[nIndex][i - 1].split(" ");
			if (sect[0] == "1") {
				$("#SectCheck" + i).prop("checked", true);
			} else {
				$("#SectCheck" + i).prop("checked", false);
			}
			var tSect = sect[1].split("-");
			var btSect = tSect[0].split(":");
			var etSect = tSect[1].split(":");
			$("#StartHour" + i).val(btSect[0]);
			$("#StartMinute" + i).val(btSect[1]);
			$("#EndHour" + i).val(etSect[0]);
			$("#EndMinute" + i).val(etSect[1]);
		}
	}
	InitTimeSect();
	function InitTimeSect(){
		var c = document.getElementById("ts_cvs1");
		var ctx = c.getContext("2d");
		ctx.clearRect(0,0,c.width,c.height);

		ctx.fillStyle = "#949FBB";
		for(var i = 0; i < 7; i++){
			for(var j = 0; j < 12; j++){
				var left = j * 40 + j * 2;
				var top = i * 20 + i * 5;
				ctx.fillRect(left, top, 40, 20);
			}
		}	
	}

	ShowTimeSection();
	function ShowTimeSection(){
		var c = document.getElementById("ts_cvs2");
		var ctx = c.getContext("2d");
		ctx.clearRect(0,0,c.width,c.height);
		ctx.fillStyle = color;
		var xPos =0;
		var yPos = 0;
		for (var i = 0; i < 7; ++i) {
			for (var j = 0; j < 4; j++){
				var itime = tsCfg[i][j];
				if(itime[0] == "0") continue;
				itime = itime.split(" ");
				itime = itime[1].split("-");
				var itime1 = itime[0].split(":");
				var itime2 = itime[1].split(":");
				var minGap = (parseInt(itime2[0], 10) - parseInt(itime1[0], 10)) * 60 + parseInt(itime2[1], 10) - parseInt(itime1[1], 10);
				if(minGap < 0) continue;
				
				var begin = parseInt(itime1[0], 10) * 60 + parseInt(itime1[1], 10);
				var end = parseInt(itime2[0], 10) * 60 + parseInt(itime2[1], 10);
				
				var nIndex = parseInt(begin / 120);
				var MinuteArry = [0, 120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200, 1320, 1440];
				while(begin < end){
					var width; 
					if(end <= MinuteArry[nIndex + 1]){
						width = parseInt((end - begin) * 40 / 120);
					}else{
						width = parseInt((MinuteArry[nIndex + 1] - begin) * 40 / 120);
					};
					xPos = parseInt(begin * 40 / 120) + nIndex * 2;
					yPos = i * 20 + i * 5;
					ctx.fillRect(xPos,yPos,width,20);
					nIndex++;
					begin = MinuteArry[nIndex];
				}
			}
		}
	}

	$("input[id^='SectCheck']").unbind().click(function(){
		var ids = ["SectCheck1", "SectCheck2","SectCheck3","SectCheck4"];
		var i;
		for(i = 0; i < 4; i++){
			if(ids[i] == $(this).prop("id"))
				break;
		}
		var nIndex = weekIndex;
		if(weekIndex == 7){
			nIndex = 0;
		}
		var itime = tsCfg[nIndex][i];
		itime = itime.split(" ");
		if($(this).prop("checked")){
			tsCfg[nIndex][i] = "1 " + itime[1];
		}else{
			tsCfg[nIndex][i] = "0 " + itime[1];
		}
		
		if(weekIndex == 7){
			for(i = 1; i < 7; i++){
				for(var j = 0; j < 4; j++){
					tsCfg[i][j] = tsCfg[0][j];
				}
			}
		}
		
		ShowTimeSection();
	});
	
	$(".time-div input").unbind();
	$(".time-div input").keyup(function (){
		var tmp = $(this).val().replace(/\D/g,'');
		$(this).val(tmp);
		var i;
		var nSect;	//Group别
		var nWitch;	//0StartTime小Hour. 1StartTimeMin钟 2End Time小Hour. 3End TimeMin钟
		var a = $("div[id^='Sect_Time']");
		var b;
		for(i = 0; i < 4; i++){
			if(a.eq(i).prop("id") == $(this).parent().prop("id")){
				nSect = i;
				b = a.eq(i).find("input");
				break;
			}
		}
		
		for(i = 0; i < 4; i++){
			if(b.eq(i).prop("id") == $(this).prop("id")){
				nWitch = i;
				break;
			}
		}
		
		var bChange = false;	
		var timeArr = [b.eq(0).val() * 1, b.eq(1).val() * 1,
					   b.eq(2).val() * 1, b.eq(3).val() * 1];		
		if (0 == nWitch || 2 == nWitch){//小Hour检查
			if (timeArr[nWitch] > 24){
				timeArr[nWitch] = 24;
				bChange = true;
			}
		
			if (2 == nWitch && tmp == ""){
				timeArr[nWitch] = 24;
				bChange = true;
			}
		}else{//Min钟检查
			if (timeArr[nWitch] > 59){
				timeArr[nWitch] = 59;
				bChange = true;
			}
		}

		if (timeArr[0] == 24){
			timeArr[1] = 0;
			bChange = true;
		}	

		if (timeArr[2] == 24){
			timeArr[3] = 0;
			bChange = true;
		}	
		if (bChange){
			for(i = 0; i < 4; i++){
				if(i != nWitch){
					b.eq(i).val(timeArr[i] < 10 ? '0' + timeArr[i] : timeArr[i]);
				}else{
					if (tmp != ''){
						b.eq(i).val(timeArr[i]);
					}
				}
			}
		}

		SaveSect(nSect);
		ShowTimeSection();
	});
	
	$(".time-div input").blur(function (){
		var i;
		var nSect;	//Group别
		var nWitch;	//0StartTime小Hour. 1StartTimeMin钟 2End Time小Hour. 3End TimeMin钟
		var a = $("div[id^='Sect_Time']");
		var b;
		for(i = 0; i < 4; i++){
			if(a.eq(i).prop("id") == $(this).parent().prop("id")){
				nSect = i;
				b = a.eq(i).find("input");
				break;
			}
		}
		
		for(i = 0; i < 4; i++){
			if(b.eq(i).prop("id") == $(this).prop("id")){
				nWitch = i;
				break;
			}
		}
		
		var timeArr = [b.eq(0).val() * 1, b.eq(1).val() * 1,
					   b.eq(2).val() * 1, b.eq(3).val() * 1];		
		if (0 == nWitch || 2 == nWitch){//小Hour检查
			if (timeArr[2] < timeArr[0]){
				timeArr[2] = timeArr[0];
			}else if (timeArr[2] == timeArr[0]){
				if(timeArr[3] < timeArr[1]){
					timeArr[3] = timeArr[1];
				}
			}
		}else{//Min钟检查
			if (timeArr[2] == timeArr[0] && timeArr[3] < timeArr[1]){
				timeArr[3] = timeArr[1];
			}
		}

		for(i = 0; i < 4; i++){
			b.eq(i).val(timeArr[i] < 10 ? '0' + timeArr[i] : timeArr[i]);
		}
		
		SaveSect(nSect);	
	});
	
	function SaveSect(nSect){
		var ts = "";
		var j = nSect + 1;
		if ($("#SectCheck" + j).prop("checked")) {
			ts += "1";
		} else {
			ts += "0";
		}
		ts += " ";
		ts += GetTimeVal($("#StartHour" + j)) + ":" + GetTimeVal($("#StartMinute" + j)) + ":00-";
		ts += GetTimeVal($("#EndHour" + j)) + ":" + GetTimeVal($("#EndMinute" + j)) + ":00";
		var nIndex = weekIndex;
		if(weekIndex == 7){
			nIndex = 0;
		}
		tsCfg[nIndex][nSect] = ts;
		if(weekIndex == 7){
			for(i = 1; i < 7; i++){
				for(var j = 0; j < 4; j++){
					tsCfg[i][j] = tsCfg[0][j];
				}
			}
		}
	}

	$("#WeekChild").unbind().change(function(){
		var nIndex = $(this).val() * 1;
		ShowTime(nIndex);
		weekIndex = nIndex;
	});
	function SaveTimeSection(){
		for(var i = 0; i < 7; i++){
			for(var j = 0; j < 4; j++){
				tsCpy[i][j] = tsCfg[i][j];
			}

			if(typeof tsCpy[i][4] != "undefined" && typeof tsCpy[i][5] != "undefined")
			{
				tsCpy[i][4] = defaultTimeSection;
				tsCpy[i][5] = defaultTimeSection;
			}
 		}
	}
	$("#Period_OK").unbind().click(function() {
		SaveTimeSection();
		closePeriod();
	});
	
	$("#Period_cancle, .second_close2").unbind().click(function(){
		closePeriod();
	});
	
	function closePeriod(){
		$("#period_dialog").hide();
		if(nAlarmType == AlarmTypeEnum.Intelligent){
			$("#Config_dialog").css("opacity", 1);
		}else {		
			if(KeepMask){

			}else{
				MasklayerHide();
			}
			if($.isFunction(callback)){
				callback();
			}
		}
	}
}

function ShowPeriodWnd(timeSection, nAlarmType, KeepMask,callback){
	WebCms.util.loadhtml({
		webUrl: "html/timesection.html",
		callback: function(b) {
			$("#period_dialog .content_container").html(b).css("display", "block");
			lan("period_page");
			ShowPeriod(timeSection, nAlarmType,KeepMask,callback);
		}
	});
}

function ShowPTZ(PtzCfg, nAlarmType,KeepMask,callback){
	if(gDevice.devType == devTypeEnum.DEV_IPC && gDevice.loginRsp.ChannelNum == 1){
		$("#PtzLink_dialog").css("width", "450px");
		$("#PtzLink_dialog .btn_box").css("padding-left", "95px");
	}else{
		$("#PtzLink_dialog").css("width", "750px");
		$("#PtzLink_dialog .btn_box").css("padding-left", "225px");
	}
	lan("ptz_page");
	var bNext = false;
	
	$("#ptzChnBox").empty();
	for(var i = 0; i < gDevice.loginRsp.ChannelNum; i++){	
		$("#ptzChnBox").append('<div class="form-group"><label>'+lg.get("IDS_CHANNEL")+" "+(i+1)+
			'</label><select class="select"><option value="0">'+lg.get("PTZ_LINK_NONE")+'</option><option value="1">'+
			lg.get("PTZ_LINK_PRESET")+'</option><option value="2">'+lg.get("PTZ_LINK_TOUR")+'</option><option value="3">'+
			lg.get("PTZ_LINK_PATTERN")+'</option></select>' +
			'<input class="inputTxt" maxlength="3" onkeyup="CheckPTZValCallBack(this);"' +
			'onafterpaste="CheckPTZValCallBack(this);" onblur="BlurPTZValCallBack(this);"></div>');
			
		var jqSelect = $("#ptzChnBox").find("select");
		var jqInput = $("#ptzChnBox").find("input");
		if (PtzCfg[i][0] == "None") {
			$(jqSelect[i]).val(0);
		} else if (PtzCfg[i][0] == "Preset") {
			$(jqSelect[i]).val(1);
		} else if (PtzCfg[i][0] == "Tour") {
			$(jqSelect[i]).val(2);
		} else { //if(PtzCfg[j][0] == "Pattern"){
			$(jqSelect[i]).val(3);
		}
		$(jqInput[i]).val(PtzCfg[i][1]);
	
	}
	
	if(gDevice.loginRsp.ChannelNum <= 32){
		$("#nextbtn").css("display", "none");
		PageChannelLayout(0, gDevice.loginRsp.ChannelNum - 1);
	}else{
		$("#nextbtn").css("display", "");
		nextbtn.innerHTML = lg.get("IDS_NEXT_PAGE");
		PageChannelLayout(0, 31);
	}
	
	function PageChannelLayout(bChannel, echannel){
		$("#ptzChnBox .form-group").css("display", "none");
		var jqGroup = $("#ptzChnBox .form-group");	
		for (var j = bChannel; j <= echannel; j++) {
			$(jqGroup[j]).css("display", "");
		}
	}
	CheckPTZValCallBack = CheckPTZVal;
	BlurPTZValCallBack = BlurPTZVal;
	function CheckPTZVal(th) {
		th.value = th.value.replace(/\D/g, '');
		if (th.value.length > 1 && th.value.charAt(0) == "0") {
			th.value = th.value.substring(1);
		}
		if (th.value > 255) {
			th.value = 255;
		}
	}

	function BlurPTZVal(th) {
		if (th.value == '') th.value = '0';
	}

	function SavePtz(){
		var jqSelect = $("#ptzChnBox").find("select");
		var jqInput = $("#ptzChnBox").find("input");
		for (var j = 0; j < gDevice.loginRsp.ChannelNum; j++) {
			var ptzval = $(jqSelect[j]).val() * 1;
			if (ptzval == 0) {
				PtzCfg[j][0] = "None"
			} else if (ptzval == 1) {
				PtzCfg[j][0] = "Preset"
			} else if (ptzval == 2) {
				PtzCfg[j][0] = "Tour"
			} else {
				PtzCfg[j][0] = "Pattern"
			}
			PtzCfg[j][1] = $(jqInput[j]).val() * 1;
		}
	}

	$("#nextbtn").unbind().click(function (){
		if(!bNext){
			PageChannelLayout(32, gDevice.loginRsp.ChannelNum - 1);
			nextbtn.innerHTML = lg.get("IDS_PRE_PAGE");
			bNext = true;
		}else{
			PageChannelLayout(0, 31);
			nextbtn.innerHTML = lg.get("IDS_NEXT_PAGE");
			bNext = false;
		}
	});

	$("#PTZ_Ok").unbind().click(function(){
		SavePtz();
		closePtz();
	});
	
	$("#PTZ_cancle, .second_close2").unbind().click(function(){
		closePtz();
	});
	
	function closePtz(){
		$("#PtzLink_dialog").hide();
		if(nAlarmType == AlarmTypeEnum.Intelligent){
			$("#Config_dialog").css("opacity", 1);
		}else {		
			if(KeepMask){

			}else{
				MasklayerHide();
			}
			if($.isFunction(callback)){
				callback();
			}
		}
	}
}