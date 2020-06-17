<li class="item item-three">

  <div class="cell">
    <a href="{{ href }}" target="_blank" class="img-wrap">
      <img height="100%" data-src="{{ img }}" src="/imgs/lazy.gif" alt="封面" />

      <div class="count-wrap {{ countHide }}">
        <div class="one">
          <i class="iconfont icon-people"></i>

          <span class="count">{{ play_count }} </span>

          <i class="iconfont icon icon-dianzan"></i>

          <span class="count">{{ thumb_count }} </span>
        </div>

        <div class="two">
          <span class="count">{{ duration }} </span>
        </div>
      </div>
    </a>
  </div>

  <div class="info">
    <a href="{{ href }}" target="_blank" class="title">
      {{ title }}
    </a>

  </div>
</li>
