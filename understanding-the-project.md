# Understanding the project.

Having a plan before coding is vital, as it affect code quality and productivity. 

But to have a plan, we must understand the puzzle. 

If we get familiar with the code, make it our own, understand what's going on, everything else will be much (much) easier.

So I spent a few hours reading, studying and understanding how the game actually works under the hood. 

Here's how.

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
2. implement the Player class (constructor)
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
* create SEVERAL new Enemy obj and place them in an arr called allEnemies