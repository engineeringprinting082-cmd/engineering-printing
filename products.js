// Store catalogue. Edit this file to change prices, colours or products.
// price is in CAD. art names an original drawing in art.js. Swap in a real
// photo of a finished print by adding: photo: "file-name.jpg"

// Shared colour choices, matched to common PLA filament.
const MODEL_COLOURS = ["White", "Navy Blue", "Silver Grey", "Black"];
const TOOL_COLOURS = ["Orange", "Black", "Silver Grey", "Navy Blue"];

// Two-tone plaque choices. Plaques are text only, with no logos.
const PLAQUE_COLOURS = ["Blue text on white", "White text on blue"];

const PRODUCTS = [
  {
    id: "turbofan-cutaway", name: "Sectioned Turbofan Display", category: "Display", price: 89, tag: "Flagship",
    size: "About 30 cm long, multi-part build", colours: MODEL_COLOURS, art: "turbofan",
    blurb: "A cutaway turbofan showing the fan, compressor and turbine stages on a matching stand.",
  },
  {
    id: "concept-jet", name: "Concept Jet Desk Model", category: "Display", price: 34,
    size: "About 20 cm long, with stand", colours: MODEL_COLOURS, art: "jet",
    blurb: "An original twin-tail concept jet, angled on a faceted display stand.",
  },
  {
    id: "engineering-stick", name: "Engineering Stick Gift Box", category: "Gifts", price: 15, tag: "Gift pick",
    size: "About 25 cm long", colours: ["White box", "Black box"], art: "stick",
    blurb: "One highly advanced stick, presented in its own printed case. A joke every engineer will get.",
  },
  {
    id: "drill-square", name: "Layout Square and Drill Gauge", category: "Tools", price: 14,
    size: "About 15 x 17 cm", colours: TOOL_COLOURS, art: "square",
    blurb: "A triangular layout square with ruler edges, angle marks and drill size holes from 3 to 15 mm.",
  },
  {
    id: "marking-gauge", name: "Centre-Finding Marking Gauge", category: "Tools", price: 9,
    size: "About 15 cm long", colours: TOOL_COLOURS, art: "gauge",
    blurb: "Hooks over a board edge to find centre and mark offsets of 15 to 30 mm, with hex sockets for pencils.",
  },
  {
    id: "locking-pliers", name: "Print-in-Place Locking Pliers", category: "Tools", price: 16,
    size: "About 14 cm long", colours: TOOL_COLOURS, art: "pliers",
    blurb: "Working locking pliers that come off the printer fully assembled. A great desk conversation piece.",
  },
  {
    id: "keyboard-tray", name: "Flip-Down Keyboard Tray", category: "Desk", price: 59, tag: "Desk upgrade",
    size: "Fits most full-size keyboards", colours: ["Orange and white", "Black and white"], art: "tray",
    blurb: "A geared under-desk tray that folds your keyboard out of the way. Mounting screws required.",
  },
  {
    id: "keyboard-knob", name: "Clip-On Knob for Logitech MX Keyboards", category: "Desk", price: 34, tag: "New",
    size: "Clips onto the top edge of the keyboard", colours: ["Black and gold", "Black and orange"], art: "knob",
    blurb: "Spin to control your volume and more from a chunky knurled knob on your MX keyboard.",
  },
  {
    id: "braille-keycaps", name: "Braille Key Caps for Logitech MX Mechanical", category: "Desk", price: 12,
    size: "Sold as a set, tell us which keys in your notes", colours: ["Navy Blue", "Black", "White"], art: "keycap",
    blurb: "Key caps with raised Braille dots, so you can find your keys by touch.",
  },
  {
    id: "lightswitch", name: "Over-Engineered Light Switch", category: "Gifts", price: 29, tag: "Conversation piece",
    size: "Decorative lever for a standard wall switch", colours: ["Silver and copper", "Black and brass"], art: "lightswitch",
    blurb: "Why flick a switch when you can pull a lever through a geared rack? No wiring involved.",
  },
  {
    id: "custom-plaque", name: "Custom Two-Colour Plaque", category: "Gifts", price: 22,
    size: "About 20 cm wide", colours: PLAQUE_COLOURS, art: "plaque", custom: "plaque",
    blurb: "Your name, team or project in raised blue and white lettering. Text only.",
  },
];

// Pricing rules used by the cart.
const STORE = {
  orderEmail: "engineeringprinting082@gmail.com",
  web3formsKey: "359423a3-b68b-40be-a110-309ac2b76a8d",        // Public Web3Forms access key; orders are sent to the inbox tied to it
  shippingFlat: 12,        // Flat Canadian shipping in CAD
  studentRate: 0.10,       // 10% off item subtotal
  maxQuantity: 20,         // Larger orders should email directly
  plaqueMaxChars: 24,
};

// Canadian school email domains accepted for the student discount. Any .edu
// address also qualifies. Subdomains match too (mail.utoronto.ca).
const SCHOOL_DOMAINS = [
  "torontomu.ca", "ryerson.ca", "utoronto.ca", "yorku.ca", "uwaterloo.ca", "mcmaster.ca", "queensu.ca",
  "uwo.ca", "uoguelph.ca", "carleton.ca", "uottawa.ca", "ontariotechu.net", "ontariotechu.ca", "wlu.ca",
  "brocku.ca", "trentu.ca", "tmu.ca", "lakeheadu.ca", "laurentian.ca", "nipissingu.ca", "uwindsor.ca",
  "mcgill.ca", "concordia.ca", "umontreal.ca", "polymtl.ca", "etsmtl.ca", "ulaval.ca", "usherbrooke.ca",
  "ubc.ca", "sfu.ca", "uvic.ca", "bcit.ca", "ualberta.ca", "ucalgary.ca", "usask.ca", "uregina.ca",
  "umanitoba.ca", "dal.ca", "unb.ca", "mun.ca", "acadiau.ca", "senecacollege.ca", "senecapolytechnic.ca",
  "humber.ca", "sheridancollege.ca", "georgebrown.ca", "centennialcollege.ca", "durhamcollege.ca",
  "conestogac.on.ca", "mohawkcollege.ca", "algonquincollege.com", "fanshaweonline.ca", "fanshawec.ca",
];
