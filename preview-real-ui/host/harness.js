/* Real-UI harness boot.
 * Loads the real page fragments + real page JS against the real skin.css and
 * the real plugin framework. Supplies only the globals the native shell would
 * normally inject (gDevice / gOemInfo / gVar / gNet / lg), then drives the same
 * login bootstrap the app uses (class.js ~line 3015). Never edits real files.
 */
(function () {
  "use strict";
  var $ = window.jQuery;

  /* ---------------- shims installed at parse time (before any jQuery ready
     callback fires) so the real framework's load-time reads don't throw ------ */
  // jQuery >=1.9 removed $.browser; the real RSUI.js still reads a.browser.msie.
  if ($ && !$.browser) {
    var _ua = (navigator.userAgent || "").toLowerCase();
    $.browser = {
      msie: false, mozilla: /firefox/.test(_ua), webkit: /webkit/.test(_ua),
      chrome: /chrome|crios/.test(_ua), safari: /safari/.test(_ua) && !/chrome/.test(_ua),
      opera: /opr|opera/.test(_ua), version: "120.0"
    };
  }
  // g_productID: real config/alarm/record scripts test `g_productID === "G2"`.
  // This is a non-G2 device (GK7205V300); an empty id keeps every G2 branch off.
  if (typeof window.g_productID === "undefined") window.g_productID = "";

  /* ---------------- non-fatal error surface ---------------- */
  var errs = [];
  function note(msg) {
    errs.push(String(msg));
    var el = document.getElementById("hz-errbadge");
    if (el) {
      el.style.display = "block";
      el.textContent = "non-fatal JS notices:\n" + errs.slice(-40).join("\n");
    }
  }
  window.addEventListener("error", function (e) {
    var f = (e.filename || "").split("/").pop();
    note((e.message || "error") + "  @" + f + ":" + (e.lineno || "?"));
  });
  window.addEventListener("unhandledrejection", function (e) {
    note("promise: " + ((e.reason && e.reason.message) || e.reason));
  });

  /* ---------------- language (lg.get) ---------------- */
  var LGMAP = {};
  function ensureLg() {
    if (window.lg && typeof window.lg.get === "function") return; // real lg present
    window.lg = {
      get: function (k) { return (k in LGMAP) ? LGMAP[k] : k; },
      refresh: function () {},
      set: function (k, v) { LGMAP[k] = v; }
    };
  }
  function decodeEntities(s) {
    if (s == null) return s;
    return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
            .replace(/&#x([0-9a-fA-F]+);/g, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
            .replace(/&#(\d+);/g, function (_, d) { return String.fromCharCode(parseInt(d, 10)); })
            .replace(/&amp;/g, "&");
  }
  function loadLangXml(name, done) {
    // Fetch as TEXT (server Content-Type is irrelevant this way), then parse
    // robustly: DOMParser first, and a regex fallback that is immune to any
    // single malformed entry / strict-XML rejection in the ~1300-string file.
    $.ajax({ url: "/lg/" + name + ".xml", dataType: "text", cache: false })
      .done(function (raw) {
        var n = 0;
        try {
          var doc = new DOMParser().parseFromString(raw, "application/xml");
          if (!doc.getElementsByTagName("parsererror").length) {
            var nodes = doc.getElementsByTagName("string");
            for (var i = 0; i < nodes.length; i++) {
              var id = nodes[i].getAttribute("id");
              if (id != null) { LGMAP[id] = nodes[i].textContent; n++; }
            }
          }
        } catch (ex) { /* fall through to regex */ }
        if (n === 0 && typeof raw === "string") {
          var re = /<string\s+id="([^"]*)"\s*>([\s\S]*?)<\/string>/g, m;
          while ((m = re.exec(raw))) { LGMAP[m[1]] = decodeEntities(m[2]); n++; }
        }
        note(n ? ("lang loaded: " + name + " (" + n + " strings)") : ("lang empty: " + name));
        done && done();
      })
      .fail(function () { note("lang load failed: " + name); done && done(); });
  }

  /* ---------------- globals the pages read ---------------- */
  function ensureGlobals() {
    // gDevice
    try {
      if (!window.gDevice) {
        window.gDevice = (typeof DeviceInfo === "function") ? new DeviceInfo() : {};
      }
      gDevice.programLogo = gDevice.programLogo || {};
      gDevice.programLogo.bLogo = true;
      gDevice.programLogo.bLoginTopLogo = true;
      // Device capabilities: on a live device these arrive from GetAbility /
      // GetSafetyAbility CGI. Seed the exact caps the UI reads so config screens
      // don't throw on gDevice.Ability.<group>.<flag> / gDevice.SafetyAbility[...].
      gDevice.Ability = gDevice.Ability || {};
      gDevice.Ability.OtherFunction = gDevice.Ability.OtherFunction || {};
      if (!gDevice.SafetyAbility || typeof gDevice.SafetyAbility !== "object") {
        gDevice.SafetyAbility = { GetSafetyAbility: { VerifyQRCode: 0, Question: 0, SetResetUser: 0 } };
      }
      if (typeof gDevice.devType === "undefined")
        gDevice.devType = (window.devTypeEnum ? devTypeEnum.DEV_IPC : 2);
    } catch (ex) {
      note("gDevice: " + ex.message);
      window.gDevice = { programLogo: { bLogo: true, bLoginTopLogo: true },
        Ability: { OtherFunction: {} },
        SafetyAbility: { GetSafetyAbility: { VerifyQRCode: 0, Question: 0, SetResetUser: 0 } },
        devType: 2 };
    }

    // gOemInfo: let the REAL OemInfo.init() build langArray as {value,text}
    // objects -- that is exactly what rsselect reads (p[q].value / p[q].text).
    // Fabricated [code,code] pairs render as "undefined" in the widget.
    try {
      if (typeof $.cookie !== "function") { $.cookie = function () { return null; }; }
      if (!window.gOemInfo) {
        window.gOemInfo = (typeof OemInfo === "function") ? new OemInfo() : {};
      }
      try { if (typeof gOemInfo.init === "function") gOemInfo.init(); } catch (e0) { note("oem.init: " + e0.message); }
      // validate/repair: each entry must be an object with .value + .text
      var a0 = gOemInfo.langArray;
      var ok = a0 && a0.length && a0[0] && typeof a0[0] === "object" && ("text" in a0[0]);
      if (!ok) {
        var listStr = (window.WebCms && WebCms.web && WebCms.web.languageList) || "English";
        var list = listStr.split(/\s+/).filter(Boolean);
        var LA = window.LanguageArray || [["English", "English"]];
        gOemInfo.langArray = list.map(function (code) {
          for (var i = 0; i < LA.length; i++) if (LA[i][0] === code) return { value: LA[i][0], text: LA[i][1] };
          return { value: code, text: code };
        });
      }
    } catch (ex) {
      note("gOemInfo: " + ex.message);
      window.gOemInfo = { langArray: [{ value: "English", text: "English" }] };
    }

    // gVar (minimal Web-instance surface the login screen uses)
    try {
      window.gVar = window.gVar || {};
      var gv = window.gVar;
      if (gv.pswMinLen == null) gv.pswMinLen = 0;
      if (gv.pswMaxLen == null) gv.pswMaxLen = 64;
      if (gv.userNameLen == null) gv.userNameLen = 16;
      gv.bWebInit = gv.bWebInit || false;
      gv.sPage = gv.sPage || "login";
      if (typeof gv.ChangeLang !== "function") gv.ChangeLang = function (lang) { switchLang(lang); };
    } catch (ex) { note("gVar: " + ex.message); }

    // gNet: base on the REAL CGIClass.prototype so every method the framework
    // invokes (SendObjMsg / SendStrMsg / SendRequestV2 / PTZcontrol / ...) exists,
    // then override only the low-level transport to hit our mock /cgi-bin/*.cgi.
    try {
      if (!window.gNet) {
        var g = (typeof CGIClass === "function") ? Object.create(CGIClass.prototype) : {};
        g.run = false; g.isGetKey = false; g.isAesEncrypt = false; g.aesKeyAndIv = null;
        g.bInit = true; g.bLogin = false; g.nCurWnd = 0; g.initUrl = "/cgi-bin/";
        // Canned per-Name payloads so real code that reads reply[reply.Name].<field>
        // finds a shape instead of throwing (e.g. GetRandomFunc -> GetDevInfo.SerialNo).
        var canned = function (name) {
          var t = {
            GetDevInfo: { SerialNo: "MOCK0000000000000000", DeviceType: "IPC",
                          HardWareVersion: "1.0", SoftWareVersion: version_web,
                          DeviceName: "VideoPlayTool (mock)", Manufacturer: "" },
            GetRandomUser: { Info: "", InfoUser: "" }
          };
          return t[name] || {};
        };
        // Every device reply is guaranteed Ret/Name/[Name] so a[a.Name].x can't throw.
        var normalize = function (d, nm) {
          d = (d && typeof d === "object") ? d : {};
          if (typeof d.Ret === "undefined") d.Ret = 100;
          var key = d.Name || nm;
          if (key) { d.Name = key; if (typeof d[key] === "undefined") d[key] = canned(key); }
          return d;
        };
        var mockPost = function (cmd, payload, cb, timeout) {
          var nm = (payload && payload.Name) || cmd || "";
          $.ajax({
            type: "post", url: "/cgi-bin/" + (cmd || "cmd") + ".cgi",
            data: JSON.stringify(payload || {}),
            contentType: "application/json;charset=utf-8",
            dataType: "json", timeout: timeout || 8000
          })
            .done(function (d) { cb && cb(normalize(d, nm), ""); })
            .fail(function () { cb && cb(normalize({ Name: nm, Ret: 100 }, nm), ""); });
        };
        g.SendRequestV2 = function (cmd, obj, async, cb, timeout) { mockPost(cmd, obj, cb, timeout); };
        g.SendRequest   = function (cmd, obj, async, cb, timeout) { mockPost(cmd, obj, cb, timeout); };
        g.sendRequest   = function (cmd, obj, async, cb, timeout) { mockPost(cmd, obj, cb, timeout); };
        g.SendObjMsg    = function (id, obj, cb)  { mockPost("setconfig", obj, cb); };
        g.SendStrMsg    = function (id, name, cb) { mockPost("getconfig", { Name: name }, cb); };
        g.SendBinaryData = function () { var cb = arguments[arguments.length - 1]; if (typeof cb === "function") cb({ Ret: 100 }, ""); };
        g.PTZcontrol    = function () { var cb = arguments[arguments.length - 1]; if (typeof cb === "function") cb({ Ret: 100 }, ""); return true; };
        window.gNet = g;
      }
    } catch (ex) { note("gNet: " + ex.message); }

    // keep g_BrowseType consistent with the final BrowseType object
    try { if (window.BrowseType) window.g_BrowseType = BrowseType.BrowseChrome; } catch (e) {}
  }

  /* ---------------- screen loading ---------------- */
  var CUR = "login";
  function setActiveBtn(name) {
    $(".hz-btn[data-screen]").removeClass("hz-active");
    $('.hz-btn[data-screen="' + name + '"]').addClass("hz-active");
  }

  function runPageJs(name) {
    $.ajax({
      url: "/html/" + name + ".js?version=" + encodeURIComponent(version_web) + "&SetupName=VideoPlayToolSetup",
      dataType: "text", cache: false
    })
      .done(function (code) {
        try { (0, eval)(code); }          // indirect eval -> global scope (like a <script>)
        catch (ex) { note(name + ".js: " + ex.message); }
        try { gVar.bWebInit = true; } catch (e) {}
      })
      .fail(function () { note(name + ".js: not found"); });
  }

  function loadScreen(name) {
    CUR = name;
    setActiveBtn(name);
    $.ajax({ url: "/html/" + name + ".html?version=" + encodeURIComponent(version_web),
             dataType: "html", cache: false })
      .done(function (html) {
        try {
          $("#login").html(html).css("display", "block");
          $(".login_main").css("display", "block");   // login.html ships hidden
          runPageJs(name);
        } catch (ex) { note(name + " inject: " + ex.message); }
      })
      .fail(function () {
        $("#login").html('<div style="padding:48px;color:#555;font:14px Segoe UI">' +
          'Screen fragment <b>html/' + name + '.html</b> not found in this build.</div>').show();
      });
  }

  function switchLang(code) {
    LGMAP = {};
    loadLangXml(code, function () {
      if (window.WebCms && WebCms.web) WebCms.web.language = code;
      if (window.lg && lg.refresh) { try { lg.refresh(); } catch (e) {} }
      loadScreen(CUR);
    });
  }

  /* ---------------- toolbar ---------------- */
  function fillLangDropdown() {
    var sel = document.getElementById("hz-lang");
    if (!sel) return;
    var la = (window.gOemInfo && gOemInfo.langArray) || [["English", "English"]];
    var cur = (window.WebCms && WebCms.web && WebCms.web.language) || "English";
    sel.innerHTML = "";
    la.forEach(function (pair) {
      var o = document.createElement("option");
      o.value = pair[0]; o.textContent = pair[1];
      if (pair[0] === cur) o.selected = true;
      sel.appendChild(o);
    });
    sel.onchange = function () { switchLang(sel.value); };
  }

  /* ---------------- boot ---------------- */
  function boot() {
    $ = window.jQuery;
    window.WebCms = window.WebCms || {};
    WebCms.web = WebCms.web || {};
    if (!WebCms.web.language) WebCms.web.language = window.g_defaultLanguage || "English";
    if (!WebCms.web.languageList) WebCms.web.languageList = "English";

    ensureLg();
    loadLangXml(WebCms.web.language, function () {
      ensureGlobals();
      fillLangDropdown();
      $(".hz-btn[data-screen]").on("click", function () { loadScreen($(this).attr("data-screen")); });
      $("#hz-reload").on("click", function () {
        var l = document.getElementById("skinCss");
        var base = l.getAttribute("href").split("?")[0];
        l.setAttribute("href", base + "?t=" + Date.now());
        setTimeout(function () { loadScreen(CUR); }, 150);
      });
      loadScreen("login");
    });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(boot, 0);
  } else {
    window.addEventListener("DOMContentLoaded", boot);
  }
})();
