import React from 'react'
import marked from 'marked'
import PropTypes from 'prop-types'

import Avatar from 'material-ui/Avatar'
import { withStyles } from 'material-ui/styles'

import { replyStyle } from './styles'
import formatDate from '../../util/date-format'

const Reply = ({ reply, classes }) => (
  <div className={classes.root}>
    <div className={classes.left}>
      <Avatar src={reply.author.avatar_url} />
    </div>
    <div className={classes.right}>
      <span>{`${reply.author.loginname}  ${formatDate(reply.create_at, 'yyyy-mm-dd')}`}</span>
      <p dangerouslySetInnerHTML={{ __html: marked(reply.content) }} />
    </div>
  </div>

)

Reply.propTypes = {
  reply: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(replyStyle)(Reply)
