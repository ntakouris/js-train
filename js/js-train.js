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

function repeat(times){
    var timesLeft = times;
    return function(){
        timesLeft--;
        return timesLeft > 0;
    }
}

class SleepAction extends Action{
    constructor(ms, nextAction){
        super("Sleep " + ms);
        this.ms = ms;
        this.nextAction = nextAction;
    }

    run(){
        setTimeout(this.nextAction.run(), this.ms);
    }
}

class Block extends Action{
    constructor(name = "Block", actions, repeat){
        super(name);
        this.repeat = repeat;
        this.instructions = actions;
    }
    
    run(){
        this.instructions.forEach(function(action) {
            action.run();
        });

        if(this.repeat()){
            this.run();
        }
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
    return new SleepAction(seconds * 1000, new Action("Do nothing", function (){}));
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
