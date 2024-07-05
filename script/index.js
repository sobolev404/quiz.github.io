import { questionsList } from "./questions.js";

const content = document.getElementById("content");
const themeToggleCheckbox = document.getElementById("theme-toggle");

themeToggleCheckbox.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme");
  const content = document.getElementById("content");
  content.classList.toggle("dark-theme");
});

play();

function play() {
  const questionsInRandomOrder = randomQuestionOrAnswer(questionsList);
  let totalScore = 0;
  let questionNumber = 0;

  displayNextQuestion(questionsInRandomOrder, questionNumber, totalScore);
}

//////////////// ПЕРЕМЕШКА ВОПРОСОВ И ОТВЕТОВ
function randomQuestionOrAnswer(arr) {
  let newArr = [];
  while (newArr.length !== arr.length) {
    let a = arr[Math.floor(Math.random() * arr.length)];
    if (!newArr.includes(a)) {
      newArr.push(a);
    }
  }
  return newArr.slice(-5);////////////// НЕ КОРРЕКТНО ОБРЕЗАЕТСЯ МАССИВ
}

/////////////// ВЫВОД ТЕКУЩЕГО ВОПРОСА
function displayNextQuestion(
  questionsInRandomOrder,
  questionNumber,
  totalScore
) {
  if (questionNumber < questionsInRandomOrder.length) {
    displayQuestionTitle(questionsInRandomOrder, questionNumber);
    let answersInRandomOrder = randomQuestionOrAnswer(
      questionsInRandomOrder[questionNumber].answersList
    );
    displayAnswers(answersInRandomOrder);
    displayNextButton();

    let timeLeft = 10;
    const timerElement = document.getElementById('timer');
    const timerInterval = setInterval(() => {
      timeLeft--;
      timerElement.textContent = timeLeft;
      if (timeLeft <= 0) {
          clearInterval(timerInterval);
          nextBtn.click();
      }
  }, 1000);

  const timeoutHandle = setTimeout(() => {
      clearInterval(timerInterval);
      displayNextQuestion(questionsInRandomOrder, questionNumber + 1, totalScore);
  }, 10000);



    const nextBtn = document.getElementById("next");
    let isAnswerSelected = false;
    const correctAnswers = answersInRandomOrder.filter(
      (answer) => answer[1]
    ).length;
    let selectedCorrectAnswers = 0;

    listAnswers.onclick = function (event) {
      if (isAnswerSelected) return;

      const target = event.target;
      if (target.className === "btn_answer") {
        if (target.dataset.type === "true") {
          target.style.backgroundColor = "green";
          selectedCorrectAnswers++;
          if (selectedCorrectAnswers === correctAnswers) {
            isAnswerSelected = true;
            totalScore += 1;
            clearInterval(timerInterval);
            clearTimeout(timeoutHandle);
            nextBtn.onclick = () =>
              displayNextQuestion(
                questionsInRandomOrder,
                questionNumber + 1,
                totalScore
              );
          }
        } else {
          target.style.backgroundColor = "red";
          isAnswerSelected = true;
          clearInterval(timerInterval);
          clearTimeout(timeoutHandle);
          nextBtn.onclick = () =>
            displayNextQuestion(
              questionsInRandomOrder,
              questionNumber + 1,
              totalScore
            );
        }
      }
    };
  } else {
    endOfTheGame(totalScore);
  }
}
//////ВЫВОД КНОПКИ НЕКСТ
function displayNextButton() {
  content.insertAdjacentHTML(
    "beforeend",
    `<div class="btnNextCont"><div class="btn_next"><button id="next">Next</button></div></div>`
  );
}

////////////// КОНЕЦ ИГРЫ
function endOfTheGame(totalScore) {
  content.innerHTML = `<h1 class="end-message" style="text-align:center">That's all! Your score: ${totalScore} </h1>
      <div class="btnRestCont"><div class="btn_restart"><button id="restart">Play again</button></div></div>`;
  const btnRestart = document.getElementById("restart");
  btnRestart.onclick = function () {
    play();
  };
}

/////////////// ВЫВОД ВАРИАНТОВ ОТВЕТОВ
function displayAnswers(answersArr) {
  const listAnswers = document.getElementById("listAnswers");
  for (
    let numberOfAnswer = 0;
    numberOfAnswer < answersArr.length;
    numberOfAnswer++
  ) {
    listAnswers.insertAdjacentHTML(
      "beforeend",
      getAnswer(answersArr, numberOfAnswer)
    );
  }
}
function getAnswer(answersArr, answerIndex) {
  return `<button class="btn_answer" data-index="${answerIndex}" data-type="${answersArr[answerIndex][1]}">${answersArr[answerIndex][0]}</button>`;
}

////////////////ВЫВОД ВОПРОСА И ЕГО НОМЕРА
function displayQuestionTitle(questionArr, question) {
  return (content.innerHTML = ` <h1 class="questionNumber">Question ${
    question + 1
  }/${questionArr.length}</h1>
        <h2 class="question">${questionArr[question].questionTitle}</h2>
        <div class="timer" id="timer">10</div>
        <div class="answersButtons" id="listAnswers">
        </div>`);
}
