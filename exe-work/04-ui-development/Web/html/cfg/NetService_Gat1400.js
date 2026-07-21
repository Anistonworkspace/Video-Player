$(function () {
    var Gat={};
    var pageTitle = lg.get("IDS_NETS_Gat1400");
    function ShowData() {
        MasklayerHide();
        do{
            if(Gat.Ret!=100||!Gat.Name||!isObject(Gat[Gat.Name])){
                $("#GAT_EnableSwi").attr("data", 1);
                $("#GAT_HeartBeatInput").val(60);
                $("#GAT_MaxHeartBeatInput").val(3);
                $("#GAT_RegStatus").text(lg.get("IDS_CHSTA_Unknown"));
                break;
            }
            $("#GAT_EnableSwi").attr("data", 1 - Gat[Gat.Name].bEnable * 1);
            $("#GAT_DevidInput").val(Gat[Gat.Name].deviceID);
            $("#Gat_UserInput").val(Gat[Gat.Name].username);
            $("#GAT_PwdInput").val(Gat[Gat.Name].password);
            $("#GAT_IPInput").val(Gat[Gat.Name].Server);
            $("#GAT_PortInput").val(Gat[Gat.Name].port);
            if(typeof Gat[Gat.Name].heartbeat=="undefined"||Gat[Gat.Name].heartbeat==""||Gat[Gat.Name].heartbeat==null){
                $("#GAT_HeartBeatInput").val(60);
            }else{
                $("#GAT_HeartBeatInput").val(Gat[Gat.Name].heartbeat);
            }
            if(typeof Gat[Gat.Name].maxHbtimes=="undefined"||Gat[Gat.Name].maxHbtimes==""||Gat[Gat.Name].maxHbtimes==null){
                $("#GAT_MaxHeartBeatInput").val(3);
            }else{
                $("#GAT_MaxHeartBeatInput").val(Gat[Gat.Name].maxHbtimes);
            }
            var status;
            var n = Gat[Gat.Name].status * 1;
            switch (n) {
                case 1:
                    status = lg.get("IDS_GAT_ONLINE");
                    break;
                case 2:
                    status = lg.get("IDS_GAT_OFFLINE");
                    break;
                default:
                    status = lg.get("IDS_CHSTA_Unknown");
            }
            $("#GAT_RegStatus").text(status);
        }while(false)
        $("#GAT_EnableSwi").click();
    }
    function GetConfig() {
        RfParamCall(function (a) {
                Gat = a;
                ShowData();
        }, pageTitle, "NetWork.GAT1400Cfg", -1, WSMsgID.WsMsgID_CONFIG_GET,"",true);
    }
    $(function () {
        ChangeBtnState();
        $("#GAT_EnableSwi").click(function () {
            DivBox_Net("#GAT_EnableSwi", "#GAT_DivBox");
        });
        $("#GAT_Rf").click(function () {
            GetConfig();
        });
        $("#GAT_SV").click(function () {
            if(!Gat.Name||!isObject(Gat[Gat.Name])){
                Gat={};
                Gat.Name="NetWork.GAT1400Cfg";
                Gat[Gat.Name]={};
            }
            var cfg = Gat[Gat.Name];
            cfg.bEnable = $("#GAT_EnableSwi").attr("data") * 1 == 1 ? true : false;
            cfg.deviceID = $("#GAT_DevidInput").val();
            cfg.username = $("#Gat_UserInput").val();
            cfg.password = $("#GAT_PwdInput").val();
            cfg.Server = $("#GAT_IPInput").val();
            cfg.port = $("#GAT_PortInput").val()*1;
            cfg.heartbeat = $("#GAT_HeartBeatInput").val()*1;
            cfg.maxHbtimes = $("#GAT_MaxHeartBeatInput").val()*1;
            if(isNaN(cfg.heartbeat)){
                ShowPaop(pageTitle,lg.get("IDS_GAT_BEAT")+lg.get("IDS_INVALID_INPUT"));
                return;
            }
            if(isNaN(cfg.maxHbtimes)){
                ShowPaop(pageTitle,lg.get("IDS_GAT_MAXBEAT")+lg.get("IDS_INVALID_INPUT"));
                return;
            }
            RfParamCall(function (a) {
                if (a.Ret == 100)
                    ShowPaop(pageTitle, lg.get("IDS_SAVE_SUCCESS"));
            }, pageTitle, "NetWork.GAT1400Cfg", -1, WSMsgID.WsMsgID_CONFIG_SET, Gat);
        });
        GetConfig();
    });
})