'use strict';

var domify = require('min-dom/lib/domify');

var forEach = require('lodash/collection/forEach');

var isList = function(list) {
  return !(!list || Object.prototype.toString.call(list) !== '[object Array]');
};

var addEmptyParameter = function(list) {
  return list.concat([ { name: '', value: '' } ]);
};

var createOption = function(option) {
  return '<option value="' + option.value + '">' + option.name + '</option>';
};

/**
 * @param  {Object} options
 * @param  {string} options.id
 * @param  {string} [options.label]
 * @param  {Array<Object>} options.selectOptions
 * @param  {string} options.modelProperty
 * @param  {boolean} options.emptyParameter
 * @param  {function} options.disabled
 * @param  {Object} defaultParameters
 * @param  {Object} options.buttonAction
 * @param  {string} options.buttonLabel
 *
 * @return {Object}
 */
var selectbox = function(options, defaultParameters) {

  function defaultButtonAction (element, inputNode){
    console.log('default action');

  }


  var resource = defaultParameters,
      label = options.label || resource.id,
      buttonLabel    = ( options.buttonLabel || 'add' ),
      selectOptions = options.selectOptions || [ { name: '', value: '' } ],
      modelProperty = options.modelProperty,
      emptyParameter = options.emptyParameter,
      canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
      description = options.description,
      actionName     = ( typeof options.buttonAction !== 'undefined' ) ? options.buttonAction.name : 'buttonAction',
      actionMethod   = ( typeof options.buttonAction !== 'undefined' ) ? options.buttonAction.method : defaultButtonAction;


  if (emptyParameter) {
    selectOptions = addEmptyParameter(selectOptions);
  }


  resource.html =
      '<label for="camunda-' + resource.id + '"' +
      (canBeDisabled ? 'data-show="isDisabled" ' : '') + '>' + label + '</label>' +
      '<div class="bpp-field-wrapper">' +
      '<select id="camunda-' + resource.id + '-select" name="' + modelProperty + '"' +
      (canBeDisabled ? 'data-show="isDisabled" ' : '') + ' data-value>';

  if (isList(selectOptions)) {
    forEach(selectOptions, function(option) {
      resource.html += '<option value="' + option.value + '">' + (option.name || '') + '</option>';
    });
  }

  resource.html += '</select><br>';
  resource.html += '<button class="' + actionName + '" data-action="' + actionName + '">' + buttonLabel + '</button>' +
      '</div>';

  resource[actionName] = actionMethod;

  /**
   * Fill the select box options dynamically.
   *
   * Calls the defined function #selectOptions in the entry to get the
   * values for the options and set the value to the inputNode.
   *
   * @param {djs.model.Base} element
   * @param {HTMLElement} entryNode
   * @param {EntryDescriptor} inputNode
   * @param {Object} inputName
   * @param {Object} newValue
   */
  resource.setControlValue = function(element, entryNode, inputNode, inputName, newValue) {
    if (typeof selectOptions === 'function') {

      var options = selectOptions(element, inputNode);

      if (options) {

        // remove existing options
        while (inputNode.firstChild) {
          inputNode.removeChild(inputNode.firstChild);
        }

        // add options
        forEach(options, function(option) {
          var template = domify(createOption(option));

          inputNode.appendChild(template);
        });


      }
    }

    // set select value
    if (newValue !== undefined) {
      inputNode.value = newValue;
    }

  };

  if (canBeDisabled) {
    resource.isDisabled = function() {
      return !options.disabled.apply(resource, arguments);
    };
  }

  resource.cssClasses = ['dropdown'];

  return resource;
};

module.exports = selectbox;
