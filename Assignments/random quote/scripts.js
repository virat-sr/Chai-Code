
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
    const exportQuote = async () => {
        try {
            const quoteContainer = document.getElementById("quote-container");
            const canvas = await html2canvas(quoteContainer);
            const link = document.createElement("a");
            link.download = "quote.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Error exporting quote:", error);
        }
    };

    // Set a random background image
    const setRandomBackground = async () => {
        const randomImage = `https://source.unsplash.com/random/1920x1080/?nature,landscape`;
        document.body.style.backgroundImage = `url(${randomImage})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    };

    // Event listeners
    newQuoteButton.addEventListener("click", async () => {
        await fetchQuote();
        await setRandomBackground();
    });

    copyQuoteButton.addEventListener("click", copyToClipboard);
    exportQuoteButton.addEventListener("click", exportQuote);

    // Initial load
    (async () => {
        await fetchQuote();
        await setRandomBackground();
    })();
});