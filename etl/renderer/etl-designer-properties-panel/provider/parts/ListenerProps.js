'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    is = require('bpmn-js/lib/util/ModelUtil').is;

var componentProvider = require('../../../util/EtlDesignerComponentProvider');
var selectOptionUtil = require('../../../../../jsr352-js/app/util/SelectOptionUtil');

module.exports = function (group, element, bpmnFactory) {
  if (is(element, 'jsr352:Listener')) {
    group.entries.push(entryFactory.selectBox({
      id: 'ref',
      description: 'Specifies the name of a batch artifact',
      label: 'Ref',
      modelProperty: 'ref',
      selectOptions: selectOptionUtil.toSelectOption(componentProvider.getListeners())
    }));

  }
};
