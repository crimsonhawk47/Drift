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

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClickClose = () => {
    setOpen(false)
  }

  const deleteMessage = (id, chatId) => {
    console.log(`DELETING`);
    props.dispatch({
      type: 'DELETE_MESSAGE',
      payload: { id, chatId }
    })
  }

  const { classes } = props;
  let index = props.match.params.index
  let chat = props.chats[index]
  let chat_id = chat && chat.chat_id
  let active = chat && chat.active

  let messageData = props.messageData
  let myUser = props.user.username
  let message = messageData.message
  let userSpeaking = messageData.username
  let date = messageData.date

  date = moment(date).format('LT, LL')

  let img = messageData.img

  return (
    <Grid item xs={9} className={classes.message}>
      <DeleteAlert
        open={open}
        handleClickOpen={handleClickOpen}
        handleClickClose={handleClickClose}
        deleteMessage={() => { deleteMessage(messageData.id, chat_id) }} />

      <Paper>
        <Grid container>
          <Grid item xs={3} >
            <Grid justify='center' container>
              <Avatar src={img}></Avatar>
            </Grid>
            <Grid justify='center' container>
              {userSpeaking === myUser && active ?
                <DeleteIcon color="action" fontSize="small" onClick={() => handleClickOpen()} /> : <p></p>}
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Typography className={classes.wordWrap}>{message}</Typography>
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