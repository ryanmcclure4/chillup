import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';
import ReactDOM from 'react-dom';

import  EventButtons from './EventButtons.jsx';

export default class EventTitle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title:this.props.data.title
        }
    }

    componentDidMount() {
        if(this.props.eventPending){
            $(ReactDOM.findDOMNode(this.refs.titleText)).trigger('click');
        }
    }

    dataChanged(data) {
        Meteor.call('events.update', this.props.data._id, data);
        this.setState({
            ...data
        }); 
    } 

    onJoinEvent() {
        $(ReactDOM.findDOMNode(this.refs.title)).toggleClass('joined');
        this.props.onJoinEvent();
    }

    render() {
        return (
            <div ref='title' className='event-title'>
                <span className='title-container'>
                    {this.props.data.active ?
                        <span>
                            {this.props.data.title}
                        </span>
                    :   <InlineEdit 
                            ref='titleText'
                            text={this.state.title} 
                            change={this.dataChanged.bind(this)} 
                            paramName='title'
                            activeClassName='inline-edit-title'
                        />}
                </span>
                <span className='expiration-container'>
                    
                </span>
                <EventButtons 
                    id={this.props.data._id} 
                    joined={this.props.joined} 
                    active={this.props.data.active} 
                    attendance={this.props.data.attendance} 
                    cancelPending={this.props.cancelPending}
                    onJoinEvent={this.onJoinEvent.bind(this)} />
            </div>
        );
    }
}


