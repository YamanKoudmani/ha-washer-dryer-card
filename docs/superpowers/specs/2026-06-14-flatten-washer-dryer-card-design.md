# Flatten the Washer/Dryer Card Layout

**Status:** Approved
**Date:** 2026-06-14
**Scope:** Visual refactor only — CSS in `src/washer-dryer-card.ts`. No JS, no template, no config-schema, no version bump.

## Problem

The current `washer-dryer-card` renders each machine inside a rounded "bubble" with a visible border and its own background, and the `ha-card` outer container adds 20px of padding on all sides. The combined effect is a card-within-a-card layout with two layers of inset — content does not extend to the card edges, the inner panels are visually noisy, and the card consumes more vertical and horizontal space than its information requires.

A prior visual reference (the "old" card) showed the same information in a cleaner, edge-to-edge layout: no per-machine container chrome, no double-inset, content reaching the card edges, and a thin divider between the two machines.

## Goal

Restyle the current card to match that flatter, edge-to-edge visual: remove the per-machine "bubble" container, reduce the outer padding so content extends horizontally to the card edges, and use a hairline divider to separate Washer from Dryer. Preserve all current behavior, accessibility, click targets, and the phase diagram (which already renders full-width).

## Non-Goals

- No changes to rendering logic, state resolution, configuration schema, the editor (`src/editor.ts`), constants, types, or tests.
- No changes to `.icon-cell` (the 48×48 circle around the washer/dryer icon) or `.power-badge` (the small right-side pill). Both are kept exactly as-is.
- No background color is set on the card; the theme's backdrop (translucent / gradient / flat) shows through unchanged.
- No new card version bump. This is a styling-only change. (Bump only if the user later requests it.)

## Affected File

`src/washer-dryer-card.ts` — only the `static get styles()` block, lines 251–412. No other source files are touched. After editing, run `npm run build` so the bundled `dist/washer-dryer-card.js` reflects the change. Home Assistant loads the bundle, not the source.

## CSS Changes

All selectors are inside the existing `css` template literal. Edits are surgical replacements; rule order is preserved unless noted, and exactly one new rule is added (§5, the hairline divider).

### 1. `ha-card` — drop the outer padding

**Lines 257–261.** Replace `padding: 20px` with `padding: 0` so the content extends edge-to-edge horizontally. Keep `box-sizing: border-box` and the theme-driven `border-radius`.

```css
ha-card {
  padding: 0;
  box-sizing: border-box;
  border-radius: var(--ha-card-border-radius, 12px);
}
```

### 2. `.card-header` — internal padding + tighter bottom margin

**Lines 263–271.** The header is the only element that needs visible space from the card's top and side edges (since `ha-card` now has zero padding). Add internal padding for that breathing room, and tighten the bottom margin. The padding-left/right (`16px`) is set to match the panel padding-left/right so the header text aligns horizontally with panel content.

```css
.card-header {
  font-family: var(--paper-font-headline_-_font-family, inherit);
  font-size: 22px;
  font-weight: 600;
  color: var(--primary-text-color);
  margin: 0 0 8px 0;
  padding: 14px 16px 0 16px;
  line-height: 1.2;
}
```

### 3. `.machines` — remove the inter-panel gap

**Lines 294–298.** Change `gap: 12px` to `gap: 0`. The hairline divider on the panel itself (§5) replaces spacing as the visual separator.

```css
.machines {
  display: flex;
  flex-direction: column;
  gap: 0;
}
```

### 4. `.machine-panel` — strip the bubble chrome

**Lines 302–316.** Remove `background`, `border`, and `border-radius` (set to `none` / `0`). Change `padding: 16px` to `padding: 12px 16px` for tight top/bottom and consistent left/right. Reduce inner `gap: 14px` to `gap: 12px`. Keep the click, transition, and flex layout intact.

```css
.machine-panel {
  background: none;
  border: 0;
  border-radius: 0;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 12px;
  outline: none;
}
```

### 5. New rule — hairline divider between machines

