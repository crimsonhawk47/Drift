import React, { Component } from 'react';
import { Grid, Typography, Input, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import SendIcon from '@material-ui/icons/Send';
import { connect } from 'react-redux'
import moment from 'moment'
import Message from '../Message/Message'
import SendMessage from '../SendMessage/SendMessage'

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
            return <Message key={index} messageData={messageData} />
          })}
        </div>

        <div></div>
        <Grid item xs={11} container justify="center">
          {active ?
            <SendMessage chat_id={chat_id} /> :
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