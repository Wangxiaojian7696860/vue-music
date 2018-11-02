export default{
   singer(state){
	   return state.singer
   },
	playing: function(state){
		return state.playing
	},
	 fullScreen:function(state){
		return state.fullScreen
	},
	 playList:function(state){
		return state.playList
	},
	 sequenceList:function(state){
		return state.sequenceList
	} ,  
	currentIndex:function(state){
		return state.currentIndex
	},
	currentSong:function(state){
		return state.playList[state.currentIndex] || {}
	},
	mode:function(state){
		return state.mode
	},	
    disc(state){
	   return state.disc
    },
    favoriteList:(state)=>{
	  return state.favoriteList
    },
	playHistory:(state)=>{
	   return state.playHistory
	},
	searchHistory:(state)=>{
		return state.searchHistory
	}
   
}