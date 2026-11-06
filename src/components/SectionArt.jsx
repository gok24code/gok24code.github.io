import { useEffect, useRef } from "react";

// Background line-art for each section. Drawn with a pen-stroke effect when the
// section scrolls into view, then each piece does a small idle motion, with a
// gentle scroll parallax. All drawings are original, stroke-only SVG.

function gearPath(cx, cy, teeth, rOut, rIn) {
  const pts = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const p = (r, t) =>
      `${(cx + r * Math.cos(a + t * step)).toFixed(2)} ${(cy + r * Math.sin(a + t * step)).toFixed(2)}`;
    pts.push(
      `${i ? "L" : "M"}${p(rIn, 0)}`,
      `L${p(rOut, 0.12)}`,
      `L${p(rOut, 0.38)}`,
      `L${p(rIn, 0.5)}`,
    );
  }
  return `${pts.join(" ")} Z`;
}

const RobotArm = () => (
  <svg viewBox="0 0 120 120">
    <path d="M22 110 H86" />
    <path d="M30 106 L36 94 H68 L74 106 Z" />
    <circle cx="52" cy="86" r="8" />
    <circle cx="52" cy="86" r="2.5" />
    <path d="M45.5 82 L67.5 42" />
    <path d="M58.5 90 L80.5 50" />
    <path className="hot" d="M60 98 C 76 100, 90 86, 86 64" />
    <g className="sway" style={{ transformOrigin: "74px 46px" }}>
      <circle cx="74" cy="46" r="8.5" />
      <circle cx="74" cy="46" r="3" />
      <path d="M76.3 41.6 L42.3 23.6" />
      <path d="M71.7 50.4 L37.7 32.4" />
      <circle cx="39" cy="28" r="5" />
      <path d="M35 24 L25 17 L18 21" />
      <path d="M35 32 L25 38 L18 34" />
    </g>
  </svg>
);

const Gear = () => (
  <svg viewBox="0 0 120 120">
    <g className="spin">
      <path d={gearPath(60, 60, 12, 46, 38)} />
      <circle cx="60" cy="60" r="16" />
      <circle cx="60" cy="60" r="6" />
      <path d="M60 22 V44 M60 76 V98 M22 60 H44 M76 60 H98" />
    </g>
  </svg>
);

const SolderingIron = () => (
  <svg viewBox="0 0 120 120">
    <g transform="rotate(-32 60 60)">
      <path d="M8 60 L22 57 V63 Z" />
      <path d="M22 57.5 H48 V62.5 H22" />
      <rect x="48" y="54" width="7" height="12" rx="1.5" />
      <rect x="55" y="52" width="42" height="16" rx="8" />
      <path d="M64 53 V67 M70 53 V67 M76 53 V67" />
      <path d="M97 60 C 108 60, 108 74, 118 76" />
      <circle className="hot" cx="8" cy="60" r="2.2" />
    </g>
    <g className="smoke">
      <path className="hot" d="M14 72 C 8 64, 18 60, 12 50" />
      <path className="hot" d="M22 70 C 16 62, 26 58, 20 46" />
    </g>
  </svg>
);

const Pcb = () => (
  <svg viewBox="0 0 120 120">
    <rect x="10" y="18" width="100" height="84" rx="7" />
    <circle cx="19" cy="27" r="3" />
    <circle cx="101" cy="27" r="3" />
    <circle cx="19" cy="93" r="3" />
    <circle cx="101" cy="93" r="3" />
    <rect x="46" y="44" width="28" height="28" rx="2" />
    <path d="M50 44 V39 M56 44 V39 M62 44 V39 M68 44 V39 M50 72 V77 M56 72 V77 M62 72 V77 M68 72 V77" />
    <path d="M20 44 H34 L40 50 H46" />
    <path d="M20 60 H46" />
    <path d="M74 52 H86 L94 44 V34" />
    <path d="M74 64 H92 L98 70 V84" />
    <path d="M56 77 V88 L62 94 H80" />
    <circle className="hot" cx="94" cy="34" r="2.6" />
    <circle className="hot" cx="98" cy="84" r="2.6" />
    <circle cx="20" cy="44" r="2.2" />
    <circle cx="20" cy="60" r="2.2" />
  </svg>
);

