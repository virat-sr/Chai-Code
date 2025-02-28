/**
 * Write your challenge solution here
 */
// Image data
const images = [
  {
    url: 'https://plus.unsplash.com/premium_photo-1666863909125-3a01f038e71f?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'Beautiful Mountain Landscape',
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1690576837108-3c8343a1fc83?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'Ocean Sunset View',
  },
  {
    url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2041&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'Autumn Forest Path',
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1680466057202-4aa3c6329758?q=80&w=2138&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'Urban City Skyline',
  },
];
//control + command + space
const cardEmojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']
const cards = [...cardEmojis, ...cardEmojis] //create pairs
let flippedCards = []
let matchedPairs = 0
let moves =0
let timer = null
let seconds =0
// Shuffle cards
function shuffleCards(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// init game
function initGame() {
  const gameContainer = document.getElementById('gameContainer')
  const shuffledCards = shuffleCards([...cards])
  gameContainer.innerHTML = ''
  shuffledCards.forEach((emoji, index) => {
    const card = createCard(emoji,index)
    gameContainer.appendChild(card)
  });

  // Reseting the game
   flippedCards = []
   matchedPairs = 0
   moves =0
   seconds =0

   document.getElementById('moves').textContent = moves
   document.getElementById('time').textContent = '0.00'

   if(timer) clearInterval(timer)
    timer = setInterval(updateTimer,1000) //1 second k baad
}
// call the game first time on load
initGame()

function restartGame () {
  initGame()
}

function createCard(emoji, index) {
  const card = document.createElement('div')
  card.className = 'card'
  card.dataset.index = index    //what is dataset 
  card.innerHTML = `<div class="card-front"></div>
        <div class="card-back">${emoji}</div>`
  card.addEventListener('click', ()=>{
    flipCard(card)
  })

  return card
}

//FipCard
function flipCard(card) {
  if(flippedCards.length === 2 || flippedCards.includes(card) || card.classList.contains('matched')) {
    return
  }

  card.classList.add('flipped')
  flippedCards.push(card)

  if(flippedCards.length === 2 ){
    moves++
    document.getElementById('moves').textContent = moves
    checkMatch()
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards
  const match = card1.querySelector('.card-back').textContent === card2.querySelector('.card-back').textContent
  
  if (match) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    
    if (matchedPairs === cardEmojis.length) {
        setTimeout(() => {
            clearInterval(timer);
            alert(`Congratulations! You won!\nMoves: ${moves}\nTime: ${formatTime(seconds)}`);
        }, 500);
    }
} else {
    setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }, 1000);
}

setTimeout(() => {
    flippedCards = [];
}, 1000);

}


function formatTime(seconds) {
  const minutes = Math.floor(seconds/60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Update timer
function updateTimer() {
  seconds++;
  document.getElementById('time').textContent = formatTime(seconds);
}
