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

/**
 * Problem Break Down
 * How to think
 * 1. Data is Present but the carousel is never initialized.
 * 2. First load the images into the carousal.
 * 3. Note the functionalities we can see
 * 4. Next, Back, Autoplay
 * 5. We should also have something which shows the current image ,how it slides in ,moves out 
 * ----------------------------------------------------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------------------------------------------------
 */
  
//Get the dom elements 
const carouselTrack = document.querySelector('#carouselTrack')
const caption = document.querySelector('#caption')
const prevButton = document.querySelector('#prevButton')
const nextButton = document.querySelector('#nextButton')
const carouselNav = document.querySelector('#carouselNav')
const autoPlayButton = document.querySelector('#autoPlayButton')
const timerDisplay = document.querySelector('#timerDisplay')

let currentIndex = 0
let autoPlayInterval = null
let timerInterval = null
const autoPlayDelay = 5000
let timeRemaining = autoPlayDelay/1000
function initialLoad() {
  //Ek slide banaya
  images.forEach(image => {
    const slide = document.createElement('div')
    slide.className = 'carousel-slide'
    slide.style.backgroundImage = `url(${image.url})`
    carouselTrack.appendChild(slide)
  })
  images.forEach((image,index) => {
    const indicator = document.createElement('div')
    indicator.className = 'carousel-indicator'
    indicator.addEventListener('click',()=>goToSlide(index))
    carouselNav.appendChild(indicator)
  })
  updateCarousel()
}

function updateCarousel() {

  carouselTrack.style.transform = `translateX(-${currentIndex*100}%)`
  caption.textContent = images[currentIndex].caption

  const indicators = document.querySelectorAll('.carousel-indicator')
  indicators.forEach((indi,index) => {
    indi.classList.toggle('active',index === currentIndex)
  })

}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel()
}

function nextSlide() {
  currentIndex = (currentIndex+1)%images.length
  updateCarousel()
}

function prevSlide() {
  currentIndex = (currentIndex-1+images.length) % images.length
  updateCarousel()
}

//AutoPlay Functions

function updateTimer() {
  timerDisplay.textContent = `Next Slide in ${timeRemaining}`
  timeRemaining --
  if(timeRemaining<0) {
    timeRemaining = autoPlayDelay/1000
  }
}

function startAutoPlay() {
  if(autoPlayInterval) return

  autoPlayInterval = setInterval(nextSlide, autoPlayDelay)
  timerInterval = setInterval(updateTimer,1000)
  timeRemaining = autoPlayDelay / 1000
  updateTimer()
  autoPlayButton.textContent = 'Stop Auto Play'
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
  clearInterval(timerInterval);
  autoPlayInterval = null;
  timerInterval = null;
  timerDisplay.textContent = '';
  
  autoPlayButton.textContent = 'Start Auto Play';
}

// Event listeners
prevButton.addEventListener('click', () => {
  prevSlide();
  stopAutoPlay();
});

nextButton.addEventListener('click', () => {
  nextSlide();
  stopAutoPlay();
});

autoPlayButton.addEventListener('click', () => {
  if (autoPlayInterval) {
      stopAutoPlay();
  } else {
      startAutoPlay();
  }
});

initialLoad()
