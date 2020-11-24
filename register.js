
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
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  
  const txtUsername = document.getElementById('username')
  const txtEmail = document.getElementById('email')
  const txtPassword = document.getElementById('password')
  const btnLogin = document.getElementById('btnLogin')
  const btnSignUp = document.getElementById('btnSign')
  
  
  btnSignUp.addEventListener('click', e => {
    
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const displayname = txtUsername.value;
   
    if(displayname){
      db.collection("users").where("displayID", "==", displayname)
      .get()
      .then(function(querySnapshot) {
          var check = []
          querySnapshot.forEach(function(doc) {
            check.push(doc.data().displayID)
          });
          if(check.length === 1){
            $("#notify").html('<p>Username is taken. Try a different one.</p>')
          } else{
            const promise = firebase.auth().createUserWithEmailAndPassword(email, pass)
            promise
            .then(function(result){
              result.user.updateProfile({
                displayName: displayname
              })
              db.collection("users").doc(email).set({
                displayID: displayname,
                score: 0
            })

              $("#notify").html('<p>Successfully Registered! You are now logged in.</p>')
              window.location.href = "gamepage.html"
              
            })
            .catch(() => {

              $("#notify").html("<p>Invalid Sign-Up</p>")
      
      })
          }
          
      });
      
      } else if(displayname == false){
        $("#notify").html("<p>Username cannot be empty</p>")
      }

  


  
  });
  
  firebase.auth().onAuthStateChanged(firebaseUser =>{
    if(firebaseUser){
      setupUI(firebaseUser)
    } else{
      
      setupUI()
    }
  })

  const btnSignout = document.getElementById('signOut')

  btnSignout.addEventListener('click', e =>{
    e.preventDefault();
    firebase.auth().signOut().then(() => {
      window.location.href = "index.html"
    })
  });


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
  
  
  
  