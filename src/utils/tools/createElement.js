export const createElement = (tag, inner) => {
  const el = document.createElement(tag);

  el.innerHTML = inner;

  return el;
}