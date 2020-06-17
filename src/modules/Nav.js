import decorator from '../utils/decorator'
import { FIELDS } from '../config'

@decorator
class Nav {
  constructor (wrap, field, callback = () => {}) {
    this.oNav = document.querySelector(wrap);
    this.oBar = document.querySelector('.J_bar');
    this.oItems = this.oNav.querySelectorAll('.item');
    if (this.oItems.length <= 0) {
      return;
    }

    this.size = Nav.getStyle(this.oItems[0], 'width');
    this.field = field;
    this.idx = this.getIdx(field);

    this.callback = callback;

    this.setBarPos(this.idx === -1 ? 0 : this.idx);
  }

  init () {
    this.bindEvent();
    return this;
  }

  bindEvent () {
    this.oNav.addEventListener('click', () => this.onNavClick(), false);
  }

  onNavClick (ev) {
    const e = ev || window.event,
          tar = e.target || e.srcElement,
          { field } = tar.dataset;

    if (field !== this.field) {
      this.setCurItem(tar, field);
    }
  }

  getIdx (field) {
    return FIELDS.findIndex(item => item.field == field);
  }

  setCurItem (tar, field) {
    const { oItems, callback } = this;

    oItems.forEach(item => item.classList.remove('cur'));
    tar.classList.add('cur');
    this.field = field;
    this.idx = [].indexOf.call(oItems, tar);
    this.setBarPos(this.idx);
    callback(field);
  }

  setBarPos (idx) {
    const { size, oBar } = this;

    oBar.style.transform = `translateX(${ idx * size }px)`;
  }
}

export default Nav;
