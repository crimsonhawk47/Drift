import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography, Box } from '@material-ui/core'


class LoginPage extends Component {
  state = {
    username: '',
    password: '',
  };

  login = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'LOGIN',
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  } // end login

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        {this.props.errors.loginMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.loginMessage}
          </h2>
        )}
        <Box textAlign='center'>
          <form onSubmit={this.login} style={{ padding: '85px', width: 'auto', paddingBottom: '12px' }}>
            <Box fontWeight={300} fontFamily="Roboto" fontSize={24} margin='20px'>
              <Typography variant='p'>Login</Typography>
            </Box>
            <Box fontWeight={300} fontFamily="Roboto" fontSize={19}>

              <div>
                <label htmlFor="username">
                  Username:
              <input
                    type="text"
                    name="username"
                    value={this.state.username}
                    onChange={this.handleInputChangeFor('username')}

                  />
                </label>

              </div>
              <div>
                <label htmlFor="password">
                  Password:
              <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleInputChangeFor('password')}
                  />
                </label>
              </div>
              <div>
                <input
                  className="log-in"
                  type="submit"
                  name="submit"
                  value="Log In"
                />
              </div>
            </Box>


          </form>
        </Box>
        <center>
          <button
            type="button"
            className="link-button"
            onClick={() => { this.props.dispatch({ type: 'SET_TO_REGISTER_MODE' }) }}
          >
            Register
          </button>
        </center>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(LoginPage);
