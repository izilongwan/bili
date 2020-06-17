import decorator from '../utils/decorator';

@decorator
export default class Carousel {
  constructor (opt = {}) {
    this.duration = opt.duration || 5000;

    this.elem = document.querySelector('.J_myCarousel');
    this.oCarItems = this.elem.querySelectorAll('.car-item');
    this.carItemsLen = this.oCarItems.length;
    this.oCarIndicators = this.elem.querySelector('.J_carIndicators');
    this.oIndicatorItems = this.oCarIndicators.querySelectorAll('.car-indicator-item');

    this.idx = 0;
    this.curIdx = 0;
    this.timer = null;
  }

  init () {
    this.bindEvent();
    this.autoPlay();
  }

  bindEvent () {
    Carousel.addEvent(this.elem, 'click', this.btnClick.bind(this));
    Carousel.addEvent(this.elem, 'mouseenter', this.mouseInOut.bind(this));
    Carousel.addEvent(this.elem, 'mouseleave', this.mouseInOut.bind(this));
    Carousel.addEvent(this.oCarIndicators, 'mouseover', this.mouseOver.bind(this));
  }

  autoPlay () {
    this.timer = setInterval(this.run.bind(this), this.duration);
  }

  mouseInOut (ev) {
    const e = ev || window.event,
          type = e.type;
    type === 'mouseenter' ? clearInterval(this.timer)
                          : this.autoPlay();
  }

  mouseOver (ev) {
    const e = ev || window.event,
          tar = e.target || e.scrElement,
          idx = [].indexOf.call(this.oIndicatorItems, tar);

    if (idx !== -1) {
      this._changeIdx(idx);
      this.curIdx = idx;
    }
  }

  btnClick (ev) {
    const e = ev || window.event,
          tar = e.target || e.srcElement,
          { dir } = tar.dataset;

    dir && this.run(dir);
  }

  run (dir = 'next') {
    switch (dir) {
      case 'prev':
        this.curIdx = this.curIdx === 0
                    ? this.carItemsLen - 1
                    : this.curIdx - 1;
        break;
      case 'next':
        this.curIdx = this.curIdx < this.carItemsLen - 1
                    ? this.curIdx + 1
                    : 0;
        break;
      default:
        break;
    }
    this._changeIdx(this.curIdx);
  }

  _changeIdx (index) {
    this.oCarItems[this.idx].classList.remove('active');
    this.oIndicatorItems[this.idx].classList.remove('cur');
    this.oCarItems[index].classList.add('active');
    this.oIndicatorItems[index].classList.add('cur');
    this.idx = index;
  }
}
