/**
 * Shared SVG gradients and the sparkline drawn on the result cards.
 * The glow itself is CSS: see glow.css, which uses the gradient defined here.
 */

/**
 * Injects the shared gradient defs once. `#icg` is the icon stroke gradient
 * (referenced from glow.css), `#sgr` the sparkline stroke.
 */
export function injectGlowDefs() {
  if (document.getElementById('icoDefs')) return;

  const holder = document.createElement('div');
  holder.id = 'icoDefs';
  holder.setAttribute('aria-hidden', 'true');
  holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  holder.innerHTML = `<svg width="0" height="0"><defs>
    <linearGradient id="icg" gradientUnits="userSpaceOnUse" x1="3" y1="3" x2="21" y2="21">
      <stop offset="0" stop-color="#7df3ff"/><stop offset=".55" stop-color="#4f8cff"/><stop offset="1" stop-color="#9a7bff"/></linearGradient>
    <linearGradient id="sgr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7df3ff"/><stop offset="1" stop-color="#4f6bff"/></linearGradient>
  </defs></svg>`;
  document.body.prepend(holder);
}

/**
 * Decorative sparkline for a specialization card. Deterministic: the same
 * (seed, score) always yields the same curve, via a string hash feeding a
 * linear congruential generator. Trend rises with score; jitter is cosmetic.
 */
export function sparkline(score = 50, seed = 'x', width = 92, height = 30) {
  let state = 0;
  for (const char of String(seed)) state = (state * 31 + char.charCodeAt(0)) >>> 0;
  const nextRandom = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const POINT_COUNT = 16;
  const points = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    const t = i / (POINT_COUNT - 1);
    const value = Math.max(0, Math.min(1, 0.22 + 0.6 * t * (score / 100) + (nextRandom() - 0.5) * 0.3));
    points.push(`${(t * width).toFixed(1)} ${(height - 3 - value * (height - 6)).toFixed(1)}`);
  }

  return `<svg class="sp" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><path d="M${points.join(' L')}" fill="none" stroke="url(#sgr)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
