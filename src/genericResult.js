import { COLLOG } from "./Data/begCluesTemplate.js";
import { ROLLS } from "./Data/begCluesTemplate.js";
import { DROPCHANCE } from "./Data/begCluesTemplate.js";

//If we can import colLog, we can use one JS for all simple calculations. 


//Reset 
var filledColLog = [];
var kc = 0;
var greenLog = [];
var unluckCount = 0;
var luckCount = 99999;

//rest of variables i guess
var interval;

//Simulates one KC
function Simulate(){

    if(filledColLog.length == COLLOG.length){
        endSim();
    }

    kc = kc + 1;

    for(var i = 0; i <= ROLLS; i++){
        Roll();
    }
}

function endSim(){
    displayColLog();
    resetSim();
}

//resetSim resets all variables and logs
//the KC needed for a green log, along with
//the luckiest/unluckiest simulation to green log.
function resetSim(){

    if(kc > 0){
        greenLog.push(kc);
        if(kc >= unluckCount){
            unluckCount = kc;
        }

        if(kc <= luckCount){
            luckCount = kc;
        }
    }

    kc = 0;
    filledColLog = [];
    interval = clearInterval(interval); //just incase.
}

//Rolls and checks to see if we hit the desired loot table.
function Roll(){
    var rareDrop = getRandomInt(DROPCHANCE);
    if(rareDrop == DROPCHANCE -1){ //we hit the table
        RollRareTable();
    }
}

//CheckLog checks the item recieved and marks the collection log
//if it is new.
function CheckLog(item){
    if(!filledColLog.includes(item)){
        console.log(item + " get!");
        item = item + ".png"
        filledColLog.push(item);
    }
    else{//dupe
        console.log("dupe");
        //dupe logic?
    }
}

//RollRareTable rolls on the rare table, and gives us an item.
function RollRareTable(){
    var rareItem = getRandomInt(COLLOG.length); 0-14
    var item = COLLOG[rareItem];
    CheckLog(item);
}

//RNG
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getAverage(){

    var average = 0;

    //add each green logs KC together
    for (var i = 0; i < greenLog.length; i++){
        average = average + greenLog[i];
    }
    //divide by # of green logs total
    average = average / greenLog.length;
}

//StartLoop generates KC every x amount of time.
//X being the variable in setInterval in MS. (1000 = 1 second)
function startLoop() {
    Simulate();
    interval = setInterval(Simulate, 1000);
  }
  
  //StopLoop kills the startLoop interval
  function stopLoop(){
    interval = clearInterval(interval);
    endSim();
  }

function displayColLog(){
    for (var i of filledColLog){
        var imageName = "../images/icons/" + i;
        console.log(imageName); //testing
       // $('#colLogDisplay').prepend('<img src='"imageName"'/>');
        $("#colLogDisplay img:nth-child("i")").attr('src',imageName));
    }
}

//Generates Data for x amount of green logs
$('#GenData').click(function() {
    while(greenLog.length != 10){ //simulates 100 green logs
        Simulate();
    }

    //Print Results (needs overhaul)
    getAverage();
    console.log("Made from " + greenLog.length + " Simulations");
    console.log("Average Clues for completion: " + average);
    console.log("Unluckiest player took: " + unluckCount + " to complete green log.");
    console.log("Luckiest player took: " + luckCount + " to complete green log.");
});

//Loot from 1 kc
$('#SimButton').click(function() {
    StartSim();
});

//Simulates KC until stopped
$('#AutoSimButton').on('click', function(e){
    if (!interval) {
        startLoop();
    }
});

//End KC simulation.
$("#EndAutoSimButton").click(stopLoop);
