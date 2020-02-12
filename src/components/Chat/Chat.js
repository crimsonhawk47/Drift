import React, {Component} from 'react';
import {connect} from 'react-redux'
class Chat extends Component{
 
    render(){
        return(
        <div>
            {this.props.reduxStore.chats.map((text, index)=>{
                return <p key={index}>{text.username}: {text.message}</p>
            })}
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