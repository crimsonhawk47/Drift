import React from 'react';
import { connect } from 'react-redux';

import { Route, withRouter } from 'react-router-dom'
import ChatList from '../ChatList/ChatList'
import UserHeaderDisplay from '../UserHeaderDisplay/UserHeaderDisplay'

// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`


const UserPage = (props) => (

  <div>
    <UserHeaderDisplay />
    <ChatList />
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
