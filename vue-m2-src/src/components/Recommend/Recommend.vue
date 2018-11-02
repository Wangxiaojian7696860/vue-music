<template>
   <div class="recommend">
    <scroll class="recommend-scroll" :data="discList" ref="scroll">
	    <div>
			<slider v-if="recommends.length" class="slider-wrapper">
			   <div class="slider-item" v-for="item in recommends">
					 <a :href="item.linkUrl">
						<img @load="loadImage" :src="item.picUrl">
					 </a>
			   </div>
			</slider>	
			 <div class="recommend-list">
				  <h1 class="list-title">热门歌单推荐</h1>
				  <ul>
					  <li class="item" @click="selectItem(item)" v-for="item in discList">
						  <div class="icon">
							   <img width="60" height="60" :src="item.avtar">
						  </div>
						  <div class="text">
							   <h2 class="name" v-html="item.name"></h2>
							   <p class="desc"  v-html="item.descname"></p>					  
						  </div>
					  </li>
				  </ul>
			 </div>
		 </div>
	</scroll>
	<router-view></router-view>
   </div>
</template>
<script>
import Slider from '../../base/slider/slider'
import Scroll from '../../base/scroll/scroll'
import {getRecommend,getDiscList} from "../../api/recommend"
import {ERR_OK} from "../../api/config"
import {mapMutations} from 'vuex'
export default{
    data(){
	   return{
	      discList: [],
	      recommends: [],
		  imgload:true
	   }
	},
    created(){
	    this._getRecommend();
		this._getDiscList()
	},	
    methods:{
	    _getRecommend(){
		   var _this = this;
		   getRecommend().then(function(res){
		        if(res.code == ERR_OK){
				   _this.recommends = res.data.slider
				  
				} 
		   })
		   
		},
		_getDiscList(){			
			 this.$http.get("https://wangxiaojian7696860.github.io/cao/static/data/singers.data").then((res)=>{		    
				this.discList = this._normaLizeSinger(res.data)
			 }).catch((err)=>{
				console.log(err)
			 })	 			
		},		
	    _normaLizeSinger(list){
	      var ret1 = [];
		   list.forEach((item,index)=>{
		        ret1.push({name:item.Fsinger_name,descname:`这里是${item.Fsinger_name}的歌曲列表，欢迎您收听！`,dissid:item.Fsinger_mid,avtar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`})
		   })
		   return ret1
	    },		
		selectItem(item){
			this.$router.push({
			  path: `/recommend/${item.dissid}`
			})
		   this.setDisc(item)
		},
		loadImage(){
		   if(this.imgload){
		      this.imgload = false;
			  this.$refs.scroll.refresh()
		   }
		},
		...mapMutations({
		  setDisc: 'SET_DISC'
	   })		
	},
    components: {
	    Slider,
		Scroll
	}
}
</script>
<style lang="scss" scoped>
@import "../../common/css/variable";	
.recommend{
    position: fixed;
    width: 100%;
	overflow:hidden;
    top: 89px;
    bottom: 0;
	.recommend-scroll{ height:100%;overflow: hidden;
	  .slider-wrapper{
        width: 100%;
        overflow: hidden;	
	 }
	  .recommend-list{
	    .list-title{
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-theme;		    
		}
		.item{
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;
		  .icon{
		     flex:0 0 60px;
			 width:60px;
			 padding-right: 20px;
		  }
		  .text{
		     flex: 1;
             line-height: 20px;
             overflow: hidden;
             font-size: $font-size-medium;	
            .name{
              margin-bottom: 10px;
              color: $color-text;
			 }
            .desc{
              color: $color-text-d;
			}			 		 
		  }		
		}
	 }
    }
}
</style>