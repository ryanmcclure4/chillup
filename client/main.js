Meteor.startup(function(){
    Tracker.autorun(function() { 
        var geo = Geolocation.latLng();
        if (geo) {
            reverseGeocode.getLocation(geo.lat, geo.lng, function(loc) {
                Session.set('loc', loc.results[2].formatted_address.split(',')[0].toUpperCase()); 
            });
            Session.set('geo', geo);
        }
    });
});
