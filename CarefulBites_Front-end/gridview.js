const ItemStore = new DevExpress.data.CustomStore({
    key: 'itemId',
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        [
            'skip',
            'take',
            'requireTotalCount',
            'requireGroupCount',
            'sort',
            'filter',
            'totalSummary',
            'group',
            'groupSummary',
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
        var deferred = $.Deferred();
        $.ajax({
            url: baseURL + "/foodItems",
            method: 'POST',
            data: JSON.stringify(values),
            contentType: "application/json; charset=utf-8",
        })
            .done(deferred.resolve)
            .fail(function (e) {
                deferred.reject("Insertion failed");
            });
        return deferred.promise();
    },
    update: function (key, values) {
        jsonpatchstr = "["
        Object.keys(values).forEach(key => {
            if (typeof (values[key]) == 'number' || typeof (values[key]) == 'object') {
                jsonpatchstr += `{ \"op\": \"replace\", \"path\": \"/${key}\", \"value\": ${values[key]} },`
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
        })
            .done(deferred.resolve)
            .fail(function (e) {
                deferred.reject("Update failed");
            });
        return deferred.promise();
    },
    remove: function (key) {
        var deferred = $.Deferred();
        $.ajax({
            url: baseURL + "/foodItems/" + encodeURIComponent(key),
            method: "DELETE",
            contentType: "application/json; charset=utf-8",
        })
            .done(deferred.resolve)
            .fail(function (e) {
                deferred.reject("Deletion failed");
            });
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
                                    console.log()
                                    if (confirm('Are you sure you wish to delete this item?')) {
                                        $.ajax({
                                            url: baseURL + "/itemStorages/" + encodeURIComponent(key),
                                            dataType: 'json',
                                            method: "DELETE",
                                            async: false,
                                            contentType: "application/json; charset=utf-8",
                                        })
                                    }

                                    location.reload()
                                }
                            },
                        },
                    ]
            }]

        })
    );
};

$(() => {
    ItemStorageDict = []
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
                        noDataText: ItemStorageDict.length === 0 ? "To get started, try creating a storage in STORAGE." : "Great! Now click the ADD button above the grid.",
                        scrolling: {
                            mode: 'virtual',
                        },
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
                                        $('#itemGrid').dxDataGrid("instance").addRow();
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
                                placeholder: 'Name of item e.g Milk'
                            },
                            {
                                dataField: 'amount',
                                dataType: 'number',
                                width: 100,
                                allowSorting: false,
                                allowFiltering: false,
                                placeholder: 'The amount left of the item',
                                cellTemplate: function (container, options) {
                                    container.addClass('reduce-right-gap').text(options.text);
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
                                width: 80,
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
                            },
                            {
                                dataField: 'caloriesPer',
                                dataType: 'number',
                                visible: false
                            },
                            {
                                dataField: 'openDate',
                                dataType: 'date',
                                placeholder: '...',
                                width: 120
                            },
                            {
                                dataField: 'expirationDate',
                                dataType: 'date',
                                caption: 'Exp. Date',
                                placeholder: '...',
                                width: 120
                            },
                            {
                                dataField: 'daysAfterOpen',
                                dataType: 'number',
                                caption: 'DFAO',
                                placeholder: 'Days fresh when opened',
                                allowFiltering: false,
                                width: 80
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
                        ],
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

    $("#theme-button").dxButton({
        text: "light theme",
        onClick: () => {
            if (DevExpress.ui.themes.current() == "material.blue.dark") {
                DevExpress.ui.themes.current("material.blue.light");
                $("#theme-button").dxButton("instance").option("text", "dark theme")
            } else {
                DevExpress.ui.themes.current("material.blue.dark");
                $("#theme-button").dxButton("instance").option("text", "light theme")
            }
        },
        styling: 'contained'
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
});

function GetCards() {
    const popupContentTemplate = function () {

        const scrollView = $('<div />');
        scrollView.append(
            $(`<p>Meal: <span>${CardsById.strMeal}</span></p>`),
            $(`<p>Origin: <span>${CardsById.strArea}</span></p>`),
            $(`<p>Tags: <span>${CardsById.strTags}<span></p>`),
            $(`<p>Category: <span>${CardsById.strCategory}<span></p>`),
            $(`<p>Video: <span>${CardsById.strYoutube}<span></p>`),
            $(`<p>Source: <span>${CardsById.strSource}</span></p>`),
            $(`<p>Ingredients: <span>${CardsById.strIngredient1}<span><span>${" " + CardsById.strMeasure1}<span><span>${" " + CardsById.strIngredient2}<span><span>${" " + CardsById.strMeasure2}<span><span>${" " + CardsById.strIngredient3}<span><span>${" " + CardsById.strMeasure3}<span><span>${" " + CardsById.strIngredient4}<span><span>${" " + CardsById.strMeasure4}<span><span>${" " + CardsById.strIngredient5}<span><span>${" " + CardsById.strMeasure5}<span><span>${" " + CardsById.strIngredient6}<span><span>${" " + CardsById.strMeasure6}<span><span>${" " + CardsById.strIngredient7}<span><span>${" " + CardsById.strMeasure7}<span><span>${" " + CardsById.strIngredient8}<span><span>${" " + CardsById.strMeasure8}<span><span>${" " + CardsById.strIngredient9}<span><span>${" " + CardsById.strMeasure9}<span><span>${" " + CardsById.strIngredient10}<span><span>${" " + CardsById.strMeasure10}<span><span>${" " + CardsById.strIngredient11}<span><span>${" " + CardsById.strMeasure11}<span><span>${" " + CardsById.strIngredient12}<span><span>${" " + CardsById.strMeasure12}<span><span>${" " + CardsById.strIngredient13}<span><span>${" " + CardsById.strMeasure13}<span><span>${" " + CardsById.strIngredient14}<span><span>${" " + CardsById.strMeasure14}<span><span>${" " + CardsById.strIngredient15}<span><span>${" " + CardsById.strMeasure15}<span><span>${" " + CardsById.strIngredient16}<span><span>${" " + CardsById.strMeasure16}<span><span>${" " + CardsById.strIngredient17}<span><span>${" " + CardsById.strMeasure17}<span><span>${" " + CardsById.strIngredient18}<span><span>${" " + CardsById.strMeasure18}<span><span>${" " + CardsById.strIngredient19}<span><span>${" " + CardsById.strMeasure19}<span><span>${" " + CardsById.strIngredient20}<span><span>${" " + CardsById.strMeasure20}<span>`),
            $(`<p>Instructions: <span>${CardsById.strInstructions}<span></p>`),
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