let currentLevel = '';
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

async function startQuiz(level) {
  currentLevel = level;
  const res = await fetch(`data/${level}.json`);
  questions = await res.json();

  document.getElementById('levelSelection').classList.add('hidden');
  document.getElementById('quizBox').classList.remove('hidden');
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  showQuestion();
  updateNextButton();
}

function showQuestion() {
  answered = false;
  const q = questions[currentQuestionIndex];
  document.getElementById('progress').innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  document.getElementById('question').innerText = q.question;
  const optionsList = document.getElementById('options');
  optionsList.innerHTML = '';

  q.options.forEach(option => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.innerText = option;
    btn.onclick = () => {
      if (!answered) {
        answered = true;
        if (option === q.answer) {
          score++;
          btn.style.backgroundColor = '#4CAF50'; // green for correct
        } else {
          btn.style.backgroundColor = '#f44336'; // red for wrong
          // highlight correct answer
          [...optionsList.children].forEach(li => {
            if (li.firstChild.innerText === q.answer) {
              li.firstChild.style.backgroundColor = '#4CAF50';
            }
          });
        }
        // disable all options after answering
        [...optionsList.children].forEach(li => li.firstChild.disabled = true);
        updateNextButton();
      }
    };
    li.appendChild(btn);
    optionsList.appendChild(li);
  });

  updateNextButton();
}

function updateNextButton() {
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.disabled = !answered;
  nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question';
}

function nextQuestion() {
  if (!answered) return; // prevent skipping without answer
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    finishQuiz();
  }
}

async function finishQuiz() {
  document.getElementById('quizBox').classList.add('hidden');
  document.getElementById('resultBox').classList.remove('hidden');

  const percent = (score / questions.length) * 100;
  document.getElementById('scoreText').innerText = `You scored ${score} out of ${questions.length} (${percent.toFixed(0)}%)`;

  let feedback = '';
  if (percent < 40) feedback = 'Keep practicing! You got this!';
  else if (percent < 80) feedback = 'Good effort! You’re improving!';
  else feedback = 'Excellent! You nailed it!';

  document.getElementById('feedbackText').innerText = feedback;

  if (percent >= 40) {
    try {
      const res = await fetch('/.netlify/functions/getMotivation');
      const data = await res.json();
      document.getElementById('motivationBox').innerText = `💡 Motivation: ${data.quote}`;
    } catch {
      document.getElementById('motivationBox').innerText = '💡 Motivation: Keep up the great work!';
    }
  }
}
