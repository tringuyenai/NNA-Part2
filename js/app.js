// Quản lý các phần tử DOM chính
const appStage = document.getElementById('app-stage');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');

// Lưu trữ giao diện trang chủ ban đầu để dùng khi quay lại
const homeHTML = appStage.innerHTML;

// Lắng nghe sự kiện click trên khu vực màn hình chính (Ủy quyền sự kiện)
appStage.addEventListener('click', (event) => {
  const card = event.target.closest('.course-card');
  if (card && card.dataset.courseId) {
    const courseId = card.dataset.courseId;
    loadCourseData(courseId);
  }
});

/**
 * Hàm nạp dữ liệu JSON từ thư mục data/
 * @param {string} courseId - ID của môn học (vd: reading-2)
 */
async function loadCourseData(courseId) {
  // Hiển thị trạng thái đang tải
  appStage.innerHTML = '<div class="loading-state">Đang tải bài học...</div>';

  try {
    const response = await fetch(`data/${courseId}.json`);
    
    if (!response.ok) {
      throw new Error(`Không thể nạp dữ liệu môn học (${response.status})`);
    }

    const data = await response.json();
    renderUnits(data);
  } catch (error) {
    console.error('Lỗi nạp dữ liệu:', error);
    appStage.innerHTML = `
      <div class="error-state">
        <p>⚠️ Không thể tải dữ liệu môn học.</p>
        <button id="back-home-btn" class="btn-back">Quay lại trang chủ</button>
      </div>
    `;
    bindBackHomeEvent();
  }
}

/**
 * Hàm hiển thị danh sách các bài học (Unit) ra màn hình
 * @param {Object} data - Dữ liệu môn học lấy từ JSON
 */
function renderUnits(data) {
  // Cập nhật tiêu đề trang
  pageTitle.textContent = data.courseTitle;
  pageSubtitle.textContent = 'Chọn bài học để bắt đầu';

  // Nút quay lại trang chọn môn học
  let htmlContent = `
    <button id="back-home-btn" class="btn-back">← Quay lại danh sách môn học</button>
  `;

  // Duyệt qua danh sách bài học và tạo thẻ HTML
  data.units.forEach((unit) => {
    htmlContent += `
      <button class="unit-card" data-unit-id="${unit.id}">
        <div class="unit-info">
          <h3 class="unit-title">${unit.title}</h3>
          <span class="unit-count">${unit.lessonsCount} bài tập</span>
        </div>
        <div class="course-arrow">➔</div>
      </button>
    `;
  });

  appStage.innerHTML = htmlContent;
  bindBackHomeEvent();
}

/**
 * Gán sự kiện quay lại trang chủ cho nút bấm
 */
function bindBackHomeEvent() {
  const backBtn = document.getElementById('back-home-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      pageTitle.textContent = 'Chương Trình Ôn Học';
      pageSubtitle.textContent = 'Chọn môn học để bắt đầu luyện tập';
      appStage.innerHTML = homeHTML;
    });
  }
}
