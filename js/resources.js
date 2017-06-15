var availableSounds = ['beep']

// PRESETS

var beepAction = new Action("Beep" , playSound("beep"));
var doNothing = new Action("Nothing", function(){});

var testPreset = new Block("ABC", [new SleepAction(5000, doNothing)], repeat(1));

// var boxingBagPreset = new Block("Boxing Bag 15-15-15-15 3 Times", 
//     [beepAction, 
//     new SleepAction(2000, new Action("FOOTWORK", textToSpeech("FOOTWORK"))),
//     new SleepAction(10000, new Action("TECHNIQUE", textToSpeech("TECHNIQUE"))),
//     new SleepAction(10000, new Action("SPEED", textToSpeech("SPEED"))),
//     new SleepAction(10000, new Action("POWER", textToSpeech("POWER"))),
//     new SleepAction(10000, new Action("REST", textToSpeech("REST"))),
//     new SleepAction(10000, doNothing)], 
//     repeat(3));

// var boxingBagPreset = new Block("Boxing Bag 15-15-15-15 3 Times", 
//         [beepAction, 
//         new SleepAction(2000, new Block("Tiny Pause", [
//             new Action("FOOTWORK", textToSpeech("FOOTWORK")),
//             new SleepAction(2000, new Block("Sleep 15", [
//                 new Action("SPEED", textToSpeech("SPEED")),
//                 new SleepAction(2000, new Block("Sleep 15", [
//                     new Action("POWER", textToSpeech("POWER")),
//                     new SleepAction(2000, new Block("Sleep 15", [
//                         new Action("REST", textToSpeech("REST")),
//                         new SleepAction(2000, new Block("Sleep 15", [doNothing], repeat(1)))
//                     ], repeat(1)))
//                 ], repeat(1)))
//             ] , repeat(1)))
//         ], repeat(1)))],
//     repeat(3));