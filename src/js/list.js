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
import { FIELDS } from '../config'
import { tplReplace, asyncFunc, imgLazyLoad } from '../utils/tools'
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
    pageSize: 60,
    curPage: 1
  };

  const init = () => {
    data.field = getField();
    data.tpl = getTpl(data.field);

    new Nav('.J_nav', FIELDS, data.field, onNavClick).init();
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

      case 'cinema':
      case 'bangumi':
        return itemFourTpl
      default:
        break;
    }
  }

  const onSearchClick = (value) => {
    if (value) {
      window.open(`/query?q=${ value }`);
    }
  }

  const onPaginationClick = (curPage, pages) => {
    data.curPage = curPage;
    win.scrollTo(0, 0);
    getCacheData(false);
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
    const { apiName } = getApiName(field),
          { pageSize, curPage } = data,
          { loading } = dom;

    handleState(loading, true);

    const conf = {
      apiName,
      num: pageSize,
      page: curPage
    }

    const [err, result] = await asyncFunc(
      () => API.getData(conf)
    );

    if (err) {
      console.log(err);
      handleState(loading, false);
      return;
    }

    const { code, msg, res } = result;

    if (code === 0) {
      const conf = Object.assign({}, res, { pages: res.count });
      setCacheData(res);
      handleRender(conf, curPage, isRenderPagination);
      return;
    }
    handleState(loading, false);

    console.log(msg);
  }

  const getApiName = (field) =>
    FIELDS.find(item => item.field === field);

  const renderList = (data, tpl) =>
    data.reduce((prev, cur) =>
      prev += tplReplace(tpl,
        Object.assign({}, cur, {
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

  const setCacheData = (result) => {
    const { field, cache, curPage } = data;

    !cache[field] && (cache[field] = []);
    cache[field][curPage] = result.data;

    !cache[field].pages && (cache[field].pages = result.count);
  }

  const getCacheData = (isRenderPagination = true) => {
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

    handleRender(conf, curPage, isRenderPagination);
  }

  const handleRender = ({ data: _data, pages }, curPage, isRenderPagination) => {
    const { noDataTip, board, pagination, loading } = dom;

    if (pages <= 0) {
      handleState(noDataTip, true);
      handleState(loading, false);
      return;
    }

    board.innerHTML = renderList(_data, data.tpl);
    isRenderPagination && renderPagination(curPage, pages);
    handleState(pagination, true);
    handleState(loading, false);
    imgLazyLoad();
  }

  init();
})(document, window);
