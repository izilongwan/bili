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
import { tplReplace, imgLazyLoad, getUrlParam } from '../utils/tools'
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
  }

  dom.navFirstItem = dom.nav.querySelector('.item');
  dom.navCounts = dom.nav.querySelectorAll('.count');

  const data = {
    dataConf: JSON.parse(dom.queryData.innerHTML),
    cache: {},
    field: getUrlParam('field') || 'all',
    pageSize: 20,
    curPage: 1,
    kw: getUrlParam('q')
  };

  data.allData = data.dataConf.data
  data.fieldsTotalObject = data.dataConf.fieldsTotalObject
  data.originData = {
    data: data.allData,
    fieldsTotalObject: data.fieldsTotalObject
  }

  let theNav = null;

  const init = () => {
    renderPagination();
    imgLazyLoad();
    bindEvent();
    setCacheData();
    theNav = new Nav('.J_nav', SEARCH_NAV, data.field, onNavClick).init();
    new Search('.J_search-bd', onSearchClick).init();
    handleState(dom.navCounts, true);
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
      if (field === 'all' || cur.field === field) {
        const { data: _arr, total } = prev;
        const key = Math.floor((total) / (data.pageSize));

        !_arr[key] && (_arr[key] = []);
        _arr[key].push(cur);
        prev.total++;
      }

      return prev;
    }, { data: [], total: 0 })

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

      case 'movie':
      case 'bangumi':
        return itemFourTpl
      default:
        return itemOneTpl;
    }
  }

  const onSearchClick = (kw) => {
    if (!kw) {
      renderData(data.originData)
      return;
    }

    data.kw = kw;

    searchData({ kw, field: 'all' });
  }

  const onNavClick = (field) => {
    data.field = field;
    data.curIdx = SEARCH_NAV.findIndex(item => item.field == field);
    data.curPage = 1;
    getCacheData(true);
  }

  const onPageSearchBtnClick = (page) => {
    if (data.curPage !== page) {
      onPaginationClick(page, true);
    }
  }

  const onPaginationClick = (curPage, render = false) => {
    data.curPage = curPage;
    console.log('🚀 ~ file: query.js ~ line 145 ~ onPaginationClick ~ data', data)
    win.scrollTo(0, 0);
    getCacheData(render);
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

  const renderNavCount = (dom) => {
    const { fieldsTotalObject } = data

    dom.forEach((item, idx) => {
      const field = item.parentNode.getAttribute('data-field')
      item.textContent = `(${ fieldsTotalObject[field] })`
    })
  }

  const renderList = (data) =>
    data.reduce((prev, cur) =>
      prev += tplReplace(getTpl(cur.field),
        Object.assign({}, cur, {
          isUpShow: cur.field === 'promote' ? '' : 'hide',
          countHide: cur.play_count ? '' : 'hide',
          tags: cur.tags && cur.tags.join('、')
      })), '')

  const renderPagination = (curPage, pages) => {
    const { pageSize } = data;

    dom.pagination.innerHTML = '';

    new Pagination('.J_pagination', {
      pageListClick: onPaginationClick,
      pageSearchBtnClick: onPageSearchBtnClick,
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

    if (!item[curPage - 1]) {
      setCacheData();
      handleRender(isRenderPagination);
      return;
    }

    handleRender(false);
  }

  const handleRender = (isRenderPagination) => {
    const { field, cache, curPage, kw } = data,
          { data: _data, total } = cache[field],
          { noDataTip, loading, pagination, notFound, board } = dom;

    if (total <= 0) {
      kw ? handleState(noDataTip, true) : handleState(notFound, true);
      handleState(loading, false);
      return;
    }

    board.innerHTML = renderList(_data[curPage - 1]);
    isRenderPagination && renderPagination(curPage, total);
    handleState(board, true);
    handleState(pagination, true);
    handleState(noDataTip, false);
    handleState(notFound, false);
    handleState(loading, false);
    imgLazyLoad();
  }

  const searchData = async (conf) => {
    const { loading } = dom;

    handleState(loading, true);

    const [err, res] = await API.getSearchData(conf)

    handleState(loading, false);

    if (err) {
      console.log(res.msg);
      return;
    }

    const [err0, res0] = res[0];

    if (err0) {
      console.log(res0.msg);
      return
    }

    const { code, msg, data } = res0

    if (code === 0) {
      renderData(data)
      return;
    }

    console.log(msg)
  }

  const renderData = (result) => {
    data.cache = {};
    data.allData = result.data;
    data.fieldsTotalObject = result.fieldsTotalObject

    const { navFirstItem, navCounts, loading } = dom;

    theNav.setCurItem(navFirstItem, 'all');
    setCacheData();
    handleState(loading, false);
    renderNavCount(navCounts);
  }

  init();
})(document, window);
