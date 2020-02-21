import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Grid, Typography } from '@material-ui/core'


const styles = theme => ({
  root: {
    flexGrow: 1,
  }
});

class Loading extends Component {
  //Will run if reduxUpdates
  componentDidUpdate() {
    this.props.history.push('/home')
  }



  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.root}>
        <Typography >
          Loading...
        </Typography>
      </Grid>
    )

  }
}

const mapStateToProps = reduxStore => {
  return (
    { reduxStore }
  )
}

export default withStyles(styles)(connect(mapStateToProps)(Loading))