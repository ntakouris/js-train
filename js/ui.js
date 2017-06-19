var queueTable = document.getElementById('queue-table').getElementsByTagName('tbody')[0];
var workoutBox = document.getElementById('workout-box');
var queueActions = document.getElementById('queue-actions');
var searchTextBox = document.getElementById('workout-keywords');
var clearKeywordsButton = document.getElementById('clear-keywords');

const removeGlyphHTML = '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"> </span>';
const playGlyphHTML = '<span class="glyphicon glyphicon-play" aria-hidden="true"> </span>';

queueActions.appendChild(startStopButton());
queueActions.appendChild(clearQueueButton());

searchTextBox.addEventListener("input", function (e) {
    searchInputChange(this.value);
});

clearKeywordsButton.onclick = function(){
    searchTextBox.value = "";
    showPopularWorkouts();
}

function searchInputChange(input){
    if(!input || /^\s*$/.test(input) || input.length === 0 || !input.trim()){//is blank?
        showPopularWorkouts();
    }else{
        var matchingWorkouts = searchWorkoutsByKeywords(input);
        workoutBox.innerHTML = "";
        matchingWorkouts.forEach(function(entry){
            var button = buttonFromWorkout(entry);
            workoutBox.appendChild(button);
        });
    }
}

showPopularWorkouts();
showEmptyWorkoutTable();

function showEmptyWorkoutTable(){
    queueTable.innerHTML = "";

   [0,1,2,3,4].forEach(function(n){
        var row = queueTable.insertRow(n);
        var indexCell = row.insertCell(0);
        var nameCell = row.insertCell(1);
        row.insertCell(2);
    });
    checkAutoStop();
    autosetQueueTableIndices();
}

//will probably never use it
function workoutSelectHintDiv(){
    var div = document.createElement('div');
    div.role = "alert";
    div.classList.add("col-xs-6", "alert", "alert-info");
    div.innerHTML = "Please choose a workout to get started";
    return div;
}

function clearQueueButton(){
    var button = document.createElement('button');
    button.classList.add('btn', 'btn-danger', 'pull-right');
    button.innerHTML = "Clear Queue";
    button.onclick = clearQueuePressed;
    return button;
}

function clearQueuePressed(){
    swal({
        title: "Are you sure you want to clear the queue?",
        text: "This will stop the flow and remove all the workouts from it.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Clear Queue",
        closeOnConfirm: true
    },
    function(){//success callback
        //must reset repeats and timers on current playQueue action if its a timer or a repeat
        if(playQueue.length > 0){
            var entry = playQueue.shift();
            var candidate = entry.run();
            if(typeof(candidate) === 'boolean'){
                if(!candidate){//should be a sleep action
                    while(!entry.run()){}
                }
            }//block unpacks itself and resets repeat()
        }

        playQueue = [];
        workoutQueue = [];

        showEmptyWorkoutTable();
        checkAutoStop();

        return true;
    });
}

function startStopButton(){
    var div = document.createElement('div');
    div.classList.add("col-xs-4");

    var button = document.createElement('button');
    button.type = "button";    
    button.onclick = function(){ startStopPressed(button); };

    startStopPressed(button);

    div.appendChild(button);   
    return div;
}

function startStopPressed(button){

    if(paused){
        if(!(workoutQueue.length > 0 || playQueue.length > 0)){
            swal("You need to add workouts to the queue first in order to play them!");
        }
    }

    paused = !paused;

    button.innerHTML = "";

    if(paused){
        button.classList = "btn btn-success";
        var span = document.createElement('span');
        span.classList.add("glyphicon", "glyphicon-play");
        span.setAttribute("aria-hidden", "true");

        button.appendChild(span);
        button.innerHTML += " PLAY";
    }else{
        button.className = "btn btn-danger"
        var span = document.createElement('span');
        span.classList.add("glyphicon", "glyphicon-stop");
        span.setAttribute("aria-hidden", "true");

        button.appendChild(span);
        button.innerHTML += " PAUSE";
    }
}

function showPopularWorkouts(){
    workoutBox.innerHTML = "";
    availableWorkouts.slice(0,20).forEach(function(entry) {
        workoutBox.appendChild(buttonFromWorkout(entry));
    });
}

function buttonFromWorkout(block){
    var button = document.createElement("button"); 
    button.type = "button";
    button.classList.add("list-group-item");
    button.innerHTML = block.name;
    button.onclick = function(){workoutPickConfirmationAlert(block)};
    return button;
}

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

