const step = 100;

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
    }

    run(){
        this.ms = this.ms - step;
        return this.ms <= 0;
    }
}

function repeat(times){
    var timesLeft = times;
    return function(){
        timesLeft--;
        return timesLeft > 0;
    }
}

class Block extends Action{
    constructor(name = "Block", actions, repeat){
        super(name, actualAction);
        this.repeat = repeat;
    }
    
    run(){
        while(repeat()){
            this.actions.concat(this.actions);
        }

        return this.actions; //kindof a flatmap
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
        super(name);
        this.actionProvider = actionProvider;
    }

    get name(){
        return this.name + " -> " + actionProvider.name;  
    }

    run(){
        this.actionProvider().run();
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
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
}

var availableActions = {
    'play-sound': playSound,
    'wait': waitSeconds,
    'text-to-speech': textToSpeech
};

//PLAYER
var playQueue = [];
var paused = false;
function mainLoop(){
    if(paused){ return; }

    if(playQueue.length > 0){
        var candidate = playQueue.shift();
        if(typeof(candidate) === 'boolean'){
            if(!candidate.run()){//should be a sleep action
                playQueue.unshift(candidate);
            }
        }else if(candidate.constructor === Array){
            candidate.forEach(function(entry) {
                playQueue.shift(entry);
            });
        }else{
            candidate.run();
        }
    }//else keep waitin
}

setInterval(mainLoop, step);


// BUILDERS

