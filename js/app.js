import { publicSpeakingData } from '../data/public-speaking.js';
import { QuizModule } from './modules/quiz.js';

const appStage = document.getElementById('app-stage');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');

const homeHTML = appStage.innerHTML;

// Lắng nghe click chọn môn học hoặc chọn Unit
appStage.addEventListener('click', (event) => {
  const courseCard = event.target.closest('.course-card');
  const unitCard = event.target.closest('.unit-card');

  // 1. Khi bấm chọn môn học
  if (courseCard && courseCard.dataset.courseId) {
    const courseId = courseCard.dataset.courseId;
    loadCourseData(courseId);
  }

  // 2. Khi bấm chọn Unit bài tập
  if (unitCard && unitCard.dataset.unitId) {
    const unitId = unitCard.dataset.unitId;
    startQuiz(unitId);
  }
});

function loadCourseData(courseId) {
  if (courseId === 'public-speaking') {
    renderUnits(publicSpeakingData);
  } else {
    appStage.innerHTML = `
      <div class="error-state">
        <p>⚠️ Dữ liệu môn học này đang được cập nhật.</p>
        <button id="back-home-btn" class="btn-back">← Quay lại</button>
      </div>
    `;
    bindBackHomeEvent();
  }
}

function renderUnits(data) {
  window.currentCourseData = data; // Lưu dữ liệu vào biến toàn cục tạm thời
  pageTitle.textContent = data.courseTitle;
  pageSubtitle.textContent = 'Chọn bài học để bắt đầu luyện tập';

  let htmlContent = `<button id="back-home-btn" class="btn-back">← Quay lại danh sách môn học</button>`;

  data.units.forEach((unit) => {
    htmlContent += `
      <button class="unit-card" data-unit-id="${unit.id}">
        <div class="unit-info">
          <h3 class="unit-title">${unit.title}</h3>
          <span class="unit-count">${unit.questions.length} câu hỏi</span>
        </div>
        <div class="course-arrow">➔</div>
      </button>
    `;
  });

  appStage.innerHTML = htmlContent;
  bindBackHomeEvent();
}

function startQuiz(unitId) {
  const data = window.currentCourseData;
  const selectedUnit = data.units.find(u => u.id === unitId);

  if (selectedUnit) {
    pageTitle.textContent = selectedUnit.title;
    pageSubtitle.textContent = 'Chọn đáp án đúng cho mỗi câu hỏi';
    
    // Khởi tạo Module Quiz
    const quiz = new QuizModule(appStage, selectedUnit.questions);
    quiz.render();
  }
}

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
