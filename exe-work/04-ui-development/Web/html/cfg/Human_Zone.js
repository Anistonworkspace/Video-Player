//# sourceURL=Human_Zone.js
var HumanZone = function(options) {
	var _opts ={
		nChannel: -1,		
		iShowRule: 0,
		iShowTrack: 0,
		humanAbility: null,
		PedRule: null,
		bShowRuleStyle: false,
		iBorderColor: null,
		iBorderWidth: 0,
		SaveCallback : function() {
		}
	}
	var bNovaAlgorithmRule = GetFunAbility(gDevice.Ability.AlarmFunction.SupportHideHumanDetectRule);
	var bkWidth = $("#cvs").width();
	var bkHeight = $("#cvs").height();
	var ruleLinePts = [];
	var lineDirect = [];
	var pointsNum = [];
	var sideDrect = [];
	var Enable = [];
	var pts = [];
	var nSelected = -1;
	var nShowNum = 1;
	var colors = ["#f00", "#00f", "#0f0", "#ff0"];
	_opts = $.extend(_opts, options);
	var TripWirePosSet = [];
	var PermiterPosSet = [];
	if(!_opts.humanAbility.SupportLine){
		$("#TripWireDiv, #TripWireShape").css("display", "none");
	}
	if(!_opts.humanAbility.SupportArea){
		$("#PerimeterDiv, #PerimeterShape").css("display", "none");
	}
	if(_opts.humanAbility.ShowRule || _opts.humanAbility.ShowTrack){
		$("#ShowSwitch").css("display", "");
		if(!_opts.humanAbility.ShowRule){
			$("#ShowRuleDiv").css("display", "none");
		}
		if(!_opts.humanAbility.ShowTrack){
			$("#ShowTraceDiv").css("display", "none");
		}
	}
	var nAreaNum = _opts.humanAbility.AreaNum;
	var nLineNum = _opts.humanAbility.LineNum;
	
	$("#ShowRule").prop("checked", _opts.iShowRule ? true : false);
	$("#ShowTrace").prop("checked", _opts.iShowTrack ? true : false);
	if((_opts.humanAbility.SupportArea && nAreaNum > 0) || (_opts.humanAbility.SupportLine && nLineNum > 0)){
		ShowData();
	}

    function ShowData() {
		var i;
		ruleLinePts = [];
		lineDirect = [];
		Enable = [];
		for(i = 0; i < _opts.PedRule.length; i++){
			Enable[i] = _opts.PedRule[i].Enable;
			if(i > 0){
				$("#PedRuleEnable" + (i + 1)).prop("checked", Enable[i]);
			}			
		}
		// 绊线两点坐标和方向
		for(i = 0; i < nLineNum; i++){
			ruleLinePts[i] = cloneObj(_opts.PedRule[i].RuleLine.Pts);
			lineDirect[i] = _opts.PedRule[i].RuleLine.AlarmDirect;
			var linePts = ruleLinePts[i];
			TripWirePosSet[i] = {
				StartX : linePts.StartX,
				StartY : linePts.StartY,
				StopX : linePts.StopX,
				StopY : linePts.StopY,
				bMoveStart : false,
				bMoveEnd : false
			};
			linePts.StartX = parseInt(linePts.StartX*bkWidth/8192);
			linePts.StartY = parseInt(linePts.StartY*bkHeight/8192);
			linePts.StopX = parseInt(linePts.StopX*bkWidth/8192);
			linePts.StopY = parseInt(linePts.StopY*bkHeight/8192);
			
			if (0 == linePts.StartX && 0 == linePts.StopX
				&& 0 == linePts.StartY && 0 == linePts.StopY){
				linePts.StartX = bkWidth/2+100;
				linePts.StopX = bkWidth/2-100;
				linePts.StartY = bkHeight/2+100;
				linePts.StopY = bkHeight/2-100;
				lineDirect[i] = 0;
				TripWirePosSet[i].bMoveStart = true;
				TripWirePosSet[i].bMoveEnd = true;
			}
		}
		// 规则框顶点坐标和方向
		pointsNum = [];
		sideDrect = [];
		pts = [];
		for(i = 0; i < nAreaNum; i++){
			var region = _opts.PedRule[i].RuleRegion;
			pointsNum[i] = region.PtsNum;
			pts.push([]);
			PermiterPosSet[i] = {};
			PermiterPosSet[i]["Pts"] = [];
			PermiterPosSet[i]["MoveFlag"] = [];
			for(var j = 0; j < region.PtsNum;j++){
				PermiterPosSet[i]["Pts"][j] = {
					posX : region.Pts[j].X,
					posY : region.Pts[j].Y
				}
				PermiterPosSet[i]["MoveFlag"][j] = false;

				var pt ={};
				pt.x = parseInt(region.Pts[j].X*bkWidth/8192);
				pt.y = parseInt(region.Pts[j].Y*bkHeight/8192);
				pts[i].push(pt);
			}
			// 配置点数小于2，使用默认4顶点矩形框
			if(region.PtsNum <= 2){
				CreateShape(4, i);
			}
			sideDrect[i] = region.AlarmDirect;
		}
		
		if(_opts.PedRule[0].RuleType == 0){			 	// 绊线
			$("#TripWireRadio").prop("checked", true);
			$("#TripWireShape").css("display", "");
			$("#PerimeterShape").css("display", "none");
			showTripWireRule();
		}else if(_opts.PedRule[0].RuleType == 1){		// 规则框
			$("#PerimeterRadio").prop("checked", true);
			$("#TripWireShape").css("display", "none");
			$("#PerimeterShape").css("display", "");
			showPerimeterRule();
		}
		
		// 2023-06-01: 针对Nova算法处理，隐藏人形警戒区域设置框
		if(bNovaAlgorithmRule){
			$("#PZ_Rect, #typeBox, #ShowRuleDiv, #ShowPedRuleBox").css("display", "none");
		}

		// 客户端绘制规则框的，颜色和宽度设置
		if(_opts.bShowRuleStyle)
		{
			$("#RuleBorderStyle").css("display", "");
			$("#InputBorderColor").val(_opts.iBorderColor);
			$("#InputBorderWidth").val(_opts.iBorderWidth);
		}
    }
	
  	function showPerimeterRule(){
		ShowPedRuleL.innerHTML = lg.get("IDS_PEA_PERIMETER");
		$(".PedRuleSpan").css("display", "");
		nShowNum = 1;
		if(nAreaNum > 1){
			for(var i = 1; i < 4; i++){
				if(i >= nAreaNum){
					$("#PedRuleDiv" + (i + 1)).css("display", "none");
				}else{
					if(Enable[i]){
						nShowNum++;
					}
				}
			}
			if(!bNovaAlgorithmRule){
				$("#ShowPedRuleBox").css("display", "");
			}
		}else{
			$("#ShowPedRuleBox").css("display", "none");
		}

		var offset = $("#cvs").offset();
		var state = -1;
		var PointId = -1;
		
		var bSupport = [];//   前三个：正向、逆向、双向
		var id = ["#sideIn", "#sideOut", "#sideBoth", "#side3", "#side4", "#side5", "#side6", "#side7", "#side8"];
		var i = 0;
		for (i = 0; i < 3; i++){
			bSupport[i] = (_opts.humanAbility.dwAreaDirect & (0x01 << i)) ? true : false;
		}
		var j = 2;
		for (i = 3; i < 9; i++){
			bSupport[i] = (_opts.humanAbility.dwAreaLine & (0x01 << j)) ? true : false;
			j++;
		}
	
		for (i= 0; i < 9; i++){
			$(id[i]).css("display", bSupport[i] ? "" : "none");
		}	

		nSelected = -1;
		$("#cvs").unbind();
		$("#cvs").mousedown(function(e){
			if(e.button ==0){
				var pt = {x:e.pageX - offset.left, y:e.pageY-offset.top};
				state = -1;
				PointId = -1;
				nSelected = -1;
				for(i = 0; i < nAreaNum; i++){
					if(Enable[i] && checkSelectArea(pt, i)){
						nSelected = i;	
						break;
					}
				}
				drawPolygon();
				if(nSelected >= 0){
					var ptsNum = pointsNum[nSelected];
					$(this).bind("mousemove",function(ev){
						var pt2 = { x: ev.pageX - offset.left, y: ev.pageY-offset.top};
						var points = pts[nSelected];
						// state 1: 多边形边  2: 顶点  3: 多边形内部
						if(state == 2){
							if(!checkPoint(pt2)){
								return;
							}
							points[PointId].x= pt2.x;
							points[PointId].y= pt2.y;
							PermiterPosSet[nSelected]["MoveFlag"][PointId] = true;
							drawPolygon();
						}else if(state == 3){
							var temp = cloneObj(points);
							for(var i=0;i<ptsNum;i++){
								temp[i].x+=pt2.x-pt.x;
								temp[i].y+=pt2.y-pt.y;
								if(!checkPoint(temp[i])){
									return;
								}
							}
							for(var i=0;i<ptsNum;i++){
								points[i].x = temp[i].x;
								points[i].y = temp[i].y;
								PermiterPosSet[nSelected]["MoveFlag"][i] = true;		// 全移动
							}
							pt = pt2;
							drawPolygon();
						}else if(state == 1){
							if(PointId == ptsNum-1){
								var temp = cloneObj(points);
								temp[0].x+=pt2.x-pt.x;
								temp[0].y+=pt2.y-pt.y;
								temp[PointId].x+=pt2.x-pt.x;
								temp[PointId].y+=pt2.y-pt.y;
								if(!checkPoint(temp[0]) ||!checkPoint(temp[PointId])){
									return;
								}
								points[0].x = temp[0].x;
								points[0].y = temp[0].y;
								points[PointId].x = temp[PointId].x;
								points[PointId].y = temp[PointId].y;

								PermiterPosSet[nSelected]["MoveFlag"][0] = true;
								PermiterPosSet[nSelected]["MoveFlag"][PointId] = true;
							}else{
								var temp = cloneObj(points);
								temp[PointId].x+=pt2.x-pt.x;
								temp[PointId].y+=pt2.y-pt.y;
								temp[PointId+1].x+=pt2.x-pt.x;
								temp[PointId+1].y+=pt2.y-pt.y;
								if(!checkPoint(temp[PointId]) ||!checkPoint(temp[PointId+1])){
									return;
								}
								points[PointId].x = temp[PointId].x;
								points[PointId].y = temp[PointId].y;
								points[PointId+1].x = temp[PointId+1].x;
								points[PointId+1].y = temp[PointId+1].y;

								PermiterPosSet[nSelected]["MoveFlag"][PointId] = true;
								PermiterPosSet[nSelected]["MoveFlag"][PointId + 1] = true;
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
		// pt: 鼠标左键事件坐标，  nIndex: 警戒线/警戒框-索引
		function checkSelectArea(pt, nIndex){			
			var bFinded = false;
			var points = pts[nIndex];
			var ptsNum = pointsNum[nIndex];
			// 点击顶点
			for ( var n = 0; n < ptsNum; n ++ ){
				if(Math.abs(pt.x - points[n].x)<5 && Math.abs(pt.y - points[n].y) < 5){
					bFinded = true;
					state=2;
					PointId=n;
				}
			}
			if(state == -1){
				// 点击多边形边
				var lna =0;
				var lnb =0;
				var lnc =0;
				for (var j = 0; j < ptsNum-1; j++){
					lna=(points[j].x-points[j+1].x)
						*(points[j].x-points[j+1].x)
						+(points[j].y-points[j+1].y)
						*(points[j].y-points[j+1].y);
					lnb=(pt.x-points[j+1].x)
						*(pt.x-points[j+1].x)
						+(pt.y-points[j+1].y)
						*(pt.y-points[j+1].y);
					lnc=(pt.x-points[j].x)
						*(pt.x-points[j].x)
						+(pt.y-points[j].y)
						*(pt.y-points[j].y);
					if ((Math.sqrt(lnb)+Math.sqrt(lnc))<(Math.sqrt(lna)+1)){
						state=1;
						PointId=j;
						bFinded = true;
					}
				}
				lna=(points[0].x-points[ptsNum-1].x)
					*(points[0].x-points[ptsNum-1].x)
					+(points[0].y-points[ptsNum-1].y)
					*(points[0].y-points[ptsNum-1].y);
				lnb=(pt.x-points[0].x)
					*(pt.x-points[0].x)
					+(pt.y-points[0].y)
					*(pt.y-points[0].y);
				lnc=(pt.x-points[ptsNum-1].x)
					*(pt.x-points[ptsNum-1].x)
					+(pt.y-points[ptsNum-1].y)
					*(pt.y-points[ptsNum-1].y);
				if ((Math.sqrt(lnb)+Math.sqrt(lnc))<(Math.sqrt(lna)+1)){
					state=1;
					PointId=ptsNum-1;
					bFinded = true;
				}
			}
			if(state == -1){
				// 点击多边形内部
				if(PtInPolygon(pt, points,ptsNum)){
					bFinded = true;
					state=3;
				}
			}
			return bFinded;
		}
	}
	
	function drawPolygon(){
		var cvs = document.getElementById("cvs");
		var ctx = cvs.getContext('2d');
		ctx.clearRect(0,0,bkWidth,bkHeight);
		for (var k = 0; k < nAreaNum; k++){
			if(!Enable[k]){
				continue;
			}
			ctx.strokeStyle = colors[k];
			if(nSelected == k && nShowNum > 1){
				ctx.strokeStyle = "#0ff";
			}
			ctx.beginPath();
			var points = pts[k];
			var ptsNum = pointsNum[k];
			ctx.moveTo(points[0].x, points[0].y);
			for(var i =1;i< ptsNum;i++){
				ctx.lineTo(points[i].x, points[i].y);
			}
			ctx.lineTo(points[0].x, points[0].y);
			var maxLen = 0;
			var maxLenLineID = 0;
			for(var j = 0; j < ptsNum-1; j++){
				var len = (points[j].x - points[j+1].x) * (points[j].x - points[j+1].x)
					+ (points[j].y - points[j+1].y) * (points[j].y - points[j+1].y);
				if(len > maxLen){
					maxLen = len;
					maxLenLineID = j;
				}
			}

			var pointBegin=[], pointEnd=[];
			pointBegin.x = points[0].x;
			pointBegin.y = points[0].y;
			pointEnd.x = points[1].x;
			pointEnd.y = points[1].y;
			var nDrect = sideDrect[k];
			if(nDrect == 2){
				drawArrows(pointBegin, pointEnd);
				drawArrows(pointEnd, pointBegin);
			}else{
				var m; //直线斜率
				var n; //直线与y轴交点
				m = pointBegin.y - pointEnd.y;
				n = (pointBegin.x * pointEnd.y) - (pointEnd.x * pointBegin.y);
				var y0 = 0; //因为m和n都乘上了(pointBegin.x - pointEnd.x)，所以判断的时候y0也要乘上这个值
				var x0 = 0;
				var y = 0; //y = m * x0 + n  x0和y0是点的坐标，通过比较y和y0的大小，就可以确定两个点是否在一条直线的同一侧
				var side1 = 0;
				var side2 = 0;
				if(pointBegin.x == pointEnd.x){
					for(var i = 0; i < ptsNum; i++){
						x0 = points[i].x;
						if(x0 > pointBegin.x + 3){
							side1 ++;
						}else if(x0 > pointBegin.x - 3){
							side2 ++;
						}
					}
				}else{
					for(var i = 0; i < ptsNum; i++){
						y0 = points[i].y * (pointBegin.x - pointEnd.x);
						x0 = points[i].x;
						y  = m * x0 + n;
						if(y > y0 + 3){
							side1 ++;
						}else if(y < y0 - 3){
							side2 ++;
						}
					}
				}
				if((side1 == 0 && nDrect == 1)
					|| (side2 == 0 && nDrect == 0)){
					if((pointBegin.x == pointEnd.x) && (pointBegin.y > pointEnd.y)){
						drawArrows(pointEnd, pointBegin);
					}else{
						drawArrows(pointBegin, pointEnd);
					}
				}else if((side1 == 0 && nDrect == 0)
					|| (side2 == 0 && nDrect == 1)){
					if((pointBegin.x == pointEnd.x) && (pointBegin.y > pointEnd.y)){
						drawArrows(pointBegin, pointEnd);
					}else{
						drawArrows(pointEnd,pointBegin);
					}
				}else{
					var crossPointCount = 0;
					var midPoint = [];
					midPoint.X = (pointBegin.x + pointEnd.x) / 2;
					midPoint.Y= (pointBegin.y + pointEnd.y) / 2;
					if(pointBegin.y != pointEnd.y){
						for(var i = 0; i < ptsNum - 1; i++){
							if(i == maxLenLineID){
								continue;
							}
							if(points[i].x >= midPoint.X && points[i+1].x >= midPoint.X){
								if((points[i].y >= midPoint.Y && points[i+1].y <= midPoint.Y)
									|| (points[i].y <= midPoint.Y && points[i+1].y >= midPoint.Y)){
									crossPointCount ++;
								}
							}
						}
					}else{
						for(var i = 0; i < maxLenLineID - 1; i++){
							if(i == maxLenLineID){
								continue;
							}
							if(points[i].y > midPoint.Y && points[i+1].y >= midPoint.Y){
								if((points[i].x >= midPoint.X && points[i+1].x <= midPoint.X)
									|| (points[i].x <= midPoint.X && points[i+1].x >= midPoint.X)){
									crossPointCount ++;
								}
							}
						}
					}
					if(crossPointCount % 2 == 1){
						if(nDrect == 0){
							if((pointBegin.y < pointEnd.y)
								|| ((pointBegin.y == pointEnd.y) && (pointBegin.x < pointEnd.x))){
								drawArrows(pointEnd,pointBegin);
							}else{
								drawArrows(pointBegin, pointEnd);
							}
						}else if(nDrect == 1){
							if((pointBegin.y < pointEnd.y)
								|| ((pointBegin.y == pointEnd.y) && (pointBegin.x < pointEnd.x))){
								drawArrows(pointBegin, pointEnd);
							}else{
								drawArrows(pointEnd,pointBegin);
							}
						}
					}else{
						if(nDrect == 0){
							if((pointBegin.y < pointEnd.y)
								|| ((pointBegin.y == pointEnd.y) && (pointBegin.x < pointEnd.x))){
								drawArrows(pointBegin, pointEnd);
							}else{
								drawArrows(pointEnd,pointBegin);
							}
						}else if(nDrect == 1){
							if((pointBegin.y < pointEnd.y)
								|| ((pointBegin.y == pointEnd.y) && (pointBegin.x < pointEnd.x))){
								drawArrows(pointEnd,pointBegin);
							}else{
								drawArrows(pointBegin, pointEnd);
							}
						}
					}
				}	
			}
			ctx.stroke();
		}
	}
	
	function drawArrows(point1,point2,bLine){
		var cvs = document.getElementById("cvs");
		var ctx = cvs.getContext('2d');
		var xExpand = -1;
		var yExpand = -1;
		if(point1.x == point2.x){
			yExpand = 0;
			if(bLine){
				if(point2.y < point1.y){
					xExpand = 1;
				}
			}else{
				if(point2.y > point1.y){
					xExpand = 1;
				}
			}
		}else if(point1.y == point2.y){
			xExpand = 0;
			if(point2.x > point1.x){
				yExpand = 1;
			}
		}else{
			if(point2.x > point1.x){
				yExpand = 1;
			}
			if(point2.y < point1.y){
				xExpand = 1;
			}
		}
		var arrowsPoint1={},arrowsPoint2={},arrowsPoint3={};
		var midPoint={};
		midPoint.x = (point1.x + point2.x) / 2;
		midPoint.y = (point1.y + point2.y) / 2;
		
		if(point1.x == point2.x){
			arrowsPoint1.x = parseInt(midPoint.x + 30 * xExpand);
			arrowsPoint1.y = parseInt(midPoint.y);
			arrowsPoint2.x = parseInt(midPoint.x + 20 * xExpand);
			arrowsPoint2.y = parseInt(midPoint.y - 10);
			arrowsPoint3.x = parseInt(midPoint.x + 20 * xExpand);
			arrowsPoint3.y = parseInt(midPoint.y + 10);
		}else if(point1.y == point2.y){
			arrowsPoint1.x = parseInt(midPoint.x);
			arrowsPoint1.y = parseInt(midPoint.y + 30 * yExpand);
			arrowsPoint2.x = parseInt(midPoint.x - 10);
			arrowsPoint2.y = parseInt(midPoint.y + 20 * yExpand);
			arrowsPoint3.x = parseInt(midPoint.x + 10);
			arrowsPoint3.y = parseInt(midPoint.y + 20 * yExpand);
		}else{
			var arrowsPointLeft, arrowsPointTop;
			var ratio = 1.0 * (point1.y - point2.y)/(point1.x - point2.x);
			arrowsPointLeft = (30.0 / Math.sqrt(1.0 / (ratio * ratio) +1)) * xExpand;
			arrowsPointTop = Math.abs(arrowsPointLeft / ratio) * yExpand;
			arrowsPoint1.x = parseInt(arrowsPointLeft + midPoint.x);
			arrowsPoint1.y = parseInt(arrowsPointTop + midPoint.y);
			arrowsPointLeft = (20.0 / Math.sqrt(1.0 / (ratio * ratio) +1)) * xExpand;
			arrowsPointTop = Math.abs(arrowsPointLeft / ratio) * yExpand;
			var tempPointLeft = Math.sqrt(100.0/(ratio * ratio +1));
			var tempPointTop  = tempPointLeft * ratio;
			arrowsPoint2.x = parseInt(midPoint.x + arrowsPointLeft + tempPointLeft);
			arrowsPoint2.y = parseInt(midPoint.y + arrowsPointTop + tempPointTop);
			arrowsPoint3.x = parseInt(midPoint.x + arrowsPointLeft - tempPointLeft);
			arrowsPoint3.y = parseInt(midPoint.y + arrowsPointTop - tempPointTop);
		}
		
		arrowsPoint1.x = (arrowsPoint1.x + midPoint.x) / 2;
		arrowsPoint1.y = (arrowsPoint1.y + midPoint.y) / 2;
	
		arrowsPoint2.x += midPoint.x - arrowsPoint1.x;
		arrowsPoint2.y += midPoint.y - arrowsPoint1.y;
	
		arrowsPoint3.x += midPoint.x - arrowsPoint1.x;
		arrowsPoint3.y += midPoint.y - arrowsPoint1.y;
	
		midPoint.x = 2 * midPoint.x - arrowsPoint1.x;
		midPoint.y = 2 * midPoint.y - arrowsPoint1.y;
	
		ctx.moveTo(arrowsPoint1.x, arrowsPoint1.y);
		ctx.lineTo(midPoint.x, midPoint.y);
		ctx.moveTo(arrowsPoint1.x, arrowsPoint1.y);
		ctx.lineTo(arrowsPoint2.x, arrowsPoint2.y);
		ctx.moveTo(arrowsPoint1.x, arrowsPoint1.y);
		ctx.lineTo(arrowsPoint3.x, arrowsPoint3.y);
	}
		
	function CreateShape(ptNum, nIndex){
		var angle= 360/ptNum;
		var start= 180-180*(ptNum-2)/ptNum+135;
		var x=bkWidth/2;
		var y=bkHeight/2;
		var p=3.14;
		pts[nIndex] = [];
		for (var i=0 ; i<ptNum ;i++){
			var radian = (start+angle*i)*p/180;
			var x1;
			var y1;
			x1=x+100*Math.cos(radian);
			y1=y+100*Math.sin(radian);
			pts[nIndex][i] = {};
			pts[nIndex][i].x=x1;
			pts[nIndex][i].y=y1;

			PermiterPosSet[nIndex]["MoveFlag"][i] = true;		// 使用默认多边形，则使用客户端给的坐标
		}
		pointsNum[nIndex] = ptNum;
	}

	function showTripWireRule(){
		ShowPedRuleL.innerHTML = lg.get("IDS_PEA_TRIPWIRE");
		$(".PedRuleSpan").css("display", "");
		nShowNum = 1;
		if(nLineNum > 1){
			for(var i = 1; i < 4; i++){
				if(i >= nLineNum){	
					$("#PedRuleDiv" + (i + 1)).css("display", "none");
				}else{
					if(Enable[i]){
						nShowNum++;
					}
				}
			}
			if(!bNovaAlgorithmRule){
				$("#ShowPedRuleBox").css("display", "");
			}
		}else{
			$("#ShowPedRuleBox").css("display", "none");
		}
		var offset = $("#cvs").offset();
		var state = -1;
		
		var id = ["#lineIn", "#lineOut", "#lineBoth"];
		for (var i = 0; i < 3; i++){
			var bSupport = (_opts.humanAbility.dwLineDirect & (0x01 << i)) ? true : false;
			$(id[i]).css("display", bSupport ? "" : "none");
		}
		nSelected = -1;
		$("#cvs").unbind();
		$("#cvs").mousedown(function(e){
			if(e.button ==0){
				var pt = { x : e.pageX - offset.left, y : e.pageY-offset.top };
				state = -1;
				nSelected = -1;
				for(var i = 0; i < nLineNum; i++){
					if(Enable[i] && checkSelectArea(pt, i)){
						nSelected = i;
						break;
					}
				}
				drawLines();
				if(nSelected >= 0){
					$(this).bind("mousemove",function(ev){
						var pt2 = { x : ev.pageX - offset.left, y : ev.pageY-offset.top};
						var linePts = ruleLinePts[nSelected];
						// 4：点击线   5： 点击起始点  6：点击结束点
						if(state == 4){
							var temp = cloneObj(linePts);
							temp.StartX+=pt2.x-pt.x;
							temp.StartY+=pt2.y-pt.y;
							temp.StopX+=pt2.x-pt.x;
							temp.StopY+=pt2.y-pt.y;
							var ptStart ={x:temp.StartX, y:temp.StartY};
							var ptEnd = {x:temp.StopX, y:temp.StopY};	
							if(!checkPoint(ptStart) ||!checkPoint(ptEnd)){
								return;
							}
							linePts.StartX = temp.StartX;
							linePts.StartY = temp.StartY;
							linePts.StopX = temp.StopX;
							linePts.StopY = temp.StopY;
							pt = pt2;
							drawLines();
							TripWirePosSet[nSelected].bMoveStart = true;
							TripWirePosSet[nSelected].bMoveEnd = true;
						}else if(state == 5){
							if(!checkPoint(pt2)){
								return;
							}
							linePts.StartX= pt2.x;
							linePts.StartY=pt2.y;
							drawLines();
							TripWirePosSet[nSelected].bMoveStart = true;
						}else if(state == 6){
							if(!checkPoint(pt2)){
								return;
							}
							linePts.StopX= pt2.x;
							linePts.StopY=pt2.y;
							drawLines();
							TripWirePosSet[nSelected].bMoveEnd = true;
						}
					});
				}
			}
		}).mouseup(function(e){
			$(this).unbind("mousemove");
		}).mouseout(function(e){
			$(this).unbind("mousemove");
		});
		drawLines();
		function checkSelectArea(pt, nIndex){
			var bFinded = false;
			var dotPoint = {};
			dotPoint.x = pt.x;
			dotPoint.y = pt.y;
			var len = 0;
			var lenP2S=0,lenP2E=0;
			var linePts = ruleLinePts[nIndex];
			var ptStart ={x:linePts.StartX, y:linePts.StartY};
			var ptEnd = {x:linePts.StopX, y:linePts.StopY};	
			len = PointToLine(dotPoint, ptStart, ptEnd);
			// 两点之间距离
			lenP2S=(linePts.StartX-pt.x)
				*(linePts.StartX-pt.x)
				+(linePts.StartY-pt.y)
				*(linePts.StartY-pt.y);
			lenP2E=(linePts.StopX-pt.x)
				*(linePts.StopX-pt.x)
				+(linePts.StopY-pt.y)
				*(linePts.StopY-pt.y);
			if ( len <= 4 ){
				bFinded = true;
				state=4;
				PointId=0;
			}
			if (lenP2S<= 10){
				bFinded = true;
				state=5;
			}
			if (lenP2E<= 10){
				bFinded = true;
				state=6;
			}
			
			return bFinded;
		}
		function checkPoint(pt){
			if(pt.x >= 0 && pt.x <= bkWidth && pt.y >=0 && pt.y <= bkHeight) return true;
			return false;
		}
	}
	
	function PointToLine(DotPoint, startPoint, endPoint){
		var bSwitch = false;   
		var nPointToLineDistance;
		var nOffsetX = DotPoint.x - startPoint.x;
		var nOffsetY = DotPoint.y - startPoint.y;
		var dbSquareOfDistance = Math.pow( Math.abs(nOffsetX), 2 ) + Math.pow( Math.abs(nOffsetY), 2 );
		var dbPointToptStartDistance = Math.sqrt(dbSquareOfDistance);
		nOffsetX = DotPoint.x - endPoint.x;
		nOffsetY = DotPoint.y - endPoint.y;
		dbSquareOfDistance = Math.pow(Math.abs(nOffsetX), 2 ) + Math.pow( Math.abs(nOffsetY), 2 );
		var dbPointToptEndDistance = Math.sqrt(dbSquareOfDistance); 
		nOffsetX = startPoint.x- endPoint.x;
		nOffsetY = startPoint.y - endPoint.y;
		dbSquareOfDistance = Math.pow(Math.abs(nOffsetX), 2) + Math.pow(Math.abs(nOffsetY), 2);
		var dbLineLength = Math.sqrt(dbSquareOfDistance); 
		if( dbPointToptStartDistance > dbPointToptEndDistance ){   
			if( Math.pow(dbPointToptStartDistance, 2) > Math.pow(dbPointToptEndDistance, 2) + Math.pow(dbLineLength, 2)){   
				bSwitch = false;   
				nPointToLineDistance =dbPointToptEndDistance;   
			}else   
				bSwitch = true;   
		}else{   
			if( Math.pow(dbPointToptEndDistance, 2) > Math.pow(dbPointToptStartDistance, 2) + Math.pow( dbLineLength, 2 ) ){   
				bSwitch = false;   
				nPointToLineDistance = dbPointToptStartDistance;   
			}else   
				bSwitch = true;   
		}  
		if( bSwitch ){  
			if ( endPoint.y == startPoint.y ){   
				nPointToLineDistance = Math.abs(DotPoint.y - startPoint.y);   
			}else if ( endPoint.x == startPoint.x ){   
				nPointToLineDistance = Math.abs(DotPoint.x - startPoint.x);   
			}else{ 
				var k = ((endPoint.y- startPoint.y ))/((endPoint.x- startPoint.x)); 
				var dbPointToLineHorizotalDistance = Math.abs((DotPoint.y - startPoint.y)/k + startPoint.x- DotPoint.x); 
				var  dbAngle = Math.atan(k);
				nPointToLineDistance = (dbPointToLineHorizotalDistance * Math.sin(Math.abs(dbAngle)));   
			}   
		}   
	
		return   nPointToLineDistance;
	}
	function drawLines(){
		var cvs = document.getElementById("cvs");
		var ctx = cvs.getContext('2d');
		ctx.clearRect(0,0,bkWidth,bkHeight);
		for(var i = 0; i < nLineNum; i++){
			if(!Enable[i]){
				continue;
			}
			ctx.strokeStyle = colors[i];
			if(nSelected == i && nShowNum > 1){
				ctx.strokeStyle = "#0ff";
			}
			ctx.beginPath();
			
			var ptStart ={x:ruleLinePts[i].StartX, y:ruleLinePts[i].StartY};
			var ptEnd = {x:ruleLinePts[i].StopX, y:ruleLinePts[i].StopY};	
			ctx.moveTo(ptEnd.x, ptEnd.y);
			ctx.lineTo(ptStart.x, ptStart.y);

			if (lineDirect[i] == 2){
				drawArrows(ptStart, ptEnd, true);
				drawArrows(ptEnd, ptStart, true);
			}else{
				if(lineDirect[i] == 0){
					drawArrows(ptEnd, ptStart, true);
				}else if (lineDirect[i] == 1){
					drawArrows(ptStart, ptEnd, true);
				}
			}
			ctx.stroke();	
			ctx.beginPath();
			ctx.fillStyle="#0f0";
			ctx.arc(ptStart.x, ptStart.y, 3, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle="#f00";
			ctx.arc(ptEnd.x, ptEnd.y, 3, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	
	function SaveRules(){
		var i;
		for(i = 0; i < _opts.PedRule.length; i++){
			_opts.PedRule[i].Enable = Enable[i];
			if($("#TripWireRadio").prop("checked")){
				_opts.PedRule[i].RuleType = 0;
			}else if($("#PerimeterRadio").prop("checked")){
				_opts.PedRule[i].RuleType = 1;
			}
		}
		for(i = 0; i < nLineNum; i++){
			_opts.PedRule[i].RuleLine.AlarmDirect = lineDirect[i];
			var linePts = _opts.PedRule[i].RuleLine.Pts;

			if(typeof TripWirePosSet != "undefined" && TripWirePosSet[i].bMoveStart)
			{
				linePts.StartX = parseInt(ruleLinePts[i].StartX*8192/bkWidth);
				if(linePts.StartX > 8192) linePts.StartX=8192;
				linePts.StartY = parseInt(ruleLinePts[i].StartY*8192/bkHeight);
				if(linePts.StartY > 8192) linePts.StartY=8192;
			}
			else
			{
				linePts.StartX = TripWirePosSet[i].StartX;
				linePts.StartY = TripWirePosSet[i].StartY;
			}
			if(typeof TripWirePosSet != "undefined" && TripWirePosSet[i].bMoveEnd)
			{
				linePts.StopX = parseInt(ruleLinePts[i].StopX*8192/bkWidth);
				if(linePts.StopX > 8192) linePts.StopX=8192;
				linePts.StopY = parseInt(ruleLinePts[i].StopY*8192/bkHeight);
				if(linePts.StopY > 8192) linePts.StopY=8192;
			}
			else
			{
				linePts.StopX = TripWirePosSet[i].StopX;
				linePts.StopY = TripWirePosSet[i].StopY;
			}
		}
		
		for(i = 0; i < nAreaNum; i++){
			var region = _opts.PedRule[i].RuleRegion;
			region.AlarmDirect = sideDrect[i];
			region.PtsNum = pointsNum[i];
			var points = pts[i];
			for(var j =0; j < pointsNum[i]; j++){
				if(region.Pts[j] == void 0) region.Pts[j]={};
				if(typeof PermiterPosSet != "undefined" && PermiterPosSet[i]["MoveFlag"][j])
				{
					region.Pts[j].X = parseInt(points[j].x*8192/bkWidth);
					region.Pts[j].Y = parseInt(points[j].y*8192/bkHeight);
					if(region.Pts[j].X > 8192) region.Pts[j].X=8192;
					if(region.Pts[j].Y > 8192) region.Pts[j].Y=8192;
				}
				else
				{
					region.Pts[j].X = PermiterPosSet[i]["Pts"][j].posX;
					region.Pts[j].Y = PermiterPosSet[i]["Pts"][j].posY;
				}
			}
		}
		_opts.iShowRule = $("#ShowRule").prop("checked") ? 1 : 0;
		_opts.iShowTrack = $("#ShowTrace").prop("checked") ? 1 : 0;

		if(_opts.bShowRuleStyle){
			_opts.iBorderColor = $("#InputBorderColor").val();
			_opts.iBorderWidth = $("#InputBorderWidth").val() * 1;
		}
	}
    $("#PZ_SV").click(function () {
		SaveRules();
		_opts.SaveCallback(_opts.nChannel, _opts.iShowRule, _opts.iShowTrack,
			_opts.iBorderColor, _opts.iBorderWidth);
		closeDialog();
    });

	$("input[name='PEAEnable']").click(function(){
		$("#TripWireShape, #PerimeterShape").css("display", "none");
		if($("#TripWireRadio").prop("checked")){
			$("#TripWireShape").css("display", "");
			showTripWireRule();
		}else if($("#PerimeterRadio").prop("checked")){
			$("#PerimeterShape").css("display", "");
			showPerimeterRule();
		}
	});

	$(".rulemodeBtn[id^='side']").click(function(){
		var nIndex = 0;
		if(nShowNum > 1 && nSelected == -1){
			return;
		}
		if(nSelected != -1){
			nIndex = nSelected;
		}
		var sMode = $(this).attr("data_mode");
		if(sMode == "sideIn"){
			sideDrect[nIndex] = 0;
		}else if(sMode == "sideOut"){
			sideDrect[nIndex] = 1;
		}else if(sMode == "sideBoth"){
			sideDrect[nIndex] = 2;
		}
		drawPolygon();
	});
	
	$(".rulemodeBtn[id^='line']").click(function(){
		var nIndex = 0;
		if(nShowNum > 1 && nSelected == -1){
			return;
		}
		if(nSelected != -1){
			nIndex = nSelected;
		}
		var sDirect = $(this).attr("data_mode");
		if(sDirect == "lineIn"){
			lineDirect[nIndex] = 0;
		}else if(sDirect == "lineOut"){
			lineDirect[nIndex] = 1;
		}else{
			lineDirect[nIndex] = 2;
		}
		drawLines();
	});
	
	$(".shapeBtn").click(function(){
		var nIndex = 0;
		if(nShowNum > 1 && nSelected == -1){
			return;
		}
		if(nSelected != -1){
			nIndex = nSelected;
		}
		var pointN = $(this).attr("data_point") * 1;
		CreateShape(pointN, nIndex);
		drawPolygon();
	});
	$("#ShowPedRuleBox input").click(function(){
		var index = $(this).attr("data") * 1;
		// 警戒区域 / 警戒线显示使能
		Enable[index - 1] = $(this).prop("checked");
		if($("#TripWireRadio").prop("checked")){
			showTripWireRule();
		}else{
			showPerimeterRule();
		}
	});
};