const pins = (from, to, n, side) => {
  const d = [];
  for (let i = 0; i < n; i++) {
    const t = from + ((to - from) / (n - 1)) * i;
    if (side === "t") d.push(`M${t} 30 V20`);
    if (side === "b") d.push(`M${t} 90 V100`);
    if (side === "l") d.push(`M30 ${t} H20`);
    if (side === "r") d.push(`M90 ${t} H100`);
  }
  return d.join(" ");
};

const Mcu = () => (
  <svg viewBox="0 0 120 120">
    <rect x="30" y="30" width="60" height="60" rx="5" />
    <rect x="43" y="43" width="34" height="34" rx="2" />
    <circle className="hot" cx="38" cy="38" r="2.5" />
    <path
      d={`${pins(37, 83, 6, "t")} ${pins(37, 83, 6, "b")} ${pins(37, 83, 6, "l")} ${pins(37, 83, 6, "r")}`}
    />
    <path d="M50 60 H70 M60 50 V70" />
  </svg>
);

const Gamepad = () => (
  <svg viewBox="0 0 120 120">
    <g className="bob">
      <path d="M30 46 C 17 46, 9 61, 9 76 C 9 90, 17 98, 26 98 C 34 98, 38 88, 44 84 H76 C 82 88, 86 98, 94 98 C 103 98, 111 90, 111 76 C 111 61, 103 46, 90 46 Z" />
      <path d="M29 66 h6 v-6 h6 v6 h6 v6 h-6 v6 h-6 v-6 h-6 z" />
      <circle cx="85" cy="62" r="4" />
      <circle className="hot" cx="93" cy="70" r="4" />
      <circle cx="85" cy="78" r="4" />
      <circle cx="77" cy="70" r="4" />
      <path d="M54 62 H58 M62 62 H66" />
      <path d="M60 46 C 60 34, 70 30, 72 16" />
    </g>
  </svg>
);

const Joystick = () => (
  <svg viewBox="0 0 120 120">
    <path d="M22 96 L32 72 H88 L98 96 Z" />
    <path d="M22 96 H98 V104 H22 Z" />
    <ellipse cx="60" cy="72" rx="12" ry="3.5" />
    <g className="tilt" style={{ transformOrigin: "60px 72px" }}>
      <path d="M60 72 V40" />
      <circle className="hot" cx="60" cy="32" r="10" />
    </g>
    <ellipse cx="38" cy="86" rx="5" ry="2.5" />
    <ellipse cx="82" cy="86" rx="5" ry="2.5" />
  </svg>
);

const PixelHeart = () => (
  <svg viewBox="0 0 120 120">
    <path
      className="hot pulse"
      d="M35 30 H55 V40 H65 V30 H85 V40 H95 V60 H85 V70 H75 V80 H65 V90 H55 V80 H45 V70 H35 V60 H25 V40 H35 Z"
    />
    <path d="M35 44 H45 V54" />
  </svg>
);

const Cartridge = () => (
  <svg viewBox="0 0 120 120">
    <path d="M30 16 H90 V96 H82 V106 H38 V96 H30 Z" />
    <rect x="40" y="28" width="40" height="32" rx="2" />
    <path className="hot" d="M48 38 L56 46 L48 54 M60 54 H72" />
    <path d="M40 70 H80 M40 76 H80 M40 82 H80" />
    <path d="M44 100 V106 M52 100 V106 M60 100 V106 M68 100 V106 M76 100 V106" />
  </svg>
);

const Sparkle = () => (
  <svg viewBox="0 0 120 120">
    <path
      className="hot twinkle"
      d="M60 14 C 64 46, 74 56, 106 60 C 74 64, 64 74, 60 106 C 56 74, 46 64, 14 60 C 46 56, 56 46, 60 14 Z"
    />
  </svg>
);

const Certificate = () => (
  <svg viewBox="0 0 120 120">
    <rect x="12" y="20" width="96" height="70" rx="3" />
    <rect x="19" y="27" width="82" height="56" rx="2" />
    <path d="M36 42 H84 M42 52 H78 M48 60 H72" />
    <path d="M30 74 H52" />
    <circle className="hot" cx="86" cy="80" r="10" />
    <circle className="hot" cx="86" cy="80" r="5" />
    <path
      className="hot"
      d="M80 88 L76 104 L82 100 L86 106 L88 90 M92 88 L96 104 L90 100 L86 106"
    />
  </svg>
);

