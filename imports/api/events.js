import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
    Events._ensureIndex({ loc: '2dsphere' }); 
    Meteor.publish('events', function(location, pending) {
        if (location) {
            return Events.find({
                loc: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [location.lng, location.lat]
                        },
                        $maxDistance: 50000
                    }
                },
                $or: [
                    { active: false, _id: pending },
                    { active: { $ne: false } }
                ]
            });
        }
    });
}

Meteor.methods({
    'events.new'(title, description, location, id) {
        check(title, String);
        check(description, String);

        if(typeof(id) === 'undefined'){
            id = new Meteor.Collection.ObjectID()._str;
        }

        return Events.insert({
            _id: id,
            created: new Date(),
            title: title,
            description: description,
            attendance: 1,
            active:false,
            comments: [],
            loc: [location.lng, location.lat],
            exp: 24
        });
    },
    'events.update'(id, data) {
        check(id, String);
        Events.update(id, { $set: { ...data } });
    },
    'events.delete'(id) {
        check(id, String);
        Events.remove(id);
    },
    'events.addComment'(id, author, comment) {
        check(id, String);
        Events.update(id, { $push: { comments: { 'author' : author, 'comment' : comment, 'created' : new Date() } } });
    },
    'events.join'(id) {
        check(id, String);
        Events.update(id, { $inc: { attendance : 1 } });
    },
    'events.leave'(id) {
        check(id, String);
        Events.update(id, { $inc: { attendance : -1 } });
    }
});
