//# sourceURL=OSC_Zone.js
var OSCZone = function (options) {
	var _opts ={
		nChannel: -1,		
		OSCRuleCfg: null
	}
	_opts = $.extend(_opts, options);
	var bkWidth;
	var bkHeight;
	var SpclRgs;
	var OSCPosSet = [];
	
    function ShowData() {	
		$("input[name='OSCEnable']").prop("checked", false);
		var ruleCfg = null;
		if(_opts.OSCRuleCfg.StolenEnable == 1){
			$("#StolenRadio").prop("checked", true);
			ruleCfg = _opts.OSCRuleCfg.StolenRule;
		}else if(_opts.OSCRuleCfg.AbandumEnable == 1){
			$("#AbandumRadio").prop("checked", true);
			ruleCfg = _opts.OSCRuleCfg.AbandumRule;
		}else if(_opts.OSCRuleCfg.NoParkingEnable == 1){
			$("#NoParkingRadio").prop("checked", true);
			$("#side3").css("display", "");
			ruleCfg = _opts.OSCRuleCfg.NoParkingRule;
		}
		SpclRgs = cloneObj(ruleCfg.SpclRgs);
		showRule(ruleCfg);
    }
	function showRule(rule){
		bkWidth = $("#gr_cvs").width();
		bkHeight = $("#gr_cvs").height();
		var nRgs = rule.SpclRgs.length;
		var nCount = 0;
		for(var i =0;i<nRgs;i++){
			var nPointNum = rule.SpclRgs[i].OscRg.PointNu;

			OSCPosSet[i] = {};
			OSCPosSet[i]["Pts"] = [];
			OSCPosSet[i]["MoveFlag"] = [];
			if(nPointNum > 0 && nPointNum < 9){
				var pts = rule.SpclRgs[i].OscRg.Points;
				for(var j =0;j< nPointNum;j++){
					OSCPosSet[i]["Pts"][j] = {
						posX : pts[j].x,
						posY : pts[j].y,
					}
					OSCPosSet[i]["MoveFlag"][j] = false;

					SpclRgs[i].OscRg.Points[j].x= parseInt(pts[j].x*bkWidth/8192);
					SpclRgs[i].OscRg.Points[j].y= parseInt(pts[j].y*bkHeight/8192);
				}
				nCount += 1;
			}
		}
		if(nCount == 0){
			rule.SpclRgs[0].OscRg.PointNu = 0;
			if(!rule.SpclRgs[0].OscRg.Points) rule.SpclRgs[0].OscRg.Points = [];
			for(var i =0; i < 8;i++){
				rule.SpclRgs[0].OscRg.Points[i] ={x:0,y:0};
			}
			SpclRgs[0].OscRg.PointNu = 0;
			if(!SpclRgs[0].OscRg.Points)
			SpclRgs[0].OscRg.Points = [];
			CreateShape(4);
		}
		var offset = $("#gr_cvs").offset();
		var state = -1;
		var PointId = -1;
		$("#gr_cvs").unbind();
		$("#gr_cvs").mousedown(function(e){
			if(e.button ==0){
				var pt = { x : e.pageX - offset.left, y : e.pageY-offset.top};
				state = -1;
				PointId = -1;
				var nAreaIndex = checkSelectArea(pt);
				if(nAreaIndex >= 0 && nAreaIndex < SpclRgs.length){
					$(this).bind("mousemove",function(ev){
						var pt2 = {x:ev.pageX - offset.left,
						y:ev.pageY-offset.top};
						if(state == 2){
							if(!checkPoint(pt2)){
								return;
							}
							SpclRgs[nAreaIndex].OscRg.Points[PointId].x= pt2.x;
							SpclRgs[nAreaIndex].OscRg.Points[PointId].y= pt2.y;
							drawPolygon();
							OSCPosSet[nAreaIndex]["MoveFlag"][PointId] = true;
						}else if(state == 3){
							var temp = cloneObj(SpclRgs[nAreaIndex].OscRg.Points);
							for(var i=0;i<SpclRgs[nAreaIndex].OscRg.PointNu;i++){
								temp[i].x+=pt2.x-pt.x;
								temp[i].y+=pt2.y-pt.y;
								if(!checkPoint(temp[i])){
									return;
								}
							}
							for(var i=0;i<SpclRgs[nAreaIndex].OscRg.PointNu;i++){
								SpclRgs[nAreaIndex].OscRg.Points[i].x = temp[i].x;
								SpclRgs[nAreaIndex].OscRg.Points[i].y = temp[i].y;
								OSCPosSet[nAreaIndex]["MoveFlag"][i] = true;
							}
							pt = pt2;
							drawPolygon();
						}else if(state == 1){
							if(PointId ==SpclRgs[nAreaIndex].OscRg.PointNu-1){
								var temp = cloneObj(SpclRgs[nAreaIndex].OscRg.Points);
								temp[0].x+=pt2.x-pt.x;
								temp[0].y+=pt2.y-pt.y;
								temp[PointId].x+=pt2.x-pt.x;
								temp[PointId].y+=pt2.y-pt.y;
								if(!checkPoint(temp[0]) ||!checkPoint(temp[PointId])){
									return;
								}
								SpclRgs[nAreaIndex].OscRg.Points[0].x = temp[0].x;
								SpclRgs[nAreaIndex].OscRg.Points[0].y = temp[0].y;
								SpclRgs[nAreaIndex].OscRg.Points[PointId].x = temp[PointId].x;
								SpclRgs[nAreaIndex].OscRg.Points[PointId].y = temp[PointId].y;

								OSCPosSet[nAreaIndex]["MoveFlag"][0] = true;
								OSCPosSet[nAreaIndex]["MoveFlag"][PointId] = true;
							}else{
								var temp = cloneObj(SpclRgs[nAreaIndex].OscRg.Points);
								temp[PointId].x+=pt2.x-pt.x;
								temp[PointId].y+=pt2.y-pt.y;
								temp[PointId+1].x+=pt2.x-pt.x;
								temp[PointId+1].y+=pt2.y-pt.y;
								if(!checkPoint(temp[PointId]) ||!checkPoint(temp[PointId+1])){
									return;
								}
								SpclRgs[nAreaIndex].OscRg.Points[PointId].x = temp[PointId].x;
								SpclRgs[nAreaIndex].OscRg.Points[PointId].y = temp[PointId].y;
								SpclRgs[nAreaIndex].OscRg.Points[PointId+1].x = temp[PointId+1].x;
								SpclRgs[nAreaIndex].OscRg.Points[PointId+1].y = temp[PointId+1].y;
							
								OSCPosSet[nAreaIndex]["MoveFlag"][PointId] = true;
								OSCPosSet[nAreaIndex]["MoveFlag"][PointId + 1] = true;
							}
							pt = pt2;
							drawPolygon();
						}
						
					});
				}
			}
		}).mouseup(function(e){
			$(this).unbind("mousemove");
		}).mouseout(function(e){
			$(this).unbind("mousemove");
		});
		drawPolygon();
		function checkPoint(pt){
			if(pt.x >= 0 && pt.x <= bkWidth && pt.y >=0 && pt.y <= bkHeight) return true;
			return false;
		}
		function checkSelectArea(pt){
			var bFinded = -1;
			var nRgs = SpclRgs.length;
			for(var i =0;i<nRgs;i++){
				var pointNum = SpclRgs[i].OscRg.PointNu;
				if(pointNum == 0 || pointNum > 8) continue;
				var pts = SpclRgs[i].OscRg.Points;
				for ( var n = 0; n < pointNum; n ++ ){
					if(Math.abs(pt.x - pts[n].x)<5 && Math.abs(pt.y - pts[n].y) < 5){
						bFinded = i;
						state=2;
						PointId=n;
						return bFinded;
					}
				}
				var lna =0;
				var lnb =0;
				var lnc =0;
				for (var j = 0; j < pointNum-1; j++){
					lna=(pts[j].x-pts[j+1].x)
						*(pts[j].x-pts[j+1].x)
						+(pts[j].y-pts[j+1].y)
						*(pts[j].y-pts[j+1].y);
					lnb=(pt.x-pts[j+1].x)
						*(pt.x-pts[j+1].x)
						+(pt.y-pts[j+1].y)
						*(pt.y-pts[j+1].y);
					lnc=(pt.x-pts[j].x)
						*(pt.x-pts[j].x)
						+(pt.y-pts[j].y)
						*(pt.y-pts[j].y);
					if ((Math.sqrt(lnb)+Math.sqrt(lnc))<(Math.sqrt(lna)+1)){
						state=1;
						PointId=j;
						bFinded = i;
						return bFinded;
					}
				}
				lna=(pts[0].x-pts[pointNum-1].x)
					*(pts[0].x-pts[pointNum-1].x)
					+(pts[0].y-pts[pointNum-1].y)
					*(pts[0].y-pts[pointNum-1].y);
				lnb=(pt.x-pts[0].x)
					*(pt.x-pts[0].x)
					+(pt.y-pts[0].y)
					*(pt.y-pts[0].y);
				lnc=(pt.x-pts[pointNum-1].x)
					*(pt.x-pts[pointNum-1].x)
					+(pt.y-pts[pointNum-1].y)
					*(pt.y-pts[pointNum-1].y);
				if ((Math.sqrt(lnb)+Math.sqrt(lnc))<(Math.sqrt(lna)+1)){
					state=1;
					PointId=pointNum-1;
					bFinded = i;
					return bFinded;
				}
				
				if(PtInPolygon(pt, pts,pointNum)){
					bFinded = i;
					state=3;
					return bFinded;
				}
			}
			return bFinded;
		} 
	}
	function CreateShape(ptNum){
		if(typeof SpclRgs[0].Valid == "undefined"){
			SpclRgs[0].OscRg.Valid = 1;
		}else{
			SpclRgs[0].Valid = 1;
		}
		var angle= 360/ptNum;
		var start= 180-180*(ptNum-2)/ptNum+135;
		var x=bkWidth/2;
		var y=bkHeight/2;
		var p=3.14;
		for (var i=0; i<ptNum;i++){
			var radian = (start+angle*i)*p/180;
			var x1;
			var y1;
			x1=x+100*Math.cos(radian);
			y1=y+100*Math.sin(radian);
			SpclRgs[0].OscRg.Points[i] = {};
			SpclRgs[0].OscRg.Points[i].x=x1;
			SpclRgs[0].OscRg.Points[i].y=y1;

			OSCPosSet[0]["MoveFlag"][i] = true;
		}
		SpclRgs[0].OscRg.PointNu = ptNum;
	}
	function drawPolygon(){
		var cvs = document.getElementById("gr_cvs");
		var ctx = cvs.getContext('2d');
		ctx.clearRect(0,0,bkWidth,bkHeight);
		ctx.strokeStyle = "#f00";
		ctx.beginPath();
		var nRgs = SpclRgs.length;
		for(var i =0;i<nRgs;i++){
			var nPointNum = SpclRgs[i].OscRg.PointNu;
			if(nPointNum > 0 &&  nPointNum < 9){
				var nPointNum = SpclRgs[i].OscRg.PointNu;
				if(nPointNum < 3 || nPointNum > 8) continue;
				var pts = SpclRgs[i].OscRg.Points;
				ctx.moveTo(pts[0].x, pts[0].y);
				for(var j =0;j< nPointNum;j++){
					ctx.lineTo(pts[j].x, pts[j].y);
				}
				ctx.lineTo(pts[0].x, pts[0].y);
			}
		}
		ctx.closePath();
		ctx.stroke();
	}
	function SaveOSCRuleCfg() {
		_opts.OSCRuleCfg.StolenEnable = 0;
		_opts.OSCRuleCfg.AbandumEnable = 0;
		_opts.OSCRuleCfg.NoParkingEnable = 0;
		var ruleCfg = null;
		if($("#StolenRadio").prop("checked")){
			_opts.OSCRuleCfg.StolenEnable = 1;
			ruleCfg = _opts.OSCRuleCfg.StolenRule;
		}else if($("#AbandumRadio").prop("checked")){
			_opts.OSCRuleCfg.AbandumEnable = 1;
			ruleCfg = _opts.OSCRuleCfg.AbandumRule;
		}else if($("#NoParkingRadio").prop("checked")){
			_opts.OSCRuleCfg.NoParkingEnable = 1;
			ruleCfg = _opts.OSCRuleCfg.NoParkingRule;
		}
		
		var nRgs = SpclRgs.length;
		for(var i = 0;i< nRgs;i++){
			if(typeof SpclRgs[i].Valid == "undefined"){
				ruleCfg.SpclRgs[i].OscRg.Valid = SpclRgs[i].OscRg.Valid;
			}else{
				ruleCfg.SpclRgs[i].Valid = SpclRgs[i].Valid;
			}
			ruleCfg.SpclRgs[i].OscRg.PointNu = SpclRgs[i].OscRg.PointNu;
			var pts = ruleCfg.SpclRgs[i].OscRg.Points;
			for(var j =0;j< SpclRgs[i].OscRg.PointNu;j++){

				if(typeof OSCPosSet != "undefined" && typeof OSCPosSet[i] != "undefined" && OSCPosSet[i]["MoveFlag"][j])
				{
					pts[j].x = parseInt(SpclRgs[i].OscRg.Points[j].x*8192/bkWidth);
					pts[j].y = parseInt(SpclRgs[i].OscRg.Points[j].y*8192/bkHeight);
				}
				else
				{
					pts[j].x = OSCPosSet[i]["Pts"][j].posX;
					pts[j].y = OSCPosSet[i]["Pts"][j].posY;
				}
			}
		}
	}

    $("#GLL_SV").click(function () {
        SaveOSCRuleCfg();
		closeDialog();
    });
	
	$(".shapeBtn").click(function(){
		var pointN = $(this).attr("data_point") * 1;
		CreateShape(pointN);
		drawPolygon();
	});
	
	$("input[name='OSCEnable']").click(function(){		
		var ruleCfg = null;
		$("#side3").css("display", "none");
		if($("#StolenRadio").prop("checked")){
			ruleCfg = _opts.OSCRuleCfg.StolenRule;
		}else if($("#AbandumRadio").prop("checked")){
			ruleCfg = _opts.OSCRuleCfg.AbandumRule;
		}else if($("#NoParkingRadio").prop("checked")){
			ruleCfg = _opts.OSCRuleCfg.NoParkingRule;
			$("#side3").css("display", "");
		}
		SpclRgs = cloneObj(ruleCfg.SpclRgs);
		showRule(ruleCfg);
	});
	
	ShowData();
};