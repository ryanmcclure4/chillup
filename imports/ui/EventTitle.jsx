import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';
import ReactDOM from 'react-dom';

import  EventButtons from './EventButtons.jsx';

export default class EventTitle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title:this.props.data.title,
            exp:String(12)
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

    calculateExpDate() {
        var now = new Date();
        var elapsed = (((now.getTime() - this.props.data.created.getTime()) / 1000) / 60) / 60;
        return Math.round(this.props.data.exp - elapsed);
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
                <span className='exp-container'>
                    {this.props.data.active ?
                        <div>
                            <div>ENDS IN</div>
                            <div>{this.calculateExpDate()} HOURS</div>
                        </div>
                    :   <div className='exp-container-pending'>
                            <div>SHOW FOR</div>
                            <div>
                                <InlineEdit
                                    ref='expTime'
                                    text={this.state.exp}
                                    maxLength={2}
                                    change={this.dataChanged.bind(this)}
                                    paramName='exp'
                                    className='inline-edit-exp'
                                    activeClassName='inline-edit-exp-active'
                                />
                                HOURS
                            </div>
                        </div>}
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


