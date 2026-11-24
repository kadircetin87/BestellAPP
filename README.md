# BestellApp — Restaurant Ordering App

A single-page food ordering app built with plain HTML, CSS and JavaScript.
Guests browse the menu, add dishes to the basket, change quantities and place a
test order. No framework, no build step, no backend.

## Features

- 12 dishes rendered dynamically from a JavaScript data object
- Basket with quantity increase / decrease and single-item removal
- Live subtotal, delivery fee and total calculation
- Sticky desktop basket, mobile basket as a dialog with a badge counter
- Test order confirmation dialog — no `alert()`
- Responsive down to 320 px, no horizontal scrolling
- Locally hosted fonts (Palanquin, Palanquin Dark) with their OFL licences

## Run locally

Open `index.html` in a browser. Nothing has to be installed.

## Project structure

```
index.html      page markup
style.css       all styles, including the media queries
script.js       rendering, basket logic, dialogs
scripts/db.js   dish data and the delivery fee
assets/         images, icons and fonts
```

## Built with

HTML5 · CSS3 (Flexbox, Grid, custom properties) · Vanilla JavaScript (ES6)

---

School project — BestellApp, 2026.
