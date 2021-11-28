
export const tplReplace = (tpl, obj) =>
tpl().replace(/{{(.+?)}}/g, (node, key) => obj[key.trim()]);
