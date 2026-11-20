# Developer spec: YouthGenom funnel redesign

What a developer needs beyond the screens: the flow, the data, the rules behind every calculated value, the behaviour of each screen, motion, accessibility, analytics and acceptance criteria.

**Three sources, one answer each**

| Question | Source of truth |
|---|---|
| Layout, spacing, components, colours, type | [Figma](https://www.figma.com/design/rxztXnVOVBVCafGuib4Uy0/YouthGenom-Design) (screens at 375 × 812, every state, notes next to the screens) |
| Behaviour, timing, motion, edge cases | The [clickable prototype](https://tasiapylypenko.github.io/youthgenom-funnel-redesign/prototype/us-en/g1-22m-usd/0-landing/) and its [source](../prototype/) |
| Rules, data, analytics, acceptance criteria | This document |

The copy in Figma and the prototype is the same. Prices, plans and discounts are today's live ones and must come from billing, not from the design (§6.6).

**Contents**

1. [Scope](#1-scope)
2. [Flow and navigation](#2-flow-and-navigation)
3. [Data](#3-data)
4. [Design system](#4-design-system)
5. [Questions and inputs](#5-questions-and-inputs)
6. [Calculated screens and the paywall](#6-calculated-screens-and-the-paywall)
7. [Motion](#7-motion)
8. [Accessibility](#8-accessibility)
9. [Analytics](#9-analytics)
10. [Acceptance criteria](#10-acceptance-criteria)
11. [Prototype-only, don't ship](#11-prototype-only-dont-ship)
12. [Open items](#12-open-items)

---

## 1. Scope

| Route | Change |
|---|---|
| `0-landing` | Rebuilt: value first, "Where are you in menopause?" as 4 tiles (one tap moves on) |
| `0b-proof` | **New:** the user count as a large figure, photo of women 50+ |
| `1-test` … `11c-test`, `21-test` … `21c-test` | Rewritten copy, one question per screen (old steps 2, 11 and 21 are split), one answer component, Continue on every question |
| `5-test`, `8-test`, `13-test`, `22-test` | Rebuilt info screens: dietitian, real member stories, how it works, sourced hormone chart |
| `12-test`, `14-test`, `15-test`, `16-test` | Inputs with errors that state the rule; BMI on weight and goal; no pre-filled goal |
| `22a-profile` | **New:** her projection and "What to expect" |
| `25-email` | Rebuilt: a reason to leave an email, a separate marketing checkbox |
| `25a-name` | **New position:** the name moves here from the quiz |
| `25b-plan-ready` | **New:** loader, then "Your plan is ready" |
| `26-basic-plan-selection` | Rebuilt paywall (§6.5–6.9) |
| `login` | Restyled, same functions as today |
| Removed | `17-name` (moved to `25a-name`), `18-test` (BMI verdict), `19-test` and `23-test` (charts), `20-test` (biological age), `24-test` |
| Not redesigned | `27-checkout-payments`, `28-basic-thank-you` |

---

## 2. Flow and navigation

**Order:** landing → proof → 23 quiz steps → profile → email → name → plan ready → paywall → checkout.

| Counter | Route | Screen |
|---:|---|---|
| — | `0-landing` | Value + "Where are you in menopause?" |
| — | `0b-proof` | 2,000,000+ plans created |
| 1 | `1-test` | When did you last feel at your best weight? |
| 2 | `2-test` | What matters most to you about losing weight? (her motive) |
| 3 | `2b-test` | Anything else you'd like to improve? |
| 4 | `3-test` | Ways of eating |
| 5 | `4-test` | Food allergies |
| 6 | `5-test` | Info: the dietitian |
| 7 | `6-test` | Exercise per week |
| 8 | `7-test` | Which of these sound familiar? |
| 9 | `8-test` | Info: real member stories |
| 10 | `9-test` | What makes you reach for a snack? |
| 11 | `10-test` | Health conditions |
| 12 | `11-test` | Mood swings |
| 13 | `11b-test` | Working hours |
| 14 | `11c-test` | Cooking |
| 15 | `12-test` | Age |
| 16 | `13-test` | Info: how it works |
| 17 | `14-test` | Height (and the unit for the rest of the flow) |
| 18 | `15-test` | Current weight + BMI |
| 19 | `16-test` | Goal weight + feedback + BMI change |
| 20 | `21-test` | Hot flashes or night sweats |
| 21 | `21b-test` | Drier skin |
| 22 | `21c-test` | Hormone therapy |
| 23 | `22-test` | Info: hormone chart, "You are here" |
| — | `22a-profile` | Her projection |
| — | `25-email` | Email |
| — | `25a-name` | First name |
| — | `25b-plan-ready` | Loader, then "Your plan is ready" |
| — | `26-basic-plan-selection` | Paywall |

- **Header:** back · logo · account button (landing only) or an empty slot. No back button on the landing and the proof screen. Back goes to the previous screen in history. The account button opens `login`. The progress bar and "N / 23" show only on the 23 quiz steps.
- **Progress:** every quiz step counts, info screens included (the dietitian screen is 6 / 23). The fill is N ÷ 23 of the bar.
- **Moving on:** the landing moves on 300 ms after a tile is tapped; it's the only screen without a Continue button. Every other question needs Continue, so a mis-tap isn't locked in.
- **Sticky button:** on a phone the CTA bar is fixed to the bottom and the content scrolls under it (Figma draws it at the end of the frame).

---

## 3. Data

### 3.1 What the quiz collects

The prototype keeps the state in the browser; production keeps it with the session. Names are the prototype's.

| Field | Values | Set on | Used on |
|---|---|---|---|
| `stage` | `perimenopause` · `menopause` · `postmenopause` · `unsure` | landing | hormone chart, profile line, plan-ready tiles |
| `motive` | `looks` · `health` · `both` | 2-test | profile line, paywall headline |
| `answers[questionId]` | `{ values: string[], other: string }` for every question; `other` is the "Something else" text | every question | plan-ready tiles (allergies, exercise), analytics |
| `triggers` | snack triggers in **tap order**, exclusive answer removed; `[]` for "I don't snack". Screens that name a trigger skip "Something else" | 9-test | profile line, plan-ready tile |
| `age` | whole number 18–100 | 12-test | — |
| `unit` | `metric` · `imperial` | 14-test | every weight on later screens |
| `heightCm` / `heightFt` + `heightIn` | 120–215 cm, or 4′0″–7′0″ | 14-test | BMI, goal range |
| `weightLbs`, `targetLbs` | always stored in lbs (see below) | 15-test, 16-test | BMI, goal, projection, paywall |
| `email`, `marketing` | trimmed string; `false` unless she ticks the box | 25-email | login prefill, follow-up emails |
| `name` | first letter upper-cased | 25a-name | plan ready, paywall |
| `plan` | `m6` · `m3` · `m1`, default `m6` | paywall | checkout |
| `superDiscount` | `true` once she applies the extra discount | paywall | prices |

**Rules**

- **Units:** a weight is stored in one unit and shown in hers, rounded to a whole kg or lb. The prototype stores lbs and rounds metric input to whole lbs. **Default units follow her region in production** (kg / cm or lbs / ft-in); the prototype opens in kg / cm. Screens before the height step (e.g. results on the stories screen) use the default unit.
- **A changed current weight clears the goal** (the same weight keeps it). A new height doesn't.
- **"Not sure" stage** is left out of the profile line, shows "your stage of menopause" on plan ready, and gets no "You are here" band on the hormone chart.
- **Missing data:** if a screen opens without the data it needs, it falls back to safe defaults instead of breaking. In production, a screen that needs data she hasn't given should send her back to the step that asks for it.

### 3.2 Timer and session flags

| What | Kept | Rule |
|---|---|---|
| Discount deadline | Per user, across reloads and visits | Set on her **first** paywall view: now + 10 minutes. Never reset for real users. |
| Extra-discount pop-up shown | Per session | Opens at most once per session |
| Swipe hint shown | Per session | Plays at most once per session |

---

## 4. Design system

Everything is in Figma as variables, text styles and components. Use the semantic tokens, never the primitives directly.

### Colour (semantic tokens)

| Group | Tokens |
|---|---|
| Background | `bg/page` #F7F5F0 · `bg/surface` #FFFFFF · `bg/subtle` #F3EBDD · `bg/subtle-strong` #EADBC4 · `bg/brand` #245A40 · `bg/brand-hover` #183F2D · `bg/brand-soft` #CFE0D4 · `bg/success-soft` #EEF4EF · `bg/danger` #8E2614 · `bg/danger-soft` #FBE9E2 · `bg/warning` #F2C14E · `bg/warning-strong` #6B4300 · `bg/info` #1F4E79 · `bg/accent` #5A3B1E · `bg/accent-medium` #8C6239 · `bg/inverse` #1F2622 · `bg/disabled` #E3DDD2 · `bg/control` #8A8378 · `bg/progress-fill` #D4B48A |
| Text and icons | `text/primary` #1F2622 · `text/secondary` #4A4F4B · `text/brand` #245A40 · `text/accent` #5A3B1E · `text/on-brand` #FFFFFF · `text/danger` #8E2614 · `text/warning` #6B4300 |
| Border | `border/default` #E3DDD2 · `border/strong` #C9BFAE · `border/hover` #D4B48A · `border/selected` #8C6239 · `border/control` #8A8378 · `border/control-checked` #5A3B1E · `border/danger` #8E2614 · `border/brand` #245A40 · `border/brand-medium` #5F9676 · `border/brand-soft` #CFE0D4 |

### Spacing, radius, layout

Spacing 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40. Radius 12 (s) · 16 (m) · 24 (l) · pill. Side gutter 16 px; content max width 480 px; CTA height 56 px. Designed at 375 px and checked at 320 px.

### Type

| Style | Font | Size / line height |
|---|---|---|
| Heading / Title L · Title · Section | Young Serif | 31 · 27 · 22 px, 122–125% |
| Number / XL · L | Young Serif | 54 · 40 px, 100% |
| Body / Regular · Semibold · Strong | System UI (SF Pro on Apple, Roboto on Android) | 16 px |
| Body / Small · Small Bold · Caption · Large | System UI | 14 · 14 · 12 · 22 px |
| Label / Eyebrow · Badge · Micro | System UI, bold to heavy | 12 · 12 · 10 px |

Young Serif is a web font (in `prototype/us-en/g1-22m-usd/fonts/`); body text uses the system font, which Figma shows as SF Pro.

### Components

Header (progress, back, profile) · Progress bar · Answer option (list / tile, single / multi, default / hover / selected) · Selection control (radio, checkbox, consent, plan radio) · Button (primary / secondary / text; default, hover, pressed, focus, disabled; large / small) · CTA bar · Input field (number, text, password, multiline; empty, focus, valid, error, filled) · Segmented control · Message (error, warning, success, info) · Badge (7 tones, solid / soft, default / small) · BMI card and BMI chart · Goal feedback card · Weight projection chart · Hormone chart · Review story · Dietitian card · Plan card · Plan picker · Bonus card · Discount banner (running / ended) · Bottom sheet (extra discount) · Guarantee card · FAQ item · Steps card and plan step slider · Feature tile · Trust tile · Pagination dots · Notice · List item · Step item · Avatars row · Icons.

**States:** every interactive element has default, pressed, focus and disabled; inputs also valid and error. **Enabled and disabled buttons must look clearly different**, also in greyscale.

---

## 5. Questions and inputs

### 5.1 Questions

| Behaviour | Rule |
|---|---|
| Single choice | A tap selects; Continue confirms. Re-tapping keeps it selected. |
| Multiple choice | A tap toggles. |
| Exclusive answers | "None of these", "I eat everything", "Not sure / none of these", "I don't snack", "I don't like cooking at all": picking one clears the others, and picking any other clears it. |
| "Something else" | Opens an optional text field ("Tell us more (optional)", 200 characters max), focused when it opens. Continue works with it empty. When the keyboard opens, scroll the field into view so it isn't covered. Answers are logged and reviewed monthly to find missing options. |
| Continue | Disabled until something is picked. |
| Allergies (5 / 23) | The 9 major allergens (FDA, US) plus "Something else", in two columns. "I don't have food allergies" is a separate button that moves on without a pick. |
| Coming back | Previous answers and the "Something else" text are restored. |

The questions and every answer are in each page's `window.Q` and in Figma.

### 5.2 Landing tiles

Four stage tiles, nothing pre-selected; a tap saves the stage and moves on after 300 ms.

**Long titles (small screens and translations).** Words never break and the font never shrinks. Check the longest title and use one layout for all four tiles:

1. It fits beside the radio: as designed.
2. It doesn't: the radio stays top-right and the titles move to their own row below it.
3. Still too long: one tile per row.

Hints wrap freely, and tiles in a row keep the same height. In English, step 2 only happens on 320 px screens. Re-check when fonts load and on resize.

### 5.3 Inputs and validation

An error never shows on the first keystroke: each field waits for blur or a minimum length. Continue stays disabled while the value is invalid. The error wraps under the field and never widens it; the field keeps what she typed. A valid value gets the valid state.

| Field | Keyboard | Rule | Error shows | Error text |
|---|---|---|---|---|
| Age | numeric | whole number 18–100 | on blur, or after 2 characters | "Age must be a whole number from 18 to 100." |
| Height, cm | numeric | 120–215 | on blur, or after 3 characters | "Height must be between 120 and 215 cm." |
| Height, ft / in | numeric | 4′0″–7′0″; inches 0–11, empty inches = 0 | on blur, or once both are filled | "Height must be between 4′0″ and 7′0″. Inches go from 0 to 11." |
| Weight | decimal | 35–250 kg or 80–550 lbs, one decimal at most, comma accepted | on blur, or after 3 characters | "Weight must be between 35 and 250 kg." / "…80 and 550 lbs." |
| Goal weight | decimal | from BMI 18.5 for her height to below her current weight (the check runs in whole lbs: at most 1 lb below) | on blur, or after 3 characters | "Goal weight must be between {min} and {max} {unit}: below your current weight and within a healthy range for your height." |
| Email | email | `name@domain.tld`, trimmed | on blur only | "Enter an email like name@example.com." |
| First name | text, capitalised words | 2–30 characters, starts with a letter; letters, spaces, apostrophes, hyphens | on blur, or as soon as an invalid character is typed | "Use letters only, 2 to 30 characters." |

- **Goal range in the error text:** show values the check really accepts. When the check runs in a different unit from the one shown, round the bounds inwards (e.g. 168 cm, 82 kg → "between 53 and 81 kg").
- **Units on the height step:** a "cm / ft in" switch. Switching converts the value already typed. The weight unit follows the height unit (cm → kg, ft / in → lbs) for the rest of the flow. One digit in feet moves focus to inches.
- **Goal step:** never pre-filled. The placeholder is about 8% below her current weight.
- **Email step:** the marketing checkbox ("Send me tips, recipes and offers by email") is separate and unticked; pressing "Get my plan" doesn't opt her in. A long address scrolls inside the field; trim spaces before checking.
- **Enter** submits age and name when valid.

---

## 6. Calculated screens and the paywall

### 6.1 BMI (weight and goal steps)

`BMI = 703 × lbs ÷ inches²`, one decimal. Shown under the weight field once both her height and a valid weight are known.

| BMI | Badge | Message |
|---|---|---|
| under 18.5 | Below healthy | **Below the healthy range.** Your plan will help you build strength with balanced meals. |
| 18.5 – 24.9 | Healthy | **Healthy range.** A good starting point to tone up and feel more energetic. |
| 25 – 29.9 | Above healthy | **Above the healthy range.** A steady, balanced plan is the proven way to lose weight and keep it off. |
| 30 and over | High | **Well above the healthy range.** Losing even 5–10% eases strain on your heart and joints. |

**The scale:** four zones with fixed widths (17.5% · 32.5% · 25% · 25%) and ticks at 18.5, 25 and 30, so the dot always sits in the zone the badge names. BMI is clamped to 15–50 and placed linearly inside its zone. The "You · 29.1" label keeps inside the card near the edges and never covers the tick numbers (Figma puts the numbers under the track). "About Body Mass Index (BMI)" expands a short explanation.

### 6.2 Goal feedback

As she types a valid goal, a card shows `share = round((1 − goal ÷ current) × 100)` and the difference in her unit.

| Share | Tag | Style | Text |
|---|---|---|---|
| up to 5% | Easy win | green | "5–10% is a good rule of thumb: enough to feel the difference, and realistic to keep." |
| up to 10% | A healthy goal | green | same |
| up to 15% | It takes some effort | amber | "That's more than the usual 5–10% first step. Your plan can start there and keep going." |
| over 15% | An ambitious goal | amber | same |

Under it, her BMI scale shows today's dot, a green goal dot and a dashed trail between them. The goal's zone label turns green when it's a different zone.

**Nothing to lose.** If her current weight is already at or below BMI 18.5 for her height, no goal range exists. Don't show an error: hide the field, say "Your weight is already at the lower end of the healthy range for your height, so there's no weight to lose.", show a "Keep it steady" card ("Your plan will keep your weight steady" · "It focuses on strength, energy and balanced meals instead of weight loss.") with her BMI, and let her continue with her current weight as the goal. Later screens follow: the profile says "Keep {weight} steady" with a flat line on the chart, plan ready says "kept steady", and the paywall shows the same figure twice, "steady" instead of a difference and the headline "Your plan for more energy and strength".

### 6.3 Projection (profile, plan ready, paywall)

- **Pace:** about 0.7 kg (1.5 lbs) a week; at least 4 weeks. The goal is never above her current weight. Goal date = today + weeks. Months = weeks ÷ 4.345, rounded, at least 1.
- **Copy:** "Reach {goal} by {Month D}" and "About 0.5–1 kg a week" / "About 1–2 lbs a week".
- **Chart:** an illustration of two trends, not her data: restrictive diets (drops, then comes back above the start) and YouthGenom (reaches her goal, then stays). Month labels: today's month, the goal month (bold) and a later month. Long month names and 3-digit weights must still fit, and the weight pills can't overlap the line.
- **"What to expect":** Weeks 1–2 (cravings calm down; "Meals and snacks are timed to your {first snack trigger} moments", or "…timed to your day." without one), Weeks 3–6, then "Week {n}" (goal within about 6 weeks), "Month 2" or "Months 2–{n}": "Reach {goal}".
- **Profile line:** "Built from your answers: {stage}, {first trigger} snacking, {motive}." Each part is left out if it's missing (the stage when she isn't sure).

### 6.4 Plan ready

1. **Loader** about 7 s (2.4 s with reduced motion): a percentage and four steps ("Analyzing your answers", "Matching meals to your stage", "Choosing workouts for your level", "Setting up your dietitian review"). The button reads "Creating your plan…" and is disabled.
2. **Ready:** "{Name}, your plan is ready!" ("Your plan is ready!" without a name; up to about 20 characters wraps to 2 lines, longer names are cut with an ellipsis) and "Your plan includes":
   - **Goal:** "{goal} by {date} · about 0.5–1 kg a week".
   - **Meals:** "Meals for {her stage}" · "Without {up to 3 allergens}" (+ "and more"), or "Easy everyday recipes".
   - **Snacks:** "Snacks for cravings" · from her first two triggers other than "Something else" ("When you're stressed or bored"), or "A steady meal rhythm" · "So hunger doesn't build up".
   - **Movement:** from her exercise answer: "Gentle workouts", "Walking workouts" or "Strength workouts".
   - **Dietitian review** · "Adjusts as your body responds".
   - The button becomes "See my plan".

### 6.5 Paywall: order of blocks

Discount block → header → now / your goal → headline → plans ("Select your plan") → guarantee → dietitian and media logos → real reviews → how your plan works + key facts → FAQ → plans again ("Start today") → guarantee → footer.

- **Now / your goal:** her weight now, the difference and her goal, in her unit.
- **Headline by motive:** health "Lose weight for better health" · looks "Lose weight and feel like yourself again" · both "Lose weight for more energy and confidence" · unknown "Get your personal weight loss program". Under it: "Over 2 million plans created!".

### 6.6 Plans and prices

**Prices, discounts and per-day values come from billing.** The table is today's live offer, used in the design as is.

| Plan | Default (75% off) | After the extra discount | Timer over |
|---|---|---|---|
| **6-month** (pre-selected, "Most popular") | ~~$144.00~~ $36.00 · $0.21 a day · −75% | $30.00 · $0.18 a day · −80% | $144.00 · $0.86 a day, no tag |
| 3-month | ~~$57.96~~ $28.92 · $0.34 a day · −50% | $24.00 · $0.29 a day · −59% | $57.96 · $0.69 a day |
| 1-month | ~~$44.00~~ $22.00 · $0.79 a day · −50% | $18.00 · $0.64 a day · −59% | $44.00 · $1.57 a day |

- Per day = price ÷ days (168 · 84 · 28). The saving tag is solid on the chosen plan and quiet on the others. Long localised plan names wrap; the price box keeps its width.
- **Terms under the first button:** "Today {price} for the {plan}. Renews {every 6 months} at the regular price unless you cancel. Cancel anytime in your account."
- **Why 6 months:** "Your goal takes about {n} months. The 6-month plan covers it, with time to keep the weight off." For goals over 6 months: "The 6-month plan gets you most of the way, at the lowest price per day."
- **Bonus:** the *Menopause Recipe Guide* is joined to the 6-month card with a "+". With another plan picked it stays visible but dimmed: "Free with the 6-month plan only." and a "Switch to the 6-month plan" link that selects it.
- Both plan panels show the same selection.

### 6.7 T&C checkbox and buttons

- One checkbox per plan panel ("I agree with the T&Cs and Privacy Policy"), kept in sync, unticked on every load.
- "Get my plan" with the box unticked: shows "Please agree to continue" under the checkbox of that panel, scrolls it to the centre and doesn't go on. For the sticky button, use the checkbox nearest to the screen centre. Ticking hides the error.
- **Sticky "Get my plan" bar:** shown only between the two in-page buttons (the first has scrolled above the screen and the last is still below it), so two plan buttons never show at once.

### 6.8 Timer

- **One discount element** at the top: "{Name}, your 75% discount is reserved", a large mm : ss timer with "minutes" and "seconds", a "Get now" button that scrolls to the plans, and a thin bar that shrinks with the time left. It scrolls away with the page.
- **10 minutes from her first paywall view**, kept across reloads and visits. It never restarts.
- **At zero the discount really ends:** the label becomes "Discount time is up", the strip "{Name}, your plan is still ready for you", plans show regular prices with no tags and no struck prices, an open pop-up closes, and the pop-up can't open again. If the time ran out while she was away, the page opens in this state.

### 6.9 Extra-discount pop-up

- A bottom sheet: "Extra discount", "80% off your 6-month plan", the price per day, "$30.00 today instead of $36.00", "Reserved for you while your discount timer runs.", "Apply 80% discount" and "No thanks". Its prices come from billing too.
- **Opens once per session, 1.2 s after 30% of the reviews section is on screen, and only while the timer runs** and the extra discount isn't applied yet. Check that the reviews are still on screen when it opens.
- Closes on "No thanks", a tap outside or Escape. **Applying** switches every plan to the extra-discount prices (the selection stays), saves it for later visits, closes the sheet and scrolls to the plans.
- Focus moves into the sheet when it opens and back where it was when it closes; keep focus inside while it's open.
- The gift's lid opens once as the sheet slides up; no looping animation.

### 6.10 Other blocks

- **Guarantee** (twice): "30-day money-back guarantee. Get 100% of your money back if you don't see visible results after following your program."
- **Dietitian:** the same person as on 6 / 23, compact (photo, name, "Certified dietitian · women's health and menopause", a one-line quote). The name in the design is a placeholder.
- **Reviews** and **how your plan works**: swipe carousels (§7).
- **Key facts:** Cancel anytime · Supports women with cancer · Less than a coffee a day.
- **FAQ:** an accordion of three questions.

### 6.11 Login

- Email (prefilled if she left one) and password with a show / hide toggle. Errors: "Enter an email like name@example.com.", "Enter your password.", "That email and password don't match. Try again or reset your password."
- "Forgot your password?" opens the reset view: "Reset your password", then "Check your inbox" / "If an account exists for {email}, a reset link is on its way." Never say whether an account exists.

---

## 7. Motion

| What | Behaviour |
|---|---|
| Screen change | Forward: the old screen fades out moving 32 px left, the new one comes in from 48 px right; back is mirrored. 420 ms, `cubic-bezier(.32,.72,0,1)`. The header, progress bar and CTA bar stay in place; the progress fill grows. Browsers without view transitions just change the page. |
| Progress fill | width, 300 ms |
| Landing tap | moves on after 300 ms |
| Carousels (stories, paywall reviews, plan steps) | One card per swipe, snapping to the centre. Cards are 86% wide with a 12 px gap; side cards sit at 95% and grow as they reach the centre. The active dot widens from 10 to 24 px (350 ms). A dot tap scrolls to its card. **No autoplay:** she reads at her own pace. |
| Swipe hint (stories screen only) | Once per session: 1.5 s after the carousel is at least 60% on screen and untouched, the cards slide 48 px left and spring back (1.2 s). Not on the paywall: she has already learned the gesture. |
| Plan-ready loader | §6.4 |
| Paywall | Timer bar 1 s linear per tick; sticky bar 250 ms; sheet 280 ms; three "now → goal" chevrons pulse in turn |

**Reduced motion:** no screen-change animation, no card scaling, no swipe hint, no chevron or gift animation, a short loader (2.4 s), and no smooth scrolling. Spinners show a static state.

---

## 8. Accessibility

- **Text contrast 7:1 or more** on its background; tap targets 48 px or more; body text 16 px.
- Answers are radio buttons or checkboxes in a group with the question as its label; the selected state is announced.
- Errors are linked to their field (`aria-describedby`) and announced (`role="alert"`). Never rely on colour alone: every error has an icon and text.
- The progress bar has a label ("Question N of 23").
- The pop-up is a modal dialog: focus moves in, stays in and returns (§6.9).
- Carousels can be used with a keyboard and a screen reader: dots are buttons ("Story 1"); the cards are readable without swiping.
- Charts have a text alternative that states her numbers (e.g. "Your plan: from 82 kg to 75 kg by February 4, then the weight stays off").

---

## 9. Analytics

Today's data counts page visits, so revisits inflate some steps. Track sessions, not just page views.

| Event | Properties | Answers |
|---|---|---|
| `funnel_step_view` | `step_id`, `session_id`, `is_revisit` | Real drop-off per step |
| `answer_selected` | `step_id`, `answer_ids[]` | Which answers predict leaving |
| `other_text_submitted` | `step_id`, `text` | Missing options (reviewed monthly) |
| `back_clicked` | `from_step` | Why visits rise on input steps |
| `validation_error` | `step_id`, `field`, `rule` (no raw values) | Which rules trip people up |
| `unit_changed` | `from`, `to` | — |
| `info_screen_time` | `step_id`, `ms_on_screen` | Which info screens get skipped |
| `email_submitted` | `marketing_optin` | Lead conversion |
| `plan_ready_viewed` | — | — |
| `paywall_viewed` | `motive`, `timer_state` | — |
| `plan_selected` | `plan_id` | Plan mix, order value |
| `bonus_switch_clicked` | — | Does the bonus move the mix |
| `extra_discount_shown` / `_applied` / `_dismissed` | — | The pop-up test |
| `timer_ended_on_paywall` | — | Purchases after the discount ended |
| `tc_error_shown` | `button` (top, bottom, sticky) | — |
| `checkout_started` | `plan_id`, `price` | Plan page → checkout |
| `payment_failed` | `method`, `reason_code` | Checkout research |
| `purchase` | `plan_id`, `value` | — |

Segment everything by ad creative (`utm_campaign`), OS, browser, new vs returning visitors and `unit`.

---

## 10. Acceptance criteria

**Flow**
- [ ] Every quiz question is on its own screen and shows "N / 23"; info screens count as steps.
- [ ] Only the landing moves on after a tap; every other question needs Continue, which is disabled until something is picked.
- [ ] No screen before the email asks for or shows her name.
- [ ] There is one weight projection chart in the funnel (the profile); no second weight chart anywhere.

**Questions and inputs**
- [ ] Exclusive answers clear the others, and the others clear them.
- [ ] Every "Something else" opens an optional text field; leaving it empty never blocks Continue.
- [ ] No error shows on the first keystroke; every error states the rule and the allowed range, in her unit.
- [ ] Every number in the goal error text is accepted when typed.
- [ ] The goal is never pre-filled; a new current weight clears it.
- [ ] Switching cm ↔ ft / in converts the typed value; later screens use her unit.
- [ ] Pressing the email button doesn't opt her in to marketing; only the checkbox does.
- [ ] Landing tiles follow the long-title rule from 320 px up; no title breaks or overflows.

**Calculated values**
- [ ] BMI, the badge and the dot's zone always agree.
- [ ] The goal tag follows the share thresholds (5 / 10 / 15%).
- [ ] No claim anywhere of more than 1 kg (2 lbs) a week.
- [ ] Wherever they appear (profile, plan ready, paywall), the goal, the date and the difference match.

**Paywall**
- [ ] The timer starts on the first paywall view, survives reloads and never restarts.
- [ ] At zero: regular prices, no tags, "your plan is still ready for you", and no pop-up.
- [ ] The pop-up opens at most once per session, only while the timer runs, and never after the extra discount is applied.
- [ ] Both checkboxes stay in sync; an unticked "Get my plan" shows the error at the right checkbox and doesn't go on.
- [ ] Two "Get my plan" buttons are never on screen at once.
- [ ] The bonus is dimmed for the 3- and 1-month plans and the switch link selects the 6-month plan.
- [ ] All prices come from billing and match checkout.

**Quality**
- [ ] Enabled and disabled buttons can be told apart in a greyscale screenshot.
- [ ] Text contrast is 7:1 or more; tap targets are 48 px or more.
- [ ] With reduced motion on, nothing moves on its own.
- [ ] Every analytics event fires once per action and shows in the debug view.
- [ ] Largest contentful paint under 2.5 s on 4G; images have fixed dimensions, so nothing jumps.

---

## 11. Prototype-only, don't ship

- **Opening the landing starts a clean run:** it clears the answers, the timer and the pop-up flag on any visit except browser Back. Real users keep their state.
- `26-basic-plan-selection/?reset-timer` resets the timer, the pop-up and any applied extra discount for testing.
- `0b-proof/?photo=close|old` swaps the photo for comparison.
- The "Clear answers and timer" button on the [screen index](https://tasiapylypenko.github.io/youthgenom-funnel-redesign/prototype/).
- Login always fails after 900 ms: there are no accounts behind it.
- Prices and discount tags are typed into the page; in production they come from billing. −80% is the live marketing label ($30 of $144 is 79.2% off) and −59% is rounded; billing decides the label.
- The dietitian's name is a placeholder.
- `Q.title`, `Q.sub` and `Q.note` duplicate the static page text; the static text is what's shown.

**Where the prototype is simpler than this spec** (build to the spec):

- The extra-discount pop-up moves focus in and back, but doesn't keep it inside, and doesn't re-check that the reviews are still on screen after the 1.2 s.
- With reduced motion, the login spinner still turns, and scrolling stays smooth (to the plans, on a dot tap, to the T&C error).
- Answer groups have a role but no accessible name; the T&C error has no icon and isn't announced; login errors aren't linked to their fields (§8).
- Some tap targets are under 48 px: carousel dots, the cm / ft in switch, "Switch to the 6-month plan" and "About Body Mass Index (BMI)".
- "Something else" gets focus but isn't scrolled above the fixed button bar.
- Metric weights are stored as whole lbs, so 80.5 kg comes back as 80 kg.
- The BMI scale's tick numbers sit above the track; Figma has them under it.
- A long name on "Your plan is ready" wraps but isn't cut with an ellipsis.

---

## 12. Open items

- **Content to confirm before launch:** the dietitian's name, photo and credentials; the member stories and their consent; the user count; claims kept from today's paywall ("Dietitians and coaches, 24/7", "200+ easy recipes", "Supports women with cancer", "Most popular"). Every fact goes through a copywriter.
- **With product:** the free 7-day starter menu promised on the email screen (it must be delivered the same day, whether or not she buys), the *Menopause Recipe Guide* bonus, the follow-up emails, and a legal check of marketing consent.
- **Checkout** isn't redesigned. One behaviour to check: on a decline, show a specific message and offer another payment method; never clear the form.
- **Default units by region.**
