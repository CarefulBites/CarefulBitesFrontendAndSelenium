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
            url: baseURL + "/foodItems",
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

$(() => {
    $('#itemGrid').dxDataGrid({
        dataSource: ItemStore,
        keyExpr: 'itemId',
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
                dataType: 'number'
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
            },
            {
                dataField: 'caloriesPer',
                dataType: 'number'
            },
            {
                dataField: 'expirationDate',
                dataType: 'date'
            },
            {
                dataField: 'openDate',
                dataType: 'date'
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
            },],
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
});