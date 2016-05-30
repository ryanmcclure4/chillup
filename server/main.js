import { Meteor } from 'meteor/meteor';
import { Events } from '../imports/api/events.js';

var googleApiKey = Meteor.settings.googleApiKey;

var removeExpiredEvents = function() {
    var cursor = Events.find({}, { sort: { created: -1 } });
    cursor.forEach(function(event) {
        var now = new Date();
        var elapsed = (((now.getTime() - event.created.getTime()) / 1000) / 60) / 60;
        if ((elapsed >= event.exp) || (elapsed > 0.5 && !event.active)) {
            Events.remove(event._id);
        }
    });
}

Meteor.methods({
    getLocation:function(geo) {
        if (typeof(googleApiKey) == 'undefined') {
            throw new Meteor.Error('NoKey', 'API key not found', 'Please set environment variable GOOGLE_API');
        }

        var geoCoder = new GeoCoder({
            geocoderProvider: 'google',
            httpAdapter: 'https',
            apiKey: googleApiKey
        }); 

        return geoCoder.reverse(geo.lat,geo.lng);
    }
});

Meteor.startup(() => {
    removeExpiredEvents();
    Meteor.setInterval(removeExpiredEvents, 10000);
});
