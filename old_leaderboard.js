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
  var database = firebase.database();


async function getItem(){
    const result = await axios({
        method:'get',
        url: 'https://fall2020-comp426.firebaseio.com/users.json'
    });
    return result;
}

const promise = getItem()

promise.then((item)=>{
    const user = item.data
    const test2 = Object.entries(user)
    
    /*console.log(test2)
    for( const each in test2){
        console.log(test2[each][0])
        console.log(test2[each][1].score)
        $('#scores').append(`<h1>${test2[each][0]} ${test2[each][1].score}</h1>`)

    }*/
    
    //document.getElementById("demo").innerHTML = user["test1"].score;
})


  function writeUserData(userID, score) {
    firebase.database().ref('users/' + userID).set({
        displayID: userID,
        score: score,
    });
  }

  var test = firebase.database().ref('users').orderByChild('score').limitToLast(2)
  //test.on('value', snap => console.log(snap.val()));

  test.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val().score;
        $('#scores').append(`<h1>${childKey} ${childData}</h1>`)
        // ...
    });
    
});


  