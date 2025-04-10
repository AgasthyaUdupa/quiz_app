const _question = document.getElementById('question');
const _options = document.getElementById('options');
const _totalQuestion = document.getElementById('total-questions');
const _correctQuestion = document.getElementById('correct-questions');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _progressBar = document.getElementById('progress-bar');

let correctAnswer = "", correctScore = 0, askedCount = 0, totalQuestions = 10;
let questions = [];

document.addEventListener('DOMContentLoaded', async function () {
  await fetchQuestions();
  showQuestion();
  _totalQuestion.textContent = totalQuestions;
  _correctQuestion.textContent = correctScore;
  eventListeners();
  setupDarkMode();
});

function eventListeners() {
  _checkBtn.addEventListener('click', checkAnswer);
  _playAgainBtn.addEventListener('click', restartQuiz);
}

async function fetchQuestions() {
  const APIUrl = `https://opentdb.com/api.php?amount=${totalQuestions}&category=18&difficulty=medium&type=multiple`;
  const result = await fetch(APIUrl);
  const data = await result.json();
  questions = data.results;
}

function showQuestion() {
  const data = questions[askedCount];
  correctAnswer = HTMLDecode(data.correct_answer);

  let optionsList = [...data.incorrect_answers.map(a => HTMLDecode(a))];
  optionsList.splice(Math.floor(Math.random() * (optionsList.length + 1)), 0, correctAnswer);

  _question.innerHTML = `${HTMLDecode(data.question)} <br> <span class="text-xs font-semibold text-blue-500">${data.category}</span>`;
  _options.innerHTML = optionsList.map(option => `<li>${option}</li>`).join('');
  _result.innerHTML = "";
  _checkBtn.disabled = false;

  document.body.classList.remove("bg-green-100", "bg-red-100");
  selectOption();
}

function selectOption() {
  _options.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', function () {
      _options.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
}

function checkAnswer() {
  _checkBtn.disabled = true;
  const selected = _options.querySelector('.selected');
  if (!selected) {
    _result.innerHTML = `<p class="text-yellow-600">Please select an option!</p>`;
    _checkBtn.disabled = false;
    return;
  }

  let selectedAnswer = selected.textContent;
  if (selectedAnswer === correctAnswer) {
    correctScore++;
    _result.innerHTML = `<p class="text-green-600">✅ Correct!</p>`;
    document.body.classList.add("bg-green-100");
  } else {
    _result.innerHTML = `<p class="text-red-600">❌ Incorrect!</p><small>Correct: ${correctAnswer}</small>`;
    document.body.classList.add("bg-red-100");
  }

  _correctQuestion.textContent = correctScore;
  updateProgressBar();

  setTimeout(() => {
    document.body.classList.remove("bg-green-100", "bg-red-100");
    askedCount++;
    if (askedCount === totalQuestions) {
      showFinalScore();
    } else {
      showQuestion();
    }
  }, 1000);
}

function updateProgressBar() {
  const percent = ((askedCount + 1) / totalQuestions) * 100;
  _progressBar.style.width = `${percent}%`;
}

function showFinalScore() {
  _result.innerHTML = `<p class="text-xl text-purple-600">🎉 Your final score: ${correctScore} / ${totalQuestions}</p>`;
  _checkBtn.style.display = "none";
  _playAgainBtn.classList.remove("hidden");
}

function restartQuiz() {
  correctScore = 0;
  askedCount = 0;
  _checkBtn.style.display = "inline-block";
  _playAgainBtn.classList.add("hidden");
  _correctQuestion.textContent = correctScore;
  _progressBar.style.width = `0%`;
  fetchQuestions().then(showQuestion);
}

// Decode HTML special characters
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

// Dark mode setup
function setupDarkMode() {
  const toggle = document.getElementById('dark-toggle');
  toggle.addEventListener('change', () => {
    document.documentElement.classList.toggle('dark');
  });
}
