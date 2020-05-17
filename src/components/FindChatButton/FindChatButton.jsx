import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Grid, Typography, Button } from '@material-ui/core'


const FindChatButton = (props) => {

    const findChat = () => {
        this.props.dispatch({
            type: 'FIND_CHAT',
            payload: this.props.history,
        })
    }

    return (
        <Grid item xs={4}>
            <Button variant="contained" onClick={() => { this.findChat() }}>FIND CHAT</Button>
        </Grid>

    )

}

const mapStateToProps = reduxStore => {
    return (
        { reduxStore }
    )
}
export default connect(mapStateToProps)(FindChatButton)