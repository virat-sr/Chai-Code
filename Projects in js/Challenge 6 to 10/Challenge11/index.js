
    const colorInput = document.getElementById('colorInput');
    const addButton = document.getElementById('addButton');
    const colorButtons = document.getElementById('colorButtons');

    // Function to validate hex color code
    function isValidHex(color) {
        return /^#[0-9A-F]{6}$/i.test(color);
    }

    // Function to create new color button
    function createColorButton(color) {
        const button = document.createElement('button');
        button.className = 'color-btn';
        button.style.backgroundColor = color;
        button.textContent = color;
        
        // Add click event to change background color
        button.addEventListener('click', () => {
            document.body.style.backgroundColor = color;
        });

        return button;
    }

    // Add button click handler
    addButton.addEventListener('click', () => {
        let color = colorInput.value.trim();
        
        // Add # if missing
        if (color.charAt(0) !== '#') {
            color = '#' + color;
        }

        if (isValidHex(color)) {
            const colorButton = createColorButton(color);
            colorButtons.appendChild(colorButton);
            colorInput.value = ''; // Clear input
        } else {
            alert('Please enter a valid hex color code (e.g., #ff0000)');
        }
    });

    // Allow Enter key to trigger add
    colorInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addButton.click();
        }
    });
