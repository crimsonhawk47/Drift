import React from 'react';
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

export default LastMessage