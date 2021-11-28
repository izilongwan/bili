import decorator from '../utils/decorator'

@decorator
class Nav {
  constructor (wrap, nav, field, callback = () => {}) {
    this.oNav = document.querySelector(wrap);
    this.oBar = document.querySelector('.J_bar');
    this.oItems = Array.from(this.oNav.getElementsByClassName('item'));
    this.nav = nav;
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
    this.oNav.addEventListener('click', (e) => this.onNavClick(e), false);
  }

  onNavClick (ev) {
    const e = ev || window.event,
          tar = e.target || e.srcElement,
          oLi = findParent(tar);

    if (!oLi) {
      return;
    }

    const { field } = oLi.dataset;

    if (field !== this.field) {
      this.setCurItem(oLi, field);
    }
  }

  getIdx (field) {
    return this.nav.findIndex(item => item.field == field);
  }

  setCurItem (tar, field) {
    const { oItems, callback } = this;

    oItems.forEach(({ classList}) => classList.remove('cur'));
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

function findParent(el) {
  while (el && el.tagName.toLowerCase() !== 'li') {
    el = el.parentNode;
  }

  return el;
}

export default Nav;
