import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import { Paper, Grid, Typography, Button, Input } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'


const styles = theme => ({
  root: {
    flexGrow: 1,
  }
});

class SendMessage extends Component {

  state = {
    input: ''
  }

  handleChangeFor(event, property) {
    this.setState({
      [property]: event.target.value
    })
  }

  sendMessage = (chatId) => {
    this.props.dispatch({ type: 'SEND_MESSAGE', payload: { input: this.state.input, chatId: chatId } })
    this.setState({ input: '' })
    setTimeout(() => {
      let scrollAnchor = document.getElementById("scroll-anchor");
      scrollAnchor.scrollTop = scrollAnchor.scrollHeight
    }, 180)
  }

  keyPress = (event, chat_id) => {
    if (event.keyCode === 13) {
      this.sendMessage(chat_id)
    }
  }

  goHome = () => {
    this.props.history.push('/home')
  }

  render() {
    const { classes } = this.props;
    let chat_id = this.props.chat_id
    return (
      <div>
        <Input
          onChange={(event) => { this.handleChangeFor(event, 'input') }}
          placeholder='Send a message'
          value={this.state.input}
          fullWidth
          multiline
          endAdornment={
            <SendIcon onClick={() => { this.sendMessage(chat_id) }}>
              Send Message
            </SendIcon>
          }
          onKeyDown={(event) => { this.keyPress(event, chat_id) }}
        />
        <Button onClick={this.goHome}>GO BACK HOME</Button>
        <div id='inputAnchor'></div>
      </div>
    )

  }
}

export default withRouter(withStyles(styles)(connect()(SendMessage)))