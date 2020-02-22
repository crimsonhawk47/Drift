import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Paper, Grid, Typography, Button } from '@material-ui/core'
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


            return (
              <Grid item key={index}>
                <Paper elevation={5} key={index} onClick={() => { this.goToChat(index) }}>
                  <Typography >
                    Chatting with {myUser === user1 ? user2 : user1}
                  </Typography>
                  <Typography>Last Message: {lastMessage}</Typography>
                </Paper>
              </Grid>
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




