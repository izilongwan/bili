<li class="item item-four">

  <a href="{{ href }}" target="_blank" class="lk">
    <div class="img-wrap">
      <img height="100%" data-src="{{ img }}" src="/imgs/lazy.gif" alt="图片" />
    </div>

    <div class="info">
      <h3 class="title">{{ title }} </h3>

      <p class="tip">{{ tip }}</p>

      <p class="play-count count">
        <i class="iconfont icon-play"></i>
        <span>{{ play_count }}</span>
      </p>

      <p class="fav-count count">
        <i class="iconfont icon-shoucang"></i>
        <span>{{ fav_count }}</span>
      </p>

      <p class="popup-count count">
        <i class="iconfont icon-danmu"></i>
        <span>{{ popup_count }}</span>
      </p>

      <p class="tags">{{ tags }}</p>
    </div>
  </a>
</li>
