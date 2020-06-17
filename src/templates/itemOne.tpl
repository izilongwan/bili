<li class="item item-one">

  <div class="cell">
    <a href="{{ href }}" target="_blank" class="img-wrap">
      <img height="100%" data-src="{{ img }}" src="../imgs/lazy.gif" alt="封面" />

      <div class="count-wrap {{ countHide }}">
        <i class="iconfont icon-play"></i>

        <span>{{ play_count }}</span>

        <i class="iconfont icon-dianzan icon"></i>

        <span>{{ popup_count }}</span>
      </div>
    </a>
  </div>

  <div class="info">
    <a href="{{ href }}" target="_blank" class="title">
      {{ title }}
    </a>

    <a href="{{ up_href }}" class="up-wrap">
      <span class="up">up</span>

      <span class="name">{{ up_name }}</span>
    </a>
  </div>
</li>
