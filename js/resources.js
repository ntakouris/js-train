import * as train from 'train';

var availableSounds = ['beep']

// PRESETS

var beepAction = new train.Action("Beep" , train.playSound("beep"));
var boxingBagPreset = new train.Block("Boxing Bag 15-15-15-15", [     new train.SleepAction(2000),
                                                                        beepAction, 
                                                                        new train.SleepAction(2000),
                                                                        new train.Action("FOOTWORK", train.textToSpeech("FOOTWORK")),
                                                                        new train.SleepAction(2000),
                                                                        new train.Action("TECHNIQUE", train.textToSpeech("TECHNIQUE")),
                                                                        new train.SleepAction(2000),
                                                                        new train.Action("SPEED", train.textToSpeech("SPEED")),
                                                                        new train.SleepAction(2000),
                                                                        new train.Action("POWER", train.textToSpeech("POWER")),
                                                                        new train.SleepAction(2000),
                                                                        new train.Action("REST", train.textToSpeech("REST"))
                                                                  ] , train.repeat(1), "15 FOOTWORK - 15 TECHNIQUE - 15 SPEED - 15 POWER - 15 REST");

var waitPreset = new train.Block("Wait 1 second", [new train.SleepAction(1000)] , train.repeat(1));

var availableWorkouts = [waitPreset, boxingBagPreset];                     