// Store catalogue. Edit this file to change prices, colours or products.
// price is in CAD. images point to renders in . art names an original
// inline illustration in app.js, used where no render exists yet.

// Shared colour choices, matched to common PLA filament.
const MODEL_COLOURS = ["White", "Navy Blue", "Silver Grey", "Black"];

// The two-tone plaques keep the blue and white look without any company logo.
const PLAQUE_COLOURS = ["Blue text on white", "White text on blue"];

const PRODUCTS = [
  {
    id: "turbofan-cutaway", name: "High-Bypass Turbofan Cutaway", category: "Engines", price: 49,
    size: "About 18 cm long", colours: MODEL_COLOURS,
    blurb: "A sectioned turbofan that shows the fan, compressor and turbine stages.",
    images: ["turbofan-cutaway.jpg", "turbofan-exterior.jpg"],
  },
  {
    id: "turbofan-exploded", name: "Exploded Turbofan Display", category: "Engines", price: 59,
    size: "About 22 cm long", colours: MODEL_COLOURS,
    blurb: "Every major stage pulled apart along the shaft on a display stand.",
    images: ["turbofan-exploded.jpg"],
  },
  {
    id: "turbofan-mini", name: "Mini Turbofan Desk Model", category: "Engines", price: 29,
    size: "About 10 cm long", colours: MODEL_COLOURS,
    blurb: "A compact nacelle and fan with a fan that spins freely.",
    images: ["turbofan-exterior.jpg"],
  },
  {
    id: "airliner", name: "Twin-Engine Airliner Model", category: "Aircraft", price: 34,
    size: "About 20 cm wingspan", colours: MODEL_COLOURS, art: "airliner",
    blurb: "A clean, generic twin-engine airliner on a desk stand.",
  },
  {
    id: "delta-jet", name: "Delta-Wing Jet Model", category: "Aircraft", price: 34,
    size: "About 16 cm long", colours: MODEL_COLOURS, art: "delta",
    blurb: "An original concept jet with a swept delta wing.",
  },
  {
    id: "vtol-drone", name: "Blended-Wing VTOL Drone", category: "Aircraft", price: 45,
    size: "About 20 cm wingspan", colours: MODEL_COLOURS,
    blurb: "A scale model of an original tilt-motor VTOL drone design.",
    images: ["vtol-drone.jpg", "vtol-exploded.jpg"],
  },
  {
    id: "mars-rover", name: "Planetary Rover Concept", category: "Space", price: 55,
    size: "About 14 cm long", colours: MODEL_COLOURS,
    blurb: "An original planetary rover concept with deployed solar panels.",
    images: ["rover.jpg"],
  },
  {
    id: "wind-tunnel", name: "Desk Wind Tunnel Model", category: "Space", price: 39,
    size: "About 18 cm long", colours: MODEL_COLOURS,
    blurb: "A scale model of an open-circuit subsonic wind tunnel.",
    images: ["wind-tunnel.jpg"],
  },
  {
    id: "custom-plaque", name: "Custom Desk Plaque", category: "Custom", price: 22,
    size: "About 15 cm wide", colours: PLAQUE_COLOURS, art: "plaque", custom: "plaque",
    blurb: "Your name, team or project in two-colour blue and white.",
  },
  {
    id: "custom-keychain", name: "Custom Name Keychain", category: "Custom", price: 9,
    size: "About 7 cm wide", colours: PLAQUE_COLOURS, art: "plaque", custom: "keychain",
    blurb: "A small two-colour tag with your own short text.",
  },
  {
    id: "fan-keychain", name: "Turbofan Fan Keychain", category: "Custom", price: 10,
    size: "About 4 cm across", colours: MODEL_COLOURS, art: "fan",
    blurb: "A tiny fan disc that spins on your keys.",
  },
];

// Pricing rules used by the cart.
const STORE = {
  orderEmail: "engineeringprinting082@gmail.com",
  web3formsKey: "",        // Public Web3Forms access key; orders are sent to the inbox tied to it
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
