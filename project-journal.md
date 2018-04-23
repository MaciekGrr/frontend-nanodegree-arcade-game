# Day 1 - Thu 19/4/18
6:20am - downloaded the repo from Udacity's github. Read through project notes and instructions. Now I'm reading through the project files in order to understand the following:
* how the game works
* what I need to do

## How the game works

Files:
* `index.html`: loads style and js - which handles most of the game
* `css/styles.css`: place the game screen at the center of the page
* `js` folder: handles all the game logic. It's the main actor. Has 3 files:
    - resources.js
    - engine.js
    - app.js
    
### resourcs.js
At the very beginning of the file, there is one object and two arrays that get declared.

The object is `resourceCache{}`. This is where the images, when loaded, store the URL so that when the game needs them again, it will *return the images* instead of reloading them.

The arrays are `loading[]` and `readyCallBacks[]`. In the latter go all the onReady callback functions that need to be executed when images are loaded.

Then, there is the **public `load(url)`** function used to load images. Its argument can be an array of url strings or a single one. Based on the situation:
* if arg is arr-> for each url string in arr -> call the private `_load(url)` function
* if arg is a single url string -> call the `_load(urlOrArr)` function, which means pass the same arg to it

When called, the **private image loading `_load(url)`** function works like this:
* if the passed url is in the `resourceCache[url]`  function -> return it (so that img is not loaded again)
* else:
    - create new instance of Image()
    - when img is loaded
        - add it to the cache obj so that you don't need to load it again
        - call all the callback functions stored in the `readyCallBack[]` array
* finally:
    - set initial cache value (url) as false, because it will change when `img.onload()` is called above
    - point img `src` attribute to the url passed


Having said that, the program has two more functions: `isReady()` and `get(url)`.

**The `isReady()` function** checks whether the images have been loaded. Bades on the outcome, it returns either `true` or `false`.

**The `get(url)` function**, on the other hand, is placed for us to return images we know have already been loaded in the game.


### engine.js
In a few words, the game is just a continuous redrawing of the screen. Each time the state changes - for example, when the player or an enemy moves - the browser redraws the screen. This gives an illusion of animation, movemenet, but what we see are just images drawn over and over and over.

So first of all, the Engine makes the cavas' context obj available gloabally. This means we can access it in app.js

At the beginning, global vars are declared:
* `doc`: grabs the document
* `win`: refer to the window obj
* `canvas`: creates and assigns a `<canvas>` element
* `ctx`: uses the `.getContext('2d')` method to set set `canvas` as 2D.
* `lastTime`: will stores last current time used to calculate delta time.

Then it sets the canvas dimensions and append it to the document.

**At this point there is the `main()` function**:
* get current time
* calculates delta time: the timeframe between current and last time
* updates dt
* renders game again


**Then the `init()` function** that:
* resets (read: reset \= restart) the game (our discretion to impelement it or not). It can be used for new game menu or the likes
* sets `lastTime` to current time
* calls `main()`

**The `update(dt)` function**:
* calls the `updateEntities(dt)` based on delta time
* (and maybe, depending on how we decide to handle it) calls a function to handle collisions


**The `updateEntities(dt)` function**: updates enemies and player position. This refers to `player.update()` and `enemy.update(dt)`, two methods we need to implement.

**The actual `render()` function**. This contains an array, `rowImages[]` that stores all the images needed to draw the game screen. The interesting thing the images' index reflects the order by which they are drawn, later on, by the for loop of the same function. 
Before actually drawing, the canvas is cleared. Also, after the screen is loaded, enemies and players are rendered.

So to recap:
1. load all the images we need
2. at each game state change:
    * clear screen
    * draw screen
    * render entities
   Rinse and repeat.



### app.js
Here's where we need to put our work. Read next section.

## What I need to do 
Taking info directly from the project details, there are three tasks to do:
1. implement the Enemy class (constructor)
2. implement the Player class
3. initate Emeny and Player objs (instances/subclasses)

### Enemy Class
For this, we need to *complete* what follows:
1. Enemy function:
    * set the Enemy initial location
    * set the Enemy speed 
    
2. Update enemy method: 
    * update the Enemy's location
    * handle collision with the Player
    
    
### Player Class
For this, we need to *implement our own Player class*. This means to:
1. create a Player function that initiates the Player by doing this:
    * load the Player img by setting this.sprite to the appropriate folder
    * set the Player initial location
    
2. update the Player method:
    * update Player location
    * handle collision with Enemy
    
3. implement the render method for the Enemy (hint: use code from Enemy.render())

4. implement the handleInput method, that:
    * should receive user input (one of the allowedKeys)
    * and move the player according to said input:
        - L key->move left
        - R key->move right
        - U key->move up
        - D key->move down
        
