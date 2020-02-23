import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Grid, Typography, Input, Button, Avatar, Box } from '@material-ui/core'
import {withRouter} from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/Delete'

import moment from 'moment'


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  message: {
    margin: '20px'
  },
  date: {
    fontSize: '12px',
    fontStyle: 'italic'
  }
});

class Message extends Component {

  deleteMessage = (id, chatId) => {
    console.log(`DELETING`);
    this.props.dispatch({
      type: 'DELETE_MESSAGE',
      payload: { id, chatId }
    })}

    render() {
      const { classes } = this.props;
      let index = this.props.match.params.index
      let chat = this.props.reduxStore.chats[index]
      let chat_id = chat && chat.chat_id
      let active = chat && chat.active

      let messageData = this.props.messageData
      let myUser = this.props.reduxStore.user.username
      let message = messageData.message
      let userSpeaking = messageData.username
      let date = messageData.date

      date = moment(date).format('LT, LL')

      let img = messageData.img

      return (
        <Grid item xs={7} className={classes.message}>
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

    }
  }

  const mapStateToProps = reduxStore => {
    return (
      { reduxStore }
    )
  }
  export default withRouter(withStyles(styles)(connect(mapStateToProps)(Message)))