import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class EventButtons extends Component {
    renderButtonText() {
        if (this.props.joined) {
            return "LEAVE";
        }

        var buttontext = "JOIN 1 OTHER";
        if (this.props.attendance > 1) {
            buttontext = "JOIN " + this.props.attendance + " OTHERS";
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
        return (
            <span>
                {this.props.active ?
                    <button 
                        ref='joinButton' 
                        className='btn-join' 
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
