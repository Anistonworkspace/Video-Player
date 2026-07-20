/* ============================================================================
 * preview-adapter.js  —  SAFE LOCAL PREVIEW SHIM
 * ----------------------------------------------------------------------------
 * Injected at serve time by mock_camera_api.py. The on-disk UI files are NOT
 * modified. This shim exists ONLY to make the shipped firmware web UI safe to
 * open in an ordinary browser with no camera and no installed player:
 *
 *   1. Neutralises the "VideoPlayTool://" custom-protocol launch so the preview
 *      can NEVER start a real installed player.
 *   2. Adds a persistent banner making clear this is a mock, not a live device.
 *   3. Draws a clearly-labelled placeholder over the native video/OCX region.
 *
 * It does NOT decode video, contact any camera, or perform real authentication.
 * The mock bridge (127.0.0.1:54455) and mock CGI (/cgi-bin/*) are provided by
 * mock_camera_api.py; this shim only guards the browser side.
 * ========================================================================== */
(function () {
  "use strict";
  if (window.__PREVIEW_ADAPTER_LOADED__) return;
  window.__PREVIEW_ADAPTER_LOADED__ = true;

  /* -- 1. Block the custom-protocol player launch --------------------------- */
  // main.js (MSIE/Edge branch) creates <a href="VideoPlayTool://1"> and clicks
  // it to launch the installed native player. We stop any such navigation.
  function isPlayerProto(v) {
    return typeof v === "string" && /^\s*videoplaytool:/i.test(v);
  }
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (a && isPlayerProto(a.getAttribute("href"))) {
      e.preventDefault();
      e.stopPropagation();
      console.warn("[preview] Blocked VideoPlayTool:// launch (safe mock).");
      toast("Blocked player launch (VideoPlayTool://) — safe preview.");
      return false;
    }
  }, true);
  // Guard programmatic navigation too.
  try {
    var _assign = window.location.assign.bind(window.location);
    window.location.assign = function (u) {
      if (isPlayerProto(u)) { console.warn("[preview] blocked assign", u); return; }
      return _assign(u);
    };
  } catch (_) {}

  /* -- 2. Banner ------------------------------------------------------------ */
  function banner() {
    if (document.getElementById("__preview_banner")) return;
    var b = document.createElement("div");
    b.id = "__preview_banner";
    b.innerHTML =
      '<strong>SAFE LOCAL PREVIEW</strong> — mock camera + mock player. ' +
      'No device, no real streaming, no real login. ' +
      'Source UI is unmodified (served from <code>05-web-ui-development</code>).' +
      '<span id="__preview_x" title="hide">×</span>';
    document.body.appendChild(b);
    document.body.classList.add("__has_preview_banner");
    document.getElementById("__preview_x").onclick = function () {
      b.style.display = "none";
      document.body.classList.remove("__has_preview_banner");
    };
  }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "__preview_toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("show"); }, 10);
    setTimeout(function () { t.classList.remove("show"); }, 3200);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3800);
  }

  /* -- 3. Mock video panel over the native/OCX region ----------------------- */
  // The real player renders into an <object>/<embed> (OCX) or a plugin div.
  // We overlay a labelled placeholder so the layout is visible & obviously fake.
  function overlayVideoRegions() {
    var targets = [];
    ["object", "embed"].forEach(function (tag) {
      Array.prototype.forEach.call(document.getElementsByTagName(tag), function (el) {
        targets.push(el);
      });
    });
    // Common XiongMai video container ids/classes seen in this UI family.
    ["divPlugin", "video", "VideoWnd", "playWnd", "ocxDiv", "divVideo"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) targets.push(el);
    });
    targets.forEach(function (el) {
      if (el.__preview_wrapped) return;
      el.__preview_wrapped = true;
      var ph = document.createElement("div");
      ph.className = "__preview_video";
      ph.innerHTML =
        '<div class="__pv_tag">MOCK VIDEO</div>' +
        '<img src="/__mock/frame.svg" alt="mock video frame">' +
        '<div class="__pv_note">Native VideoPlayTool decoding is not run in preview.</div>';
      try {
        el.style.visibility = "hidden";
        if (el.parentNode) el.parentNode.insertBefore(ph, el);
      } catch (_) {}
    });
  }

  /* -- init ----------------------------------------------------------------- */
  function init() {
    banner();
    overlayVideoRegions();
    // Re-scan for dynamically-created OCX regions.
    var n = 0;
    var iv = setInterval(function () {
      overlayVideoRegions();
      if (++n > 20) clearInterval(iv);
    }, 500);
    console.info("[preview] Safe adapter active. Bridge=127.0.0.1:54455 (mock).");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
