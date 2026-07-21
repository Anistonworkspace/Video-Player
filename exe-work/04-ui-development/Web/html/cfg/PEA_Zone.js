//# sourceURL=PEA_Zone.js
var PEAZone = function (options) {
	var _opts ={
		nChannel: -1,		
		PEARuleCfg: null
	}
	var SUB_LCD_DIRECTION = {
		DIR_BOTH_SIDES:0,
		DIR_LEFT_TO_RIGHT:1,
		DIR_UP_TO_DOWN:1,
		DIR_RIGHT_TO_LEFT:2,
		DIR_DOWN_TO_UP:2
	}
	_opts = $.extend(_opts, options);
	var pts = [];
	var pointNum = 0;
	var iMode = 0;
	var bkWidth = $("#cvs").width();
	var bkHeight = $("#cvs").height();
	var tripWire;
	var TripWirePosSet = [];
	var PermiterPosSet = {};

    function ShowData() {
		var rule = _opts.PEARuleCfg.TripWireRule;
		tripWire = cloneObj(rule.TripWire);
		var nLen = tripWire.length;
		var nCount = 0;
		for(var i =0; i < nLen;i++){
			if(tripWire[i].Valid && tripWire[i].Line && tripWire[i].Line.StartPt
				&& tripWire[i].Line.EndPt){
				TripWirePosSet[i] = {
					StartX : tripWire[i].Line.StartPt.x,
					StartY : tripWire[i].Line.StartPt.y,
					StopX : tripWire[i].Line.EndPt.x,
					StopY : tripWire[i].Line.EndPt.y,
					bMoveStart : false,
					bMoveEnd : false
				}
				tripWire[i].Line.StartPt.x = parseInt(tripWire[i].Line.StartPt.x*bkWidth/8192);
				tripWire[i].Line.StartPt.y = parseInt(tripWire[i].Line.StartPt.y*bkHeight/8192);
				tripWire[i].Line.EndPt.x = parseInt(tripWire[i].Line.EndPt.x*bkWidth/8192);
				tripWire[i].Line.EndPt.y = parseInt(tripWire[i].Line.EndPt.y*bkHeight/8192);
				nCount += 1;
			}
		}
		if(nCount == 0){
			tripWire[0].Line = {};
			tripWire[0].Line.StartPt = {x:0,y:0};
			tripWire[0].Line.EndPt = {x:0,y:0};
			createLine();
			TripWirePosSet[0].bMoveStart = true;
			TripWirePosSet[0].bMoveEnd = true;
		}
		rule = _opts.PEARuleCfg.PerimeterRule;
		var area = rule.LimitPara.Boundary;
		pointNum = area.PointNum;
		pts = [];
		PermiterPosSet = {};
		PermiterPosSet["Pts"] = [];
		PermiterPosSet["MoveFlag"] = [];
		for(var i =0; i < pointNum;i++){
			PermiterPosSet["Pts"][i] = {
				posX : area.Points[i].x,
				posY : area.Points[i].y
			}
			PermiterPosSet["MoveFlag"][i] = false;

			var pt ={};
			pt.x = parseInt(area.Points[i].x*bkWidth/8192);
			pt.y = parseInt(area.Points[i].y*bkHeight/8192);
			pts.push(pt);
		}
		if(pointNum == 0){
			CreateShape(4);
			if(rule.Mode < 0 || rule.Mode > 2) rule.Mode=0;
		}
		iMode = rule.Mode;

		if(_opts.PEARuleCfg.TripWireEnable == 1){
			$("#TripWireRadio").prop("checked", true);
			$("#TripWireShape").css("display", "");
			$("#PerimeterShape").css("display", "none");
			showTripWireRule();
		}else if(_opts.PEARuleCfg.PerimeterEnable == 1){
			$("#PerimeterRadio").prop("checked", true);
			$("#TripWireShape").css("display", "none");
			$("#PerimeterShape").css("display", "");
			showPerimeterRule();
		}
    }
	
	function showPerimeterRule(){
		var offset = $("#cvs").offset();
		var state = -1;
		var PointId = -1;
		$("#cvs").unbind();
		$("#cvs").mousedown(function(e){
			if(e.button ==0){
				var pt = { x : e.pageX - offset.left, y : e.pageY-offset.top};
				state = -1;
				PointId = -1;
				if(checkSelectArea(pt)){
					$(this).bind("mousemove",function(ev){
						var pt2 = { x : ev.pageX - offset.left, y : ev.pageY-offset.top};
						// state 1: 多边形边  2: 顶点  3: 多边形内部
						if(state == 2){
							if(!checkPoint(pt2)){
								return;
							}
							pts[PointId].x= pt2.x;
							pts[PointId].y= pt2.y;
							PermiterPosSet["MoveFlag"][PointId] = true;
							drawPolygon();
						}else if(state == 3){
							var temp = cloneObj(pts);
							for(var i=0;i<pointNum;i++){
								temp[i].x+=pt2.x-pt.x;
								temp[i].y+=pt2.y-pt.y;
								if(!checkPoint(temp[i])){
									return;
								}
							}
							for(var i=0;i<pointNum;i++){
								pts[i].x = temp[i].x;
								pts[i].y = temp[i].y;
								PermiterPosSet["MoveFlag"][i] = true;
							}
							pt = pt2;
							drawPolygon();
						}else if(state == 1){
							if(PointId ==pointNum-1){
								var temp = cloneObj(pts);
								temp[0].x+=pt2.x-pt.x;
								temp[0].y+=pt2.y-pt.y;
								temp[PointId].x+=pt2.x-pt.x;
								temp[PointId].y+=pt2.y-pt.y;
								if(!checkPoint(temp[0]) ||!checkPoint(temp[PointId])){
									return;
								}
								pts[0].x = temp[0].x;
								pts[0].y = temp[0].y;
								pts[PointId].x = temp[PointId].x;
								pts[PointId].y = temp[PointId].y;

								PermiterPosSet["MoveFlag"][0] = true;
								PermiterPosSet["MoveFlag"][PointId] = true;
							}else{
								var temp = cloneObj(pts);
								temp[PointId].x+=pt2.x-pt.x;
								temp[PointId].y+=pt2.y-pt.y;
								temp[PointId+1].x+=pt2.x-pt.x;
								temp[PointId+1].y+=pt2.y-pt.y;
								if(!checkPoint(temp[PointId]) ||!checkPoint(temp[PointId+1])){
									return;
								}
								pts[PointId].x = temp[PointId].x;
								pts[PointId].y = temp[PointId].y;
								pts[PointId+1].x = temp[PointId+1].x;
								pts[PointId+1].y = temp[PointId+1].y;

								PermiterPosSet["MoveFlag"][PointId] = true;
								PermiterPosSet["MoveFlag"][PointId + 1] = true;
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
			var bFinded = false;
			for ( var n = 0; n < pointNum; n ++ ){
				if(Math.abs(pt.x - pts[n].x)<5 && Math.abs(pt.y - pts[n].y) < 5){
					bFinded = true;
					state=2;
					PointId=n;
				}
			}
			if(state == -1){
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
						bFinded = true;
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
					bFinded = true;
				}
			}
			if(state == -1){
				if(PtInPolygon(pt, pts,pointNum)){
					bFinded = true;
					state=3;
				}
			}
			return bFinded;
		}
	}
	
	function drawPolygon(){
		if(pointNum <= 2) return;
		var cvs = document.getElementById("cvs");
		var ctx = cvs.getContext('2d');
		ctx.clearRect(0,0,bkWidth,bkHeight);
		ctx.strokeStyle = "#f00";
		ctx.beginPath();
		ctx.moveTo(pts[0].x, pts[0].y);
		for(var i =1;i< pointNum;i++){
			ctx.lineTo(pts[i].x, pts[i].y);
		}
		ctx.lineTo(pts[0].x, pts[0].y);
		var maxLen = 0;
		var maxLenLineID = 0;
		for(var j = 0; j < pointNum-1; j++){
			var len = (pts[j].x - pts[j+1].x) * (pts[j].x - pts[j+1].x)
				+ (pts[j].y - pts[j+1].y) * (pts[j].y - pts[j+1].y);
			if(len > maxLen){
				maxLen = len;
				maxLenLineID = j;
			}
		}
		var pointBegin=[], pointEnd=[];
		pointBegin.x = pts[maxLenLineID].x;
		pointBegin.y = pts[maxLenLineID].y;
		pointEnd.x = pts[maxLenLineID + 1].x;
		pointEnd.y = pts[maxLenLineID + 1].y;
		if(iMode == 0){
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
				for(var i = 0; i < pointNum; i++){
					x0 = pts[i].x;
					if(x0 > pointBegin.x + 3){
						side1 ++;
					}else if(x0 > pointBegin.x - 3){
						side2 ++;
					}
				}
			}else{
				for(var i = 0; i < pointNum; i++){
					y0 = pts[i].y * (pointBegin.x - pointEnd.x);
					x0 = pts[i].x;
					y  = m * x0 + n;
					if(y > y0 + 3){
						side1 ++;
					}else if(y < y0 - 3){
						side2 ++;
					}
				}
			}
			if((side1 == 0 && iMode == 2)
				|| (side2 == 0 && iMode == 1)){
				drawArrows(pointBegin, pointEnd);
			}else if((side1 == 0 && iMode == 1)
				|| (side2 == 0 && iMode == 2)){
				drawArrows(pointEnd,pointBegin);
			}else{
				var crossPointCount = 0;
				var midPoint = [];
				midPoint.X = (pointBegin.x + pointEnd.x) / 2;
				midPoint.Y= (pointBegin.y + pointEnd.y) / 2;
				if(pointBegin.y != pointEnd.y){
					for(var i = 0; i < pointNum - 1; i++){
						if(i == maxLenLineID){
							continue;
						}
						if(pts[i].x >= midPoint.X && pts[i+1].x >= midPoint.X){
							if((pts[i].y >= midPoint.Y && pts[i+1].y <= midPoint.Y)
								|| (pts[i].y <= midPoint.Y && pts[i+1].y >= midPoint.Y)){
								crossPointCount ++;
							}
						}
					}
				}else{
					for(var i = 0; i < maxLenLineID - 1; i++){
						if(i == maxLenLineID){
							continue;
						}
						if(pts[i].y > midPoint.Y && pts[i+1].y >= midPoint.Y){
							if((pts[i].x >= midPoint.X && pts[i+1].x <= midPoint.X)
								|| (pts[i].x <= midPoint.X && pts[i+1].x >= midPoint.X)){
								crossPointCount ++;
							}
						}
					}
				}
				if(crossPointCount % 2 == 1){
					if(iMode == 1){
						if((pointBegin.y < pointEnd.y)
							|| ((pointBegin.y == pointEnd.y) && (pointBegin.x < pointEnd.x))){
							drawArrows(pointEnd,pointBegin);
						}else{
							drawArrows(pointBegin, pointEnd);
						}
					}else if(iMode == 2){
						if((pointBegin.y < pointEnd.y)
							|| ((pointBegin.y == pointEnd.y) && (pointBegin.x < pointEnd.x))){
							drawArrows(pointBegin, pointEnd);
						}else{
							drawArrows(pointEnd,pointBegin);
						}
					}
				}else{
					if(iMode == 1){
						if((pointBegin.y < pointEnd.y)
							|| ((pointBegin.y == pointEnd.y) && (pointBegin.x < pointEnd.x))){
							drawArrows(pointBegin, pointEnd);
						}else{
							drawArrows(pointEnd,pointBegin);
						}
					}else if(iMode == 2){
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
		ctx.closePath();
		ctx.stroke();
	}
	
	function drawArrows(point1,point2){
		var cvs = document.getElementById("cvs");
		var ctx = cvs.getContext('2d');
		var xExpand = -1;
		var yExpand = -1;
		if(point1.y == point2.y){
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
		
	function CreateShape(ptNum){
		var angle= 360/ptNum;
		var start= 180-180*(ptNum-2)/ptNum+135;
		var x=bkWidth/2;
		var y=bkHeight/2;
		var p=3.14;
		for (var i=0 ; i<ptNum ;i++){
			var radian = (start+angle*i)*p/180;
			var x1;
			var y1;
			x1=x+100*Math.cos(radian);
			y1=y+100*Math.sin(radian);
			pts[i] = {};
			pts[i].x=x1;
			pts[i].y=y1;

			PermiterPosSet["MoveFlag"][i] = true;	
		}
		pointNum =ptNum;
	}
	
	function LineSingle(atLine){
		var StartPt = atLine.StartPt;
		var EndPt = atLine.EndPt;
		var width = Math.abs(EndPt.x -StartPt.x);
		var height = Math.abs(EndPt.y -StartPt.y);
		var radio = 1000;
		if ( width ) radio  = height * 100 / width;
		var iDirection = 0;
		if(height == 0 || radio <= 58){
			if ( StartPt.x > EndPt.x){
				iDirection = SUB_LCD_DIRECTION.DIR_DOWN_TO_UP;
			}else{
				iDirection = SUB_LCD_DIRECTION.DIR_UP_TO_DOWN;
			}
		}else if(width == 0 || radio > 58){
			if ( StartPt.y > EndPt.y ){
				iDirection = SUB_LCD_DIRECTION.DIR_LEFT_TO_RIGHT;
			}else{
				iDirection = SUB_LCD_DIRECTION.DIR_RIGHT_TO_LEFT;
			}
		}
		return iDirection;
	}
	function showTripWireRule(){
		var offset = $("#cvs").offset();
		var state = -1;
		var PointId = -1;
		$("#cvs").unbind();
		$("#cvs").mousedown(function(e){
			if(e.button ==0){
				var pt = {x:e.pageX - offset.left, y:e.pageY-offset.top};
				state = -1;
				PointId = -1;
				if(checkSelectArea(pt)){
					$(this).bind("mousemove",function(ev){
						var pt2 = {x:ev.pageX - offset.left, y:ev.pageY-offset.top};
						if(state == 4){
							var temp = cloneObj(tripWire[PointId]);
							temp.Line.StartPt.x+=pt2.x-pt.x;
							temp.Line.StartPt.y+=pt2.y-pt.y;
							temp.Line.EndPt.x+=pt2.x-pt.x;
							temp.Line.EndPt.y+=pt2.y-pt.y;
							if(!checkPoint(temp.Line.StartPt) ||!checkPoint(temp.Line.EndPt)){
								return;
							}
							tripWire[PointId].Line.StartPt.x = temp.Line.StartPt.x;
							tripWire[PointId].Line.StartPt.y = temp.Line.StartPt.y;
							tripWire[PointId].Line.EndPt.x = temp.Line.EndPt.x;
							tripWire[PointId].Line.EndPt.y = temp.Line.EndPt.y;
							pt = pt2;
							drawLines();
							TripWirePosSet[PointId].bMoveStart = true;
							TripWirePosSet[PointId].bMoveEnd = true;
						}else if(state == 5){
							if(!checkPoint(pt2)){
								return;
							}
							tripWire[PointId].Line.StartPt.x= pt2.x;
							tripWire[PointId].Line.StartPt.y=pt2.y;
							drawLines();
							TripWirePosSet[PointId].bMoveStart = true;
						}else if(state == 6){
							if(!checkPoint(pt2)){
								return;
							}
							tripWire[PointId].Line.EndPt.x= pt2.x;
							tripWire[PointId].Line.EndPt.y=pt2.y;
							drawLines();
							TripWirePosSet[PointId].bMoveEnd = true;
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
		function checkSelectArea(pt){
			var bFinded = false;
			var nLen = tripWire.length;
			for ( var i = 0; i < nLen; i ++ ){
				var dotPoint = {};
				dotPoint.x = pt.x;
				dotPoint.y = pt.y;
				var len = 0;
				var lenP2S=0,lenP2E=0;
				if (tripWire[i].Valid){
					len = PointToLine(dotPoint, tripWire[i].Line.StartPt,
						tripWire[i].Line.EndPt);
					lenP2S=(tripWire[i].Line.StartPt.x-pt.x)
						*(tripWire[i].Line.StartPt.x-pt.x)
						+(tripWire[i].Line.StartPt.y-pt.y)
						*(tripWire[i].Line.StartPt.y-pt.y);
					lenP2E=(tripWire[i].Line.EndPt.x-pt.x)
						*(tripWire[i].Line.EndPt.x-pt.x)
						+(tripWire[i].Line.EndPt.y-pt.y)
						*(tripWire[i].Line.EndPt.y-pt.y);
					if ( len <= 4 ){		// 在线上
						bFinded = true;
						state=4;
						PointId=i;		
					}
					if (lenP2S<= 10){
						bFinded = true;
						state=5;
					}
					if (lenP2E<= 10){
						bFinded = true;
						state=6;
					}
		
				}
			}
			return bFinded;
		}
		function checkPoint(pt){
			if(pt.x >= 0 && pt.x <= bkWidth && pt.y >=0 && pt.y <= bkHeight) return true;
			return false;
		}
	}

	function createLine(){
		if ((0 == tripWire[0].Line.StartPt.x
			&& 0 == tripWire[0].Line.EndPt.x
			&& 0 == tripWire[0].Line.StartPt.y
			&& 0 == tripWire[0].Line.EndPt.y)
			|| 0 == tripWire[0].Valid){
			tripWire[0].Line.StartPt.x=bkWidth/2+100;
			tripWire[0].Line.EndPt.x=bkWidth/2-100;
			tripWire[0].Line.StartPt.y=bkHeight/2+100;
			tripWire[0].Line.EndPt.y=bkHeight/2-100;
			tripWire[0].Valid=1;
			tripWire[0].IsDoubleDir=0;
			if (typeof tripWire[0].ForbiddenDir != 'undefined'){
				tripWire[0].ForbiddenDir = 180;
			}
		}
	}
	
	function PointToLine(DotPoint, startPoint, endPoint){
		var bSwitch =   false;   
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
		ctx.strokeStyle = "#f00";
		ctx.beginPath();
		var nLen = tripWire.length;
		for(var i =0;i < nLen; i++){
			if(tripWire[i].Valid){
				ctx.moveTo(tripWire[i].Line.EndPt.x, tripWire[i].Line.EndPt.y);
				ctx.lineTo(tripWire[i].Line.StartPt.x, tripWire[i].Line.StartPt.y);
				drawArrows(tripWire[i].Line.StartPt, tripWire[i].Line.EndPt);
				if(tripWire[i].IsDoubleDir){
					drawArrows(tripWire[i].Line.EndPt, tripWire[i].Line.StartPt);
				}
			}
		}
		ctx.closePath();
		ctx.stroke();
	}
	
	function SaveTripWireCfg() {
		var tripCfg = _opts.PEARuleCfg.TripWireRule.TripWire;

		if(typeof TripWirePosSet != "undefined" && typeof TripWirePosSet[0] != "undefined" && TripWirePosSet[0].bMoveStart)
		{
			tripCfg[0].Line.StartPt.x = parseInt(tripWire[0].Line.StartPt.x*8192/bkWidth);
			if(tripCfg[0].Line.StartPt.x > 8192) tripCfg[0].Line.StartPt.x=8192;
			tripCfg[0].Line.StartPt.y = parseInt(tripWire[0].Line.StartPt.y*8192/bkHeight);
			if(tripCfg[0].Line.StartPt.y > 8192) tripCfg[0].Line.StartPt.y=8192;
		}
		else
		{
			tripCfg[0].Line.StartPt.x = TripWirePosSet[0].StartX;
			tripCfg[0].Line.StartPt.y = TripWirePosSet[0].StartY;
		}
		if(typeof TripWirePosSet != "undefined" && typeof TripWirePosSet[0] != "undefined" && TripWirePosSet[0].bMoveEnd)
		{
			tripCfg[0].Line.EndPt.x = parseInt(tripWire[0].Line.EndPt.x*8192/bkWidth);
			if(tripCfg[0].Line.EndPt.x > 8192) tripCfg[0].Line.EndPt.x=8192;
			tripCfg[0].Line.EndPt.y = parseInt(tripWire[0].Line.EndPt.y*8192/bkHeight);
			if(tripCfg[0].Line.EndPt.y > 8192) tripCfg[0].Line.EndPt.y=8192;
		}
		else
		{
			tripCfg[0].Line.EndPt.x = TripWirePosSet[0].StopX;
			tripCfg[0].Line.EndPt.y = TripWirePosSet[0].StopY;
		}

		tripCfg[0].IsDoubleDir = tripWire[0].IsDoubleDir;
		if (typeof tripCfg[0].ForbiddenDir != 'undefined'){
			tripCfg[0].ForbiddenDir = tripWire[0].ForbiddenDir;
		}
		tripCfg[0].Valid = 1;
    }
	
	function SavePerimeterCfg(){
		var boundary = _opts.PEARuleCfg.PerimeterRule.LimitPara.Boundary;
		if(boundary.Points==void 0) boundary.Points=[];
		for(var i =0; i < pointNum;i++){
			if(boundary.Points[i] == void 0) boundary.Points[i]={};

			if(typeof PermiterPosSet != "undefined" && PermiterPosSet["MoveFlag"][i])
			{
				boundary.Points[i].x = parseInt(pts[i].x*8192/bkWidth);
				boundary.Points[i].y = parseInt(pts[i].y*8192/bkHeight);
			}
			else
			{
				boundary.Points[i].x = PermiterPosSet["Pts"][i].posX;
				boundary.Points[i].y = PermiterPosSet["Pts"][i].posY;
			}
			if(boundary.Points[i].x > 8192) boundary.Points[i].x=8192;
			if(boundary.Points[i].y > 8192) boundary.Points[i].y=8192;
		}
		boundary.PointNum = pointNum;
	}
	
	function SavePEARuleCfg(){
		_opts.PEARuleCfg.PerimeterEnable = 0;
		_opts.PEARuleCfg.TripWireEnable = 0;
		if($("#TripWireRadio").prop("checked")){
			_opts.PEARuleCfg.TripWireEnable = 1;
			SaveTripWireCfg();
		}else if($("#PerimeterRadio").prop("checked")){
			_opts.PEARuleCfg.PerimeterEnable = 1;
			_opts.PEARuleCfg.PerimeterRule.Mode = iMode;
			SavePerimeterCfg();
		}
	}

    $("#PZ_SV").click(function () {
        SavePEARuleCfg();
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
		var sMode = $(this).attr("data_mode");
		if(sMode == "sideIn"){
			iMode = 1;
		}else if(sMode == "sideOut"){
			iMode = 2;
		}else if(sMode == "sideBoth"){
			iMode = 0;
		}
		drawPolygon();
	});
	
	$(".rulemodeBtn[id^='line']").click(function(){
		var sDirect = $(this).attr("data_mode");
		if(sDirect == "lineIn"){
			var iDirection = LineSingle(tripWire[0].Line);
			if (iDirection == 2){
				var tempx = tripWire[0].Line.EndPt.x;
				var tempy = tripWire[0].Line.EndPt.y;
				tripWire[0].Line.EndPt.x = tripWire[0].Line.StartPt.x;
				tripWire[0].Line.EndPt.y = tripWire[0].Line.StartPt.y;
				tripWire[0].Line.StartPt.x = tempx;
				tripWire[0].Line.StartPt.y = tempy;

				TripWirePosSet[0].StartX = tripWire[0].Line.StartPt.x;
				TripWirePosSet[0].StartY = tripWire[0].Line.StartPt.y;
				TripWirePosSet[0].StopX = tripWire[0].Line.EndPt.x;
				TripWirePosSet[0].StopY = tripWire[0].Line.EndPt.y;
			}
			tripWire[0].IsDoubleDir=0;
			if (typeof tripWire[0].ForbiddenDir != 'undefined'){
				tripWire[0].ForbiddenDir=180;
			}
		}else if(sDirect == "lineOut"){
			var iDirection = LineSingle(tripWire[0].Line);
			if (iDirection == 1){
				var tempx = tripWire[0].Line.EndPt.x;
				var tempy = tripWire[0].Line.EndPt.y;
				tripWire[0].Line.EndPt.x = tripWire[0].Line.StartPt.x;
				tripWire[0].Line.EndPt.y = tripWire[0].Line.StartPt.y;
				tripWire[0].Line.StartPt.x = tempx;
				tripWire[0].Line.StartPt.y = tempy;

				TripWirePosSet[0].StartX = tripWire[0].Line.StartPt.x;
				TripWirePosSet[0].StartY = tripWire[0].Line.StartPt.y;
				TripWirePosSet[0].StopX = tripWire[0].Line.EndPt.x;
				TripWirePosSet[0].StopY = tripWire[0].Line.EndPt.y;
			}
			tripWire[0].IsDoubleDir=0;
			if (typeof tripWire[0].ForbiddenDir != 'undefined'){
				tripWire[0].ForbiddenDir=180;
			}
		}else{
			tripWire[0].IsDoubleDir=1;
			if (typeof tripWire[0].ForbiddenDir != 'undefined'){
				tripWire[0].ForbiddenDir=360;
			}
		}
		drawLines();
	});
	
	$(".shapeBtn").click(function(){
		var pointN = $(this).attr("data_point") * 1;
		CreateShape(pointN);
		drawPolygon();
	});
	
	ShowData();
};