var queueTable = document.getElementById('queue-table').getElementsByTagName('tbody')[0];
var workoutBox = document.getElementById('workout-box');
var queueActions = document.getElementById('queue-actions');

const removeGlyphHTML = '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"> </span>';
const playGlyphHTML = '<span class="glyphicon glyphicon-play" aria-hidden="true"> </span>';

var uiQueue = [];

queueActions.appendChild(startStopButton());

function workoutSelectHintDiv(){
    var div = document.createElement('div');
    div.role = "alert";
    div.classList.add("col-xs-6", "alert", "alert-info");
    div.innerHTML = "Please choose a workout to get started";
    return div;
}

function startStopButton(){
    var div = document.createElement('div');
    div.classList.add("col-xs-4");

    var button = document.createElement('button');
    button.type = "button";
    button.classList.add("btn", "btn-danger");
    button.onclick = startStopPressed;

    var span = document.createElement('span');
    span.classList.add("glyphicon", "glyphicon-stop");
    span.setAttribute("aria-hidden", "true");

    button.appendChild(span);
    button.innerHTML += " STOP";
    div.appendChild(button);
    return div;
}

function startStopPressed(){

}

//var newRow = tableRef.insertRow(tableRef.rows.length);

function showPopularWorkouts(){
    availableWorkouts.slice(0,5).forEach(function(entry) {
        workoutBox.appendChild(buttonFromWorkout(entry));
    });
}

showPopularWorkouts();

function buttonFromWorkout(workout){
    var button = document.createElement("button"); 
    button.type = "button";
    button.classList.add("list-group-item");
    button.innerHTML = workout.name;
    button.onclick = function(){workoutPickConfirmationAlert(workout)};
    //show tooltip with workout.desc
    return button;
}

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

function workoutPickConfirmationAlert(workout){
    swal({
    title: workout.name,
    text: workout.desc,
    type: "input",
    showCancelButton: true,
    closeOnConfirm: true,
    animation: "slide-from-top",
    inputPlaceholder: "How much times do you want to play the workout?",
    confirmButtonText: "Add to Queue",
    cancelButtonText: "Cancel"
    },
        function(inputValue){        
            if (!isInt(inputValue)) {
                swal.showInputError("You need to write a number!");
                return false;
            }else{
                var times = parseInt(Number(inputValue));
                //add to queue
                return true;
            }
        }
    );
}

