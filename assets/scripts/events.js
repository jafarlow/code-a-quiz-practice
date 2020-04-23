let questions
let questionsCount
let currentQuestion
let score = 0

let questionTitleElement = document.getElementById("title")
let learnMoreElement = document.getElementById("learn")
let answersElement = document.getElementById("answers")
let actionButton = document.getElementById("action-button")
let nextButton = document.getElementById("next-button")
let resetButton = document.getElementById("reset-button")
let questionNumber = document.getElementById("qnum")
let totalQuestions = document.getElementById("total-qs")

const getQuestions = function () {
  // "request" below is often seen as "xhr"
  let request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    // readyState status code 4 means Done -- "The operation is complete", and could be success or fail
    // it's paired with html code 200, which does mean success
    if (this.readyState == 4 && this.status == 200) {
      questions = JSON.parse(this.responseText).questions
      questionsCount = questions.length
      currentQuestion = 0
    }
  }
  request.open("GET", "./assets/questions.json", false)
  request.send()
}

const displayQuestion = function (question) {
  questionTitleElement.innerHTML = ""
  answersElement.innerHTML = ""
  learnMoreElement.innerHTML = ""

  // question.title is accessing the JSON
  let questionTitle = document.createTextNode(question.title)
  questionTitleElement.appendChild(questionTitle)

  // let learnLink = document.createElement("a")
  let anchorText = document.createTextNode("Learn more (external link)")
  learnMoreElement.setAttribute("href", question.learn)
  learnMoreElement.setAttribute("target", "_blank")
  learnMoreElement.setAttribute("rel", "external nofollow noopener noreferrer")
  learnMoreElement.appendChild(anchorText)
  // learnMoreElement.appendChild(learnLink)

  question.answers.forEach(answer => {
    let label = document.createElement("label")
    let answerInput = document.createElement("input")

    // adds the following HTML attributes to each element
    answerInput.setAttribute("type", "radio")
    answerInput.setAttribute("name", "answer")
    answerInput.setAttribute("onClick", "enableButton(this)")

    // answer.id accesses the JSON
    answerInput.setAttribute("value", answer.id)
    answerInput.classList.add("answer")

    // answer.answer accesses the JSON
    let answerTitle = document.createTextNode(answer.answer)
    label.appendChild(answerInput)
    label.appendChild(answerTitle)

    answersElement.appendChild(label)
  })

  // uses type coercion to convert the id into a number
  questionNumber.innerText = Number(question.id) + 1
  // writing this part in JS instead of hardcoding in HTML allows for dynamic updating of the JSON file
  totalQuestions.innerText = questions.length
}

// allows user to "submit" only if an answer has been chosen
const enableButton = function(radioButton) {
  if (radioButton.checked) {
    actionButton.disabled = false
  }
}

actionButton.addEventListener("click", function () {
  let answers = document.getElementsByClassName("answer")

  for (let i = 0; i < answers.length; i++) {
    let answer = answers[i]
    let question = questions[currentQuestion]
    if (answer.checked && answer.value == question.correct) {
      answer.parentNode.classList.add("correct")
      score++
    } else if (answer.checked && answer.value != question.correct) {
      answer.parentNode.classList.add("incorrect")
    }

    // prevents more than one attempt at a question per session
    answer.disabled = true
  }

  currentQuestion++
  // visuallyhiddens the question to free up screen space
  questionTitleElement.classList.add("visuallyhidden")
  // shows the "Learn More" link upon answer submition
  learnMoreElement.classList.remove("visuallyhidden")
  // shows the "Next Question" button
  nextButton.classList.remove("visuallyhidden")
  // visuallyhiddens the "Submit" button
  this.classList.add("visuallyhidden")
  // turns off the button for the next question until enableButton
    // has been run again
  actionButton.disabled = true
})

nextButton.addEventListener("click", function () {
  if (currentQuestion == questionsCount) {
    document.getElementById("question-element").classList.add("visuallyhidden")
    document.getElementById("scores").classList.remove("visuallyhidden")
    document.getElementById("score").innerHTML = score + "/" + questionsCount
    resetButton.classList.remove("visuallyhidden")
    return
  }
  displayQuestion(questions[currentQuestion])
  // shows the next question
  questionTitleElement.classList.remove("visuallyhidden")
  // visuallyhiddens the learn more link, which will be revealed after answer
    // submition
  learnMoreElement.classList.add("visuallyhidden")
  // shows the "Next Question" button
  actionButton.classList.remove("visuallyhidden")
  // visuallyhiddens the "Submit" button
  this.classList.add("visuallyhidden")
})

// Initialization
getQuestions()
displayQuestion(questions[currentQuestion])
