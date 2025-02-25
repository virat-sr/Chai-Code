/**
 * Write your challenge solution here
 */
// one way is to directly get all elements by id and then individual pe onClick.

const colorButtonsContainer = document.querySelector('.color-buttons')
const mainHeading = document.getElementById('mainHeading');
function changeColor(color) {
    
    const mainHeading2 = document.querySelector('#mainHeading');
    // mainHeading2.classList.remove('red', 'green', 'blue');
    // mainHeading2.classList.add(`color-${color}`)
    //whats the difference between style.color and classlist ?
    mainHeading.style.color = color;
}

colorButtonsContainer.addEventListener('click',function(event){
    if(event.target.tagName.toLowerCase() === 'button') {
        const buttonId = event.target.id

        switch(buttonId) {
            case 'redButton':
                changeColor('red')
                break
            case 'greenButton':
                changeColor('green')
                break
            case 'blueButton':
                changeColor('blue')
                break
            case 'purpleButton':
                changeColor('purple')
                break
            case 'resetButton':
                changeColor('')
                break
        }
    }
}) 