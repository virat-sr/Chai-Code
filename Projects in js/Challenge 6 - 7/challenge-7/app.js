/**
 * Write your challenge solution here
 */
const allAccordionButtons = document.querySelectorAll('.accordion-button')

allAccordionButtons.forEach(button => {
    button.addEventListener('click',()=>{
        const currentItem = button.parentElement
        const isActive = currentItem.classList.contains('active')

        allAccordionButtons.forEach(button =>{
            button.parentElement.classList.remove('active')
        })

        if(!isActive) {
            currentItem.classList.add('active')
        }
    })
})