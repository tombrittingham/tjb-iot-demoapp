'use strict';
$(document).ready(() => {

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







});
