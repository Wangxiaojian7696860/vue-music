import originJsonp from 'jsonp'
import {commonParams,options} from './config';
import axios from 'axios';
export function getRecommend(){
	 var url = "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
	 var data = Object.assign({},commonParams,{
			platform:"h5",
			uin:0,
			needNewCode:1
	 });
	 
	 url += (url.indexOf("?") > 0 ? "&" : "?" ) + param(data);
	 return new Promise((resolve, reject) => { 
		 originJsonp(url,options,(err, data)=>{
			  if (!err) {
				resolve(data)
			  } else {
				reject(err)
			  }				  
		 })
    }) 
}

export function getDiscList() {
  const url = '/api/getDiscList'
  //const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}


function param(data){
	var url='';
	for(var key in data){
		let value = data[key] !== undefined ? data[key] : '';
		url += '&'+key+'='+encodeURIComponent(value) ;
	}
	return url ? url.substring(1) : '';
}