export const imgLazyLoad = ((win, doc) => {
	var imageItem = null,
			imagesLen = 0,
			cHeight = 0,
			sTop = 0,
			imageTop = 0,
			src = null,
			n = 0;

	return function (images = doc.images) {
		imagesLen = images.length;
		cHeight = win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight;
		sTop = win.pageYOffset || doc.body.scrollTop || doc.documentElement.scrollTop;

		for (var i = 0; i < imagesLen; i++) {
			imageItem = images[i];
			imageTop = elemPos(imageItem).top;

			if (imageTop < cHeight + sTop) {
				src = imageItem.getAttribute('data-src');

				if (src) {
					imageItem.src = src;
					imageItem.removeAttribute('data-src');
					n++;
				}
			}
		}
	}
})(window, document);

export const tplReplace = (tpl, obj) =>
  tpl().replace(/{{(.+?)}}/g, (node, key) => obj[key.trim()]);

export const createElement = (tag, inner) => {
  const el = document.createElement(tag);

  el.innerHTML = inner;

  return el;
}

export const asyncFunc = async (fn) => {
	try {
		const { data} = await fn();
		return [null, data];

	} catch (err) {
		return [err, null];
	}
}

export const elemPos = (el) => {
	var pos = {
    left: 0,
    top: 0
  }

	while (el) {
		pos.left += el.offsetLeft;
		pos.top += el.offsetTop;
		el = el.offsetParent;
	}

	return pos;
}

export const getUrlParam = (value, str) => {
  var reg = new RegExp("(^|&)" + value + "=([^&]*)(&|$)", "i"),
			res = str
				? str
				: window.location.search.substr(1).match(reg);

	return res && res[2] && decodeURIComponent(res[2]);
}
