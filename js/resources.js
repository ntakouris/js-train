var availableSounds = ['beep']

// PRESETS

var beepAction = new Action("Beep" , playSound("beep"));
var boxingBagPreset = new Block("Boxing Bag 15-15-15-15", [     new SleepAction(2000),
                                                                        beepAction, 
                                                                        new SleepAction(2000),
                                                                        new Action("FOOTWORK", textToSpeech("FOOTWORK")),
                                                                        new SleepAction(2000),
                                                                        new Action("TECHNIQUE", textToSpeech("TECHNIQUE")),
                                                                        new SleepAction(2000),
                                                                        new Action("SPEED", textToSpeech("SPEED")),
                                                                        new SleepAction(2000),
                                                                        new Action("POWER", textToSpeech("POWER")),
                                                                        new SleepAction(2000),
                                                                        new Action("REST", textToSpeech("REST"))
                                                                  ] ,repeat(1), "15 FOOTWORK - 15 TECHNIQUE - 15 SPEED - 15 POWER - 15 REST");

var waitPreset = new Block("Wait 1 second", [new SleepAction(1000)] , repeat(1));

var availableWorkouts = [waitPreset, boxingBagPreset];                     