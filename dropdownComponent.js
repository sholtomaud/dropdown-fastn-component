'use strict'

const crel = require('crel');
const defaultCss = require('defaultcss');
const debounce = require('debounce');
const tabKey = 9;
const enterKey = 13;
const excapeKey = 27;
const downKey = 40;
const upKey = 38;
const spaceKey = 32;
const deleteKey = 46;
const backspaceKey = 8;
const deleteKeys = [deleteKey,backspaceKey];
const closeKeys = [tabKey, excapeKey, enterKey];
const submitKeys = [enterKey];
const showKeys = [downKey, spaceKey];
const navKeys = [upKey, downKey];

defaultCss('dropdown-component', 'input.dropdown-component{height: 60px;padding: 10px;font-family:"Arial";font-size: 20px;} .dropdown-component-modal{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);}.dropdown-component-modal .content{background:white} .dropdown-option{padding: 10px;font-family:"Arial";font-size: 14px;} .dropdown-option:hover{background-color:lightGray; } .dropdown-option.selected { background-color:#4285F4; color:white;} .modal-component{box-shadow: 0 3px 4px rgba(0,0,0,0.3);background-color:white;margin-left:1px; display:flex;flex-direction: column;overflow:auto;}');

function values(object){
    if(Array.isArray(object)){
        return object.slice();
    }

    let result = [];

    for(let key in object){
        result.push(object[key]);
    }

    return result;
}

module.exports = function(fastn, component, type, settings, children){
    let currentIndex = 0;

    let dropdownModel = new fastn.Model({
            options:[],
            filteredOptions:[],
            show: false
        });

    let currentModel = new fastn.Model({
            item:null
        });

        //Debugging
        dropdownModel.on('.|*', function (data){
            // console.log('dropdownModel data: ',data);
        })

        //Debugging
        currentModel.on('.|*', function (data){
            // console.log('currentModel data: ',data);
        })

    if(!settings.pickValue){
        settings.pickValue = function(value){
            return value;
        };
    }

    dropdownModel.on('value', function(value){
        currentModel.set('item', value);
        component.element.value = value;
    });

    settings.tabindex = 0;
    settings.class = fastn.binding('show', fastn.binding.from(settings.class), function(show, extraClasses){
        return [
            'dropdown-component',
            (show ? 'show' : ''),
            extraClasses
        ];
    }).attach(dropdownModel);

    component.extend('_generic', settings, children);
    component.setProperty('options');
    component.setProperty('value');
    component.setProperty('multiple');
    component.setProperty('show');

    function keyHandler(event){
        let bounds = component.element.getBoundingClientRect();
        dropdownElement.modalElement.style.top = bounds.bottom + 2;
        dropdownElement.modalElement.style.left = bounds.left;
        dropdownElement.modalElement.style.right = bounds.left + 10;
        dropdownElement.modalElement.style.bottom = 'inherit';

        if(!component.show()){
            if(~showKeys.indexOf(event.which)){
                component.show(true);
            }
        }else{
            if(~submitKeys.indexOf(event.which)){
                let options = values(dropdownModel.get('filteredOptions'));
                if (options.length == 1){
                    event.preventDefault();
                    dropdownModel.update({value: options[0]});
                }
                component.show(false);
            }
            if(~navKeys.indexOf(event.which)){
                event.preventDefault();
                let options = values(dropdownModel.get('filteredOptions'));
                currentIndex = options.indexOf( dropdownModel.get('value') );
                let nextIndex =  (currentIndex + (event.which === upKey ? -1 : 1) + options.length) % options.length;

                dropdownModel.set('value', options[nextIndex]);
            }
            if(~closeKeys.indexOf(event.which)){
                component.show(false);
            }
            // if(~deleteKeys.indexOf(event.which)){
            //     dropdownModel.set('value', '');
            // }

        }
    }

    component.render = function(){
        let inputEl = component.element = crel('input', {
          class: 'dropdown-component',
          placeholder: settings.placeholder
        });
        component.emit('render');
    }

    component.on('input',( search )=>{
      let options = dropdownModel.get('options');
      dropdownModel.set('show',true);
      dropdownModel.set('filteredOptions', options.filter( (item)=>{
          if(!item ){
              console.log('no items!')
              return;
          }
          return ~item.toLowerCase().indexOf( search.target.value.toLowerCase() );
        })
      )
    })
    .on('click', function(){
        dropdownModel.set('show', !dropdownModel.get('show'));
    });

    let dropdownElement = fastn('modal',  {
        show: fastn.binding('show').attach(dropdownModel),
        content: function(scope){
            return fastn('div',
                fastn('list', {
                    'class': 'options',
                    items: fastn.binding('filteredOptions|*'),
                    template: function (model,scope) {
                      let value = model.get('item');

                      return fastn('div',{class: fastn.binding('item', fastn.binding('value|*').attach(dropdownModel), function(item, value){
                          var selected = component.multiple() && Array.isArray(value) && ~value.indexOf(item) || item === value;
                          return [
                              'dropdown-option',
                              selected ? 'selected' : ''
                          ];
                        })}, value)
                        .on('click', ()=>{
                          setTimeout(function(){
                              dropdownModel.update({show:false,value:value});
                              component.element && component.element.focus();
                          }, settings.closeDelay || 0);
                        });
                    }
                }).attach(dropdownModel)
            ).on('keydown', keyHandler);
        }
    });

    component.insert(
        dropdownElement
    );

    component.options.on('update', function(){
        let options = component.options();
        if(!options || typeof options !== 'object'){
            return;
        }

        dropdownModel.set('options', options);

    });

    dropdownModel.on('options', component.options);

    function updateMultiple(multiple){
        if(multiple && !Array.isArray(dropdownModel.get('value'))){
            dropdownModel.set('value', []);
        }
    }
    dropdownModel.on('multiple', updateMultiple);
    updateMultiple(settings.multiple);


    dropdownModel.on('value|*', function(value){
        component.value(settings.pickValue(value));
        component.emit('change', value);
    });

    component.show.on('change', dropdownModel.set.bind(dropdownModel, 'show'));
    dropdownModel.on('show', component.show);

    component.multiple.on('change', dropdownModel.set.bind(dropdownModel, 'multiple'));

    component.on('destroy', dropdownModel.detach.bind(dropdownModel));

    component._events.keydown = keyHandler

    return component;
};

module.exports.expectedComponents = ['modal', 'text', '_generic', 'list', 'templater'];
