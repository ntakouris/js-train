const step = 1000;

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
        console.log("Sleeping step");
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
        super(name, actions);
        this.repeat = repeat;
    }
    
    run(){
        console.log("Flattenning with repeat");
        while(this.repeat()){
            this.actualAction = this.actualAction.concat(this.actualAction);
        }
        console.log("Returning bill of actions");
        //console.log(this.actualAction);
        return this.actualAction; //kindof a flatmap
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

// PLAYER
var playQueue = [];
var paused = false;

function mainLoop(){
    console.log("Step");
    if(paused){ 
        console.log("Currently paused");
        return;
     }

    if(playQueue.length > 0){
        console.log("Picking first entry");
        var entry = playQueue.shift();
        console.log("Running entry to pick candidate : " + typeof(entry));
        var candidate = entry.run();
        if(typeof(candidate) === 'boolean'){
            console.log("Candidate is a sleepaction");
            if(!candidate){//should be a sleep action
                playQueue.unshift(entry);
                console.log("Sleep action not yet complete");
            }
        }else if(candidate && candidate.constructor === Array){
            console.log("Candidate is a block, unpacking actions...");
            candidate.reverse().forEach(function(entry) {
                playQueue.unshift(entry);
            });
        }else{
            console.log("Candidate is just an Action!");
        }
    }//else keep waitin
}

setInterval(mainLoop, step);


// BUILDERS

