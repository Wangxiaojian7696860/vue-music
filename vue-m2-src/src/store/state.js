import {playMode} from '../common/js/config'
import {loadSearch,loadPlay,loadFavorite} from '../common/js/cache';
export default {
   singer:{},
   playing:false,//播放状态
   fullScreen:false,//全屏播放
   playList:[],//播放列表
   sequenceList:[],//顺序播放列表（因为播放可以随机播放	
   disc:{},
   currentIndex:-1,
   mode:playMode.sequence,
   searchHistory:loadSearch(),
   favoriteList:loadFavorite(),
   playHistory:loadPlay()
}