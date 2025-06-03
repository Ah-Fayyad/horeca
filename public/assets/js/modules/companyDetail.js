// إدارة صفحة تفاصيل الشركة
export async function loadCompanyDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const companyId = urlParams.get("id");

  if (!companyId) {
    // إعادة توجيه إذا لم يتم العثور على معرّف الشركة
    window.location.href = "/companies/list.html";
    return;
  }

  try {
    // جلب بيانات الشركة والمنتجات بالتوازي لتحسين الأداء
    const [companyRes, productsRes] = await Promise.all([
      fetch(`/api/companies.json`),
      fetch(`/api/products.json`),
    ]);

    // التحقق من أن الاستجابات كانت ناجحة
    if (!companyRes.ok)
      throw new Error(`HTTP error! status: ${companyRes.status} for companies`);
    if (!productsRes.ok)
      throw new Error(`HTTP error! status: ${productsRes.status} for products`);

    const allCompanies = await companyRes.json();
    const allProducts = await productsRes.json();

    const company = allCompanies.find((c) => c.id === companyId);

    if (!company) {
      throw new Error("Company not found.");
    }

    const products = allProducts.filter((p) => p.companyId === companyId);

    renderCompanyDetails(company);
    renderCompanyProducts(products);
  } catch (error) {
    console.error("Error loading company details:", error);
    // يمكنك عرض رسالة خطأ للمستخدم هنا بدلاً من إعادة التوجيه الفوري
    window.location.href = "/companies/list.html";
  }
}

function renderCompanyDetails(company) {
  const companyNameEl = document.getElementById("companyName");
  const companyCityEl = document.getElementById("companyCity");
  const companyCategoryEl = document.getElementById("companyCategory");
  const companyLogoEl = document.getElementById("companyLogo");

  // التحقق من وجود كل عنصر قبل تحديثه
  if (companyNameEl) companyNameEl.textContent = company.name;
  if (companyCityEl) companyCityEl.textContent = company.city;
  if (companyCategoryEl) companyCategoryEl.textContent = company.category;
  if (companyLogoEl) {
    companyLogoEl.src = company.logo || "/assets/images/default-company.png";
    companyLogoEl.alt = `${company.name} logo`; // تحسين نص الـ alt
  }
}

function renderCompanyProducts(products) {
  const container = document.getElementById("productsContainer");
  // التحقق من وجود الـ container
  if (!container) {
    console.error("Error: Element with ID 'productsContainer' not found.");
    return;
  }

  // في حالة عدم وجود منتجات، اعرض رسالة مناسبة
  if (products.length === 0) {
    container.innerHTML =
      '<p class="no-products">لا توجد منتجات متاحة لهذه الشركة حالياً.</p>';
    return;
  }

  container.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image || "/assets/images/default-product.png"}"
           alt="${product.name}"
           class="product-image">
      <div class="product-info">
        <h4>${product.name}</h4>
        <p class="product-price">${product.price} ريال</p>
        <p class="product-unit">${product.unit || "وحدة"}</p>
      </div>
    </div>
  `
    )
    .join("");
}

// تهيئة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  // تحقق من وجود العناصر الأساسية لصفحة التفاصيل
  if (
    document.getElementById("companyName") &&
    document.getElementById("productsContainer")
  ) {
    loadCompanyDetails();
  }
});
