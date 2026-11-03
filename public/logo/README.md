# J mark

Jethro's logo: the arrow J (chosen 2026-11-03, replacing the block J the same day). Vectorised from his
PNG with the logo-vector skill. Its straight edges (the bar, both sides of the stem, the arrowhead) are
lines between measured corners; the loop's inner and outer edges are 8 cubic Beziers fitted to the
traced outline, each meeting the straight stem edge it runs into without a kink. Overlap with the
source: IoU 0.9986, fit 4 of 4.

- `j-mark.svg`, `j-mark-white.svg`: the mark alone (441 x 505)
- `j-icon.svg`: the app icon, white mark on a #111111 rounded square (also `app/icon.svg`)
- `j-icon-512.png` (transparent corners), `app/apple-icon.png` (180 px, full square): rendered from it
- In code: `components/logo-mark.tsx` draws it in `currentColor`
