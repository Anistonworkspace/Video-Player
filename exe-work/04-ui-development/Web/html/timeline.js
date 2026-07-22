//# sourceURL=timeline.js
var timeline = function(options) {
	var _opts = {
		chnNum : 1,
		divId : "",
		dataTypeArr : [g_recTypeEnum.RECORD_ALL],
		dataTypeColorArr : ["rgb(0,128,0)"],
		optimizeData : true,
		fontColor : "black",
		blankLeftWidth : 30,
		blankRightWidth : 30,
		b24Hour : false,
		clickCallback : function(chn, date, bInZone) {
		}
	};
	var ZoomLevel = [1, 2, 4, 8, 12, 24];
	var ColorArr = [];
	var _sHeight = 0;
	var _sWidth = 0;
	var _timeScaleHeight = 20;
	var _bottomBlankHeight = 10;
	var _itemHeight = 30;
	var _blankLeftWidth = 30;
	var _blankRightWidth = 30;
	var _scaleWidth = 0;
	var _scaleAreaWidth = 0;
	var _context;
	var _canvasObj;
	var _canvasPosObj;
	var _divObj;
	var _movePointers = [];
	var _clickPointers = [];
	var _curTime;
	var _selectedLines = [];
	var _zoomLevel = 0;
	var _bMousedown = false;
	var _bDrag = false;
	var _scrollX = 0;
	var _leftSpaceWidth = 0;
	var _offsetLeft = 0;
	var _sData = [];
	var _data = [];
	var _bSync = false;
	var _strCurSelectTime = "";
	var _selectedChn = 0;
	var _mousemoveTimes = 0;

	this.bInit = false;
	function _getLeftAndWidth(Begin, End) {
		var left = 0.0001;
		var width = 0.0001;
		//传进来Min钟转成Sec，通过阵列比例获取宽度
		left = (Begin * _scaleWidth * 60) / (120 / ZoomLevel[_zoomLevel]*60);
		width = (End * _scaleWidth * 60) / (120 / ZoomLevel[_zoomLevel]*60) - left;
		return {
			left : left + _blankLeftWidth,
			width : width
		};
	};
	function _MaxZero(num) {
		return num > 0 ? 0 : num;
	};
	function _initData() {
		_context.beginPath();
		var style = _context.fillStyle;
		for (var chn=0; chn<_opts.chnNum; chn++) {
		for (var i = 0; i < _opts.dataTypeArr.length; i++) {
				for (var j = 0;j<_data[chn][_opts.dataTypeArr[i]].length; j++) {
					if(bInEnum(_opts.dataTypeArr[i], g_recTypeEnum)){
						_context.fillStyle = ColorArr[_opts.dataTypeArr[i]];
					}else{
						_context.fillStyle = ColorArr[g_recTypeEnum.RECORD_ALL];
					}
					var leftAndWidth = _getLeftAndWidth(_data[chn][_opts.dataTypeArr[i]][j].Begin, _data[chn][_opts.dataTypeArr[i]][j].End);
					var left = leftAndWidth.left + _MaxZero(_leftSpaceWidth + _offsetLeft);
					var width = leftAndWidth.width;
					if (left < _blankLeftWidth) {
						width -= _blankLeftWidth - left;
						if (width < 0) {
							continue;
						}
						left = _blankLeftWidth;
		
					} else if (left > _blankLeftWidth + _scaleAreaWidth) {//111
						continue;
					}  
					if (left + width > _blankLeftWidth + _scaleAreaWidth) {
						width = _blankLeftWidth + _scaleAreaWidth - left;
					}
					_context.clearRect(left, _timeScaleHeight + _itemHeight * chn, width, _itemHeight);
					_context.fillRect(left, _timeScaleHeight + _itemHeight * chn, width, _itemHeight);
				}
			
			}
		}
		_context.fillStyle = style;
		
		//Draw the channel line
		for (var i = 0; i <= _opts.chnNum; i++) {
			if(i % 2 == 0){
				_context.moveTo(0, _timeScaleHeight + _itemHeight * i - 0.5*((i+1)%2));
				_context.lineTo(_sWidth, _timeScaleHeight + _itemHeight * i - 0.5*((i+1)%2));
			}else{
				_context.moveTo(0, _timeScaleHeight + _itemHeight * i - 0.5*((i+1)%2) + 0.5);
				_context.lineTo(_sWidth, _timeScaleHeight + _itemHeight * i - 0.5*((i+1)%2) + 0.5);
			}	
		}
		
		//Drawing on the left side of the line
		if(0){
			_context.moveTo(_blankLeftWidth - 0.5, _timeScaleHeight);
			_context.lineTo(_blankLeftWidth - 0.5, _timeScaleHeight + _itemHeight * _opts.chnNum);
			
			var font = _context.font;
			_context.font = "18px Calibri";
			var style = _context.fillStyle;
			_context.fillStyle = _opts.fontColor;
			for (var i = 1; i <= _opts.chnNum; i++) {
				if(_selectedChn == i-1){
					_context.fillStyle = "#E7B041";
				}else{
					_context.fillStyle = _opts.fontColor;
				}
				_context.fillText("0"+i, 30, _timeScaleHeight + _itemHeight * i - 5);
			}
			_context.fillStyle = style;
			_context.font = font;
		}
		_context.stroke();
		_context.closePath();

	};
	function _initScale() {
		try{
			_context.beginPath();
			_context.lineWidth = "1";
			_context.strokeStyle = _opts.fontColor;
			var mins = 120 / ZoomLevel[_zoomLevel];
			var startMins = 0;
			var nums = 12;
			startMins = mins * Math.ceil(Math.abs(_MaxZero(_leftSpaceWidth + _offsetLeft)) / _scaleWidth);
			if (startMins == 0) {
				nums = 13;
			}
			for (var i = 0, j = 0; j < nums; i++) {
				var xPos = _blankLeftWidth + _scaleWidth * i + _MaxZero(_leftSpaceWidth + _offsetLeft);
					if (xPos < _blankLeftWidth || xPos > (_sWidth - _blankRightWidth)) {
					continue;
				}
				_context.moveTo(xPos - 0.5, _timeScaleHeight - 5);
				_context.lineTo(xPos - 0.5, _timeScaleHeight);
				j++;
			}
			_context.fillStyle = _opts.fontColor;
			for (var i = 0, j = 0; j < nums; i++) {
				var dateText = '';
				var hours = Math.floor(startMins / 60);
				var minutes = startMins - hours * 60;
	
				if (hours < 10) {
					dateText = "0" + hours + ":";
				} else {
					if(hours == 24 && _opts.b24Hour == false){
						dateText = "00:";
					}else{
						dateText = hours + ":";
					}
				}
				if (minutes < 10) {
					dateText += "0" + minutes;
				} else {
					dateText += minutes;
				}
				var xPos = _blankLeftWidth + _scaleWidth * i + _MaxZero(_leftSpaceWidth + _offsetLeft);
					if (xPos < _blankLeftWidth || xPos > (_sWidth - _blankRightWidth)) {
						continue;
					}
					_context.fillText(dateText, xPos - 14, _timeScaleHeight - 7);
					j++;
					startMins += mins;
			}
			_context.stroke();
			_context.closePath();
		}catch(e)
		{
		}
		
	};
	function _findPointerY(height) {
		if (height > _timeScaleHeight && height < (_sHeight - _bottomBlankHeight)) {
			return Math.floor((height - _timeScaleHeight) / _itemHeight);
		} else {
			return -1;
		}
	};
	function _showClickPointer(event) {
		//var thisX = _canvasObj.get(0).offsetLeft;
		var thisX =	_divObj.offset().left;
		var thisY = _divObj.offset().top;
		var scrollLeft = getScrollLeft();
		var scrollTop = getScrollTop();
		var pointerPos = scrollLeft + (event.clientX || event.pageX) - thisX - _blankLeftWidth;

		if (pointerPos < 0 || pointerPos > (_scaleAreaWidth)) {
			return;
		}

		if(_bSync) {
			for (var i=0; i<_opts.chnNum; i++) {
				_clickPointers[i].css("display", "block").css("margin-left", pointerPos + _blankLeftWidth);
			}
		} else {
			var chn = _findPointerY((event.clientY || event.pageY) - thisY + scrollTop);
			if (chn != -1) {
				_clickPointers[chn].css("display", "block").css("margin-left", pointerPos + _blankLeftWidth);
			}
		}
	};
	function _reDraw() {
		_context.clearRect(0, 0, _sWidth, _sHeight);
		_initScale();
		_initData();
	};
	function _hideClickPointer() {
		for (var i = 0; i < _opts.chnNum; i++) {
			_clickPointers[i].css("display", "none");
		}
	};
	function _hideAllMovePointer(){
		for(var i = 0;i < _opts.chnNum;++i){
			_movePointers[i].css("display", "none");
		}
	}
	function _selected(chn) {
		_context.beginPath();
		var font = _context.font;
		var style = _context.fillStyle;
		_context.font = "18px Calibri";
		_context.fillStyle = _opts.fontColor;
		for(var i =0; i<_opts.chnNum; i++){
			if(i == chn){
				_context.fillStyle = "#E7B041";
			}
			_context.clearRect(2, _timeScaleHeight + _itemHeight * i + 2 , _blankLeftWidth-4, _itemHeight - 4);
			_context.fillText("0"+(i+1), 30, _timeScaleHeight + _itemHeight * (i+1) - 5);
			_context.fillStyle = style;
		}
		_context.font = font;
		_context.stroke();
		_context.closePath();
	};
	function _showCurTime(event) {
		var thisX =	_divObj.offset().left;
		var thisY = _divObj.offset().top;
		var scrollLeft = getScrollLeft();
		var pointerPos = scrollLeft + (event.clientX || event.pageX) - thisX - _blankLeftWidth - _leftSpaceWidth -  _offsetLeft;
		
		if (pointerPos < _offsetLeft - _leftSpaceWidth) {
			pointerPos = _offsetLeft - _leftSpaceWidth;
		} else if (pointerPos > (_scaleAreaWidth - _leftSpaceWidth)) {
			pointerPos = _scaleAreaWidth - _leftSpaceWidth;
		}
		var seconds = pointerPos * (60 * 120 / ZoomLevel[_zoomLevel]) / _scaleWidth;
		var Hour = seconds / 3600;
		var Minute = (seconds - Math.floor(Hour) * 3600) / 60;
		var Second = seconds - Math.floor(Hour) * 3600 - Math.floor(Minute) * 60;
		
		var strCurTime = "";
		if(Math.floor(Hour) < 10)
			strCurTime += "0" + Math.floor(Hour) + ":";
		else{
			if(Math.floor(Hour)==24){
				strCurTime += "00:";
			}else{
				strCurTime += Math.floor(Hour) + ":";
			}
		}
		if(Math.floor(Minute) < 10)
			strCurTime += "0" + Math.floor(Minute) + ":";
		else
			strCurTime += Math.floor(Minute) + ":";
		if(Math.floor(Second) < 10)
			strCurTime += "0" + Math.floor(Second);
		else
			strCurTime += Math.floor(Second);
			
		_strCurSelectTime = strCurTime;
		var marginLeft = scrollLeft + (event.clientX || event.pageX) - thisX;
		if(marginLeft < _blankLeftWidth)
			marginLeft = _blankLeftWidth;
		else if(marginLeft > _scaleAreaWidth + _blankLeftWidth)
			marginLeft = _scaleAreaWidth + _blankLeftWidth;

		_curTime.show();
		_curTime.css("margin-left", marginLeft - _curTime.width()/2);
		_curTime.text(strCurTime);
		
	};
	function _clickCallback(event){
		//var thisY = _canvasObj.get(0).offsetTop;
		var thisX =	_divObj.offset().left;
		var thisY = _divObj.offset().top;
		var scrollTop = getScrollTop();
		var scrollLeft = getScrollLeft();
		var marginLeft = scrollLeft + (event.clientX || event.pageX) - thisX;
		var bInZone = false;
		if(marginLeft >= _blankLeftWidth && marginLeft <= _scaleAreaWidth + _blankLeftWidth)
			bInZone = true;
		var chn = _findPointerY((event.clientY || event.pageY) - thisY + scrollTop);
		if (chn != -1) {
			_opts.clickCallback(chn, _strCurSelectTime, bInZone);
			if(0){
				_selected(chn);
			}
			_selectedChn = chn;
		}
	};
	function _bindEvent(){
		$("#" + _opts.divId).off().mousedown(function(event){
			_bMousedown = true;
			_mousemoveTimes = 0;
			var event = event || window.event;
			_scrollX = event.pageX;
			_showClickPointer(event);
		}).mousemove(function(event){
			var event = event || window.event;
			if(_bMousedown){
				_bDrag = true;
				_mousemoveTimes++;
			}
			if (_bDrag) {
				$(this).addClass('timeline-canvas-drag');
				_offsetLeft = event.pageX - _scrollX;
				if(_offsetLeft == 0){
					return;
				}
				if (_leftSpaceWidth + _offsetLeft > 0) {
					_offsetLeft = 0 - _leftSpaceWidth;
					return;
				} else if (_scaleAreaWidth - (_leftSpaceWidth + _offsetLeft) > _scaleWidth * ZoomLevel[_zoomLevel] * 12) {
					_offsetLeft = _scaleAreaWidth - _leftSpaceWidth - _scaleWidth * ZoomLevel[_zoomLevel] * 12;
					return;
				}
				_reDraw();
				_hideClickPointer();
				_hideAllMovePointer();
			}
			_showCurTime(event);
		}).mouseup(function(event){
			$(this).removeClass('timeline-canvas-drag');
			var event = event || window.event;
			if(!_bDrag || _mousemoveTimes<3){
				_clickCallback(event);
			}
			_bMousedown = false;
			_bDrag = false;
			_leftSpaceWidth += _offsetLeft;
			_offsetLeft = 0;
			_mousemoveTimes = 0;
			_hideClickPointer();
		}).mouseleave(function(event){
			$(this).removeClass('timeline-canvas-drag');
			var event = event || window.event;
			_bMousedown = false;
			_bDrag = false;
			_leftSpaceWidth += _offsetLeft;
			_offsetLeft = 0;
			_hideClickPointer();
			_curTime.hide();
		});
	};
	function _createCanvas() {
		_canvasObj = $('<canvas id="myCanvas" style="position: absolute;z-index:1;">')
			.appendTo(_divObj)
			.on('mousewheel', function(event) {
				var event = event || window.event;
				if (event.deltaY === 0)
					return;
				if (event.deltaY > 0) {
					_zoom((event.clientX || event.pageX), _zoomLevel + 1);
					event.preventDefault();
				} else {
					_zoom((event.clientX || event.pageX), _zoomLevel - 1);
					event.preventDefault();
				}
		});

		for (var i = 0; i < _opts.chnNum; i++) {
			_movePointers[i] = $('<div class="timeline-movepointer">')
				.css("position", "absolute").css("z-index", 10)
				.css("top", _timeScaleHeight + i * _itemHeight).css("height", _itemHeight)
				.css("width", 1).css("display", "none").css("background-color", "rgb(128,0,128)").appendTo(_divObj);
		}

		for (var i = 0; i < _opts.chnNum; i++) {
			_clickPointers[i] = $('<div class="timeline-clickpointer">')
				.css("position", "absolute").css("z-index", 10)
				.css("top", _timeScaleHeight + i * _itemHeight).css("height", _itemHeight)
				.css("width", 1).css("display", "none").css("background-color", "rgb(128,0,128)").appendTo(_divObj);
		}
		
		_curTime = $('<div id="timeline-curtime" class="timeline-curtime">')
				.css("position", "absolute").css("z-index", 10)
				.css("top", 0).css("width", 48).css("height", 12)
				.css("margin-left", _blankLeftWidth - 48/2)
				.appendTo(_divObj);
				
		for (var i = 0; i < 2; i++) {
			_selectedLines[i] = $('<div class="timeline-selectedlines">')
				.css("position", "absolute").css("z-index", 10)
				.css("top", _timeScaleHeight + i * _itemHeight).css("width", '100%')
				.css("height", 2).css("display", "none").appendTo(_divObj);
		}

		var canvas = document.getElementById("myCanvas");
		canvas.width = _sWidth;
		canvas.height = _sHeight;
		_context = canvas.getContext("2d");
		if (_context == null)
			return false;

		return true;
	};
	function _sortData(){
		for (var i=0; i<_opts.chnNum; i++) {
			_data[i] = [];
			for(var j=0; j<_opts.dataTypeArr.length; j++){
				_data[i][_opts.dataTypeArr[j]] = [];
			}
		}
		if(_sData.length == 0)
			return;
		var sPx = 60 * 120 / ZoomLevel[_zoomLevel] /_scaleWidth;
		var tempRecordData = [];
		$.extend(true, tempRecordData, _sData);
		for(var i=0; i<tempRecordData.length; i++){
			var dataTemp = tempRecordData[i];	
			_data[dataTemp.chn][dataTemp.Type].push(dataTemp);
		}
	};
	function _zoom(clientX, level) {
		var level = Math.min(5, Math.max(0, level));
		if (_zoomLevel === level)
			return;
		_hideAllMovePointer();
		var thisX = _divObj.offset().left;
		var offset =  clientX- thisX - _blankLeftWidth + Math.abs(_leftSpaceWidth);
		offset = offset * ZoomLevel[level] / ZoomLevel[_zoomLevel];
		var leftOffset = offset - (clientX - thisX - _blankLeftWidth);
		if(leftOffset > (_scaleWidth * 12 * ZoomLevel[level]- _scaleAreaWidth)){
			_leftSpaceWidth = 0 - (_scaleWidth * 12 * ZoomLevel[level] - _scaleAreaWidth);
		}else if(leftOffset < 0){
			_leftSpaceWidth = 0;
		}else{
			_leftSpaceWidth = 0 - leftOffset;
		}
		_zoomLevel = level;
		_context.clearRect(0, 0, _sWidth, _sHeight);
		_initScale();
		_sortData();
		_initData();
	};
	function _getDiffTime(preTime, nextTime){
		return ((nextTime.Hour - preTime.Hour)*3600 + (nextTime.Minute - preTime.Minute)*60 + (nextTime.Second - preTime.Second));
	};
	_create(this, options);
	function _create(p, options) {
		try{
			_opts = $.extend(_opts, options);
			_blankLeftWidth = _opts.blankLeftWidth;
			_blankRightWidth = _opts.blankRightWidth;
			if (_opts.divId != "") {
				_divObj = $("#" + _opts.divId);
				_divObj.empty();
				document.getElementById(_opts.divId).onselectstart= function(){
					return false;
				};
			} else {
				return false;
			}
	
			for (var i=0; i<_opts.chnNum; i++) {
				_data[i] = [];
				for(var j=0; j<_opts.dataTypeArr.length; j++){
					_data[i][_opts.dataTypeArr[j]] = [];
				}
			}
			for(var i=0; i<_opts.dataTypeArr.length; i++){
				ColorArr[_opts.dataTypeArr[i]] = _opts.dataTypeColorArr[i];
			}
			
			_sHeight = _divObj.height();
			_sWidth = _divObj.width();
			_itemHeight = (_sHeight - _timeScaleHeight - _bottomBlankHeight) / _opts.chnNum;
			_scaleAreaWidth = _sWidth - _blankLeftWidth - _blankRightWidth;
			_scaleWidth = _scaleAreaWidth / 12;
			p.bInit = _createCanvas();
			_initScale();
			_initData();
			_bindEvent();
		}catch(e){
		}
		
	};
	this.initData = function(data) {
		try{
			if (typeof(data) != "undefined" && !$.isArray(data))
				return;
			if(typeof(data) == "undefined"){
				data = [];
			}
			_sData = data;
			_sortData();
			_reDraw();
		}catch(e){
			DebugStringEvent("Timeline initData error!");
		}
	};
	this.setSync = function(bSync) {
		_bSync = bSync;
	};
	this.setCurChn = function(chn) {
		if(chn<0 || chn >= _opts.chnNum){
			_selectedLines[0].css("display","none");
			_selectedLines[1].css("display","none");
			return;
		}
			
		_selectedChn = chn;
		_selectedLines[0].css("display","block").css("top",_timeScaleHeight+chn*_itemHeight+"px");
		_selectedLines[1].css("display","block").css("top",_timeScaleHeight+(chn+1)*_itemHeight+"px");
	};
	this.resize = function(){
		_sHeight = _divObj.height();
		_sWidth = _divObj.width();
		_itemHeight = (_sHeight - _timeScaleHeight - _bottomBlankHeight) / _opts.chnNum;
		_scaleAreaWidth = _sWidth - _blankLeftWidth - _blankRightWidth;
		_scaleWidth = _scaleAreaWidth / 12;
		for (var i = 0; i < _opts.chnNum; i++) {
			_movePointers[i].css("top", _timeScaleHeight + i * _itemHeight).css("height", _itemHeight);
			_clickPointers[i].css("top", _timeScaleHeight + i * _itemHeight).css("height", _itemHeight);
		}
		_canvasObj.attr("width", _sWidth);
		_canvasObj.attr("height", _sHeight);
		_reDraw();
	};
	this.showMovePointer = function(wnd, date) {
		try{
			var seconds = date.Hour * 60 * 60 + date.Minute * 60 + date.Second;
			var pointerPos = seconds * _scaleWidth / (60 * 120 / ZoomLevel[_zoomLevel]);
			if(((pointerPos - Math.abs(_leftSpaceWidth)) > 0) && 
				((pointerPos - Math.abs(_leftSpaceWidth)) < _scaleAreaWidth) &&
				!_bDrag){
					if(_opts.chnNum == 1){
						_movePointers[0].css("display", "block").css("margin-left", pointerPos - Math.abs(_leftSpaceWidth) + _blankLeftWidth);
					}else{
						_movePointers[wnd].css("display", "block").css("margin-left", pointerPos - Math.abs(_leftSpaceWidth) + _blankLeftWidth);
					}
			}else{
				if(_opts.chnNum == 1){
					_movePointers[0].css("display", "none");
				}else{
					_movePointers[wnd].css("display", "none");
				}
				
			}
		}catch(e){
			if(window.console){
				DebugStringEvent("Timeline showMovePointer error!");
			}
		}
	};
	this.hideMovePointer = function(wnd) {
		if(wnd<0 || wnd >= _opts.chnNum){
			return;
		}
		_movePointers[wnd].css("display", "none");
	};
	this.zoomIn = function() {
		if(_movePointers[_selectedChn].css("display") == "block"){
			_zoom(_movePointers[_selectedChn].offset().left,_zoomLevel+1);
		}else{
			_zoom(_divObj.offset().left+_blankLeftWidth+_scaleAreaWidth/2,_zoomLevel+1);
		}
		
	};
	this.zoomOut = function() {
		if(_movePointers[_selectedChn].css("display") == "block"){
			_zoom(_movePointers[_selectedChn].offset().left,_zoomLevel-1);
		}else{
			_zoom(_divObj.offset().left+_blankLeftWidth+_scaleAreaWidth/2,_zoomLevel-1);
		}
	};
	this.setColor = function(type,color){
		if(typeof ColorArr[type] != 'undefined'){
			ColorArr[type] = color;
		}
	}
};

function bInEnum(value, enumObj){
	for(var i in enumObj){
		if(value == enumObj[i]){
			return true;
		}
	}
	return false;
}