const Medal = () => (
  <svg viewBox="0 0 120 120">
    <g className="swing" style={{ transformOrigin: "60px 8px" }}>
      <path d="M40 8 L56 50 M52 8 L64 40 M80 8 L64 50 M68 8 L58 34" />
      <circle cx="60" cy="74" r="24" />
      <circle cx="60" cy="74" r="17" />
      <path
        className="hot"
        d="M60 62 L63.5 69.5 L71.5 70.5 L65.5 76 L67 84 L60 80 L53 84 L54.5 76 L48.5 70.5 L56.5 69.5 Z"
      />
    </g>
  </svg>
);

const GradCap = () => (
  <svg viewBox="0 0 120 120">
    <path d="M60 24 L108 44 L60 64 L12 44 Z" />
    <path d="M30 52 V72 C 30 84, 90 84, 90 72 V52" />
    <g className="swing" style={{ transformOrigin: "96px 49px" }}>
      <path className="hot" d="M96 49 V76" />
      <path className="hot" d="M92 76 H100 L98 86 H94 Z" />
    </g>
  </svg>
);

const ShieldCheck = () => (
  <svg viewBox="0 0 120 120">
    <path d="M60 12 L98 26 V56 C 98 80, 82 96, 60 106 C 38 96, 22 80, 22 56 V26 Z" />
    <path d="M60 22 L88 33 V56 C 88 74, 76 87, 60 95" />
    <path className="hot" d="M42 58 L55 71 L80 44" />
  </svg>
);


const GitBranch = () => (
  <svg viewBox="0 0 120 120">
    <path d="M34 14 V106" />
    <path d="M34 78 C 34 60, 82 62, 82 42 V30" />
    <circle cx="34" cy="20" r="6" />
    <circle cx="34" cy="56" r="6" />
    <circle className="hot" cx="82" cy="24" r="6" />
    <circle cx="34" cy="100" r="6" />
  </svg>
)

const Calendar = () => (
  <svg viewBox="0 0 120 120">
    <rect x="16" y="24" width="88" height="80" rx="8" />
    <path d="M16 44 H104 M40 14 V32 M80 14 V32" />
    <path d="M30 58 h10 v10 h-10 z M54 58 h10 v10 h-10 z M78 58 h10 v10 h-10 z M30 80 h10 v10 h-10 z M54 80 h10 v10 h-10 z" />
    <path className="hot" d="M78 80 h10 v10 h-10 z" />
  </svg>
)

const Keyboard = () => (
  <svg viewBox="0 0 120 120">
    <rect x="8" y="36" width="104" height="52" rx="7" />
    <path d="M20 50 h8 M34 50 h8 M48 50 h8 M62 50 h8 M76 50 h8 M90 50 h10 M20 62 h12 M38 62 h8 M52 62 h8 M66 62 h8 M80 62 h20 M20 74 h8" />
    <path className="hot" d="M34 74 H86" />
    <path d="M92 74 h8" />
  </svg>
)

const Rocket = () => (
  <svg viewBox="0 0 120 120">
    <g className="bob">
      <path d="M60 10 C 78 26, 82 52, 76 80 H44 C 38 52, 42 26, 60 10 Z" />
      <circle cx="60" cy="44" r="8" />
      <path d="M44 66 L30 82 L44 80 M76 66 L90 82 L76 80" />
      <path d="M52 80 V90 M60 80 V94 M68 80 V90" />
    </g>
    <g className="smoke">
      <path className="hot" d="M54 98 C 52 104, 56 108, 54 114" />
      <path className="hot" d="M66 98 C 64 104, 68 108, 66 114" />
    </g>
  </svg>
)

const Flag = () => (
  <svg viewBox="0 0 120 120">
    <path d="M30 108 V14" />
    <path d="M18 108 H44" />
    <g className="swing" style={{ transformOrigin: '30px 18px' }}>
      <path className="hot" d="M30 18 C 46 10, 60 26, 92 18 V58 C 60 66, 46 50, 30 58 Z" />
    </g>
  </svg>
)

const Hourglass = () => (
  <svg viewBox="0 0 120 120">
    <path d="M34 14 H86 M34 106 H86" />
    <path d="M40 14 C 40 44, 60 50, 60 60 C 60 70, 40 76, 40 106" />
    <path d="M80 14 C 80 44, 60 50, 60 60 C 60 70, 80 76, 80 106" />
    <path className="hot" d="M48 96 C 54 88, 66 88, 72 96 Z M60 64 V84" />
  </svg>
)

const Envelope = () => (
  <svg viewBox="0 0 120 120">
    <g className="bob">
      <rect x="12" y="30" width="96" height="64" rx="6" />
      <path d="M14 34 L60 68 L106 34" />
      <path d="M14 92 L48 60 M106 92 L72 60" />
      <circle className="hot" cx="96" cy="34" r="9" />
    </g>
  </svg>
)

