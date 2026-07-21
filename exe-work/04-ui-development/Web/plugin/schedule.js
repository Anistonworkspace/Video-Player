//# sourceURL=schedule.js
function ScheduleFun() {
    var schedule = {};

    var _opts = {
        color: ["rgb(80,160,55)"], //Color value, determines the number of options and rows
        option: ["Set the color and option name"], //Option name, which corresponds to the number of color values
        date: ["Sun.", "Mon.", "Tues.", "Wed.", "Thur.", "Fri.", "Sat."], //Date translation
        borderwidth: 1, //Border width
        cellheight: 18, //Cell height
        cellwidth: 15, //Cell width
        bordercolor: "white", //Border color
        fontcolor: "white", //font color
        bordercollapse: true, //Whether to collapse the border
        circlewidth: 4, //Out circle width
        dotwidth: 6, //inner dot width
        spacing: 3, //Spacing width
        controlbar: "horizontal", //horizontal(horizontal-top),horizontal-top,horizontal-bottom,vertical(vertical-right),vertical-right,vertical-left
        parentcolor: "black", //When compatible with IE8 radio, the middle blank color,default black
		limitTips: "LimitSection"
    };
    var _parent = "";

    var _date_width;
    var _height;
    var _width;

    var _init = false;
    var _startX = 0;
    var _startY = 0;
    var _endX = 0;
    var _endY = 0;
    var _bDrag = false;
	var _pageTitle = "";
    var _From = {
        x: -1,
        y: -1
    };
    var _To = {
        x: -1,
        y: -1
    };
    var _lastmovepos;
    var _selectRow = 0;
    var _data = [];
    var _radio = new Radio();
	var _ie8 = false;

    schedule.SetData = function (data) {
        if (_init) {
            _data = data.slice(0);
            DrawSchule();
        }
    };

    schedule.GetData = function () {
        if (_init) {
            return _data;
        }
    };
	
	schedule.GetSelectRadio = function () {
		if (_init) {
			return _radio.GetRadio();
		}
	}

    schedule.SwitchColor = function (index) {
        if (!_init || index >= _opts.color.length)
            return;
        _selectRow = index;
    };

    schedule.CreateSchedule = function (parent, options) {
	if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g,
			"") == "MSIE8.0") {
		_ie8 = true;
	}
        _init = true;
        _parent = parent;
        _opts = $.extend(_opts, options);
        _opts.callback = RadioCallback;
        _date_width = _opts.cellwidth * 4;
        _height = (_opts.cellheight * 7) * _opts.color.length;
        _width = _opts.cellwidth * 48;
		if(options.pageTitle) _pageTitle = options.pageTitle;

        $("#" + _parent).empty().css({
            "width": _width + _opts.cellwidth * 4 + _date_width,
            "color": _opts.fontcolor,
            "height":_height +  60
        });

        var html = "";
        if (_opts.controlbar == "horizontal" ||
            _opts.controlbar == "horizontal-top") {
            html += '<div id="schedule_' + _parent + '_radio" ' +
                'style="margin-left:' + _opts.cellwidth * 4 + 'px;' +
                'width:' + _width + 'px;' +
                'height:' + (_ie8?((_opts.circlewidth * 2 + _opts.spacing * 2 + _opts.dotwidth) + 'px;'):'auto;') +
                '"></div>';
        } else if (_opts.controlbar == "vertical-left") {
            html += '<div id="schedule_' + _parent + '_radio" ' +
                'style="float:left;' +
                'margin-top:' + _opts.cellheight * 2 + 'px;' +
                'height:' + (_opts.circlewidth * 2 + _opts.spacing * 2 + _opts.dotwidth) + 'px;' +
                '"></div>';
        }
        html += '<div ' +
            'style="position:relative;' +
            'moz-user-select:-moz-none; -moz-user-select: none; -o-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;' +
            '">' +
            '<table ' +
            'style="border-spacing:0;text-align:right;' +
            'width:' + _opts.cellwidth * 4 + 'px;' +
            'height:' + (_height) + 'px;' +
            'float:left;' +
            'text-align:center;' +
            'margin-top:' + (_opts.cellheight * 2 + 1.5) + 'px;">'
        for (var i = 0; i < 7; ++i) {
            html += '<tr>' +
                '<td ' +
                'style="border-bottom:' + _opts.borderwidth * (_opts.bordercollapse ? 1 : 2) + 'px solid;">' +
                _opts.date[i] + '</td></tr>';
        }
        html += '</table>';
        html += '<div><table style="line-height:' + (_opts.cellheight * 3 / 2) + 'px;margin-left:-' + _opts.cellwidth *
            2 +
            'px;table-layout:fixed;border-spacing:0;float:left;width:' + (_width + _opts.cellwidth * 4) +
            'px;height:' +
            _opts.cellheight + 'px;border:none;text-align:center;">';
        html += '<tr>';
        for (var j = 0; j < 13; ++j) {
            html += '<td>' + j * 2 + '</td>';
        }
        html += '</tr></table>';
        html += '<table style="' + (_opts.bordercollapse ? 'border-collapse: collapse;' : '') +
            'border-spacing:0;float:left;width:' + _width + 'px;height:' + _opts.cellheight / 2 +
            'px;border:' + _opts.borderwidth + 'px solid ' + _opts.bordercolor +
            ';border-top:none;border-bottom:none;">';
        for (var i = 0; i < 2; ++i) {
            html += '<tr>';
            for (var j = 0; j < 48; ++j) {
                html += '<td style="border:' + _opts.borderwidth +
                    'px solid ' + _opts.bordercolor + ';border-top:none;border-bottom:none;border-left:' +
                    (j % 4 == 0 ? '' : _opts.borderwidth + 'px solid transparent') +
                    ';border-right:' + (i == 1 ? '' : (j % 4 == 3 ? '' : _opts.borderwidth + 'px solid transparent')) +
                    ';"></td>';
            }
            html += '</tr>';
        }
        html += '</table>';
        html += '<div id="schedule_' + _parent +
            '_table" style="position:relative;"><table style="' + (_opts.bordercollapse ?
                'border-collapse: collapse;' : '') + 'table-layout:fixed;border-spacing:0;float:left;width:' +
            _width + 'px;height:' + _height + 'px;border:' + _opts.borderwidth + 'px solid ' + _opts.bordercolor +
            ';">';
        for (var i = 0; i < 7; ++i) {
            for (var row = 0; row < _opts.color.length; ++row) {
                html += '<tr style="height:' + _opts.cellheight + 'px;">';
                for (var j = 0; j < 48; ++j) {
                    html += '<td id="schedulecell_' + _parent + '_' + row + '_' + i + '_' + j + '" ' +
                        'style="border:' + _opts.borderwidth + 'px solid ' + _opts.bordercolor + ';' +
                        'border-left:' + (j % 4 == 0 ? '' : _opts.borderwidth + 'px') +
                        ';border-top:' + (row == 0 ? '' : _opts.borderwidth + 'px') +
                        ';background:transparent;">';
                }
                html += '</tr>';
            }
        }
        html += '<div id="schedule_' + _parent +
            '_mask" style="pointer-events:none;position:absolute;background:skyblue;border:1px solid blue;opacity:0.5;filter:alpha(opacity=50);display:none;"></div>';
        html += '</table></div></div></div>';

        if (_opts.controlbar == "horizontal-bottom") {
            html += '<div id="schedule_' + _parent + '_radio" style="position:relative;margin-left:' + _opts.cellwidth * 4 + 'px;top:' + _opts.cellheight + 'px;width:' + _width + 'px;height:0px;"></div>';
        } else if (_opts.controlbar == "vertical" || _opts.controlbar == "vertical-right") {
            html += '<div id="schedule_' + _parent + '_radio" style="float:left;margin-left:' + _opts.cellwidth + 'px;"></div>';
        }

        $("#" + _parent).append(html);

        if (_opts.controlbar == "vertical" ||
            _opts.controlbar == "vertical-left" ||
            _opts.controlbar == "vertical-right") {
            _opts.horizontal = false;
        }

        _radio.CreateRadio("schedule_" + _parent + "_radio", _opts);
        if (_opts.controlbar == "vertical" ||
            _opts.controlbar == "vertical-left" ||
            _opts.controlbar == "vertical-right") {
            $("#" + _parent).css("width", $("#schedule_" + _parent + "_radio").css("width").split("px")[0] * 1 + $("#" + _parent).css("width").split("px")[0] * 1 + "px")
        }
        //_radio.SetRadio(0);
        $("#schedule_" + _parent + "_mask").mouseup(function (e) {
            var off = $("#" + _parent + "_table").offset();
            var __xx = (e.pageX || e.clientX + document.body.scroolLeft);
            var __yy = (e.pageY || e.clientY + document.body.scrollTop);
            GetCellByPos(__xx, __yy);
        });

        $("#schedule_" + _parent + "_table").mousedown(function (e) {
            e = e || window.event;
			var __xx = (e.pageX || e.clientX + document.body.scroolLeft) - $(this).offset().left - _opts.borderwidth;
			var __yy = (e.pageY || e.clientY + document.body.scrollTop) - $(this).offset().top - _opts.borderwidth;
			_startX = __xx;
			_startY = __yy;
			_endX = _startX;
			_endY = _startY;
			_bDrag = true;
			$("#schedule_" + _parent + "_mask").attr({
			    "x": _startX,
			    "y": _startY,
			    "width": "0",
			    "height": "0"
			}).css({
			    "left": _startX,
			    "top": _startY,
			    "width": "0",
			    "height": "0"
			}).show();
			if (e.target.id.indexOf("schedulecell_") != -1) {
			    var id = e.target.id.split("_");
			    _From.x = id[4] * 1;
			    _From.y = id[3] * 1;
			}
        }).mouseup(function (e) {
            if (e.target.id.indexOf("schedulecell_") != -1) {
                var id = e.target.id.split("_");
                if (_bDrag) {
                    _To.x = id[4] * 1;
                    _To.y = id[3] * 1;
                    _lastmovepos = this;
                    $("#schedule_" + _parent + "_mask").hide();
                    ChangeData();
                    _bDrag = false;
                }
            }
        }).mousemove(function (e) {
            if (e.target.id.indexOf("schedulecell_") != -1) {
                _lastmovepos = this;
            }
        });
        $(document).unbind("mouseup", mouseupCallback).unbind("mousemove", mousemoveCallback);
        $(document).mouseup(mouseupCallback).mousemove(mousemoveCallback);
        document.getElementById(_parent).ondragstart = function () { //Forbid firefox drag
            return false;
        };
        document.getElementById(_parent).onselectstart = function () { //Forbid chrome select
            return false;
        };
    };

    function mouseupCallback(e) {
        if (_bDrag) {
            var __xx = (e.pageX || e.clientX + document.body.scroolLeft);
            var __yy = (e.pageY || e.clientY + document.body.scrollTop);
            GetCellByPos(__xx, __yy);
        }
    }

    function mousemoveCallback(e) {
        if ($("#schedule_" + _parent + "_table").length == 0) {
            $(document).unbind("mouseup", mouseupCallback).unbind("mousemove", mousemoveCallback);
        }
        if (!_bDrag)
            return;
        var off = $("#schedule_" + _parent + "_table").offset();
        e = e || window.event;
        var __xx = (e.pageX || e.clientX + document.body.scroolLeft);
        var __yy = (e.pageY || e.clientY + document.body.scrollTop);
        _endX = __xx - off.left - _opts.borderwidth;
        _endY = __yy - off.top - _opts.borderwidth;
        $("#schedule_" + _parent + "_mask")
            .empty()
            .attr({
                "x": _startX > _endX ? _endX : _startX,
                "y": _startY > _endY ? _endY : _startY,
                "width": Math.abs(_endX - _startX),
                "height": Math.abs(_endY - _startY)
            })
            .css({
                "left": _startX > _endX ? _endX : _startX,
                "top": _startY > _endY ? _endY : _startY,
                "width": Math.abs(_endX - _startX),
                "height": Math.abs(_endY - _startY)
            });
    }

    function GetCellByPos(x, y) {
        var cellx = 47;
        var celly = 6;

        var off = $("#" + _parent + "_table").offset();
        for (var i = 1; i < 7; ++i) {
            if (y < $("#schedulecell_" + _parent + "_0" + "_" + i + "_0").offset().top) {
                celly = i - 1;
                break;
            }
        }
        for (var i = 1; i < 48; ++i) {
            if (x < $("#schedulecell_" + _parent + "_0" + "_0" + "_" + i).offset().left) {
                cellx = i - 1;
                break;
            }
        }
        $("#schedulecell_" + _parent + "_" + _selectRow + "_" + celly + "_" + cellx).mouseup();
    }

    function ChangeData() {
        if (_From.x > 47 && _From.y > 6)
            return;
        if (_From.x > 47)
            _From.x = 47;
        if (_From.y > 6)
            _From.y = 6;
        var __state = (!_data[_selectRow][_From.y][_From.x]) * 1;
        var start = {};
        var end = {};
        start.y = _To.y < _From.y ? _To.y : _From.y;
        start.x = _To.x < _From.x ? _To.x : _From.x;
        end.y = _To.y < _From.y ? _From.y : _To.y;
        end.x = _To.x < _From.x ? _From.x : _To.x;
		var tempData = cloneObj(_data);
        for (var i = start.y; i <= end.y; ++i) {
            for (var j = start.x; j <= end.x; ++j) {
                tempData[_selectRow][i][j] = __state;
            }
        }
		var nNum = GetSectionNumber(tempData,_From.y);
		if(nNum <= 6){
			_data = cloneObj(tempData);
			DrawSchule(true);
		}
		else{
			ShowPaop(_pageTitle, _opts.limitTips);
		}
    }

    function DrawSchule(single) {
        var row;
        for ((single ? row = _selectRow : row = 0); row < (single ? _selectRow + 1 : _opts.color.length); ++row) {
            for (var i = 0; i < 7; ++i) {
                for (var j = 0; j < 48; ++j) {
                    $("#schedulecell_" + _parent + "_" + row + "_" + i + "_" + j).css("background", _data[row][i][j] ?
                        _opts.color[row] : "transparent");
                }
            }
        }
    }

    function RadioCallback(index) {
        schedule.SwitchColor(index);
    }
	
	function GetSectionNumber(a,b){
		var arrSec = [];
		var nStart = 0;
		var nEnd = 0;
		var j =0;
		var bFound = false;
		for (var k = 0; k < _opts.color.length; ++k) {
			for (j = 0; j < 48; ++j) {
				var temp = a[k][b][j];
				if(temp){
					if(!bFound){
						bFound = true;
						nStart = j;
					}
				}else if(!temp){
					if(bFound){
						nEnd = j;
						var nLen = arrSec.length;
						var temp = nStart + "-" + nEnd;
						for(var m =0; m< nLen;m++){
							if(arrSec[m] == temp){
								break;
							}
						}
						if(m == nLen){
							arrSec[nLen] = temp;
						}
						bFound = false;
					}
				}
			}
			if(bFound){
				nEnd = j;
				var nLen = arrSec.length;
				var temp = nStart + "-" + nEnd;
				for(var m =0; m< nLen;m++){
					if(arrSec[m] == temp){
						break;
					}
				}
				if(m == nLen){
					arrSec[nLen] = temp;
				}
				bFound = false;
			}
		}
		return arrSec.length;
	}

    return schedule;
}

