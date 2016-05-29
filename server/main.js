import { Meteor } from 'meteor/meteor';
import '../imports/api/events.js';

Meteor.methods({
    getLocation:function(geo) {
        var geoCoder = new GeoCoder({
            geocoderProvider: 'google',
            httpAdapter: 'https',
            apiKey: 'AIzaSyBS5xANK7xna9s9cO-rd1eB1lVNxmP1bLE'
        }); 
        return geoCoder.reverse(geo.lat,geo.lng);
    }
});

Meteor.startup(() => {
});
