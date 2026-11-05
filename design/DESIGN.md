# Weven — design spec

Source of truth for the Weven UI. Every screen in `design/` is a design reference: build it as React Native components (Expo and Expo Router, in `apps/app`) using the tokens and component list below. Web runs through React Native Web, so one component serves iOS, Android and web. **Do not copy the HTML into the app.**

- Product: split bills with friends and family. Web + native mobile, same features on both, mobile first.
- Domain: wevenapp.com
- Brand line: "Now we're even."

---

## 1. How to read the design files

| Folder | What it is |
|---|---|
| `design/bs.css` | **Tokens + component styles.** Light theme on `.bs`, dark theme on `.bs.dark`. Port these to the Tailwind theme, `packages/theme/theme.css`. |
| `design/screens/*.dc.html` | One file per mobile screen (390 px wide). `Main.dc.html` = Home (mobile, light). `HomeDark.dc.html` = same in dark. `HomeWeb.dc.html` = desktop/web layout. `Components.dc.html` = the component sheet. |
| `design/landing/*.dc.html` | Marketing site: `ComingSoon.dc.html` (pre-launch) and `Landing.dc.html` (live). Fluid pages, 1440 px reference width. These are plain web pages, not part of the Expo app: `ComingSoon` is built in `apps/landing`. |
| `design/brand/*.dc.html` | Logo explorations (Weven is the current choice). |
| `design/canvas.json` | Board layout from the design tool; ignore for implementation. |

Format notes (the files come from a design canvas):

- `<x-dc>` wraps the markup. `<helmet>` holds fonts + page-level CSS. `<script type="text/x-dc">` holds demo logic only.
- `{{ name }}` = a value from demo logic (e.g. `{{themeClass}}` is `light` / `dark`). `<sc-for>` = a loop, `<sc-if>` = a conditional.
- `./bs.css` and `./support.js` links: `bs.css` lives at `design/bs.css`; `support.js` is the design tool's runtime and is not included.
- Inline `style=""` values are the exact intended values (spacing, sizes). Map them to Tailwind classes and theme tokens.
- All amounts, names and rates are **example data**.
- `ScanAssign.dc.html` contains working demo logic for the "who had what" interaction; it is a good behaviour reference.

---

## 2. Tokens

### Colour (light / dark)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F6F6F4` | `#0E0E0F` | Page background |
| `--surface` | `#FFFFFF` | `#18181A` | Cards, sheets, tab bar |
| `--surface2` | `#EFEFEC` | `#232326` | Fills, segmented control, chips |
| `--line` | `#E3E3DF` | `#2D2D31` | Borders, dividers |
| `--text` | `#161616` | `#F2F2EF` | Primary text |
| `--muted` | `#5C5C59` | `#A6A6A2` | Secondary text (passes 4.5:1) |
| `--acc` | `#3C5A99` | `#4A68AD` | Navy accent: primary buttons, selection, FAB |
| `--onacc` | `#FFFFFF` | `#FFFFFF` | Text on accent |
| `--accSoft` | `#E3E9F6` | `#1E2A44` | Selected rows, soft buttons |
| `--accText` | `#2F4A85` | `#A9BEEB` | Text on `accSoft`, text buttons |
| `--ink` | `#1C2742` | `#1C2742` | Balance card / hero background |
| `--heroBtn` / `--heroBtnText` | `#DCE5F7` / `#1C2742` | same | Button on the balance card |
| `--owed` | `#0E7A6E` | `#5FD3C4` | "You're owed" amounts (teal) |
| `--owe` | `#C2410C` | `#FF9A62` | "You owe" amounts (orange) |
| `--heroOwed` / `--heroOwe` | `#6FD8C8` / `#FF9A62` | same | Owed/owe bar on the dark balance card |
| `--v1…v4` + `--v1i…v4i` | violet, green, peach, blue pastels | darker versions | Avatar and group-icon colour pairs (background + icon/initials) |
| `--scrim` | `rgba(14,18,28,.45)` | `rgba(0,0,0,.6)` | Behind bottom sheets |

Rules: owed is always teal, owe always orange, and every amount is paired with a text label ("you owe", "owes you") so colour is never the only signal. Theme follows the system setting by default; user can override in Settings (System / Light / Dark).

### Typography

