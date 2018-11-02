import types from './mutation-type'
import {playMode} from '../common/js/config'
import {shuffle} from '../common/js/util'
import {saveSearch, clearSearch, deleteSearch, savePlay, saveFavorite, deleteFavorite} from '../common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export default{
	selectPlay({commit, state},{list,index}){
		commit(types.SET_PLAYING_STATE,true)
		commit(types.SET_FULL_SCREEN,true)
		
		commit(types.SET_SEQUENCE_LIST,list)
		
		 if (state.mode === playMode.random) {
			let randomList = shuffle(list)
			commit(types.SET_PLAYLIST, randomList)
			index = findIndex(randomList, list[index])			 
		 }else{
		    commit(types.SET_PLAYLIST,list)			 
		 }
		

		commit(types.SET_CURRENT_INDEX, index)
		
	},	
	randomPlay({commit}, {list}){
		  commit(types.SET_MODE, playMode.random)
		  commit(types.SET_SEQUENCE_LIST, list)
		  let randomList = shuffle(list)
		  commit(types.SET_PLAYLIST, randomList)
		  commit(types.SET_CURRENT_INDEX, 0)
		  commit(types.SET_FULL_SCREEN, true)
		  commit(types.SET_PLAYING_STATE, true)	
	},
	
	insertSong({commit, state}, song){
		  let playlist = state.playList.slice()//这里只能修改副本 最后将改好的副本赋值给state 所以不能直接是state.playlist
		  let sequenceList = state.sequenceList.slice()
		  let currentIndex = state.currentIndex
		  // 记录当前歌曲
		  let currentSong = playlist[currentIndex]
		  // 查找当前列表中是否有待插入的歌曲并返回其索引
		  let fpIndex = findIndex(playlist, song)
		  // 因为是插入歌曲，所以索引+1
		  currentIndex++
		  // 插入这首歌到当前索引位置
		  playlist.splice(currentIndex, 0, song)
		  // 如果已经包含了这首歌
		  if (fpIndex > -1) {
			// 如果当前插入的序号大于列表中的序号 可以通过[1,2,3,4,2] 这个数组慢慢研究 假如2是加入去的 当加在前面和后面数据的变化
			if (currentIndex > fpIndex) {
			  playlist.splice(fpIndex, 1)
			  currentIndex--
			} else {
			  playlist.splice(fpIndex + 1, 1)
			}
		  }
		
		  let currentSIndex = findIndex(sequenceList, currentSong) + 1
		
		  let fsIndex = findIndex(sequenceList, song)
		
		  sequenceList.splice(currentSIndex, 0, song)
		
		  if (fsIndex > -1) {
			if (currentSIndex > fsIndex) {
			  sequenceList.splice(fsIndex, 1)
			} else {
			  sequenceList.splice(fsIndex + 1, 1)
			}
		  }
		
		  commit(types.SET_PLAYLIST, playlist)
		  commit(types.SET_SEQUENCE_LIST, sequenceList)
		  commit(types.SET_CURRENT_INDEX, currentIndex)
		  commit(types.SET_FULL_SCREEN, true)
		  commit(types.SET_PLAYING_STATE, true)		
	},
	deleteSong({commit, state}, song){
		  let playlist = state.playList.slice()
		  let sequenceList = state.sequenceList.slice()
		  let currentIndex = state.currentIndex
		  let pIndex = findIndex(playlist, song)
		  playlist.splice(pIndex, 1)
		  let sIndex = findIndex(sequenceList, song)
		  sequenceList.splice(sIndex, 1)
		  if (currentIndex > pIndex || currentIndex === playlist.length) {
			currentIndex--
		  }
		
		  commit(types.SET_PLAYLIST, playlist)
		  commit(types.SET_SEQUENCE_LIST, sequenceList)
		  commit(types.SET_CURRENT_INDEX, currentIndex)
		
		  if (!playlist.length) {
			commit(types.SET_PLAYING_STATE, false)
		  } else {
			commit(types.SET_PLAYING_STATE, true)
		  }		
	},
	deleteSongList({commit}){
		  commit(types.SET_CURRENT_INDEX, -1)
		  commit(types.SET_PLAYLIST, [])
		  commit(types.SET_SEQUENCE_LIST, [])
		  commit(types.SET_PLAYING_STATE, false)		
	},
	
	savePlayHistory({commit}, song){
		commit(types.SET_PLAY_HISTORY, savePlay(song))
	},
	saveFavoriteList({commit}, song){
		commit(types.SET_FAVORITE_LIST, saveFavorite(song))
	},
	deleteFavoriteList({commit}, song){
		commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
	},
	saveSearchHistory({commit}, query){
		commit(types.SET_SEARCH_HISTORY, saveSearch(query))
	},
	deleteSearchHistory({commit}, query){
		commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
	},
	clearSearchHistory({commit}){
		commit(types.SET_SEARCH_HISTORY, clearSearch())
	}
}