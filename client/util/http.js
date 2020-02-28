import axios from 'axios'

const baseUrl = process.env.API_BASE || ''

const queryString = (url, json) => {
  const str = Object.keys(json).reduce((result, key) => {
    result += `${key}=${json[key]}&`
    return result
  }, '')
  return `${url}?${str.substr(0, str.length - 1)}`
}

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(queryString(`${baseUrl}/api${url}`, params))
      .then((resp) => {
        resolve(resp.data)
      }).catch(reject)
  })
}

export const post = (url, params, data) => {
  return new Promise((resolve, reject) => {
    axios.post(queryString(`${baseUrl}/api${url}`, params), data)
      .then((resp) => {
        resolve(resp.data)
      }).catch(reject)
  })
}

export default {
  get,
}
