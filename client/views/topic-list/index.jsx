import React from 'react'
import Helmet from 'react-helmet'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import cx from 'classnames'

import List from 'material-ui/List'
import ListItem from 'material-ui/List/ListItem'
import ListItemAvatar from 'material-ui/List/ListItemAvatar'
import ListItemText from 'material-ui/List/ListItemText'
import Tabs, { Tab } from 'material-ui/Tabs'
import { CircularProgress } from 'material-ui/Progress'

import Avatar from 'material-ui/Avatar'

import { withStyles } from 'material-ui/styles'


import {
  topicPrimaryStyle,
  topicSecondaryStyle,
} from './styles'

import { tabs } from '../../util/variable-define'
import Container from '../components/container'
import formatDate from '../../util/date-format'
// import TopicListItem from './list-item'
// import { AppState, TopicStore } from '../../store/store';

const getTab = (tab, isTop, isGood) => {
  return isTop ? '置顶' : (isGood ? '精品' : tab) || '求助' // eslint-disable-line
}

/* eslint-disable */
const TopicPrimary = (props) => {
  const topic = props.topic
  const classes = props.classes
  const isTop = topic.top
  const isGood = topic.good
  const classNames = cx([classes.tab, isTop ? classes.top : '', isGood ? classes.good : ''])
  return (
    <div className={classes.root}>
      <span
        className={classNames}
      >
        {getTab(tabs[topic.tab], isTop, isGood)}
      </span>
      <span>{topic.title}</span>
    </div>
  )
}


const TopicSecondary = ({ classes, topic }) => (
  <span className={classes.root}>
    <span className={classes.userName}>{topic.author.loginname}</span>
    <span className={classes.count}>
      <span className={classes.accentColor}>{topic.reply_count}</span>
      <span>/</span>
      <span>{topic.visit_count}</span>
    </span>
    <span>创建时间: {formatDate(topic.create_at, 'yyyy-mm-dd HH:mm:ss')}</span>
  </span>
)

TopicPrimary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

TopicSecondary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

const StyledTopicPrimary = withStyles(topicPrimaryStyle)(TopicPrimary)
const StyledTopicSecondary = withStyles(topicSecondaryStyle)(TopicSecondary)


@inject(stores => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
    user: stores.appState.user,
  }
}) @observer
class TopicList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.changeTab = this.changeTab.bind(this)
    this.fetchTopic = this.fetchTopic.bind(this)
  }

  componentDidMount() {
    this.fetchTopic()
    this.refs.scroller.addEventListener('touchstart', event => {
      console.log('touchstart')
    }, false);
    this.refs.scroller.addEventListener('touchmove', event => {
      console.log('touchmove')
    }, false);
    this.refs.scroller.addEventListener('touchend', event => {
      console.log('touchend')
    }, false);
    this.refs.scroller.addEventListener('mousedown', event => {
      console.log('mousedown')
    }, false);
    this.refs.scroller.addEventListener('mousemove', event => {
      console.log('mousemove')
    }, false);
    this.refs.scroller.addEventListener('mouseup', event => {
      console.log('mouseup')
    }, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.fetchTopic(nextProps.location)
    }
  }

  asyncBootstrap() {
    const query = queryString.parse(this.props.location.search)
    const tab = query.tab
    return this.props.topicStore.fetchTopics(tab || 'all').then(() => {
      return true
    }).catch(() => {
      // console.log(err)
      return false
    })
  }

  fetchTopic(location) {
    location = location || this.props.location
    const query = queryString.parse(location.search)
    const tab = query.tab || 'all'
    this.props.topicStore.fetchTopics(tab)
  }

  changeTab(e, value) {
    this.context.router.history.push({
      pathname: '/index',
      search: `?tab=${value}`
    })
  }

  goToTopic(topic) {
    this.context.router.history.push(`/detail/${topic.id}`)
  }

  render() {
    const topics = this.props.topicStore.topics
    const syncing = this.props.topicStore.syncing
    const query = queryString.parse(this.props.location.search)
    const tab = query.tab
    const tabValue = tab || 'all'

    return (
      <Container>
        <Helmet>
          <title>话题列表</title>
        </Helmet>
        <div>
          <Tabs value={tabValue} onChange={this.changeTab}>
            {
              Object.keys(tabs).map(t => <Tab key={t} label={tabs[t]} value={t} />)
            }
          </Tabs>
        </div>
        <div ref="scroller">
          <List>
            {
                topics.map(topic => {
                  return (
                    <ListItem button key={topic.id} onClick={() => this.goToTopic(topic)}>
                      <ListItemAvatar>
                        <Avatar src={topic.author.avatar_url} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<StyledTopicPrimary topic={topic} />}
                        secondary={
                          <StyledTopicSecondary topic={topic} />}
                      />
                    </ListItem>
                  )
                })
            }
          </List>
        </div>
        {
          syncing ?
            (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '40px 0',
                }}
              >
                <CircularProgress color="secondary" size={100} />
              </div>
            ) :
            null
        }
      </Container>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  topicStore: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}

export default TopicList
