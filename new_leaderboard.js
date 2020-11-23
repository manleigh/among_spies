var firebaseConfig = {
    apiKey: "AIzaSyDSiFrtvLf6M72bgEKU1Juei54GDZyB_EE",
    authDomain: "fall2020-comp426.firebaseapp.com",
    databaseURL: "https://fall2020-comp426.firebaseio.com",
    projectId: "fall2020-comp426",
    storageBucket: "fall2020-comp426.appspot.com",
    messagingSenderId: "132509825042",
    appId: "1:132509825042:web:77bbd19f047c37bfdcc0cb",
    measurementId: "G-S2NMLWLDYR"
  };

  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();

    /*db.collection("users").doc("test2@email.com").set({
        displayID:"test2",
        score: 10
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });*/

    var docRef = db.collection("users")
    db.collection("users")
    .orderBy('score', 'desc')
    .get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            var username = doc.data().displayID
            var score = doc.data().score
            console.log(username, score);
            // let output = `<h2>${username} ${score}</h2>`
            $('#scores').append(`<h2 class="username">${username} ${score}</h2>`)
        });
    });
    

