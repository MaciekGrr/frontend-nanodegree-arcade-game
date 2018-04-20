// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    
    // Set the enemy initial location
    this.x = 0;
    this.y = 606;
    
    // Set enemy speed
    //this.speed = speed;
    
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    console.log('Enemy.prototype -> dt = ' + dt);
    this.x += (this.x * dt);
    
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*-----------------------------------------------------------------
 *-----------------------------------------------------------------
 */

// Player class
var Player = function(){
        
    // Set initial location
    this.x = 100;
    this.y = 400;
    
    // Set initial speed
    //
    
    // Set player character
    this.sprite = 'images/char-boy.png';
}

// Player update method
Player.prototype.update = function(dt) {
    
    // Test if dt is passed
    console.log('Player.prototype -> dt = ' + dt);
    
    // TODO: update player position
    //this.x = this.handleInput() * dt;
    //this.y = this.handleInput() * dt;
    
    // Calculate update position accordingly
}   

// Player handleInput() method
Player.prototype.handleInput = function(key) {
    
    //console.log('Player.prototype.handleInput -> dt = ' + dt);
    
    // move player accordingly
    if(key === 'left'){
        this.x -= this.x * dt;
    } else if(key === 'right'){
        console.log(this.x);
        console.log('this.x -> type -> ' + typeof this.x);
        console.log('dt -> type -> ' + dt);
        this.x += this.x * dt;
        console.log(this.x);
    } else if(key === 'up'){
        this.y += this.y * dt;
    } else if(key === 'dowm'){
        this.y -= this.y * dt;
    } 
    
    // forbid offscreen moves
    
    // handle water -> win game -> reset game (maybe separate method for this)
}

// Player render() method: draws player character on the screen
Player.prototype.render = function() {
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
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

