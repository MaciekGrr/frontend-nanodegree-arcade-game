// Enemies our player must avoid
var Enemy = function (x, y) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started

	// Set enemy location
	this.x = -120;
	
	// Set enemy initial location
	this.y = 60; 
	
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
	d
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
			this.speed = 300;
		} else if (randomN === 2) {
			this.y = 140;
			this.speed = 400;
		} else if (randomN === 3) {
			this.y = 230;
			this.speed = 500;
		}
	}

	this.x += (this.speed * dt);

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*-----------------------------------------------------------------
 *-----------------------------------------------------------------
 */

// Player class
var Player = function () {

	// Set initial location
	this.x = 200;
	this.y = 400;

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
		this.speed = 3100;
	} else if (key === 'left' && this.isKeyUp && this.x > 33) {
		this.direction = 'left';
		this.speed = 3100;
		console.log(this.x);
	} else if (key === 'up' && this.isKeyUp && this.y > 40.1) {
		this.direction = 'up';
		this.speed = 3100;
		console.log(this.y);
	} else if (key === 'up' && this.isKeyUp && this.y < 40.1) {
		setTimeout(function () {
			alert(this.y + 'hit water!');
		}, 300)
	} else if (key === 'down' && this.isKeyUp && this.y < 400) {
		this.direction = 'down';
		this.speed = 3100;
	}

}

// Player render() method: draws player character on the screen
Player.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Instantiate player object
var player = new Player();

// Instantiate allEnemies object
var allEnemies = [];
var enemy = new Enemy();
allEnemies.push(enemy);

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
