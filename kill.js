// Constants
const INITIAL_HEALTH = 100;
// Generates a random health decrease amount between 70 and 99
const HEALTH_DECREASE_AMOUNT = () => Math.floor(Math.random() * (99 - 70 + 1)) + 70;

const TIMER_DURATION = 18; // seconds
const SUCCESSFUL_HIT_CHANCE = 0.5;
const PLAYER_HURT_CHANCE = 0.5;
const FULL_HEALTH_PERCENTAGE = 100;
const TIMER_WARNING_THRESHOLD = 10;

// Initialize health values
let playerHealth = INITIAL_HEALTH;
let enemyHealth = INITIAL_HEALTH;
let isButtonActive = true;
let timerInterval;
let outcomeMessage = "";

const enemyHealthFill = document.getElementById('enemy-health-fill');
const playerHealthFill = document.getElementById('player-health-fill');
const button = document.getElementById('decrease-health-button');
const heymintButtonContainer = document.getElementById('heymint-button');
const heymintButtonContainer2 = document.getElementById('heymint-button-2');
const heymintButtonContainer3 = document.getElementById('heymint-button-3');
const outcomeDisplay = document.getElementById('outcome');
const battleMessage = document.getElementById('battle-message');
const loadingFill = document.getElementById('loading-fill');

// Select the enemy image using its class
const enemyImageElement = document.querySelector(".health-image");

// Wait for the HeyMint buttons to be rendered
document.addEventListener('DOMContentLoaded', () => {
  const heymintButtonContainers = [
    heymintButtonContainer,
    heymintButtonContainer2,
    heymintButtonContainer3
  ];

  heymintButtonContainers.forEach((container) => {
    const heymintButton = container.firstElementChild;
    if (heymintButton) {
      heymintButton.addEventListener('click', decreaseHealth);
    } else {
      console.error('HeyMint button not found');
    }
  });
});

// Function to update health bars
function updateHealthBars() {
  enemyHealthFill.style.width = `${enemyHealth}%`;
  playerHealthFill.style.width = `${playerHealth}%`;
}

// Function to handle health decrease
function decreaseHealth() {
  if (!isButtonActive) return;

  const successfulHit = Math.random() < SUCCESSFUL_HIT_CHANCE;

  setTimeout(() => {
    // Determine the outcome of the battle
    if (successfulHit) {
      enemyHealth = Math.max(enemyHealth - HEALTH_DECREASE_AMOUNT(), 0);
      outcomeMessage = "ENEMY HIT";
      updateHealthBars(); // Update bars only after enemy hit
      document.getElementById("enemy-health-stats").textContent = `${enemyHealth}/100 - HP`;

    if (enemyHealth <= 0) {
    outcomeMessage = "ENEMY DEFEATED";
    enemyImageElement.src = "https://lh3.googleusercontent.com/pw/AP1GczOCQsXiwTo3SxOCAdnKrCOY0Rs-4q_OF1Y8fRt7zVIVJsxMsOCvjNh1i20uBgjgNZydbqRVerev4osuGH3ls4LwAhF2pvdwLMgrIHmgNo0A_j7yVAmFH94oEBr-IBhCJbO0i8plq0c5HMxz148Cc1S_=w720-h720-s-no-gm?authuser=0"; // Set the defeated image URL here

    // Reset health bars after a short delay
    setTimeout(() => {
        enemyHealth = INITIAL_HEALTH; // Reset enemy health
        playerHealth = INITIAL_HEALTH; // Reset player health
        updateHealthBars(); // Update health bars
        document.getElementById("enemy-health-stats").textContent = `${enemyHealth}/100 - HP`; // Update health stats
        document.getElementById("player-health-stats").textContent = `${playerHealth}/100 - HP`; // Update player health stats
        enemyImageElement.src = "https://lh3.googleusercontent.com/pw/AP1GczM4HfAiKGU9_-zXkTJHn6kSRZN9sJUZ8MtBDnLoQ6UZ4vJBqFP5eabytYZkGKhwUIkf6w_xAV7pbAzo8BCNShDWHlO3DhmVvKI_PFB8a7EMED2kxYpSOIiHfM5JAWSTpUTsfwfxNv0amnsQ2SP2HpTG=w720-h720-s-no-gm?authuser=0"; // Reset to the original image after health reset
    }, 3000); // Delay before resetting health bars
}

    } else {
      if (Math.random() < PLAYER_HURT_CHANCE) {
        playerHealth = Math.max(playerHealth - HEALTH_DECREASE_AMOUNT(), 0);
        outcomeMessage = "PLAYER HURT";
        updateHealthBars(); // Update bars only after player hurt
        document.getElementById("player-health-stats").textContent = `${playerHealth}/100 - HP`;

        // Check if player's health reaches 0
        if (playerHealth <= 0) {
          outcomeMessage = "GAME OVER";
          updateHealthBars(); // Ensure the health bar reflects 0
          document.getElementById("player-health-stats").textContent = `0/100 - HP`; // Update health stats

          // Reset player health to initial value after a delay
          setTimeout(() => {
            playerHealth = INITIAL_HEALTH; // Reset player health
            updateHealthBars(); // Update health bars
            document.getElementById("player-health-stats").textContent = `${playerHealth}/100 - HP`; // Update player health stats
            location.reload(); // Reload the page to restart the game
          }, 3000); // Optional delay before reloading
        }
      } else {
        outcomeMessage = "DODGE AND MISS";
      }
    }

    // Display the outcome message
    outcomeDisplay.textContent = outcomeMessage;

    // Show the overlay with the outcome image
    const overlay = document.getElementById("overlay");
    overlay.style.display = 'flex'; // Show the overlay

    // Hide the overlay after a few seconds (e.g., 3 seconds)
    setTimeout(() => {
      overlay.style.display = 'none'; // Hide the overlay
    }, 5000); // Change duration as needed

    // Show the battle message after the delay
    battleMessage.style.display = 'block';
  }, 8000); // Delay before showing the outcome and overlay (1 second)

  // Disable button
  isButtonActive = false;
  button.disabled = true;

  startTimer();
}

// Function to start the timer
function startTimer() {
  let timer = TIMER_DURATION;
  const intervalId = setInterval(() => {
    timer--;
    loadingFill.style.width = `${(timer / TIMER_DURATION) * FULL_HEALTH_PERCENTAGE}%`;
    if (timer <= TIMER_WARNING_THRESHOLD) {
      outcomeDisplay.innerText = outcomeMessage;
    }
    if (timer <= 0) {
      clearInterval(intervalId);
      resetTimer();
    }
  }, 1000);
}

function resetTimer() {
  isButtonActive = true;
  button.disabled = false;
  loadingFill.style.width = `${FULL_HEALTH_PERCENTAGE}%`;
  outcomeDisplay.innerText = "";
  battleMessage.style.display = 'none';
}

// Initialize health bars
updateHealthBars();
let audio = document.getElementById('myAudio');

function toggleAudio() {
  if (audio.paused) {
    audio.play();
    document.getElementById('audioButton').textContent = '⏸️'; // Change button to pause symbol
  } else {
    audio.pause();
    document.getElementById('audioButton').textContent = '▶️'; // Change button to play symbol
  }
}
