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

    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
          console.log(firebaseUser);
          setupUI(firebaseUser);
        } else{
          console.log('not logged in');
          setupUI();
        }
      })
    
    const loggedOutLinks = document.querySelectorAll('.logged-out')
    const loggedInLinks = document.querySelectorAll('.logged-in')
    
    const setupUI = (user) => {
      if (user){
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
      } else {
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
      }
    }
    
    const btnSignout = document.getElementById('signOut')
    
      btnSignout.addEventListener('click', e =>{
        e.preventDefault();
        firebase.auth().signOut().then(() => {
          console.log('user has signed out')
        }).catch((error) =>{
          var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        })
      });

    var docRef = db.collection("users")
    db.collection("users")
    .where('score', '>', 0)
    .orderBy('score', 'desc')
    .limit(10)
    .get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            var username = doc.data().displayID
            var score = doc.data().score
            //console.log(username, score);
            // let output = `<h2>${username} ${score}</h2>`
            $('#scores').append(`<tr class="username"><td>${username}</td> <td>${score}</td></tr>`)
        });
    });
    

    