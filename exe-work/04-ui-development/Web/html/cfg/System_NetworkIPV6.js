//# sourceURL=System_NetworkIPV6.js
$(function () {
	var pageTitle = $("#System_NetworkIPV6").text();
	var m_bEnable;				//是否启用ipv6
	var m_LocalLinkAddr;	//本地链路地址
	var m_Address;				//ipv6地址
	var m_Gateway;			//网关
	var	m_Prefix;  				//ipv6前缀长度
    function GetNetWorkIPV6Cfg(){
        RfParamCall(function(a){
            if (a.Ret == 100) {
                m_bEnable = a[a.Name].Enable;
                m_LocalLinkAddr = a[a.Name].LocalLinkAddress;
                m_Address = a[a.Name].Address;
                m_Prefix = a[a.Name].Prefix;
                m_Gateway = a[a.Name].Gateway;
                ShowData();
            }
		}, pageTitle, "NetWork.IPv6",  -1, WSMsgID.WsMsgID_CONFIG_GET);
    };

    function ShowData(){
        $("#LinkAddressDiv").val(m_LocalLinkAddr);
        $("#IPAddressInput").val(m_Address);
        $("#BInput").val(m_Prefix);
        $("#DefaultGateWayInput").val(m_Gateway);
        MasklayerHide();
    };

    function cLength(str){
        var reg = /([0-9a-f]{1,4}:)|(:[0-9a-f]{1,4})/gi;
        var temp = str.replace(reg,' ');
        return temp.length;
    }

    function isIPv6(tmpstr)  {  
        if (tmpstr == ""){
            return false;
        }
        //CDCD:910A:2222:5498:8475:1111:3900:2020   
        var patrn=/^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i;   
        var r=patrn.exec(tmpstr)  
        if(r)  {  
            return true;  
        }  
        if(tmpstr=="::"){  
            return true;  
        }  
        //F:F:F::1:1 F:F:F:F:F::1 F::F:F:F:F:1格式  
        patrn=/^(([0-9a-f]{1,4}:){0,6})((:[0-9a-f]{1,4}){0,6})$/i;   
        r=patrn.exec(tmpstr);  
        if(r)  { 
            var c = cLength(tmpstr);
            if(c<=7 && c>0) {  
                return true;  
            }   
        }                  
 
        //F:F:10F::  
        patrn=/^([0-9a-f]{1,4}:){1,7}:$/i;   
        r=patrn.exec(tmpstr);  
        if(r)   {  
            return true;  
        }   
        
        //::F:F:10F   
        patrn=/^:(:[0-9a-f]{1,4}){1,7}$/i;   
        r=patrn.exec(tmpstr);  
        if(r)  {  
            return true;  
        }  

        //F:0:0:0:0:0:10.0.0.1格式   
        patrn=/^([0-9a-f]{1,4}:){6}(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i;   
        r=patrn.exec(tmpstr);  
        if(r)  {  
            if(r[2]<=255 && r[3]<=255 &&r[4]<=255 && r[5]<=255 )  
            return true;  
        }  
        
        //F::10.0.0.1格式  
        patrn=/^([0-9a-f]{1,4}:){1,5}:(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i;   
        r=patrn.exec(tmpstr);  
        if(r)   {  
            if(r[2]<=255 && r[3]<=255 &&r[4]<=255 && r[5]<=255 )  
                return true;  
        }  

        //::10.0.0.1格式  
        patrn=/^::(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i;   
        r=patrn.exec(tmpstr);  
        if(r) {  
            if(r[1]<=255 && r[2]<=255 &&r[3]<=255 && r[4]<=255)  
                return true;  
        }  
        return false;  
    }
    
    function SaveData(){
        var nIPAddress = $("#IPAddressInput").val();
        if (!isIPv6(nIPAddress)){
            ShowPaop(pageTitle, lg.get("IDS_IPV6_FAIL"));
            return ;
        }
        var nGateway = $("#DefaultGateWayInput").val();
        if (!isIPv6(nGateway)){
            ShowPaop(pageTitle, lg.get("IDS_GATEWAY_FAIL"));
            return ;
        }
        m_Prefix = $("#BInput").val();
        if (m_Prefix == "") {
            ShowPaop(pageTitle, lg.get("IDS_PREFIX_FAIL"));
            return ;
        }
        m_Prefix = m_Prefix * 1;
        var nPrefix = GetMaxSubnetPrefix(ipv6_to_hex(nIPAddress), ipv6_to_hex(nGateway));
        if (nPrefix < m_Prefix){
            ShowPaop(pageTitle, lg.get("IDS_PREFIX_FAIL"));
            return ;
        }

        var cmd = {
			"Name": "NetWork.IPv6",
			"NetWork.IPv6": {
				"Address": nIPAddress,
				"Enable": m_bEnable,
				"Gateway": nGateway,
                "LocalLinkAddresS": m_LocalLinkAddr,
                "Prefix": m_Prefix
			}
		};
        RfParamCall(function(a){
            if(a.Ret == 100){
                ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
            } else if (a.Ret == 603){
                RebootDev(pageTitle, lg.get("IDS_CONFIRM_RESTART"), true);
            }
		}, pageTitle, "NetWork.IPv6", -1, WSMsgID.WsMsgID_CONFIG_SET, cmd);
    };

    function ipv6_to_hex(address){
        var ipv6_to_16='';
        var ipv6_1=[];
        var number_1=0;
        var number = 0;
        var flag = true;
        if(address.indexOf("::")>-1){
            var ipv6=address.split("::");
            for(var i=0;i<ipv6.length;i++){
                if(ipv6[i].indexOf(':')>0){
                    var t = ipv6[i].split(':');
                    if(flag){
                        number_1= t.length;
                    }
                    number = number + t.length
                    for(var j=0;j<t.length;j++){
                        if(t[j].length!=4){
                            var  a="0000";
                            var s = a.substring(0,4-t[j].length);
                            var b = s.concat(t[j]);
                            ipv6_1.push(b);
                        }else{
                            ipv6_1.push(t[j]);
                        }
                    }
                    flag = false
                }else{
                    if(ipv6[i].length!=4){
                        var  a="0000";
                        var s = a.substring(0,4-ipv6[i].length);
                        var b = s.concat(ipv6[i]);
                        ipv6_1.push(b);
                    }else{
                        ipv6_1.push(ipv6[i]);
                    }
                    if(flag){
                        number_1=number_1+1;
                    }
                    number = number + 1;
                    flag = false;
                }
            }

            var v = "0000";
            var ipv6_3 = '';
            for(var h=0;h<8-number;h++){
                ipv6_3=ipv6_3.concat(v)
            }
            for(var y=0;y<ipv6_1.length;y++){
                if(y==number_1){
                    ipv6_to_16= ipv6_to_16.concat(ipv6_3);
                    ipv6_to_16=ipv6_to_16.concat(ipv6_1[y]);
                }else{
                    ipv6_to_16=ipv6_to_16.concat(ipv6_1[y]);
                }

            }
              return ipv6_to_16;
        }else {
            var ipv6=address.split(":");
            for(var i=0;i<ipv6.length;i++){
                if(ipv6[i].length!=4){
                    var  a="0000";
                    var s = a.substring(0,4-ipv6[i].length);
                    var b = s.concat(ipv6[i]);
                    ipv6_to_16=ipv6_to_16.concat(b);
                }else{
                    ipv6_to_16=ipv6_to_16.concat(ipv6[i]);
                }
            }
            return ipv6_to_16;
        }
   }
    
    function GetMaxSubnetPrefix(IPAddressIpv6, GateWayIpv6){
        var nLenIP = IPAddressIpv6.length;
	    var nLenGateWay = GateWayIpv6.length;
        var nLength = nLenGateWay<nLenIP?nLenGateWay:nLenIP;
        var nNum = 0;
        var ch_Num = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
        var nNumIP,nNumGateWay;
        var i=0,j=0;
        for (i=0;i<nLength;i++)
        {
            if (IPAddressIpv6[i] != GateWayIpv6[i])
            {
                nNum = i;
                for (j = 0; j < 16; j++)
                {
                    if (ch_Num[j] == IPAddressIpv6[i])
                    {
                        nNumIP = j;
                        break;
                    }
                }
                for (j = 0;j < 16; j++)
                {
                    if (ch_Num[j] == GateWayIpv6[i])
                    {
                        nNumGateWay = j;
                        break;
                    }
                }
                break;
            }
        }
        var nIP = [];
        nIP[0] = nNumIP % 2;
        nIP[1] = (nNumIP/2) % 2;
        nIP[2] = ((nNumIP/2)/2) % 2;
        nIP[3] = (((nNumIP/2)/2)/2) % 2;
        var nGateWay = [];
        nGateWay[0] = nNumGateWay % 2;
        nGateWay[1] = (nNumGateWay/2) % 2;
        nGateWay[2] = ((nNumGateWay/2)/2) % 2;
        nGateWay[3] = (((nNumGateWay/2)/2)/2) % 2;

        var nNum2 = 0;
        for (i=3;i>=0;i--)
        {
            if (nIP[i] != nGateWay[i])
            {
                nNum2 = i + 1;
                break;
            }
        }
        nNum2 = 4 - nNum2;
        return 4 * nNum + nNum2;
    }

	$(function(){
        $("#NetworkIPV6Save").click(function(){
            SaveData();
        });
        $("#NetworkIPV6Rf").click(function() {
			GetNetWorkIPV6Cfg();
		});
        GetNetWorkIPV6Cfg();
        MasklayerHide();
	});
});