
//TODO:
	//add search within radius feature
	//figure out timing issues

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
  return new Promise((resolve, reject) => {
	  $.getJSON(brewLocationsUrl, query, (...args) => {
	  	// args = [arg1, arg2, arg3]
	  	// this line is like: callback(arg1, arg2, arg3)
	  	callback(...args);
	  	resolve();
	  });
  });
}

//modify state

const savesApiData = (api) => {
	addsLatandLongToLocations(api);
	populateBreweryData(api);
}

const addsLatandLongToLocations = (api) => {
	if (api.data) {
		api.data.forEach(function(dataObj) {
		    let latitude = dataObj.latitude;
			let longitude = dataObj.longitude;
			if (dataObj.name !== "Main Brewery" && dataObj.locationType !== 'office') {
			    locations.push({'lat': latitude, 'lng': longitude});
			}
	  	})
	}

}

const populateBreweryData = (api) => {
	if (api.data) {
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
				    locationType: dataObj.locationType
				})
		    }
  		})
	}
	if (locations.length > 0) {
		initMap();
		addsBreweryInfoToPage(breweryData);
	}
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

var initMap = () => {

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

$('.city-and-state').submit('click', function(event){
	event.preventDefault(); 
	var userCity = $('.city').val();
	var userState = $('.state').val(); 
	getBreweryDataFromApi(userCity, userState, savesApiData)
	.then(function() {
		if (locations.length > 0) {
			$('.intro-page').addClass('hidden');
			$('.map').removeClass('hidden');
			$('.brewery-side-bar').removeClass('hidden');
		} 
		else {
			$('.intro-page').addClass('hidden')
			$('.failure-page').removeClass('hidden')
		}
	})
	.catch(function(err) {
		console.log(err);
	});
})


	//listens for clicks on lis to expand buttons - v2
	//listens for clicks on google maps markers to expand info -v2

