"use strict";
const data = window.localStorage;

const G_KEY = 'AIzaSyB-4OaKEnlwfC6Y0qS5pqueOT0l4o4qtwE';

const G_URL = 'https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:';

const DS_URL = 'https://api.darksky.net/forecast/4433243bba2245ca9dba46547825db8e/';

const latLng = {};

function checkZip (zip) {
  //Checks if a given value is a valid zipcode
  
  if ( /(^\d{5}$)|(^$)/.test(zip)){
    return true;
  } else {
    return false;
  }
}

function displayWeather (zipcode = '92585') {
  //Calls Google API to get LatLng then calls getWeather()

  if (data.getItem('zipcode')){ //Checks if user entered new zipcode
    zipcode = data.getItem('zipcode');
  }

  let url = G_URL + zipcode + `&key=${G_KEY}`,
  request = new XMLHttpRequest();

  request.open('GET', url);
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      let resp = request.responseText;
      if(!JSON.parse(resp).results[0]){ //Double checks the validity of the user entered zipcode
        alert("Not a valid zipcode");
        data.setItem('zipcode', 92585);
        chrome.tabs.query({active: true, currentWindow: true}, function (allTabs) { //Reloads the current tab
          chrome.tabs.reload(allTabs[0].id);
        });
      }
      latLng.lat = JSON.parse(resp).results[0].geometry.location.lat;
      latLng.lng = JSON.parse(resp).results[0].geometry.location.lng;

      getWeather();
    }
  };
  
  request.send();
}

function getWeather () {
  //Calls Dark Sky API in order to get current temperature
  
  let request = new XMLHttpRequest(),
  url = `${DS_URL}${latLng.lat},${latLng.lng}/`;
  
  request.open('GET', url, true);
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      let resp = request.responseText;
      document.getElementById("weather").innerHTML = `${JSON.parse(resp).currently.temperature} °F`;
    }
  };
  request.send();

  
}


displayWeather();

document.addEventListener('DOMContentLoaded', function() {
  let zipcode = document.getElementById('zip');

  document.getElementById('weather').addEventListener('click', function() { //Listens for when the weather element is clicked
    if (zipcode.style.display === "none") { //Toggles between displaying and hiding the textbox
        zipcode.style.display = "block";
        document.getElementById('zipButton').style.display = "block";
    } else {
        zipcode.style.display = "none";
        document.getElementById('zipButton').style.display = "none";
    }
  });

  document.getElementById('formy').addEventListener('submit', function() { //Listens for when enter is pressed on the textbox

    if (checkZip(document.getElementById('zip').value)) {
      data.setItem('zipcode', document.getElementById('zip').value);
    } else {
      alert('That is not a valid zipcode');
    }
    
    chrome.tabs.query({active: true, currentWindow: true}, function (allTabs) { //Reloads the current tab
      chrome.tabs.reload(allTabs[0].id);
    });
  });
});
