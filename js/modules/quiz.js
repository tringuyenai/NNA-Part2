export class QuizModule {
  constructor(container, questionsData) {
    this.container = container;
    this.questions = questionsData;
    this.currentIndex = 0;
    this.userAnswers = {};
  }

  render() {
    const q = this.questions[this.currentIndex];
    
    this.container.innerHTML = `
      <button id="back-units-btn" class="btn-back">← Quay lại danh sách bài học</button>
      <div class="quiz-card">
        <div class="quiz-header">
          <span class="quiz-step">Câu ${this.currentIndex + 1}/${this.questions.length}</span>
        </div>
        <h2 class="quiz-question">${q.question}</h2>
        <div class="quiz-options">
          ${q.options.map((opt, idx) => `
            <button class="option-btn ${this.userAnswers[this.currentIndex] === idx ? 'selected' : ''}" data-index="${idx}">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div id="explanation-box" class="explanation-box hidden">
          <strong>💡 Giải thích:</strong>
          <p>${q.explanation}</p>
        </div>
        <div class="quiz-nav" style="margin-top: 20px; display: flex; justify-content: space-between;">
          <button id="prev-q-btn" class="btn-back" ${this.currentIndex === 0 ? 'disabled' : ''}>Câu trước</button>
          <button id="next-q-btn" class="btn-back" ${this.currentIndex === this.questions.length - 1 ? 'disabled' : ''}>Câu tiếp ➔</button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const optionBtns = this.container.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedIdx = parseInt(e.target.dataset.index);
        this.checkAnswer(selectedIdx);
      });
    });

    const prevBtn = this.container.querySelector('#prev-q-btn');
    const nextBtn = this.container.querySelector('#next-q-btn');
    
    if(prevBtn) prevBtn.addEventListener('click', () => this.prevQuestion());
    if(nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
  }

  checkAnswer(selectedIdx) {
    const q = this.questions[this.currentIndex];
    this.userAnswers[this.currentIndex] = selectedIdx;

    const optionBtns = this.container.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctAnswer) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('wrong');
      }
    });

    const expBox = this.container.querySelector('#explanation-box');
    if (expBox) expBox.classList.remove('hidden');
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.render();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
    }
  }
}
