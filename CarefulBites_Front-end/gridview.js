let deleteStorageId = null
const ItemStore = new DevExpress.data.CustomStore({
    key: 'itemId',
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        [
            'skip', //The number of data objects to be skipped from the result set's start. In conjunction with take, used to implement paging.
            'take', //The number of data objects to be loaded. In conjunction with skip, used to implement paging.
            'requireTotalCount', //Indicates whether the total count of data objects is needed.
            'requireGroupCount', //Indicates whether a top-level group count is required. Used in conjunction with the filter, take, skip, requireTotalCount, and group settings.
            'sort', //A sort expression.
            'filter', //A filter expression.
            'totalSummary',//Contains summary definitions with the following structure, where summaryType can be "sum", "avg", "min", "max" or "count":
            'group', //Defines grouping levels to be applied to the data. 
            'groupSummary', //Contains group summary definitions with the following structure, where summaryType can be "sum", "avg", "min", "max" or "count":
        ].forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        $.ajax({
            url: baseURL + "/usersFood/" + encodeURIComponent(sessionStorage.getItem("CurrentUserId")),
            dataType: 'json',
            data: args,
            success(result) {
                deferred.resolve(result, {
                    totalCount: result.totalCount,
                    summary: result.summary,
                    groupCount: result.groupCount,
                });
            },
            error() {
                deferred.reject('Data Loading Error');
            },
            timeout: 5000,
        });

        return deferred.promise();
    },
    insert: function (values) {
        data = {
            item1: values,
            item2: itemTemplateAndCategoriesFormData.categoryIds
        }
        var deferred = $.Deferred();
        $.ajax({
            url: baseURL + "/foodItems",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success(result) {
                deferred.resolve(result)
                IngredientSelection()
            },
            error() {
                deferred.reject("Insertion failed")
            }
        })
        return deferred.promise();
    },
    update: function (key, values) {
        jsonpatchstr = "["
        Object.keys(values).forEach(key => {
            if (typeof (values[key]) == 'number') {
                jsonpatchstr += `{ \"op\": \"replace\", \"path\": \"/${key}\", \"value\": ${values[key]} },`
            }
            else if (typeof (values[key]) == 'object') {
                jsonpatchstr += `{ \"op\": \"replace\", \"path\": \"/${key}\", \"value\": \"${values[key].toISOString()}\" },`
            }
            else {
                jsonpatchstr += `{ \"op\": \"replace\", \"path\": \"/${key}\", \"value\": \"${values[key]}\" },`
            }

        })
        jsonpatchstr = jsonpatchstr.slice(0, -1)
        jsonpatchstr += "]"

        var deferred = $.Deferred();
        $.ajax({
            url: baseURL + "/foodItems/" + encodeURIComponent(key),
            type: "patch",
            dataType: "json",
            data: jsonpatchstr,
            contentType: "application/json-patch+json; charset=utf-8",
            success(result) {
                deferred.resolve(result)
                IngredientSelection()
            },
            error() {
                deferred.reject("Update failed")
            }
        })
        return deferred.promise();
    },
    remove: function (key) {
        var deferred = $.Deferred();
        $.ajax({
            url: baseURL + "/foodItems/" + encodeURIComponent(key),
            method: "DELETE",
            contentType: "application/json; charset=utf-8",
            success(result) {
                deferred.resolve(result)
                IngredientSelection()
            },
            error() {
                deferred.reject("Deletion failed")
            }
        })
        return deferred.promise();
    },
    byKey: function (key) {
        var d = new $.Deferred();
        $.get(baseURL + "/foodItems/" + key)
            .done(function (dataItem) {
                return dataItem
            });
        return d.promise().then();
    }

});

let itemStorageForm = {
    name: '',
    userId: -1
}

