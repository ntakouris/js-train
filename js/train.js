const step = 20;//in miliseconds

class Action{
    constructor(name = "Action", actualAction){
        this.name = name;
        this.actualAction = actualAction;
    }

    run(){
        console.log("Executing Action: " + this.name);
        this.actualAction();
    }
}

class SleepAction extends Action{
    constructor(ms){
        super("Sleep " + ms);
        this.ms = ms;
        this.initialMs = ms;
    }

    run(){
        //console.log("Sleep action step");
        if(this.ms <= 0){
            this.ms = this.initialMs;
        }
        this.ms = this.ms - step;
        return this.ms <= 0;
    }
}

//auto resets
function repeat(times){
    var timesLeft = times;
    return function(){
        if(timesLeft < 0){
            timesLeft = times;
        }
        timesLeft--;
        return timesLeft > 0;
    }
}

class Block extends Action{
    constructor(name = "Block", actions, repeat, desc = "Default Description"){
        super(name, actions);
        this.repeat = repeat;
        this.desc = desc;

        this.run.bind(this);
    }
    
    run(){
        console.log('unpacking block to full extent');
        var reps = 1;
        while(this.repeat()){
            reps++;
            this.actualAction = this.actualAction.concat(this.actualAction);
        }
        console.log('block repeated times: '+ reps);
        return this.actualAction; //kindof a flatmap with depth of 1
    }
}

function actionProvider(actionPickingBehavior, actions){
    var _actionPickingBehavior = actionPickingBehavior;
    var _actions = actions;
    return function(){
        return _actions[_actionPickingBehavior(_actions.length)];
    }
}

class FlowSplitter extends Action{
    constructor(name = "Flow Splitter", actionProvider){
        super(name, function(){});
        this.actionProvider = actionProvider;

        this.run.bind(this);
    }

    get name(){
        return this.name + " -> " + actionProvider.name;  
    }

    run(){
        this.actionProvider().run();
    }
}

class Workout{
    constructor(name, desc, block, repeat){
        this.name = name;
        this.desc = desc;
        this.actualBlock = block;
        this.repeat = repeat;
    }

    set block(newBlock){
        this.actualBlock = newBlock;
    }

    get block(){
        console.log("workout.block requested, creating 2 nested blocks");
        return new Block(this.actualBlock.name, this.actualBlock.run(), this.repeat);
    }
}

function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function flipFlopActionPickBehavior(n){
    var length = n;
    var first = false;
    return function(){
        first = !first;
        return first ? 0 : 1;
    }
}

function randomActionPickBehavior(n){
    var length = n;
    return function(){
        return getRandomInt(0,n);
    }
}

function progressiveActionPickBehavior(n){
    var length = n;
    var index = -1;
    return function(){
        index = (index + 1) % n;
        return index;
    }
}

function waitSeconds(seconds){
    return new SleepAction(seconds * 1000);
}

function playSound(sound){
    return function(){
        document.getElementById(sound).play();
    }
}

function textToSpeech(text){
    return function (){
        var msg = new SpeechSynthesisUtterance(text);
        msg.volume = 1;
        window.speechSynthesis.speak(msg);
    }
}

var availableActions = {
    'play-sound': playSound,
    'wait': waitSeconds,
    'text-to-speech': textToSpeech
};

// PLAYER
var workoutQueue = [];
var playQueue = [];

var playQueueEmptyPrev = true;

var workoutEndNotify = [];

var paused = false;

function mainLoop(){
    if(paused){ 
        return;
     }

     //workout
     if(playQueue.length === 0){
         if(playQueueEmptyPrev === false){
            console.log('workout ended');
            workoutEndNotify.forEach(function(entry){ entry(); });
            playQueueEmptyPrev === true;
         }

         if(workoutQueue.length > 0){
             var workout = workoutQueue.shift();
             playQueue.unshift(workout.block);
             playQueueEmptyPrev === false;
         }    
     }
     playQueueEmptyPrev = (playQueue.length === 0);

     //playQueue
    if(playQueue.length > 0){
        var entry = playQueue.shift();
        var candidate = entry.run();
        if(typeof(candidate) === 'boolean'){
            //console.log('candidate is sleep action');
            if(!candidate){//should be a sleep action
                playQueue.unshift(entry);
            }
        }else if(candidate && candidate.constructor === Array){
            console.log('candidate is block');
            candidate.reverse().forEach(function(entry) {
                playQueue.unshift(entry);
            });
        }
    }//else keep waitin
}

setInterval(mainLoop, step);

// BUILDERS
