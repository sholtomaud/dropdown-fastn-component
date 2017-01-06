var fastn = require('fastn')({
  _generic: require('fastn/genericComponent'),
  list: require('fastn/listComponent'),
  templater: require('fastn/templaterComponent'),
  text: require('fastn/textComponent'),
  modal: require('modal-component/modalComponent'),
  dropdown: require('./dropdownComponent')
})

module.exports = function (settings) {
  return fastn('dropdown', settings).attach().render()
}
