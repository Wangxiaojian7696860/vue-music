<template>
    <scroll class="listview" ref="listview" :data="singers" :jianting="listenScroll" :probeType="probeType" @scroll="scroll">
	   <ul>
	      <li class="list-group" v-for="singer in singers" ref="listGroup">
		     <h2 class="list-group-title">{{singer.name}}</h2>
			 <ul>
			    <li class="list-group-item" v-for="item in singer.items" @click="selectItem(item)">
				   <img class="avatar" :src="item.avtar" />
				   <span class="name">{{item.name}}</span>
				</li>
			 </ul>
		  </li>
	   </ul>
	   <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
	        <ul>
			   <li class="item" v-for="(singer,index) in singers" :class="{current: index==currentIndex}" :data-index="index">{{singer.name | shortcut}}</li>			   
			</ul>
	   </div>
	   <div class="list-fixed" ref="listFixed" v-show="fixedTitle">
	        <div class="fixed-title">{{fixedTitle}}</div>
	   </div>
	</scroll>
</template>
<script>
import scroll from '../scroll/scroll'
const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18
export default{
   props:{
      singers:{
	     type:Array,
		 default:[]
	  }
   },
   created() {
      this.listenScroll = true;
	  this.probeType = 3;
   },
   data(){
      return{
	     currentIndex:0,
		 scrollY:0,
		 listHeight:[],
		 diff:-1,
		 touch:{}
	  }
   },
   methods:{
      scroll(pos){
	     this.scrollY = pos.y
	  },
	  _calculateHeight(){
		this.listHeight = []
		const list = this.$refs.listGroup
		let height = 0
		this.listHeight.push(height)
		for (let i = 0; i < list.length; i++) {
		  let item = list[i]
		  height += item.clientHeight
		  this.listHeight.push(height)			
		}
	  },
	  onShortcutTouchStart(ev){
	     var index = ev.target.getAttribute("data-index")
		 this._scrollTo(index)
		 this.touch.index = index
		 this.touch.y1 = ev.changedTouches[0].pageY
		 console.log(this.touch.index)
	  },
	  onShortcutTouchMove(ev){
	      this.touch.y2 = ev.changedTouches[0].pageY
			let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0			
			let anchorIndex = parseInt(this.touch.index) + delta
			
			this._scrollTo(anchorIndex)	
	  },
	  _scrollTo(index){
		    var _this = this;
			if (!index && index !== 0) {
			  return
			}
			if (index < 0) {
			  index = 0
			} else if (index > this.listHeight.length - 2) {
			  index = this.listHeight.length - 2
			}
			this.scrollY = -this.listHeight[index]
			this.$refs.listview.scrollToElement(_this.$refs.listGroup[index],0)
	 },
	 selectItem(item){
	     this.$emit("s",item)
	 }
   },
   filters:{
      shortcut(value){
	      return value.substr(0,1)
	  }
   },
   watch:{
       singers() {
        setTimeout(() => {
          this._calculateHeight();	
        }, 20)	      
	   },
	   scrollY(newY){
	        const listHeight = this.listHeight
			if (newY > 0) {
			  this.currentIndex = 0
			  return
			}

			for (let i = 0; i < listHeight.length - 1; i++) {
			   let height1 = listHeight[i]
			   let height2 = listHeight[i + 1]	

			   if (height2 && -newY >= height1 && -newY < height2) {
			   
				this.currentIndex = i
				this.diff = height2 + newY			
				return
			  }		
			}
			this.currentIndex = listHeight.length - 2;	   
	   },
	   diff(newVal){
	       let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
		   if (this.fixedTop === fixedTop) {//fixedTop =0
               return
           }
		   this.fixedTop = fixedTop
		   this.$refs.listFixed.style.transform = `translate3d(0,${fixedTop}px,0)`
	   }
   },
   computed:{
       fixedTitle() {
           if (this.scrollY > 0) {
                return ''
           }
		 return this.singers[this.currentIndex] ? this.singers[this.currentIndex].name : ''
	  }
   },
   components:{
      scroll
   }
}
</script>
<style lang="scss" scoped>
     .listview{
	    position:relative;
	    width:100%;
		height:100%;
		overflow:hidden;
		.list-group{
		   padding-bottom:30px;
		   .list-group-title{
		      height:30px;
			  line-height:30px;
			  padding-left:30px;
			  color:rgba(255,255,255,0.5);
			  background:#333
		   }
		   .list-group-item{
		       display:flex;
			   padding:20px 0 0 30px;
			   align-items:center;
			   .avatar{
			      width:50px;
				  height:50px;
				  border-radius:50%;
			   }
			   .name{
			      margin-left:20px;
				  color:rgba(255,255,255,0.5);
			   }
			   
		   }
		}
		.list-shortcut{
		   position:absolute;
		   width:20px;
		   border-radius:10px;
		   padding:20px 0;
		   background:rgba(0,0,0,0.3);
		   font-family: Helvetica;
		   text-align:center;
		   right:0;
		   top:50%;
		   -webkit-transform: translateY(-50%);
           transform: translateY(-50%);
		   .item{
		      padding:3px;
			  line-height:1;
			  font-size:12px;
			  color: rgba(255, 255, 255, 0.5);
			  &.current{color:#ffcd32}
		   }
		}
		.list-fixed{
		   position:absolute;
		   width:100%;
		   left:0;
		   top:0;
		   .fixed-title{
		      height:30px;
			  line-height:30px;
			  padding-left:30px;
			  color:rgba(255,255,255,0.5);
			  background:#333		   
		   }
		}
	 }
</style>