### Initiate Enemy and Player
Initiate Enemy and Player (create new objects - in other words: new instances of them) by doing this:
* create new Player obj
* create SEVERAL new Enemy obj and place them in an arr called allEnemie

11:59am - ok so now I have a better idea of how everything works. Need a plan, but one for every step. 

So first I should start on the Enemy class.



# Day 2 - Fri 20/4/18
6:33am - ok. Better do baby-steps. So, the first thing to handle is the Enemy function. 
In this function, I need to:
1. set the enemy's initial location
2. set the enmy speed

Let's start with number 1.

## Enemy initial location
How can I set this thing? Mmm. What kind of info I have on it? Let's see. For the positions I set this.x=0 and this.y = 606, so that I can hope the enemy will render on top-left corner. Not sure about this, but if needed I can fix it.

## Enemy speed
For the speed I checked what delta time is. Now it makes sense. In short: calcultes the seconds passed between the last game reframe and the actual state. Based on this I should handle speed.

Oh. Maybe for the speed, once I have the delta time, I can use setTimeout. 

Hm no wait. 

Enemies are out of our control, which means we can't move an enemy with arrow keys. 

`Enemy.prototype.update` should do something like: 

```javascript
var newPosition = last checked position * delta time;
this.x = newPosition;
```
or even better

```javascript
this.x = newPosition;
x += (x * delta time);
```

8:29am - I set enemy's update method as above. Not sure of that too. But it's ok, can fix it if need be. 

I also set player vars, like I did with enemy.

Now I'm on player update method. This one should use handleInput because the state update depends on which key the player enters (the movement direction).

How stupid I am. I can use the Enemy render() code for this. It's written in the guidelines too. How could I not think about that?

9:02am - ok. Implemented Player update method. For the handleInput I tried to log the keys and works. The thing is: the protype is abstract. Need to remember that.

10:01am - I tried to initiate player and enemy, then allEnemies in the hope I could have at least a fine screen print. What happens is that the game starts a dangerous loop, player appears but enemies don't. This looping risks to freeze the browser. Clearly this is not how things should go.

Ok I commented out the update of enemies so now I can focus on the player alone. Loop happens anyway. Why?

Weird thing: if I set Player.speed = 1 (finite int) The game engine draws the screen without looping. But the problem is also that dt is still undefined. I should pass it from Engine to Enemy and Player so that entities can move. But how? Maybe call()?


11:07am - I passed dt successfully into handleInput. dt comes in as undefined, which means the new position is NaN, hence ctx can't draw char in new position. Why? 

12:09am - after one hour I can't seem to make it work. I looked for call() but couldn't make it work that way too. It says Engine is unde77fined. 

In enemy.update dt is a number, not undefined. 

12:33pm - when I pass dt to update it's ok. The problem starts when I pass dt from dt to this.handleInput from within Player.prototype.update(dt); I think that using the `this` key inside the method makes it lose context. Because this should refer to Enemy, not the method.  

In fact, when I remove the handleInput call from within update, it prints dt. The problem now is that this way Player.update() is called infinitely.
    
TODO: write down what happens in the program when player wants to move character

***

# Day 3 - Sat 21/4/18
5:07am - ok, let's see what happens when player presses an arrow k, right for example.

So rk is pressed. event listner calls player.handleInput (the object we instantiate from its class). This calls back its class method (Player.prototype.handleInput), which takes the key pressed as argument. Based on the key pressed: HandleInput can tell the program in which direction to move. 

Then, handleInput should tell update() said move so that update() can recalculate char position.

At this point, once there's a new position for the char, render() can rewrithe the char image in the newly calculated position.

But here's the thing: the dt parameter should then belong only to update. handleInput finds the movement direction (+x,-x,+y,-y) and tell it to update(). In handelInput I return said mov dir. Then I can call handleInput from whithin update. 

5:53am - kind of ok. I set direction as global var in class scope, then recalled in handleInput, set it to key, returned and used in update. 

The char moves to the right when k is pressed BUT it does it infinitely. Not just once. Update still runs in a continuous loop.

6:42am ok so if I avoid printing on the console the browser doesn't crash. So this is how the game works of course. It's just my laptop.

Ok so back at square one. Have game screen printed w/ only char. Char moves but doesn't stop

8:03am - now update is telling: move to the right by this much. This at each tick. So move move move move move...etc

9:48am - I created a workaround to stop movement. There is a problem though: movement is fluid, not step-by-step. The fact is my wa tells to move in that direction until keyUp is false. 

The instruction to move should be a one-time thing.

That is "move to the right by [pixels] and then stop.
You stop when you don't have speed. So speed should be 0 to tell this.
But I set speed in handleInput, so 

10:34am - for fruhstuck's sake, I had only to set speed to 0 right after the movement in update. :/

It was that simple. 

...

12:11am - at this point I covered most requirements for player.
I can move on to the enemy.

