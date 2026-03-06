// let btn = document.querySelector("#btn")

//  btn.onclick = () => {
//     console.log("hello bro")
//     alert("how are you")
//  }

// let btn = document.querySelector("#btn")
// let body = document.querySelector("body")

// let currentMode = "light"

// btn.addEventListener("click",() =>{
//   if (currentMode === "light") {
//     currentMode="dark"
//     document.querySelector("body").style.backgroundColor= "black"
//   } else {
// currentMode="light"
//     document.querySelector("body").style.backgroundColor="white"
//   }
//   console.log(currentMode)
// })
let userScore = 0;
let comScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userPoints = document.querySelector("#user-score")
const compPoints = document.querySelector("#comp-score")

const showWinner = (userWin,comChoice,userChoice) => {
  if (userWin) {
    userScore++
    userPoints.innerText = userScore
    console.log("You win!")
    msg.innerText = `You win! ${userChoice} beats ${comChoice}`;
    msg.style.backgroundColor = "green";
  } else {
    comScore++
    compPoints.innerText = comScore
    console.log("You lose")
    msg.innerText = `You lose ${comChoice} beats your ${userChoice}`;
    msg.style.backgroundColor = "red";
  }
};

const genCompChoice = () => {
  const options = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * 3);
  return options[randomIndex];
};

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const userChoice = choice.getAttribute("id");
    playGame(userChoice);
  });
});

const playGame = (userChoice) => {
  console.log("user choice =", userChoice);
  comChoice = genCompChoice();
  console.log("com choice =", comChoice);

  if (userChoice === comChoice) {
    // draw
    msg.innerText = "game was draw";
    msg.style.backgroundColor = "#081b31";
  } else {
    let userWin = true;
    if (userChoice === "rock") {
      // com can choose only paper scissor because if com will choose rock then it will draw
      userWin = comChoice === "paper" ? false : true;
    } else if (userChoice === "paper") {
      userWin = comChoice === "rock" ? true : false;
    } else if (userChoice === "scissors") {
      userWin = comChoice === "rock" ? false : true;
    }
    showWinner(userWin,comChoice,userChoice);
  }
};
