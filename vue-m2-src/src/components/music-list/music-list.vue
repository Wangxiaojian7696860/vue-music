<template>
   <div class="music-list">
 		<div class="back" @click="back">
		  <i class="icon-back"><</i>
		</div> 
		<h1 class="title" v-html="title"></h1>
		<div class="bg-image" ref="bgImage" :style="bgStyle">
		     <div class="play-wrapper">
			      <div ref="playBtn" class="play" @click="random" v-show="songs.length>0">
					    <span class="text">随机播放全部</span>
				  </div>			 
			 </div>
			 <div class="filter" ref="filter"></div>
		</div>
		<div class="bg-layer" ref="layer"></div>
		<scroll :data="songs" :jianting="listenScroll" :probe-type="probeType" @scroll="scroll" class="list" ref="list">
		   <div class="song-list-wrapper">
			    <song-list :songs="songs" @select = "selectItem"></song-list>
		   </div>		        
		</scroll>  
   </div>
</template>
<script>
import scroll from "../../base/scroll/scroll1.vue"
import SongList from '../../base/song-list/song-list'
import {mapActions} from 'vuex'
const RESERVED_HEIGHT = 40
export default{
    props:{
	    title:{
		    type:String,
			default:''
		},
		bgImage:{
		    type:String,
			default:''		
		},
		songs:{
		    type:Array,
			default:[]
		}
	},
	 data(){
	     return{
		    probeType:3,
			listenScroll:true,
			scrollY: 0
		 }
	 },
	methods:{
	   back(){
	      this.$router.go(-1)
	   },
	   random(){
			this.randomPlay({
			  list: this.songs
			})	   
	   },
	   getTop(){
	       this.imageHeight = document.querySelector('.bg-image').offsetHeight+1;
		   this.$refs.list.$el.style.top = this.imageHeight+"px";
           this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
	   },
	   scroll(pos){
	       this.scrollY = pos.y 
	   },
	   selectItem(song,index){
	       console.log(0)
		   this.$store.dispatch('selectPlay',{list:this.songs,index})
	       //this.selectPlay({list:this.songs,index})
	   },
	   ...mapActions(['selectPlay','randomPlay'])
	},
	mounted(){
		this.getTop()
		//on也可以挂在组件上面用@scroll 代替下面
/*        this.$refs.list.$on('scroll',function(){
		   console.log('gundong')
		})*/
	},
	computed:{
	   bgStyle(){
	       return 'background-image: url('+this.bgImage+');'
	   }
	},
	components:{
	   scroll,
	   SongList
	},
	watch:{
	   scrollY(newVal){
	      var translateY = Math.max(this.minTransalteY,newVal);
		  let zIndex = 0;
		  var blur = 0;
		  let scale = 1
		  var pesent = Math.abs(newVal/this.imageHeight);
		  if(newVal>0){
              scale = 1+ pesent;
			  zIndex = 10;
		  }else{
		     blur = Math.min(2,2*pesent)
		  }
		  
		  if (newVal < this.minTransalteY) {
		      zIndex = 10;
			  this.$refs.bgImage.style.paddingTop = 0
			  this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
			  this.$refs.playBtn.style.display = 'none'			  
		  }else {
			  this.$refs.bgImage.style.paddingTop = '70%'
			  this.$refs.bgImage.style.height = 0
			  this.$refs.playBtn.style.display = ''
		  }	
		  this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
		  this.$refs.bgImage.style.filter = `blur(${blur}px)`	
		  this.$refs.bgImage.style.transform = `scale(${scale})`
		  this.$refs.bgImage.style.zIndex = zIndex
	   }
	}
}
</script>
<style lang="scss" scoped>
@import "../../common/css/variable";
@import "../../common/css/mixin";   
.music-list{
	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: $color-background;
	.back{
      position:absolute;
      top: 0;
      left: 6px;
      z-index: 50;
	  .icon-back{
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
	  }		
	
	}
	.title{
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
	}
	.bg-image{
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
	  .play-wrapper{
         position: absolute;
         bottom: 20px;
         width: 100%;
		 z-index:1;
		 .play{
            box-sizing: border-box;
              width: 135px;
              padding: 7px 0;
              margin: 0 auto;
			  text-align: center;
			  border: 1px solid $color-theme;
			  color: $color-theme;
			  border-radius: 100px;
			  font-size: 0;	
			  .icon-play{
                 display: inline-block;
                 vertical-align: middle;
                 margin-right: 6px;
                  font-size: $font-size-medium-x;
		       }	
			  .text{
				display: inline-block;
				vertical-align: middle;
				font-size: $font-size-small;
			  }		 
		 } 
	  }
	  .filter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
	  }	
	} 
	.list{
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: $color-background;
	  .song-list-wrapper{
        padding: 20px 30px
	  }		
	}
    .bg-layer{
      position: relative;
      height: 100%;	  
      background: $color-background;
	}  
	
}	
</style>