//Radio Control
function Radio() {
    var radio = {};

    _opts = {
        color: ["red"],
        option: ["Normal", "Motion", "Alarm"],
        circlewidth: 4,
        dotwidth: 8,
        spacing: 4,
        callback: function () {},
        horizontal: true,
        parentcolor: "black"
    };
    var _parent;
    var _group;
    var _init = false;
    var _selectRadio = -1;
    var _ie8 = false;

    radio.SetRadio = function (index,repaint) {
        if (_init) {
            if (_selectRadio == index && !repaint)
                return;
            if (_ie8) {
                $("#" + _group + "_select_" + index).show();
            } else {
                $("tr[name='" + _group + "'] td[id^='radio_" + index + "']").css("background", _opts.color[index]);
            }
            _selectRadio = index;
            _opts.callback(index);
        }
    };

    radio.GetRadio = function () {
        if (_init) {
            return _selectRadio;
        }
    }

    radio.CreateRadio = function (parent, options) {
        if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE8.0") {
            _ie8 = true;
        }
        _opts = $.extend(_opts, options);
        _parent = parent;
        _group = "radio_" + _parent + "_" + (new Date()).getTime();
        _init = true;
		if(_opts._selectRadio != undefined){
			if(_opts._selectRadio < _opts.color.length){
				_selectRadio = _opts._selectRadio;
			}
		}
        var html = "";
        for (var i = 0; i < _opts.color.length; ++i) {
            if (_ie8) {
                html += '<div name="' + _group + '_div" style="position:relative;width:' + (_opts.horizontal ? (100 / _opts.color.length + '%') : 'auto') +
                    ';margin-bottom:' + (_opts.horizontal ? '' : _opts.spacing + _opts.dotwidth + _opts.circlewidth + 'px') + ';' +
                    'moz-user-select:-moz-none; -moz-user-select: none; -o-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;' +
                    (_opts.horizontal ? 'float:left;' : '') + '"><div name="' + _group +
                    '" style="cursor:pointer;">';
                html += '<v:oval stroked=true strokecolor="' + _opts.color[i] + '" fillcolor="' + _opts.color[i] + '" style="behavior:url(#default#VML);width:' + (_opts.circlewidth * 2 + _opts.dotwidth + _opts.spacing * 2) + 'px;height:' + (_opts.circlewidth * 2 + _opts.dotwidth + _opts.spacing * 2) +
                    'px;top:0;left:0;position: absolute;" filled=true />';
                html += '<v:oval stroked=true strokecolor="' + _opts.parentcolor + '" fillcolor="' + _opts.parentcolor + '" style="behavior:url(#default#VML);width:' + (_opts.dotwidth + _opts.spacing * 2) +
                    'px;height:' + (_opts.dotwidth + _opts.spacing * 2) + 'px;top:' + _opts.circlewidth +
                    'px;left:' + _opts.circlewidth + 'px;position: absolute;" filled=true />';
                html += '<v:oval id="' + _group + '_select_' + i + '" stroked=true strokecolor="' + _opts.color[i] + '" fillcolor="' + _opts.color[i] +
                    '" style="behavior:url(#default#VML);width:' + (_opts.dotwidth) + 'px;height:' + (_opts.dotwidth) + 'px;top:' + (_opts.circlewidth + _opts.spacing) + 'px;left:' + (_opts.circlewidth + _opts.spacing) + 'px;position: absolute;display:none;" filled=true />';
                html += '</div><div style="margin-left:' + (_opts.circlewidth * 2 + _opts.dotwidth + _opts.spacing *
                        2 + 5) + 'px;line-height:' + (_opts.circlewidth * 2 + _opts.dotwidth + _opts.spacing * 2) + 'px;cursor:default;">' + _opts.option[i] + '</div></div>';
            } else {
                html += '<table style="border-collapse: separate;width:' + (_opts.horizontal ? (100 / _opts.color.length + '%') : 'auto') +
                    ';margin-bottom:' + (_opts.horizontal ? '' : _opts.spacing + _opts.dotwidth + _opts.circlewidth + 'px') + ';' +
                    'moz-user-select:-moz-none; -moz-user-select: none; -o-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;' +
                    (i != _opts.color.length - 1 ? (_opts.horizontal ? 'float:left;' : '') : '') + '"><tr name="' + _group + '" style="cursor:pointer;border:' + _opts.circlewidth +
                    'px solid ' + _opts.color[i] + ';border-spacing:' +
                    _opts.spacing + 'px;border-radius:50%;float:left;margin-right: 6px">' +
                    '<td id="radio_' + i + '_' + _parent + '" style="width:' + _opts.dotwidth + 'px;height:' +
                    _opts.dotwidth +
                    'px;border-radius:50%;"></td></tr><tr style="float:left;"><td style="line-height:' + (_opts.circlewidth * 2 + _opts.dotwidth + _opts.spacing * 2) +
                    'px;cursor:default;">' + _opts
                    .option[
                        i] + '</td></tr></table>';
            }
        }
        $("#" + _parent).empty().append(html);
        if (!_opts.horizontal) {
            var __bigwidth = "0px";
            $("#" + _parent + " table,div[name='" + _group + "_div']").each(function () {
                var __width = $(this).css("width");
                if (__bigwidth.split("px")[0] * 1 < __width.split("px")[0] * 1) {
                    __bigwidth =__width.split("px")[0] * 1+10+"px";
                }
            });
            $("#" + _parent).css("min-width", __bigwidth);
        }
        
		if(_ie8){
			$("div [name='" + _group + "']").click(function () {
				var index = $(this).find("[id^='" + _group + "_select_" + "']").attr("id");
				index = index.split("_");
				index = index.pop() * 1;
				if (_selectRadio == index)
					return;
				$("div [id^='" + _group + "_select_" + "']").hide();
				radio.SetRadio(index);
			});
		}else{
            $("#" + _parent +" table").click(function () {
                $(this).children().find("tr[name='" + _group + "']")[0].click();
            });

			$("tr[name='" + _group + "']").click(function () {
				var index = $(this).find("td").attr("id").split("_")[1] * 1;
				if (_selectRadio == index)
					return;
				$("tr[name='" + _group + "'] td").css("background", "transparent");
				radio.SetRadio(index);
			});
		}
        
        this.SetRadio(_selectRadio==-1?0:_selectRadio,true);
    };
    return radio;
}
