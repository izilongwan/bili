class Search {
  constructor (wrap, callback = () => {}) {
    this.oWrap = document.querySelector(wrap);
    this.oSearch = this.oWrap.querySelector('.search');
    this.oBtn = this.oWrap.querySelector('.btn');
    this.callback = callback;
  }

  init () {
    this.bindEvent();
  }

  bindEvent () {
    const { oSearch, oBtn } = this;

    oSearch.addEventListener('input', (e) => this.handleSeach(e), false);
    oBtn.addEventListener('click', () => this.callback(this.value), false);
  }

  handleSeach (ev) {
    const e = ev || window.event,
          tar = e.target || e.srcElement;

    this.value = tar.value.trim();
  }
}

export default Search;
