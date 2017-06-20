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

class SleepOffsetAction extends Action{
    constructor(ms, offset){
        super("Sleep: " + ms + " - Offset: " + offset);
        this.ms = ms;
        this.offset = offset;
        this.currentOffset = getRandomInt(-offset, offset);
        this.initialMs = ms;
    }

    run(){
        //console.log("Sleep action step");
        if(this.ms <= this.currentOffset){
            this.ms = this.initialMs;
            //reset => recalculate new margin
            this.currentOffset = getRandomInt(-offset, offset);
        }
        this.ms = this.ms - step;
        return this.ms <= this.currentOffset;
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

function waitSecondsOffset(seconds, offset){
    return new SleepOffsetAction(seconds * 1000, offset * 1000);
}

function playSound(sound){
    return function(){
        document.getElementById(sound).play();
    }
}

function playBeepAction(){
    return new Action("beep", playSound("beep"));
}

function textToSpeech(text){
    return function (){
        var msg = new SpeechSynthesisUtterance(text);
        msg.volume = 1;
        window.speechSynthesis.speak(msg);
    }
}

function textToSpeechAction(text){
    var actualAction = textToSpeech(text);
    return new Action(text, actualAction);
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

// DSL
function trainDSLParser(contents){
    const actionMap = {
        "beep" : playBeepAction,
        "say" : textToSpeechAction,
        "sleep" : waitSeconds,
        "sleepOffset" : waitSecondsOffset
    }

    var lines = contents.split("\n").map(s => s.trim());
    console.log(lines);
    var blockIndex = 0;

    var contents = {
        0 : []
    };
    var title;
    var description;
    lines.forEach(function(line){
        if(line.trim() === ""){

        }else if(line.startsWith("#")){//comment. First comment = title
            if(title === undefined){
                title = line.slice(1);
            }else if(description === undefined){
                description = line.slice(1);
            }
        }else if(line.startsWith("{") || line.startsWith("}")){//start block parsing
            if(line.startsWith("{")){//block start
                blockIndex++;
                contents[blockIndex] = [];
            }else if(line.startsWith("}")){//block end
                var reps = 1;
                if(line.length > 1){
                    reps = line.slice(1);
                }

                var block = new Block("Block" , contents[blockIndex], repeat(reps));
                blockIndex--;
                contents[blockIndex].push(block);
            }
        }else{
            var parts = line.split(" ");

            if(parts[0] === "beep"){
                contents[blockIndex].push(actionMap[parts[0]]());
            }else{
                var parts = line.split(" ");
                var parsed;
                if(parts[0].startsWith("say")){
                    var params = parts.slice(1).reduce( (prev, cur) => prev + " " + cur, "");
                    parsed = actionMap[parts[0]].apply(null, [params]);
                }else{
                    parsed = actionMap[parts[0]].apply(null, parts.slice(1));
                }
                contents[blockIndex].push(parsed);
            }
        }
    });

    //push everything from index 0 (root block) to new block in order to preserve repetitions;
    var result = new Block(title === undefined ? "Unnamed Block" : title, contents[0], repeat(1), description === undefined ? "No Description" : description);
    console.log(result);
    return result;
}