import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Paper, Grid, Typography, Button, Avatar, Box, Card } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  findChat: {
    marginTop: '30px'
  }
});


class ChatList extends Component {


  goToChat = (index) => {
    this.props.history.push(`/chat/${index}`)
  }

  findChat = () => {
    this.props.dispatch({
      type: 'FIND_CHAT'
    })
    this.props.history.push('/loading')
  }

  render() {
    const { classes } = this.props;
    let chats = this.props.reduxStore.chats
    let myUser = this.props.reduxStore.user.username
    return (
      <div>
        <Grid container className={classes.root} spacing={5} justify='center' direction='column' alignItems='stretch'>
          {chats.map((chat, index) => {

            let user1 = chat.participants[0]
            let user2 = chat.participants[1]
            let messages = chat.chat_messages;
            let lastMessage = messages[messages.length - 1].message
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
              <Box margin={4} marginRight={9}>
                <Grid item key={index} onClick={() => { this.goToChat(index) }}>
                  <Card>
                    <Box marginLeft={2}>
                      <Grid container spacing={7}>
                        <Grid item xs={2}>
                          <Avatar src={partnerAvatar}></Avatar>
                          <Typography >
                            {myUser === user1 ? user2 : user1}
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <Typography xs={2}>Last Message: {lastMessage}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              </Box>

            )
          })}

        </Grid>
        <Button className={classes.findChat} onClick={() => { this.findChat() }}>FIND CHAT</Button>
      </div>


    )

  }
}

const mapStateToProps = (reduxStore) => {
  return ({
    reduxStore
  })
}


export default withRouter(withStyles(styles)(connect(mapStateToProps)(ChatList)))




