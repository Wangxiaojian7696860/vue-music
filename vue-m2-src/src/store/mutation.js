import types from './mutation-type.js'

export default{	
    [types.SET_SINGER](state,singer){
		state.singer = singer
	},
    [types.SET_PLAYING_STATE](state,playing){
		state.playing = playing
	},
    [types.SET_FULL_SCREEN](state,full){
		state.fullScreen = full
	},
    [types.SET_PLAYLIST](state,list){
		state.playList = list
	},
    [types.SET_SEQUENCE_LIST](state,list){
		state.sequenceList = list
	},	
    [types.SET_DISC](state,disc){
		state.disc = disc
	},
	[types.SET_CURRENT_INDEX](state,index){
		state.currentIndex = index
	},
	[types.SET_MODE](state,index){
		state.mode = index
	},
	[types.SET_PLAY_HISTORY](state, history) {
	    state.playHistory = history
    },
	[types.SET_FAVORITE_LIST](state, favoriteList) {
	    state.favoriteList = favoriteList
    },
	[types.SET_SEARCH_HISTORY](state,searchHistory) {
	    state.searchHistory = searchHistory
    }
}