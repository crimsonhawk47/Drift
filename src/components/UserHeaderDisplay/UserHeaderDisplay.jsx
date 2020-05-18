import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Grid, Typography, Box } from '@material-ui/core'
import { withRouter } from 'react-router-dom'

import { Avatar } from '@material-ui/core'



const UserHeaderDisplay = (props) => {
    return (
        <Grid container spacing={6} alignItems='center'>
            <Grid item xs={1}>
                <Avatar component='span' onClick={() => { props.history.push('/avatar') }} src={props.user.image} />
            </Grid>
            <Grid item xs={2}>
                <Box fontStyle="italic" fontWeight={100} fontSize={21} fontFamily="Roboto">
                    <Typography display='inline' variant='p' id="welcome">
                        {props.user.username}
                    </Typography>
                </Box>
            </Grid>
        </Grid>

    )

}

const mapStateToProps = reduxStore => {
    return (
        { user: reduxStore.user }
    )
}
export default withRouter(connect(mapStateToProps)(UserHeaderDisplay))