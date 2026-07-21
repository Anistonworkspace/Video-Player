//# sourceURL=RSUI.js
(function(a) {
	a.fn.slider = function(m, e) {
		if (typeof m == "string" && m != "") {
			return a.fn.slider.methods[m](this, e);
		}
		var i = {
			width: 140,
			height: 14,
			barWidth: 18,
			minValue: 0,
			maxValue: 100,
			mousedownCallback: function() {},
			mouseupCallback: function() {},
			isDown: false,
			dragmoveCallback: function() {},
			showText: true,
			useAni: false,
			toDoc: false,
			rangeDiv: null,
			onlyShow: false,
			curWidth: 140,
			bResize: false,
			bDisable: false,
			curValue: -1
		};
		m = a.extend({}, i, m);
		a(this).data("options", m);
		a.fn.slider.methods = {
			getValue: function(p) {
				var o = a(p).data("options");
				//DebugStringEvent(p+ " getValue curValue="+o.curValue + " value="+o.value);
				if(o.toDoc){
				//	DebugStringEvent("o.curValue="+o.curValue);
					return o.curValue;
				}else{
					return o.value;
				}	
			},
			setValue: function(q, p) {
				var o = a(q).data("options");
				if (!o) {
					return
				}
				o.value = p;
				//DebugStringEvent(q+ " setValue curValue="+o.curValue + " value="+o.value);
				n(q, p)
			},
			resize: function(q){
				var o = a(q).data("options");
				if(typeof o != 'undefined' && o.bResize){
					var _width = o.width + (o.showText ? 41 : 0);
					var l = a(q).parent();
					var _pwidth = a(l).width();
					if(_pwidth < _width){
						o.curWidth = _pwidth - (o.showText ? 41 : 0);
						a(l).css("width", _pwidth + 'px');
						a(q).find(".slider-entire").css("width", _pwidth + 'px');
						a(q).find(".slider-back").css("width", o.curWidth + 'px');
					}else{
						o.curWidth = o.width;
						a(l).css("width", _width + 'px');
						a(q).find(".slider-entire").css("width", _width + 'px');
						a(q).find(".slider-back").css("width", o.width + 'px');
					}
					//DebugStringEvent(q+ " resize curValue="+o.curValue + " value="+o.value);
					n(q, o.value);
				}
			},
			setDisable:function(q,p){
				var o = a(q).data("options");
				if (!o) {
					return
				}
				o.bDisable = p;
			}
		};

		function l(q) {
			var p = a(q).data("options");
			p.curWidth = p.width;
			var o = '<div class="slider-entire" style="width:' + (p.width + (p.showText ? 41 : 0)) +
				'px; height:18px; margin-top:10px" onselectstart="return false;"><div class="slider-back" style="width:' + p.width +
				'px;"><div class="slider-fore"><div class="slider-bar" style="' + (p.onlyShow ? "display:none;" : "") +
				'"></div></div></div><div class="slider-tip" style="' + (p.showText ? "" : "display:none;") +
				'"><span>1111</span></div></div>';
			a(q).addClass("slider").html(o)
		}

		function n(q, p) {
			var o = a(q).data("options");
			var r;
			if (p < o.minValue || p > o.maxValue) {
				return
			} else {
				if (p == o.maxValue) {
					r = o.curWidth - o.barWidth
				} else {
					if (p == o.minValue) {
						r = 0
					} else {
						r = Math.round((p - o.minValue) / (o.maxValue - o.minValue) * (o.curWidth - o.barWidth))
					}
				}
			}
			if (o.useAni) {
				a(q).find(".slider-fore").animate({
					width: (r + o.barWidth + "px")
				}, 25, "swing");
				a(q).find(".slider-bar").animate({
					marginLeft: (r + "px")
				}, 25, "swing")
			} else {
				a(q).find(".slider-fore").css("width", r + o.barWidth + "px");
				a(q).find(".slider-bar").css("margin-left", r + "px")
			}
			if (!o.showText) {
				a(q).find(".slider-bar").attr("title", p)
			}
			o.value = p;
			//DebugStringEvent(q + " n value:" + o.value);
			a(q).find("span").html(p);
			return r
		}

		function d(r, s) {
			var p = a(r).data("options");
			if (s < 0) {
				s = 0
			} else {
				if (s > (p.curWidth - p.barWidth)) {
					s = p.curWidth - p.barWidth
				}
			}
			var o = s / (p.curWidth - p.barWidth) * (p.maxValue - p.minValue) + p.minValue;
			var q = Math.round(s / (p.curWidth - p.barWidth) * (p.maxValue - p.minValue) + p.minValue);
			if (q == p.minValue) {
				s = 0
			} else {
				if (q == p.maxValue) {
					s = p.curWidth - p.barWidth
				}
			}
			a(r).find(".slider-fore").css("width", s + p.barWidth + "px");
			a(r).find(".slider-bar").css("margin-left", s + "px");
			if (!p.showText) {
				a(r).find(".slider-bar").attr("title", q)
			}
			p.value = q;
			//DebugStringEvent(r+ " d value:" + p.value);
			a(r).find("span").html(q);
			return q
		}

		function c(q, p) {
			p = p ? p : window.event;
			var o = a(q).data("options");
			var r = getScrollLeft();
			var s = p.clientX + r - a(q).find(".slider-back").offset().left;
			o.dragmoveCallback(d(q, s))
		}

		function f(o, p) {
			if (o.contains) {
				return o != p && o.contains(p)
			} else {
				return !!(o.compareDocumentPosition(p) & 16)
			}
		}

		function h(p, o) {
			if (k(p).type == "mouseover") {
				return !f(o, k(p).relatedTarget || k(p).fromElement) && !((k(p).relatedTarget || k(p).fromElement) === o)
			} else {
				return !f(o, k(p).relatedTarget || k(p).toElement) && !((k(p).relatedTarget || k(p).toElement) === o)
			}
		}

		function k(o) {
			return o || window.event
		}

		function b(p, o) {
			o = o ? o : window.event;
			c(p, o)
		}

		function j(q, p) {
			p = p ? p : window.event;
			c(q, p);
			var o = a(q).data("options");
			if (o.rangeDiv != null) {
				a(o.rangeDiv).unbind()
			}
			document.onmousemove = null;
			document.onmouseup = null
		}

		function g(p) {
			var o = a(p).data("options");
			if (o.onlyShow) {
				return false
			}
			a(p).find(".slider-bar").bind("mousedown", function(q) {
				q = q ? q : window.event;
				if(!o.bDisable){
					document.onmousemove = function(r) {
						b(p, r)
					};
					document.onmouseup = function(r) {
						if (o.toDoc && o.isDown) {
							o.curValue = o.value;
							o.isDown = false;
							window.setTimeout(o.mouseupCallback, 200)
						}
						j(p, r)
					};
					if (o.rangeDiv != null) {
						a(o.rangeDiv).bind("mouseleave", function(r) {
							if (o.toDoc) {
								o.isDown = false;
								window.setTimeout(o.mouseupCallback, 200)
							}
							j(p, r)
						})
					}
				}
				q.stopPropagation();
				if(!o.bDisable){
					o.curValue = o.value;
					o.isDown = true;
					window.setTimeout(o.mousedownCallback, 20)
				}
			}).bind("mouseup", function(q) {
				if(o.isDown){
					o.curValue = o.value;
					o.isDown = false;
					window.setTimeout(o.mouseupCallback, 200)
				}
			}).bind("mouseout", function(q) {
				if (h(q, this)) {
					if (o.isDown && !o.toDoc) {
						o.isDown = false;
						window.setTimeout(o.mouseupCallback, 200)
					}
				}
			});
			a(p).find(".slider-back").bind("mousedown", function(q) {
				q = q ? q : window.event;
				if(!o.bDisable) c(p, q);
				q.stopPropagation();
				if(!o.bDisable) {
					o.curValue = o.value;
					o.isDown = true;
					window.setTimeout(o.mousedownCallback, 200)
				}
			}).bind("mouseup", function(q) {
				if (o.isDown) {
					o.curValue = o.value;
					o.isDown = false;
					window.setTimeout(o.mouseupCallback, 200)
				}
			}).bind("mouseout", function(q) {
				if (h(q, this)) {
					if (o.isDown && !o.toDoc) {
						o.isDown = false;
						window.setTimeout(o.mouseupCallback, 200)
					}
				}
			})
		}
		l(this);
		g(this);
		a(this).slider("resize");
		a(this).slider("setValue", m.minValue)
	}
})(jQuery);
(function(a) {
	var b = 0;
	a.fn.rsselect = function(o, h) {
		if (typeof o == "string" && o != "") {
			return a.fn.rsselect.methods[o](this, h)
		}
		var i = {
			showArrow: false,
			isReadonly: true,
			showBottom: false,
			selectChange: null,
			height: "18px",
			nearbyEle: "",
			nearbyEleT: null
		};
		var d = a.extend({}, i, o);
		n(this);
		m(this);

		function k(q) {
			if (0) {
				var p = a(q).find(".select_item_selected_c87").attr("value")
			} else {
				var p = a(q).find(".select_item_selected").attr("value")
			}
			return p ? p : -1
		}

		function j(q, p) {
			if (0) {
				a(q).find(".select_item_c87").each(function() {
					if (a(this).attr("value") == p) {
						a(q).find(".select_item_selected_c87").removeClass("select_item_selected_c87");
						a(this).addClass("select_item_selected_c87");
						a(q).find(".select_text").html(a(this).attr("text"));
						b = p
					}
				})
			} else {
				a(q).find(".select_item").each(function() {
					if (a(this).attr("value") == p) {
						a(q).find(".select_item_selected").removeClass("select_item_selected");
						a(this).addClass("select_item_selected");
						a(q).find(".select_text").html(a(this).attr("text"));
						b = p
					}
				})
			}
		}

		function l(r, p) {
			var s = a(r).find(".select_options").html();
			if (0) {
				for (var q = 0; q < p.length; q++) {
					s += '<tr class="select_item_c87" value=' + p[q].value + ' text="' + p[q].text + '"><td>' + p[q].text +
						"</td></tr>"
				}
			} else {
				for (var q = 0; q < p.length; q++) {
					s += '<tr class="select_item" value=' + p[q].value + ' text="' + p[q].text + '"><td>' + p[q].text + "</td></tr>"
				}
			}
			a(r).find(".select_options").html(s);
			a(r).find("tr").each(function() {
				a(this).mousedown(function(u) {
					a(r).find(".select_text").html(a(this).attr("text"));
					if (0) {
						a(r).find(".select_item_selected_c87").removeClass("select_item_selected_c87");
						a(this).addClass("select_item_selected_c87");
						c(r);
						var t = a(r).find(".select_item_selected_c87").attr("value")
					} else {
						a(r).find(".select_item_selected").removeClass("select_item_selected");
						a(this).addClass("select_item_selected");
						c(r);
						var t = a(r).find(".select_item_selected").attr("value")
					}
					if (t != b) {
						if (d.selectChange != null) {
							d.selectChange()
						}
					}
					b = t;
					u.stopPropagation()
				}).mouseover(function(t) {
					if (0) {
						a(this).addClass("select_item_over_c87")
					} else {
						a(this).addClass("select_item_over")
					}
					t.stopPropagation()
				}).mouseout(function(t) {
					if (0) {
						a(this).removeClass("select_item_over_c87")
					} else {
						a(this).removeClass("select_item_over")
					}
					t.stopPropagation()
				})
			})
		}

		function f(q, p) {
			d.nearbyEle = p
		}
		a.fn.rsselect.methods = {
			getValue: k,
			setValue: j,
			append: l,
			setNearbyEle: f
		};

		function n(p) {
			a(p).html(
				'<div class="rs_select" onselectstart="return false;"><div class="select_top"><div class="select_arrow"></div><div class="select_text_box"><span class="select_text"></span></div></div><div class="select_bottom"><table class="select_options"></table></div></div>'
			);
			if (!d.showArrow) {
				a(p).find(".select_arrow").css("display", "none");
				a(p).find(".select_text_box").css("margin-right", "0px");
				a(p).find(".select_text").css("line-height", d.height)
			}
			if (0) {
				if (gDevice.devType == devTypeEnum.DEV_IPC) {
					a(".select_text").css("color", "#00635c")
				} else {
					a(".select_text").css("color", "#000")
				}
			}
		}

		function g(r) {
			var p = a(r).find(".select_bottom");
			if (0) {
				var q = p.find(".select_item_selected_c87");
				if (!q.hasClass("select_item_selected_c87")) {
					return
				}
			} else {
				var q = p.find(".select_item_selected");
				if (!q.hasClass("select_item_selected")) {
					return
				}
			}
			p.scrollTop(q.offset().top - p.offset().top + p.scrollTop() - 100)
		}

		function c(p) {
			if (!d.showBottom) {
				return
			}
			d.showBottom = false;
			a(p).find(".select_bottom").css("display", "none");
			document.onmousedown = null;
			if (d.nearbyEle != "") {
				d.nearbyEleT = setTimeout(function() {
					var q = a(d.nearbyEle + " .rsselNearBy");
					q.remove();
					q = null
				}, 200)
			}
		}

		function e(r) {
			if (d.showBottom) {
				return
			}
			d.showBottom = true;
			a(r).find(".select_bottom").css("display", "block");
			g(r);
			if (document.onmousedown) {
				document.onmousedown()
			}
			document.onmousedown = function(s) {
				c(r)
			};
			if (d.nearbyEle != "") {
				if (d.nearbyEleT) {
					clearTimeout(d.nearbyEleT)
				}
				var q = a(d.nearbyEle);
				var p = document.createElement("div");
				p.className = "rsselNearBy";
				p.style.height = q.css("height");
				p.style.width = q.css("width");
				q.append(p);
				q = null
			}
		}

		function m(p) {
			a(p).find(".select_top").mousedown(function(q) {
				if (!d.showBottom) {
					e(p)
				} else {
					c(p)
				}
				q.stopPropagation()
			});
			a(p).find(".select_top").mouseover(function(q) {
				a(this).addClass("select_top_over")
			});
			a(p).find(".select_top").mouseout(function(q) {
				a(this).removeClass("select_top_over")
			});
			a(p).find(".select_text").mousedown(function(q) {
				if (!d.isReadonly) {
					q.stopPropagation()
				}
			});
			a(p).find(".select_bottom").mousedown(function(q) {
				q.stopPropagation()
			})
		}
	}
})(jQuery);
var RSBtnStatus = {
	Normal: 0,
	Hover: 1,
	Disabled: 2,
	Down: 3,
	Pressed: 4
};
(function(a) {
	a.fn.RSButton = function(d, f) {
		if (typeof d == "string" && d != "") {
			return a.fn.RSButton.methods[d](this, f)
		}
		var c = {
			width: 36,
			height: 36,
			posY: 0,
			status: RSBtnStatus.Normal,
			click: function() {},
			mouseup: function() {}
		};
		d = a.extend({}, c, d);
		a(this).data("options", d);
		a.fn.RSButton.methods = {
			setStatus: function(j, h) {
				var i = a(j).data("options");
				i.status = h;
				b(j)
			},
			setPosY: function(i, j) {
				var h = a(i).data("options");
				h.posY = j;
				b(i)
			},
			getStatus: function(i) {
				var h = a(i).data("options");
				return h.status
			},
			clickEvent: function(i) {
				var h = a(i).data("options");
				h.click(i)
			}
		};

		function b(j) {
			var i = a(j).data("options");
			var h;
			var k = "pointer";
			if (i.status == RSBtnStatus.Normal) {
				h = 0 - i.width * RSBtnStatus.Normal
			} else {
				if (i.status == RSBtnStatus.Hover) {
					h = 0 - i.width * RSBtnStatus.Hover
				} else {
					if (i.status == RSBtnStatus.Down || i.status == RSBtnStatus.Pressed) {
						h = 0 - i.width * RSBtnStatus.Hover
					} else {
						h = 0 - i.width * RSBtnStatus.Disabled;
						k = "default"
					}
				}
			}
			a(j).css("background-position", h + "px " + i.posY + "px").css("cursor", k)
		}

		function e(i) {
			var h = a(i).data("options")
		}

		function g(i) {
			var h = a(i).data("options");
			a(i).bind("mousedown", function(j) {
				if (h.status == RSBtnStatus.Disabled) {
					return
				}
				if (h.status != RSBtnStatus.Pressed) {
					a(i).RSButton("setStatus", RSBtnStatus.Down)
				}
				h.click(i)
			}).bind("mouseover", function(j) {
				if (h.status == RSBtnStatus.Disabled || h.status == RSBtnStatus.Pressed) {
					return
				}
				a(i).RSButton("setStatus", RSBtnStatus.Hover)
			}).bind("mouseout", function(j) {
				if (h.status == RSBtnStatus.Disabled || h.status == RSBtnStatus.Pressed) {
					return
				}
				a(i).RSButton("setStatus", RSBtnStatus.Normal)
			}).bind("mouseup", function(j) {
				if (h.status == RSBtnStatus.Disabled || h.status == RSBtnStatus.Pressed) {
					return
				}
				a(i).RSButton("setStatus", RSBtnStatus.Hover);
				h.mouseup(i)
			})
		}
		e(this);
		g(this);
		a(this).RSButton("setStatus", d.status)
	}
})(jQuery);
(function(a) {
	a.fn.sliderMode = function(q, f) {
		if (typeof q == "string" && q != "") {
			return a.fn.sliderMode.methods[q](this, f)
		}
		var i = {
			width: 120,
			height: 14,
			barWidth: 9,
			minValue: 0,
			maxValue: 100,
			mouseupCallback: function() {},
			isDown: false,
			dragmoveCallback: function() {},
			toDoc: false,
			startValue: 0,
			endValue: 100,
			time: {
				isTime: false,
				startTime: "",
				endTime: "",
				timeArr: []
			}
		};
		q = a.extend({}, i, q);
		a(this).data("options", q);
		a.fn.sliderMode.methods = {
			getValue: function(t) {
				var s = a(t).data("options");
				var r = {};
				if (s.time.isTime) {
					r.startValue = s.time.startTime;
					r.endValue = s.time.endTime
				} else {
					r.startValue = s.startValue;
					r.endValue = s.endValue
				}
				return r
			},
			setStartValue: function(u, r) {
				var s = a(u).data("options");
				if (!s) {
					return
				}
				var t = r;
				if (s.time.isTime && typeof t == "string") {
					s.time.startTime = t;
					t = p(u, t)
				}
				s.startValue = t;
				j(u, t)
			},
			setEndValue: function(u, r) {
				var s = a(u).data("options");
				if (!s) {
					return
				}
				var t = r;
				if (s.time.isTime && typeof t == "string") {
					s.time.endTime = t;
					t = p(u, t)
				}
				s.endValue = t;
				d(u, t)
			}
		};

		function o(t) {
			var s = a(t).data("options");
			var r = '<div style="width:' + (s.width + 41 + 2 * s.barWidth) + "px; height:14px;margin-top:" + (s.time.isTime ?
					0 : 8) + 'px;position:relative;" onselectstart="return false;"><div class="slider-back" style="width:' + s.width +
				"px;position:absolute;top:0;left:" + s.barWidth + 'px;z-index:1;"></div><div class="slider-fore" style="width:' +
				s.width + "px;position:absolute;top:0;left:" + s.barWidth +
				'px;z-index:10;"></div><div class="slider-backStart" style="width:' + s.width +
				"px;position:absolute;top:0;left:" + s.barWidth +
				'px;z-index:20;"></div><div class="slider-bar slider-start" style="position:relative;top:0;left:0;z-index:30;"></div><div class="slider-bar slider-end" style="position:absolute;top:0;left:' +
				s.width + 'px;z-index:30;"></div>' + (s.time.isTime ? g(s.time.timeArr, s.width, s.barWidth) : "") + "</div>";
			a(t).addClass("slider").html(r)
		}

		function g(x, r, s) {
			var u = "";
			var y = x,
				v = y.length - 1,
				t;
			var w = parseInt(r / v);
			var z = parseInt((w - 1) / 2);
			u += '<div style="width:' + r + "px;margin-left:" + s + 'px">';
			for (t = 0; t < v; t++) {
				u += '<div class="slider-time" style="width:' + w + 'px;"><div ' + (t == (v - 1) ? 'class="last"' : "") +
					'><div style="width:' + z + 'px;"></div></div><span style="margin-left:' + (-10) + 'px;">' + y[t] + "</span>" +
					(t == (v - 1) ? '<span style="margin-left:10px;">' + y[v] + "</span>" : "") + "</div>"
			}
			u += "</div>";
			return u
		}

		function l(v, y) {
			var r = a(v).data("options");
			var x = y;
			var z, w, u, t, s;
			if (x <= 0) {
				w = 0;
				u = 0
			} else {
				if (x >= r.width + r.barWidth) {
					w = 24;
					u = 0
				} else {
					s = (x - r.barWidth) * 60 * 24 / r.width;
					w = s / 60;
					u = s - Math.floor(w) * 60
				}
			}
			var A = "";
			Math.floor(w) < 10 ? (A += "0" + Math.floor(w) + ":") : (A += Math.floor(w) + ":");
			Math.floor(u) < 10 ? (A += "0" + Math.floor(u)) : (A += Math.floor(u));
			return A
		}

		function e(u, t) {
			var r = a(u).data("options");
			var v = t.split(":")[0] * 1;
			var s = t.split(":")[1] * 1;
			var w = Math.floor(((v * 60 + s) / (24 * 60)) * r.width);
			return w
		}

		function p(v, u) {
			var r = a(v).data("options");
			var w = u.split(":")[0] * 1;
			var t = u.split(":")[1] * 1;
			var s = Math.floor(((w * 60 + t) / (24 * 60)) * r.maxValue);
			return s
		}

		function j(t, s) {
			var r = a(t).data("options");
			var v, u;
			u = a(t).find(".slider-end").css("left");
			u = parseInt(u);
			if (s < r.minValue || s > r.endValue) {
				return
			} else {
				if (s == r.endValue) {
					v = u
				} else {
					if (s == r.minValue) {
						v = r.barWidth
					} else {
						v = Math.round(((s - r.minValue) / (r.maxValue - r.minValue)) * r.width) + r.barWidth
					}
				}
			}
			a(t).find(".slider-backStart").css("width", (v - r.barWidth) + "px");
			a(t).find(".slider-start").css("left", (v - r.barWidth) + "px");
			if (r.time.isTime) {
				r.time.startTime = l(t, v);
				a(t).find(".slider-start").attr("title", r.time.startTime)
			} else {
				a(t).find(".slider-start").attr("title", s)
			}
			r.startValue = s;
			return v
		}

		function d(t, s) {
			var r = a(t).data("options");
			var v, u;
			u = a(t).find(".slider-start").css("left");
			u = parseInt(u) + r.barWidth;
			if (s < r.startValue || s > r.maxValue) {
				return
			} else {
				if (s == r.maxValue) {
					v = r.width + r.barWidth
				} else {
					if (s == r.startValue) {
						v = u
					} else {
						v = Math.round((s - r.minValue) / (r.maxValue - r.minValue) * r.width) + r.barWidth
					}
				}
			}
			a(t).find(".slider-fore").css("width", v + "px");
			a(t).find(".slider-end").css("left", v + "px");
			if (r.time.isTime) {
				r.time.endTime = l(t, v);
				a(t).find(".slider-end").attr("title", r.time.endTime)
			} else {
				a(t).find(".slider-end").attr("title", s)
			}
			r.endValue = s;
			return v
		}

		function n(t, s) {
			s = s ? s : window.event;
			var r = a(t).data("options");
			var u = getScrollLeft();
			var v = s.clientX + u - a(t).find(".slider-back").offset().left;
			r.dragmoveCallback(j(t, v))
		}

		function m(t, s) {
			s = s ? s : window.event;
			var r = a(t).data("options");
			var u = getScrollLeft();
			var v = s.clientX + u - a(t).find(".slider-back").offset().left;
			r.dragmoveCallback(d(t, v))
		}

		function c(r, t, s) {
			if (r == "slider-start") {
				n(t, s)
			} else {
				if (r == "slider-end") {
					m(t, s)
				}
			}
		}

		function b(r, t, s) {
			s = s ? s : window.event;
			c(r, t, s)
		}

		function k(r, t, s) {
			s = s ? s : window.event;
			c(r, t, s);
			document.onmousemove = null;
			document.onmouseup = null
		}

		function h(s) {
			var r = a(s).data("options");
			a(s).find(".slider-start").bind("mousedown", function(t) {
				t = t ? t : window.event;
				document.onmousemove = function(u) {
					b("slider-start", s, u)
				};
				document.onmouseup = function(u) {
					if (r.toDoc) {
						r.isDown = false;
						window.setTimeout(r.mouseupCallback, 200)
					}
					k("slider-start", s, u)
				};
				t.stopPropagation();
				r.isDown = true
			}).bind("mouseup", function(t) {
				r.isDown = false;
				window.setTimeout(r.mouseupCallback, 200)
			}).bind("mouseout", function(t) {
				if (r.isDown && !r.toDoc) {
					r.isDown = false;
					window.setTimeout(r.mouseupCallback, 200)
				}
			});
			a(s).find(".slider-end").bind("mousedown", function(t) {
				t = t ? t : window.event;
				document.onmousemove = function(u) {
					b("slider-end", s, u)
				};
				document.onmouseup = function(u) {
					if (r.toDoc) {
						r.isDown = false;
						window.setTimeout(r.mouseupCallback, 200)
					}
					k("slider-end", s, u)
				};
				t.stopPropagation();
				r.isDown = true
			}).bind("mouseup", function(t) {
				r.isDown = false;
				window.setTimeout(r.mouseupCallback, 200)
			}).bind("mouseout", function(t) {
				if (r.isDown && !r.toDoc) {
					r.isDown = false;
					window.setTimeout(r.mouseupCallback, 200)
				}
			})
		}
		o(this);
		h(this);
		a(this).sliderMode("setStartValue", q.minValue);
		a(this).sliderMode("setEndValue", q.maxValue)
	}
})(jQuery);
(function(a) {
	a.fn.divBox = function(b, f) {
		if (typeof b == "string" && b != "") {
			return a.fn.divBox.methods[b](this, f)
		}
		var d = jQuery.extend({}, jQuery.fn.divBox.defaults, b);
		a(this).data("options", d);
		a.fn.divBox.methods = {
			setSingleSelect:function(q,p){
				var o = a(q).data("options");
				if (!o) {
					return
				}
				o.bSingleSelect = p;
			}
		};

		function c(m) {
			var g = "";
			var j = d.number - 1,
				h, o = 0,
				f = 0;
			var rowNum = d.rowNum;
			for (h = 0; h < j; h++, o++) {
				if (d.mulType || d.ExType) {
					if (h % rowNum == (rowNum-1)) {
						g += ("<div index='" + h + "' class='" + d.nclass + "' style='height:" + d.height +
							"px;float:left;overflow:hidden;width:" + d.width + "px; border:1px solid " + d.borderColor +
							";text-align:center;line-height:22px;'>" + (o + 1) + "</div>");
						if(d.bAlarm){
							g += ("<div class='" + d.nclass + "' name='all' id='all"+ f +"' style='height:" + d.height +
								"px;float:left;overflow:hidden;min-width:35px;max-width:50px;border:1px solid " 
								+ d.borderColor +";border-left:none;text-align:center;line-height:22px;'>" 
								+ lg.get("IDS_CFG_ALL") +"</div>");
						}
						g += ("<br/>");
						f += 1;
						/*if (h == (j - 1)) {
							o = -1
						}*/
						continue
					}
				} else {
					if ((h <= gDevice.loginRsp.VideoInChannel && h % rowNum == (rowNum-1)) || (h - gDevice.loginRsp.VideoInChannel) % rowNum == (rowNum-1) || (h ==
							(gDevice.loginRsp.VideoInChannel - 1))) {
						g += ("<div index='" + h + "' class='" + d.nclass + "' style='height:" + d.height +
							"px;float:left;overflow:hidden;width:" + d.width + "px; border:1px solid " + d.borderColor +
							";text-align:center;line-height:22px;'>" + (o + 1) + "</div>");
						g += ("<br/>");
						f += 1;
						if (h == (gDevice.loginRsp.VideoInChannel - 1)) {
							o = -1
						}
						continue
					}
				}
				g += ("<div index='" + h + "' class='" + d.nclass + "' style='height:" + d.height +
					"px;float:left;overflow:hidden;width:" + d.width + "px; border:1px solid " + d.borderColor +
					";border-right:none;text-align:center ;line-height:22px;-moz-user-select: none;'>" + (o + 1) + "</div>")
			}
			g += ("<div index='" + h + "' class='" + d.nclass + "' style='height:" + d.height +
				"px;float:left;overflow:hidden;width:" + d.width + "px; border:1px solid " + d.borderColor +
				";text-align:center; line-height:22px;-moz-user-select: none;'>" + (o + 1) + "</div>");
			if(h % rowNum == (rowNum-1) && d.ExType && d.bAlarm){
				g += ("<div class='" + d.nclass + "' name='all' id='all"+ f +"' style='height:" + d.height +
					"px;float:left;overflow:hidden;min-width:35px;max-width:50px;border:1px solid " + d.borderColor +
					";border-left:none;text-align:center;line-height:22px;'>" + lg.get("IDS_CFG_ALL") +
					"</div>");
			}
			if (!a("#" + d.bDownID)[0]) {
				g += ("<p id='" + d.bDownID + "' style='width:0px; height:0px; overflow:hidden; -moz-user-select: none;'></p>")
			}
			m.css("height", (f + 1) * 30 + "px");
			if (d.parentLev > 0) {
				var l = m,
					k;
				if (d.mulType || d.ExType) {
					for (k = 0; k < d.parentLev; k++) {
						l = a(l.parent())
					}
				} else {
					if (gDevice.loginRsp.VideoInChannel > 0) {
						for (k = 0; k < d.parentLev; k++) {
							l = a(l.parent())
						}
					} else {
						l = a(l.parent())
					}
				}
				a(l).css("height", (f + 1) * 30 + "px");
				l = null
			}
			m.prop("innerHTML", g)
		}
		return this.each(function() {
			c(a(this));
			d.bDownID = "#" + d.bDownID;
			var id = "#" + a(this).attr("id") + ">div";
			a(id).mouseover(function() {
				var e = false;
				if (d.mulType || d.bDisabled) {
					e = a(this).attr("disabled")
				}
				if (!d.bEnable) {
					return
				}
				a(this).css("cursor", "pointer");
				if (d.mulType || d.bDisabled) {
					if (e != "disabled") {
						if (a(d.bDownID).attr("name") == "down") {
							if ((a(this).css("background-color")).replace(/[ ]/g, "") != (d.bkColor).replace(/[ ]/g, "")) {
								a(this).css({
									"background-color": d.bkColor,
									color: d.activeTextClr
								})
							} else {
								a(this).css({
									"background-color": d.parentColor,
									color: "inherit"
								})
							}
						}
					}
				} else if(d.bSingleSelect){
					if (a(d.bDownID).attr("name") == "down") {
						if ((a(this).css("background-color")).replace(/[ ]/g, "") != (d.bkColor).replace(/[ ]/g, "")) {
							a(id).each(function (i) {
								a(this).css({
									"background-color": d.parentColor,
									color: "inherit"
								})
							});
							a(this).css({
								"background-color": d.bkColor,
								color: d.activeTextClr
							})
						} else {
							a(this).css({
								"background-color": d.parentColor,
								color: "inherit"
							})
						}
					}
				} else if(!d.bSingleSelect && d.maxSelectNum > 1){
					if (a(d.bDownID).attr("name") == "down") {
						if ((a(this).css("background-color")).replace(/[ ]/g, "") != (d.bkColor).replace(/[ ]/g, "")) {
							var nSelected = 0;
							a(id).each(function (i) {
								if ((a(this).css("background-color")).replace(/[ ]/g, "") == (d.bkColor).replace(/[ ]/g, "")){
									nSelected++;
									if(nSelected > d.maxSelectNum){
										a(this).css({
											"background-color": d.bkColor,
											color: d.activeTextClr
										})
									}
								}
							});
							
							if(nSelected < d.maxSelectNum){
								a(this).css({
									"background-color": d.bkColor,
									color: d.activeTextClr
								})
							}else{
                                if (typeof d.callback === 'function') {
                                    d.callback(nSelected);
                                }
                            }
						} else {
							a(this).css({
								"background-color": d.parentColor,
								color: "inherit"
							})
						}
					}
				}else {
					if (a(d.bDownID).attr("name") == "down") {
						if ((a(this).css("background-color")).replace(/[ ]/g, "") != (d.bkColor).replace(/[ ]/g, "")) {
							a(this).css({
								"background-color": d.bkColor,
								color: d.activeTextClr
							})
						} else {
							a(this).css({
								"background-color": d.parentColor,
								color: "inherit"
							})
						}
					}
				}
			}).mousedown(function() {
				if (!d.bEnable) {
					return
				}
				a(d.bDownID).attr("name", "down");
				a(this).css("cursor", "pointer");
				var e = a(this).attr("disabled");
				if (d.mulType || d.bDisabled) {
					if (e != "disabled") {
						a(this).css("cursor", "pointer");
						if ((a(this).css("background-color")).replace(/[ ]/g, "") != (d.bkColor).replace(/[ ]/g, "")) {
							a(this).css({
								"background-color": d.bkColor,
								color: d.activeTextClr
							})
						} else {
							a(this).css({
								"background-color": d.parentColor,
								color: "inherit"
							})
						}
					}
				} else if(d.bSingleSelect){
					if (a(d.bDownID).attr("name") == "down") {
						if ((a(this).css("background-color")).replace(/[ ]/g, "") != (d.bkColor).replace(/[ ]/g, "")) {
							a(id).each(function (i) {
								a(this).css({
									"background-color": d.parentColor,
									color: "inherit"
								})
							});
							a(this).css({
								"background-color": d.bkColor,
								color: d.activeTextClr
							})
						} else {
							a(this).css({
								"background-color": "transparent",
								color: "inherit"
							})
						}
					}
				} else if(!d.bSingleSelect && d.maxSelectNum > 1){
					if (a(d.bDownID).attr("name") == "down") {
						if ((a(this).css("background-color")).replace(/[ ]/g, "") != (d.bkColor).replace(/[ ]/g, "")) {
							var nSelected = 0;
							a(id).each(function (i) {
								if ((a(this).css("background-color")).replace(/[ ]/g, "") == (d.bkColor).replace(/[ ]/g, "")){
									nSelected++;
									if(nSelected > d.maxSelectNum){
										a(this).css({
											"background-color": d.bkColor,
											color: d.activeTextClr
										})
									}
								}
							});
							
							if(nSelected < d.maxSelectNum){
								a(this).css({
									"background-color": d.bkColor,
									color: d.activeTextClr
								})
							}else{
                                if (typeof d.callback === 'function') {
                                    d.callback(nSelected);
                                }
                            }
						} else {
							a(this).css({
								"background-color": d.parentColor,
								color: "inherit"
							})
						}
					}
				}else {
					if ((a(this).css("background-color")).replace(/[ ]/g, "") != (d.bkColor).replace(/[ ]/g, "")) {
						a(this).css({
							"background-color": d.bkColor,
							color: d.activeTextClr
						})
					} else {
						a(this).css({
							"background-color": d.parentColor,
							color: "inherit"
						})
					}
				}
			}).mouseup(function() {
				a(d.bDownID).attr("name", "")
			});
			a(document).mouseup(function() {
				a(d.bDownID).attr("name", "")
			})
		})
	};
	jQuery.fn.divBox.defaults = {
		borderColor: "#1e3b56",
		parentColor: "transparent",
		bkColor: "#f00",
		height: 22,
		width: 24,
		number: 24,
		nclass: "",
		bDownID: "bDownIDNew",
		bEnable: true,
		parentLev: 0,
		mulType: false,
		ExType: false,
		bDisabled: false,
		activeTextClr: "inherit",
		rowNum: 16,
		bAlarm: false,
		maxSelectNum: -1,
		bSingleSelect:false
	}
})(jQuery);
(function(a) {
	a.fn.timer = function(b) {
		var c = jQuery.extend({}, jQuery.fn.timer.defaults, b);
		a(this).data("bRunTime", c.bRunTime);
		return this.each(function() {
			jQuery.fn.timer.InsertHtml(a(this), c.Type, c.hasSecond)
		})
	};
	jQuery.fn.timer.fnRun = function(c, b) {
		var d = c.attr("id");
		gVar.runTime.hour = a("#" + d + "_Hour").val() * 1;
		gVar.runTime.minute = a("#" + d + "_Min").val() * 1;
		gVar.runTime.second = a("#" + d + "_Sec").val() * 1;
		gVar.runTime.bSecRun = true;
		gVar.runTime.bIEChangeTime = 0;
		clearInterval(gVar.runTime.timerID);
		gVar.runTime.timerID = setInterval(function() {
			jQuery.fn.timer.fnRunTime(c, b)
		}, 1000)
	};
	jQuery.fn.timer.fnRunTime = function(e, h) {
		function addDay(year, month, day) {
			day++;
			switch (month) {
				case 1:
				case 3:
				case 5:
				case 7:
				case 8:
				case 10:
				case 12:
					if (day > 31) {
						day = 1;
						month++;
					}
					break;
				case 4:
				case 6:
				case 9:
				case 11:
					if (day > 30) {
						day = 1;
						month++;
					}
					break;
				default:
					if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
						if (day > 29) {
							day = 1;
							month++;
						}
					} else {
						if (day > 28) {
							day = 1;
							month++;
						}
					}
					break;
			}
			if(month > 12){
				month = 1;
				year++;
			}
			return year + "/" + month + "/" + day;
		}

		var b = e.attr("id");
		++gVar.runTime.second;
		if (gVar.runTime.bSecRun) {
			a("#" + b + "_Sec").val(gVar.runTime.second)
		}
		if (gVar.runTime.second >= 60) {
			a("#" + b + "_Sec").val(gVar.runTime.second = 0);
			a("#" + b + "_Min").val(++gVar.runTime.minute);
			if (gVar.runTime.minute >= 60) {
				a("#" + b + "_Min").val(gVar.runTime.minute = 0);
				a("#" + b + "_Hour").val(++gVar.runTime.hour);
				var c = false;
				if (a("#" + b + "_Type").css("display") != "none") {
					if (gVar.runTime.hour >= 12) {
						a("#" + b + "_Hour").val(gVar.runTime.hour = 0);
						if (a("#" + b + "_Type").val() * 1 == 0) {
							a("#" + b + "_Type").val(1)
						} else {
							a("#" + b + "_Type").val(0);
							c = true
						}
					}
				} else {
					if (gVar.runTime.hour >= 24) {
						a("#" + b + "_Hour").val(gVar.runTime.hour = 0);
						c = true
					}
				}
				if (c) {
					var d = h.attr("data-date");
					var g = d.split("-")[0] * 1;
					var f = d.split("-")[1] * 1;
					var i = d.split("-")[2] * 1;
					var j = addDay(g, f, i);
					h.val(h.simpleCalendarCtrl.formatOutput(new Date(j), h));
					h.attr("data-date", h.simpleCalendarCtrl.formatOutput(new Date(j)))
				}
			}
		}
	};
	jQuery.fn.timer.InsertHtml = function(g, k, e) {
		var b = g.attr("id");
		var d = "",
			c = "";
		for (var h = 0; h < 60; h++) {
			d += '<option value="' + h + '">' + (("" + h).length < 2 ? "0" + h : h) + "</option>"
		}
		if (k == 0) {
			c += '<option value="0">0</option>';
			for (var h = 1; h < 12; h++) {
				c += '<option value="' + h + '">' + (("" + h).length < 2 ? "0" + h : h) + "</option>"
			}
		} else {
			for (var h = 0; h < 24; h++) {
				c += '<option value="' + h + '">' + (("" + h).length < 2 ? "0" + h : h) + "</option>"
			}
		}
		var f = "";
		if (e == false) {
			f = " style='display:none;'"
		}
		var j = ("<table class='timer'>							<tr>								<td>									<div>										<select id='" + b +
			"_Hour' class='timerHour'>" + c +
			"</select>									</div>									<td>:</td>								</td>								<td>									<div>										<select id='" + b +
			"_Min' class='timerMin'>" + d + "</select>									</div>									<td " + f +
			">:</td>								</td>								<td>									<div " + f + ">										<select id='" + b + "_Sec' class='timerSec'>" +
			d + "</select>									</div>								</td>								<th>									<div>										<select id='" + b +
			"_Type' class='timerType' style='width:50px;'>											<option value='0'>AM</option>											<option value='1'>PM</option>										</select>									</div>								</th>							</tr>						</table>"
		);
		g.prop("innerHTML", j);
		if (k == 0) {
			a("#" + b + "_Type").css("display", "block")
		} else {
			a("#" + b + "_Type").css("display", "none")
		}
		if (a.browser.msie && a.browser.version.split(".")[0] * 1 <= 9) {
			a("#" + b + "_Type").addClass("IE9Select")
		}
		if (g.data("bRunTime") * 1) {
			a("#" + b + "_Hour").change(function() {
				gVar.runTime.hour = a(this).val() * 1;
				gVar.runTime.bIEChangeTime = 1
			});
			a("#" + b + "_Min").change(function() {
				gVar.runTime.minute = a(this).val() * 1;
				gVar.runTime.bIEChangeTime = 1
			});
			a("#" + b + "_Sec").change(function() {
				gVar.runTime.second = a(this).val() * 1;
				gVar.runTime.bIEChangeTime = 1
			}).click(function(i) {
				gVar.runTime.bSecRun = !gVar.runTime.bSecRun;
				if (i && i.stopPropagation) {
					i.stopPropagation()
				} else {
					window.event.cancelBubble = true
				}
			}).blur(function(i) {
				gVar.runTime.bSecRun = true;
				if (i && i.stopPropagation) {
					i.stopPropagation()
				} else {
					window.event.cancelBubble = true
				}
			})
		}
		a("#" + b + "_Type").change(function() {
			gVar.runTime.bIEChangeTime = 1
		})
	};
	jQuery.fn.timer.GetTimeFor24 = function(f) {
		var g = f.attr("id");
		var b = a("#" + g + "_Hour").val() * 1;
		var c = a("#" + g + "_Min").val() * 1;
		var d = a("#" + g + "_Sec").val() * 1;
		var e = a("#" + g + "_Type").val() * 1;
		if (a("#" + g + "_Type").css("display") != "none") {
			c = (Array(2).join("0") + c).slice(-2);
			d = (Array(2).join("0") + d).slice(-2);
			if (e == 0) {
				b = (Array(2).join("0") + b).slice(-2);
				return (b + ":" + c + ":" + d)
			} else {
				return ((b + 12) + ":" + c + ":" + d)
			}
		} else {
			var strTime = "";
			if(b >= 0 && b <=9) strTime += "0";
			strTime += b+":";
			if(c >= 0 && c <=9) strTime += "0";
			strTime += c+":";
			if(d >= 0 && d <=9) strTime += "0";
			strTime += d;
			return strTime;
		}
	};
	jQuery.fn.timer.SetTimeIn24 = function(f, e, g) {
		var h = e.attr("id");
		var b = f.split(":")[0] * 1;
		var c = f.split(":")[1] * 1;
		var d = f.split(":")[2] * 1;
		a.fn.timer.InsertHtml(e, 1, g);
		a("#" + h + "_Hour").val(b);
		a("#" + h + "_Min").val(c);
		a("#" + h + "_Sec").val(d)
	};
	jQuery.fn.timer.SetTimeIn24Two = function(f, e, g) {
		var h = e.attr("id");
		var b = f.split(":")[0] * 1;
		var c = f.split(":")[1] * 1;
		var d = f.split(":")[2] * 1;
		a("#" + h + "_Hour").val(b);
		a("#" + h + "_Min").val(c);
		a("#" + h + "_Sec").val(d)
	};
	jQuery.fn.timer.ChangeType = function(e, g, h) {
		var i = g.attr("id");
		var b = a("#" + i + "_Hour").val() * 1;
		var c = a("#" + i + "_Min").val() * 1;
		var d = a("#" + i + "_Sec").val() * 1;
		var f = a("#" + i + "_Type").val() * 1;
		a.fn.timer.InsertHtml(g, e, h);
		if (e == 1) {
			a("#" + i + "_Type").css("display", "none");
			if (f == 0) {
				a("#" + i + "_Hour").val(b)
			} else {
				a("#" + i + "_Hour").val(b + 12);
				gVar.runTime.hour = b + 12;
			}
		} else {
			a("#" + i + "_Type").css("display", "block");
			if (b < 12) {
				a("#" + i + "_Type").val(0);
				a("#" + i + "_Hour").val(b)
			} else {
				a("#" + i + "_Type").val(1);
				a("#" + i + "_Hour").val(b - 12);
				gVar.runTime.hour = b - 12;
			}
		}
		a("#" + i + "_Min").val(c);
		a("#" + i + "_Sec").val(d)
	};
	jQuery.fn.timer.defaults = {
		Type: 0,
		hasSecond: true,
		bRunTime: false
	}
})(jQuery);
(function($) {
	var curDate = new Date();
	var months = "1,2,3,4,5,6,7,8,9,10,11,12".split(',');
	var monthlengths = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
  	var dateRegEx = /^\d{1,2}\/\d{1,2}\/\d{2}|\d{4}$/;
	var yearRegEx = /^\d{4,4}$/;
	var GLtoHLyear,GLtoHLmonth,GLtoHLday;
	this.a = 0;
	this.b = 0;
	_self = this;
	var XqS = [
		  ["Su","Mo","Tu","We","Th","Fr","Sa"],
		  ["日","一","二","三","四","五","六"],
	];
	$.fn.simpleCalendarCtrl = function(b, f) {
		if (typeof b == "string" && b != "") {
			return $.fn.simpleCalendarCtrl.methods[b](this, f)
		}
		var opts = jQuery.extend({}, jQuery.fn.simpleCalendarCtrl.defaults, b);
		$(this).data("options", opts);
		$.fn.simpleCalendarCtrl.methods = {
			setFormat:function(q, p){
				var o = $(q).data("options");
				if (!o) {
					return
				}
				o.format = p;
			},
			setSeparator:function(q, p){
				var o = $(q).data("options");
				if (!o) {
					return
				}
				o.separator = p;
			}
		};
		
		setupYearRange();
		function setupYearRange () {
			var tempNowDate = new Date();
			opts.startyear = 2000;
			opts.endyear = 2080;
		}
		function newCalendarCtrlHTML () {
			var years = [];
			for (var i = 0; i <= opts.endyear - opts.startyear; i ++) years[i] = opts.startyear + i;
	
			var table = jQuery('<table class="CalendarCtrl" cellpadding="0" cellspacing="0" style="top:-5px; margin-top:0px; marker-offset:0px; "></table>');
			table.append('<thead></thead>');
			table.append('<tfoot></tfoot>');
			table.append('<tbody class="tbody"></tbody>');
			
			var selectMonth = "";
			selectMonth = '<div id="selectMonth" class="selectMonth"><select class="CalSelect" id="' + opts.name + '_month" name="month">';
			for (var i in months) selectMonth += ('<b>'+'<option value="'+i+'">'+months[i]+'</option>'+'</b>');
			selectMonth += '</select></div>';
			
			var selectYear = "";
			selectYear = '<div id="selectYear" class="selectYear"><select class="CalSelect" id="' + opts.name + '_year" name="year">';
			for (var i in years) selectYear += ('<option>'+'<b>'+years[i]+'</b>'+'</option>'); //<b></b> //for (var i in years) selectYear += ('<option>'+years[i]+'</option>');
			selectYear += '</select></div>';

			jQuery("thead",table).append('<tr class="CalendarYMHeader">  \
				<th><div class="prevMonth"></div></th>  \
				<th colspan="5">'+selectYear+selectMonth+'</th>  \
				<th><div class="nextMonth"></div></th>  \
			</tr>');
			var dSt = gVar.nWeekStart;
			jQuery("thead",table).append('<tr class="days">  \
				<th>'+XqS[opts.Laguage][dSt]+'</th>  \
				<th>'+XqS[opts.Laguage][dSt+1>6?dSt+1-7:dSt+1]+'</th>  \
				<th>'+XqS[opts.Laguage][dSt+2>6?dSt+2-7:dSt+2]+'</th>  \
				<th>'+XqS[opts.Laguage][dSt+3>6?dSt+3-7:dSt+3]+'</th>  \
				<th>'+XqS[opts.Laguage][dSt+4>6?dSt+4-7:dSt+4]+'</th>  \
				<th>'+XqS[opts.Laguage][dSt+5>6?dSt+5-7:dSt+5]+'</th>  \
				<th fdfs>'+XqS[opts.Laguage][dSt+6>6?dSt+6-7:dSt+6]+'</th>  \
			</tr>');
			jQuery("tbody",table).append('<tr><td><div></div></td><td><div></div></td> \
			<td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>');
			for (var i = 1; i < 6; i++) jQuery("tbody",table).append('<tr>  \
				<td><div></div></td> \
				<td><div></div></td> \
				<td><div></div></td> \
				<td><div></div></td> \
				<td><div></div></td> \
				<td><div></div></td> \
				<td><div></div></td>  \
			</tr>');
			return table;
		}
		
		function CreateTip(){
			var div = jQuery('<div id="CalTip" style="width:123px;height:109px;position:absolute;display:none;"><p style="color:#F00;font-size:12px;margin:30px 20px;"></p></div>');
			return div;
		}
		
		function loadMonth (e, el, CalendarCtrl, chosendate, tip) {
			var nSelMonth = jQuery("select[name=month]", CalendarCtrl).get(0).selectedIndex;
			var nSelYear = jQuery("select[name=year]", CalendarCtrl).get(0).selectedIndex;
			var nYearCount = jQuery("select[name=year] option", CalendarCtrl).get().length;
			
			if (e && jQuery(e.target).hasClass('prevMonth')) {				
				if (0 == nSelMonth && nSelYear) {
					nSelYear -= 1; nSelMonth = 11;
					jQuery("select[name=month]", CalendarCtrl).get(0).selectedIndex = 11;
					jQuery("select[name=year]", CalendarCtrl).get(0).selectedIndex = nSelYear;
				} else {
					nSelMonth -= 1;
					jQuery("select[name=month]", CalendarCtrl).get(0).selectedIndex = nSelMonth;
				}
			} else if (e && jQuery(e.target).hasClass('nextMonth')) {
				if (11 == nSelMonth && nSelYear + 1 < nYearCount) {
					nSelYear += 1; nSelMonth = 0;
					jQuery("select[name=month]", CalendarCtrl).get(0).selectedIndex = 0;
					jQuery("select[name=year]", CalendarCtrl).get(0).selectedIndex = nSelYear;
				} else { 
					nSelMonth += 1;
					jQuery("select[name=month]", CalendarCtrl).get(0).selectedIndex = nSelMonth;
				}
			}

			if(_self.a != nSelMonth || _self.b != nSelYear)
			{
				_self.a = nSelMonth;
				_self.b = nSelYear;
			}
			
			if (0 == nSelMonth && !nSelYear) jQuery("div.prevMonth", CalendarCtrl).hide(); 
			else jQuery("div.prevMonth", CalendarCtrl).show(); 
			if (nSelYear + 1 == nYearCount && 11 == nSelMonth) jQuery("div.nextMonth", CalendarCtrl).hide(); 
			else jQuery("div.nextMonth", CalendarCtrl).show(); 
			
			var cells = jQuery("tbody td div", CalendarCtrl).unbind().empty().removeClass('date');
			
			var m = jQuery("select[name=month]", CalendarCtrl).val();
			var y = jQuery("select[name=year]", CalendarCtrl).val();
			var d = new Date(y, m, 1);
			var startindex = d.getDay();
			var numdays = monthlengths[m];
			if (1 == m && ((y%4 == 0 && y%100 != 0) || y%400 == 0)) numdays = 29;
			if (opts.startdate.constructor == Date) {
				var startMonth = opts.startdate.getMonth();
				var startDate = opts.startdate.getDate();
			}
			if (opts.enddate.constructor == Date) {
				var endMonth = opts.enddate.getMonth();
				var endDate = opts.enddate.getDate();
			}
			var tempIndex = startindex - gVar.nWeekStart<0 ? startindex - gVar.nWeekStart+7: startindex - gVar.nWeekStart;
			for (var i = 0; i < numdays; i++) {
				var cell = jQuery(cells.get(i+tempIndex)).removeClass('chosen');
				if ((nSelYear || ((!startDate && !startMonth) || ((i+1 >= startDate && nSelMonth == startMonth) || nSelMonth > startMonth))) &&
					(nSelYear + 1 < nYearCount || ((!endDate && !endMonth) || ((i+1 <= endDate && nSelMonth == endMonth) || nSelMonth < endMonth)))) {
					cell.text(i+1)
						.addClass('date')
						.hover(
							function () { 
								jQuery(this).addClass('over');
							},
							function () { jQuery(this).removeClass('over'); jQuery(tip).hide();})
						.click(function () {
							var chosenDateObj = new Date(jQuery("select[name=year]", CalendarCtrl).val(), jQuery("select[name=month]", CalendarCtrl).val(), jQuery(this).text());
							closeIt(el, CalendarCtrl, chosenDateObj);
						});
					
					if (i+1 == opts.chosendate.getDate() && m == opts.chosendate.getMonth() && y == opts.chosendate.getFullYear()) {
						cell.addClass('chosen');
					}
				}
			}
			el.focus();
		}
		
		function closeIt (el, CalendarCtrl, dateObj) { 
			if (dateObj && dateObj.constructor == Date){
				el.val(jQuery.fn.simpleCalendarCtrl.formatOutput(dateObj, el));
				el.attr("data-date",jQuery.fn.simpleCalendarCtrl.formatOutput(dateObj));
				opts.chosendate = dateObj;
			}
			CalendarCtrl.remove();
			$("#"+opts.nIframe).css({ position: 'absolute', width: 0, height: 0 });
			CalendarCtrl = null;
			jQuery.data(el.get(0), "simpleCalendarCtrl", { hasCalendarCtrl : false });
			el.attr("idname", "");
		}
        return this.each(function() {
			if ( jQuery(this).is('input') && 'text' == $(this).attr("type")) {
				var CalendarCtrl, tip; 
				jQuery.data(jQuery(this).get(0), "simpleCalendarCtrl", { hasCalendarCtrl : false });
				if(opts.Laguage == "English"){
					opts.Laguage = 0;
				}else if(opts.Laguage == "SimpChinese"){
					opts.Laguage = 1;
				}else{
					opts.Laguage = 0;
				}
				jQuery(this).click(function (ev) {
					var $this = jQuery(ev.target);					
					if (false == jQuery.data($this.get(0), "simpleCalendarCtrl").hasCalendarCtrl) {
						this.className="addTimeClick";
						jQuery.data($this.get(0), "simpleCalendarCtrl", { hasCalendarCtrl : true });
						
						var initialDate = $this.val();
						var chosendate = opts.chosendate;
						CalendarCtrl = newCalendarCtrlHTML();
						jQuery("#"+opts.name).html(CalendarCtrl);
						if (g_BrowseType == BrowseType.BrowseSafari){
							$(".selectYear").css("width","45px");
							$(".selectMonth").css("width","25px");
						}
						tip = CreateTip();
						jQuery("body").append(tip);
						opts.tip = tip;
						
						var elPos = [0,0];
						var x = (parseInt(opts.x) ? parseInt(opts.x) : 0) + elPos[0];
						var y = (parseInt(opts.y) ? parseInt(opts.y) : 0) + elPos[1];
						jQuery(CalendarCtrl).css({ position: 'absolute', left: x, top: y });
						
						if (g_BrowseType == BrowseType.BrowseMSIE && g_browserVer.indexOf("6")!=-1){
							$("#"+opts.nIframe).css({ position: 'absolute', left: jQuery(CalendarCtrl).css("left"), top: jQuery(CalendarCtrl).css("top"), width:jQuery(CalendarCtrl).css("width"), height:jQuery(CalendarCtrl).css("height") });
						}
						
						jQuery("div", CalendarCtrl).css("cursor","pointer");
						jQuery("input", CalendarCtrl).bind('click', function () {
							loadMonth (null, $this, CalendarCtrl, chosendate, tip); 
						});
						jQuery("select", CalendarCtrl).change(function () {
							$(this).blur();
							loadMonth (null, $this, CalendarCtrl, chosendate, tip);
						});
						jQuery("div.prevMonth", CalendarCtrl).click(function (e) {						
							loadMonth (e, $this, CalendarCtrl, chosendate, tip);
						});
						jQuery("div.nextMonth", CalendarCtrl).click(function (e) {
							loadMonth (e, $this, CalendarCtrl, chosendate, tip);
						});

						$this.blur(function(){
							if ($this.attr("idname") != "mouseover"){
								CalendarCtrl.fadeTo("slow",0,function(){
									closeIt($this, CalendarCtrl);
								});
								$this.attr("idname","");
								CalendarCtrl.fadeTo(100,1);
							}else{
								if(document.activeElement.id!= (opts.name + '_year') && document.activeElement.id!= (opts.name + '_month')){
									$this.focus();
								}
							}
						});
						$("#" + opts.name + "_year").blur(function(){
							$this.focus();
						});
						$("#" + opts.name + "_month").blur(function(){
							$this.focus();
						});
						CalendarCtrl.mouseover(function(){$this.attr("idname", "mouseover");});
						CalendarCtrl.mouseout(function(){$this.attr("idname", "");});
						jQuery("select[name=month]", CalendarCtrl).get(0).selectedIndex = chosendate.getMonth();
						jQuery("select[name=year]", CalendarCtrl).get(0).selectedIndex = Math.max(0, chosendate.getFullYear() - opts.startyear);
						loadMonth(null, $this, CalendarCtrl, chosendate, tip);
					}
					
				});
			}
        });
    };
	jQuery.fn.simpleCalendarCtrl.formatOutput = function (dateObj, obj) {
		var separator = "-";
		var format = "YYMMDD";
		if(obj){
			var opts = obj.data("options");
			separator = opts.separator;
			format = opts.format;
		}
		var month = dateObj.getMonth() + 1;
		var day = dateObj.getDate();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		var sDate = dateObj.getFullYear() + separator + month + separator + day;
		if(format == "MMDDYY"){
			sDate = month + separator + day  + separator + dateObj.getFullYear();
		}else if(format == "DDMMYY"){
			sDate = day  + separator + month + separator + dateObj.getFullYear();
		}
		return sDate;
	};
	jQuery.fn.simpleCalendarCtrl.defaults = {
		chosendate : curDate,		
		startdate : curDate.getFullYear(), 
		enddate : curDate.getFullYear(),
		name: "calendar",
		nIframe:"nIframe",
		type: 0,
		x : 0,
		y : 0,
		tip: null,
		Laguage: "SimpChinese",
		format : "YYMMDD",
		separator : "-"
	};
})(jQuery);