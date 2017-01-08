'use strict'

const fastn = require('fastn')({
  _generic: require('fastn/genericComponent'),
  templater: require('fastn/templaterComponent'),
  list: require('fastn/listComponent'),
  text: require('fastn/textComponent'),
  modal: require('modal-component/modalComponent'),
  dropdown: require('../dropdownComponent')
}, true)

let dropdownModel = new fastn.Model({
  dropdowns : ["dropdown Itme 1","drop 2","drop 3","drop 4","ffive","a","another","sommit"]
})

const ui = fastn('div', {class:'page'},
      fastn('dropdown',{options: fastn.binding('dropdowns').attach(dropdownModel),placeholder:'dropdown component' })
)

window.addEventListener('load', function () {
  ui.attach().render()
  document.body.appendChild(ui.element)
})
