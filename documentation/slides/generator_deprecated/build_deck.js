// Builds the Showcase Room project overview deck in English and French.
// Text lives in deck_text.js; this file only holds the layout.
//
// Usage (from this folder):
//   npm install
//   npm run build            -> writes ../showcase_room_overview_{en,fr}.pptx
//   node build_deck.js <dir> -> writes the decks to another folder
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const LU = require("react-icons/lu");
const T_ALL = require("./deck_text.js");

const OUT = process.argv[2] || path.join(__dirname, "..");

// pptxgenjs always writes Office's default color palette into the theme.
// Replace it with ours so that scheme colors (and later restyling in PowerPoint) use it.
async function applyTheme(file, theme) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const part = "ppt/theme/theme1.xml";
  const slots = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];
  const scheme = `<a:clrScheme name="${theme.name}">` +
    slots.map((k) => `<a:${k}><a:srgbClr val="${theme.colors[k]}"/></a:${k}>`).join("") + "</a:clrScheme>";
  let xml = await zip.file(part).async("string");
  if (!/<a:clrScheme[\s\S]*?<\/a:clrScheme>/.test(xml)) throw new Error("No color scheme found in " + part);
  xml = xml.replace(/<a:clrScheme[\s\S]*?<\/a:clrScheme>/, scheme).replace(/(<a:theme\b[^>]*\bname=")[^"]*"/, `$1${theme.name}"`);
  zip.file(part, xml);
  fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

const THEME = {
  name: "Cosy Room",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "2A2230", lt1: "FFFFFF", dk2: "6B6072", lt2: "F3EFF6",
    accent1: "E09F3E", accent2: "C8553D", accent3: "4E8762", accent4: "4F6D8F",
    accent5: "8E5572", accent6: "2F7F7B", hlink: "4F6D8F", folHlink: "8E5572",
  },
};
const HEX = {
  text1: THEME.colors.dk1, text2: THEME.colors.dk2, background1: THEME.colors.lt1, background2: THEME.colors.lt2,
  accent1: THEME.colors.accent1, accent2: THEME.colors.accent2, accent3: THEME.colors.accent3,
  accent4: THEME.colors.accent4, accent5: THEME.colors.accent5, accent6: THEME.colors.accent6,
};

// ---------- icons ----------
const iconCache = {};
async function iconData(name, hex) {
  const id = name + hex;
  if (iconCache[id]) return iconCache[id];
  const Comp = LU["Lu" + name];
  if (!Comp) throw new Error("Missing icon Lu" + name);
  let svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { size: 256 }));
  svg = svg.replace(/currentColor/g, "#" + hex);
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  iconCache[id] = "image/png;base64," + buf.toString("base64");
  return iconCache[id];
}

// French typography: non-breaking space before : ; ? ! % and inside « »
function frFix(s) {
  return s.replace(/ ([:;?!%»])/g, " $1").replace(/« /g, "« ");
}
function deepMap(o, f) {
  if (typeof o === "string") return f(o);
  if (Array.isArray(o)) return o.map((x) => deepMap(x, f));
  if (o && typeof o === "object") { const r = {}; for (const k in o) r[k] = deepMap(o[k], f); return r; }
  return o;
}

async function build(lang) {
  const T = lang === "fr" ? deepMap(T_ALL.fr, frFix) : T_ALL.en;
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = T.meta.title;
  pres.author = "ft_transcendence team";
  const C = pres.SchemeColor;
  const SH = pres.shapes;
  const onColor = (k) => (k === "accent1" ? C.text1 : C.background1);
  const onHex = (k) => (k === "accent1" ? HEX.text1 : "FFFFFF");

  // ---------- layouts ----------
  pres.defineSlideMaster({
    title: "TITLE_DARK",
    background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "kicker", type: "body", x: 0.8, y: 1.75, w: 7.8, h: 0.4, fontSize: 14, bold: true, color: C.accent1, charSpacing: 3, margin: 0, valign: "top" }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.2, w: 7.8, h: 1.2, fontSize: 54, bold: true, align: "left", color: C.background1, margin: 0, valign: "top" }, text: "" } },
      { placeholder: { options: { name: "subtitle", type: "body", x: 0.8, y: 3.5, w: 7.4, h: 1.1, fontSize: 20, color: C.background2, margin: 0, valign: "top" }, text: "" } },
      { placeholder: { options: { name: "meta", type: "body", x: 0.8, y: 5.75, w: 7.8, h: 0.8, fontSize: 14, color: C.background2, margin: 0, valign: "top" }, text: "" } },
    ],
  });
  const contentObjects = (dark) => [
    { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.32, w: 10, h: 0.3, fontSize: 12, bold: true, color: dark ? C.accent1 : C.accent2, charSpacing: 2, margin: 0, valign: "top" }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.62, w: 12.13, h: 0.8, fontSize: 36, bold: true, align: "left", color: dark ? C.background1 : C.text1, margin: 0, valign: "top" }, text: "" } },
    { text: { text: T.meta.footer, options: { x: 0.6, y: 7.02, w: 6, h: 0.28, fontSize: 10, color: dark ? C.background2 : C.text2, margin: 0 } } },
  ];
  pres.defineSlideMaster({
    title: "CONTENT", background: { color: C.background1 }, objects: contentObjects(false),
    slideNumber: { x: 12.13, y: 7.02, w: 0.6, h: 0.28, fontSize: 10, color: C.text2, align: "right" },
  });
  pres.defineSlideMaster({
    title: "CONTENT_DARK", background: { color: C.text1 }, objects: contentObjects(true),
    slideNumber: { x: 12.13, y: 7.02, w: 0.6, h: 0.28, fontSize: 10, color: C.background2, align: "right" },
  });

  // ---------- helpers ----------
  const txt = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: "top", color: C.text1 }, o));
  const rect = (s, name, x, y, w, h, o = {}) => {
    const opts = { x, y, w, h, objectName: name };
    if (o.fill) opts.fill = { color: o.fill, transparency: o.transparency || 0 };
    if (o.line) opts.line = { color: o.line, width: o.lineWidth || 1, dashType: o.dash || "solid" };
    if (o.radius !== 0) opts.rectRadius = o.radius ?? 0.12;
    s.addShape(o.radius === 0 ? SH.RECTANGLE : SH.ROUNDED_RECTANGLE, opts);
  };
  const oval = (s, name, x, y, w, h, fill, transparency = 0) =>
    s.addShape(SH.OVAL, { x, y, w, h, objectName: name, fill: { color: fill, transparency } });
  const line = (s, name, x1, y1, x2, y2, o = {}) => {
    const ln = { color: o.color || C.text2, width: o.width || 1.25 };
    if (o.arrow) ln.endArrowType = "triangle";
    if (o.dash) ln.dashType = o.dash;
    s.addShape(SH.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1, line: ln, objectName: name });
  };
  const tile = async (s, name, x, y, size, colorKey, icon) => {
    rect(s, name + " tile", x, y, size, size, { fill: C[colorKey], radius: size * 0.2 });
    const p = size * 0.22;
    s.addImage({ data: await iconData(icon, onHex(colorKey)), x: x + p, y: y + p, w: size - 2 * p, h: size - 2 * p, objectName: name + " icon", altText: name });
  };
  const head = (kicker, title, master = "CONTENT", section) => {
    const sl = pres.addSlide({ masterName: master, sectionTitle: section });
    sl.addText(kicker, { placeholder: "kicker" });
    sl.addText(title, { placeholder: "title" });
    return sl;
  };
  const SEC = T.sections;
  const addSection = (i) => pres.addSection({ title: SEC[i] });

  // ================= 1. Title =================
  addSection(0);
  let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: SEC[0] });
  s.addText(T.s1.kicker, { placeholder: "kicker" });
  s.addText(T.s1.title, { placeholder: "title" });
  s.addText(T.s1.subtitle, { placeholder: "subtitle" });
  s.addText([{ text: T.s1.agenda, options: { breakLine: true } }, { text: T.s1.date }], { placeholder: "meta" });
  {
    const cats = T.categories; // 7 entries {icon,label}
    const colors = ["accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "accent2"];
    const pos = [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2]];
    const size = 1.0, gap = 0.2, x0 = 13.333 - 0.9 - (3 * size + 2 * gap), y0 = 2.0;
    for (let i = 0; i < 7; i++) {
      await tile(s, cats[i].label, x0 + pos[i][0] * (size + gap), y0 + pos[i][1] * (size + gap), size, colors[i], cats[i].icon);
    }
  }

  // ================= 2. Idea =================
  addSection(1);
  s = head(T.s2.kicker, T.s2.title, "CONTENT", SEC[1]);
  txt(s, T.s2.leftHead, { x: 0.6, y: 1.75, w: 5.8, h: 0.4, fontSize: 18, bold: true });
  {
    const colors = ["accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "accent2"];
    for (let i = 0; i < 7; i++) {
      const r = Math.floor(i / 2), c = i % 2;
      const x = 0.6 + c * 2.95, y = 2.35 + r * 0.82;
      await tile(s, T.categories[i].label, x, y, 0.62, colors[i], T.categories[i].icon);
      txt(s, T.categories[i].label, { x: x + 0.8, y, w: 2.0, h: 0.62, fontSize: 16, valign: "middle" });
    }
  }
  txt(s, T.s2.tagline, { x: 0.6, y: 5.75, w: 5.8, h: 0.8, fontSize: 18, italic: true, color: C.accent5 });
  txt(s, T.s2.rightHead, { x: 7.0, y: 1.75, w: 5.7, h: 0.4, fontSize: 18, bold: true });
  line(s, "Steps line", 7.275, 2.62, 7.275, 2.35 + 3 * 0.95 + 0.27, { color: C.text2, width: 1 });
  T.s2.steps.forEach((st, i) => {
    const y = 2.35 + i * 0.95;
    oval(s, "Step " + (i + 1), 7.0, y, 0.55, 0.55, C.accent2);
    txt(s, String(i + 1), { x: 7.0, y, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: C.background1, align: "center", valign: "middle" });
    txt(s, st[0], { x: 7.8, y: y - 0.02, w: 4.9, h: 0.32, fontSize: 16, bold: true });
    txt(s, st[1], { x: 7.8, y: y + 0.3, w: 4.9, h: 0.35, fontSize: 14, color: C.text2 });
  });
  await tile(s, "Members", 7.0, 6.05, 0.55, "accent5", "Users");
  txt(s, T.s2.closing, { x: 7.8, y: 6.05, w: 4.9, h: 0.6, fontSize: 15, bold: true, valign: "middle" });

  // ================= 3. Room with hotspots =================
  s = head(T.s3.kicker, T.s3.title, "CONTENT", SEC[1]);
  {
    const x0 = 0.6, y0 = 1.8, W = 6.4;
    rect(s, "Wall", x0, y0, W, 3.0, { fill: C.background2, radius: 0 });
    rect(s, "Floor", x0, y0 + 3.0, W, 1.5, { fill: C.accent1, transparency: 65, radius: 0 });
    // window
    rect(s, "Window", x0 + 0.45, y0 + 0.45, 1.5, 1.25, { fill: C.accent4, transparency: 55, line: C.background1, lineWidth: 3, radius: 0 });
    line(s, "Window mullion v", x0 + 1.2, y0 + 0.45, x0 + 1.2, y0 + 1.7, { color: C.background1, width: 3 });
    line(s, "Window mullion h", x0 + 0.45, y0 + 1.075, x0 + 1.95, y0 + 1.075, { color: C.background1, width: 3 });
    // painting
    rect(s, "Painting frame", x0 + 2.55, y0 + 0.6, 1.3, 0.95, { fill: C.accent5, radius: 0 });
    rect(s, "Painting canvas", x0 + 2.65, y0 + 0.7, 1.1, 0.75, { fill: C.accent1, transparency: 30, radius: 0 });
    oval(s, "Painting sun", x0 + 3.35, y0 + 0.8, 0.22, 0.22, C.background1);
    s.addShape(SH.ISOSCELES_TRIANGLE, { x: x0 + 2.7, y: y0 + 1.05, w: 0.8, h: 0.4, fill: { color: C.accent3 }, objectName: "Painting hill" });
    // bookshelf
    rect(s, "Bookshelf", x0 + 4.45, y0 + 0.45, 1.55, 2.75, { fill: C.accent2, transparency: 15, radius: 0 });
    const bookColors = [C.background1, C.accent1, C.accent4, C.accent3, C.background2];
    const bw = [0.16, 0.14, 0.18, 0.15, 0.16], bh = [0.5, 0.45, 0.52, 0.4, 0.48];
    [1.1, 1.8, 2.5].forEach((sy, r) => {
      let bx = x0 + 4.6;
      for (let b = 0; b < 5; b++) {
        const k = (b + r) % 5;
        rect(s, `Book ${r}-${b}`, bx, y0 + sy - bh[k], bw[k], bh[k], { fill: bookColors[k], radius: 0 });
        bx += bw[k] + 0.06;
      }
      line(s, "Shelf " + r, x0 + 4.45, y0 + sy, x0 + 6.0, y0 + sy, { color: C.text1, width: 2 });
    });
    // rug, plant, table, record player
    oval(s, "Rug", x0 + 1.4, y0 + 3.55, 3.2, 0.65, C.accent5, 55);
    oval(s, "Plant leaves", x0 + 0.45, y0 + 2.85, 0.7, 0.75, C.accent3);
    rect(s, "Plant pot", x0 + 0.6, y0 + 3.5, 0.4, 0.45, { fill: C.accent2, radius: 0 });
    rect(s, "Table top", x0 + 2.35, y0 + 2.95, 1.75, 0.12, { fill: C.accent5, radius: 0 });
    rect(s, "Table leg left", x0 + 2.5, y0 + 3.07, 0.1, 0.55, { fill: C.accent5, radius: 0 });
    rect(s, "Table leg right", x0 + 3.85, y0 + 3.07, 0.1, 0.55, { fill: C.accent5, radius: 0 });
    rect(s, "Record player", x0 + 2.55, y0 + 2.55, 1.35, 0.4, { fill: C.text1, radius: 0 });
    oval(s, "Record", x0 + 2.75, y0 + 2.47, 0.95, 0.2, C.text2);
    oval(s, "Record label", x0 + 3.12, y0 + 2.53, 0.2, 0.08, C.accent2);
    // hotspots
    const hs = (name, x, y, w, h) => rect(s, name, x, y, w, h, { line: C.text1, lineWidth: 2, dash: "dash", radius: 0.08 });
    hs("Hotspot painting", x0 + 2.45, y0 + 0.5, 1.5, 1.15);
    hs("Hotspot record player", x0 + 2.45, y0 + 2.35, 1.55, 0.72);
    hs("Hotspot bookshelf", x0 + 4.35, y0 + 0.35, 1.75, 2.95);
    const pill = (label, x, y, w) => {
      rect(s, "Label " + label, x, y, w, 0.32, { fill: C.text1, radius: 0.16 });
      txt(s, label, { x, y, w, h: 0.32, fontSize: 12, bold: true, color: C.background1, align: "center", valign: "middle" });
    };
    pill(T.s3.labels[0], x0 + 2.55, y0 + 1.75, 1.3);
    pill(T.s3.labels[1], x0 + 2.75, y0 + 3.2, 1.0);
    pill(T.s3.labels[2], x0 + 4.6, y0 + 3.4, 1.25);
    txt(s, T.s3.caption, { x: x0, y: 6.4, w: W, h: 0.3, fontSize: 11, italic: true, color: C.text2 });
  }
  {
    const icons = ["Image", "SquareDashedMousePointer", "Tags", "Smartphone"];
    const colors = ["accent4", "accent2", "accent3", "accent5"];
    for (let i = 0; i < 4; i++) {
      const y = 1.8 + i * 1.18;
      await tile(s, T.s3.points[i][0], 7.6, y, 0.5, colors[i], icons[i]);
      txt(s, T.s3.points[i][0], { x: 8.3, y: y - 0.02, w: 4.43, h: 0.34, fontSize: 16, bold: true });
      txt(s, T.s3.points[i][1], { x: 8.3, y: y + 0.32, w: 4.43, h: 0.75, fontSize: 14, color: C.text2 });
    }
  }

  // ================= 4. Why 2D =================
  s = head(T.s4.kicker, T.s4.title, "CONTENT", SEC[1]);
  rect(s, "Header 2D", 3.4, 1.7, 4.55, 0.45, { fill: C.accent3, radius: 0.08 });
  txt(s, T.s4.col2, { x: 3.4, y: 1.7, w: 4.55, h: 0.45, fontSize: 15, bold: true, color: C.background1, align: "center", valign: "middle" });
  rect(s, "Header 3D", 8.15, 1.7, 4.58, 0.45, { fill: C.background2, radius: 0.08 });
  txt(s, T.s4.col3, { x: 8.15, y: 1.7, w: 4.58, h: 0.45, fontSize: 15, bold: true, align: "center", valign: "middle" });
  {
    const icons = ["Presentation", "Accessibility", "Clock3", "Trophy"];
    for (let i = 0; i < 4; i++) {
      const y = 2.3 + i * 0.86, h = 0.76, r = T.s4.rows[i];
      await tile(s, r[0], 0.6, y + 0.13, 0.5, "accent2", icons[i]);
      txt(s, r[0], { x: 1.25, y, w: 2.05, h, fontSize: 15, bold: true, valign: "middle" });
      rect(s, "2D cell " + (i + 1), 3.4, y, 4.55, h, { fill: C.background2, radius: 0.08 });
      txt(s, r[1], { x: 3.55, y, w: 4.25, h, fontSize: 14, valign: "middle" });
      rect(s, "3D cell " + (i + 1), 8.15, y, 4.58, h, { line: C.background2, lineWidth: 1.5, radius: 0.08 });
      txt(s, r[2], { x: 8.3, y, w: 4.28, h, fontSize: 14, color: C.text2, valign: "middle" });
    }
    const cards = [[T.s4.how, "Wrench", "accent4", 0.6], [T.s4.look, "Sparkles", "accent5", 6.76]];
    for (const [c, ic, col, x] of cards) {
      rect(s, c[0], x, 5.9, 5.97, 0.85, { fill: C.background2 });
      await tile(s, c[0], x + 0.2, 6.1, 0.45, col, ic);
      txt(s, c[0], { x: x + 0.8, y: 5.98, w: 5.0, h: 0.3, fontSize: 14, bold: true });
      txt(s, c[1], { x: x + 0.8, y: 6.3, w: 5.0, h: 0.38, fontSize: 14, color: C.text2 });
    }
  }

  // ================= 5. Stack =================
  addSection(2);
  s = head(T.s5.kicker, T.s5.title, "CONTENT", SEC[2]);
  {
    const sbox = async (name, x, y, w, h, title, caption, icon, color, o = {}) => {
      rect(s, name, x, y, w, h, o.dashed ? { line: C.text2, lineWidth: 1.25, dash: "dash" } : { fill: C.background2 });
      if (icon) {
        await tile(s, name, x + 0.15, y + 0.15, 0.4, color, icon);
        txt(s, title, { x: x + 0.65, y: y + 0.15, w: w - 0.8, h: 0.4, fontSize: 15, bold: true, valign: "middle" });
        txt(s, caption, { x: x + 0.15, y: y + 0.65, w: w - 0.3, h: h - 0.75, fontSize: 12, color: C.text2 });
      } else {
        txt(s, title, { x: x + 0.15, y: y + 0.1, w: w - 0.3, h: 0.32, fontSize: 14, bold: true });
        txt(s, caption, { x: x + 0.15, y: y + 0.42, w: w - 0.3, h: h - 0.5, fontSize: 12, color: C.text2 });
      }
    };
    // arrows first (under boxes)
    line(s, "Browser to proxy", 2.85, 2.75, 3.35, 2.75, { arrow: true, width: 1.5 });
    line(s, "Proxy to API", 4.9, 2.95, 5.15, 2.95, { arrow: true, width: 1.5 });
    line(s, "API to database", 5.875, 3.7, 5.875, 4.05, { arrow: true, width: 1.5 });
    line(s, "API to files", 7.475, 3.7, 7.475, 4.05, { arrow: true, width: 1.5 });
    line(s, "API to tagging", 6.675, 3.7, 6.675, 5.4, { arrow: true, width: 1.5 });
    line(s, "Browser to shared", 1.725, 3.5, 1.725, 3.95, { width: 1.25, dash: "dash" });
    rect(s, "Docker Compose", 3.1, 1.7, 5.35, 4.9, { line: C.text2, lineWidth: 1.25, dash: "dash" });
    txt(s, T.s5.docker, { x: 3.3, y: 1.8, w: 5.0, h: 0.3, fontSize: 12, bold: true, color: C.text2 });
    await sbox("Browser", 0.6, 2.0, 2.25, 1.5, ...T.s5.browser, "Monitor", "accent5");
    await sbox("Shared package", 0.6, 3.95, 2.25, 1.3, ...T.s5.shared, "Code", "accent6");
    await sbox("Proxy", 3.35, 2.2, 1.55, 1.5, ...T.s5.proxy, "ShieldCheck", "accent4");
    await sbox("NestJS API", 5.15, 2.2, 3.05, 1.5, ...T.s5.api, "Server", "accent2");
    await sbox("PostgreSQL", 5.15, 4.05, 1.45, 1.1, ...T.s5.db);
    await sbox("Files", 6.75, 4.05, 1.45, 1.1, ...T.s5.files);
    await sbox("Image tagging", 5.15, 5.4, 3.05, 1.0, ...T.s5.tagging, null, null, { dashed: true });
    rect(s, "Module badge", 0.6, 5.55, 2.25, 0.7, { fill: C.accent3 });
    txt(s, T.s5.badge, { x: 0.7, y: 5.55, w: 2.05, h: 0.7, fontSize: 13, bold: true, color: C.background1, align: "center", valign: "middle" });
    txt(s, T.s5.whyHead, { x: 8.85, y: 1.7, w: 3.88, h: 0.4, fontSize: 18, bold: true });
    const icons = ["Code", "Blocks", "Briefcase", "TriangleAlert"], cols = ["accent4", "accent3", "accent6", "accent1"];
    for (let i = 0; i < 4; i++) {
      const y = 2.3 + i * 1.0;
      await tile(s, "Why " + (i + 1), 8.85, y, 0.45, cols[i], icons[i]);
      txt(s, T.s5.why[i], { x: 9.45, y: y - 0.03, w: 3.28, h: 0.9, fontSize: 14, bold: i === 3, color: i === 3 ? C.accent2 : C.text1 });
    }
  }

  // ================= 6. Modules overview =================
  addSection(3);
  s = head(T.s6.kicker, T.s6.title, "CONTENT", SEC[3]);
  {
    const stats = [["14", C.accent2], ["+4", C.accent3], ["≈ 70", C.accent4]];
    stats.forEach(([n, col], i) => {
      const y = 1.75 + i * 1.7;
      txt(s, n, { x: 0.6, y, w: 3.6, h: 0.95, fontSize: 60, bold: true, color: col });
      txt(s, T.s6.stats[i], { x: 0.6, y: y + 0.95, w: 3.6, h: 0.6, fontSize: 14, color: C.text2 });
    });
    const colW = 2.577, colGap = 0.2, x0 = 4.6;
    const colColors = [C.accent2, C.accent2, C.accent3];
    T.s6.cols.forEach((col, ci) => {
      const x = x0 + ci * (colW + colGap), y = 1.8;
      rect(s, col.head, x, y, colW, 4.05, { fill: C.background2 });
      txt(s, col.head, { x: x + 0.2, y: y + 0.18, w: colW - 1.0, h: 0.4, fontSize: 16, bold: true, color: colColors[ci] });
      txt(s, col.pts, { x: x + colW - 0.95, y: y + 0.18, w: 0.75, h: 0.4, fontSize: 16, bold: true, color: colColors[ci], align: "right" });
      col.items.forEach(([name, pts], ri) => {
        const ry = y + 0.68 + ri * 0.53;
        txt(s, name, { x: x + 0.2, y: ry, w: colW - 0.9, h: 0.53, fontSize: 14, valign: "middle" });
        for (let k = 0; k < pts; k++) {
          const sq = 0.15, sx = x + colW - 0.2 - (pts - k) * sq - (pts - k - 1) * 0.05;
          rect(s, `Point ${name} ${k + 1}`, sx, ry + 0.19, sq, sq, { fill: colColors[ci], radius: 0 });
        }
      });
    });
    await tile(s, "Replaces 3D", 4.6, 6.12, 0.45, "accent5", "Search");
    txt(s, T.s6.note, { x: 5.2, y: 6.02, w: 7.53, h: 0.65, fontSize: 14, color: C.text2, valign: "middle" });
  }

  // ================= 7. Majors =================
  s = head(T.s7.kicker, T.s7.title, "CONTENT", SEC[3]);
  {
    const icons = ["Layers", "Zap", "MessagesSquare", "UserCog"], cols = ["accent4", "accent2", "accent6", "accent1"];
    for (let i = 0; i < 4; i++) {
      const x = 0.6 + (i % 2) * 6.16, y = 1.75 + Math.floor(i / 2) * 2.5, m = T.s7.mods[i];
      rect(s, m[0], x, y, 5.97, 2.3, { fill: C.background2 });
      await tile(s, m[0], x + 0.3, y + 0.3, 0.75, cols[i], icons[i]);
      txt(s, m[0], { x: x + 1.25, y: y + 0.28, w: 4.45, h: 0.42, fontSize: 20, bold: true });
      txt(s, m[1], { x: x + 1.25, y: y + 0.72, w: 4.45, h: 0.3, fontSize: 12, color: C.text2 });
      txt(s, m[2], { x: x + 0.3, y: y + 1.25, w: 5.37, h: 0.9, fontSize: 15 });
    }
  }

  // ================= 8. Minors =================
  s = head(T.s8.kicker, T.s8.title, "CONTENT", SEC[3]);
  {
    const icons = ["Database", "Upload", "KeyRound", "Shapes", "Search", "ScanEye"];
    const cols = ["accent4", "accent3", "accent1", "accent5", "accent6", "accent2"];
    for (let i = 0; i < 6; i++) {
      const w = 3.843, x = 0.6 + (i % 3) * (w + 0.3), y = 1.75 + Math.floor(i / 3) * 2.5, m = T.s8.mods[i];
      rect(s, m[0], x, y, w, 2.3, { fill: C.background2 });
      await tile(s, m[0], x + 0.25, y + 0.25, 0.6, cols[i], icons[i]);
      txt(s, m[0], { x: x + 1.0, y: y + 0.22, w: w - 1.2, h: 0.38, fontSize: 17, bold: true });
      txt(s, m[1], { x: x + 1.0, y: y + 0.6, w: w - 1.2, h: 0.3, fontSize: 12, color: C.text2 });
      txt(s, m[2], { x: x + 0.25, y: y + 1.05, w: w - 0.5, h: 1.15, fontSize: 14 });
    }
  }

  // ================= 9. Buffer =================
  s = head(T.s9.kicker, T.s9.title, "CONTENT", SEC[3]);
  {
    const icons = ["Languages", "Smartphone", "ShieldCheck", "Globe"], cols = ["accent5", "accent6", "accent4", "accent3"];
    for (let i = 0; i < 4; i++) {
      const w = 2.8, x = 0.6 + i * (w + 0.31), y = 1.75, m = T.s9.mods[i];
      rect(s, m[0], x, y, w, 3.65, { fill: C.background2 });
      await tile(s, m[0], x + 0.25, y + 0.25, 0.7, cols[i], icons[i]);
      txt(s, m[0], { x: x + 0.25, y: y + 1.1, w: w - 0.5, h: 0.6, fontSize: 17, bold: true, valign: "bottom" });
      txt(s, m[1], { x: x + 0.25, y: y + 1.75, w: w - 0.5, h: 0.3, fontSize: 12, color: C.text2 });
      txt(s, m[2], { x: x + 0.25, y: y + 2.15, w: w - 0.5, h: 1.35, fontSize: 14 });
    }
    await tile(s, "Why a buffer", 0.6, 5.85, 0.55, "accent2", "LifeBuoy");
    txt(s, T.s9.note, { x: 1.35, y: 5.75, w: 11.38, h: 0.75, fontSize: 16, valign: "middle" });
  }

  // ================= 10. DB tables =================
  addSection(4);
  s = head(T.s10.kicker, T.s10.title, "CONTENT", SEC[4]);
  {
    const BW = 2.4, BH = 0.78;
    const cx = [0.6, 3.45, 6.3];
    const L = (n, a, b, c, d) => line(s, n, a, b, c, d, { color: C.text2, width: 1.25 });
    L("users-oauth", 3.45, 3.72, 3.0, 2.14);
    L("users-sessions", 3.45, 3.9, 3.0, 3.34);
    L("users-account_requests", 3.45, 4.12, 3.0, 4.54);
    L("users-messages", 3.75, 4.33, 2.7, 5.35);
    L("users-rooms", 4.65, 3.55, 4.65, 2.53);
    L("users-friendships", 4.65, 4.33, 4.65, 5.35);
    L("users-contents", 5.85, 3.9, 6.3, 3.34);
    L("users-files", 5.85, 4.12, 6.3, 4.54);
    L("contents-tags", 7.5, 2.95, 7.5, 2.53);
    L("contents-files", 7.5, 3.73, 7.5, 4.15);
    const dom = { acc: C.accent4, room: C.accent3, soc: C.accent2 };
    const tables = [
      ["oauth_accounts", 0, 1.75, "acc"], ["sessions", 0, 2.95, "acc"], ["account_requests", 0, 4.15, "acc", true], ["messages", 0, 5.35, "soc"],
      ["rooms", 1, 1.75, "room"], ["users", 1, 3.55, "acc"], ["friendships", 1, 5.35, "soc"],
      ["content_tags", 2, 1.75, "room"], ["contents", 2, 2.95, "room"], ["files", 2, 4.15, "room"],
    ];
    for (const [name, c, y, d, dashed] of tables) {
      const x = cx[c];
      rect(s, "Table " + name, x, y, BW, BH, { fill: C.background1, line: dom[d], lineWidth: name === "users" ? 2.5 : 1.75, dash: dashed ? "dash" : "solid", radius: 0.08 });
      txt(s, name, { x: x + 0.15, y: y + 0.1, w: BW - 0.3, h: 0.3, fontSize: 14, bold: true, color: dom[d], fontFace: "Courier New" });
      txt(s, T.s10.captions[name], { x: x + 0.15, y: y + 0.42, w: BW - 0.3, h: 0.3, fontSize: 11, color: C.text2 });
    }
    const legend = [[T.s10.legend[0], dom.acc, 0.6, 1.4], [T.s10.legend[1], dom.room, 2.1, 2.1], [T.s10.legend[2], dom.soc, 4.3, 1.1]];
    for (const [label, col, x, w] of legend) {
      rect(s, "Legend " + label, x, 6.44, 0.22, 0.22, { fill: col, radius: 0.04 });
      txt(s, label, { x: x + 0.32, y: 6.4, w, h: 0.3, fontSize: 12, color: C.text2, valign: "middle" });
    }
    rect(s, "Legend GDPR", 5.5, 6.44, 0.22, 0.22, { line: C.text2, lineWidth: 1.25, dash: "dash", radius: 0.04 });
    txt(s, T.s10.legend[3], { x: 5.82, y: 6.4, w: 2.9, h: 0.3, fontSize: 12, color: C.text2, valign: "middle" });
    txt(s, T.s10.rightHead, { x: 9.1, y: 1.75, w: 3.63, h: 0.4, fontSize: 18, bold: true });
    const icons = ["House", "EyeOff", "Scissors"], cols = ["accent3", "accent4", "accent2"];
    for (let i = 0; i < 3; i++) {
      const y = 2.35 + i * 1.4;
      await tile(s, "Key choice " + (i + 1), 9.1, y, 0.45, cols[i], icons[i]);
      txt(s, T.s10.choices[i], { x: 9.7, y: y - 0.03, w: 3.03, h: 1.3, fontSize: 14 });
    }
  }

  // ================= 11. contents table =================
  s = head(T.s11.kicker, T.s11.title, "CONTENT", SEC[4]);
  {
    const segs = [
      [0.6, 6.1, "accent3", T.s11.seg[0]], [6.8, 1.9, "accent1", T.s11.seg[1]], [8.8, 3.93, "accent5", T.s11.seg[2]],
    ];
    for (const [x, w, col, sg] of segs) {
      rect(s, "Segment " + sg.label, x, 1.8, w, 1.25, { fill: C[col], radius: 0.1 });
      txt(s, sg.label, { x: x + 0.2, y: 1.92, w: w - 0.4, h: 0.35, fontSize: 16, bold: true, color: onColor(col), fontFace: sg.code ? "Courier New" : undefined });
      txt(s, sg.body, { x: x + 0.2, y: 2.32, w: w - 0.4, h: 0.65, fontSize: 14, color: onColor(col), fontFace: sg.bodyCode ? "Courier New" : undefined });
      txt(s, sg.caption, { x, y: 3.12, w, h: 0.5, fontSize: 12, italic: true, color: C.text2 });
    }
    txt(s, T.s11.exHead, { x: 0.6, y: 3.75, w: 8, h: 0.4, fontSize: 16, bold: true });
    const exCols = ["accent4", "accent2", "accent5", "accent6"];
    T.s11.examples.forEach(([type, attrs], i) => {
      const w = 2.9, x = 0.6 + i * (w + 0.177), y = 4.2;
      rect(s, "Example " + type, x, y, w, 1.35, { fill: C.background2 });
      txt(s, type, { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.32, fontSize: 15, bold: true, color: C[exCols[i]], fontFace: "Courier New" });
      txt(s, attrs, { x: x + 0.2, y: y + 0.52, w: w - 0.4, h: 0.75, fontSize: 14, fontFace: "Courier New", color: C.text1 });
    });
    const notes = [[T.s11.notes[0], "ShieldCheck", "accent4", 0.6], [T.s11.notes[1], "Tags", "accent2", 6.76]];
    for (const [n, ic, col, x] of notes) {
      await tile(s, "Note " + ic, x, 5.9, 0.45, col, ic);
      txt(s, n, { x: x + 0.6, y: 5.83, w: 5.37, h: 0.85, fontSize: 14, valign: "middle" });
    }
  }

  // ================= 12. Workload overview =================
  addSection(5);
  s = head(T.s12.kicker, T.s12.title, "CONTENT", SEC[5]);
  {
    const icons = ["Boxes", "Handshake", "Split", "Split"], cols = ["accent4", "accent3", "accent2", "accent5"];
    for (let i = 0; i < 4; i++) {
      const y = 1.8 + i * 1.18, p = T.s12.principles[i];
      await tile(s, p[0], 0.6, y, 0.5, cols[i], icons[i]);
      txt(s, p[0], { x: 1.3, y: y - 0.02, w: 5.0, h: 0.34, fontSize: 16, bold: true });
      txt(s, p[1], { x: 1.3, y: y + 0.32, w: 5.0, h: 0.7, fontSize: 14, color: C.text2 });
    }
    rect(s, "Total card", 6.9, 1.8, 5.83, 1.9, { fill: C.text1 });
    txt(s, "71", { x: 7.2, y: 1.9, w: 1.9, h: 1.05, fontSize: 60, bold: true, color: C.accent1, valign: "middle" });
    txt(s, T.s12.total[0], { x: 9.0, y: 2.05, w: 3.5, h: 0.45, fontSize: 18, bold: true, color: C.background1 });
    txt(s, T.s12.total[1], { x: 9.0, y: 2.5, w: 3.5, h: 0.9, fontSize: 13, color: C.background2 });
    T.s12.teams.forEach((tm, i) => {
      const x = 6.9 + i * 3.03, y = 3.95, w = 2.8;
      rect(s, tm[0], x, y, w, 2.05, { fill: C.background2 });
      txt(s, tm[0], { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: 0.35, fontSize: 18, bold: true });
      txt(s, tm[1], { x: x + 0.25, y: y + 0.58, w: w - 0.5, h: 0.6, fontSize: 32, bold: true, color: C.accent2 });
      txt(s, tm[2], { x: x + 0.25, y: y + 1.18, w: w - 0.5, h: 0.3, fontSize: 12, color: C.text2 });
      txt(s, tm[3], { x: x + 0.25, y: y + 1.52, w: w - 0.5, h: 0.4, fontSize: 15, bold: true });
    });
    txt(s, T.s12.footnote, { x: 6.9, y: 6.15, w: 5.83, h: 0.6, fontSize: 11, color: C.text2 });
  }

  // ================= 13-14. Splits =================
  const GROUP_STYLE = { A: ["accent4", "Server"], B: ["accent1", "Fingerprint"], C: ["accent2", "Users"], D: ["accent3", "Images"], E: ["accent5", "Sofa"] };
  const groupCard = async (sl, g, x, y, w, h) => {
    const [col, ic] = GROUP_STYLE[g.key];
    rect(sl, "Group " + g.key, x, y, w, h, { fill: C.background2 });
    await tile(sl, "Group " + g.key, x + 0.2, y + 0.2, 0.55, col, ic);
    const numCol = col === "accent1" ? C.text1 : C[col];
    txt(sl, g.pdays, { x: x + w - 1.4, y: y + 0.12, w: 1.2, h: 0.5, fontSize: 26, bold: true, color: numCol, align: "right" });
    txt(sl, T.unit, { x: x + w - 1.4, y: y + 0.6, w: 1.2, h: 0.25, fontSize: 11, color: C.text2, align: "right" });
    txt(sl, `${g.key}. ${g.name}`, { x: x + 0.2, y: y + 0.92, w: w - 0.4, h: 0.62, fontSize: 16, bold: true });
    const runs = [];
    const sections = [[T.labels.core, g.core], [T.labels.buffer, g.buffer], [T.labels.mand, g.mand]];
    sections.forEach(([label, items], si) => {
      runs.push({ text: label, options: { fontSize: 10, bold: true, color: C.text2, charSpacing: 1, breakLine: true, paraSpaceBefore: si ? 8 : 0, paraSpaceAfter: 2 } });
      if (!items.length) runs.push({ text: "—", options: { fontSize: 14, color: C.text2, breakLine: si < 2 } });
      items.forEach((it, ii) => runs.push({ text: it, options: { fontSize: 14, bullet: { indent: 12 }, paraSpaceAfter: 2, breakLine: !(si === 2 && ii === items.length - 1) } }));
    });
    txt(sl, runs, { x: x + 0.2, y: y + 1.6, w: w - 0.35, h: h - 1.7 });
  };
  s = head(T.s13.kicker, T.s13.title, "CONTENT", SEC[5]);
  for (let i = 0; i < 4; i++) await groupCard(s, T.s13.groups[i], 0.6 + i * (2.8 + 0.31), 1.7, 2.8, 4.85);
  txt(s, T.s13.note, { x: 0.6, y: 6.62, w: 12.13, h: 0.3, fontSize: 12, italic: true, color: C.text2 });
  s = head(T.s14.kicker, T.s14.title, "CONTENT", SEC[5]);
  for (let i = 0; i < 5; i++) await groupCard(s, T.s14.groups[i], 0.6 + i * (2.266 + 0.2), 1.7, 2.266, 4.85);
  txt(s, T.s14.note, { x: 0.6, y: 6.62, w: 12.13, h: 0.3, fontSize: 12, italic: true, color: C.text2 });

  // ================= 15. Contracts =================
  s = head(T.s15.kicker, T.s15.title, "CONTENT", SEC[5]);
  {
    const pillCol = ["accent4", "accent1", "text1", "accent3", "text1", "text1", "accent3"];
    T.s15.rows.forEach(([prov, cons, desc], i) => {
      const y = 1.72 + i * 0.68;
      rect(s, "Contract " + (i + 1), 0.6, y, 12.13, 0.6, { fill: C.background2, radius: 0.08 });
      const pc = pillCol[i];
      rect(s, "Provider " + (i + 1), 0.7, y + 0.1, 2.75, 0.4, { fill: C[pc], radius: 0.2 });
      txt(s, prov, { x: 0.7, y: y + 0.1, w: 2.75, h: 0.4, fontSize: 14, bold: true, color: pc === "accent1" ? C.text1 : C.background1, align: "center", valign: "middle" });
      line(s, "Arrow " + (i + 1), 3.55, y + 0.3, 3.95, y + 0.3, { arrow: true, width: 1.5, color: C.text2 });
      txt(s, cons, { x: 4.1, y, w: 2.35, h: 0.6, fontSize: 14, bold: true, valign: "middle" });
      txt(s, desc, { x: 6.55, y, w: 6.05, h: 0.6, fontSize: 14, valign: "middle" });
    });
    txt(s, T.s15.legend, { x: 0.6, y: 6.55, w: 12.13, h: 0.3, fontSize: 12, italic: true, color: C.text2 });
  }

  // ================= 16. Open decisions =================
  addSection(6);
  s = head(T.s16.kicker, T.s16.title, "CONTENT_DARK", SEC[6]);
  T.s16.items.forEach((it, i) => {
    const y = 1.85 + i * 0.9;
    rect(s, "Decision " + (i + 1), 0.6, y + 0.05, 0.5, 0.5, { fill: C.accent1, radius: 0.1 });
    txt(s, String(i + 1), { x: 0.6, y: y + 0.05, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: C.text1, align: "center", valign: "middle" });
    txt(s, it, { x: 1.3, y, w: 6.7, h: 0.6, fontSize: 16, color: C.background1, valign: "middle" });
  });
  rect(s, "Docs card", 8.6, 1.85, 4.13, 3.75, { fill: C.background1, transparency: 90 });
  txt(s, T.s16.docsHead, { x: 8.85, y: 2.05, w: 3.7, h: 0.4, fontSize: 16, bold: true, color: C.background1 });
  T.s16.docs.forEach(([f, d], i) => {
    const y = 2.6 + i * 0.72;
    txt(s, f, { x: 8.85, y, w: 3.7, h: 0.3, fontSize: 14, bold: true, color: C.accent1, fontFace: "Courier New" });
    txt(s, d, { x: 8.85, y: y + 0.3, w: 3.7, h: 0.3, fontSize: 12, color: C.background2 });
  });

  const file = path.join(OUT, T.meta.file);
  await pres.writeFile({ fileName: file });
  await applyTheme(file, THEME);
  console.log("wrote", file);
}

(async () => {
  await build("en");
  await build("fr");
})().catch((e) => { console.error(e); process.exit(1); });
