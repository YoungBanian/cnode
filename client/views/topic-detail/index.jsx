import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'
import Helmet from 'react-helmet'
import {
  inject,
  observer,
} from 'mobx-react'

import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import IconReply from 'material-ui-icons/Reply'
import { CircularProgress } from 'material-ui/Progress'

import SimpleMDE from '../../components/simple-mde'

import Container from '../components/container'

import { TopicStore } from '../../store/topic-store'
import { topicDetailStyle } from './styles'

import Reply from './reply'
import formatDate from '../../util/date-format'

@inject((stores) => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
  }
}) @observer
class TopicDetail extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      newReply: '',  // eslint-disable-line
      showEditor: false,  // eslint-disable-line
    }
    this.handleNewReplyChange = this.handleNewReplyChange.bind(this)
    this.goToLogin = this.goToLogin.bind(this)
    this.handleReply = this.handleReply.bind(this)
  }

  componentDidMount() {
    const id = this.props.match.params.id  // eslint-disable-line
    this.props.topicStore.getTopicDetail(id).catch(err => {
      console.log('detail did mount error:', err) // eslint-disable-line
    })
    setTimeout(() => {
      this.setState({
        showEditor: true,  // eslint-disable-line
      })
    }, 1000)
  }

  getTopic() {
    const id = this.props.match.params.id // eslint-disable-line
    return this.props.topicStore.detailsMap[id]
  }

  asyncBootstrap() {
    console.log('topic detail invoked') // eslint-disable-line
    const id = this.props.match.params.id
    return this.props.topicStore.getTopicDetail(id).then(() => {
      return true
    }).catch((err) => {
      throw err
    })
  }

  handleNewReplyChange(value) {
    this.setState({
      newReply: value,
    })
  }

  goToLogin() {
    this.context.router.history.push('/user/login')
  }

  handleReply() {
    // do reply here
    const that = this
    this.getTopic().doReply(this.state.newReply)
      .then(() => {
        that.setState({
          newReply: '',
        })
        that.props.appState.notify({ message: '评论成功' })
      })
      .catch(() => {
        that.props.appState.notify({ message: '评论失败' })
      })
    // axios.post('/api/')
  }

  render() {
    const topic = this.getTopic()
    // console.log(topic.replies) // eslint-disable-line
    const {
      classes,
    } = this.props
    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="inherit" />
          </section>
        </Container>
      )
    }
    const createdReplies = topic.createdReplies
    const user = this.props.appState.user
    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>

        {
          createdReplies && createdReplies.length > 0 ?
            (
              <Paper elevation={4} className={classes.replies}>
                <header className={classes.replyHeader}>
                  <span> 我的最新回复</span>
                </header>
                {
                  createdReplies.map(reply => {
                    return (
                      <Reply
                        reply={Object.assign({}, reply, {
                          author: {
                            avatar_url: user.info.avatar_url || user.info.avatarUrl,
                            loginname: user.info.loginname || user.info.loginName,
                          },
                        })}
                        key={reply.id}
                      />
                    )
                  })
                }
              </Paper>
            ) :
            null
        }

        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} 回复`}</span>
            <span>{`最新回复 ${formatDate(topic.last_reply_at, 'yyyy-m-dd HH:mm:ss')}`}</span>
          </header>
          {
            (this.state.showEditor && user.isLogin) &&
            <section className={classes.replyEditor}>
              <SimpleMDE
                onChange={this.handleNewReplyChange}
                value={this.state.newReply}
                options={{
                  toolbar: false,
                  autoFocus: true,
                  spellChecker: false,
                  placeholder: '添加你的精彩回复',
                }}
              />
              <Button variant="raised" color="primary" onClick={this.handleReply} className={classes.replyButton}>
                <IconReply />
              </Button>
            </section>
          }
          {
            !user.isLogin ?
              (
                <section className={classes.notLoginButton}>
                  <Button color="secondary" onClick={this.goToLogin}>登录进行回复</Button>
                </section>
              ) :
              null
          }
          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
        </Paper>
      </div>
    )
  }
}

TopicDetail.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired, // eslint-disable-line
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
}

TopicDetail.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(topicDetailStyle)(TopicDetail)
