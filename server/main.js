import { Meteor } from 'meteor/meteor';
import '../imports/api/events.js';

Meteor.methods({
    getLocation:function(geo) {
        var geoCoder = new GeoCoder({
            httpAdapter: "https"
        }); 
        return geoCoder.reverse(geo.lat,geo.lng);
    }
});

Meteor.startup(() => {
});
