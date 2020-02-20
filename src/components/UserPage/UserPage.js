import React from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import { Avatar } from '@material-ui/core'
import { Route, withRouter } from 'react-router-dom'
import ChatList from '../ChatList/ChatList'

// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`
const findChat = (props) => {
  props.dispatch({
    type: 'FIND_CHAT'
  })
  props.history.push('/loading')
}

const UserPage = (props) => (

  <div>
    <h1 id="welcome">
      <Avatar onClick={() => { props.history.push('/avatar') }} src={props.user.image} />Welcome, {props.user.username}!
    </h1>
    <ChatList />
    <button onClick={() => { findChat(props) }}>FIND CHAT</button>
    <p>Your ID is: {props.user.id}</p>
    <LogOutButton className="log-in" />
  </div>
);

// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

// this allows us to use <App /> in index.js
export default withRouter(connect(mapStateToProps)(UserPage));
