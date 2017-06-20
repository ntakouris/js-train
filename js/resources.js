var availableSounds = ['beep'];

// PRESETS
var waitPreset = new Block("Wait 1 second", [new SleepAction(1000)] , repeat(1));
var beepPreset = new Block("Beep", [new SleepAction(1000), beepAction], repeat(1));

var beepAction = new Action("Beep" , playSound("beep"));
var boxingBagPreset = new Block("Boxing Bag 15-15-15-15", [     new SleepAction(2000),
                                                                        beepAction, 
                                                                        new SleepAction(2000),
                                                                        new Action("FOOTWORK", textToSpeech("FOOTWORK")),
                                                                        new SleepAction(15000),
                                                                        new Action("TECHNIQUE", textToSpeech("TECHNIQUE")),
                                                                        new SleepAction(15000),
                                                                        new Action("SPEED", textToSpeech("SPEED")),
                                                                        new SleepAction(15000),
                                                                        new Action("POWER", textToSpeech("POWER")),
                                                                        new SleepAction(15000),
                                                                        new Action("REST", textToSpeech("REST"))
                                                                  ] , repeat(1), "Boxing: 15 FOOTWORK - 15 TECHNIQUE - 15 SPEED - 15 POWER - 15 REST");

var boxingBagDSL = 
`#Boxing Bag 15-15-15-15 with DSL parsing
#Boxing: 15 FOOTWORK - 15 TECHNIQUE - 15 SPEED - 15 POWER - 15 REST
sleep 2
beep
sleep 2
say FOOTWORK
sleep 15
say TECHNIQUE
sleep 15
say SPEED
sleep 15
say POWER
sleep 15
say REST
sleep 15`;
//var boxingBag2 = trainDSLParser(boxingBagDSL);

var boxingBagBuilder = 
      new PresetBuilder("Boxing Bag 15-15-15-15 with the PresetBuilder", "Boxing: 15 FOOTWORK - 15 TECHNIQUE - 15 SPEED - 15 POWER - 15 REST", repeat(1))
      .sleep(2).beep()
      .sleep(2).say("FOOTWORK")
      .sleep(15).say("TECHNIQUE")
      .sleep(15).say("SPEED")
      .sleep(15).say("POWER")
      .sleep(15).say("REST")
      .sleep(15)
      .build();

var availableWorkouts = [waitPreset, beepPreset, boxingBagPreset];

function searchWorkoutsByKeywords(keywords){
      var keys = keywords.split(",").map(s => s.trim());
      return availableWorkouts.filter(function(entry){
                  return keys.filter(function(keyword){
                        keyword.toLowerCase().indexOf(entry.name.toLowerCase()) !== -1;
                  }).length > 0;
            }).sort(function(a, b){
                  function getScore(){
                        var score = 0;
                        keys.foreEach(function(keyword){
                              if(keyword.toLowerCase().indexOf(entry.name.toLowerCase()) !== -1){
                                    score++;
                              }
                        });
                        return score;
                  }
                  return getScore(a) - getScore(b);
            });
}