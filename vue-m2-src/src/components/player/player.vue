<template>
  <div class="player" v-show="playList.length>0">
       <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"	   
	   >
	      <div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img width="100%" height="100%" :src="currentSong.image">
				</div>
				<div class="top">
			        <div class="back" @click="back">
				         <i class="icon-back">X</i>
			        </div>
			        <h1 class="title" v-html="currentSong.name"></h1>
			        <h2 class="subtitle" v-html="currentSong.singer"></h2>
			    </div>
				<div class="middle" 
				 @touchstart.prevent="middleTouchStart"
				 @touchmove.prevent="middleTouchMove"
				 @touchend="middleTouchEnd"			
			    >	
				    <div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
						  <div class="cd" :class="cdCls">
							<img class="image" :src="currentSong.image">
						  </div>
						</div>
						<div class="playing-lyric-wrapper">
						  <div class="playing-lyric">{{playingLyric}}</div>
						</div>					
					
					</div>
					<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
						<div class="lyric-wrapper">
						  <div v-if="currentLyric">
							<p ref="lyricLine"
							   class="text"
							   :class="{'current': currentLineNum ===index}"
							   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
						  </div>
						</div>
					</scroll>	
				</div>	 
				<div class="bottom">
				  <div class="dot-wrapper">
					<span class="dot" :class="{'active':currentShow==='cd'}"></span>
					<span class="dot" :class="{'active':currentShow==='lyric'}"></span>
				  </div>
				  <div class="progress-wrapper">
					<span class="time time-l">{{format(currentTime)}}</span>
					<div class="progress-bar-wrapper">
						 <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
					</div>
					<span class="time time-r">{{format(currentSong.duration)}}</span>
				  </div>
				  <div class="operators">
						<div class="icon i-left" @click="changeMode">
						  <i :class="iconMode"></i>
						</div>
						<div class="icon i-left" :class="disableCls">
						  <i @click="prev" class="icon-prev"></i>
						</div>
						<div class="icon i-center" :class="disableCls">
						  <i @click="togglePlaying" :class="playIcon"></i>
						</div>
						<div class="icon i-right" :class="disableCls">
						  <i @click="next" class="icon-next"></i>
						</div>
						<div class="icon i-right">
						  <i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
						</div>
				  </div>
			</div>	      
		  </div>
	   </transition>
	   <transition name="mini">
	   <div class="mini-player" v-show="!fullScreen" @click="open">
			<div class="icon">
			  <img :class="cdCls" width="40" height="40" :src="currentSong.image">
			</div>
			<div class="text">
			  <h2 class="name" v-html="currentSong.name"></h2>
			  <p class="desc" v-html="currentSong.singer"></p>
			</div>
			<div class="control">
			    <progress-circle :radius="radius" :percent="percent">
			       <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
				</progress-circle> 
			</div>
			<div class="control" @click.stop="showPlaylist">
			  <i class="icon-playlist"></i>
			</div>	   
	   
	   </div>
	 </transition>  
	  <playlist ref="playlist"></playlist>
      <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>	 
   </div>
</template>
<script type="text/ecmascript-6">
import ProgressBar from '../../base/progress-bar/progress-bar'
import ProgressCircle from '../../base/progress-circle/progress-circle'
import {playerMixin} from '../../common/js/mixin'
import {mapGetters,mapMutations, mapActions} from 'vuex'
import {prefixStyle} from '../../common/js/dom'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
import Scroll from '../../base/scroll/scroll'
import Lyric from 'lyric-parser'
import Playlist from '../playlist/playlist'
//Lyric 的api
//播放歌词
//play()
//暂停歌词
//stop()
//歌词跳转
//seek(startTime)
//切换播放/暂停状态
//toggelePlay()



