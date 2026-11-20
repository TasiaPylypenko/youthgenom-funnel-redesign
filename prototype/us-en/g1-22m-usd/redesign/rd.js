/* YouthGenom funnel redesign: shared state and helpers.
   State lives in localStorage under "yg_rd" so every redesigned screen can use earlier answers.
   Steps that weren't redesigned keep the original site's own code. */
(function () {
  var BASE = "/youthgenom-funnel-redesign/prototype/us-en/g1-22m-usd/";
  var KEY = "yg_rd";
  // Quiz order after the redesign. Steps 17-20, 23 and 24 are removed; steps 2, 11 and 21 are split (one question per screen).
  var QUIZ = ["1-test", "2-test", "2b-test", "3-test", "4-test", "5-test", "6-test", "7-test", "8-test", "9-test", "10-test",
              "11-test", "11b-test", "11c-test", "12-test", "13-test", "14-test", "15-test", "16-test", "21-test", "21b-test", "21c-test", "22-test"];
  var TOTAL = QUIZ.length;
  var FLOW = { "0-landing": "0b-proof", "0b-proof": "1-test", "22-test": "22a-profile", "22a-profile": "25-email", "25-email": "25a-name",
               "25a-name": "25b-plan-ready", "25b-plan-ready": "26-basic-plan-selection", "26-basic-plan-selection": "27-checkout-payments" };
  var COUNTER = {};
  QUIZ.forEach(function (id, i) { COUNTER[id] = i + 1; if (i < QUIZ.length - 1) FLOW[id] = QUIZ[i + 1]; });

  var DEFAULTS = {
    stage: "postmenopause", motive: "both", triggers: ["Stress", "Boredom"], answers: {},
    age: null, unit: "metric", heightFt: null, heightIn: null, heightCm: null,
    weightLbs: null, targetLbs: null, name: "", email: "", marketing: false
  };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function save(patch) {
    var s = Object.assign(load(), patch || {});
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    return s;
  }

  var STAGES = {
    perimenopause: { label: "Perimenopause", line: "Hormones start to swing, so weight can change even when habits don't." },
    menopause: { label: "Menopause", line: "Estrogen drops fast, and the body starts storing more fat around the middle." },
    postmenopause: { label: "Postmenopause", line: "Lower estrogen changes where your body stores fat and slows muscle repair." },
    unsure: { label: "Not sure yet", line: "Your plan starts gently and adjusts as we learn how your body responds." }
  };
  var MOTIVES = {
    looks: { label: "Feel like myself again", plan: "Feel like yourself again in your clothes", goal: "feeling like yourself again" },
    health: { label: "Better health", plan: "Less strain on your heart and joints, more energy", goal: "better health and more energy" },
    both: { label: "Health and confidence", plan: "More energy, and feeling like yourself again", goal: "more energy and feeling like yourself again" }
  };

  // ---------- Units and BMI ----------
  function heightInches(s) {
    if (s.unit === "metric") return s.heightCm ? s.heightCm / 2.54 : null;
    if (s.heightFt == null) return null;
    return s.heightFt * 12 + (s.heightIn || 0);
  }
  function bmi(lbs, inches) {
    if (!lbs || !inches) return null;
    return Math.round((703 * lbs / (inches * inches)) * 10) / 10;
  }
  function kg(lbs) { return Math.round(lbs * 0.45359237); }
  function lbsFromKg(k) { return Math.round(k / 0.45359237); }
  function fmtW(lbs, unit) { return unit === "metric" ? kg(lbs) + " kg" : Math.round(lbs) + " lbs"; }

  // Suggested goal: a 5-10% loss, never below BMI 18.5 (R-16).
  function suggestedTarget(s) {
    if (!s.weightLbs) return null;
    var t = Math.round(s.weightLbs * 0.92);
    var inch = heightInches(s);
    if (inch) { var min = Math.ceil(18.5 * inch * inch / 703); if (t < min) t = min; }
    return t;
  }

  // Realistic projection: about 1.5 lbs a week (R-21).
  function projection(s) {
    var from = s.weightLbs || 180, to = s.targetLbs || suggestedTarget(s) || Math.round(from * 0.92);
    var weeks = Math.max(4, Math.ceil((from - to) / 1.5));
    var end = new Date(); end.setDate(end.getDate() + weeks * 7);
    return { from: from, to: to, weeks: weeks, months: Math.max(1, Math.round(weeks / 4.345)), end: end };
  }
  function fmtDate(d) { return d.toLocaleDateString("en-US", { month: "long", day: "numeric" }); }
  function fmtMonth(d) { return d.toLocaleDateString("en-US", { month: "short" }); }

  // SVG projection chart, on the structure of the live funnel's chart: restrictive diets (fast drop, then the weight
  // comes back in waves, regain shaded above the dashed line) vs her plan (smooth loss to the goal, then it stays off).
  // Shapes are illustrative; the start and goal values are hers.
  function chartSVG(s, opts) {
    opts = opts || {};
    var p = projection(s), unit = s.unit;
    var W = 340, H = 236, xL = 6, xR = 334, yS = 78, yD = 128, yG = 168, yB = 198;
    function X(f) { return xL + (xR - xL) * f; }
    function smooth(pts) { // Catmull-Rom through the points, as cubic Béziers
      var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        d += " C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
      }
      return d;
    }
    var diet = smooth([[X(0), yS], [X(.1), yS + 6], [X(.3), yD + 4], [X(.46), yD - 32], [X(.62), yD + 10], [X(.78), yD - 44], [X(.88), yD - 2], [X(1), yS - 14]]);
    var fG = .45, xG = X(fG);
    var plan = "M" + X(0) + " " + yS + " C" + X(.16) + " " + yS + " " + X(.27) + " " + yG + " " + xG + " " + yG + " L" + (xR - 48) + " " + yG; // ends under the "YouthGenom" label
    var font = 'font-family="-apple-system, BlinkMacSystemFont, sans-serif"';
    // time labels: start, goal date, and a later date when the weight is still off
    var t0 = new Date(), tEnd = new Date(); tEnd.setDate(tEnd.getDate() + Math.round(p.weeks * 7 * (.85 - .12) / (fG - .12)));
    var vgrid = "";
    [.12, .3, fG, .62, .85].forEach(function (f) { vgrid += '<line x1="' + X(f) + '" x2="' + X(f) + '" y1="' + (yS + 14) + '" y2="' + yB + '"/>'; });
    var from = fmtW(p.from, unit), to = fmtW(p.to, unit), fw = Math.round(from.length * 8 + 26), tw = Math.round(to.length * 8 + 26);
    return '<svg class="rd-chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Your plan: from ' + from + " to " + to + " by " + fmtDate(p.end) + ', then the weight stays off. Restrictive diets: the weight drops fast, then comes back in waves.">' +
      '<defs><clipPath id="rdregain"><rect x="' + X(.3) + '" y="0" width="' + (xR - X(.3)) + '" height="' + yD + '"/></clipPath>' +
      '<filter id="rdsh" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1" stdDeviation="1.6" flood-color="#1f2622" flood-opacity=".22"/></filter></defs>' +
      '<g stroke="#e3ddd2" stroke-dasharray="3 4">' + vgrid + "</g>" +
      // regain above the dashed line, shaded
      '<path d="' + diet + " L" + xR + " " + yD + " L" + X(.3) + " " + yD + ' Z" fill="#fbe9e2" clip-path="url(#rdregain)"/>' +
      '<line x1="' + xL + '" x2="' + xR + '" y1="' + yD + '" y2="' + yD + '" stroke="#c8603f" stroke-width="1.4" stroke-dasharray="5 4" opacity=".8"/>' +
      '<path d="' + diet + '" fill="none" stroke="#c8603f" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="' + plan + '" fill="none" stroke="#245a40" stroke-width="4" stroke-linecap="round"/>' +
      // start: label + dark pill (the goal uses the same pill, so both weights read the same way; same style as the BMI "You" tag)
      '<text x="' + xL + '" y="20" ' + font + ' font-size="12" font-weight="600" fill="#4a4f4b">Your weight now</text>' +
      '<rect x="' + xL + '" y="28" width="' + fw + '" height="28" rx="14" fill="#1f2622"/>' +
      '<text x="' + (xL + fw / 2) + '" y="47" ' + font + ' font-size="13.5" font-weight="700" fill="#fff" text-anchor="middle">' + from + "</text>" +
      // restrictive diets label, top right
      '<rect x="' + (xR - 118) + '" y="28" width="118" height="26" rx="13" fill="#fbe9e2"/>' +
      '<text x="' + (xR - 59) + '" y="45.5" ' + font + ' font-size="12" font-weight="700" fill="#7a2c12" text-anchor="middle">Restrictive diets</text>' +
      // goal: dot on the line, pill below-left
      '<circle cx="' + xG + '" cy="' + yG + '" r="9" fill="#fff" filter="url(#rdsh)"/><circle cx="' + xG + '" cy="' + yG + '" r="5" fill="#245a40"/>' +
      '<rect x="' + (xG - tw - 10) + '" y="' + (yG + 8) + '" width="' + tw + '" height="28" rx="14" fill="#1f2622"/>' +
      '<text x="' + (xG - tw / 2 - 10) + '" y="' + (yG + 27) + '" ' + font + ' font-size="13.5" font-weight="700" fill="#fff" text-anchor="middle">' + to + "</text>" +
      // her plan label at the end of its line
      '<rect x="' + (xR - 96) + '" y="' + (yG - 13) + '" width="96" height="26" rx="13" fill="#e2efe5"/>' +
      '<text x="' + (xR - 48) + '" y="' + (yG + 4.5) + '" ' + font + ' font-size="12" font-weight="700" fill="#183f2d" text-anchor="middle">YouthGenom</text>' +
      '<g ' + font + ' font-size="12.5" font-weight="600" fill="#4a4f4b" text-anchor="middle">' +
      '<text x="' + X(.12) + '" y="' + (H - 10) + '">' + fmtMonth(t0) + "</text>" +
      '<text x="' + xG + '" y="' + (H - 10) + '" font-weight="800" fill="#1f2622">' + fmtMonth(p.end) + "</text>" +
      '<text x="' + X(.85) + '" y="' + (H - 10) + '">' + fmtMonth(tEnd) + "</text></g></svg>";
  }


  // BMI categories. Messages stay supportive (R-22); the colour coding follows the user's decision (2026-11-18).
  function bmiInfo(b) {
    if (b < 18.5) return { cls: "low", zone: 0, badge: "Below healthy", title: "Below the healthy range", text: "Your plan will help you build strength with balanced meals." };
    if (b < 25) return { cls: "ok", zone: 1, badge: "Healthy", title: "Healthy range", text: "A good starting point to tone up and feel more energetic." };
    if (b < 30) return { cls: "over", zone: 2, badge: "Above healthy", title: "Above the healthy range", text: "A steady, balanced plan is the proven way to lose weight and keep it off." };
    return { cls: "high", zone: 3, badge: "High", title: "Well above the healthy range", text: "Losing even 5–10% eases strain on your heart and joints." };
  }
  var BMI_ABOUT = "BMI is your weight divided by your height squared. It's a quick screening number, not a diagnosis: it doesn't see muscle, age or where you carry weight. Your dietitian looks at the whole picture.";
  function bmiAbout(btn, box) {
    box.textContent = BMI_ABOUT;
    btn.onclick = function () { var open = box.hidden; box.hidden = !open; btn.setAttribute("aria-expanded", open ? "true" : "false"); };
  }


  // BMI scale. Each zone keeps a fixed width (Under 17.5%, Healthy 32.5%, Over 25%, High 25%) and the value moves
  // inside its zone, so the dot is always in the zone the badge names. High covers 30–50.
  var BMI_STOPS = [[15, 0], [18.5, 17.5], [25, 50], [30, 75], [50, 100]];
  function bmiPct(b) {
    b = Math.min(50, Math.max(15, b));
    for (var i = 1; i < BMI_STOPS.length; i++) {
      var a = BMI_STOPS[i - 1], c = BMI_STOPS[i];
      if (b <= c[0]) return a[1] + (b - a[0]) / (c[0] - a[0]) * (c[1] - a[1]);
    }
    return 100;
  }
  function bmiScale(b0, b1) {
    // Same scale on steps 15 and 16: one dark label at today's BMI. On the goal screen the goal is a green dot
    // with a dashed trail from today's BMI; its zone label turns green when the goal reaches a better zone.
    var names = ["Under", "Healthy", "Over", "High"], widths = [17.5, 32.5, 25, 25];
    var z0 = bmiInfo(b0).zone, zg = b1 ? bmiInfo(b1).zone : -1;
    var at = "clamp(min(48px, 15%), " + bmiPct(b0).toFixed(1) + "%, max(calc(100% - 48px), 85%))";
    var h = '<div class="rd-scale" aria-hidden="true">';
    h += '<div class="rd-scale__nums"><span style="left:17.5%">18.5</span><span style="left:50%">25</span><span style="left:75%">30</span></div>';
    h += '<div class="rd-scale__track">';
    if (b1) {
      // The label may be pulled in from the edge, so the goal dot keeps at least 22px on the right side of it.
      var p1 = bmiPct(b1).toFixed(1) + "%", goal = b1 < b0
        ? "max(9px, min(" + p1 + ", calc(" + at + " - 22px)))"
        : "min(calc(100% - 9px), max(" + p1 + ", calc(" + at + " + 22px)))";
      var lo = b1 < b0 ? goal : at, hi = b1 < b0 ? at : goal;
      h += '<span class="rd-scale__trail" style="left:' + lo + ";right:calc(100% - " + hi + ')"></span><span class="rd-scale__dot rd-scale__dot--goal" style="left:' + goal + '"></span>';
    }
    h += '<span class="rd-scale__tag" style="left:' + at + '">You · ' + b0.toFixed(1) + "</span>" +
      '<span class="rd-scale__stem" style="left:' + at + '"></span><span class="rd-scale__dot" style="left:' + at + '"></span>';
    h += "</div>";
    h += '<div class="rd-scale__zones">' + names.map(function (n, i) {
      var st = ' style="width:' + widths[i] + '%"';
      if (i === z0) return "<b" + st + ">" + n + "</b>";
      if (i === zg) return '<b class="rd-scale__zone--goal"' + st + ">" + n + "</b>";
      return "<span" + st + ">" + n + "</span>";
    }).join("") + "</div></div>";
    return h;
  }
  function bmiMsg(b) {
    var i = bmiInfo(b), icon = i.cls === "ok" ? "✓" : "!";
    return '<div class="rd-bmimsg rd-bmimsg--' + i.cls + '"><span class="rd-bmimsg__icon" aria-hidden="true">' + icon + '</span><div><p class="rd-bmimsg__title">' + i.title + '</p><p class="rd-bmimsg__text">' + i.text + "</p></div></div>";
  }

  // ---------- Page chrome ----------
  // The brand's own logo from the live funnel (R-29: keep the brand recognisable), not a redrawn mark.
  var LOGO = '<span class="rd-logo"><img src="/youthgenom-funnel-redesign/prototype/us-en/g1-22m-usd/img/logo-youthgenom.svg" alt="YouthGenom" width="138" height="38"></span>';
  var BACK = '<button class="rd-back" type="button" aria-label="Back" onclick="history.back()"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>';

  var ACCOUNT = '<a class="rd-account" href="/youthgenom-funnel-redesign/prototype/us-en/g1-22m-usd/login/" aria-label="Log in to your account"><span class="rd-account__ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4.2"/><path d="M3.8 21c.6-4.4 4-7.2 8.2-7.2s7.6 2.8 8.2 7.2c.05.5-.3.9-.8.9H4.6c-.5 0-.85-.4-.8-.9z"/></svg></span></a>';
  function header(step, opts) {
    opts = opts || {};
    var el = document.querySelector("[data-rd-header]");
    if (!el) return;
    // opts.account: profile button on the right that opens the login page (returning users), as on the live landing.
    var right = opts.account ? ACCOUNT : '<span class="rd-header__spacer"></span>';
    var html = '<div class="rd-header">' + (opts.noBack ? '<span class="rd-header__spacer"></span>' : BACK) + LOGO + right + "</div>";
    var n = COUNTER[step];
    if (n) {
      html += '<div class="rd-progress" aria-label="Question ' + n + ' of ' + TOTAL + '"><div class="rd-progress__bar"><div class="rd-progress__fill" style="width:' + Math.round(n / TOTAL * 100) + '%"></div></div><span class="rd-progress__count">' + n + ' / ' + TOTAL + '</span></div>';
    }
    el.innerHTML = html;
  }

  function next(step) { location.href = BASE + (FLOW[step] || "0-landing") + "/"; }

  // Screen transitions (see rd.css): going back through history plays the slide the other way.
  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
    try {
      var a = window.navigation && navigation.activation;
      var back = a && a.navigationType === "traverse" && a.from && a.entry && a.entry.index < a.from.index;
      e.viewTransition.types.add(back ? "back" : "forward");
    } catch (x) {}
  });

  // ---------- Honest timer: one deadline per user, keeps running across reloads, stops at zero (R-39) ----------
  // onTick(m, s) is optional: lets a page show minutes and seconds separately.
  function timer(el, minutes, onEnd, onTick) {
    var k = "yg_rd_deadline", dl;
    try { dl = parseInt(localStorage.getItem(k), 10); } catch (e) {}
    if (!dl) { dl = Date.now() + minutes * 60000; try { localStorage.setItem(k, String(dl)); } catch (e) {} }
    function tick() {
      var left = Math.max(0, dl - Date.now()), m = Math.floor(left / 60000), sec = Math.floor(left % 60000 / 1000);
      el.textContent = (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec;
      if (onTick) onTick(m, sec);
      if (left <= 0) { clearInterval(id); if (onEnd) onEnd(); }
    }
    var id = setInterval(tick, 1000); tick();
  }


  // Carousels feel like Apple's: one card per swipe (CSS snap), the side cards sit slightly smaller so the centre one
  // reads as "closer", and the dots glide. No autoplay: she reads at her own pace (decided 2026-11-20).
  // opts.hint: once per session, 1.5 s after the carousel is in view and untouched, the cards slide left a little and
  // spring back to show there is more to swipe. Nothing moves on its own for "Reduce motion" users.
  function carousel(car, opts) {
    opts = opts || {};
    var cards = car.children;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function depth() {
      if (reduce) return;
      var c = car.getBoundingClientRect(), mid = c.left + c.width / 2, ds = [], min = 1;
      for (var i = 0; i < cards.length; i++) {
        var r = cards[i].getBoundingClientRect(); ds[i] = Math.abs(r.left + r.width / 2 - mid) / r.width; min = Math.min(min, ds[i]);
      }
      // The first and last cards snap off-centre, so distances count from the closest card: it is always full size.
      for (var j = 0; j < cards.length; j++) cards[j].style.transform = "scale(" + (1 - 0.05 * Math.min(1, ds[j] - min)).toFixed(4) + ")";
    }
    car.addEventListener("scroll", function () { requestAnimationFrame(depth); }, { passive: true });
    window.addEventListener("resize", depth);
    depth();
    if (!opts.hint || reduce || !window.IntersectionObserver || !Element.prototype.animate) return;
    var key = "yg_rd_hint_" + opts.hint, seen = null, touched = false;
    try { seen = sessionStorage.getItem(key); } catch (e) {}
    if (seen) return;
    ["pointerdown", "touchstart", "wheel", "keydown"].forEach(function (ev) { car.addEventListener(ev, function () { touched = true; }, { passive: true }); });
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      setTimeout(function () {
        if (touched || car.scrollLeft > 4) return;
        try { sessionStorage.setItem(key, "1"); } catch (e) {}
        Array.prototype.forEach.call(cards, function (card) {
          card.animate([
            { translate: "0 0", easing: "cubic-bezier(.3,0,.2,1)" },
            { translate: "-48px 0", offset: 0.4, easing: "cubic-bezier(.34,1.35,.64,1)" },
            { translate: "0 0" }
          ], { duration: 1200 });
        });
      }, 1500);
    }, { threshold: 0.6 });
    io.observe(car);
  }

  window.RD = {
    BASE: BASE, load: load, save: save, next: next, header: header, timer: timer,
    STAGES: STAGES, MOTIVES: MOTIVES, heightInches: heightInches, bmi: bmi, kg: kg, lbsFromKg: lbsFromKg,
    fmtW: fmtW, bmiInfo: bmiInfo, bmiAbout: bmiAbout, bmiScale: bmiScale, bmiMsg: bmiMsg, suggestedTarget: suggestedTarget, projection: projection, fmtDate: fmtDate, chartSVG: chartSVG, carousel: carousel
  };
})();
