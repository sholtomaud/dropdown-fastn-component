'use strict'

const fastn = require('fastn')({
  _generic: require('fastn/genericComponent'),
  templater: require('fastn/templaterComponent'),
  list: require('fastn/listComponent'),
  text: require('fastn/textComponent'),
  modal: require('modal-component/modalComponent'),
  dropdown: require('../dropdownComponent')
}, true)

// let dropdownModel = new fastn.Model({
//   dropdowns : [
//     {
//       value:"drop 1"
//     },
//     {
//       value:"drop 2"
//     },
//     {
//       value:"drop 3"
//     },
//     {
//       value:"drop 4"
//     }
// ]
// })

let dropdownModel = new fastn.Model({
  dropdowns : ["dropdown Itme 1","drop 2","drop 3","drop 4","ffive","a","another","sommit"]
})

const ui = fastn('div', {class:'page'},
  // fastn('list',{
  //   class: 'dropdown',
  //   items: fastn.binding('dropdowns').attach(dropdownModel),
  //   template: function(model, scope){
  //    return
      fastn('dropdown',{options: fastn.binding('dropdowns').attach(dropdownModel),placeholder:'dropdown component' })
      //   autofocus: true,
      //   placeholder: 'Dropdown component',
      //   label: 'some label',
      //   items: fastn.binding('dropdowns').attach(dropdownModel)
      // })
      // fastn('dropdown',{placeholder: 'Hello Dropdown',})
    // }
  // })
)


window.addEventListener('load', function () {
  ui.attach().render()
  document.body.appendChild(ui.element)
})
