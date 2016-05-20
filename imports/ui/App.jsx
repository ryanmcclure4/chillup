import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Events } from '../api/events.js';
import Event from './Event.jsx';

class App extends Component {
    constructor(props) {
        super(props);

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
                    cancelPending={this.cancelPending.bind(this)}
                />
            );
        });
    }

    newEvent() {
        Meteor.call('events.new', 'Event Title', 'Event Description', Session.get('geo'));
        $(ReactDOM.findDOMNode(this.refs.createEventBtn)).slideUp(200);
        this.setState({
            eventPending:true  
        });
    }

    cancelPending() {
        $(ReactDOM.findDOMNode(this.refs.createEventBtn)).slideDown(200);
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
    Meteor.subscribe('events', Session.get('geo'));
    let loc = Session.get('loc');

    return {
        events: (Events.find({}, { sort: { created: -1} }).fetch() || []),
        location: loc
    };
}, App);
