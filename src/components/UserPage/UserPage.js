import React from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import { Grid, Typography, Box } from '@material-ui/core'

import { Avatar } from '@material-ui/core'
import { Route, withRouter } from 'react-router-dom'
import ChatList from '../ChatList/ChatList'

// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`


const UserPage = (props) => (

  <div>
    <Grid container spacing={6} alignItems='center'>
      <Grid item xs={1}>
        <Avatar component='span' onClick={() => { props.history.push('/avatar') }} src={props.user.image} />
      </Grid>
      <Grid item xs={2}>
        <Box fontStyle="italic" fontWeight={100} fontSize={21} fontFamily="Roboto">
          <Typography display='inline' variant='p' id="welcome">
            {props.user.username}
          </Typography>
        </Box>
      </Grid>
    </Grid>
    <ChatList />
    {/* <p>Your ID is: {props.user.id}</p> */}
    <LogOutButton className="log-in" />
  </div >
);

// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

// this allows us to use <App /> in index.js
export default withRouter(connect(mapStateToProps)(UserPage));
