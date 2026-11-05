// Original blueprint-style line drawings for every product. Each is a string of
// SVG markup drawn in currentColor, so the stylesheet controls the colour.

// Shared wrapper: sets the drawing box and default line style.
const svg = (label, body, box = "0 0 320 220") =>
  `<svg viewBox="${box}" role="img" aria-label="${label}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

// Thin dimension line with end ticks and a measurement label.
const dim = (x1, x2, y, text) =>
  `<g class="dim"><path d="M${x1} ${y}H${x2}M${x1} ${y - 5}v10M${x2} ${y - 5}v10"/><text x="${(x1 + x2) / 2}" y="${y - 7}" text-anchor="middle">${text}</text></g>`;

// Builds repeated vertical blade rows for the turbofan section. Height shrinks
// along the core to show compression, then grows through the turbine.
const bladeRows = (start, gap, heights) => heights.map((h, i) => {
  const x = start + i * gap;
  return `<path d="M${x} ${110 - h}V${110 + h}M${x + 4} ${110 - h + 2}V${110 + h - 2}" class="thin"/>`;
}).join("");

// Builds a radial fan used in the hero and the knob. tilt skews each blade.
function fanBlades(cx, cy, inner, outer, count, tilt) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const b = a + tilt;
    const c = a + tilt * 1.7;
    const p = (r, t) => `${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`;
    out += `<path d="M${p(inner, a)}Q${p((inner + outer) / 2, b)} ${p(outer, c)}L${p(outer, c + 0.16)}Q${p((inner + outer) / 2, b + 0.2)} ${p(inner, a + 0.2)}Z"/>`;
  }
  return out;
}

const ART = {
  turbofan: svg("Sectioned turbofan engine on a stand", `
    <path d="M40 58c34-16 78-18 112-8l62 22h44v76h-44l-62 22c-34 10-78 8-112-8z"/>
    <path d="M18 110l26-13v26z"/><path d="M44 97c8-2 14-2 20 0v26c-6 2-12 2-20 0z"/>
    ${bladeRows(66, 8, [50, 48, 46])}
    ${bladeRows(104, 7, [28, 25, 22, 20, 18, 16])}
    <rect x="148" y="94" width="18" height="32" rx="3"/>
    ${bladeRows(172, 8, [18, 22, 26, 30])}
    <path d="M60 110H258" stroke-dasharray="10 4 2 4" class="thin"/>
    <path d="M214 148v30M120 174v4M70 178h190l12 16H58z"/>
    ${dim(40, 258, 212, "SECTIONED CORE")}`),

  jet: svg("Original concept jet seen from above on a display stand", `
    <path d="M160 14c8 12 12 30 13 52l74 62v16l-68-18-4 30 24 18v12l-39-8-39 8v-12l24-18-4-30-68 18v-16l74-62c1-22 5-40 13-52z"/>
    <path d="M151 44c5-6 13-6 18 0l-2 24h-14z" class="thin"/>
    <path d="M160 70v120" stroke-dasharray="10 4 2 4" class="thin"/>
    <path d="M100 118l-28 24M220 118l28 24" class="thin"/>`),

  stick: svg("A forked stick resting in a printed presentation box", `
    <rect x="22" y="34" width="276" height="152" rx="10"/><rect x="36" y="48" width="248" height="124" rx="6" class="thin"/>
    <path d="M58 132c56-14 128-10 206 14"/><path d="M100 124c4-14 10-20 20-24M188 130c4-12 8-16 14-20M136 124c-6 8-10 10-18 12"/>
    <text x="160" y="84" text-anchor="middle" class="label">ENGINEERING STICK</text>`),

  square: svg("Layout square with drill size holes and angle marks", `
    <path d="M50 24v172h172z"/><path d="M68 72v98h96z" class="thin"/>
    ${Array.from({ length: 15 }, (_, i) => `<path class="thin" d="M50 ${36 + i * 11}h${i % 5 ? 6 : 12}M${62 + i * 11} 196v-${i % 5 ? 6 : 12}"/>`).join("")}
    ${[[88, 120, 11], [110, 142, 9], [128, 158, 7], [146, 170, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}
    <circle cx="86" cy="150" r="9"/><circle cx="84" cy="96" r="7"/>
    <text x="238" y="70" class="label">DRILL</text><text x="238" y="88" class="label">GAUGE</text>`),

  gauge: svg("Centre finding marking gauge with hex sockets and stepped offsets", `
    <path d="M20 106l34-30h212l34 30-34 30H54z"/><path d="M160 80v52M134 106h52" class="thin"/><circle cx="160" cy="106" r="6"/>
    ${[56, 84, 112, 208, 236, 264].map((x) => `<path d="M${x - 9} 106l4.500-8h9l4.500 8-4.500 8h-9z"/>`).join("")}
    <path d="M84 136v20h24v12h24v12h24v-44" class="thin"/>
    ${dim(84, 156, 200, "15 / 20 / 25 / 30")}`),

  pliers: svg("Print-in-place locking pliers", `
    <path d="M24 92l70-36h170c6 0 10 4 10 10v22h18v30h-30l-8-8H128l-34 34-30 8-8-16 18-28z"/>
    <path d="M30 96l40 12M46 88c8 4 14 10 20 18" class="thin"/>
    <circle cx="96" cy="104" r="9"/><circle cx="134" cy="132" r="9"/>
    <path d="M134 132l150 30-2 12-148-26" /><path d="M146 84c8-10 8 10 16 0s8 10 16 0 8 10 16 0 8 10 16 0 8 10 16 0 8 10 16 0"/>
    <text x="214" y="200" class="label" text-anchor="middle">PRINT IN PLACE</text>`),

  tray: svg("Flip-down keyboard tray mounted under a desk", `
    <path d="M10 28h300v14H10z"/><path d="M60 42v14l36 40 42 8M260 42v14l-36 40-42 8" />
    <circle cx="96" cy="118" r="26"/><circle cx="96" cy="118" r="9"/>
    ${Array.from({ length: 16 }, (_, i) => { const a = i / 16 * 6.283; return `<path class="thin" d="M${(96 + 26 * Math.cos(a)).toFixed(1)} ${(118 + 26 * Math.sin(a)).toFixed(1)}L${(96 + 32 * Math.cos(a)).toFixed(1)} ${(118 + 32 * Math.sin(a)).toFixed(1)}"/>`; }).join("")}
    <path d="M80 158l196-26 26 42-214 30z"/><path d="M104 164l166-22 16 26-178 24z" class="thin"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path class="thin" d="M${112 + i * 2} ${172 + i * 4}l${160 + i * 2} -22"/>`).join("")}`),

  knob: svg("Exploded view of a clip-on keyboard control knob", `
    <ellipse cx="160" cy="34" rx="52" ry="16"/><path d="M108 34v22c0 9 23 16 52 16s52-7 52-16V34"/>
    ${Array.from({ length: 17 }, (_, i) => `<path class="thin" d="M${112 + i * 6} ${40 + Math.sin(i / 16 * 3.14) * 12}v18"/>`).join("")}
    <path d="M160 74v10" stroke-dasharray="4 4"/>
    <path d="M92 104l68-20 68 20-68 20z"/><path d="M92 104v16l68 20 68-20v-16"/>
    <path d="M160 142v10" stroke-dasharray="4 4"/>
    <path d="M100 172l60-18 60 18-60 18z"/><path d="M100 172v10l60 18 60-18v-10"/>
    <path d="M128 172c14-8 50-8 64 0" class="accent"/><path d="M140 176l10-6M170 170l10 6" class="accent"/>`),

  keycap: svg("Braille key cap with four raised dots", `
    <path d="M60 150l34-96h132l34 96z"/><path d="M60 150v18l12 10h176l12-10v-18"/><path d="M94 54l-34 96M226 54l34 96" class="thin"/>
    ${[[146, 82], [174, 82], [146, 106], [174, 118]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/><circle cx="${x}" cy="${y}" r="3" class="thin"/>`).join("")}
    ${dim(60, 260, 208, "RAISED DOTS")}`),

  lightswitch: svg("Over-engineered geared light switch lever", `
    <path d="M86 16h148l22 22v144l-22 22H86l-22-22V38z"/><rect x="128" y="34" width="64" height="150" rx="6" class="thin"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path class="thin" d="M126 ${44 + i * 10}h10M184 ${44 + i * 10}h10"/>`).join("")}
    <circle cx="124" cy="140" r="24"/><circle cx="124" cy="140" r="8"/><circle cx="196" cy="140" r="24"/><circle cx="196" cy="140" r="8"/>
    ${Array.from({ length: 24 }, (_, i) => { const t = i / 24 * 6.283; const c = i % 2 ? 196 : 124; return `<path class="thin" d="M${(c + 24 * Math.cos(t)).toFixed(1)} ${(140 + 24 * Math.sin(t)).toFixed(1)}L${(c + 29 * Math.cos(t)).toFixed(1)} ${(140 + 29 * Math.sin(t)).toFixed(1)}"/>`; }).join("")}
    <path d="M196 140l52 40" class="accent"/><circle cx="252" cy="183" r="9" class="accent"/>
    <circle cx="88" cy="40" r="4"/><circle cx="232" cy="40" r="4"/><circle cx="88" cy="180" r="4"/><circle cx="232" cy="180" r="4"/>`),

  plaque: svg("Custom text plaque", `<rect x="20" y="60" width="280" height="100" rx="12"/>`),
};

// Large animated turbofan face for the hero. The blade group spins in CSS.
const HERO_FAN = `<svg viewBox="0 0 400 400" role="img" aria-label="Animated turbofan fan seen from the front" fill="none" stroke="currentColor" stroke-width="1.6">
  <circle cx="200" cy="200" r="194" class="thin"/><circle cx="200" cy="200" r="178"/>
  <circle cx="200" cy="200" r="168" class="thin" stroke-dasharray="2 8"/>
  <g class="spin">${fanBlades(200, 200, 44, 164, 26, 0.5)}</g>
  <circle cx="200" cy="200" r="42" fill="#0a1422"/><path d="M200 164a36 36 0 0 1 0 72 18 18 0 0 0 0-36 18 18 0 0 1 0-36z" class="accent spin-fast"/>
</svg>`;
