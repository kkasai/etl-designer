var customEntryFactory = require('../../factory/CustomEntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

var componentProvider = require('../../../util/EtlDesignerComponentProvider');
var selectOptionUtil = require('../../../../../jsr352-js/app/util/SelectOptionUtil');

module.exports = function(group, element) {
  if (is(element, 'jsr352:Step')) {
    group.entries.push(customEntryFactory.comboBox({
      id : 'errorEntity',
      label : 'errorEntity',
      modelProperty : 'errorEntity',
      selectOptions : selectOptionUtil.toSelectOption(componentProvider.getErrorEntities())
    }));
  }
};