function workoutPickConfirmationAlert(block){
    swal({
    title: block.name,
    text: block.desc,
    type: "input",
    showCancelButton: true,
    closeOnConfirm: true,
    animation: "slide-from-top",
    inputPlaceholder: "How much times do you want to play the workout?",
    confirmButtonText: "Add to Queue",
    cancelButtonText: "Cancel",
    },
        function(inputValue){        
            if (!isInt(inputValue)) {
                swal.showInputError("You need to write a number!");
                return false;
            }else{
                var times = parseInt(Number(inputValue));
                var workout = new Workout(block.name, block.desc, block, repeat(times));
                workoutQueue.push(workout);

                var validRow = null;
                var validRowIndex = -1;
                for (var i = 0, row; row = queueTable.rows[i]; i++) {
                    if(row.cells[1].innerHTML === ""){
                        validRow = row;
                        validRowIndex = i;
                        break;
                    }
                }

                if(validRow == null){
                    validRow = queueTable.insertRow(queueTable.childElementCount);
                    validRowIndex = queueTable.childElementCount;

                    var indexCell = validRow.insertCell(0);
                    
                    validRow.insertCell(1);
                    validRow.insertCell(2);
                }

                validRow.cells[1].innerHTML = workout.name + ' (x' + inputValue + ')';

                var actionsCell = validRow.cells[2];
                if(validRowIndex === 0){
                    actionsCell.appendChild(playGlyph());
                }

                //add cancel action
                var cancelButton = document.createElement('button');
                cancelButton.classList.add('btn', 'btn-danger');

                var span = document.createElement('span');
                span.classList.add('glyphicon', 'glyphicon-remove-sign');
                span.setAttribute('aria-hidden', true);

                cancelButton.appendChild(span);

                cancelButton.onclick = function(){
                    paused = true;
                    swal({
                        title: "Are you sure you want to remove this workout?",
                        text: '"' + workout.name + '" is going to be removed from the queue.',
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Remove Workout",
                        closeOnConfirm: true
                        },
                        function(){
                            cancelWorkoutOnQueuePressed(workout.name, inputValue, validRowIndex);
                            paused = false;
                        });
                };

                actionsCell.appendChild(cancelButton);
                autosetQueueTableIndices();
                return true;
            }
        }
    );
}

function cancelWorkoutOnQueuePressed(name, repeats, greatestPossibleIndex){
    var workoutIndex = -1;
    for (var i = 0, row; row = queueTable.rows[i]; i++) {
        if(i > greatestPossibleIndex){ break; }
        if(row.cells[1].innerHTML === (name + ' (x' + repeats + ')')){
            workoutIndex = i;
        }
    }
    if(workoutIndex === 0){//if at top of table / currently playing
        queueTable.firstElementChild.remove();
        playQueue = [];
        shiftPlayButtonToNewFirstRow();
    }else if(workoutIndex > 0){//scheduled to play
        queueTable.deleteRow(workoutIndex);
        var targetWorkoutQueueIndex = workoutIndex - 1;
        workoutQueue.splice(targetWorkoutQueueIndex, 1);
    }

    appendEmptyLinesToQueueTable();
    autosetQueueTableIndices();
}

function playGlyph(){
    var span = document.createElement('span');
    span.classList.add('glyphicon', 'glyphicon-play');
    span.setAttribute('aria-hidden', 'true');
    return span;
}

workoutEndNotify.push(function(){
        queueTable.firstElementChild.remove();
        shiftPlayButtonToNewFirstRow();
        autosetQueueTableIndices();
});

function shiftPlayButtonToNewFirstRow(){
    if(playQueue.length > 0){
        //shift play button to the below table row
        var lastCell = queueTable.firstElementChild.lastElementChild;
        var curHTML = lastCell.innerHTML;
        lastCell.innerHTML = "";
        lastCell.appendChild(playGlyph());
        lastCell.innerHTML += " " + curHTML;
    }
}

function autosetQueueTableIndices(){
    for (var i = 0, row; row = queueTable.rows[i]; i++) {
         row.cells[0] = i + 1;
    }
}

function appendEmptyLinesToQueueTable(){
    while(queueTable.childElementCount < 5){//append an empty line
        var row = queueTable.insertRow(queueTable.childElementCount);
        var indexCell = row.insertCell(0);
        row.insertCell(1);
        row.insertCell(2);
    }
}

function checkAutoStop(){
    if(playQueue.length === 0 && workoutQueue.length === 0){
        if(!paused){
            startStopPressed(queueActions.firstElementChild);
        }
    }
}

