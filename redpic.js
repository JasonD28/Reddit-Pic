"use strict";

const dataStore = window.localStorage,
  clientID = '0R16g0EYzzrgJA',
  URL = 'https://www.reddit.com/api/v1/access_token',
  redURL = 'https://www.reddit.com',
  colorKey = 'acc_457458c4a72d405',
  colorSecret = '95ccf132e52479dac7d8a312bdf42cef';

let ki = {};

function getAccessToken() { 
  //Gets the access token from the reddit api site then calls the getPost function
  
  let param = 'grant_type=client_credentials';
  fetch(URL,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization' : `Basic ${btoa(`${clientID}:` + 'Cyzgoyq98NYdQyfkLbZ3BsAS204')}`,
      'Content-Length': param.length

    },
    body: param
  }).then(response =>response.json()).then(function(response){
    if(response.access_token){
      dataStore.setItem('access', response.access_token);
    }
  }).catch(error => console.error('Error:', error));

  getPosts();
}

function setPic(picUrl, picTitle, picLink, author){
  //Takes the information from the reddit picture and sets the appropriate values on newtab.html and calls setColors() with the pic URL

  let pic = document.getElementById('redImg');

  pic.setAttribute("src",picUrl);
  pic.setAttribute("alt", picTitle);

  let link = document.getElementById('redLink');
  link.setAttribute('href', `${redURL}${picLink}`)
  document.getElementById('author').innerHTML = `Photo Taken By: Reddit User ${author}`;

  setColors(picUrl);
}

function getPosts(){
  //Grabs the URL, title, permalink, and author name of the top post of the day from r/itookapicture then calls setPic()
  
  fetch('https://oauth.reddit.com/r/itookapicture/top/?sort=top&t=day', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${dataStore.getItem('access')}`
    }
  }).then(response=>response.json()).then(function(response){
    console.log(JSON.stringify(response));
    setPic(response.data.children[0].data.url, response.data.children[0].data.title,
      response.data.children[0].data.permalink, response.data.children[0].data.author);
  });
}


function setColors (imageURL) {
  //Calls the Imagga API with the URL of the picture and sets the top 4 retrieved colors into a linear gradient background
  
  document.body.style.background = 'rgb(9, 87, 123)'; //Used when API returns an error or when working on extension in order help not exceed API limit

  fetch('https://api.imagga.com/v1/colors?url=' + imageURL, {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + btoa(colorKey + ":" + colorSecret)
    }
  }).then(response =>response.json()).then(function(response){
    document.body.style.background = `linear-gradient(45deg, 
      ${response.results[0].info.image_colors[0].closest_palette_color_html_code},
      ${response.results[0].info.image_colors[2].closest_palette_color_html_code},
      ${response.results[0].info.image_colors[1].closest_palette_color_html_code},
      ${response.results[0].info.image_colors[3].closest_palette_color_html_code})`;
  });

}

getAccessToken();