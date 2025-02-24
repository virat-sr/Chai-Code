/**
 * Write your challenge solution here
 */
const buttonElement = document.querySelector("#toggleButton");
const imgElement = document.querySelector("#bulb");
const statusElement = document.querySelector('#status')



function turnOnOff() {
    
  if (imgElement.className === "bulb on") {

    imgElement.className = "bulb off";
    document.body.classList.remove("dark-mode");
    buttonElement.innerHTML = "Turn On";
    statusElement.innerHTML = "Status: Off"

  } else {

    imgElement.className = "bulb on";
    document.body.classList.add("dark-mode");
    buttonElement.innerHTML = "Turn Off";
    statusElement.innerHTML = "Status: On"
    

  }
}

buttonElement.addEventListener('click', turnOnOff);
/**
 * Learnings - 
 * .classlist returns css classnames of the element that we can manipulate
 * document.querySelector returns the whole HTML element
 */