import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import Snackbar from 'material-ui/Snackbar'

const styles = {
  root: {
    margin: 20,
    marginTop: 80,
  },
}

/* eslint-disable */
const Container = ({ classes, children, snackOpt = {} }) => {
  const { vertical = null, horizontal = null, open = false } = snackOpt;
  return <Paper elevation={4} className={classes.root}>
    {children}
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={this.handleClose}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">I love snacks</span>}
    />
  </Paper>
}
/* eslint-enable */
Container.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
}

export default withStyles(styles)(Container)