Inserted directly after the `.machine-panel` rule (between current lines 316 and 318). Uses `:not(:first-child)` so the first panel (Washer by default) has no top border, and only the second (Dryer) draws the divider. Uses `--divider-color` so it adapts to light/dark themes.

```css
.machine-panel:not(:first-child) {
  border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
}
```

### 6. (removed — merged into §2)

The header padding is set in §2 above. The previously planned separate "header padding" rule is unnecessary because the existing `.card-header` rule is being modified anyway.

### 7. `.machine-panel:hover` — replace shadow with row tint

**Lines 322–327.** Replace the `box-shadow` declaration with a subtle background tint. The 0.04 alpha is intentionally low so it reads as feedback, not as a bubble re-appearing. The fallback uses `--secondary-background-color` so the tint takes theme variables where reasonable.

```css
.machine-panel:hover {
  background: rgba(255, 255, 255, 0.04);
}
```

If the tint is imperceptible on the user's actual theme during implementation, the fallback is to use a CSS variable already on the card or to remove the hover effect entirely. The implementation plan will include a visual-verification step.

### 8. `.machine-panel:focus-visible` — unchanged

**Lines 318–320.** Keep the focus ring as-is. This is the accessibility indicator and must not be regressed.

```css
.machine-panel:focus-visible {
  box-shadow: 0 0 0 2px var(--primary-color);
}
```

### 9. Everything else — unchanged

`.empty-state`, `.icon-cell`, `.machine-icon`, `.machine-icon.rumble`, `@keyframes rumble`, `.machine-info`, `.machine-name`, `.machine-status`, `.power-badge`, and the `svg` block are all left exactly as they are.

## Visual Outcome

`ha-card` (rounded outer corners, theme background, zero padding) →
  Header (`14px` top, `16px` left/right, `8px` bottom margin) →
  Washer row (`12px` top/bottom, `16px` left/right, transparent background, no border) →
  `1px` hairline divider in `--divider-color` →
  Dryer row (same padding) →
  Bottom edge of the card.

The phase diagram `<svg>` is already `width: 100%` and will now extend edge-to-edge inside its panel automatically.

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Hover tint imperceptible on a particular theme | Low–medium | Implementation plan will visually verify in the user's HA instance (or against a known theme). Fallback: remove hover, or use `--secondary-background-color` with low opacity. |
| Divider color invisible on a particular theme | Low | `--divider-color` is HA's standard theme variable; if it under-contrasts, the fallback is `rgba(127, 127, 127, 0.3)` or similar. |
| Empty state (`<ha-card><div class="empty-state">…</div></ha-card>`) looks cramped with `padding: 0` on `ha-card` | Low | `.empty-state` already declares `padding: 48px 16px` internally, so it self-spaces. No change needed. |
| `border-top` on `.machine-panel:not(:first-child)` shows through the `box-shadow` of the focus ring | Very low | Focus ring is `0 0 0 2px` outside the box and uses `var(--primary-color)`, which is opaque and drawn above the border. |

## Acceptance Criteria

1. The two `.machine-panel` elements have no visible background, border, or rounded corners.
2. The `ha-card` outer container has zero padding on all four sides; content reaches the card edges horizontally.
3. A 1px horizontal line in `--divider-color` separates Washer from Dryer.
4. The header (when shown) has 14px top padding and aligns horizontally with panel content.
5. Hovering a panel gives a subtle background tint (or is disabled if the tint is unreadable on the user's theme).
6. Keyboard focus on a panel still shows the 2px primary-color focus ring.
7. Clicking a panel still opens the entity more-info dialog (no JS change).
8. The phase diagram SVG renders edge-to-edge inside its panel.
9. The empty state (no machines configured) still looks correctly spaced.
10. `npm run build` succeeds and the resulting `dist/washer-dryer-card.js` reflects the changes.

## Out of Scope (Explicit)

- Renaming or restructuring CSS rules.
- Migrating to CSS custom-property tokens beyond what already exists.
- Refactoring the Lit template, render methods, or any JS.
- Updating the visual config editor (`src/editor.ts`).
- Bumping `CARD_VERSION` in `src/const.ts`.
- Touching tests beyond confirming `npm run test` still passes if a test is run.
