# Analysis: YouthGenom funnel conversion

The full analysis behind the presentation: how to read the data, where women leave the funnel and why, the three problems that cost the most, what the redesign changes, and the expected impact.

**Contents**

1. [The brief](#1-the-brief)
2. [How to read the data](#2-how-to-read-the-data)
3. [Funnel map](#3-funnel-map)
4. [Where she leaves, and why](#4-where-she-leaves-and-why)
5. [The three problems that cost the most](#5-the-three-problems-that-cost-the-most)
6. [The redesign](#6-the-redesign)
7. [Expected impact](#7-expected-impact)
8. [Test plan](#8-test-plan)
9. [Research plan](#9-research-plan)
10. [Open questions](#10-open-questions)

---

## 1. The brief

**Goal:** suggestions to improve the funnel conversion rate (social ad → quiz → plan → payment), based on the data and an analysis of the current funnel.

**Audience:** women 50+ in peri- or postmenopause. They come from social ads and most of them:

- have never heard of the brand;
- have tried many weight-loss solutions;
- have low trust and high frustration;
- want clarity, credibility and emotional resonance.

98% are on mobile. For this task, price is assumed not to be the problem.

**Constraints:** keep the quiz-funnel model, prefer high-impact changes over a full rebuild. A funnel like this exists to build trust, show competence, match her needs and prove we understand her pain.

| # | The brief asks for | Where |
|---|---|---|
| 1 | Analyze the funnel data | §2–§4 |
| 2 | Prioritize the 1–3 most important problems | §5 |
| 3 | Redesign the funnel or parts of it | §6, the prototype and Figma |
| 4 | Show technical feasibility | [Developer spec](dev-spec.md) and the notes in Figma |
| 5 | Expected impact | §7–§8 |

---

## 2. How to read the data

1. **The numbers are page visits, not unique users.** Several steps get more visits than the step before them (steps 14 → 17 and 22 → 24). That's only possible through going back, reloading or coming back later. So step-to-step rates above 100% are revisits, and the loss around those steps is measured across the whole block (14 → 18, 22 → 25).
2. **A drop between two rows happens on the first page.** 16,848 visits reached the email screen and 12,188 reached the plan page, so the 4,660 who left were lost on the email screen.
3. **One week of data** (1–7 Nov 2025), with no split by ad creative, device, new vs returning visitors or payment errors. That split is needed to confirm the hypotheses (§9).

---

## 3. Funnel map

The current funnel, walked through on a 375 px phone screen. **Actions** is the minimum number of taps and typed fields to reach the next page on the default path; scrolling isn't counted.

| Step | Page | What she sees | Actions | Visits | Leave here* |
|---:|---|---|---|---:|---:|
| 0 | Landing | "Uncover weight loss methods for all menopause stages" · *Why do you want to lose weight?* | 1 | 55,329 | **55.3%** |
| 1 | Question | *How long since you had your ideal weight?* | 1 | 24,707 | 8.1% |
| 2 | Question | *Which goals would you also like to achieve?* (multi) | 2 | 22,713 | 7.4% |
| 3 | Question | *Do you follow any specific diets?* | 2 | 21,025 | 3.3% |
| 4 | Question | *Food allergies?* (multi) | 2 | 20,330 | 1.5% |
| 5 | Info | "Featured in" logos (barely visible) and an "EU Medical Institution" claim | 1 | 20,031 | 2.9% |
| 6 | Question | Two questions on one page: menopause stage and workouts per week | 3 | 19,455 | 3.9% |
| 7 | Question | *Do you have any of the following bad habits?* | 2 | 18,694 | 1.5% |
| 8 | Info | Before/after illustration · "On average women lose 10 lbs after the first week" | 1 | 18,421 | 0.6% |
| 9 | Question | *What triggers your snacking?* | 2 | 18,303 | 0.9% |
| 10 | Question | Health conditions | 2 | 18,136 | 0.8% |
| 11 | Question | Three questions on one page: mood swings, working hours, cooking | 4 | 17,989 | 1.9% |
| 12 | Input | Age | 2 | 17,652 | 0.5% |
| 13 | Info | Comparison table · "We know that we are better" | 1 | 17,561 | 0.3% |
| 14 | Input | Height (ft / in by default) | 3 | 17,516 | revisits |
| 15 | Input | Weight | 2 | 17,784 | revisits |
| 16 | Input | Target weight, **pre-filled** (e.g. 126 lbs for a 180 lbs user) | 1 | 18,376 | revisits |
| 17 | Input | Name | 2 | 18,755 | 7.8% (inflated) |
| 18 | Result | BMI gauge · "Your health can be at risk if you stay at this weight" | 1 | 17,300 | 2.6% |
| 19 | Result | Projection "180 lbs → 149 lbs", labelled "Week 1" | 1 | 16,850 | 1.2% |
| 20 | Result | "Your biological age is 5 years older" · "down to 50 in 12 weeks" | 1 | 16,644 | 0.5% |
| 21 | Question | Three questions on one page: hot flashes, dry skin, hormone therapy | 4 | 16,562 | 0.7% |
| 22 | Info | "Your hormones always work…" · long text, faint illustration | 1 | 16,450 | revisits |
| 23 | Result | "[Name], we'll reach your perfect body in no time!" · a second goal chart | 1 | 16,550 | revisits |
| 24 | Info | "We'll get you in shape for good!" | 1 | 16,931 | 0.5% |
| 25 | Email | "Receive access to your individual program in your email" · pressing "Next" also opts her in to marketing | 2 | 16,848 | **27.7%** |
| 26 | Plan page | 5:00 countdown, an "80% discount" pop-up, 3 plans, a required T&C checkbox, a long sales page | 2–3 | 12,188 | **80.1%** |
| 27 | Checkout | Order summary, PayPal / Apple Pay / Google Pay visible without scrolling, card form | 1–5 | 2,428 | **68.6%** |
| 28 | Thank you | — | — | **762** | — |

\* Share of this page's visits that never reach the next page.

**What stands out**

- **44 actions before anything is asked in return.** 9 of the 25 quiz screens are "Next"-only info screens.
- **The interaction pattern keeps changing.** Steps 0–1 move on by themselves, later single-choice questions need an extra tap, and steps 6, 11 and 21 put 2–3 questions on one scrolling page. The answer controls change too: plain cells, radio buttons, checkboxes.
- **The plan page adds friction where intent is highest**: a pop-up to dismiss, and a countdown that restarts at 5:00 on every page load.

### The funnel at a glance

| Stage | From → to | Conversion | Visits lost |
|---|---|---:|---:|
| Hook | Landing → first answer | 44.7% | 30,622 |
| Quiz | First answer → email screen | 68.2% | 7,859 |
| Email | Email screen → plan page | 72.3% | 4,660 |
| Offer | Plan page → checkout | **19.9%** | **9,760** |
| Payment | Checkout → purchase | **31.4%** | 1,666 |
| **Overall** | Landing → purchase | **1.38%** | — |

**The quiz itself works:** 68% of those who start reach the email screen, and most quiz pages lose under 2%. The losses are at the start (55% leave the landing) and after the quiz, where the email screen, the plan page and checkout together lose **95.5%** of the women who finished the quiz. Those are the most motivated women in the funnel.

---

## 4. Where she leaves, and why

Each hypothesis has a short ID (H-…) so the problems in §5 can point to it. They are hypotheses, not facts: each change is tested before it ships.

### Across the funnel: does it fit the audience?

These problems aren't tied to one page, so they don't show up as a single drop. They cost the most where she is asked to commit: the email and the paywall.

| Audience trait | What the current funnel does | What it needs |
|---|---|---|
| Never heard of us | Looks like a standard quiz. Nothing says who is behind it, what it has achieved or what credentials it has. | Introduce the brand along the way: a real expert, real numbers, real results |
| Tried many solutions | Nothing shows how it differs or how she'll reach the result. Step 13 says "we are better" without saying why. | Show what's different and the path to the result |
| Low trust, high frustration | Her answers are ignored: she says she wants to lose weight for her health, and later reads "We'll get you in shape for good!". Her goal weight is pre-filled, and the promises are unrealistic. | Use her answers on the next screens; realistic numbers |
| Clarity and credibility | Answer controls change from screen to screen, errors don't say what's wrong, the active button looks inactive | One set of components, errors that state the rule |

- **H-X1:** The brand stays unknown through the whole funnel, so at the paywall she is asked to pay a company she still knows nothing about.
- **H-X2:** Women who have tried everything see nothing new: no different method and no path to the result. It reads as one more diet.
- **H-X3:** The funnel asks *why* she wants to lose weight (health, looks or both), then ignores the answer. That reads as "they aren't listening".
- **H-X4:** Inconsistent controls, awkward wording and vague errors read as carelessness.

### Landing (55.3% leave)

Some bounce is normal for cold social traffic, but this is the largest absolute loss.

- The headline is generic and doesn't name her pain. The screen opens with a question and mentions menopause only in passing.
- No trust signal on the first screen: no user count, no expert.
- The only claim is *"up to 10 lbs in the initial week"*, a red flag for a woman who has tried everything.

**H-A1:** she can't tell in seconds that it's for her, so she doesn't make the first tap. **H-A2:** with no trust cue, a low-trust visitor won't make even one tap. **H-A3:** a first question about who she is (her menopause stage) gets more taps than a question about motivation, because it confirms "this is for me".

### Early quiz, steps 1–4 (8.1%, 7.4%, 3.3%, 1.5% leave)

- Questions read like a blunt form, not like a dietitian taking her history. Step 1 (*"How long since you had your ideal weight?"*) is emotionally loaded with no empathy around it.
- The progress bar barely moves, which signals a long quiz.
- The diet and allergy lists are incomplete, and "Other" gives no way to say what "other" is. The allergy list misses peanuts, sesame and wheat.

**H-B1:** she decides in the first 2–3 questions whether the quiz is worth it. **H-B3:** blunt copy and a changing answer UI break the feeling of an individual consultation. **H-B4:** when she can't find her answer and "Other" gives her no way to say it, she feels the product doesn't understand her.

### Info screens (steps 5, 8, 13, 18–24)

They are meant to build trust, but several undermine it:

| Screen | Problem |
|---|---|
| 5 "Featured in" | Nearly invisible news logos, no real expert, a vague "EU Medical Institution" claim |
| 8 Before/after | An illustration, not a real woman 50+; "10 lbs after the first week" isn't credible |
| 13 Comparison | "We know that we are better" without explaining why it works |
| 18 BMI | A standalone verdict with fear framing ("Your health can be at risk") |
| 19 Projection | "180 → 149 lbs" labelled "Week 1", and it doesn't match the goal she entered |
| 20 Biological age | Everyone is "5 years older", with no source |
| 22 Hormones | Long text and a stock illustration instead of a real chart |
| 23 Goal chart | A second chart three screens after the first, "perfect body in no time" |
| 24 "In shape for good" | Talks about looks even if she chose health |

**H-C1:** these screens rarely cause an immediate exit; they lower trust in aggregate, and the cost shows up later, at the email and the paywall. **H-C2:** screens that ignore her answers show that the "personal" funnel isn't listening.

### Age, height, weight, goal and name (steps 12, 14–17)

Validation errors never say what's allowed ("Invalid age entered"), the button looks pale even when it's active, and the goal weight is pre-filled with an aggressive value. The net loss across steps 14–18 is only 1.2%, so this isn't a priority for conversion, but it adds to the feeling of carelessness. **H-D1:** vague errors make her retry, go back or reload, which would explain why visits rise across steps 14–17.

### Email screen (27.7% leave)

The email is asked for after 25 steps, before anything personal has been shown, and the screen gives nothing in return: a vague image and one line of text. Pressing "Next" also opts her in to marketing.

**H-E1:** part of this drop is expected: many who leave here would have left at the paywall anyway, and the screen builds the email database, so it stays before the paywall. **H-E2:** a clear reason to leave an email (her saved plan and a free 7-day starter menu) will raise the share of women who leave one.

### Plan page (80.1% leave): the biggest loss

12,188 women who finished the quiz and left an email see the offer, and only 1 in 5 goes on. Price is assumed not to be the issue, so the gap is value, personalization and trust.

- It opens with two elements about the same discount (a countdown banner and a bouncing gift) and a pop-up, not with her plan.
- A generic header; her own details appear only far down the page.
- Two badges for the same saving; the plans are hard to compare.
- Vague benefits, a wall of text that hides the useful facts, the guarantee far down, reviews from women aged 38–45 near the bottom.

**H-F1:** the page doesn't reflect her answers above the fold, which breaks the "personal plan" promise. **H-F2:** it isn't clear what she gets or how it works for menopause. **H-F3:** urgency itself isn't the problem; a discount pop-up before any personal content is. A timer that restarts on every reload looks fake to those who notice. **H-F4:** no real expert with a face and credentials; the guarantee is too far down to help. **H-F6:** the plans are hard to compare. **H-F7:** she doesn't see why the pre-selected 6-month plan suits her. **H-F9:** the top of the page wastes the most valuable space on two non-clickable discount elements. **H-F10:** the page doesn't guide the eye: the reasons to buy are there but lost.

### Checkout (68.6% don't pay)

The page looks reasonable: PayPal, Apple Pay and Google Pay sit right under the order summary and are visible without scrolling. A large part of the loss may come from things the page doesn't show: payment declines, 3-D Secure or last-moment doubt. **H-G3:** technical failures, which need the payment provider's logs.

---

## 5. The three problems that cost the most

The three problems are causes, not pages: a page shows *where* she leaves, a cause explains *why*. They are listed in the order she meets them; the paywall is the first to fix.

| # | Problem | In the data | Hypotheses | Measured at |
|---:|---|---|---|---|
| 1 | **No reason to trust us or to choose us** | **55%** leave the first screen | H-A1–A3, H-X1, H-X2, H-X4, H-C1, H-F4 | Landing → first answer; also feeds the paywall |
| 2 | **The funnel asks a lot and gives little back** | 25 screens before anything personal; **28%** leave at the email | H-B3, H-B4, H-C2, H-X3, H-E1, H-E2 | Lead conversion; quiz completion |
| 3 | **The paywall doesn't close the decision** | **80%** of the most motivated women leave | H-F1–F4, H-F6, H-F7, H-F9, H-F10 | Plan page → checkout; average order value |

**No reason to trust us or to choose us.** She has never heard of us and has tried everything, but the funnel looks like any other quiz: it opens with a question, not with value; there's no "why us"; the proof looks weak (news logos, an illustration, "we are better", an unsourced "biological age"); and small signs of carelessness add to the doubt. It's the root cause behind several drops, and its main payoff is at the paywall.

**The funnel asks a lot and gives little back.** 25 screens of questions, but her answers barely change what she sees, several questions share one screen, there are two charts in a row, and the email gives her nothing. The quiz itself keeps 68%, so the direct gain is small; the value is more leads and a feeling of being understood, which pays off at the paywall.

**The paywall doesn't close the decision.** Everything she needs is on the page, but in the wrong order and split by two discount elements and a pop-up. It's the biggest single loss, of the most motivated women, and the fix is one page, so it's the first test.

**Not in the three: checkout.** Its cause isn't visible on the page, so it needs research first (§9): session recordings and the payment provider's logs. A test there would also take about 3 months at today's traffic.

---

## 6. The redesign

The principle is **"show, then ask"**: prove understanding and value before every commitment (a tap, the email, the plan, the payment), with empathy and realism instead of fear and hype. Every high-commitment screen opens with her own answers, and there are never more than a few questions without something given back.

The prototype and Figma show every screen. This section is the reasoning; the [developer spec](dev-spec.md) has the rules.

### Where she learns who we are

Before the paywall she should already know who is behind the product, why it's different and how she'll get the result, so the paywall only sums it up.

| Where | What she learns |
|---|---|
| Landing | Who it's for and who built it: *"A weight plan built and reviewed by certified dietitians, for women 50+."* |
| Right after the first tap | *"2,000,000+ personalized plans created with our method"*, with a photo of women 50+ |
| Dietitian screen | Her plan is built and reviewed by a certified dietitian, with a photo, name and credentials |
| Real stories | Three real members with their age, stage, result and the time it took |
| How it works | The programme in steps, and what's different from the diets she has tried |
| Profile | What will change in *her* body and when, from her answers |
| Paywall | Nothing new: a summary, backed by real reviews and the guarantee |

Every brand fact must be verifiable before launch (§10).

### The new flow

Landing → proof → quiz (one question per screen) → profile → email → name → "Your plan is ready" → paywall → checkout.

Removed: the name step inside the quiz (it moves after the email), the BMI verdict screen, both separate chart screens, "biological age" and "In shape for good". The quiz has 23 steps, each counted in an "N / 23" counter.

### Landing and proof (problem 1)

- **Value before the question:** *"Menopause changed your body. Your plan should change too."* and the dietitian line.
- **The first question asks who she is, not why:** *"Where are you in menopause?"* as four tiles: Perimenopause, Menopause, Postmenopause, Not sure. One tap moves on.
- **Proof right after the first tap:** the user count as a large figure.

### The quiz (problems 1 and 2)

- **One question per screen**, one answer component everywhere, and a "Continue" button on every question: a tap selects, Continue confirms, so a mis-tap isn't locked in.
- **Copy reads like a dietitian's intake**, and most questions say why they're asked.
- **"Something else" opens an optional text field** on the lists where her answer may be missing. The answers are logged to find missing options.
- **Allergies follow the 9 major allergens** (FDA, US), with "I don't have food allergies" as a separate button.
- **Real proof:** a dietitian screen (the news logos stay below it, as a supplement), real member stories with the time each result took, a sourced hormone chart instead of a stock picture, and "how it works" instead of "we are better".
- **Errors state the rule**, e.g. *"Height must be between 120 and 215 cm."*

### Her numbers, never as a verdict (problem 2)

- **BMI under the weight field**, as a scale with her value, and a supportive line instead of "your health can be at risk".
- **No pre-filled goal.** As she types it, a card tags her goal (*"A healthy goal"*) and shows the share of her weight she'd lose (*"You'll lose 9% of your body weight"*, −7 kg) and her BMI scale moving from today to her goal.
- **One realistic projection** on the profile screen: *"Reach 75 kg by February 4 · About 0.5–1 kg a week"*, with real month labels and her own numbers. It replaces the two old chart screens.

### Email, name and "Your plan is ready" (problem 2)

- **A clear reason to leave the email:** *"Where should we send your plan and starter menu?"*, with her saved plan and a free 7-day starter menu. Marketing consent is a separate, unticked checkbox.
- **Name after the email**, then a short loader and *"Anna, your plan is ready!"* with her goal and what her plan includes, built from her answers.

### Paywall (problem 3)

**Prices and plans stay as they are.** The brief says price isn't the problem, so the redesign changes how they're shown, not what they are.

1. **One discount element:** her name, a timer and "Get now". It replaces the banner, the bouncing gift and the pop-up before the plans.
2. **Opens with her:** now and goal, with her own numbers in her units.
3. **A headline that follows her reason:** health, looks or both.
4. **Clear plans:** price per day, the saving on each, the 6-month plan pre-selected, its bonus (the *Menopause Recipe Guide*) joined to it, and one line on why 6 months fits her goal.
5. **The guarantee right under the plans**, then her dietitian, real reviews, how the plan works, key facts and an FAQ.
6. **An honest timer:** it doesn't restart on reload, and at zero the discount really ends.
7. **The extra-discount pop-up is redesigned, not removed:** a calm sheet that opens once, after she has seen the reviews, and only while the timer runs. Removing it is a separate test.

### Checkout: not redesigned

The page is already in reasonable shape, and the cause of the loss isn't visible on it, so it's researched first (§9). One behaviour to check with the developers: on a decline, show a specific message, offer another method and never clear the form.

### Follow-up emails (proposed, not designed)

For women who leave an email but don't buy: "your plan is saved" after about an hour, the promised starter menu the same day, a personal discount with a real deadline on day 3, then useful content. The starter menu is part of the service; the rest only with marketing consent. The sequence stops as soon as she buys.

---

## 7. Expected impact

### How the numbers are estimated

- Each estimate is a **relative uplift on one step if the test wins** (e.g. +10% turns 19.9% into 21.9%), with every other step at today's rate.
- **Most tests don't win.** We plan on **20–30% of tests winning**. In Microsoft's experiments about a third of ideas helped, a third did nothing and a third hurt (Kohavi, Tang and Xu, *Trustworthy Online Controlled Experiments*, 2020); for a new team on an unfamiliar funnel, 20–30% is safer.
- **Planning number = typical uplift × 20–30%.** That's the number to plan on.

### Three metrics, all after the quiz

| Metric | Definition | Today | If the test wins | Planning number |
|---|---|---:|---:|---:|
| **Lead conversion** | Emails submitted ÷ email-screen views | 72.3%\* | 75.9%, about +610 leads a week | **73.0–73.4%**, about +120 to +180 leads a week |
| **Sales conversion** | Purchases ÷ leads | 6.25% | 7.2% (if the paywall and checkout tests both win) | **6.4–6.5%** |
| **Average order value** | First payment ÷ purchases | about $31\*\* | +2–3% (if "why 6 months" wins) | **+0.5–0.75%** |

\* Plan-page visits ÷ email-screen visits: the plan page opens only after the email is submitted, so this stands in for emails submitted. \*\* An estimate: the real plan mix wasn't shared. It assumes 50% 6-month ($36 today), 30% 3-month (about $29) and 20% 1-month ($22).

**They multiply.** Of every 100 visitors, 30.5 reach the email screen, 72.3% of them leave an email and 6.25% of those buy: 1.38 buyers, about $31 each. So a change must raise its own metric without lowering the others. More leads with a lower sales conversion is expected, because many extra leads wouldn't have bought anyway.

**Why the 6-month plan raises the order value although it's cheaper per week:** it's paid for 6 months upfront, so the first payment is the largest ($36 vs $22 for one month). Over 6 months, though, a monthly buyer who renews even once pays more, so **revenue per buyer over 6 months, with renewals** is a guardrail for every order-value test.

### Per step

| Step | Today | If the test wins (typical) | Planning number |
|---|---:|---:|---:|
| Landing → first answer | 44.7% | 46.9% (+5%) | 45.1–45.4% |
| First answer → email screen | 68.2% | 70.2% (+3%) | 68.6–68.8% |
| Email screen (lead conversion) | 72.3% | 75.9% (+5%) | 73.0–73.4% |
| Plan page → checkout | 19.9% | 21.9% (+10%) | 20.3–20.5% |
| Checkout → purchase (after research) | 31.4% | 33.0% (+5%) | 31.7–31.9% |

### All together

| Scenario | Purchases a week | Change |
|---|---:|---:|
| Today | 762 | — |
| **Planning: 20–30% of tests win** | **798–816** | **+5% to +7%** |
| Only the paywall test wins | about 838 | +10% |
| Every test wins at its typical size | about 952 | +25% |

The planning row is the forecast; the rows below show what's possible when tests win. Revenue at the planning number: +5% to +8%, with the order value. Extra leads from the email screen are counted as leads, not as purchases.

**Guardrails:** revenue per buyer over 6 months with renewals, refunds, chargebacks, the first-renewal rate, page load time. For follow-up emails: unsubscribes and spam complaints.

---

## 8. Test plan

| # | Test | What changes | Metric | Duration |
|---:|---|---|---|---|
| 1 | Paywall | The whole new paywall vs today's | Plan page → checkout | about 2 weeks |
| 2 | Timer | Counts down once and stops at zero | Plan page → checkout | 1 week or more |
| 3 | Email screen | Her saved plan and a free starter menu | Lead conversion | about 1 week |
| 4 | Offer | Why 6 months; the extra-discount pop-up | Average order value | after test 1 settles |
| 5 | Landing | Value and real numbers before the question | Landing → first answer | about 1 week |
| 6 | Quiz | One question per screen, her answers used | First answer → email | about 1 week |
| 7 | Checkout | Only after research finds the cause | Checkout → purchase | about 3 months |

Each test: a 50/50 split, 95% confidence and 80% power, for at least one full week to cover weekdays. The paywall goes first because it has the biggest loss and many problems at once; if it wins, follow-up tests change one element at a time to learn what worked.

**Alternative:** the whole redesigned funnel against today's in one test. It answers faster, but can't tell which change helped and which hurt.

---

## 9. Research plan

| Method | Question it answers | Where |
|---|---|---|
| Session recordings and heatmaps | Where do women stop or rage-tap? Do they scroll? | Plan page, checkout |
| One-question exit survey | "What's stopping you from starting today?" | Plan page |
| 5–6 moderated usability tests with women 50+ on phones | Trust, how credible the claims are, how clear the offer is | Whole funnel |
| Payment provider logs | Decline rate, 3-D Secure failures, payment-method mix | Checkout |
| Ad → landing audit | Does the landing match the top ad creatives? | Landing |
| Answer-level analysis | Do certain answers predict leaving? | Quiz |
| Motive split | How many choose health, looks or both, and does drop-off differ? | Quiz step 2 |

---

## 10. Open questions

- **Unique-user step data**, to remove the revisit distortion, and a split by ad creative, OS and new vs returning visitors.
- **Which claims can be shown:** the dietitian's name and credentials, the user count, the reviews and photos, and the claims kept from the current paywall ("Dietitians and coaches, 24/7", "200+ easy recipes", "Supports women with cancer"). Every fact goes through a copywriter and is checked before launch.
- **With product:** the 7-day starter menu and the Recipe Guide bonus, the follow-up emails, and a legal check of marketing consent.
- **Copy that follows her motive** (health, looks or both), written with a copywriter.
- **Default units** follow her region in production (kg / cm or lbs / ft-in). The prototype opens in kg / cm.
- **Brand recognition** (outside this task): the logo reads as medical rather than menopause and wellness, and is easy to forget. Worth a review with the brand team.
