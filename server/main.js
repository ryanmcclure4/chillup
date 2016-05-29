import { Meteor } from 'meteor/meteor';
import '../imports/api/events.js';

var googleApiKey = process.env.GOOGLE_API;

Meteor.methods({
    getLocation:function(geo) {
        var geoCoder = new GeoCoder({
            geocoderProvider: 'google',
            httpAdapter: 'https',
            apiKey: googleApiKey
        }); 
        return geoCoder.reverse(geo.lat,geo.lng);
    }
});

Meteor.startup(() => {
});
