import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Paper, Grid, Typography, Button, Avatar, Box, Card } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import moment from 'moment'

import FindChatButton from '../FindChatButton/FindChatButton'

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

  // findChat = () => {
  //   this.props.dispatch({
  //     type: 'FIND_CHAT',
  //     payload: this.props.history,
  //   })
  // }

  render() {
    const { classes } = this.props;
    let chats = this.props.reduxStore.chats
    let myUser = this.props.reduxStore.user.username
    return (

      <Grid container className={classes.root} spacing={5} justify='center'>
        <FindChatButton buttonStyling={classes.findChat} />
        

        {chats.map((chat, index) => {

          let user1 = chat.participants[0]
          let user2 = chat.participants[1]
          let active = chat.active
          let messages = chat.chat_messages;
          let chat_date = chat.chat_date
          let lastMessage = messages[messages.length - 1].message
          let timeLeft = 24 - Number(moment().diff(chat_date, 'hours'))
          let partnerAvatar;
          for (let message of chat.chat_messages) {
            console.log(message);

            if (message.username !== myUser && message.username !== 'kenbot') {
              partnerAvatar = message.img
              console.log(`logging message.img`);

              console.log(message.img);
              break;
            }
          }
          return (
            <Grid item xs={12} key={index} onClick={() => { this.goToChat(index) }}>
              <Box marginLeft={2}>
                <Grid container>
                  <Grid container item xs={3}>
                    <Grid container justify='center' alignItems='center'>
                      <Grid item xs={12}>
                        <Avatar src={partnerAvatar} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className={classes.username}>
                          {myUser === user1 ? user2 : user1}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <Typography className={classes.lastMessage}>Last Message: {lastMessage}</Typography>
                    </Card>
                  </Grid>

                  <Grid item container alignItems='center' xs={3}>
                    <Typography className={classes.timeLeft}>{active ? timeLeft + ' Hours Left' : 'Goodbye, friend!'}</Typography>
                  </Grid>

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
    reduxStore
  })
}


export default withRouter(withStyles(styles)(connect(mapStateToProps)(ChatList)))




