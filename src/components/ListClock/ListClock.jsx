import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Grid, Typography } from '@material-ui/core'
import moment from 'moment'



const ListClock = (props) => {
    const active = props.active
    const chat_date = props.chatDate
    let timeLeft = 24 - Number(moment().diff(chat_date, 'hours'))
    return (
        <Grid item container alignItems='center' xs={3}>
            <Typography className={props.timeTextStyling}>{active ? timeLeft + ' Hours Left' : 'Goodbye, friend!'}</Typography>
        </Grid>
    )
}

const mapStateToProps = reduxStore => {
    return (
        { reduxStore }
    )
}
export default connect(mapStateToProps)(ListClock)