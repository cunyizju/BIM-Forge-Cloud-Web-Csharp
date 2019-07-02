// *******************************************
// Model Summary Extension
// *******************************************
function ModelSummaryExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.panel = null; // create the panel variable
}

ModelSummaryExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ModelSummaryExtension.prototype.constructor = ModelSummaryExtension;

ModelSummaryExtension.prototype.load = function () {
    if (this.viewer.toolbar) {
        // Toolbar is already available, create the UI
        this.createUI();
    } else {
        // Toolbar hasn't been created yet, wait until we get notification of its creation
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }
    return true;
};

ModelSummaryExtension.prototype.onToolbarCreated = function () {
    this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

ModelSummaryExtension.prototype.createUI = function () {
    var _this = this;

    // prepare to execute the button action
    var modelSummaryToolbarButton = new Autodesk.Viewing.UI.Button('runModelSummaryCode');
    modelSummaryToolbarButton.onClick = function (e) {

        // check if the panel is created or not
        if (_this.panel == null) {
            _this.panel = new ModelSummaryPanel(_this.viewer, _this.viewer.container, 'modelSummaryPanel', 'Model Summary');
        }
        // show/hide docking panel
        _this.panel.setVisible(!_this.panel.isVisible());

        // if panel is NOT visible, exit the function
        if (!_this.panel.isVisible()) return;
        // ok, it's visible, let's get the summary!

        // first, the Viewer contains all elements on the model, including
        // categories (e.g. families or part definition), so we need to enumerate
        // the leaf nodes, meaning actual instances of the model. The following
        // getAllLeafComponents function is defined at the bottom
        _this.getAllLeafComponents(function (dbIds) {

            // now for leaf components, let's get some properties
            // and count occurrences of each value.
            var propsToList = ['Material', 'Level'];

            // get only the properties we need for the leaf dbIds
            _this.viewer.model.getBulkProperties(dbIds, propsToList, function (dbIdsProps) {

                // iterate through the elements we found
                dbIdsProps.forEach(function (item) {

                    // and iterate through each property
                    item.properties.forEach(function (itemProp) {

                        // now use the propsToList to store the count as a subarray
                        if (propsToList[itemProp.displayName] === undefined)
                            propsToList[itemProp.displayName] = {};

                        // now start counting: if first time finding it, set as 1, else +1
                        if (propsToList[itemProp.displayName][itemProp.displayValue] === undefined)
                            propsToList[itemProp.displayName][itemProp.displayValue] = 1;
                        else
                            propsToList[itemProp.displayName][itemProp.displayValue] += 1;
                    });
                });

                // now ready to show!
                // the Viewer PropertyPanel has the .addProperty that receives the name, value
                // and category, that simple! So just iterate through the list and add them
                propsToList.forEach(function (propName) {
                    if (propsToList[propName] === undefined) return;
                    Object.keys(propsToList[propName]).forEach(function (propValue) {
                        _this.panel.addProperty(
                    /*name*/     propValue,
                    /*value*/    propsToList[propName][propValue],
                    /*category*/ propName);
                    });
                });
            })
        })

    };
    // modelSummaryToolbarButton CSS class should be defined on your .css file
    // you may include icons, below is a sample class:
    modelSummaryToolbarButton.addClass('modelSummaryToolbarButton');
    modelSummaryToolbarButton.setToolTip('Model Summary');

    // SubToolbar
    this.subToolbar = (this.viewer.toolbar.getControl("MyAppToolbar") ?
        this.viewer.toolbar.getControl("MyAppToolbar") :
        new Autodesk.Viewing.UI.ControlGroup('MyAppToolbar'));
    this.subToolbar.addControl(modelSummaryToolbarButton);

    this.viewer.toolbar.addControl(this.subToolbar);
};

ModelSummaryExtension.prototype.unload = function () {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
};

ModelSummaryExtension.prototype.getAllLeafComponents = function (callback) {
    var cbCount = 0; // count pending callbacks
    var components = []; // store the results
    var tree; // the instance tree

    function getLeafComponentsRec(parent) {
        cbCount++;
        if (tree.getChildCount(parent) != 0) {
            tree.enumNodeChildren(parent, function (children) {
                getLeafComponentsRec(children);
            }, false);
        } else {
            components.push(parent);
        }
        if (--cbCount == 0) callback(components);
    }
    this.viewer.getObjectTree(function (objectTree) {
        tree = objectTree;
        var allLeafComponents = getLeafComponentsRec(tree.getRootId());
    });
};

// *******************************************
// Model Summary Panel
// *******************************************
function ModelSummaryPanel(viewer, container, id, title, options) {
    this.viewer = viewer;
    Autodesk.Viewing.UI.PropertyPanel.call(this, container, id, title, options);
}
ModelSummaryPanel.prototype = Object.create(Autodesk.Viewing.UI.PropertyPanel.prototype);
ModelSummaryPanel.prototype.constructor = ModelSummaryPanel;

Autodesk.Viewing.theExtensionManager.registerExtension('ModelSummaryExtension', ModelSummaryExtension);