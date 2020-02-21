import React, { Component } from 'react';
import { Paper, Grid, Typography, Input, Button, Avatar } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import moment from 'moment'
import { Element } from 'react-scroll';

const styles = theme => ({

  root: {
    flexGrow: 1,
  },
  leftChat: {

  },
  rightChat: {

  },
  message:{
    margin: '20px'
  },
  scroll: {
    overflow: 'scroll',
    height: '400px',
    margin: '20px'
  }
});




class Chat extends Component {



  state = {
    input: '',
  }

  goHome = () => {
    this.props.history.push('/home')
  }

  handleChangeFor(event, property) {
    this.setState({
      [property]: event.target.value
    })
  }

  deleteMessage = (id, chatId) => {
    console.log(`DELETING`);
    this.props.dispatch({
      type: 'DELETE_MESSAGE',
      payload: { id, chatId }
    })

  }

  scrollToBottom = () => {
    let scrollAnchor = document.getElementById("scroll-anchor");
    if (scrollAnchor) {
      scrollAnchor.scrollTo({
        top: scrollAnchor.scrollHeight,
        behavior: 'auto'
      })

    }
  }

  sendMessage = (chatId) => {
    this.props.dispatch({ type: 'SEND_MESSAGE', payload: { input: this.state.input, chatId: chatId } })
    this.setState({ input: '' })

  }

  render() {



    if (this.messagesEnd) {

    }
    const { classes } = this.props;

    let index = this.props.match.params.index
    let chat = this.props.reduxStore.chats[index]

    let chat_id = chat && chat.chat_id
    let active = chat && chat.active

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
        <div className={classes.scroll} id='scroll-anchor'>
          {chat && chat.chat_messages.map((messageData, index) => {
            let message = messageData.message
            let userSpeaking = messageData.username
            let date = messageData.date

            date = moment(date).format('LT, LL')

            let img = messageData.img
            return (
              <Grid item xs={7} key={index} className={classes.message}>
                <Grid container spacing={0} justify='flex-start'>
                  <Avatar src={img}></Avatar>
                  <Paper>
                    {userSpeaking === myUser && active ?
                      <DeleteIcon onClick={() => this.deleteMessage(messageData.id, chat_id)} /> : <p></p>}
                    <Typography>{userSpeaking}: {message}</Typography>
                    <Typography>({date})</Typography>

                  </Paper>
                </Grid>
              </Grid>
            )
          })}
        </div>
        <div ref={this.messagesEndRef}></div>
        <Grid item xs={11} container justify="center">
          {active ?
            <div>
              <Input
                onChange={(event) => { this.handleChangeFor(event, 'input') }}
                placeholder='Send a message'
                value={this.state.input}
                fullWidth />
              <Button onClick={() => { this.sendMessage(chat_id) }}>Send Message</Button>
              <Button onClick={this.goHome}>GO BACK HOME</Button>
            </div> :
            <p></p>}

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