import '../css/mixins.scss'
import '../css/iconfont.css'
import '../css/resets.css'
import '../css/iconfont.css'
import '../css/fonts.scss'
import '../css/common.scss'
import '../css/carousel.scss'
import '../css/header.scss'
import '../css/footer.scss'
import '../css/first.scss'
import '../css/board.scss'
import '../css/nav.scss'
import '../css/pagination.scss'
import '../css/loading.scss'
import '../css/top.scss'
import '../css/notFound.scss'
import '../css/noDataTip.scss'

import Nav from '../modules/Nav'
import Pagination from '../modules/Pagination'
import { SEARCH_NAV } from '../config'
import { tplReplace, imgLazyLoad } from '../utils/tools'
import * as API from '../api'
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
  }

  const data = {
    cache: {},
    field: '',
    pageSize: 20,
    curPage: 1
  };

  const init = () => {
    data.field = getField();
    data.tpl = getTpl(data.field);

    new Nav('.J_nav', SEARCH_NAV, data.field, onNavClick).init();
    new Search('.J_false-search-wrap', onSearchClick).init();
    renderPagination();
    imgLazyLoad();
    bindEvent();
  }

  const bindEvent = () => {
    win.addEventListener('scroll', () => imgLazyLoad(), false);
  }

  const getField = () => {
    const { pathname } = window.location,
          arr = pathname.split('/');

    return arr[arr.length - 1];
  }

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

  const onSearchClick = (value) => {
    if (value) {
      window.open(`/query?q=${ value }`);
    }
  }

  const onPaginationClick = (curPage, render = false) => {
    data.curPage = curPage;
    win.scrollTo(0, 0);
    getCacheData(render);
  }

  const onPageSearchBtnClick = (page) => {
    if (data.curPage !== page) {
      onPaginationClick(page, true);
    }
  }

  const onNavClick = (field) => {
    data.field = field;
    data.curPage = 1;
    data.tpl = getTpl(field);
    getCacheData();
  }

  const handleState = (dom, state) => {
    const { classList } = dom;

    state
      ? classList.remove('hide')
      : classList.add('hide');
  }

  const getListData = async (field, isRenderPagination) => {
    const { pageSize, curPage } = data,
          { loading } = dom;

    handleState(loading, true);

    const conf = {
      field,
      num: pageSize,
      page: curPage,
      type: 0
    }

    const [err, result] = await API.getData(conf)

    handleState(loading, false);

    if (err) {
      console.log(err);
      return;
    }

    const { code, msg, data: res } = result;

    if (code === 0) {
      const isFieldAll = {}.toString.call(res.data) === '[object Object]'
      const ret = isFieldAll ? formatFieldAllData(res) : res
      const conf = Object.assign({}, ret, { pages: res.total })
      setCacheData(res);
      handleRender(conf, curPage, isRenderPagination, isFieldAll);
      return;
    }
  }

  const formatFieldAllData = (res) => {
    const ret = [],
          { data, total } = res

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const rest = data[key];

        ret.push(...rest.data)
      }
    }

    console.log(ret)
    return {
      data: ret,
      total
    }
  }

  const renderList = (data, tpl, isSingleTpl) =>
    data.reduce((prev, cur) =>
      prev += tplReplace(isSingleTpl ? getTpl(cur.field) : tpl,
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

  const setCacheData = (result) => {
    const { field, cache, curPage } = data;

    !cache[field] && (cache[field] = []);
    cache[field][curPage] = result.data;

    !cache[field].pages && (cache[field].pages = result.total);
  }

  const getCacheData = (isRenderPagination = true, isSingleTpl = false) => {
    const { field, cache, curPage } = data,
          { board, noDataTip, pagination, notFound } = dom,
          item = cache[field];

    dom.board.innerHTML = '';
    handleState(board, true);
    handleState(pagination, false);
    handleState(noDataTip, false);
    handleState(notFound, false);

    if (!item) {
      getListData(field, isRenderPagination);
      return;
    }

    if (!item[curPage]) {
      getListData(field, isRenderPagination);
      return;
    }

    const conf = {
      data: item[curPage],
      pages: item.pages
    }

    handleRender(conf, curPage, isRenderPagination, isSingleTpl);
  }

  const handleRender = ({ data: _data, pages }, curPage, isRenderPagination, isSingleTpl) => {
    const { noDataTip, board, pagination, loading } = dom;

    if (pages <= 0) {
      handleState(noDataTip, true);
      handleState(loading, false);
      return;
    }

    board.innerHTML = renderList(_data, data.tpl, isSingleTpl);
    isRenderPagination && renderPagination(curPage, pages);
    handleState(pagination, true);
    handleState(loading, false);
    imgLazyLoad();
  }

  init();
})(document, window);