export default{
    mixins: [playerMixin],
	 created(){
	    //touch不需要添加get 和 set 所以在created这里定义
        this.touch = {};
		
    },		
	data(){
	   return{
		   songReady: false,
		   radius: 32,
		   currentTime: 0,
		   currentLyric: null,
		   currentLineNum: 0,
		   currentShow: 'cd',
		   playingLyric: ''	
	   }
	},
	methods:{
	   back(){
	      this.setFullScreen(false)
	   },
	   ready(){
	      this.songReady = true;
		  //还需要将歌曲保存 用于播放历史
		  this.savePlayHistory(this.currentSong)
	   },
	   error(){
	      this.songReady = true;
	   },
	   updateTime(e){
	       this.currentTime = e.target.currentTime
	   },
	   loop(){
	       this.$refs.audio.currentTime = 0;
		   this.$refs.audio.play();	 
			this.setPlayingState(true)
			if (this.currentLyric) {
			  this.currentLyric.seek(0)
			}		     
	   },
	   prev(){
	      if(!this.songReady){
		      return
		  }
		  if (this.playList.length === 1) {
			  this.loop()
			  return
          } 
          var index = this.currentIndex-1;
		  if(index<0){
		     index = this.playList.length-1;
		  }		
		  this.$store.commit("SET_CURRENT_INDEX",index);
		  if (!this.playing) {
             this.togglePlaying()
          }
		  this.songReady = false		    		  
		  	   
	   },
	   next(){
	      if(!this.songReady){
		      return
		  }
		  if (this.playList.length === 1) {
			  this.loop()
			  return
          } 
	      var index = this.currentIndex+1;
		  if(index>=this.playList.length){
		     index = 0;
		  }		  
	      this.$store.commit("SET_CURRENT_INDEX",index);
		  if (!this.playing) {
             this.togglePlaying()
          }
		  this.songReady = false
	   },	   
	   end(){
	        console.log("end")
			if (this.mode === 1) {
			  //单曲循环播放
			  this.loop()
			} else {
			  this.next()
			}	   
	   },
	   enter(){},
	   afterEnter(){},
	   leave(){},
	   afterLeave(){},
	   
	   open(){
	      this.setFullScreen(true)
	   },
	   showPlaylist(){
	      this.$refs.playlist.show()
	   },   
	   getLyric(){
		this.currentSong.getLyric().then((lyric) => {
		  if (this.currentSong.lyric !== lyric) {
			return
		  }

		  this.currentLyric = new Lyric(lyric, this.handleLyric)
		  if (this.playing) {
			this.currentLyric.play()
		  }

		}).catch(() => {
		  this.currentLyric = null
		  this.playingLyric = ''
		  this.currentLineNum = 0
		})
	  },	
	  handleLyric({lineNum, txt}) {
		this.currentLineNum = lineNum
		if (lineNum > 5) {
		  let lineEl = this.$refs.lyricLine[lineNum - 5]
		  this.$refs.lyricList.scrollToElement(lineEl, 1000)
		} else {
		  this.$refs.lyricList.scrollTo(0, 0, 1000)
		}
		this.playingLyric = txt
	  },	   
	   middleTouchStart(e){
		    // touch开始时,将touchInfo对象设置为已初始化状态
			this.touch.initiated = true
			// 用来判断是否是一次移动
			this.touch.moved = false
			const touch = e.touches[0]
			this.touch.startX = touch.pageX
			this.touch.startY = touch.pageY				   
	   },
	   middleTouchMove(e){
			if (!this.touch.initiated) {
			  return
			}
			const touch = e.touches[0]
			const deltaX = touch.pageX - this.touch.startX
			const deltaY = touch.pageY - this.touch.startY
			if (Math.abs(deltaY) > Math.abs(deltaX)) {
			  return
			}
			if (!this.touch.moved) {
			  this.touch.moved = true
			}
			const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
			const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
			this.touch.percent = Math.abs(offsetWidth / window.innerWidth)	
			
			this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
			this.$refs.lyricList.$el.style[transitionDuration] = 0
			this.$refs.middleL.style.opacity = 1 - this.touch.percent
			this.$refs.middleL.style[transitionDuration] = 0//过渡时间					   
	   },
	   middleTouchEnd(){
			if (!this.touch.moved) {
			  return
			}
			let offsetWidth
			let opacity
			if (this.currentShow === 'cd') {
			  if (this.touch.percent > 0.1) {
				offsetWidth = -window.innerWidth
				opacity = 0
				this.currentShow = 'lyric'
			  } else {
				offsetWidth = 0
				opacity = 1
			  }
			} else {
			  if (this.touch.percent < 0.9) {
				offsetWidth = 0
				this.currentShow = 'cd'
				opacity = 1
			  } else {
				offsetWidth = -window.innerWidth
				opacity = 0
			  }
			}
			const time = 300
			this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
			this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
			this.$refs.middleL.style.opacity = opacity
			this.$refs.middleL.style[transitionDuration] = `${time}ms`
			// 一次touch完成后,重置touchInfo对象尚未初始化状态
			this.touch.initiated = false	   
	   },
	   togglePlaying(){
		    if (!this.songReady) {
                return
            }
		    this.setPlayingState(!this.playing)
			if (this.currentLyric) {
			  this.currentLyric.togglePlay()
			}		  
	   },
	   onProgressBarChange(percent){
			const currentTime = this.currentSong.duration * percent
			this.$refs.audio.currentTime = currentTime
			if (!this.playing) {
			  //如果是暂停再拖动 拖完后让它再播放
			  this.togglePlaying()
			}	    
			if (this.currentLyric) {
			  this.currentLyric.seek(currentTime * 1000)
			}			     
	   },
	   format(interval) {
	       interval = interval | 0;
		   const minute = interval / 60 | 0;
		   const second = this._pad(interval%60);
		   return `${minute}:${second}`
	   },
	   _pad(num, n = 2) {
			let len = num.toString().length
			while (len < n) {
			  num = '0' + num
			  len++
			}
			return num
	   },
	   ...mapMutations({
		   setFullScreen:"SET_FULL_SCREEN"
	   }),
	   ...mapActions([
			'savePlayHistory'
		])		   
	},
	 watch:{
	    currentSong(newSong, oldSong){
			if (!newSong.id) {
			  return
			}		
		    if(newSong.id == oldSong.id){
			   //当暂停时 点击切换播放的模式的时候 会再播放（currentSong已经改变） 所以要return
			   return
			}	
			
		   if (this.currentLyric) {
			  this.currentLyric.stop()
			  this.currentTime = 0
			  this.playingLyric = ''
			  this.currentLineNum = 0
		   }		
				
		   clearTimeout(this.timer)
		   this.timer = setTimeout(()=>{
		      this.$refs.audio.play()
			   this.getLyric()
			},1000)
		},
		playing(){
		     const audio = this.$refs.audio;
			 this.$nextTick(function(){//在修改数据之后立即使用这个方法，获取更新后的 DOM。理解为dom更新后 执行这个方法
			    this.playing ? audio.play() : audio.pause()
			 })		
		}
	 },
	 computed:{
        cdCls() {
          return this.playing ? 'play' : 'play pause'
        },	 
		iconMode(){
		   return this.mode == 0 ? 'icon-sequence' : this.mode == 1 ? 'icon-loop' : 'icon-random' 
		},
        playIcon() {
          return this.playing ? 'icon-pause' : 'icon-play'
        },
        disableCls() {
          return this.songReady ? '' : 'disable'
        },	   
        miniIcon() {
          return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },	
        percent() {
           return this.currentTime / this.currentSong.duration;
		   
        },		 
	     ...mapGetters(['fullScreen','playing','currentIndex'])
	 },
	 components:{
	    ProgressBar,
		Scroll,
		ProgressCircle,
		Playlist
	 }
}
</script>
<style lang="scss" scoped>
@import "../../common/css/variable";
@import "../../common/css/mixin";
.player{
.normal-player{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
	  }	
      .top{
        position: relative;
        margin-bottom: 25px;
        .back{
          position:absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back{
            display: block;
            padding: 9px;
            font-size: $font-size-large-x;
            color: $color-theme;
            transform: rotate(-90deg);
		  }	
		}	
        .title{
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
		}  
        .subtitle{
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
		}  
	  }	  
      .middle{
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l{
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper{
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd{
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              &.play{
                animation: rotate 20s linear infinite
			  }	
              &.pause{
                animation-play-state: paused
			  }	
              .image{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
			  }	
			}	
          }
          .playing-lyric-wrapper{
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric{
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
			 } 
		  }	  
		}	  
        .middle-r{
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper{
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text{
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current{
               color: $color-text
			  } 
			}   
		 }	   
	   } 
	   }		   
      .bottom{
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper{
          text-align: center;
          font-size: 0;
          .dot{
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active{
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
			} 
		  }	
		 }   
			  
        .progress-wrapper{
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time{
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l{
              text-align: left
			}  
            &.time-r{
              text-align: right
			}  
		  }	  
          .progress-bar-wrapper{
            flex: 1
		  }	
		}	
        .operators{
          display: flex;
          align-items: center;
          .icon{
            flex: 1;
            color: $color-theme;
            &.disable{
              color: $color-theme-d
			}  
            i{
              font-size: 30px
			}  
		  }	  
          .i-left{
            text-align: right
		  }	
          .i-center{
            padding: 0 20px;
            text-align: center;
            i{
              font-size: 40px
			}  
		  } 	  
          .i-right{
            text-align: left
		  } 	
          .icon-favorite{
            color: $color-sub-theme
		  } 	
	    }	  
      }		 		
      &.normal-enter-active, &.normal-leave-active{
        transition: all 0.4s;
        .top, .bottom{
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
		}  
	  }	  
      &.normal-enter, &.normal-leave-to{
        opacity: 0;
        .top{
          transform: translate3d(0, -100px, 0)
		}  
        .bottom{
          transform: translate3d(0, 100px, 0)
		}  
	  }	  	  
	}	


.mini-player{
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: $color-highlight-background;
      &.mini-enter-active, &.mini-leave-active{
        transition: all 0.4s
	  }	
      &.mini-enter, &.mini-leave-to{
        opacity: 0
	  } 	
      .icon{
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img{
          border-radius: 50%;
          &.play{
            animation: rotate 10s linear infinite
		  }	
          &.pause{
            animation-play-state: paused
		  }	
		}	
	  }		
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
		} 
        .desc{
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
		}  
	  }	  
      .control{
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist{
          font-size: 30px;
          color: $color-theme-d;
		}  
        .icon-mini{
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
		}  
	  }	  
	}	      
    @keyframes rotate{
    0%{
      transform: rotate(0)
	  }
    100%{
      transform: rotate(360deg)    
	  }
	}  
}
</style>