
// Array of image file paths for specific pairs
const pairImages = [
    'images/EDU/EDU-Correct.png',  // Replace with actual image paths or URLs
    'images/ECO/ECO-Correct.png',   
    'images/INFO/INFO-Correct.png'
];

// Array of image file paths for filler (non-matching) images
const fillerImages = [
    'images/EDU/EDU 1.1.png',  // Replace with actual image paths or URLs
    'images/ECO/ECO 1.1.png',
    'images/INFO/INFO 1.1.png',
    'images/EDU/EDU 1.2.png',
    'images/ECO/ECO 1.2.png', 
    'images/INFO/INFO 1.2.png', 
    'images/EDU/EDU 1.3.png',   
    'images/ECO/ECO 1.3.png',     
    'images/INFO/INFO 1.3.png',
    'images/EDU/EDU 1.4.png'
];

const totalCards = 16;
let timeLeft = 59;
let isGameOver = false;
let countdown;

// Create an array of pairs for the specific images
let gameImages = [...pairImages, ...pairImages]; // 3 pairs duplicated

// Fill the rest with random, non-duplicated filler images
while (gameImages.length < totalCards) {
    const randomFiller = fillerImages.pop(); // Pop unique filler images
    gameImages.push(randomFiller);
}

// Shuffle the cards
gameImages.sort(() => Math.random() - 0.5);

const gameBoard = document.getElementById('game-board');
let flippedCards = [];
let matchedSpecificPairs = [];

// Create cards and add them to the game board
gameImages.forEach((imageSrc, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-image', imageSrc); // Store the image source
    card.setAttribute('data-index', index);
    
    // Create the front and back of the card
    const frontFace = document.createElement('img');
    frontFace.classList.add('front-face');
    frontFace.src = imageSrc;  // Image to display when the card is flipped
    
    const backFace = document.createElement('div');
    backFace.classList.add('back-face');  // The card back (hidden by default)

    card.appendChild(frontFace);
    card.appendChild(backFace);

    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
});

// Handle Start Game button click
document.getElementById('start-btn').addEventListener('click', () => {
    startGame();
    document.getElementById('start-btn').style.display = 'none';
    gameBoard.style.visibility = 'visible';
});

function startGame() {
    isGameOver = false;
    timeLeft = 59;
    document.getElementById('congratulation-message').style.display = 'none';
    document.getElementById('lose-message').style.display = 'none';
    document.getElementById('timer').textContent = `${timeLeft} seconds`;
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.pointerEvents = 'auto'; // Enable card flipping
        card.querySelector('.front-face').style.visibility = 'hidden'; // Hide images initially
    });

    // Start countdown timer
    countdown = setInterval(() => {
        if (timeLeft <= -1) {
            clearInterval(countdown);
            endGame(false);
        }
        if (!isGameOver) {
            document.getElementById('timer').textContent = `${timeLeft} seconds`;
            timeLeft--;
        }
    }, 1000);
}

function flipCard() {
    if (flippedCards.length === 2 || isGameOver) return; // Don't allow more than 2 cards to flip at once or after game ends
    const card = this;

    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.querySelector('.front-face').style.visibility = 'visible'; // Show the image
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        setTimeout(checkForMatch, 1000);
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.getAttribute('data-image') === card2.getAttribute('data-image')) {
        card1.classList.add('matched');
        card2.classList.add('matched');

        // Only count if the matched pair is one of the specific pairs (Apsara, Media, Services)
        if (pairImages.includes(card1.getAttribute('data-image'))) {
            matchedSpecificPairs.push(card1.getAttribute('data-image'));
        }
    } else {
        card1.querySelector('.front-face').style.visibility = 'hidden'; // Hide images if no match
        card2.querySelector('.front-face').style.visibility = 'hidden';
    }

    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    flippedCards = [];

    // Check if all 3 specific pairs are found
    if (matchedSpecificPairs.length === pairImages.length) {
        endGame(true);
    }
}

function endGame(hasWon) {
    isGameOver = true;
    clearInterval(countdown); // Stop the timer

    if (hasWon) {
        document.getElementById('congratulation-message').style.display = 'block';
    } else {
        document.getElementById('lose-message').style.display = 'block';
    }

    // Disable further clicking on cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.pointerEvents = 'none';
    });
}


// confetti when the player wins

function endGame(hasWon) {
    isGameOver = true;
    clearInterval(countdown); // Stop the timer

    if (hasWon) {
        document.getElementById('congratulation-message').style.display = 'block';
        
        // Trigger confetti when the player wins
        confetti({
            particleCount: 1000,
            spread: 100,
            origin: { x: 0.5, y: 0.10 }
        });
    } else {
        document.getElementById('lose-message').style.display = 'block';
    }

    // Disable further clicking on cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.pointerEvents = 'none';
    });

    // Set a timeout to reload the game after 30 seconds
    setTimeout(() => {
        location.reload();  // Reloads the page to restart the game
    }, 10000);  // 10 seconds
}

