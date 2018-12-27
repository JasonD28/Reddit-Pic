"use strict";

const dataStore = window.localStorage,
  clientID = '0R16g0EYzzrgJA',
  URL = 'https://www.reddit.com/api/v1/access_token',
  redURL = 'https://www.reddit.com',
  colorKey = 'acc_457458c4a72d405',
  colorSecret = '95ccf132e52479dac7d8a312bdf42cef';

let buttonObj = {0: 'do', 1: 're', 2: 'me'};

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
    else{
      console.log(response);
    }
  }).catch(error => console.error('Error:', error));

  // getPosts();
}

function setPic(picUrl, picTitle, picLink, author){
  //Takes the information from the reddit picture and sets the appropriate values on newtab.html and calls setColors() with the pic URL

  let pic = document.getElementById('redImg');

  if(picUrl.slice(picUrl.length-3, picUrl.length) != "jpg") {
    picUrl += ".jpg";
  }

  pic.setAttribute("src",picUrl);
  pic.setAttribute("alt", picTitle);

  let link = document.getElementById('redLink');
  link.setAttribute('href', `${redURL}${picLink}`)
  document.getElementById('author').innerHTML = `Photo Taken By: Reddit User ${author}`;

  setColors(picUrl, 0);
}

function getPosts(postNum){
  //Grabs the URL, title, permalink, and author name of the top post of the day from r/itookapicture then calls setPic()

  if (dataStore.getItem('post')){ //Checks if user changed the default post displayed
    postNum = dataStore.getItem('post');
  }

  fetch('https://oauth.reddit.com/r/itookapicture/top/?sort=top&t=day', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${dataStore.getItem('access')}`
    }
  }).then(response=>response.json()).then(function(response){
    setPic(response.data.children[postNum].data.url, response.data.children[postNum].data.title,
      response.data.children[postNum].data.permalink, response.data.children[postNum].data.author);
  });

  for(let key in buttonObj) { //Highlights the button connected to the current picture
    if(key == postNum) {
      document.getElementById(buttonObj[key]).style.border = "2.5px solid white";
    } else {
      document.getElementById(buttonObj[key]).style.border = "1px solid white";
    }
  }
}


function setColors (imageURL, callCount) {
  //Calls the Imagga API with the URL of the picture and sets the top 4 retrieved colors into a linear gradient background
  
  document.body.style.background = 'rgb(9, 87, 123)'; //Used when API returns an error or when working on extension in order help not exceed API limit
  
  fetch('https://api.imagga.com/v2/colors?image_url=' + imageURL, {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + btoa(colorKey + ":" + colorSecret)
    }
  }).then(response =>response.json()).then(function(response){
    try{
    document.body.style.background = `linear-gradient(60deg, 
      ${response.result.colors.image_colors[1].closest_palette_color_html_code},
      ${response.result.colors.image_colors[0].closest_palette_color_html_code},
      ${response.result.colors.image_colors[2].closest_palette_color_html_code},
      ${response.result.colors.image_colors[0].closest_palette_color_html_code},
      ${response.result.colors.image_colors[1].closest_palette_color_html_code})`;
    }
    catch(err){
      console.log(callCount);
      if(callCount > 3){
        document.body.style.background = `${response.result.colors.image_colors[0].closest_palette_color_html_code}`;
      }
      callCount++;
      setColors(imageURL, callCount);
    }
  });

}
getAccessToken();
getPosts(0);

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('do').addEventListener('click', function() {
    dataStore.setItem('post', 0);

    chrome.tabs.query({active: true, currentWindow: true}, function (allTabs) { //Reloads the current tab
      chrome.tabs.reload(allTabs[0].id);
    });
  });

  document.getElementById('re').addEventListener('click', function() {
    dataStore.setItem('post', 1);

    chrome.tabs.query({active: true, currentWindow: true}, function (allTabs) { //Reloads the current tab
      chrome.tabs.reload(allTabs[0].id);
    });
  });

  document.getElementById('me').addEventListener('click', function() {
    dataStore.setItem('post', 2);

    chrome.tabs.query({active: true, currentWindow: true}, function (allTabs) { //Reloads the current tab
      chrome.tabs.reload(allTabs[0].id);
    });
  });
});