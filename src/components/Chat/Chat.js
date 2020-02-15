import React, { Component } from 'react';
import { Paper, Grid, Typography, Input, Button, Avatar } from '@material-ui/core'
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

    state = {
        input: ''
    }

    goHome = ()=>{
        this.props.history.push('/home')
    }

    handleChangeFor(event, property) {
        this.setState({
            [property]: event.target.value
        })
    }

    sendMessage = (chatId) => {
        this.props.dispatch({ type: 'SEND_MESSAGE', payload: {input: this.state.input, chatId: chatId} })
        this.setState({input: ''})
    }

    render() {
        
        
        
        const { classes } = this.props;

        let index = this.props.match.params.index
        let chat = this.props.reduxStore.chats[index]
        let chat_id = chat && chat.chat_id
        
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
                {chat && chat.chat_messages.map((messageData, index) => {
                    let message = messageData.message
                    let userSpeaking = messageData.username
                    let date = messageData.date
                    let img = messageData.img
                    return (
                        <Grid item xs={7} key={index}>
                            <Grid container spacing={0} justify='flex-start'>
                            <Avatar src={img}></Avatar>
                                <Paper>
                                    <Typography>{userSpeaking}: {message} ({date})</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    )
                })}
                <Grid item xs={11} container justify="center">
                    <Input
                        onChange={(event) => { this.handleChangeFor(event, 'input') }}
                        placeholder='Send a message'
                        value = {this.state.input}
                        fullWidth />
                    <Button onClick={()=> {this.sendMessage(chat_id)}}>Send Message</Button>
                    <Button onClick={this.goHome}>GO BACK HOME</Button>
                </Grid>


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