There are some things to do:
- update enemy location (random between bounds)
- randomize enemy speed: should be a random number between 0 and maxV (say, 200)
- instantiate allEnemies
- make sure to delete enemies from memory once they get out of bounds, so that memory frees up for new bugs to generate at next update. (this may be some complicated bu who cares). 

But in order.

TODO: render enemy in fixed pos to test render.
12:49am - done. Also found enemy.y and enemy.x bounds

Should update enemy location so that is random. Oh and set enemy starting position offscreen. Like if 0 has enemy's ass on left screen border, then starting p should be somth like -100? Hmm. Tested it, so yeah somth in between 50 and 100. I went to 80.

So enemy's initial x is set off screen. 

TODO: randomize enemy.x at each update so that it gets generate at a random row at each update. This will need adjustment to integrate with allEnmies, once I get there.

***

# Day 4 - Sun 22/4/18
5:15am - continue from where I left yesterday.

TASKS: 
v- when enemy is offscreen, update its location 
v- update enemy location (random between bounds)
v- randomize enemy speed: should be a random number between 0 and maxV (say, 200)
- instantiate allEnemies
- make sure to delete enemies from memory once they get out of bounds, so that memory frees up for new bugs to generate at next update. (this may be some complicated bu who cares).

TODO: when enemy is offscreen, reset its location.

5:28am - it was a matter of checking enemy.x value off-screen and put an if statement in update

TODO: update enemy location between random bounds. Mmm not a random n between max min. It should be one of upper, mid or lower row. One of these 3. How?

Well I can generate a random number between 1 and 3, then decide which row to generate the eneny based on that. Let's start with two rows.
...
Enemies are generated BUT at each tick of the game. Should fix it. Enemy should be created let's say when one reaches second square.
...
The same happens. Maybe is because I keep generating the same bug everytime.
...
To make it work I set the check this.x when enemy is off-screen.

TODO: randomize enemy speed, to update when e is off-screen. Ok but randomize. So should be n between limits. min shoudn't be too low. Max ok.
Let's see what I can find.
...
Values I found for speed:
- low->300
- mid->400
- high->500

So again, I can use the same three if statements to generate this speed. And it works. 

For tomorrow.

TASK 
- instantiate allEnemies
- make sure to delete enemies from memory once they get out of bounds, so that memory frees up for new bugs to generate at next update. (this may be some complicated bu who cares).

TODO: instantiate allEnemis. Things to consider: 
* there should be 3 enemy obj, one for each row.
* when initiating allEnemies, should contain these 3 objs.
* allEnemies has a forEach method on it that applies update on each obj. Do the current update method allows to be free of bugs?

***

# Day 5 - Mon 23/4/18
5:12am
TASKS
v- instantiate allEnemies
v- make sure to delete enemies from memory once they get out of bounds, so that memory frees up for new bugs to generate at next update. (this may be some complicated bu who cares).
v- Vehicle-player collisions happen logically (not too early or too late)
v- Vehicle-player collision resets the game
- Something happens when player wins

TODO: instantiate allEnemis. Things to consider: 
* there should be 3 enemy obj, one for each row.
* when initiating allEnemies, should contain these 3 objs.
* allEnemies has a forEach method on it that applies update on each obj. Do the current update method allows to be free of bugs?

allEnemies. How do I go about generating allEnemies object, in a way that they get generated infinitely, w/o replacing the one currenty going on the road?
...
By instantiating 3 enemy objs, and pushing them to allEnemies, the game engine goes on. It generates bugs each time one hits off-screen. Because I set their speed to be random, there's the illusion that game creates enemies all the time.

TODO: implement checkCollisions
Hm. How should I check collisions? A collision happens when enemy and player are at the same location (i.e. same x,y coordinates). 
When this should happen? After each update, enemy and player are available globally, so I can handle this in the engine directly.
Hence, if p and e have same xy coordinates, put p to starting location again.
...
Hm. Not working. Probably it's considering the exact coordinate the problem. Let's try < and >.

[slept from 8 to 9:27am]

9:38am - found on MDN the rectangle approach to sprite collision. Let's test it first.
...
Seems to work. So basically I set width and height for both player and enemy objs. Then, considered they are on x and y axes, I check that there is no gap between them. If that's true then a collision happened. And since the images have transparent border and height is greater that seeable height, I set a lower height than the real one, so that collisions happen at the right time.

Now when collisions happen I can put p to initial location. Yeah but checkCollision should return something. 
...
How stupid: I was only resetting player.x

TODO: something happen when player resets the game 
When player wins show win-modal.
Modal:
* message
* restart button->triggers page refresh

In app.js I can build a function that handles modal display. Then I can add an event listener that triggers when restart button is clicked.
So:
* build modal
* build modal fn
* build modal evt listener

[wsl]

12:29pm - 
