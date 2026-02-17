// An array of links for navigation bar
const navBarLinks = [
  { name: "Products", url: "/products" },
  { name: "Applications", url: "/applications" },
];
// An array of links for footer
const footerLinks = [
  {
    section: "Product Solutions",
    links: [
      { name: "Copper Bonded Rods", url: "/copper-bonded-earthing-rod" },
      { name: "Chemical Earthing", url: "/chemical-earthing-system" },
      { name: "Lightning Arrestors", url: "/lightning-protection-system" },
      { name: "All Products", url: "/products" },
    ],
  },
  {
    section: "Industry Solutions",
    links: [
      { name: "Solar Plant Earthing", url: "/solar-plant-earthing" },
      { name: "Industrial Grounding", url: "/industrial-plant-grounding" },
      { name: "Data Center Earthing", url: "/data-center-earthing" },
      { name: "By Industry", url: "/applications" },
    ],
  },
  {
    section: "Resources",
    links: [
      { name: "Low Resistance Earthing", url: "/low-resistance-earthing" },
      { name: "Quality Standards", url: "/quality" },
    ],
  },
  {
    section: "Company",
    links: [
      { name: "About Us", url: "/about" },
      { name: "Contact", url: "/contact-us" },
      { name: "Request Quote", url: "/cart" },
    ],
  },
];
// An object of links for social icons
const socialLinks = {
  facebook: "https://www.facebook.com/",
  x: "https://twitter.com/",
  github: "https://github.com/",
  google: "https://www.google.com/",
  slack: "https://slack.com/",
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};