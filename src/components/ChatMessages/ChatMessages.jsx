import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Grid, Typography } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import Message from '../Message/Message'




const ChatMessages = (props) => {
    const index = props.match.params.index
    const chat = props.chats && props.chats[index]

    return (
        <Grid item xs={12} className={props.scrollStyling} id='scroll-anchor'>
            {chat && chat.chat_messages.map((messageData, index) => {
                const justifyText = messageData.username !== chat.partner.name ?
                    `flex-start` : `flex-end`
                return (
                    <Grid container spacing={0} justify={justifyText}>
                        <Message key={index} messageData={messageData} />
                    </Grid>
                )
            })}
        </Grid>
    )

}

const mapStateToProps = reduxStore => {
    return (
        { chats: reduxStore.chats }
    )
}
export default withRouter(connect(mapStateToProps)(ChatMessages))