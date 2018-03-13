
$(document).ready(function () {
	// Initialize Firebase
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyBlLJbAiFU9pe29makm8hgrpMv0p6iLqGY",
		authDomain: "traintimetable-20843.firebaseapp.com",
		databaseURL: "https://traintimetable-20843.firebaseio.com",
		projectId: "traintimetable-20843",
		storageBucket: "",
		messagingSenderId: "868508804811"
	};
	firebase.initializeApp(config);

	var database = firebase.database()
	var name = "";
	var dest = "";
	var startTime = "";
	var trainRate = 0;





	$("#add-train-btn").on("click", function (event) {
		event.preventDefault();

		// Grabbed values from text boxes
		name = $("#train-name-input").val().trim();
		dest = $("#dest-input").val().trim();
		startTime = $("#start-input").val().trim();
		trainRate = $("#rate-input").val().trim();



		// Code for handling the push
		database.ref().push({
			name: name,
			dest: dest,
			startTime: startTime,
			freq: trainRate,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});

	});

	database.ref().on("child_added", function (childSnapshot) {
		console.log(childSnapshot.val().name);
		console.log(childSnapshot.val().dest);
		console.log(childSnapshot.val().startTime);
		console.log(childSnapshot.val().freq);
		// First Time (pushed back 1 year to make sure it comes before current time)
		var firstTimeConverted = moment(childSnapshot.val().startTime, "HH:mm").subtract(1, "years");
		console.log(firstTimeConverted);
		console.log(childSnapshot.val().startTime);


		// Current Time
		var currentTime = moment();
		console.log("CURRENT TIME: " + moment(currentTime).format("HH:MM"));

		// Difference between the times
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		console.log("DIFFERENCE IN TIME: " + diffTime);

		// Time apart (remainder)
		var tRemainder = diffTime % parseInt(trainRate);
		console.log("remaining" + tRemainder);

		// Minute Until Train
		var tMinutesTillTrain = parseInt(trainRate) - parseInt(tRemainder);
		console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
		// Next Train
		var arrivStringTrain = moment().add(tMinutesTillTrain, "minutes");
		console.log("time till train" + arrivStringTrain);

		var nextTrain = moment(arrivStringTrain).format("hh:mm");
		console.log("nexttrain" + nextTrain);



		var trainTable = $("#train-table");
		var tableRow = $("<tr>");
		var cellArray = [childSnapshot.val().name, childSnapshot.val().dest, childSnapshot.val().freq, nextTrain, tMinutesTillTrain];
		console.log(cellArray);

		for (var i = 0; i < cellArray.length; i++) {
			var tableCell = $("<td>");
			tableCell.append(cellArray[i]);
			tableRow.append(tableCell)
			trainTable.append(tableRow)





		};
	});
});