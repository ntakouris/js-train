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

## Pull Requests
PRs are much welcome; especially if they are preset workouts!
