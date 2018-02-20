Meteor.startup(function(){
    Tracker.autorun(function() { 
        var geo = Geolocation.latLng();
        if (geo && geo.lat && geo.lng) {
            Session.set('geo', geo);

            Meteor.call('getLocation', {lat:geo.lat, lng:geo.lng}, function(err, res) {
                if (err) {
                    Session.set('loc', '');
                } else {
                    Session.set('loc', String(res[0].city.toUpperCase()));
                }
            });
        }
    });
});
