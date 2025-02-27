/**
 * Write your challenge solution here
 */
/**
 * Approach 1: get the id of all the tags
 * Write onChange for all the ids seperatly.
 * Other way is to dynamically do it.
 */

const inputs= document.querySelectorAll('input,textArea')

function updatePreview(element) {
    const label = element.previousElementSibling.textContent.trim().slice(0,-1).toLowerCase()
    
    const value = element.value

    const span = document.getElementById(`${label}Display`)
    if(span) {
        span.textContent = value ? value : 'Not Provided'
    }

}

inputs.forEach(input => {
    input.addEventListener('input',() => {updatePreview(input)})
})
