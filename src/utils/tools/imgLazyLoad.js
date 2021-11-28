import { elemPos } from './elemPos'

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
