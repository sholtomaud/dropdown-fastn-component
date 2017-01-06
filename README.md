# dropdown-component

Input component with dropdown from list of supplied options

Built with `fastn.js`

# Usage

## Settings

```
{
    options: array or object of options
    value: optional, any type
    pickValue: optional, function(item){
        return anything

        eg:

        return item.id
    },
    class: optional, string or array of strings
}
```

## Standalone

```
// Create the dropdown
var dropdown = createDropdown({
        options: ['foo', 'bar', 'baz']
    });

// Watch for changes to the dropdown's value
dropdown.value.on('change', function(value){
    console.log(value);
});

// Put the dropdown's element somewhere in the DOM.
document.body.appendChild(dropdown.element);
```

## Fastn component

```
var fastn = require('fastn')({
    ... other components...
    dropdown: require('dropdown-component/dropdownComponent')
});

var dropdown = fastn('dropdown', { options... });
```

## Inserting

```
someDomNode.appendChild(dropdown.element);
```

## Properties

The below properties are getter/setters, and event emitters.

 - options
 - value

Example usage of value property:

```
// retrieve value
dropdown.value(); // returns value

// set value
dropdown.value(newValue); -// returns dropdown.value property

// watch for changes
dropdown.value.on('change', function(value){
    // Do something
});
```
