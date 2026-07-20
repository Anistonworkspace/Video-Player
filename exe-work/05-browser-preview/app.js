/* MOCK behaviour only. No video, no network, no device I/O.
   Every handler just writes a labelled message to the status bar so a
   designer can see which control maps to which action during a redesign. */
(function () {
  "use strict";
  var status = document.getElementById("status");
  function say(msg) { status.textContent = "[mock] " + msg + " — nothing real happens."; }

  // Toolbar buttons
  document.querySelectorAll(".tb").forEach(function (b) {
    b.addEventListener("click", function () { say("Toolbar action: " + b.dataset.act); });
  });

  // Playback transport
  document.querySelectorAll(".pb").forEach(function (b) {
    b.addEventListener("click", function () { say("Transport: " + b.textContent); });
  });

  // Channel selection
  document.querySelectorAll(".tree .chn").forEach(function (c) {
    c.addEventListener("click", function () {
      document.querySelectorAll(".tree .chn").forEach(function (x) { x.classList.remove("on"); });
      c.classList.add("on");
      say("Selected channel: " + c.textContent.trim());
    });
  });

  // Video grid cell focus
  document.querySelectorAll(".grid .cell").forEach(function (cell) {
    cell.addEventListener("click", function () {
      document.querySelectorAll(".grid .cell").forEach(function (x) { x.classList.remove("active"); });
      cell.classList.add("active");
      say("Focused window: " + cell.querySelector(".tag").textContent);
    });
  });

  // Window-count layout modes (visual only)
  document.querySelectorAll(".wnd").forEach(function (w) {
    w.addEventListener("click", function () {
      document.querySelectorAll(".wnd").forEach(function (x) { x.classList.remove("active"); });
      w.classList.add("active");
      var n = parseInt(w.dataset.n, 10);
      var grid = document.getElementById("grid");
      var cols = n === 1 ? 1 : n === 4 ? 2 : 3;
      grid.style.gridTemplateColumns = "repeat(" + cols + ",1fr)";
      grid.style.gridTemplateRows = "repeat(" + Math.ceil(n / cols) + ",1fr)";
      say("Layout mode: " + w.textContent + " (visual grid only)");
    });
  });

  // Fake timeline animation so the mock feels alive (purely cosmetic)
  var prog = document.querySelector(".progress");
  var pct = 0;
  setInterval(function () {
    pct = (pct + 0.25) % 100;
    if (prog) prog.style.width = pct + "%";
  }, 200);

  say("Ready");
})();