const PaperPlane = () => (
  <svg viewBox="0 0 120 120">
    <g className="bob">
      <path d="M10 56 L110 14 L80 104 L58 74 Z" />
      <path d="M58 74 L110 14 M58 74 L52 98 L68 84" />
    </g>
    <path className="hot" d="M8 90 C 20 84, 26 96, 40 88" />
  </svg>
)

// x: 'l' | 'r' edge + offset (vw), y: % of section height, s: size px, d: parallax depth, keep: also on phones
const SETS = {
  projects: [
    { C: RobotArm, x: ["l", 1.2], y: 4, s: 180, r: -4, d: 0.9, keep: true },
    { C: Gear, x: ["r", 2], y: 2, s: 130, r: 0, d: 0.6, keep: true },
    { C: SolderingIron, x: ["r", 0.8], y: 46, s: 160, r: 0, d: 1 },
    { C: Pcb, x: ["l", 0.8], y: 56, s: 150, r: 6, d: 0.7 },
    { C: Mcu, x: ["r", 6], y: 80, s: 100, r: -8, d: 0.5 },
  ],
  games: [
    { C: Gamepad, x: ["l", 1], y: 6, s: 160, r: -8, d: 0.8, keep: true },
    { C: PixelHeart, x: ["r", 3], y: 0, s: 90, r: 6, d: 0.5, keep: true },
    { C: Joystick, x: ["r", 1.5], y: 52, s: 140, r: 0, d: 1 },
    { C: Cartridge, x: ["l", 2.5], y: 60, s: 110, r: 8, d: 0.6 },
    { C: Sparkle, x: ["r", 13], y: 4, s: 44, r: 0, d: 0.3 },
  ],
  activity: [
    { C: GitBranch, x: ['l', 1.5], y: 6, s: 130, r: -6, d: 0.8, keep: true },
    { C: Calendar, x: ['r', 2], y: 4, s: 120, r: 6, d: 0.6, keep: true },
    { C: Keyboard, x: ['r', 1.5], y: 64, s: 150, r: -4, d: 1 },
  ],
  timeline: [
    { C: Rocket, x: ['r', 2.5], y: 4, s: 140, r: 12, d: 0.9, keep: true },
    { C: Flag, x: ['l', 2], y: 10, s: 120, r: -4, d: 0.6, keep: true },
    { C: Hourglass, x: ['l', 1.5], y: 62, s: 120, r: 6, d: 1 },
  ],
  contact: [
    { C: Envelope, x: ['l', 2], y: 10, s: 140, r: -8, d: 0.8, keep: true },
    { C: PaperPlane, x: ['r', 2], y: 6, s: 150, r: 4, d: 1, keep: true },
  ],
  certs: [
    { C: Certificate, x: ["l", 1], y: 4, s: 160, r: -6, d: 0.8, keep: true },
    { C: Medal, x: ["r", 2.5], y: 2, s: 120, r: 0, d: 0.6, keep: true },
    { C: GradCap, x: ["l", 2.5], y: 60, s: 140, r: 4, d: 1 },
    { C: ShieldCheck, x: ["r", 2], y: 58, s: 120, r: -4, d: 0.7 },
  ],
};

export default function SectionArt({ set }) {
  const ref = useRef(null);
  const items = SETS[set] || [];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // number every stroke so each icon draws in sequence
    el.querySelectorAll(".art__i").forEach((icon) => {
      icon
        .querySelectorAll(
          "path, circle, rect, ellipse, line, polyline, polygon",
        )
        .forEach((p, j) => {
          p.setAttribute("pathLength", "1");
          p.style.setProperty("--j", j);
        });
    });
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("drawn");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    if (reduced) return () => io.disconnect();

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const p =
        (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="art" ref={ref} aria-hidden="true">
      {items.map((it, k) => {
        const Icon = it.C;
        const { x, y, s, r, d, keep } = it;
        return (
          <div
            key={k}
            className={`art__i${keep ? " art__i--keep" : ""}`}
            style={{
              [x[0] === "l" ? "left" : "right"]: `${x[1]}vw`,
              top: `${y}%`,
              width: s,
              height: s,
              "--rot": `${r}deg`,
              "--depth": d,
              "--k": k,
            }}
          >
            <Icon />
          </div>
        );
      })}
    </div>
  );
}
