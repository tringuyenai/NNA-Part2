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
      <div class="quiz-card">
        <div class="quiz-header">
          <span class="quiz-step">Câu ${this.currentIndex + 1}/${this.questions.length}</span>
        </div>
        <h2 class="quiz-question">${q.question}</h2>
        <div class="quiz-options">
          ${q.options.map((opt, idx) => `
            <button class="option-btn ${this.userAnswers[this.currentIndex] === idx ? 'selected' : ''}" 
                    data-index="${idx}">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div id="explanation-box" class="explanation-box hidden">
          <strong>💡 Giải thích:</strong>
          <p>${q.explanation}</p>
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
  }

  checkAnswer(selectedIdx) {
    const q = this.questions[this.currentIndex];
    this.userAnswers[this.currentIndex] = selectedIdx;

    const optionBtns = this.container.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, idx) => {
      btn.disabled = true; // Khóa chọn lại
      if (idx === q.correctAnswer) {
        btn.classList.add('correct'); // Màu xanh
      } else if (idx === selectedIdx) {
        btn.classList.add('wrong'); // Màu đỏ
      }
    });

    // Hiện hộp giải thích
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
