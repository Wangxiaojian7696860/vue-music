import {commonParams} from './config'
import axios from 'axios'

export function getSongList(disstid) {
  const url = '/api/getSongList'

 const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
	format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
	  //console.log(res.data)
      return Promise.resolve(res.data)
  })
}