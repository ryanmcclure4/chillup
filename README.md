# Chillup

[Chillup](https://app.chillup.xyz) is a simple local events board that lets you create events in your area for anyone to join. 

 - Events are filtered to show event postings within a 30 mile radius of the current location. 
 - Clicking `join` allows you to join the event conversation and add comments.
 - There are no user accounts, all users are anonymous and temporary using `session` variables.

It is built using [Meteor](http://meteor.com) utilizing the following packages:
 - Google Places API for geolocation.
 - `node-geocoder` for reverse location lookups.
 - `react` UI components.
