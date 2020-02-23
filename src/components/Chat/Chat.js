import React, { Component } from 'react';
import { Paper, Grid, Typography, Input, Button, Avatar, Box } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'
import SendIcon from '@material-ui/icons/Send';
import { connect } from 'react-redux'
import moment from 'moment'
import { Element } from 'react-scroll';

const styles = theme => ({

  root: {
    flexGrow: 1,
  },
  message: {
    margin: '20px'
  },
  scroll: {
    overflow: 'scroll',
    height: '350px',
    margin: '20px'
  },
  timer: {
    margin: '20px'
  },
  date: {
    fontSize: '12px',
    fontStyle: 'italic'
  }
});




class Chat extends Component {

  state = {
    input: '',
  }

  componentDidMount() {
    setTimeout(() => {
      let scrollAnchor = document.getElementById("scroll-anchor");
      scrollAnchor.scrollTop = scrollAnchor.scrollHeight
    }, 100)
  }

  goHome = () => {
    this.props.history.push('/home')
  }

  handleChangeFor(event, property) {
    this.setState({
      [property]: event.target.value
    })
  }

  sendMessage = (chatId) => {
    this.props.dispatch({ type: 'SEND_MESSAGE', payload: { input: this.state.input, chatId: chatId } })
    this.setState({ input: '' })
    setTimeout(() => {
      let scrollAnchor = document.getElementById("scroll-anchor");
      scrollAnchor.scrollTop = scrollAnchor.scrollHeight
    }, 180)

  }

  deleteMessage = (id, chatId) => {
    console.log(`DELETING`);
    this.props.dispatch({
      type: 'DELETE_MESSAGE',
      payload: { id, chatId }
    })

  }

  // scrollToBottom = () => {
  //   let scrollAnchor = document.getElementById("scroll-anchor");
  //   if (scrollAnchor) {
  //     scrollAnchor.scrollIntoView({
  //       block: 'end'
  //     });
  //   }
  // }

  keyPress = (event, chat_id) => {
    console.log(event.keyCode);
    if (event.keyCode === 13) {
      this.sendMessage(chat_id)
    }

  }

  typeScroll = () => {
    let inputAnchor = document.getElementById('inputAnchor')
    console.log(inputAnchor);
    setTimeout(() => { inputAnchor.scrollIntoView() }, 1000);

  }


  render() {
    const { classes } = this.props;

    let index = this.props.match.params.index
    let chat = this.props.reduxStore.chats[index]

    let chat_id = chat && chat.chat_id
    let active = chat && chat.active
    let chat_date = chat && chat.chat_date
    let timeLeft;
    if (chat && chat.chat_date) {
      timeLeft = 24 - Number(moment().diff(chat_date, 'hours'))
    }




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
        {active ?
          <Typography className={classes.timer}>You have {timeLeft} Hours left!</Typography> :
          <div></div>
        }
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
                    <Typography className={classes.date}>{date}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            )
          })}
        </div>
        <div></div>
        <Grid item xs={11} container justify="center">
          {active ?
            <div>
              <Input
                onClick={this.typeScroll}
                onChange={(event) => { this.handleChangeFor(event, 'input') }}
                placeholder='Send a message'
                value={this.state.input}
                fullWidth
                multiline
                endAdornment={
                  <SendIcon onClick={() => { this.sendMessage(chat_id) }}>
                    Send Message
                  </SendIcon>
                }
                onKeyDown={(event) => { this.keyPress(event, chat_id) }}
              />
              <Button onClick={this.goHome}>GO BACK HOME</Button>
            </div> :
            <p></p>}
          <div id='inputAnchor'></div>

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