- Display / headings / big amounts: **Bricolage Grotesque** 700–800, letter-spacing −0.025 to −0.045em.
- UI / body: **Inter** 400 / 500 / 600 / 700.
- Sizes: H1 30, H2 20, H3 17, body 15, sub 13, caption 12, tab label 11. Big balance 42–46.
- Amounts use `font-variant-numeric: tabular-nums`.

### Shape and spacing

- Radius: 9 (segmented items), 11–14 (buttons, inputs, small tiles), 18–24 (cards, hero), 28 (sheet top), full (pills, avatars).
- Spacing scale: 4 / 8 / 12 / 16 / 20 / 24 / 28. Screen side padding 20. Section gap 20–28.
- Touch targets ≥ 44 px.
- Icons: 24-grid line icons, 1.75 stroke, round caps. Sizes 13 / 16 / 20 / 24.

---

## 3. Components (atomic)

Names are the suggested React component names. `bs.css` class in brackets.

**Atoms**
- `WButton` variant `primary|secondary|soft|hero|ghost`, size `md|sm` [`.btn .btn-p .btn-s .btn-soft .btn-sm .hbtn .txtbtn`]
- `WIconButton` boxed / plain [`.ib .ib.boxed`]
- `WIcon` name, size [`.ic .ic.s .ic.xs .ic.l`]
- `WAvatar` initials or photo, size 28/40/52/64/88, colour 0–4 [`.av .av.sm .av.lg .c0–.c4`]
- `WTile` group icon/photo, size 40/44/72 [`.tile .tile.lg`]
- `WPill` default / accent / on, `WTag` [`.pill .pill.acc .pill.on .tag`]
- `WSwitch`, `WCheckbox`, `WRadio` [`.sw .check .radio`]
- `WInput` with optional prefix/suffix [`.inp`]

**Molecules**
- `WListRow` slots: leading (avatar/tile/check), title, sub, trailing (amount/button/switch/chevron) [`.row .grow .end`]
- `WField` label + input + hint [`.field .lbl`]
- `WSegmented` [`.seg`]
- `WSectionHeader` title + "See all" [`.sechead .link`]
- `WAvatarStack` with `+N` overflow [`.stack`]
- `WBalanceLabel` "you owe / you're owed / settled" + amount [`.amt .owed .owe`]
- `WStepper` (shares / portions)
- `WQuickAction` icon tile + label
- `WComment` (mine / theirs) [`.bubble .bubble.me`]
- `WCurrencyNote` (≈ converted amount + rate), `WTotalCheck` (sum matches)

**Organisms**
- `WBalanceCard` total, currency switch, owed/owe bar, Settle up [`.hero`]
- `WGroupCard`, `WAppBar` back/title/actions [`.appbar`]
- `WTabBar` Home · Groups · (+) · Activity · Account [`.tabbar .fab`]
- `WBottomSheet` [`.scrim .sheet .grab`]
- `WFooterAction` sticky bottom button(s) [`.footer`]
- `WActivityItem`, `WReceiptItemRow` (scan assign)

**Templates**
- `TabScreen` (title + content + tab bar): Home, Groups, Activity, Account
- `DetailScreen` (app bar with back + header + content): Group, Friend, Expense
- `FormScreen` (close + fields + sticky footer): Add expense, Create group, Settle up, Payment details
- `SheetOverlay` (scrim + bottom sheet): Split options, Currency, Share item

On web (`HomeWeb.dc.html`): left sidebar nav (with the group list) + fluid content. Bottom sheets become centred dialogs or side panels; the tab bar becomes the sidebar.

---

## 4. Screen inventory

