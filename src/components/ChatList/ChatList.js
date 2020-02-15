import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Paper, Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import {withRouter} from 'react-router-dom'
import io from 'socket.io-client'
import { json } from 'body-parser';

const styles = theme => ({
    root: {
        flexGrow: 1,
    }
});


class ChatList extends Component {



    

    goToChat = (index) => {
        this.props.history.push(`/chat/${index}`)
    }

    render() {
        const { classes } = this.props;
        let chats = this.props.reduxStore.chats
        let myUser = this.props.reduxStore.user.username
        return (
            <Grid container className={classes.root} spacing={2} justify='center'>
                <Grid item xs={6}>
                    {chats.map((chat, index) => {
                        let user1 = chat.participants[0]
                        let user2 = chat.participants[1]
                        let messages = chat.chat_messages;
                        let lastMessage = messages[messages.length - 1].message
                        

                        return (
                        <Paper key={index} onClick={() => { this.goToChat(index) }}>
                            <Typography >
                                Chatting with {myUser === user1 ? user2 : user1}
                            </Typography>
                            <Typography>Last Message: {lastMessage}</Typography>
                        </Paper>
                        )
                    })}
                </Grid>
            </Grid>
        )

    }
}

const mapStateToProps = (reduxStore) => {
    return ({
        reduxStore
    })
}


export default withRouter(withStyles(styles)(connect(mapStateToProps)(ChatList)))