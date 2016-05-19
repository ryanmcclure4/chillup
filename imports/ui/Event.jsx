import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import EventTitle from './EventTitle.jsx';

export default class Event extends Component {
    constructor(props) {
        super(props);

        this.state = {
            joined:false,
            description:this.props.data.description
        }
    }

    dataChanged(data) {
        Meteor.call('events.update', this.props.data._id, data);
        this.setState({
            ...data
        });
    }

    onJoinEvent() {
        $(ReactDOM.findDOMNode(this.refs.comments)).stop(true,true).slideToggle(200);
        if (this.state.joined) {
            Meteor.call('events.leave', this.props.data._id);
        } else {
            Meteor.call('events.join', this.props.data._id);
        }

        this.setState({
            joined:!this.state.joined,
        });
    }

    renderComments() {
        return this.props.data.comments.map((comment) => {
            return (
                <li key={Math.random()} className='comment'>
                    <span className='icon fa fa-chevron-right'></span>
                    {comment}
                </li>
            ); 
        });
    }

    onAddComment(event) {
        event.preventDefault();
        const commentInput = ReactDOM.findDOMNode(this.refs.commentInput).value.trim();
        Meteor.call('events.addComment', this.props.data._id, commentInput);
        ReactDOM.findDOMNode(this.refs.commentInput).value = '';
    }

    render() {
        return(
            <li className='event'>
                <EventTitle 
                    joined={this.state.joined} 
                    data={this.props.data} 
                    cancelPending={this.props.cancelPending}
                    onJoinEvent={this.onJoinEvent.bind(this)} 
                />
                <div className='event-description'>
                    <InlineEdit 
                        text={this.state.description} 
                        change={this.dataChanged.bind(this)} 
                        paramName='description'
                        activeClassName='inline-edit-description'
                    />
                </div>
                <div ref='comments' className='event-comments'>
                    <ul className='comments-list'>{this.renderComments()}</ul>
                    <form className='new-comment' onSubmit={this.onAddComment.bind(this)} >
                        <input ref='commentInput' className='comment-field'></input>
                    </form>
                </div>
            </li>
        );
    }
}
