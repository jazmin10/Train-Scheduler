// GLOBAL VARIABLES ==============================================
// These variables are being used in more than one function
var tdifference;
var tModulus;
var tLeft;
var tArrival;

// FUNCTIONS ==============================================
// Initialize Firebase
var config = {
	apiKey: "AIzaSyDYmAjtCzxT7HHTmYmV33J7ngZ4xl5Jbic",
    authDomain: "trainscheduler-41632.firebaseapp.com",
    databaseURL: "https://trainscheduler-41632.firebaseio.com",
    projectId: "trainscheduler-41632",
    storageBucket: "trainscheduler-41632.appspot.com",
    messagingSenderId: "824311668773"
};

firebase.initializeApp(config);

var database = firebase.database();

// Grabs new schedule and pushes to Firebase
function newSchedule(){
	// Grab values
	var trainName = $("#name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var firstTime = $("#first-input").val().trim();
	var frequency = $("#frequency-input").val().trim();

	// Push values to Firebase
	database.ref().push({
		name: trainName,
		destination: destination,
		firstTrainTime: firstTime,
		frequency: frequency
	});

	$("#name-input").val("");
	$("#destination-input").val("");
	$("#first-input").val("");
	$("#frequency-input").val("");
}

// Display Train Scheduler
function displayScheduler(child){
	var tStart = moment(child.firstTrainTime, "HH:mm");
	var tFrequency = parseInt(child.frequency);

	calculateArrival(tStart, tFrequency);

	// Append information to the table
	var tableRow = $("<tr>");

	var td1 = $("<td>");
	var td2 = $("<td>");
	var td3 = $("<td>");
	var td4 = $("<td>");
	var td5 = $("<td>");

	td1.html(child.name);
	td2.html(child.destination);
	td3.html(child.frequency);
	td4.html(tArrival);
	td5.html(tLeft);

	tableRow.append(td1);
	tableRow.append(td2);
	tableRow.append(td3);
	tableRow.append(td4);
	tableRow.append(td5);

	$("#tableBody").append(tableRow);
}

// Calculates next arrival time and minutes left
function calculateArrival(tStart, tFrequency){
	// Calculates the minutes between current time and first train time
	tDifference = moment().diff(tStart, "minutes");

	// If first train time is a future time (because tDifference is negative)...
	if (tDifference < 0) {
		// Sets arrival time to the first train time
		tArrival = moment(tStart).format("hh:mm A");
		tLeft = moment(tStart).diff(moment(), "minutes");

	}
	// Otherwise, calculate next arrival time
	else {
		// Calculating how much time has passed by since the last train
		tModulus = tDifference % tFrequency;
		// Calculating minutes left
		tLeft = tFrequency - tModulus;
		// Calculates next arrival time
		tArrival = moment().add(tLeft, "minutes").format("hh:mm A")
	}
}


// MAIN PROCESSES ==============================================
// Grab new train schedule
$("#submitButton").click(function(event){
	event.preventDefault();
	newSchedule();
});

// Will be triggered at initial load and when a new child is added
database.ref().on("child_added", function(childSnapshot){
	var child = childSnapshot.val();
	displayScheduler(child);

});


