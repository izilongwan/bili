export default (tar) => {
  tar.getTarget = (e) => {
    e = e || window.event;

    return e.target || e.srcElement;
  };

  tar.throttle = (fn, delay = 1000, final = true) => {
    let res = null,
      t = null,
      fT = Date.now();

    return (...args) => {
      const cT = Date.now();

      if (cT - fT >= delay) {
        res = fn(...args);
        fT = cT;
      } else if (final) {
        t = setTimeout(() => res = fn(...args), delay);
      }

      return res;
    }
  }

  tar.debounce = (fn, delay = 300, immediate) => {
    let res = null,
        t = null;

    const later = (args) => {
      t = setTimeout(() => {
        res = fn(...args);
        clearTimeout(t);
        t = null;
      }, delay);
    }

    const debounced = (...args) => {
      if (!t) {
        immediate ? res = fn(...args) : later(args);
      } else {
        clearTimeout(t);
        later(args);
      }
    }

    debounced.onremove = () => {
      clearTimeout(t)
      t = null;
    }

    return debounced;
  }

  tar.tplReplace = (tpl, obj) =>
    tpl().replace(/{{(.*?)}}/g, (node, key) => obj[key]);

  tar.addEvent = (elem, type, fn, capture) => {
    if (elem.addEventListener) {
      tar.addEvent = function (elem, type, fn, capture) {
        var capture = capture || false;
        elem.addEventListener(type, fn, capture);
      }
    } else if (elem.attachEvent) {
      tar.addEvent = function (elem, type, fn) {
        elem.attachEvent('on' + type, function () {
          fn.call(elem);
        });
      }
    } else {
      tar.addEvent = function (elem, type, fn) {
        elem['on' + type] = fn;
      }
    }
    tar.addEvent(elem, type, fn, capture);
  }

  tar.filterData = (type, data, field) => {
    switch (type) {
      case 'nav':
        if (field === 'all') {
          return data;
        }

        return data.filter(val => val.field === field);
        break;
      case 'search':
        if (field) {
          const key = field.toLowerCase();

          return data.filter(({ phone_name, slogan }) =>
            phone_name.toLowerCase().includes(key) ||
            slogan.toLowerCase().includes(key)
          )
        }

        return data;
        break;

      default:
        break;
    }
  }

  tar.changeClass = ($tar, className = 'current') => {
    $tar.addClass(className)
        .siblings().removeClass(className);
  }

  tar.getStyle = (elem, prop, type = null) => {
    if (window.getComputedStyle) {
      return prop
        ? parseInt(window.getComputedStyle(elem, type)[prop])
        : window.getComputedStyle(elem, null);
    }
    return prop
      ? parseInt(elem.currentStyle[prop])
      : elem.currentStyle;
  }
}
