import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Grid, Typography, Input, Button, Avatar, Box } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/Delete'
import DeleteAlert from '../DeleteAlert/DeleteAlert'


import moment from 'moment'


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  message: {
    margin: '10px',
  },
  date: {
    fontSize: '12px',
    fontStyle: 'italic'
  },
  messageBox: {
    marginLeft: '9px'
  },
  justifyTest: {
    justifyContent: 'center'
  },
  wordWrap: {
    wordWrap: 'break-word'
  }
});



const Message = (props) => {

  const [open, setOpen] = React.useState(false)

  const deleteMessage = (id, chatId) => {
    console.log(`DELETING`);
    props.dispatch({
      type: 'DELETE_MESSAGE',
      payload: { id, chatId }
    })
  }

  const { classes } = props;
  const myUsername = props.user.username
  const indexOfChat = props.match.params.index
  const chat = props.chats[indexOfChat]
  const chat_id = chat && chat.chat_id
  const isChatActive = chat && chat.active
  const messageData = props.messageData
  const messageText = messageData.message
  const messageDate = messageData.date
  const userSpeaking = messageData.username
  const img = messageData.img

  const date = moment(messageDfate).format('LT, LL')

  return (
    <Grid item xs={9} className={classes.message}>
      <DeleteAlert
        open={open}
        setOpen={setOpen}
        deleteMessage={() => { deleteMessage(messageData.id, chat_id) }} />

      <Paper>
        <Grid container>
          <Grid item xs={3} >
            <Grid justify='center' container>
              <Avatar src={img}></Avatar>
            </Grid>
            <Grid justify='center' container>
              {userSpeaking === myUsername && isChatActive ?
                <DeleteIcon color="action" fontSize="small" onClick={() => setOpen(true)} /> : <p></p>}
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Typography className={classes.wordWrap}>{messageText}</Typography>
            <Typography className={classes.date}>{date}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )

}

const mapStateToProps = reduxStore => {
  return (
    {
      chats: reduxStore.chats,
      user: reduxStore.user
    }
  )
}
export default withRouter(withStyles(styles)(connect(mapStateToProps)(Message)))