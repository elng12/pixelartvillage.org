# PixelArtVillage.org vs pixelartvillage.com

Date: 2026-03-30

## One-line conclusion

Our biggest remaining gap is repeat-use palette management, not core editor capability.

The editor already covers fixed built-in palettes, direct Lospec import, true export modes, grid export, visible support contact, and a top-level feedback path. The most valuable next work is to improve cleanup and repeat-use workflows around imported palettes.

## Priority rules

- P0: Users can hit this immediately, or the site still sends a misleading capability signal.
- P1: Clear trust or workflow win after the messaging gap is fixed.
- P2: Good creator improvements after the basics are aligned.

## Reality check: what is already fixed

### Built-in palettes are now real

- `Pico-8`, `Lost Century`, `Sunset 8`, `Twilight 5`, and `Hollow` now map to fixed color sets.
- This is no longer a current gap.

### Palette import is already beyond a small curated picker

- Direct Lospec URL import works.
- Manual hex-list import works.
- Curated Lospec palettes still exist as a fast picker.
- PixilArt direct fetch is not a normal missing feature anymore; the source site blocks automated access, so the correct fallback is copy-paste hex import.

### Export is already covering the core workflow

- Users can export at actual pixel size.
- Users can export at source size, `2x`, and `4x`.
- Grid can be burned into the downloaded file.
- This should not be treated as a fresh P0 gap.

### Support contact is now visible

- Contact page has a real support inbox CTA.
- Footer also exposes the support email directly.
- The old "weak visible contact path" point is closed.

### Header feedback entry is now live

- Desktop navigation now exposes a direct feedback action.
- Mobile navigation also exposes the same action.
- The current destination is a real Google Form, so the "missing visible feedback path" point is closed.

### Homepage example buttons are not a confirmed bug

- The homepage currently does not expose sample shortcut buttons.
- This looks like a product-direction decision, not a broken implementation.
- Do not re-add examples by default just because the competitor has them.

### There is no open P0 right now

- The format-signal cleanup is done.
- The visible feedback-path gap is also closed.
- The remaining backlog starts at P1.

## P1

### 1. Add `Clear all custom palettes`

Problem:
- Palette import is now strong enough that repeat users can accumulate a messy local library.
- Current management supports overwrite-by-name and single deletion, but not a full reset flow.

Why this matters:
- This is the main missing piece in the current palette workflow.
- It matters most for repeat creators, not first-time visitors.

What to build:
- Add `Clear all custom palettes`.
- Keep per-palette delete for finer cleanup.
- Require a lightweight confirmation step before destructive removal.

Acceptance:
- User can clear the imported/custom palette library in one action.
- Built-in palettes remain intact.
- The action is easy to find but hard to trigger by accident.

Expected impact:
- Medium to high repeat-user workflow win.

### 2. Improve palette library UX after clear-all exists

What to improve:
- Prevent confusing duplicates more explicitly.
- Make imported palette names easier to rename.
- Keep source labels like `Lospec` visible and consistent.
- Add palette-library export/import only after cleanup basics feel solid.

## P2

### 3. Revisit homepage example images as an experiment, not a default backlog item

Why:
- Example images may improve first-use activation.
- But the site recently moved away from shortcut buttons, so this is not an automatic "missing feature."

How to treat it:
- Run it as a deliberate product experiment.
- If it returns, make it stronger than a plain list of buttons.
- Measure whether it increases editor activation and first export completion.

Acceptance:
- Reintroduction is tied to a clear UX hypothesis and a simple measurement plan.

### 4. Add richer onboarding and creator presets

What to improve:
- Before/after examples tied to real use cases.
- Short presets like `best for portraits`, `best for sprites`, or `best for retro UI`.
- More guided onboarding inside the tool flow, not only in long-form content.

### 5. Consider advanced creator controls only after the trust layer is clean

Ideas:
- Grid thickness.
- Palette lock plus color-count reduction.
- Sprite-sheet-friendly export options.
- Edge cleanup or outline-assist features.

### 6. Treat PixilArt direct URL parity as blocked, not urgent

Why:
- The current blocker is source-site access, not local implementation effort.
- The correct near-term UX is honest copy plus a copy-paste fallback path.

## Suggested rollout

### Week 1

- P1.1 add `Clear all custom palettes`
- P1.2 tighten palette library UX

### Week 2

- P2.3 decide whether homepage examples deserve an experiment
- P2.4 add lightweight onboarding or presets

### Week 3

- P2.5 consider advanced creator controls
- P2.6 keep PixilArt URL parity as blocked unless source conditions change

## Best next step if we only do one thing first

- Add `Clear all custom palettes`

Reason:
- It is now the clearest remaining workflow gap for repeat users.
- Palette import is already strong enough that cleanup quality matters more.
- It improves day-two retention more than another round of signaling cleanup.

## Best next step if we want the fastest visible win

- Add `Clear all custom palettes`

Reason:
- It is easy to explain and immediately useful for people who import multiple palettes.
- It closes the most obvious missing control in the current palette manager.

## Best next step if we want the strongest repeat-user workflow win

- Add `Clear all custom palettes`

Reason:
- Palette import is already good enough to justify better library cleanup.
- This closes the most obvious remaining gap in the palette workflow.
