<template>
    <div class="singer">
	     <list-view :singers="singers" @s="selectSinger"></list-view>
		 <router-view></router-view>
	</div>
</template>
<script>
import ListView from '../../base/listview/listview.vue'
import {mapMutations} from 'vuex'

const HOT_SINGER_LEN = 5
export default{
   data(){
     return{
	    singers:[]
	 }
   },
   created(){
	   this._getSingerList();
   },   
   methods:{
     _getSingerList(){
		 this.$http.get("https://wangxiaojian7696860.github.io/cao/static/data/singers.data").then((res)=>{		    
			this.singers = this._normaLizeSinger(res.data)
		 }).catch((err)=>{
			console.log(err)
		 })	 
	 },
	 _normaLizeSinger(list){
	     var ret1 = [];
		 var ret2 = [];
		 var itemobj = {
		     "hot":{
			    "name":"热点",
				"items":[]
			 }
		 }
		 list.forEach((item,index)=>{
		    if(index<HOT_SINGER_LEN){
			   itemobj.hot.items.push({name:item.Fsinger_name,id:item.Fsinger_mid,avtar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`})
			}
			
			if(!itemobj[item.Findex]){
				  itemobj[item.Findex] = {
				      "name":"",
					  "items":[]
				   }
			}
			itemobj[item.Findex].name = item.Findex;
			itemobj[item.Findex].items.push({name:item.Fsinger_name,id:item.Fsinger_mid,avtar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`})						
		 })
		 
		for(var item in itemobj){
		    if(itemobj[item].name == "热点"){
			   ret1.push(itemobj[item])
			}else{
			   ret2.push(itemobj[item])
			}
		}
         
		 ret2.sort(function(a,b){
		     return a.name.charCodeAt(0) - b.name.charCodeAt(0)
		 })
		 
		 return ret1.concat(ret2)
		 
	 },
	 selectSinger(singer){
		  this.$router.push({
			   path:`/singer/${singer.id}`
		  })
	      this.setSinger(singer)
	 },
	 ...mapMutations({
	     setSinger:"SET_SINGER"
	  })
   },
   computed:{

   },
   components:{
      ListView
   }
}
</script>
<style lang="scss" scoped>
.singer{
     position:fixed;
	 top:89px;
	 bottom:0;
	 width:100%;
	 
}
</style>