const popupContentTemplateItemStorageFormDeleteOrMove = function () {
    return $('<div>').append(
        $('<div />').attr('id', 'ITEMSTORAGE-FORM-ID').dxForm({
            labelMode: 'floating',
            formData: itemStorageForm,
            showColonAfterLabel: false,
            labelLocation: 'left',
            colcount: 1,
            title: 'What do you wish to do with the items in the storage?',
            items:
                [
                    {
                        itemType: 'group',
                        caption: 'MOVE',
                        items: [{
                            caption: 'Move To',
                            editorType: "dxLookup",
                            editorOptions: {
                                placeholder: 'Select a value',
                                dataSource: Object.values(ItemStorageDictDelete),
                                displayExpr: 'name',
                                valueExpr: 'itemStorageId',
                                showCancelButton: true,
                                onValueChanged: function (e) {
                                    key = e.value;
                                },
                            },
                        },
                        {
                            itemType: 'button',
                            horizontalAlignment: 'center',
                            buttonOptions: {
                                text: 'Move',
                                type: 'default',
                                useSubmitBehavior: false,
                                onClick() {
                                    $.ajax({
                                        url: baseURL + "/itemStorages/" + encodeURIComponent(deleteStorageId) + '?destinationId=' + encodeURIComponent(key),
                                        dataType: 'json',
                                        method: "DELETE",
                                        contentType: "application/json; charset=utf-8",
                                        success(result) {
                                            location.reload()
                                        }
                                    })
                                }
                            }

                        }
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: 'DELETE ALL',
                        items: [
                            {
                                itemType: 'button',
                                horizontalAlignment: 'center',
                                buttonOptions: {
                                    text: 'Delete All',
                                    type: 'danger',
                                    useSubmitBehavior: false,
                                    onClick() {
                                        $.ajax({
                                            url: baseURL + "/itemStorages/" + encodeURIComponent(deleteStorageId) + '?destinationId=-1',
                                            dataType: 'json',
                                            method: "DELETE",
                                            contentType: "application/json; charset=utf-8",
                                            success(result) {
                                                location.reload()
                                            }
                                        })
                                    }
                                },
                            },]
                    },
                    {
                        itemType: 'button',
                        horizontalAlignment: 'right',
                        buttonOptions: {
                            text: 'Cancel',
                            type: 'normal',
                            useSubmitBehavior: false,
                            onClick() {
                                storagePopUpDeleteOrMove.hide()
                            }
                        }
                    }
                ]
        }))
}

const popupContentTemplateItemStorageForm = function () {
    return $('<div>').append(
        $('<div />').attr('id', 'ITEMSTORAGE-FORM-ID').dxForm({
            labelMode: 'floating',
            formData: itemStorageForm,
            readOnly: false,
            showColonAfterLabel: true,
            labelLocation: 'left',
            minColWidth: 300,
            colCount: 1,
            items: [{
                itemType: 'group',
                caption: 'Create',
                items:
                    [
                        {
                            dataField: 'name',
                            caption: 'Name',
                            validationRules: [{
                                type: 'required',
                                message: 'Name is required'
                            }],
                        },
                        {
                            dataField: 'userId',
                            dataType: 'Number',
                            caption: 'UserId',
                            visible: false,
                            editorOptions: { value: parseInt(sessionStorage.getItem('CurrentUserId')) },
                        },
                        {
                            itemType: 'button',
                            horizontalAlignment: 'center',
                            buttonOptions: {
                                text: 'Create',
                                type: 'success',
                                useSubmitBehavior: false,
                                onClick() {
                                    DevExpress.ui.notify({
                                        message: 'You have submitted the form',
                                        position: {
                                            my: 'center top',
                                            at: 'center top',
                                        },
                                    }, 'success', 3000);
                                    itemStorageForm
                                    console.log(itemStorageForm)
                                    newItemStorage = {
                                        name: itemStorageForm.name,
                                        userId: parseInt(sessionStorage.getItem('CurrentUserId'))
                                    }
                                    $.ajax({
                                        url: baseURL + "/itemStorages",
                                        dataType: 'json',
                                        method: "POST",
                                        async: false,
                                        data: JSON.stringify(newItemStorage),
                                        contentType: "application/json; charset=utf-8",
                                    })
                                    location.reload()
                                }
                            },
                        },
                    ]
            },
            {
                itemType: 'group',
                caption: 'Delete',
                items:
                    [
                        {
                            caption: 'Name',
                            editorType: "dxLookup",
                            editorOptions: {
                                placeholder: 'Select a value',
                                dataSource: Object.values(ItemStorageDict),
                                displayExpr: 'name',
                                valueExpr: 'itemStorageId',
                                showCancelButton: true,
                                onValueChanged: function (e) {
                                    key = e.value;
                                },
                            },
                        },
                        {
                            dataField: 'userId',
                            dataType: 'Number',
                            caption: 'UserId',
                            visible: false,
                            editorOptions: { value: parseInt(sessionStorage.getItem('CurrentUserId')) },
                        },
                        {
                            itemType: 'button',
                            horizontalAlignment: 'center',
                            buttonOptions: {
                                text: 'Delete',
                                type: 'danger',
                                useSubmitBehavior: false,
                                onClick() {
                                    deleteStorageId = key
                                    const flatItems = $('#itemGrid').dxDataGrid("instance").getDataSource()._items.flatMap(item => item.items)
                                    var match = flatItems.find(item => item.itemStorageId === key)

                                    var result = DevExpress.ui.dialog.confirm("<p>Are you sure?</p>", "Confirm changes")
                                    result.done(function (dialogResult) {
                                        if (dialogResult) {
                                            if (typeof (match) !== 'undefined') {
                                                console.log('Do something')
                                                ItemStorageDictDelete = ItemStorageDict
                                                delete ItemStorageDictDelete[deleteStorageId]
                                                storagePopUpDeleteOrMove.show()
                                            }
                                            else {
                                                $.ajax({
                                                    url: baseURL + "/itemStorages/" + encodeURIComponent(key),
                                                    dataType: 'json',
                                                    method: "DELETE",
                                                    async: false,
                                                    contentType: "application/json; charset=utf-8",
                                                })
                                                location.reload()
                                            }
                                        }
                                    })
                                }
                            },
                        },
                    ]
            }]
        })
    )
};


let itemTemplateAndCategoriesFormData = {
    itemTemplateId: -1,
    categoryIds: []
};
const popupContentTemplateTemplateAndCategories = function () {
    return $('<div>').append(
        $('<div />').attr('id', 'ADD-FROM-TEMPLATE-FORM-ID').dxForm({
            labelMode: 'floating',
            formData: itemTemplateAndCategoriesFormData,
            showColonAfterLabel: false,
            labelLocation: 'left',
            colcount: 1,
            items: [{
                itemType: 'group',
                caption: 'Step 1',
                items: [{
                    caption: 'Select a Template',
                    editorType: 'dxLookup',
                    editorOptions: {
                        placeholder: 'Choose a Template',
                        dataSource: Object.values(ItemTemplates),
                        displayExpr: 'name',
                        valueExpr: 'itemTemplateId',
                        showCancelButton: true,
                        onValueChanged: function (e) {
                            itemTemplateAndCategoriesFormData.itemTemplateId = e.value;
                        },
                    }
                },
                ]
            },
            {
                itemType: 'group',
                caption: 'Step 2',
                items: [{
                    caption: 'Select Categories',
                    editorType: 'dxTagBox',
                    editorOptions: {
                        placeholder: 'Select Categories',
                        dataSource: Object.values(ItemCategories),
                        valueExpr: "categoryId",
                        displayExpr: "name",
                        showSelectionControls: true,
                        onValueChanged: function (e) {
                            itemTemplateAndCategoriesFormData.categoryIds = e.value;
                        }
                    }
                }]
            },
            {
                itemType: 'group',
                items: [{
                    itemType: 'button',
                    horizontalAlignment: 'center',
                    buttonOptions: {
                        text: '+ Add Item',
                        type: 'success',
                        useSubmitBehavior: true,
                        onClick(e) {

                            templateAndCategoriesPopup.hide()
                            $('#itemGrid').dxDataGrid("instance").addRow();
                        }
                    },
                },]
            },
            ]
        })
    )
};
$(() => {
    ItemStorageDict = []
    ItemStorageDictDelete = []

    $.ajax({
        url: baseURL + "/itemStorages/?userId=" + sessionStorage.getItem('CurrentUserId'),
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            ItemStorageDict = data.reduce((obj, item) => {
                obj[item.itemStorageId] = item;
                return obj;
            }, {});
        }
    })

    ItemTemplates = []
    $.ajax({
        url: baseURL + "/itemTemplates",
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            ItemTemplates = data.reduce((obj, item) => {
                obj[item.itemTemplateId] = item;
                return obj;
            }, {});
        }
    })

    ItemCategories = []
    $.ajax({
        url: baseURL + "/categories",
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            ItemCategories = data.reduce((obj, item) => {
                obj[item.categoryId] = item;
                return obj;
            }, {});

            console.log(ItemCategories)
        }
    })

    $("#tabs").dxTabPanel({
        animationEnabled: true,
        items: [
            {
                title: 'Items',
                icon: 'cart',
                template: function (itemData, itemIndex, element) {
                    const grid = $("<div id=\"itemGrid\">")
                    grid.appendTo(element);
                    grid.dxDataGrid({
                        dataSource: ItemStore,
                        columnHidingEnabled: true,
                        rowAlternationEnabled: false,
                        showColumnLines: false,
                        showRowLines: true,
                        showBorders: true,
                        noDataText: ItemStorageDict.length === 0 ? "To get started, try creating a storage in STORAGE MANAGEMENT." : "Great! Now click the ADD button above the grid.",
                        filterRow: {
                            visible: (screen.width > 580) ? true : false,
                            applyFilter: 'auto',
                        },
                        searchPanel: {
                            visible: (screen.width > 580) ? true : false,
                        },
                        headerFilter: {
                            visible: true,
                        },
                        editing: {
                            mode: 'form',
                            form: {
                                items: [{
                                    itemType: "group",
                                    items: [
                                        { dataField: "name" },
                                        { dataField: "amount" },
                                        { dataField: "unit" },
                                        {
                                            dataField: "itemStorageId",
                                            lookup: {
                                                dataSource: Object.values(ItemStorageDict),
                                                displayExpr: 'name',
                                                valueExpr: 'itemStorageId'
                                            }
                                        },
                                        { dataField: "openDate" },
                                        { dataField: "expirationDate" },
                                        { dataField: "daysAfterOpen" },
                                    ]
                                },]
                            },
                            allowUpdating: true,
                            allowAdding: true,
                            allowDeleting: true,
                        },
                        onEditingStart: function (e) {
                            row = e.data
                        },
                        onRowPrepared(e) {
                            if (e.rowType === 'data' && e.cells.length > 0) {
                                if (!e.isEditing) {
                                    const expirationDate = new Date(Date.parse(e.data.expirationDate));
                                    const currentDate = new Date();
                                    currentDate.setHours(0, 0, 0, 0);

                                    const differenceInDays = (expirationDate - currentDate) / (1000 * 60 * 60 * 24);

                                    // Get the cell element for the expirationDate column
                                    const expirationDateCell = e.cells.find(element => element.column.caption === 'Exp. Date');
                                    if (differenceInDays < 0) {
                                        $(expirationDateCell.cellElement[0]).css('color', 'red');
                                    }
                                    else if (differenceInDays <= 3 && differenceInDays >= 0) {
                                        $(expirationDateCell.cellElement[0]).css('color', 'orange');
                                    }
                                }
                            }
                        },
                        onInitNewRow: function (e) {
                            if (itemTemplateAndCategoriesFormData.itemTemplateId != -1) {
                                Template = $.ajax({
                                    url: baseURL + "/itemTemplates/" + itemTemplateAndCategoriesFormData.itemTemplateId,
                                    method: 'GET',
                                    contentType: "application/json; charset=utf-8",
                                    async: false,
                                    success: function (data) {
                                        return data
                                    }
                                })
                                e.data.name = Template.responseJSON.name
                                e.data.caloriesPer = Template.responseJSON.caloriesPer
                                e.data.amount = Template.responseJSON.amount
                                e.data.unit = Template.responseJSON.unit
                                e.data.daysAfterOpen = Template.responseJSON.daysAfterOpen
                                e.data.itemTypeId = Template.responseJSON.itemTypeId
                            }
                        },
                        toolbar: {
                            items: [{
                                widget: "dxButton",
                                location: 'before',
                                options: {
                                    stylingMode: 'contained',
                                    text: 'Storage Management',
                                    elementAttr: {
                                        id: 'storage-mgmt-button',
                                    },
                                    type: 'storage',
                                    onClick: () => {
                                        itemStoragePopUp.show();
                                    }
                                }
                            },
                            {
                                widget: "dxButton",
                                options: {
                                    stylingMode: 'contained',
                                    text: 'Add Item',
                                    elementAttr: {
                                        id: 'add-item-button',
                                    },
                                    icon: 'plus',
                                    type: 'add-item',
                                    onClick: () => {
                                        templateAndCategoriesPopup.show();
                                        // $('#itemGrid').dxDataGrid("instance").addRow();
                                    }
                                }
                            },
                            {
                                name: 'searchPanel',
                                cssClass: 'item-search-panel',
                                options: {
                                    elementAttr: {
                                        id: 'item-search-panel'
                                    },
                                }
                            }
                            ]
                        },
                        columns: [
                            {
                                dataField: 'itemId',
                                dataType: 'number',
                                visible: false
                            },
                            {
                                dataField: 'name',
                                dataType: 'string',
                                placeholder: 'Name of item e.g Milk',
                                editorOptions: {
                                    elementAttr: {
                                        id: 'itemName'
                                    },
                                }
                            },
                            {
                                dataField: 'amount',
                                dataType: 'number',
                                caption: (screen.width > 580) ? 'Amount' : 'Amt.',
                                width: (screen.width > 580) ? 82 : 62,
                                allowSorting: false,
                                allowFiltering: false,
                                placeholder: 'The amount left of the item',
                                cellTemplate: function (container, options) {
                                    container.addClass('reduce-right-gap').text(options.text);
                                },
                                editorOptions: {
                                    elementAttr: {
                                        id: 'amount'
                                    },
                                }
                            },
                            {
                                dataField: 'unit',
                                calculateCellValue: function (rowData) {
                                    return rowData.unit;
                                },
                                calculateDisplayValue: function (rowData) {
                                    if (rowData.unit == 0) {
                                        return 'kg'
                                    } else if (rowData.unit == 1) {
                                        return 'L'
                                    } else if (rowData.unit == 2) {
                                        return 'pcs.'
                                    } else {
                                        return 'Error: Unit not recognised.'
                                    }
                                },
                                width: 33,
                                alignment: 'left',
                                caption: '',
                                allowSorting: false,
                                allowFiltering: false,
                                cellTemplate: function (container, options) {
                                    container.addClass('reduce-left-gap').text(options.text);
                                },
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    displayExpr: 'text',
                                    valueExpr: 'value',
                                    elementAttr: {
                                        id: 'unit'
                                    },
                                    items: [
                                        { value: 0, text: 'kg' },
                                        { value: 1, text: 'L' },
                                        { value: 2, text: 'pcs.' },
                                    ],
                                }
                            },
                            {
                                dataField: 'itemStorageId',
                                caption: 'Storage',
                                placeholder: 'The placement of the item',
                                width: 200,
                                lookup: {
                                    dataSource: Object.values(ItemStorageDict),
                                    displayExpr: 'name',
                                    valueExpr: 'itemStorageId'
                                },
                                editorOptions: {
                                    elementAttr: {
                                        id: 'addItemStorage'
                                    },
                                }
                            },
                            {
                                dataField: 'caloriesPer',
                                dataType: 'number',
                                visible: false,
                                editorOptions: {
                                    elementAttr: {
                                        id: 'caloriesPer'
                                    },
                                }
                            },
                            {
                                dataField: 'openDate',
                                dataType: 'date',
                                placeholder: '...',
                                width: 120,
                                editorOptions: {
                                    elementAttr: {
                                        id: 'openDate'
                                    },
                                }
                            },
                            {
                                dataField: 'expirationDate',
                                dataType: 'date',
                                caption: 'Exp. Date',
                                placeholder: '...',
                                width: 120,
                                editorOptions: {
                                    elementAttr: {
                                        id: 'expirationDate'
                                    },
                                }
                            },
                            {
                                dataField: 'daysAfterOpen',
                                dataType: 'number',
                                caption: 'DFAO',
                                placeholder: 'Days fresh when opened',
                                allowFiltering: false,
                                width: 80,
                                editorOptions: {
                                    elementAttr: {
                                        id: 'daysAfterOpen'
                                    },
                                }
                            },
                            {
                                caption: 'FDL',
                                dataType: 'number',
                                placeholder: 'Number of days left Whether opened or not',
                                allowFiltering: false,
                                width: 80,
                                calculateCellValue: function (rowData) {
                                    freshDaysLeft = 0;
                                    expDateByOpened = new Date(Date.parse(rowData.openDate));
                                    expDateByOpened.setDate(expDateByOpened.getDate() + rowData.daysAfterOpen);
                                    if (expDateByOpened < Date.parse(rowData.expirationDate) && rowData.daysAfterOpen) {
                                        currentDate = new Date()
                                        openDate = new Date(Date.parse(rowData.openDate))
                                        daysFresh = Math.trunc((currentDate - openDate) / (1000 * 3600 * 24))
                                        freshDaysLeft = rowData.daysAfterOpen - daysFresh
                                    } else {
                                        currentDate = new Date()
                                        expDate = new Date(Date.parse(rowData.expirationDate))
                                        freshDaysLeft = Math.trunc((expDate - currentDate) / (1000 * 3600 * 24))
                                    }

                                    return freshDaysLeft;
                                },
                                cellTemplate: function (container, options) {
                                    if (options.value < 0) {
                                        container.addClass('red-text').text(options.text);
                                    } else if (options.value < 3) {
                                        container.addClass('orange-text').text(options.text);
                                    } else if (!Number.isNaN(options.value)) {
                                        container.addClass('green-text').text(options.text);
                                    } else {
                                    }
                                },
                            },
                            {
                                caption: 'Storage',
                                groupIndex: 0,
                                calculateCellValue: function (rowData) {
                                    if (rowData.itemStorageId !== undefined) {
                                        return ItemStorageDict[rowData.itemStorageId].name
                                    }
                                }
                            }
                        ]
                    }).dxDataGrid('instance')
                    console.log(grid)
                }
            },
            {
                title: 'Recipes',
                icon: 'food',
                template: function (itemData, itemIndex, element) {
                    const recipes = $("<div id=\"recipes\">")
                    recipes.appendTo(element)
                    recipes.append(
                        $('<div>').attr('id', 'container').append(
                            $('<div>').attr('id', 'ingredientSelectionBox').append(
                                $('<div>').attr('id', 'ingredientSelection')),
                            $('<ul>').attr('id', 'cards'),
                            $('<div>').attr('id', 'popup')
                        )
                    );
                    console.log(recipes)
                    IngredientSelection()
                }
            }]
    });
    data = sessionStorage.getItem("userinfo")
    if (data == "chocolate") {
        DevExpress.ui.themes.current("material.blue.dark");
    }
    if (data == "milk") {
        DevExpress.ui.themes.current("material.blue.light");
    }
    const actions = [
        {
            id: 1,
            text: "Switch Theme",
            icon: "tips",
            onClick: () => {
                id = sessionStorage.getItem("CurrentUserId")
                data = sessionStorage.getItem("userinfo")
                if (data == "milk") {
                    jsonpatchstr = "[{ \"op\": \"replace\", \"path\": \"/information\", \"value\": \"chocolate\" }]";
                    data = "chocolate";
                } else {
                    jsonpatchstr = "[{ \"op\": \"replace\", \"path\": \"/information\", \"value\": \"milk\" }]";
                    data = "milk";
                }
                if (data == "chocolate") {
                    DevExpress.ui.themes.current("material.blue.dark");
                    sessionStorage.setItem("userinfo", "chocolate");
                }
                if (data == "milk") {
                    DevExpress.ui.themes.current("material.blue.light");
                    sessionStorage.setItem("userinfo", "milk")
                }
                $.ajax({
                    url: baseURL + "/users/" + encodeURIComponent(id),
                    type: "patch",
                    dataType: "json",
                    data: jsonpatchstr,
                    contentType: "application/json-patch+json; charset=utf-8",
                })
            }
        },
        {
            id: 2,
            text: "Log Out",
            icon: "runner",
            onClick: () => {
                LogoutUser();
                location.href = "./index.html";
            },
        }
    ];

    $("#user-drop-down-button").dxDropDownButton({
        items: actions,
        icon: "user",
        text: sessionStorage.getItem(currentUser)
    });

    itemStoragePopUp = $('#POPUP-ITEMSTORAGE').dxPopup({
        contentTemplate: popupContentTemplateItemStorageForm,
        width: '80vw',
        maxWidth: 500,
        height: '80vh',
        maxHeight: 500,
        container: '.dx-viewport',
        showTitle: true,
        title: 'Storage Management',
        visible: false,
        dragEnabled: false,
        hideOnOutsideClick: true,
        showCloseButton: false,
    }).dxPopup('instance');

    storagePopUpDeleteOrMove = $('#POPUP-ITEMSTORAGE-DELETE-OR-MOVE').dxPopup({
        contentTemplate: popupContentTemplateItemStorageFormDeleteOrMove,
        width: '80vw',
        maxWidth: 500,
        height: '80vh',
        maxHeight: 500,
        container: '.dx-viewport',
        showTitle: true,
        title: 'Move or Delete All',
        visible: false,
        dragEnabled: false,
        hideOnOutsideClick: true,
        showCloseButton: false,
    }).dxPopup('instance');

    templateAndCategoriesPopup = $('#POPUP-ADD-WITH-TEMPLATE-AND-CATEGORIES').dxPopup({
        contentTemplate: popupContentTemplateTemplateAndCategories,
        width: '80vw',
        maxWidth: 500,
        height: '80vh',
        maxHeight: 500,
        container: '.dx-viewport',
        showTitle: true,
        title: 'Add Item',
        visible: false,
        dragEnabled: false,
        hideOnOutsideClick: true,
        showCloseButton: false,
    }).dxPopup('instance');
});

