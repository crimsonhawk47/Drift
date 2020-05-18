import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Grid, Typography, Avatar } from '@material-ui/core'


const ListProfile = (props) => {
    let user1 = props.chat.participants[0]
    let user2 = props.chat.participants[1]
    const myUser = props.user
    const partnerAvatar = props.chat.partner.image
    return (
        <Grid container item xs={3}>
            <Grid container justify='center' alignItems='center'>
                <Grid item xs={12}>
                    <Avatar src={partnerAvatar} />
                </Grid>
                <Grid item xs={12}>
                    <Typography className={props.textStyling}>
                        {myUser === user1 ? user2 : user1}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>

    )

}

const mapStateToProps = reduxStore => {
    return (
        { user: reduxStore.user }
    )
}
export default connect(mapStateToProps)(ListProfile)