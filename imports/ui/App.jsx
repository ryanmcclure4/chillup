import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Events } from '../api/events.js';
import Event from './Event.jsx';

class App extends Component {
    constructor(props) {
        super(props);
        var avatars = {
            'chick':'img/chick.png',
            'tiger':'img/tiger.png',
            'whale':'img/whale.png',
            'fox':'img/fox.png',
            'duckling':'img/duckling.png',
            'koala':'img/koala.png',
            'crab':'img/crab.png',
            'pig':'img/pig.png'
        };
        var avatarKeys = Object.keys(avatars);
        Session.set('pending', '');
        Session.setDefaultPersistent('user', new Meteor.Collection.ObjectID()._str);
        Session.setDefaultPersistent('avatar', avatars[avatarKeys[avatarKeys.length * Math.random() << 0]]);
        this.state = ({
            eventPending:false
        });
    }

    renderLocation() {
        var loc = Session.get('loc');
        if (loc) {
            return " IN " + loc;
        }
        return "";
    }

    renderEvents() {
        if (this.props.events.length == 0) {
            return (
                <div className='no-events'>
                    <p>There are no events in your area...</p>
                    <p>Be the first to create one!</p>
                </div>
            );
        }

        return this.props.events.map((event) => {
            return(
                <Event
                    key={event._id}
                    data={event}
                    eventPending={this.state.eventPending}
                    cancelPending={this.cancelPending.bind(this)}
                />
            );
        });
    }

    newEvent() {
        this.setState({
            eventPending:true  
        });
        var id = new Meteor.Collection.ObjectID()._str;
        Session.set('pending', id); 
        Meteor.call('events.new', Session.get('user'), 'Event Title', 'Event Description', Session.get('geo'), id);
        $(ReactDOM.findDOMNode(this.refs.createEventBtn)).slideUp(200);
    }

    cancelPending() {
        $(ReactDOM.findDOMNode(this.refs.createEventBtn)).slideDown(200);
        Session.set('pending', '');
        this.setState({
            eventPending:false  
        });
    }

    render() {
        return (
            <div className="container">
                <h1>Chillup</h1>
                <div ref='createEventBtn' className='create-event'>
                    <button 
                        className='btn-create-event' 
                        onClick={this.newEvent.bind(this)}>
                        <span className='fa fa-plus'></span> CREATE AN EVENT{this.renderLocation()}!</button>
                </div>
                <ul>
                    {this.renderEvents()}
                </ul>
            </div>
        );
    }
}

App.propTypes = {
    events: PropTypes.array.isRequired,
    location: PropTypes.string
};

export default createContainer(() => {
    Meteor.subscribe('events', Session.get('geo'), Session.get('pending'));
    let loc = Session.get('loc');

    return {
        events: (Events.find({}, { sort: { created: -1} }).fetch() || []),
        location: loc
    };
}, App);
