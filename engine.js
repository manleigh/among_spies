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

  


  
  
  
  /**/

  
  

//limit - number of songs played per round
let limit = 10;
let t0, t1;
retrieveToken(); //retrieve API token, done immediately
let token = ''; //API Token - global in engine.js
let chosenGenre = '';
let totalRight = 0;

async function retrieveToken() {
    const clientID = "a53a3611a82d4272a440d94da1c08102"; //my personal clientID
    const clientSecret = "371b59d25ab548c6890a9deb1fb6a4b6"; //my personal client Secret

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    token = data.access_token //token is retrieved from the JSON response variable to my post request
    appendGenres();
}

let selectedSongs;
async function startRound() { //activates when startRound button is clicked, starts round of 10 songs
    t0 = performance.now();
    let playlists = await retrievePlaylistEndpoints(chosenGenre) //default is pop, have user choose genre first - maybe startRound button shows up after
    //genre is selected
    let fullSongs = []; 
    for (const playlist of playlists) { //for playlist in array of playlists pulled from specific genre, push all songs within playlist into fullSongs array
        let songsFromPlaylist = await retrieveTracks(playlist.tracks.href)
        fullSongs.push(...songsFromPlaylist)
    }
    fullSongs = fullSongs.filter(song => typeof song !== undefined && song.track != null && song.track.preview_url != null); //fullSongs is array of all songs

    selectedSongs = fullSongs.sort(() => .5 - Math.random()).slice(0, limit) //randomly sort fullSongs array and choose first 10 songs
    //console.log(JSON.stringify(selectedSongs[0], null, 4))
    document.getElementById("startButton").remove();
    let guessButton = `<button id="guessButton" onclick="makeGuess()" type = "">Guess</button>`
    let skipButton = `<button id="skipButton" onclick="skip()">Skip</button>`
    $('#root').append(guessButton)
    $('#root').append(skipButton)
    playSongs();
}


async function appendGenres() {
    let genres = await retrieveGenres()
    //genres.forEach(genre => console.log(JSON.stringify(genre.id, null, 4)))
    //let option = `<option value=${genres[0].id}>${genres[0].name}</option>`
    //document.getElementById('genres').appendChild(option);

    genres.forEach(genre => {
        $('#genres').append(`<option value=${genre.id}>${genre.name}</option>`)
    });
    let submitButton = `<button id="submitButton" onclick="selectGenre()">Submit</button>`
    $('#root').append(submitButton)
    //console.log("total time is" + (t1 - t0))
    // let startButton = `<button id="button" onclick="startRound()">Start Round</button>`
    // $('#root').append(startButton)
}

function selectGenre() {
    var x = document.getElementById("genres").selectedIndex;
    chosenGenre = document.getElementsByTagName("option")[x].value;

    document.getElementById("genres").remove();
    document.getElementById("genreLabel").remove();
    document.getElementById("submitButton").remove();

    let startButton = `<button id="startButton" onclick="startRound()">Start Round</button>`
    let albumCover = ` <img id = "albumCover" src="" alt=""> `
    let artist = `<p id = "artist">Artist: </p>`
    let songName = `<p id = "songName">Song Name: </p>`
    $('#root').append(albumCover)
    $('#root').append(artist)
    $('#root').append(songName)
    $('#root').append(startButton)
}

let counter = 0;

function playSongs() { //playSongs writes artist name, track name to respective HTML elements and plays song
    let artOrSong = Math.random()
    let song = selectedSongs[counter]
    console.log(song)
    let artist = false;
    let imgSrc = song.track.album.images.find(img => img.height === 300)
    if (artOrSong < 0.5) {
        if(imgSrc !== undefined) {
            document.getElementById("albumCover").setAttribute("src", `${imgSrc.url}`)
        } else {
            document.getElementById("albumCover").setAttribute("src", "https://via.placeholder.com/300/0C/O%20https://placeholder.com/")
        }
        document.getElementById("artist").innerHTML = `Artist: ${song.track.artists[0].name}`;
        document.getElementById("songName").innerHTML = (`<textarea id="prompt" rows="1" autofocus="autofocus" placeholder="What song is this?"></textarea>`)
    } else {
        if(imgSrc !== undefined) {
            document.getElementById("albumCover").setAttribute("src", `${imgSrc.url}`)
        } else {
            document.getElementById("albumCover").setAttribute("src", "https://via.placeholder.com/300/0C/O%20https://placeholder.com/")
        }
        document.getElementById("artist").innerHTML =`<textarea id="prompt" rows="1" autofocus="autofocus" placeholder="Who sings this?"></textarea>`;
        document.getElementById("songName").innerHTML = `Song Name: ${song.track.name}`;
        artist = true;
    }

    let x = document.createElement("AUDIO");
    x.setAttribute("src", `${song.track.preview_url}`); //set src attribute to preview url - mp3 file link
    x.setAttribute("id", "currentSong")
    x.load() //load element
    x.play() //play the audio element
    if(x.duration >= 30000) {
        skip()
    }
    document.body.appendChild(x);
    document.getElementById("guessButton").setAttribute("type", `${artist}`)
}

function makeGuess() {
    let x = document.getElementById("currentSong")
    x.pause();
    let artistOrSong = $(this).attr("artist");
    let song = selectedSongs[counter]

    let guessArea = document.getElementById("prompt")
    let guess = `${guessArea.value}`;
    
    if (artistOrSong) {
        if (guess.toLowerCase() === song.track.artists[0].name.toLowerCase()) {
            totalRight++;
        }
    } else {
        if (guess.toLowerCase() === song.track.name.toLowerCase()) {
            totalRight++;
        }
    }
    console.log(guess.toLowerCase())
    console.log(song.track.name.toLowerCase())
    console.log(song.track.artists[0].name.toLowerCase())
    counter++;
    nextSong();
}

function skip() {
    let x = document.getElementById("currentSong")
    x.pause();
    counter++;
    nextSong();
}

function nextSong() {
    //alert(counter)
    document.getElementById("currentSong").remove();
    if(counter < 10) {
        playSongs();
    } else {
        endGame()
    }
}

function endGame() {
    t1 = performance.now();
    let totalTime = t1 - t0;
    let finalScore = score(totalTime)
    console.log("total right is" + totalRight)
    console.log(finalScore)
    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
          console.log(firebaseUser);
          var docRef = db.collection("users").doc(firebaseUser.email);
          docRef.get().then(function(doc) {
        if (doc.exists) {
            var score = doc.data().score;
            if(finalScore > score){
                db.collection("users").doc(firebaseUser.email).set({
                    displayID: firebaseUser.displayName,
                    score: finalScore
                })
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        } else{
          console.log('not logged in')
        }
      })
    
    document.getElementById("albumCover").remove();
    document.getElementById("artist").remove();
    document.getElementById("songName").remove();
    document.getElementById("skipButton").remove();
    document.getElementById("guessButton").remove();

}

function score(totalTime) {
    let totalScore = totalRight + 200000/totalTime
    return totalScore;
}

async function retrieveGenres() { //retrive list of genres on Spotify for user to choose
    const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await result.json();
    return data.categories.items; //returns numerous genre objects
}

async function retrievePlaylistEndpoints(genreID) {  //given genreID string, return (limit number) playlists within that genre
    const playlistLimit = limit
    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreID}/playlists?limit=${playlistLimit}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.playlists.items; //returns numerous playlist JSON objects
}

async function retrieveTracks(endpoint) { //given endpoint URL for specific playlist, retrieves tracks

    const result = await fetch(`${endpoint}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    return data.items; //returns numerous song JSON objects
}
