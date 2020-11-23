//limit - number of songs played per round
let limit = 10;

retrieveToken(); //retrieve API token, done immediately

let token = ''; //API Token - global in engine.js

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
}

async function startRound() { //activates when startRound button is clicked, starts round of 10 songs
    let genres = await retrieveGenres()
    //genres.forEach(genre => console.log(JSON.stringify(genre.id, null, 4)))

    let playlists = await retrievePlaylistEndpoints("pop") //default is pop, have user choose genre first - maybe startRound button shows up after
    //genre is selected

    let fullSongs = []; 
    for (const playlist of playlists) { //for playlist in array of playlists pulled from specific genre, push all songs within playlist into fullSongs array
        let songsFromPlaylist = await retrieveTracks(playlist.tracks.href)
        fullSongs.push(...songsFromPlaylist)
    }
    fullSongs = fullSongs.filter(song => song.track.preview_url != null); //fullSongs is array of all songs

    let selectedSongs = fullSongs.sort(() => .5 - Math.random()).slice(0, limit) //randomly sort fullSongs array and choose first 10 songs
    //console.log(JSON.stringify(selectedSongs[0], null, 4))
    playSongs(selectedSongs[0])
}

function playSongs(song) { //playSongs writes artist name, track name to respective HTML elements and plays song
    document.getElementById("artist").innerHTML = `Artist: ${song.track.artists[0].name}`;
    document.getElementById("songName").innerHTML = `Song Name: ${song.track.name}`;
    var x = document.createElement("AUDIO");
    x.setAttribute("src", `${song.track.preview_url}`); //set src attribute to preview url - mp3 file link
    x.load() //load element
    x.play() //play the audio element
    document.body.appendChild(x);
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