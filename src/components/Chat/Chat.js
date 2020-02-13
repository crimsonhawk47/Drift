import React, {Component} from 'react';
import {connect} from 'react-redux'
import io from 'socket.io-client'
import { json } from 'body-parser';


class Chat extends Component{
 
    render(){
        return(
        <div>
            {/* {this.props.reduxStore.chats.map((chat, index)=>{
                return <p key={index}>{text.username}: {text.message}</p>
            })} */}
            {JSON.stringify(this.props.reduxStore.chats)}
        </div>
        )
    
    }
}

const mapStateToProps = (reduxStore)=>{
    return({
        reduxStore
    })
}
export default connect(mapStateToProps)(Chat)