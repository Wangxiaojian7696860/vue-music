<template>
   <transition name="slide">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
   </transition>
</template>
<script>
  import MusicList from '../music-list/music-list';
  import { mapGetters } from 'vuex'
  import {getSongList} from '../../api/cao'
  import {ERR_OK} from '../../api/config'  
  import {createSong} from '../../common/js/song'
  export default{
    data(){
	   return {
	      songs:[]
	   }
	},
    created() {
      this._getSongList()
    },	
	methods: {
	    _getSongList(){
			if (!this.disc.dissid) {
			  this.$router.push('/recommend')
			  return
			}
			this.$http.get("https://wangxiaojian7696860.github.io/cao/static/data/singerdetail.json").then((res)=>{
			     if(res.status ==200){
				      
				      for(var item in res.data){
					     if(item == this.disc.dissid){
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
    computed: {
	  title(){
	      return this.disc.name
	  },
	  bgImage(){
	      return this.disc.avtar
	  },
	  ...mapGetters(['disc'])
	},
    components: {	  
      MusicList
    }     
  }
</script>
<style scoped lang="scss">
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)
  }	
</style>