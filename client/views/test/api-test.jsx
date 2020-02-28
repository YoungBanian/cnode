import React from 'react'
import axios from 'axios'
/* eslint-disable */
export default class ApiTest extends React.Component {

  getTopics() {
    axios.get('/api/topics')
    .then(resp => {
      console.log(resp)
    })
    .catch(err => console.log(err))
  }

  login() {
    axios.post('/api/user/login', {
      accessToken: '7e3322b9-ab60-4b19-a614-cb4d1dfa9460'
    })
    .then(resp => console.log(resp))
    .catch(err => console.log(err))
  }

  markAll() {
    axios.post('/api/message/mark_all?needAccessToken=true')
    .then(resp => console.log(resp))
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <button onClick={this.getTopics}>topics</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.markAll}>markAll</button>
      </div>
    )
  }
}


/* eslint-undisable */
