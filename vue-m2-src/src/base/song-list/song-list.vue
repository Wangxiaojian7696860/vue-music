<template>
    <div class="song-list">
	     <ul>
		     <li class="item" v-for="(song,index) in songs" @click="selectItem(song,index)">
			      <div class="rank" v-show="rank">
				       <span :class="getNumIcon(index)" v-html="getNumTxt(index)"></span>
				  </div>
				  <div class="content">
                       <h2 class="name">{{song.name}}</h2>
                       <p class="desc">{{getDesc(song)}}</p>		
                  </div>
			 </li>
		 </ul>
	</div>
</template>
<script>
export default{
   props:{
      rank:{
	     type:Boolean,
		 default:false
	  },
	  songs:{
	     type:Array,
		 default:[]
	  }
   },
   methods:{
      getNumIcon(index){
	     if(index<3){
		     return "icon icon"+index;
		 }else{
		     return "text"
		 }
	  },
	  getNumTxt(index){
	     if(index>2){
		     return index+1
		 }
	  },
	  getDesc(song){
	      return `${song.singer}·${song.album}`
	  },
	  selectItem(song,index){
	      this.$emit('select',song,index);
	  }
   }
}
</script>
<style scoped lang="scss">
  @import "../../common/css/variable";
  @import "../../common/css/mixin";
  .song-list{
      .item{
          display: flex;
		  align-items: center;
		  box-sizing: border-box;
		  height: 64px;
		  font-size: $font-size-medium;
		  .rank{
			flex: 0 0 25px;
			width: 25px;
			margin-right: 30px;
			text-align: center;
			.icon{
			  display: inline-block;
			  width: 25px;
			  height: 24px;
			  background-size: 25px 24px;
			  &.icon0{
				@include bg-image('first')
			  }
			  &.icon1{
				@include bg-image('second')
			  }	
			  &.icon2{
				@include bg-image('third')
			  }	
		    }
			.text{
               color: $color-theme;
               font-size: $font-size-large;
		   } 	
		  }
		  .content{
			flex: 1;
			line-height: 20px;
			overflow: hidden;
			.name{
			  @include no-wrap();
			  color: $color-text;
			 } 
			.desc{
			  @include no-wrap();
			  margin-top: 4px;
			  color: $color-text-d;
			}  
		  }			   
	  }
  }
</style>  