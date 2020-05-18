import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Grid, Typography, Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'



const FindChatButton = (props) => {

    const findChat = () => {
        props.dispatch({
            type: 'FIND_CHAT',
            payload: props.history,
        })
    }

    return (
        <Grid item xs={4}>
            <Button variant="contained" className={props.buttonStyling} onClick={() => { findChat() }}>FIND CHAT</Button>
        </Grid>

    )

}
export default connect()(withRouter(FindChatButton))