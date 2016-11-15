
const brewLocationsUrl = 'http://crossorigin.me/http://api.brewerydb.com/v2/locations/?';
const breweryApiKey = 'faa8e58deba5001b5b04d3431a91480d';
const googleMapsBaseUrl = 'http://crossorigin.me/https://maps.googleapis.com/maps/api/js?';
const googleApiKey = 'AIzaSyBc-bWk1xLAWHUqIoYDZ4piJb4J3Ajvh4k';

//state

const locations = [];
const breweryData = [];

//api call

const getBreweryDataFromApi = (locality, region, callback) => {
  const query = {
    key: breweryApiKey,
  	locality: locality,
    region: region,
  }
$.getJSON(brewLocationsUrl, query, callback);
}

//modify state

const savesApiData = (api) => {
	addsLatandLongToLocations(api);
	populateBreweryData(api);
}

const addsLatandLongToLocations = (api) => {
  api.data.forEach(function(dataObj) {
    let latitude = dataObj.latitude;
	let longitude = dataObj.longitude;
	  if (dataObj.name !== "Main Brewery" && dataObj.locationType !== 'office') {
	    locations.push({'lat': latitude, 'lng': longitude});
	  }
  });
}

const populateBreweryData = (api) => {
  api.data.forEach ((dataObj) => {
    if (dataObj.name !== "Main Brewery" && dataObj.locationType !== 'office') {
      breweryData.push({
	    name: dataObj.name,
	    id: dataObj.id,
	    streetAddress: dataObj.streetAddress,
	    locality: dataObj.locality,
	    region: dataObj.region,
	    isClosed: dataObj.isClosed, 
	    website: dataObj.brewery.website,
	    phone: dataObj.phone,
	    locationType: dataObj.locationType});
    }
  });
initMap();
addsBreweryInfoToPage(breweryData);
}	

//render functions

const addsBreweryInfoToPage = (breweryData) => {
  breweryData.forEach((breweryObj) => {
    let name = breweryObj.name, 
	  streetAddress = breweryObj.streetAddress, 
	  website = breweryObj.website, 
	  phone = breweryObj.phone;

	  if (breweryObj.name === undefined) {
	    name = 'No name listed';
	  }
	  else if (breweryObj.streetAddress === undefined) {
	    streetAddress = 'No address listed';
	  }
	  else if (breweryObj.phone === undefined) {
	    phone = 'No phone number listed';
	  }
	  else if (breweryObj.website === undefined) {
	    website = 'No website listed';
	  }

	var results = 
	  `<li>${name}</li>
	  <li>${streetAddress}</li>
	  <li><a href="${website}" target="_blank">${website}</a></li>
	  <li>${phone}</li>
	  <hr>`
	  $('.brewery-info').append(results);
  });
}

const initMap = () => {

let map = new google.maps.Map(document.getElementById('map'), {
  zoom: 12,
  center: locations[0]
});

let markers = locations.map((location, i) => {
  return new google.maps.Marker({
    position: location,
  });
});

let markerCluster = new MarkerClusterer(map, markers,
	{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

//event listeners



	//listens for submit of city and state on intro page
	//listens for clicks on lis to expand buttons - v2
	//listens for clicks on google maps markers to expand info -v2

$(() => {
	getBreweryDataFromApi("san francisco", "california", savesApiData);

})
