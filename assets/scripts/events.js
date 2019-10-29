let questions
let questionsCount
let currentQuestion

let questionTitleElement = document.getElementById("title")
let answersElement = document.getElementById("answers")
let actionButton = document.getElementById("action-button")

const getQuestions = function () {
  let request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      questions = JSON.parse(this.responseText).questions
      console.log(questions);
    }
  }
  request.open("GET", "./assets/questions.json", false)
  request.send()
}

getQuestions()
