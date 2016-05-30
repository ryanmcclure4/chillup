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
    'events.new'(author, title, description, location, id) {
        check(title, String);
        check(description, String);

        if(typeof(id) == 'undefined'){
            id = new Meteor.Collection.ObjectID()._str;
        }

        return Events.insert({
            _id: id,
            created: new Date(),
            title: title,
            description: description,
            active:false,
            comments: [],
            author: author,
            loc: [location.lng, location.lat],
            attendees: [author],
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
    'events.addComment'(id, avatar, comment) {
        check(id, String);
        Events.update(id, { $push: { comments: { 'avatar' : avatar, 'comment' : comment, 'created' : new Date() } } });
    },
    'events.join'(id, user) {
        check(id, String);
        Events.update(id, { $addToSet: { attendees: user } });
    },
    'events.leave'(id, user) {
        check(id, String);
        Events.update(id, { $pull: { attendees: user } });
    }
});
