<template>
<div class="m-head">
     <div class="logo"></div>
	 <h1 class="text">vue音乐播放器</h1>
	 <div class="mine"><span class="icon-mine iconfont icon-people3"></span></div>
</div>
</template>
<style lang="scss" scoped>
@import "../../common/css/variable.scss";
@import "../../common/css/mixin.scss";
    .m-head{
	   height:44px;
	   position:relative;
	   font-size:0;
	   text-align: center;
	   color:$color-theme;
	   .logo{
	        display:inline-block;
			vertical-align: top;
			margin-top:6px;
			width:30px;
			height:32px;
			margin-right:9px;
			@include bg-image("logo");
			background-size:30px 32px;		   
	   }
	   .text{
	      display:inline-block;
		  vertical-align:top;
		  font-size:22px;
		  line-height:44px;
	   }
	   .mine{
	         position:absolute;
		     top: 0;
             right: 0;
			 .icon-mine{
			    display:block;
				padding: 12px;
                font-size: 20px;
			 }
	   }
	}
</style>