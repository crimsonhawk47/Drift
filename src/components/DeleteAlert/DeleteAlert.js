import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Grid, Typography, Button, DialogTitle, Dialog, DialogContentText, DialogContent, DialogActions } from '@material-ui/core'


const styles = theme => ({
  root: {
    flexGrow: 1,
  }
});

class DeleteAlert extends Component {

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

  render() {
    const { classes } = this.props;

    return (
      <>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClickClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this message?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This message will be removed for both you and your chat partner
             </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClickClose}>
              Nevermind
            </Button>
            <Button onClick={() => {this.props.handleClickClose()
                                    this.props.deleteMessage()}} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )

  }
}

const mapStateToProps = reduxStore => {
  return (
    { reduxStore }
  )
}
export default withStyles(styles)(connect(mapStateToProps)(DeleteAlert))