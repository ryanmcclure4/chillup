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
    'events.new'(title, description, location) {
        check(title, String);
        check(description, String);

        return Events.insert({
            created: new Date(),
            title: title,
            description: description,
            attendance: 1,
            active:false,
            comments: [],
            loc: [location.lng, location.lat]
        });
    },
    'events.update'(id, data) {
        Events.update(id, { $set: { ...data } });
    },
    'events.delete'(id) {
        Events.remove(id);
    },
    'events.addComment'(id, author, comment) {
        Events.update(id, { $push: { comments: { 'author' : author, 'comment' : comment, 'created' : new Date() } } });
    },
    'events.join'(id) {
        Events.update(id, { $inc: { attendance : 1 } });
    },
    'events.leave'(id) {
        Events.update(id, { $inc: { attendance : -1 } });
    }
});