| Screen | File | Template | Suggested route |
|---|---|---|---|
| Sign in | `SignIn` | — | `/login` |
| Home | `Main`, `HomeDark`, `HomeWeb` | TabScreen | `/` |
| Groups | `Groups` | TabScreen | `/groups` |
| Create group | `CreateGroup` | FormScreen | `/groups/new` |
| Group expenses | `GroupDetail` | DetailScreen | `/groups/:id` |
| Who owes who | `GroupBalances` | DetailScreen | `/groups/:id/balances` |
| Group stats | `GroupStats` | DetailScreen | `/groups/:id/stats` |
| Group settings | `GroupSettings` | DetailScreen | `/groups/:id/settings` |
| Add / edit expense | `AddExpense` | FormScreen | `/expenses/new`, `/expenses/:id/edit` |
| Split options | `SplitSheet` | SheetOverlay | (sheet) |
| Currency picker | `CurrencySheet` | SheetOverlay | (sheet) |
| Expense detail | `ExpenseDetail` | DetailScreen | `/expenses/:id` |
| Friends | `Friends` | DetailScreen | `/friends` |
| Friend | `FriendDetail` | DetailScreen | `/friends/:id` |
| Settle up: choose | `SettleUp` | FormScreen | `/settle` |
| Settle up: pay | `SettlePay` | FormScreen | `/settle/:userId` |
| Activity | `Activity` | TabScreen | `/activity` |
| Account | `Account` | TabScreen | `/account` |
| Payment details | `PaymentDetails` | FormScreen | `/account/payment` |
| Settings | `Settings` | DetailScreen | `/account/settings` |
| Scan bill (V2) | `ScanBill` | full-screen camera | `/scan` |
| Scan: check the bill (V2) | `ScanReview` | FormScreen | `/scan/review` |
| Scan: who had what (V2) | `ScanAssign` | FormScreen | `/scan/assign` |
| Scan: share one item (V2) | `ScanShareSheet` | SheetOverlay | (sheet) |
| Scan: who pays what (V2) | `ScanSummary` | FormScreen | `/scan/summary` |
| Landing: coming soon | `landing/ComingSoon` | page | `wevenapp.com` (pre-launch) |
| Landing: live | `landing/Landing` | page | `wevenapp.com` (post-launch) |

---

## 5. Product rules shown in the design

- **Accounts:** sign in with Apple, Google or email. Official provider buttons must replace the placeholder icons.
- **Groups:** name, icon or photo, default currency, members. Creator is a manager. Managers can rename, change picture, make others managers, remove members, share the invite link and **lock** the group (locked = nobody can add or invite members).
- **Expenses:** name, amount, currency, paid by, split, date, receipt photo (camera or upload), note. Comments thread on each expense.
- **Split methods:** Equal, Exact amounts, Percent, Shares. People can be excluded. The sum must equal the total before saving.
- **Currency:** each expense can be in any currency. It shows the converted amount in the group currency at the live rate, and the rate is **locked when the expense is saved**. Home can show totals in one display currency (setting).
- **Balances:** "Simplify debts" (on by default) computes the fewest payments that settle everyone. Totals do not change.
- **Settle up:** Weven does **not** move money. The payer sees the receiver's MobilePay number, bank details or Revolut tag (copy buttons, open-app links) and taps "I've paid". The receiver gets an activity item to **confirm** or mark "not received".
- **Payment details:** stored per user, with a preferred method, shown only to people in shared groups when settling.
- **Friends:** invite by link, contacts or email; pending invites can be resent. Friend page shows the net balance across groups and currencies.
- **Activity:** expenses added, comments, payments (with confirm), member joined, group locked, role changes.
- **Theme:** System / Light / Dark.
- **Scan by item (V2):**
  1. Photo → items, quantities, prices, subtotal, tip/service detected and checked against the receipt total. Low-confidence lines are flagged.
  2. Choose "By item" or "Equally".
  3. Assign: pick a person, tap items. Multi-quantity lines split into units. An item tapped for several people is shared evenly. Custom portions/amounts via a sheet.
  4. Shared-by-everyone lines (e.g. couvert) are split evenly. **Tip is split in proportion to each person's items** (a toggle makes tip + couvert equal).
  5. The summary must add up exactly to the receipt total (round per person, put the remainder on the largest share). Optional "ask everyone to confirm".
  - Example in the files: €143.18 subtotal + €14.32 tip = €157.50 → You 35.28, Sofie 35.28, Mikkel 37.49, Anna 25.22, Jonas 24.23.

## 6. Open questions (not decided yet)

- Is Friends its own tab, or reached from Home and Account as now?
- Are expenses directly between two friends (no group) allowed? (The design assumes yes.)
- Who can edit or delete an expense: anyone in the group, or the creator + managers?
- Weven Plus price and exact feature split. The landing page shows `[PRICE]`.
- Can others claim their own items on a scanned bill from their own phone?

## 7. Accessibility

- Real `<button>`, `<a>`, `<input>` + `<label>`; `aria-label` on icon-only buttons; switches use `role="switch"` + `aria-checked`.
- Text contrast ≥ 4.5:1 in both themes.
- Landing animations are disabled under `prefers-reduced-motion`.
