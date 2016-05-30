import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import EventTitle from './EventTitle.jsx';

export default class Event extends Component {
    constructor(props) {
        super(props);
        var joined = ($.inArray(Session.get('user'), this.props.data.attendees) != -1) ? true : false;
        console.log(Session.get('user'));
        console.log(this.props.data.attendees);
        this.state = {
            joined:joined,
            description:this.props.data.description
        }
    }

    renderComments() {
        return this.props.data.comments.map((comment) => {
            return (
                <li key={Math.random()} className='comment'>
                    <img className='avatar' src={comment.avatar}/>
                    <span className='comment-posted'>{comment.comment}</span>
                    <span className='time'>
                        {comment.created.getHours() % 12}:
                        {(comment.created.getMinutes() / 10) < 1 ? '0' : ''}
                        {comment.created.getMinutes()}
                        {(comment.created.getHours() - 12) > 0 ? 'pm' : 'am'}
                    </span>
                </li>
            ); 
        });
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
            Meteor.call('events.leave', this.props.data._id, Session.get('user'));
        } else {
            Meteor.call('events.join', this.props.data._id, Session.get('user'));
        }

        this.setState({
            joined:!this.state.joined,
        });
    }

    addCommentOnEnter(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            const commentAuthor = Session.get('user');
            const commentInput = ReactDOM.findDOMNode(this.refs.commentInput).value.trim();
            Meteor.call('events.addComment', this.props.data._id, Session.get('avatar'), commentInput);
            ReactDOM.findDOMNode(this.refs.commentInput).value = '';
        }
    }

    render() {
        var addClass = this.state.joined ? 'event-comments' : 'event-comments hidden';
        return(
            <li className='event'>
                <EventTitle 
                    eventPending={this.props.eventPending}
                    joined={this.state.joined} 
                    data={this.props.data} 
                    cancelPending={this.props.cancelPending}
                    onJoinEvent={this.onJoinEvent.bind(this)} 
                />
                <div className='event-description'>
                    {(this.props.data.active && (this.props.data.author != Session.get('user'))) ?
                        <span>
                            {this.props.data.description}
                        </span>
                    :   <InlineEdit 
                            text={this.state.description} 
                            change={this.dataChanged.bind(this)} 
                            paramName='description'
                            activeClassName='inline-edit-description'
                        />}
                </div>
                <div ref='comments' className={addClass}>
                    <ul className='comments-list'>{this.renderComments()}</ul>
                    <div className='input-container'>
                        <input onKeyDown={this.addCommentOnEnter.bind(this)} ref='commentInput' className='comment-field comment-text' placeholder='add a comment'></input>
                    </div>
                </div>
            </li>
        );
    }
}