function GetCards() {

    const popupContentTemplate = function () {
        ingredientsString = `<h6>Ingredients</h6>`
        for (var i = 1; i <= 20; i++) {
            var ingredient = $.trim(CardsById["strIngredient" + i]);
            var measure = $.trim(CardsById["strMeasure" + i]);
            if (ingredient !== "" && measure !== "") {
                ingredientsString = ingredientsString + `<p>${ingredient} - ${measure}</p>`;
            }
        }
        const scrollView = $('<div />');
        scrollView.append(
            $(`<p>Meal: <span>${CardsById.strMeal}</span></p>`),
            $(`<p>Origin: <span>${CardsById.strArea}</span></p>`),
            $(`<p>Tags: <span>${CardsById.strTags}<span></p>`),
            $(`<p>Category: <span>${CardsById.strCategory}<span></p>`),
            $(`<p>Video: <a href="${CardsById.strYoutube}">${CardsById.strYoutube}</a></p>`),
            $(`<p>Source: <a href="${CardsById.strSource}">${CardsById.strSource}</a></p>`),
            $(ingredientsString),
            $(`<br><h6>Instructions</h6><p><span style="white-space: pre-wrap">${CardsById.strInstructions}<span></p>`),
        );
        scrollView.dxScrollView({
            width: '100%',
            height: '100%',
        });

        return scrollView;
    };
    const popup = $('#popup').dxPopup({
        contentTemplate: popupContentTemplate,
        width: "80vw",
        height: "60vh",
        container: '.dx-viewport',
        showTitle: true,
        title: 'Recipe',
        visible: false,
        dragEnabled: true,
        resizeEnabled: true,
        hideOnOutsideClick: true,
        showCloseButton: false,
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'Close',
                onClick() {
                    popup.hide();
                },
            },
        }],
    }).dxPopup('instance');

    Cards.forEach((currentCard) => {
        if (currentCard.strMeal.length > 28) {
            currentCard.strMeal = currentCard.strMeal.substring(0, 26) + "..."
        }

        $('<li>')
            .append(
                $('<img>').attr('src', `${currentCard.strMealThumb}`).attr('id', `image${currentCard.idMeal}`),
                $('<p>').html(`${currentCard.strMeal}`),
                $('<div>')
                    .addClass('button-info mt-0 recipe-button-2')
                    .dxButton({
                        text: 'Details',
                        onClick() {
                            GetMealById(currentCard.idMeal)
                            popup.option({
                                contentTemplate: () => popupContentTemplate(),
                            });
                            popup.show();
                        },
                    }),
            ).appendTo($('#cards'));
    });
};

function IngredientSelection() {
    $("#ingredientSelection").dxTagBox({
        dataSource: ItemStore,
        valueExpr: "name",
        displayExpr: "name",
        placeholder: "Ingredient selection",
        showSelectionControls: true,
        onValueChanged: function (e) {
            var element = document.getElementById("cards");
            element.innerHTML = "";
            ingredientName = e.value;
            GetMealByName(ingredientName);
        },
    });
};