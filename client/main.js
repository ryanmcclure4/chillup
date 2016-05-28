Meteor.startup(function(){
    Tracker.autorun(function() { 
        var geo = Geolocation.latLng();
        if (geo) {
            /*reverseGeocode.getLocation(geo.lat, geo.lng, function(loc) {
                Session.set('loc', loc.results[2].formatted_address.split(',')[0].toUpperCase()); 
            });*/
            Meteor.call('getLocation', {lat:geo.lat, lng:geo.lng}, function(err, res) {
                Session.set('loc', String(res[0].city.toUpperCase()));
            });
            //Session.set('loc', geoCoder.reverse(geo.lat, geo.lng));
            Session.set('geo', geo);
        }
    });
});
