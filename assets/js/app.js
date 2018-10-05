
$(document).ready(function(){
    // firebase config
    var config = {
        apiKey: "AIzaSyBigmeBk7koqYjAv8r3XrDOsdXvtSj-Dsk",
        authDomain: "traintimes-5f558.firebaseapp.com",
        databaseURL: "https://traintimes-5f558.firebaseio.com",
        projectId: "traintimes-5f558",
        storageBucket: "",
        messagingSenderId: "935720504233"
      };
      firebase.initializeApp(config);
      database = firebase.database()

    // dropdown click event
    $("#toggleForm").on("click", function(event){
        $("#trainForm").slideToggle(200)
        document.getElementById("trainForm").reset()
    })

    // form submit click event
    $("#trainForm").submit(function(event){
        event.preventDefault()
        $("#trainForm").slideToggle(200)

        var name = $("#name").val().trim(),
            destination = $("#destination").val().trim(),
            firstTrainTime = $("#firstTrainTime").val().trim(),
            frequency = parseInt($("#frequencyMins").val().trim()) + (parseInt($("#frequencyHours").val().trim()) * 60)
        console.log(name + " " + destination + " " + firstTrainTime + " " + frequency)

        // resets the form fields
        document.getElementById("trainForm").reset()
        
        // adds stuff to firebase
        database.ref().push({
            name: name,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    })

    $("body").on("click", ".train", function(){
        $(this).children().slideToggle(200)
    })
    
// Populates #allTheTrains with train info dropdowns from database
    database.ref().on("child_added", function(childSnapshot) {
        var name = childSnapshot.val().name,
            destination = childSnapshot.val().destination,
            firstTrainTime = moment(childSnapshot.val().firstTrainTime, "HH:mm"),
            frequency = childSnapshot.val().frequency,
            firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years"),
            diffTime = moment().diff(moment(firstTimeConverted), "minutes"),
            // Time apart (remainder)
            tRemainder = diffTime % frequency,
            // Minute Until Train
            tMinutesTillTrain = frequency - tRemainder,
            // Next Train
            nextTrain = moment().add(tMinutesTillTrain, "minutes");

            // builds dropdown
            newTrain = $("<div class='train'>" + "⬇️" + "Name: " + name + "</div>")
            newTrain.append($("<p>").text("Destination: " + destination))
            newTrain.append($("<p>").text("Frequency(mins): " + frequency))
            newTrain.append($("<p>").text("Arrival Time: " + moment(nextTrain).format("hh:mm A")))
            newTrain.append($("<p>").text("Minutes Until Next Train: " + tMinutesTillTrain))

            $("#allTheTrains").prepend(newTrain)
    })

})