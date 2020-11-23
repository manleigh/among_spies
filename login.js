
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

const txtEmail = document.getElementById('username')
const txtPassword = document.getElementById('password')
const btnLogin = document.getElementById('btnLogin')
const btnSignUp = document.getElementById('btnSign')

btnLogin.addEventListener('click', e => {
  const email = txtEmail.value;
  const pass = txtPassword.value;
  
  const promise = firebase.auth().signInWithEmailAndPassword(email, pass)
  promise.catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage)
  })

});

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


