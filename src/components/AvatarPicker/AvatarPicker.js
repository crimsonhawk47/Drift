import React, { Component } from 'react';
import { connect } from 'react-redux'
class AvatarPicker extends Component {

  changeAvatar = (url) => {
    console.log(url);
    this.props.dispatch({
      type: 'CHANGE_AVATAR',
      payload: url
    })
    this.props.history.push('/home')


  }

  render() {
    let arrayOfImages = ['./profile2.jpeg', './profileIcon.png', './download.jpeg', './male_beard.png']
    return (
      <div>
        <h1>Pick an Avatar</h1>
        {arrayOfImages.map(imageUrl => {
          return <div onClick={() => { this.changeAvatar(imageUrl) }}>
            <img src={imageUrl} />
          </div>
        })}

      </div>
    )

  }
}


export default connect()(AvatarPicker)