

document.addEventListener("DOMContentLoaded", () => {
    
    const quoteContent = document.getElementById("quote-content");
    const quoteAuthor = document.getElementById("quote-author");
    const newQuoteButton = document.getElementById("new-quote");
    const copyQuoteButton = document.getElementById("copy-quote");
    const twitterShareButton = document.getElementById("twitter-share");
    const exportQuoteButton = document.getElementById("export-quote");

    // Function to fetch a random quote using node-fetch
    const fetchQuote = async () => {
        const url = 'https://api.freeapi.app/api/v1/public/quotes/quote/random';
        const options = { method: 'GET', headers: { accept: 'application/json' } };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            quoteContent.textContent = `"${data.data.content}"`;
            quoteAuthor.textContent = `- ${data.data.author}`;
            twitterShareButton.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `"${data.data.content}" - ${data.data.author}`
            )}`;
        } catch (error) {
            quoteContent.textContent = "Failed to fetch quote.";
            quoteAuthor.textContent = "";
            console.error("Error fetching quote:", error);
        }
    };

    // Function to copy quote to clipboard
    const copyToClipboard = async () => {
        try {
            const textToCopy = `${quoteContent.textContent} ${quoteAuthor.textContent}`;
            await navigator.clipboard.writeText(textToCopy);
            alert("Quote copied to clipboard!");
        } catch (error) {
            console.error("Error copying to clipboard:", error);
        }
    };
   
    // Function to export quote as an image
    const printQuote = () => {
        const originalContent = document.body.innerHTML;
        const quoteContainer = document.getElementById("quote-container").outerHTML;

        // Replace the body content with the quote container
        document.body.innerHTML = quoteContainer;

        // Trigger the print dialog
        window.print();

        // Restore the original content
        document.body.innerHTML = originalContent;
        location.reload(); // Reload the page to reinitialize scripts
    };

    // Set a random background image
    const setRandomBackground = async () => {
        const loadingText = document.querySelector('.loading-text');
        const bg = document.querySelector('.bg');
        let load = 0;
    
        // Function to handle the blurring effect
        const blurring = () => {
            load++;
    
            if (load > 99) {
                clearInterval(int);
            }
    
            loadingText.innerText = `${load}%`;
            loadingText.style.opacity = scale(load, 0, 100, 1, 0);
            bg.classList.remove('blur-lg');
            bg.style.filter = `blur(${scale(load, 0, 100, 30, 0)}px)`;
        };
    
        // Scale function to map one range of numbers to another
        const scale = (num, in_min, in_max, out_min, out_max) => {
            return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
        };
    
        // Show the loading text and start the blurring effect
        loadingText.classList.remove('hidden');
        const int = setInterval(blurring, 30);
    
        try {
            const x = Math.floor(Math.random() * 100); // Generate a random ID between 0 and 1084
            const randomImage = `https://picsum.photos/id/${x}/1920/1080`;
            const response = await fetch(randomImage);
    
            // Check if the image exists
            if (response.ok) {
                bg.style.backgroundImage = `url(${randomImage})`;
            } else {
                throw new Error("Image not found");
            }
        } catch (error) {
            console.error("Error fetching random background image:", error);
            // Fallback to a default image
            bg.style.backgroundImage = `url('https://source.unsplash.com/random/1920x1080/?nature,landscape')`;
        } finally {
            bg.style.backgroundSize = "cover";
            bg.style.backgroundPosition = "center";
            loadingText.classList.add('hidden'); // Hide the loading text after the background is set
        }
    };
    

    // Event listeners
    newQuoteButton.addEventListener("click", async () => {
        await fetchQuote();
        await setRandomBackground()
    });

    copyQuoteButton.addEventListener("click", copyToClipboard);
    // exportQuoteButton.addEventListener("click", printQuote);

    // Initial load
    (async () => {
        await fetchQuote();
        await setRandomBackground();
    })();
});