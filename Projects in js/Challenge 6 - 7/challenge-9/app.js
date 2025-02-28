/**
 * Write your challenge solution here
 */
const panel = document.querySelector('.panel')
const toggleBtn = document.querySelector('.toggle-btn')
const closeBtn = document.querySelector('.close-btn')
const menuItems = document.querySelectorAll('.menu-item')



const openMenu = () => {
    panel.classList.add('active')
    document.body.style.overflow = 'hidden'
}
const closeMenu = () => {
    panel.classList.remove('active')
    document.body.style.overflow = ''
}
toggleBtn.addEventListener('click',openMenu)
closeBtn.addEventListener('click',closeMenu)

menuItems.forEach(item => {
    item.addEventListener('click',()=>{
        alert(`You clicked : ${item.textContent}`)
        closeMenu()
    })
})

document.addEventListener('click', (event) => {
    const isClickInsidePanel = panel.contains(event.target)
    const isClickOnToggleBtn = toggleBtn.contains(event.target)

    if(!isClickInsidePanel && !isClickOnToggleBtn && panel.classList.contains('active')) {
        closeMenu()
    }
})


