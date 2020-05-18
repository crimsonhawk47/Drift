import React from 'react';
import { Grid, Typography } from '@material-ui/core'
import moment from 'moment'

const ListClock = (props) => {
    const active = props.chat.active
    const chat_date = props.chat.chat_date
    let timeLeft = 24 - Number(moment().diff(chat_date, 'hours'))
    return (
        <Grid item container alignItems='center' xs={3}>
            <Typography className={props.timeTextStyling}>{active ? timeLeft + ' Hours Left' : 'Goodbye, friend!'}</Typography>
        </Grid>
    )
}

export default ListClock