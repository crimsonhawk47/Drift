import React, { Component } from 'react';
import { Grid, Typography, Input, Button, Box } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import SendIcon from '@material-ui/icons/Send';
import { connect } from 'react-redux'
import moment from 'moment'
import Message from '../Message/Message'
import SendMessage from '../SendMessage/SendMessage'
import ChatMessages from '../ChatMessages/ChatMessages'
import { withRouter } from 'react-router-dom'

const styles = theme => ({

  root: {
    flexGrow: 1,
  },
  scroll: {
    overflow: 'scroll',
    height: '400px',
    margin: '20px',
  },
  timer: {
    margin: '20px',
    marginLeft: '120px'
  },
  partnerText: {
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
    let partner = chat && chat.partner.name;
    if (chat_date) {
      timeLeft = 24 - Number(moment().diff(chat_date, 'hours'))
    }

    return (
      <Grid container className={classes.root} justify='center'>
        <Grid item xs={12}>
          {active ?
            <Typography className={classes.timer}>You have {timeLeft} Hours left!</Typography> :
            <div></div>
          }
        </Grid>
        <Typography className={classes.partnerText}>{partner}</Typography>
        <ChatMessages scrollStyling={classes.scroll} />
        <Grid item xs={11} container justify="center">
          {active ?
            <SendMessage chat_id={chat_id} /> :
            null}
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
export default withRouter(withStyles(styles)(connect(mapStateToProps)(Chat)))