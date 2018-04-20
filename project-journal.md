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