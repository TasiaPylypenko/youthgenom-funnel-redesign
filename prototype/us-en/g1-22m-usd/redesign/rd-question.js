/* Question screen: one question per screen (R-07), one option component (R-06), "Other" with free text (R-08).
   The page defines window.Q = { id, type: "single" | "multi", title, sub, note, options: [{ v, label, hint, other, exclusive }], grid, saveAs, skip }.
   skip = { v, label }: a second button under Continue (e.g. "I don't have food allergies") that answers "none" and moves on.
   Both single and multi select use the Continue button, so she confirms her choice (R-46). */
(function () {
  var Q = window.Q, s = RD.load(), saved = (s.answers || {})[Q.id] || {}, picked = (saved.values || []).slice(), otherText = saved.other || "";
  RD.header(Q.id);

  var CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>';
  var box = document.getElementById("options");
  box.className = "rd-options" + (Q.grid ? " rd-options--grid" : "");
  box.setAttribute("role", Q.type === "single" ? "radiogroup" : "group");
  box.innerHTML = Q.options.map(function (o) {
    return '<button type="button" class="rd-option' + (Q.type === "multi" ? " rd-option--multi" : "") + (Q.grid ? " rd-option--compact" : "") + '" role="' + (Q.type === "single" ? "radio" : "checkbox") + '" aria-checked="false" data-v="' + o.v + '">' +
      '<span class="rd-option__check" aria-hidden="true">' + CHECK + '</span>' +
      '<span class="rd-option__text"><span class="rd-option__label">' + o.label + '</span>' + (o.hint ? '<span class="rd-option__hint">' + o.hint + "</span>" : "") + "</span></button>";
  }).join("") + '<div class="rd-other rd-hide" id="otherBox" style="grid-column:1/-1"><label class="rd-label" for="other">Tell us more <span style="font-weight:400;color:var(--muted)">(optional)</span></label><textarea id="other" maxlength="200" placeholder="Type your answer"></textarea></div>';

  var other = document.getElementById("other"), otherBox = document.getElementById("otherBox"), cta = document.getElementById("cta");
  other.value = otherText;

  function opt(v) { return Q.options.filter(function (o) { return o.v === v; })[0] || {}; }
  // A saved "skip" answer has no option on screen; start with nothing ticked.
  picked = picked.filter(function (v) { return Q.options.some(function (o) { return o.v === v; }); });
  function render() {
    box.querySelectorAll(".rd-option").forEach(function (b) { b.setAttribute("aria-checked", picked.indexOf(b.dataset.v) > -1 ? "true" : "false"); });
    var hasOther = picked.some(function (v) { return opt(v).other; });
    otherBox.classList.toggle("rd-hide", !hasOther);
    if (cta) cta.disabled = picked.length === 0;
  }
  function store() {
    var answers = Object.assign({}, RD.load().answers || {});
    answers[Q.id] = { values: picked, other: other.value.trim() };
    var patch = { answers: answers };
    if (Q.saveAs) patch[Q.saveAs] = Q.type === "single" ? picked[0] : picked.map(function (v) { return opt(v).short || opt(v).label; }).filter(function (l, i) { return !opt(picked[i]).exclusive; });
    RD.save(patch);
  }
  box.addEventListener("click", function (e) {
    var b = e.target.closest(".rd-option"); if (!b) return;
    var v = b.dataset.v, o = opt(v);
    if (Q.type === "single") {
      picked = [v]; render(); store();
      if (o.other) setTimeout(function () { other.focus(); }, 50);
      return;
    }
    var i = picked.indexOf(v);
    if (i > -1) picked.splice(i, 1);
    else if (o.exclusive) picked = [v];
    else { picked = picked.filter(function (x) { return !opt(x).exclusive; }); picked.push(v); }
    render(); store();
    if (o.other && picked.indexOf(v) > -1) setTimeout(function () { other.focus(); }, 50);
  });
  other.addEventListener("input", store);
  if (cta) cta.onclick = function () { store(); RD.next(Q.id); };
  var skip = document.getElementById("skip");
  if (skip && Q.skip) skip.onclick = function () { picked = [Q.skip.v]; other.value = ""; store(); RD.next(Q.id); };
  render();
})();
