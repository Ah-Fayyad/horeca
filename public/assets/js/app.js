// التهيئة الرئيسية للتطبيق
import { initMenuToggle } from "./modules/menu.js";
import { loadFeaturedCompanies } from "./modules/companies.js";

document.addEventListener("DOMContentLoaded", () => {
  initMenuToggle();

  if (document.getElementById("featuredCompanies")) {
    loadFeaturedCompanies();
  }
});
