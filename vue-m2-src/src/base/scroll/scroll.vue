<template>
    <div class="scroll" ref="wrapper">
	     <slot></slot>
	</div>
</template>
<script>
import BScroll from 'better-scroll'
export default{
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      jianting: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,//是否开启上拉刷新
        default: false
      },
      beforeScroll: {
        type: Boolean,//开始滚动时收起键盘 移动端
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
	mounted(){
		  setTimeout(() => {
			this._initScroll()	
		  }, 20)	
	},
	methods:{
	    _initScroll(){
			this.scroll = new BScroll(this.$refs.wrapper, {
			  probeType: this.probeType,
			  click: this.click
			});
			if (this.beforeScroll) {
				this.scroll.on('beforeScrollStart', () => {
				   this.$emit('beforeScroll')
				})
            }
			 
			if(this.jianting){		  
			   this.scroll.on('scroll', (pos) => {
			       this.$emit('scroll',pos)
			   })
			}		    
		},
		refresh(){
		    this.scroll && this.scroll.refresh();
		},
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
	},
	watch:{
	    data(){
			setTimeout(() => {
			  this.refresh()
			}, this.refreshDelay)		   
		}
	}
}
</script>