// إدارة عرض قائمة الشركات
export async function loadCompanies() {
  try {
    const response = await fetch("/api/companies.json");
    // تحقق من أن الاستجابة كانت ناجحة (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const companies = await response.json();
    renderCompanies(companies);
  } catch (error) {
    console.error("Error loading companies:", error);
    // يمكنك هنا عرض رسالة خطأ مناسبة للمستخدم
  }
}

function renderCompanies(companies) {
  const container = document.getElementById("companiesContainer");
  // تحقق من وجود العنصر قبل محاولة التلاعب به
  if (!container) {
    console.error("Error: Element with ID 'companiesContainer' not found.");
    return;
  }

  // في حالة عدم وجود شركات، اعرض رسالة مناسبة
  if (companies.length === 0) {
    container.innerHTML = '<p class="no-results">لا توجد شركات لعرضها.</p>';
    return;
  }

  container.innerHTML = companies
    .map(
      (company) => `
    <div class="company-card">
      <img src="${company.logo || "/assets/images/default-company.png"}"
           alt="${company.name}"
           class="company-logo">
      <div class="company-content">
        <h3>${company.name}</h3>
        <div class="company-meta">
          <span><i class="fas fa-map-marker-alt"></i> ${company.city}</span>
          <span><i class="fas fa-tag"></i> ${company.category}</span>
        </div>
        <a href="/companies/detail.html?id=${
          company.id
        }" class="btn-view">عرض التفاصيل</a>
      </div>
    </div>
  `
    )
    .join("");
}

// تهيئة عند تحميل الصفحة
// يفضل استخدام DOMContentLoaded لضمان تحميل الـ HTML بالكامل
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("companiesContainer")) {
    loadCompanies();
  }
});
