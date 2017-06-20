# js-train | About
A timing/action execution framework built because there is no similar thing on the market.
You can use this as an instructor to properly time your workout progression, thus being able to exercise effectively alone.

I also wanted to learn some javascript.

## How to serve fast
```
git clone https://github.com/Zarkopafilis/js-train.git
cd js-train
npm install
gulp build && npm start
```
Currently the app.js is configured with a `const port = process.env.PORT;` to run on heroku.
 You might want to change it if you want to run locally.
 
## Structure
`app.js` Just serves the static resources that gulpfile moves/produces on /dist

`/resources` contains various resources, like the beep.mp3

`/js` contains all the actual nuts and bolts of the project:
    + `train.js` contains the core of the project (class definitions, the run loop, etc...)
    + `resources.js` contains preset actions, blocks and example workouts
    + `ui.js` contains all the logic required by the index.html so that the website functions correctly

These are also the reasons why these 3 need to be placed in that correct order in the app.js. (To avoid undefined stuff, mainly)

## Creating your own presets & workouts

### Overview
In order to create your own presets you can either include in them bits and pieces you find into `resources.js` or create them from scratch by using the libraries contained into `train.js`.

### Available Components
    - **Action** : Encapsulates some function which does anything. Current action presets: beep, text-to-speech
    - **SleepAction** : An Action that just makes the flow halt for X seconds
    - **SleepOffsetAction** : A SleepAction that makes the flow halt for X+-offset seconds randomly
    - **Block** : It contains an array of Action(s) which unfolds with a depth of 1 upon calling run()
    - **FlowSplitter** : Encapsulates many actions or blocks that get exposed on run() every time with different action picking behaviors

Everything can include a repeat(N times) closure.
### General Guidelines
In general, there are 4 ways to create a block of actions:
    1. Wrap the classes around each other, like the first examples on `resources.js`
    2. Use the factory provided inside `train.js`
    3. Use the DSL which is better explained by opening up the `index.html` in a browser
    4. Using the interactive visual editor (which generates the DSL)

2 and 4 Are currently under development.

## Pull Requests
PRs are much welcome; especially if they are preset workouts!
