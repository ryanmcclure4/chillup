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

    renderComments() {
        return this.props.data.comments.map((comment) => {
            return (
                <li key={Math.random()} className='comment'>
                    <span className='time'>
                        {comment.created.getHours() % 12}:
                        {(comment.created.getMinutes() / 10) < 1 ? '0' : ''}
                        {comment.created.getMinutes()}
                        {(comment.created.getHours() - 12) > 0 ? 'pm' : 'am'}
                    </span>
                    <span className='author'>{comment.author} :</span>
                    {comment.comment}
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
            Meteor.call('events.leave', this.props.data._id);
        } else {
            Meteor.call('events.join', this.props.data._id);
        }

        this.setState({
            joined:!this.state.joined,
        });
    }

    addCommentOnEnter(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            const commentAuthor = ReactDOM.findDOMNode(this.refs.commentAuthor).value.trim();
            const commentInput = ReactDOM.findDOMNode(this.refs.commentInput).value.trim();
            Meteor.call('events.addComment', this.props.data._id, commentAuthor, commentInput);
            ReactDOM.findDOMNode(this.refs.commentInput).value = '';
        }
    }

    render() {
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
                    {this.props.data.active ?
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
                <div ref='comments' className='event-comments'>
                    <ul className='comments-list'>{this.renderComments()}</ul>
                    <div className='input-container'>
                        <input ref='commentAuthor' className='comment-field comment-author' placeholder='your name'></input>
                        <input onKeyDown={this.addCommentOnEnter.bind(this)} ref='commentInput' className='comment-field comment-text' placeholder='add a comment'></input>
                    </div>
                </div>
            </li>
        );
    }
}
