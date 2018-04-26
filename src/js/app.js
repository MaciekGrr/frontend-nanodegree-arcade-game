const modalC = document.getElementById('c-modal'),
	modalWin = document.getElementById('win-modal'),
	modalGameOver = document.getElementById('game-over-modal'),
	modalBtnWin = document.getElementById('modal-btn-win'),
	modalBtnC = document.getElementById('modal-btn-c');
var characters = modalC.getElementsByClassName('modal__character'),
	isCharSelected = true,
heartN1 = document.getElementById('heart1'),
	heartN2 = document.getElementById('heart2'),
	heartN3 = document.getElementById('heart3');

/*
	-------------------------------------------ENEMY CLASS
*/

// Enemies our player must avoid
var Enemy = function (x, y) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started

	// Set enemy location
	this.x = -120;

	// Set enemy initial location
	this.y = 60;

	// set width and height: to use in Enemy.handleCollision() method 
	this.width = 80;
	this.height = 40;

	// Set enemy initial speed
	this.speed = 250; // low
	this.speed = 400; // medium
	this.speed = 500; // high

	// The image/sprite for our enemies, this uses a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {

	// Calculate random number between 1 and 3
	let randomN = Math.floor((Math.random() * 3) + 1);

	// When enemy is off-screen
	// randomize new position at which it's created
	if (this.x > 520) {

		// Reset x coordinate to off-screen
		// left side
		this.x = -120;

		// Generate enemy on one of the stone rows
		if (randomN === 1) {
			this.y = 60;
			this.speed = 500;
		} else if (randomN === 2) {
			this.y = 140;
			this.speed = 600;
		} else if (randomN === 3) {
			this.y = 230;
			this.speed = 700;
		}
	}

	this.x += (this.speed * dt);

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* 
 * Parameter: check if enemy and player collide.
 * If so, reset player to its initial location
 */
Enemy.prototype.handleCollisions = function () {

	if (this.x < player.x + player.width &&
		this.x + this.width > player.x &&
		this.y < player.y + player.height &&
		this.y + this.height > player.y) {

		// Handle lives 
		if (player.lives === 3) {
			player.loseLife(player.life1);
		} else if (player.lives === 2) {
			player.loseLife(player.life2);
		} else {
			// Handle Game Over
			player.isGameOver = true;
			setTimeout(function () {
				player.endGame();
			}, 1000);
		}
	}
}


/*
	----------------------------------------------PLAYER CLASS
 */

// Player class
var Player = function () {

	// Set initial location
	this.x = 200;
	this.y = 400;

	this.width = 80;
	this.height = 40;

	// Set initial speed
	this.speed;
	
	// Boolean: to use in Player.handleInput() method
	this.isKeyUp = true;

	// Set player directon. Empty.
	// It changes in player.handleInput() to give direction to movement
	this.direction = '';

	// Set player character
	this.sprite = 'images/char-boy.png';

	// Set player initial lives number
	this.lives = 3;

	// Assign hearts elements to three variables. To use in player.loseLife() method
	this.life1 = heartN1;
	this.life2 = heartN2;
	this.life3 = heartN3;

	// Boolean. Use it to check if game is over 
	this.isGameOver = false;
}

// Updates player position
Player.prototype.update = function (dt) {

	if (this.direction === 'right') {
		this.x += (this.speed * dt);
		this.speed = 0;
	} else if (this.direction === 'left') {
		this.x -= (this.speed * dt);
		this.speed = 0;
	} else if (this.direction === 'up') {
		this.y -= (this.speed * dt);
		this.speed = 0;
	} else if (this.direction === 'down') {
		this.y += (this.speed * dt);
		this.speed = 0;
	}

}

/* Player handleInput() method:
 * based on key input sets direction, speed
 * and checks win conditions
*/
Player.prototype.handleInput = function (key) {

	// handle direction and speed of movement
	if (key === 'right' && this.isKeyUp && this.x < 380) {
		this.direction = 'right';
		this.speed = 4000;
	} else if (key === 'left' && this.isKeyUp && this.x > 33) {
		this.direction = 'left';
		this.speed = 4000;
	} else if (key === 'up' && this.isKeyUp && this.y > 45) {
		this.direction = 'up';
		this.speed = 3100;
	} else if (key === 'up' && this.isKeyUp && this.y < 45) {
		// Player wins
		player.winGame();
	} else if (key === 'down' && this.isKeyUp && this.y < 400) {
		this.direction = 'down';
		this.speed = 3100;
	}
}

// Player render() method: draws player character on the screen
Player.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/* Player method: 
 * at collision decrease lives by 1
 * hide a heart
 */ 
Player.prototype.loseLife = function (life) {
	player.lives--;
	life.style.display = 'none';
	player.x = 200;
	player.y = 400;
}

/*
 * Invoked when player wins the game:
 * displays win modal
 * reloads page if player hits enter or clicks on modal button
*/
Player.prototype.winGame = function () {
	modalWin.style.display = 'block';

	document.addEventListener('keydown', function (e) {
		if (e.keyCode === 13) {
			reloadAfterWin();
		}
	})

	modalBtnWin.addEventListener('click', function () {
		reloadAfterWin();
	})
}

/* Player method: 
 * show game over modal
 + reset game on spacebar press
*/ 
Player.prototype.endGame = function () {
	player.isGameOver = true;
	modalGameOver.style.display = 'block';
	document.addEventListener('keydown', function (e) {
		if (e.keyCode === 32 || e.keyCode === 13) {
			isCharSelected = false;
			window.location.reload(false);
		}
	})

}

// Instantiate player object
var player = new Player();

// Instantiate enemy objects
var enemy0 = new Enemy();
var enemy1 = new Enemy();
var enemy2 = new Enemy();

// Instantiate allEnemies object
var allEnemies = [];

// Push enemies into allEnemies[]
allEnemies.push(enemy0, enemy1, enemy2);

/*
 * when player wins it sets isCharSelected to false
 * and reloads the page
*/
function reloadAfterWin() {
	isCharSelected = false;
	window.location.reload(false);
}


// This listens for key presses and sends the keys to your
document.addEventListener('keyup', function (e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.isKeyUp = true;

	player.handleInput(allowedKeys[e.keyCode]);

});

/*
 * Iterate through DOM character div containers
 * When user clicks a character:
 * if other characters have class 'selected', remove it abd sets isCharSelected to false
 * add class 'selected' to clicked character
 * set isCharSelected to true
 * based on character's id, set player.sprite to related image url
 */
for (let character of characters) {
	character.addEventListener('click', function (e) {

		for (let character of characters) {
			character.classList.remove('selected');
			isCharSelected = false;
		}

		this.classList.add('selected');

		isCharSelected = true;

		if (e.target.id === 'boy') {
			player.sprite = 'images/char-boy.png';
		} else if (e.target.id === 'cat-girl') {
			player.sprite = 'images/char-cat-girl.png';
		} else if (e.target.id === 'horn-girl') {
			player.sprite = 'images/char-horn-girl.png';
		} else if (e.target.id === 'pink-girl') {
			player.sprite = 'images/char-pink-girl.png';
		} else {
			player.sprite = 'images/char-princess-girl.png';
		}
	})
}

/*
 * On character modal. If and when user clicks the button:
 * if no character was selected, don't do anything
 * else hide modal
 */
modalBtnC.addEventListener('click', function () {
	if (isCharSelected == false) {
		return;
	}
	modalC.style.display = 'none';
})
