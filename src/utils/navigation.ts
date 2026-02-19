// An array of links for navigation bar
const navBarLinks = [
  { name: "Products", url: "/products" },
  { name: "Services", url: "/services" },
  { name: "Applications", url: "/applications" },
];
// An array of links for footer
const footerLinks = [
  {
    section: "Product Solutions",
    links: [
      { name: "Thermal Spray Wires", url: "/thermal-spray-wires" },
      { name: "Thermal Spray Powders", url: "/thermal-spray-powders" },
      { name: "Spray Equipment", url: "/thermal-spray-coating-equipment" },
      { name: "All Products", url: "/products" },
    ],
  },
  {
    section: "Industry Solutions",
    links: [
      { name: "Anti-Corrosion", url: "/anti-corrosion-coatings" },
      { name: "Wear Resistance", url: "/wear-resistance" },
      { name: "Surface Restoration", url: "/surface-restoration" },
      { name: "By Industry", url: "/applications" },
    ],
  },
  {
    section: "Resources",
    links: [
      { name: "Our Services", url: "/services" },
      { name: "Quality Standards", url: "/quality" },
    ],
  },
  {
    section: "Company",
    links: [
      { name: "About Us", url: "/about" },
      { name: "Contact", url: "/contact" },
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