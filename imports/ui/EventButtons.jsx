import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class EventButtons extends Component {
    renderButtonText() {
        if (this.props.joined) {
            return "LEAVE";
        }

        var buttontext = "JOIN";
        if (this.props.attendees.length == 1) {
            buttontext += " 1 OTHER";
        } else if (this.props.attendees.length > 1) {
            buttontext += " " + this.props.attendees.length + " OTHERS";
        }

        return buttontext;
    }

    onJoinEvent() {
        $(ReactDOM.findDOMNode(this.refs.joinButton)).toggleClass('joined');
        this.props.onJoinEvent();
    }

    onConfirmEvent() {
        Meteor.call('events.update', this.props.id, {active:true});                
        this.props.cancelPending();
    }

    onCancelEvent() {
        Meteor.call('events.delete', this.props.id);
        this.props.cancelPending();
    }

    render() {
        var addClass = this.props.joined ? 'btn-join joined' : 'btn-join';
        return (
            <span className='buttons-container'>
                {this.props.active ?
                    <button 
                        ref='joinButton' 
                        className={addClass} 
                        onClick={this.onJoinEvent.bind(this)}>
                        {this.renderButtonText()}
                    </button>
                :   <span className='buttons'>
                        <button 
                            ref='confirmButton' 
                            className='btn-cancel' 
                            onClick={this.onCancelEvent.bind(this)}>
                            <span className='fa fa-times'></span>
                        </button>
                        <button 
                            ref='cancelButton' 
                            className='btn-confirm' 
                            onClick={this.onConfirmEvent.bind(this)}>
                            <span className='fa fa-check'></span>
                        </button> 
                    </span>}
            </span>
        );
    }
}
