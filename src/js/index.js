import '../css/mixins.scss'
import '../css/iconfont.css'
import '../css/resets.css'
import '../css/iconfont.css'
import '../css/common.scss'
import '../css/fonts.scss'
import '../css/carousel.scss'
import '../css/header.scss'
import '../css/footer.scss'
import '../css/first.scss'
import '../css/board.scss'
import '../css/top.scss'

import Carousel from '../modules/Carousel'
import Search from '../modules/Search'
import { imgLazyLoad } from '../utils/tools'

;((doc, win) => {
  const dom = {
    imgs: doc.images
  }

  const init = () => {
    new Carousel().init();
    new Search('.J_false-search-wrap', onSearchClick).init();
    imgLazyLoad(dom.imgs);
    bindEvent();
  }

  const bindEvent = () => {
    win.addEventListener('scroll', () =>
      imgLazyLoad(dom.imgs), false);
  }

  const onSearchClick = (value) => {
    if (value) {
      window.open(`/query?q=${ value }`);
    }
  }

  init();
})(document, window);
