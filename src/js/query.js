import '../css/mixins.scss'
import '../css/fonts.scss'
import '../css/iconfont.css'
import '../css/resets.css'
import '../css/iconfont.css'
import '../css/common.scss'
import '../css/carousel.scss'
import '../css/header.scss'
import '../css/footer.scss'
import '../css/first.scss'
import '../css/board.scss'
import '../css/nav.scss'
import '../css/pagination.scss'
import '../css/loading.scss'
import '../css/noDataTip.scss'
import '../css/notFound.scss'
import '../css/top.scss'
import '../css/search.scss'

import Pagination from '../modules/Pagination'
import * as API from '../api'
import { SEARCH_NAV } from '../config'
import { tplReplace, imgLazyLoad, asyncFunc, getUrlParam } from '../utils/tools'
import Nav from '../modules/Nav'
import Search from '../modules/Search'
import itemOneTpl from '../templates/board/itemOne.tpl'
import itemTwoTpl from '../templates/board/itemTwo.tpl'
import itemThreeTpl from '../templates/board/itemThree.tpl'
import itemFourTpl from '../templates/board/itemFour.tpl'

;((doc, win) => {
  const dom = {
    nav: doc.querySelector('.J_nav'),
    board: doc.querySelector('.J_board-list'),
    pagination: doc.querySelector('.J_pagination'),
    loading: doc.querySelector('.J_loading'),
    noDataTip: doc.querySelector('.J_no-data-tip'),
    notFound: doc.querySelector('.J_not-found'),
    queryData: doc.querySelector('#J_query-data'),
    countArr: doc.querySelector('#J_query-count-arr')
  }

  dom.navFirstItem = dom.nav.querySelector('.item');
  dom.navCounts = dom.nav.querySelectorAll('.count');

  const data = {
    allData: JSON.parse(dom.queryData.innerHTML),
    countArr: dom.nav.dataset.countArr.split(',') || [],
    cache: {},
    field: '*',
    apiName: '*',
    pageSize: 48,
    curPage: 1,
    kw: getUrlParam('q')
  };

  let theNav = null;

  const init = () => {
    renderPagination();
    imgLazyLoad();
    bindEvent();
    setCacheData();
    theNav = new Nav('.J_nav', SEARCH_NAV, data.field, onNavClick).init();
    new Search('.J_search-bd', onSearchClick).init();
    handleState(dom.navCounts, true);
    console.log(dom);

  }

  const bindEvent = () => {
    win.addEventListener('scroll', () => imgLazyLoad(), false);
  }

  const setCacheData = () => {
    const { cache, field, allData } = data;

    cache[field] = formatData(allData, field);
  }

  const formatData = (arr, field) =>
    arr.reduce((prev, cur) => {
      if (field === '*' || cur.field === field) {
        const { data: _arr, pages } = prev;
        const key = Math.ceil((pages + 1) / (data.pageSize));

        !_arr[key] && (_arr[key] = []);
        _arr[key].push(cur);
        prev.pages++;
      }

      return prev;
    }, { data: [], pages: 0 })

  const getTpl = (field) => {
    switch (field) {
      case 'full':
      case 'promote':
      case 'origin':
      case 'rookie':
        return itemOneTpl;

      case 'live':
        return itemTwoTpl;

      case 'e_sports':
        return itemThreeTpl;

      case 'cinema':
      case 'bangumi':
        return itemFourTpl
      default:
        break;
    }
  }

  const onSearchClick = (kw) => {
    if (!kw) {
      return;
    }

    data.kw = kw;

    getSearchData({ kw, apiName: '*'});
  }

  const onNavClick = (field) => {
    data.field = field;
    data.curIdx = SEARCH_NAV.findIndex(item => item.field = field);
    data.curPage = 1;
    getCacheData(true);
  }

  const onPaginationClick = (curPage, pages) => {
    data.curPage = curPage;
    win.scrollTo(0, 0);
    getCacheData(false);
  }

  const handleState = (dom, state) => {
    if (dom.length) {
      dom.forEach((item) => func(item));
      return;
    }
    func(dom);

    function func ({ classList }) {
      state
        ? classList.remove('hide')
        : classList.add('hide')
    }
  }

  const renderNavCount = (dom, countArr) =>
    dom.forEach((item, idx) => item.textContent = `(${ countArr[idx] })`)

  const renderList = (data) =>
    data.reduce((prev, cur) =>
      prev += tplReplace(getTpl(cur.field),
        Object.assign({}, cur, {
          isUpShow: cur.field === 'promote' ? '' : 'hide',
          countHide: cur.play_count ? '' : 'hide',
          tags: cur.tags && JSON.parse(cur.tags).join('、')
      })), '')

  const renderPagination = (curPage, pages) => {
    const { pageSize } = data;

    dom.pagination.innerHTML = '';

    new Pagination('.J_pagination', {
      callback: onPaginationClick,
      curPage,
      pages,
      pageSize
    }).init()
  }

  const getCacheData = (isRenderPagination = true) => {
    const { field, cache, curPage } = data,
          { board, loading, pagination, noDataTip, notFound } = dom,
          item = cache[field];

    board.innerHTML = '';
    handleState(loading, true);
    handleState(pagination, false);
    handleState(noDataTip, false);
    handleState(notFound, false);

    if (!item) {
      setCacheData();
      handleRender(isRenderPagination);
      return;
    }

    if (!item[curPage]) {
      setCacheData();
      handleRender(isRenderPagination);
      return;
    }

    handleRender(false);
  }

  const handleRender = (isRenderPagination) => {
    const { field, cache, curPage, kw, countArr, curIdx } = data,
          { data: _data, pages } = cache[field],
          { noDataTip, loading, pagination, notFound, board } = dom;

    if (pages <= 0) {
      kw ? handleState(noDataTip, true) : handleState(notFound, true);
      handleState(loading, false);
      return;
    }

    board.innerHTML = renderList(_data[curPage]);
    isRenderPagination && renderPagination(curPage, pages);
    handleState(board, true);
    handleState(pagination, true);
    handleState(noDataTip, false);
    handleState(notFound, false);
    handleState(loading, false);
    imgLazyLoad();
  }

  const getSearchData = async (conf) => {
    const { loading } = dom;

    handleState(loading, true);
    const [err, res] = await asyncFunc(
      () => API.getSerachData(conf)
    )

    if (err) {
      console.log(err.message);
      return;
    }

    const { code, msg, data: result } = res;

    if (code === 0) {
      data.cache = {};
      data.allData = result.data;
      data.countArr = result.countArr;

      const { navFirstItem, navCounts } = dom;

      theNav.setCurItem(navFirstItem, '*');
      setCacheData();
      handleState(loading, false);
      renderNavCount(navCounts, result.countArr);
      return;
    }

    handleState(loading, false);
    console.log(msg);
  }

  init();
})(document, window);
