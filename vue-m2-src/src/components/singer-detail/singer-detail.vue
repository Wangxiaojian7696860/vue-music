<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>
<script>
  import MusicList from '../music-list/music-list'
  import {ERR_OK} from '../../api/config'  
  import {createSong} from '../../common/js/song'
  import {mapGetters} from 'vuex'
export default{
   data(){
      return{
	     songs:[]
	  }
   },
   created(){
       this._getDetail() 
   },
	methods:{
	    _getDetail() {
			if (!this.singer.id) {
			  this.$router.push('/singer')
			  return
			}
			this.$http.get("https://wangxiaojian7696860.github.io/cao/static/data/singerdetail.json").then((res)=>{
			     if(res.status ==200){
				      for(var item in res.data){
					     if(item == this.singer.id){
						    this.songs = this._normalizeSongs(res.data[item].list)				
						 }
					  }
				 }

			}).catch((err)=>{console.log(err)})
					
		},
		 _normalizeSongs(list) {
			let ret = []

			list.forEach((item) => {
			  if (item.musicData.songid && item.musicData.albummid) {			      
			      ret.push(createSong(item.musicData))
			  }
              
			})
            return ret	     
		 }
	},
   computed:{
 	   title(){
	      return this.singer.name
	   },
	   bgImage(){
	      return this.singer.avtar
	  },
       ...mapGetters([
	     'singer' 
	   ])     
   },
   components:{
       MusicList
   }
}
</script>
<style scoped lang="scss">
  .slide-enter-active, .slide-leave-active
    {transition: all 0.3s}

  .slide-enter, .slide-leave-to
   { transform: translate3d(100%, 0, 0)}
</style>