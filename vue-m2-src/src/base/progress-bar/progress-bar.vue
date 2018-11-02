<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
	     <div class="bar-inner">
		      <div class="progress" ref="progress"></div>
			  <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart"
                   @touchmove.prevent="progressTouchMove"
                   @touchend="progressTouchEnd">
			       <div class="progress-btn"></div>
			  </div>
		 </div>
	</div>
</template>
<script>
const progressBtnWidth = 16
export default{
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
	created() {
      this.touch = {}
    },
	methods:{
	   progressClick(e){
	        const rect = this.$refs.progressBar.getBoundingClientRect();
			const width = e.pageX - rect.left;
            this.$refs.progress.style.width = width+"px";
			this.$refs.progressBtn.style.transform = this.$refs.progressBtn.style.webkitTransform = `translate3d(${width}px,0,0)`;
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
            const percent = this.$refs.progress.clientWidth / barWidth;
			this.$emit('percentChange', percent)
	   },
	   progressTouchStart(e){
	      this.touch.initiated = true
	      this.touch.prevpoint = {"pageX":e.changedTouches[0].pageX,"pageY":e.changedTouches[0].pageY};
		  this.touch.left = this.$refs.progress.clientWidth;
	      
	   },
	   progressTouchMove(e){
	       if (!this.touch.initiated) {
               return
           }
	       var nowpoint = e.changedTouches[0];
		   var dis = nowpoint.pageX - this.touch.prevpoint.pageX;
		   var width = dis + this.touch.left;
		   if(width<=0){width=0}
		   if(width>=this.$refs.progressBar.clientWidth - progressBtnWidth){
		      width = this.$refs.progressBar.clientWidth - progressBtnWidth
		   }
		   this.$refs.progressBtn.style.transform = this.$refs.progressBtn.style.webkitTransform = `translate3d(${width}px,0,0)`;
		   this.$refs.progress.style.width = width+"px";
		   
	   },
	   progressTouchEnd(){
	        this.touch.initiated = false
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
            const percent = this.$refs.progress.clientWidth / barWidth;
			this.$emit('percentChange', percent)	       
	   }	   
	},
	watch: {
	   percent(newPercent) {
	       if (newPercent >= 0 && !this.touch.initiated) {//this.touch.initiated这里表示当拖拽progressBtn的时候
		       const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
			   if(newPercent>1){newPercent = 1}
			   const offsetWidth = newPercent * barWidth;
			  
			   this.$refs.progress.style.width = `${offsetWidth}px`
               this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
		   }
	   }
	}
}
</script>
<style scoped lang="scss">
  @import "../../common/css/variable";

  .progress-bar{
    height: 30px;
    .bar-inner{
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress{
        position: absolute;
        height: 100%;
        background: $color-theme;
	  }	
      .progress-btn-wrapper{
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn{
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
		} 
	  }	  
	}	  
}		  
</style>