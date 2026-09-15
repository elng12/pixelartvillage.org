# PixelArtVillage.org vs pixelartvillage.com

Date: 2026-03-30

## One-line conclusion

Our biggest remaining gap is onboarding and guided first-use help, not core editor trust, palette portability, or cleanup.

The editor already covers fixed built-in palettes, direct Lospec import, true export modes, grid export, visible support contact, a top-level feedback path, the core custom-palette cleanup flow, and palette-library portability. The most valuable next work is to help first-time users get to a good result faster.

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

### Palette cleanup basics are now live

- Users can delete one custom palette at a time.
- Users can clear all custom palettes with confirmation.
- Duplicate palette names now ask before overwrite.
- Selected custom palettes can be renamed directly inside the manager.

### Palette portability is now live

- Users can export their custom palette library.
- Users can import a previously exported library.
- Import collisions now ask before replacing saved entries.
- This is no longer an open P1 gap.

### Homepage example buttons are not a confirmed bug

- The homepage already includes showcase/example imagery.
- Shortcut buttons are not a missing core workflow by themselves.
- Do not re-add examples by default just because the competitor has them.

### There is no open P0 right now

- The format-signal cleanup is done.
- The visible feedback-path gap is also closed.
- The palette cleanup basics are also closed.
- The remaining backlog starts at P1.

## P1

### 1. Add richer onboarding and creator presets

Problem:
- First-time users still land in a flexible editor without enough guidance about which settings fit portraits, sprites, retro UI, or general photos.
- The upload path is now cleaner, but the product still expects users to discover good settings mostly by trial and error.

What to improve:
- Before/after examples tied to real use cases.
- Short presets like `best for portraits`, `best for sprites`, or `best for retro UI`.
- More guided onboarding inside the tool flow, not only in long-form content.

Acceptance:
- A first-time user can choose a starting direction without reading docs first.
- Presets or starter paths visibly change settings in a predictable way.
- The guidance feels additive, not blocking.

Expected impact:
- High first-session activation win.

## P2

### 2. Consider advanced creator controls only after the onboarding layer is clearer

Ideas:
- Grid thickness.
- Palette lock plus color-count reduction.
- Sprite-sheet-friendly export options.
- Edge cleanup or outline-assist features.

### 3. Treat PixilArt direct URL parity as blocked, not urgent

Why:
- The current blocker is source-site access, not local implementation effort.
- The correct near-term UX is honest copy plus a copy-paste fallback path.

## Suggested rollout

### Week 1

- P1.1 add lightweight onboarding or presets

### Week 2

- P2.2 evaluate advanced creator controls

### Week 3

- P2.3 keep PixilArt URL parity as blocked unless source conditions change

## Best next step if we only do one thing first

- Add richer onboarding and creator presets

Reason:
- It is now the clearest product gap after trust, export, support, feedback, and palette portability were closed.
- It helps first-time users reach a good result faster.
- It is the most visible improvement left on the homepage-to-editor journey.

## Best next step if we want the fastest visible win

- Add richer onboarding and creator presets

Reason:
- It is the easiest improvement for first-time users to notice immediately.
- It can raise activation without changing the core processing stack.

## Best next step if we want the strongest repeat-user workflow win

- Consider advanced creator controls after onboarding ships

Reason:
- Palette portability is already in place.
- The next repeat-user gains will likely come from faster iteration and more creator-focused controls, not more library plumbing.
