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
            console.log(key, values[key]);
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
                                onValueChanged: function(e) {
                                    key = e.value;
                                }
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
        url: baseURL + "/itemStorages/",
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

    $('#itemGrid').dxDataGrid({
        dataSource: ItemStore,
        keyExpr: 'itemId',
        columnHidingEnabled: true,
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: 'Search...',
        },
        headerFilter: {
            visible: true,
        },
        editing: {
            mode: 'row',
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true,
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: "auto",
            visible: true
            //[10, 25, 50, 100],

        },
        onEditingStart: function (e) {
            row = e.data
        },
        columns: [
            {
                dataField: 'itemId',
                dataType: 'number',
                visible: false
            },
            {
                dataField: 'name',
                dataType: 'string'
            },
            {
                dataField: 'amount',
                dataType: 'number'
            },
            {
                dataField: 'unit',
            },
            {
                dataField: 'itemStorageId',
                caption: 'Storage',
                lookup: {
                    dataSource: Object.values(ItemStorageDict),
                    displayExpr: 'name',
                    valueExpr: 'itemStorageId',
                },
            },
            {
                dataField: 'caloriesPer',
                dataType: 'number',
            },
            {
                dataField: 'expirationDate',
                dataType: 'date',
            },
            {
                dataField: 'openDate',
                dataType: 'date',
            },
            {
                dataField: 'daysAfterOpen',
                dataType: 'number',
                calculateCellValue: function (rowData) {
                    if (rowData.openDate) {
                        currentDate = new Date()
                        openDate = new Date(Date.parse(rowData.openDate))
                        daysAfterOpenResult = Math.trunc((currentDate - openDate) / (1000 * 3600 * 24))
                        return daysAfterOpenResult == 1 ? daysAfterOpenResult + ' day' : daysAfterOpenResult + ' days'
                    }

                }
            },
            {
                caption: 'Storage',
                groupIndex: 0,
                calculateCellValue: function (rowData) {
                    return ItemStorageDict[rowData.itemStorageId].name
                }
            }
        ],
        showBorders: true,
    })

    $("#theme-button").dxButton({
        text: "change theme",
        styling: 'contained',
        onClick: () => {
            if (DevExpress.ui.themes.current() == "material.blue.dark") {
                DevExpress.ui.themes.current("material.blue.light");
            } else {
                DevExpress.ui.themes.current("material.blue.dark");
            }
        }
    });

    itemStoragePopUp = $('#POPUP-ITEMSTORAGE').dxPopup({
        contentTemplate: popupContentTemplateItemStorageForm,
        width: 500,
        height: 500,
        container: '.dx-viewport',
        showTitle: true,
        title: 'Log In',
        visible: false,
        dragEnabled: false,
        hideOnOutsideClick: true,
        showCloseButton: false,
    }).dxPopup('instance');
    $("#POPUP-ITEMSTORAGE-BUTTON").dxButton({
        styling: 'contained',
        icon: 'user',
        text: 'ItemStorage Management',
        onClick: () => {
            console.log(itemStoragePopUp)
            itemStoragePopUp.show();
        }
    });
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
      width: 600,
      height: 500,
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
      $('<li>')
      .css("width","250")
      .append(
        $('<img>').attr('src', `${currentCard.strMealThumb}`).attr('id', `image${currentCard.idMeal}`),
        $('<br>'),
        $('<span>').html(`<i>${currentCard.strMeal}</i>`),
        $('<br>'),
        $('<div>')
          .addClass('button-info')
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

$(function () {
    $("#ingredientSelection").dxTagBox({
        dataSource: ItemStore,
        valueExpr: "name",
        displayExpr: "name",
        placeholder: "Milk",
        showSelectionControls: true,
        onValueChanged: function (e) {
            var element = document.getElementById("cards");
            element.innerHTML = "";
            ingredientName = e.value[0];
            GetMealByName(ingredientName);
        },
    });
});