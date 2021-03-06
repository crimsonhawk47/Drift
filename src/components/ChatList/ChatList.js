import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Paper, Grid, Typography, Button, Avatar, Box, Card } from '@material-ui/core'
import ListClock from '../ListClock/ListClock'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import moment from 'moment'

import FindChatButton from '../FindChatButton/FindChatButton'
import LastMessage from '../LastMessage/LastMessage'
import ListProfile from '../ListProfile/ListProfile'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  findChat: {
    marginTop: '30px'
  },
  lastMessage: {
    wordWrap: 'break-word',
    minHeight: '50px',
    margin: '8px'
  },
  timeLeft: {
    margin: '8px',
    fontSize: '14px'

  },
  username: {
    wordWrap: 'break-word'
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  }
});


class ChatList extends Component {


  goToChat = (index) => {
    this.props.history.push(`/chat/${index}`)
  }

  render() {
    const { classes } = this.props;
    const chats = this.props.chats
    return (

      <Grid container className={classes.root} spacing={5} justify='center'>
        <FindChatButton buttonStyling={classes.findChat} />
        {chats.map((chat, index) => {

          const messages = chat.chat_messages;
          const lastMessage = messages[messages.length - 1].message

          return (
            <Grid item xs={12} key={index} onClick={() => { this.goToChat(index) }}>
              <Box marginLeft={2}>
                <Grid container>
                  <ListProfile chat={chat} textStyling={classes.username} />
                  <LastMessage textStyling={classes.lastMessage} lastMessage={lastMessage} />
                  <ListClock chat={chat} timeTextStyling={classes.timeLeft} />
                </Grid>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    )
  }
}

const mapStateToProps = (reduxStore) => {
  return ({
    chats: reduxStore.chats,
    user: reduxStore.user
  })
}


export default withRouter(withStyles(styles)(connect(mapStateToProps)(ChatList)))




