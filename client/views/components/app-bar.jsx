import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import {
  inject,
  observer,
} from 'mobx-react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'
import Typography from 'material-ui/Typography'
import EditIcon from 'material-ui-icons/Edit'
import Avatar from 'material-ui/Avatar'


const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  button: {
    marginRight: 10,
  },
}

@inject(stores => {
  return {
    user: stores.appState.user,
  }
}) @observer
class MainAppBar extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.goToIndex = this.goToIndex.bind(this)
    this.goToUser = this.goToUser.bind(this)
    this.goToCreate = this.goToCreate.bind(this)
  }

  goToUser() {
    const { location } = this.props
    if (location.pathname !== '/user/login') {
      if (this.props.user.isLogin) {
        this.context.router.history.push('/user/info')
      } else {
        this.context.router.history.push('/user/login')
      }
    } else {
      this.context.router.history.push({
        pathname: '/user/login',
        search: `?from=${location.pathname}`,
      })
    }
  }

  goToCreate() {
    this.context.router.history.push('/topic/create')
  }

  goToIndex() {
    this.context.router.history.push('/')
  }

  render() {
    const {
      classes,
      user,
    } = this.props
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu" onClick={this.goToIndex}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              中文社区CNode
            </Typography>
            {
              user.isLogin ?
                <Button variant="fab" mini color="inherit" aria-label="edit" onClick={this.goToCreate} className={classes.button}>
                  <EditIcon />
                </Button> :
                null
            }
            <Button mini color="inherit" onClick={this.goToUser}>
              { user.isLogin ? <Avatar
                alt={user.info.loginname || user.info.loginName}
                src={user.info.avatar_url || user.info.avatarUrl}
              /> : '登录' }
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}


MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

MainAppBar.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
}

export default withStyles(styles)(MainAppBar)
