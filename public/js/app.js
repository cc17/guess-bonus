
var bonusArray = [0,1,2,3,4];
var random;

var GuessBonus = {
    $drawLots: {},
    $showLot: {},
    dAudio: {},
    lotsTitle: [],
    cheatLotNumberList: {
        6597: 4,
        471: 2,
        602: 2
    },
    isShaked: false,
    hideResult:function(){
        this.$mask.hide();
        this.$bonus.empty();
    },
    initShake: function() {
        this.hideResult();



        var _this = this,
            $drawLots = this.$drawLots,
            $showLot  = this.$showLot,
            $title  = this.$title,
            $golden  = this.$golden;

        if($drawLots.length){
            $drawLots.click(_this.reset.bind(_this));
            $drawLots.addClass('god-shake');
        } 
        if($title.length){
            $title.addClass('title-show');
        } 
        if($golden.length){
            $golden.addClass('golden-show');
        }    

        
       
        Share.WeChat.setData( "title", "测测你能拿多少年终奖！" );
        Share.WeChat.setData( "imgUrl", "/images/god.png" );
        this.isShaked = false;

        if ( $drawLots.data( "is-init" ) ) return;
        //$drawLots.data( "is-init", true )

       
        $drawLots.length && $( window ).bind( "devicemotion", function( e ) {
            var oe = e.originalEvent;
            ( ( Math.abs( oe.acceleration.x || 0 ) > 10 ) || ( Math.abs( oe.acceleration.y || 0 ) > 10 ) )
                && _this.shaking( function() {
                    

                    random = Math.ceil(Math.random()*4);
                    window.location.hash = "wx_bonus_id=" + random;
                    
                } );
        } );
    },
    
    shaking: function( callback ) {
        if ( this.isShaked ) return ;
        this.isShaked = true;
        this.$drawLots.removeClass('god-shake');
        this.$title.removeClass('title-show');
        this.$golden.removeClass('golden-show');

        
        var self = this;


        $('.mask').show();


        setTimeout(function(){
            self.$showLots.addClass('money-open');
        
            setTimeout( function() {
                callback && callback();
            }, 400 );
        }, 1000);
        
       
    },
    reset:function(){
        this.isShaked = false;
        window.location.hash = 'wx_bonus_id=-1';
        this.$showLots.removeClass('money-open');
    },
    showLot: function( wxFid) {

        $('.bonus').empty().append('<image src="/images/bonus'+ wxFid +'.png"/>').append('<div class="try-more">我也要试玩</div>');
        var self = this;
        $('.try-more').click(function(){ 
            self.reset()
        });
    }
};


/*loading*/
var loaderimages = {
  progress : $(".load_val"),
  init : function(callback) {
    this.preload(callback);
  },
  /**
   * 执行加载图片的进程
   * @return {[type]} [description]
   */
  preload : function(callback) {
    var _this = this;
    _this.preloadAssets(_this.allImages, "", function(e) { 
      var percent = Math.floor((e.completedCount / e.totalCount)*100);
      _this.setPreloaderPercent(percent)
    }, function(e) {
      _this.loaderComplete(callback);
    });
  },
  /**
   * 图片加载过程:装载图片,当前加载完成进度,加载结束.
   * @param  {[type]} assets   [description]
   * @param  {[type]} progress [description]
   * @param  {[type]} complete [description]
   * @return {[type]}          [description]
   */
  preloadAssets : function(assets, prefix, progress, complete) {
    var imageTypes = ['jpg', 'png', 'jpeg', 'tiff', 'gif'];
    var loader = new PxLoader();
    for(var i = 0; i < assets.length; i++) {
      var extension = assets[ i ].substr( (assets[ i ].lastIndexOf('.') +1) );
      // 创建加载图片实例,装载图片地址
      if ($.inArray(extension, imageTypes) != -1) {
        loader.add(new PxLoaderImage(assets[i] )); 
      }
    }
    loader.addProgressListener(progress);
    loader.addCompletionListener(complete);
    loader.start();
  },
  /**
   * 输出加载进度
   * @param {[type]} percentage [description]
   */
  setPreloaderPercent: function( percentage ) {
    var _this = this;
    $(".load_anime").css({
      '-webkit-background-size': '155px '+percentage+'px',
        '-moz-background-size': '155px '+percentage+'px',
        '-o-background-size': '155px '+percentage+'px',
        'background-size': '155px '+percentage+'px'
    })
    _this.progress.text(percentage+'%'); 
  },
  /**
   * 加载完成
   * @return {[type]} [description]
   */
  loaderComplete : function(callback){
    //return;
    var _this = this;
    $(".load_val").addClass('load_val_hide').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){

        try{
            $('.loading').remove();
        }catch(e){}
        
     
        callback();
    });
    
  },
  /**
   * 图片素材list
   * @type {Array}
   */
  allImages: [
    "images/bonus0.png",
    "images/bonus1.png",
    "images/bonus2.png",
    "images/bonus3.png",
    "images/bonus4.png",
    "images/money1.png",
    "images/money2.png",
    "images/money3.png"
  ]
};

$(document).ready(function(){
    GuessBonus.$drawLots = $( ".god" );
    GuessBonus.$showLots = $( ".money" );
    GuessBonus.$mask = $( ".mask" );
    GuessBonus.$bonus = $( ".bonus" );
    GuessBonus.$title = $( ".title" );
    GuessBonus.$golden = $( ".golden" );

    var callbackHandle;

    hashchange.addEvent( function( hash ) {
        handleWithHash(hash);            
    } );

    function handleWithHash(hash){
        var wxFid= ( ( hash || "" ).match( /wx_bonus_id=([^&]*)/ ) || [] )[1];

        if ( ! (wxFid && bonusArray.indexOf(parseInt ( wxFid ) ) > -1) ) {
            GuessBonus.initShake();
        } else {
            GuessBonus.showLot(wxFid);
        } 
    };

    loaderimages.init(function(){
        handleWithHash(window.location.hash);
    });

});
