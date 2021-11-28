export const getUrlParam = (value, str) => {
  var reg = new RegExp("(^|&)" + value + "=([^&]*)(&|$)", "i"),
			res = str
				? str
				: window.location.search.substr(1).match(reg);

	return res && res[2] && decodeURIComponent(res[2]);
}