import React, { Component } from 'react';
import { Paper, Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    leftChat: {

    },
    rightChat: {

    }
});


class Chat extends Component {

    render() {
        const { classes } = this.props;

        let index = this.props.match.params.index
        let chat = this.props.reduxStore.chats[index]
        let myUser = this.props.reduxStore.user.username
        let partner;
        if (chat) {
            for (let named of chat.participants) {
                if (named !== myUser) {
                    partner = named;
                }
            }
        }
        return (
            <Grid container className={classes.root} spacing={2} justify='center'>
                {partner}
                {chat && chat.chat_messages.map((messageData, index) => {
                    let message = messageData[0]
                    let userSpeaking = messageData[1]
                    return (
                        <>
                            <Grid item xs={7}>
                                <Grid container container spacing={0} justify='flex-start'>
                                    <Paper>
                                        <Typography>{userSpeaking}: {message}</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </>
                    )
                })}
            </Grid>
        )

    }
}

const mapStateToProps = reduxStore => {
    return (
        { reduxStore }
    )
}
export default withStyles(styles)(connect(mapStateToProps)(Chat))