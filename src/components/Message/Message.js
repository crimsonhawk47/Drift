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
    margin: '20px'
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

class Message extends Component {

  state = {
    open: false
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  }

  handleClickClose = () => {
    this.setState({
      open: false
    })
  }

  deleteMessage = (id, chatId) => {
    console.log(`DELETING`);
    this.props.dispatch({
      type: 'DELETE_MESSAGE',
      payload: { id, chatId }
    })
  }

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
        <DeleteAlert
          open={this.state.open}
          handleClickOpen={this.handleClickOpen}
          handleClickClose={this.handleClickClose}
          deleteMessage={() => { this.deleteMessage(messageData.id, chat_id) }} />

        <Grid container spacing={0} justify='flex-start' alignItems='center'>
          <Grid item xs={12}>
            <Paper>
              <Grid container>
                <Grid className={classes.justifyTest} item xs={3} >
                  <Grid justify='center' container>
                    <Avatar src={img}></Avatar>
                  </Grid>
                  <Grid justify='center' container>
                    {userSpeaking === myUser && active ?
                      <DeleteIcon color="action" fontSize="small" onClick={() => this.handleClickOpen()} /> : <p></p>}
                  </Grid>

                </Grid>
                <Grid item xs={9}>
                  {/* <Box marginLeft='16px'> */}
                  <Typography className={classes.wordWrap}>{userSpeaking}: {message}</Typography>
                  <Typography className={classes.date}>{date}</Typography>

                  {/* </Box> */}

                </Grid>
              </Grid>
            </Paper>
          </Grid>
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