const modalBtn = document.getElementById('modal-btn');
const modalBox = document.getElementById('win-modal');

// Enemies our player must avoid
var Enemy = function (x, y) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started

	// Set enemy location
	this.x = -120;

	// Set enemy initial location
	this.y = 60;

	this.width = 90;
	this.height = 50;

	// Set enemy initial speed
	this.speed = 250; // low
	this.speed = 400; // medium
	this.speed = 500; // high

	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
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

// Parameter: check if enemy and player collide.
// If so, reset player to its initial location
Enemy.prototype.isCollide = function () {

	if (this.x < player.x + player.width &&
		this.x + this.width > player.x &&
		this.y < player.y + player.height &&
		this.y + this.height > player.y) {

		player.x = 200;
		player.y = 400;
	}
}


/*-----------------------------------------------------------------
 *-----------------------------------------------------------------
 */

// Player class
var Player = function () {

	// Set initial location
	this.x = 200;
	this.y = 400;

	this.width = 90;
	this.height = 50;

	// Set initial speed
	this.speed;

	this.isKeyUp = true;

	this.direction = '';

	// Set player character
	this.sprite = 'images/char-boy.png';
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

// Player handleInput() method
Player.prototype.handleInput = function (key) {

	// handle direction and speed of movement
	if (key === 'right' && this.isKeyUp && this.x < 380) {
		this.direction = 'right';
		this.speed = 4000;
	} else if (key === 'left' && this.isKeyUp && this.x > 33) {
		this.direction = 'left';
		this.speed = 4000;
	} else if (key === 'up' && this.isKeyUp && this.y > 41) {
		this.direction = 'up';
		this.speed = 3100;
	} else if (key === 'up' && this.isKeyUp && this.y < 41) {
		// display win modal
		setTimeout(function () {
			modalBox.style.display = 'block';
		}, 200);
	} else if (key === 'down' && this.isKeyUp && this.y < 400) {
		this.direction = 'down';
		this.speed = 3100;
	}

}

// Player render() method: draws player character on the screen
Player.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Player.prototype.isGameWon = function () {
//}

// Instantiate player object
var player = new Player();

// Instantiate enemy objects
var enemy0 = new Enemy();
var enemy1 = new Enemy();
var enemy2 = new Enemy();

// Instantiate allEnemies object
var allEnemies = [];

allEnemies.push(enemy0, enemy1, enemy2);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
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

modalBtn.addEventListener('click', function () {
	//modalBox.style.display = 'none';
	window.location.reload(false);
})
