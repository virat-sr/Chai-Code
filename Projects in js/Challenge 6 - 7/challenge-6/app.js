/**
 * Write your challenge solution here
 */
// Pay attention to CSS
//Its good for circular fashion data
const hourHand = document.querySelector('.hour')
const minuteHand = document.querySelector('.minute')
const secondHand = document.querySelector('.second')
const digitalClock = document.querySelector('.digital-clock')
const dateDisplay = document.querySelector('.date')
const clockFace = document.querySelector('.clock')


for (let i=1;i<=12; i++) {
    const number = document.createElement('div')
    number.className = 'number'
    number.style.setProperty('--rotation', `${i*30}deg`) //Explain
    number.innerHTML = `<span>${i}</span>`
    clockFace.appendChild(number)
}
function updateClock() {
    const now = new Date()

    const hours = String(now.getHours()).padStart(2,'0')  // explore padstart
    const minutes = String(now.getMinutes()) .padStart(2,'0')
    const seconds = String(now.getSeconds()) .padStart(2,'0')
    digitalClock.textContent = `${hours}:${minutes}:${seconds}:`

    const secondRatio = now.getSeconds()/60
    const minutesRatio = (secondRatio + now.getMinutes())/60
    const hoursRatio = (minutesRatio + now.getHours())/12

    //Rotations code
    setRotation(secondHand,secondRatio*360)
    setRotation(minuteHand,minutesRatio*360)
    setRotation(hourHand,hoursRatio*360)


    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    

}
function setRotation(element, rotation) {
    if (element === secondHand && rotation === 0) {
        element.style.transition = 'none';
    } else {
        element.style.transition = '';  // Reset to CSS default
    }
    //Seconds was behaving weirdly 360 to 0 rotation pe 
    element.style.transform = `translateX(-50%) rotate(${rotation}deg)`
}

updateClock()
setInterval(updateClock,1000)  //1000 is 1 sec , its bacically milisec