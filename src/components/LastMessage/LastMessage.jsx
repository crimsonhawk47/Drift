import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Grid, Typography, Card } from '@material-ui/core'


const LastMessage = (props) => {
    return (
        <Grid item xs={6}>
            <Card>
                <Typography className={props.textStyling}>Last Message: {props.lastMessage}</Typography>
            </Card>
        </Grid>

    )

}

const mapStateToProps = reduxStore => {
    return (
        { reduxStore }
    )
}
export default connect(mapStateToProps)(LastMessage)