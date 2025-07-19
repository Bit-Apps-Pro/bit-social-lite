/* eslint-disable unicorn/no-null */
/* eslint-disable no-undef */
module.exports = {
  functionNames: ['__'],
  funcArgumentsMap: {
    __: ['msgid'],
    _n: ['msgid', 'msgid_plural'],
    _x: ['msgid', 'msgctxt'],
    _nx: ['msgid', 'msgid_plural', null, 'msgctxt']
  },
  trim: true,
  filename: true
}
