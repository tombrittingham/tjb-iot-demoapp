'use strict';
$(document).ready(() => {
    // Create object to store map data 
    let mapData = {};

    // Get the input data from the form 
    $('#searchButton').on('click', (event) => {
        event.preventDefault();
        let searchDeviceInput = $("input[name='deviceName']")
        if (searchDeviceInput.val() !== '') {
            // Make sure we are not already listening to some device
            this.dweetio.stop_listening();
            // Send our device name to dweet.io or thingspace.io 
            this.dweetio.get_latest_dweet_for(searchDeviceInput.val(), (err, dweet) => {
                if (err) {
                    // Handle response with error or no device found 
                    let errorMsg = 
                    `
                    <div class="card card-danger text-center z-depth-2">
                        <div class="card-block">
                            <h5 class="white-text">
                                Uh oh! No device found with that name 
                            </h5>
                            <h6 class="white-text">
                                Please check spelling and try again :) 
                            </h6>
                        </div>
                    </div>
                    `
                    $('#deviceContent').html('').append(errorMsg);
                } else {
                    // Handle response with valid data for a single query 
                    let dweetData = dweet[0];
                    console.log(dweetData)
                    mapData.thingName = dweetData.thing; 
                    mapData.mapLat = dweetData.content.latitude || dweetData.content.Latitude; 
                    mapData.mapLong = dweetData.content.longitude || dweetData.content.Longitude; 
                    console.log(mapData)

                    let dweetParsedJson = JSON.stringify(dweetData, null, 4);
                    // Create our HTML template components 
                    let deviceDataTemplate = 
                    `
                    <div id="deviceTitle" class="card">
                        <h3 class="card-header primary-color white-text">${dweetData.thing}</h3>
                        <small id="deviceTimestamp" class="card-header">${dweetData.created}</small>
                        <div class="card-block">
                            <pre class="device-data-json card-text">${dweetParsedJson}</pre>
                        </div>
                    </div>
                    `
                    // Append updated template 
                    $('#deviceContent').html('').append(deviceDataTemplate);

                    // Check to see if lat/long is legit 
                    if (mapData.mapLat) {
                        $('#showMapButton').removeClass('hide-map-button disabled');
                    } else {
                        $('#showMapButton').addClass('disabled');
                        $('#showMapButton').removeClass('hide-map-button');
                        $('#showMapContent').addClass('hide-map-content');
                    }
                }
            })
            // Get web socket data from form submit 
            this.dweetio.listen_for(searchDeviceInput.val(), (dweet) => {
                if (dweet) {
                    let jsonData = JSON.stringify(dweet, null, 4);
                    let socketTimestamp = dweet.created;
                    $('#deviceTimestamp').replaceWith(`<small id="deviceTimestamp" class="card-header">${socketTimestamp}</small>`)
                    $('pre').replaceWith(`<pre class="device-data-json card-text">${jsonData}</pre>`);
                }
            });
        }
        searchDeviceInput.val('');
    });

    //Display the map on click event 
    $('#showMapButton').on('click', (event) => {
        event.preventDefault(); 

        // Create template to render map 
        let mapContainerTemplate = `
            <div class="card">
                <div class="card-block">
                    <div id="map"</div>
                </div>
            </div>
        `

        // Make sure nothing happens on an existing disabled button state 
        if(!$('#showMapButton').hasClass('disabled')) {

            // If button is active - set it to disabled when clicked  
            $('#showMapButton').addClass('disabled');

            // Remove the display: none style for the map content 
            $('#mapContent').removeClass('hide-map-content');
            // Append the map template div 
            $('#mapContent').html('').append(mapContainerTemplate);
            // Show map 
            new MapQuestCard(mapData.thingName, mapData.mapLat, mapData.mapLong).buildMap();



        }
    });


        // Build Map Class
        class MapQuestCard {
            constructor(name, lat, long) {
                this.name = name; 
                this.lat = lat; 
                this.long = long;
            }

            buildMap() {
            let mapLayer = MQ.mapLayer(), map;

                            this.map = L.map('map', {
                                layers: mapLayer, 
                                center: [this.lat, this.long], 
                                zoom: 12
                            });

                            L.control.layers({
                            'Map': mapLayer,
                            'Hybrid': MQ.hybridLayer(),
                            'Satellite': MQ.satelliteLayer(),
                            'Dark': MQ.darkLayer(),
                            'Light': MQ.lightLayer()
                        }).addTo(this.map);
                        
                        let marker = L.marker([this.lat, this.long]).addTo(this.map); 
                        marker.bindPopup(this.name);
            }
        }
        



});
