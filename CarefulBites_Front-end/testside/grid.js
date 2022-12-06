const baseURL = "https://carefulbitesapi20221128134821.azurewebsites.net/CarefulBites"
//GetUsers
$(() => {
    $('#itemGrid').dxDataGrid({
        dataSource: {
            store: {
                type: 'odata',
                url: baseURL + "/fooditems",
                key: 'itemId'
            },
        },
        paging: {
            pageSize: 10,
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: "auto",
            visible: true
            //[10, 25, 50, 100],

        },
        remoteOperations: false,
        searchPanel: {
            visible: true,
            highlightCaseSensitive: true,
        },
        groupPanel: { visible: true },
        grouping: {
            autoExpandAll: false,
        },
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        showBorders: true,
        editing: {
            mode: 'row',
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true,
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
                dataType: 'number'
            },
        ],
        onContentReady(e) {

            if (!collapsed) {
                collapsed = true;
                e.component.expandRow(['EnviroCare']);
            }

        },
    });
});

const discountCellTemplate = function (container, options) {
    $('<div/>').dxBullet({
        onIncidentOccurred: null,
        size: {
            width: 150,
            height: 35,
        },
        margin: {
            top: 5,
            bottom: 0,
            left: 5,
        },
        showTarget: false,
        showZeroLevel: true,
        value: options.value * 100,
        startScaleValue: 0,
        endScaleValue: 100,
        tooltip: {
            enabled: true,
            font: {
                size: 18,
            },
            paddingTopBottom: 2,
            customizeTooltip() {
                return { text: options.text };
            },
            zIndex: 5,
        },
    }).appendTo(container);
};

let collapsed = false;

/*

,
                beforeSend(request) {
                    request.params.startDate = '2020-05-10';
                    request.params.endDate = '2020-05-15';
                },

columns: [
            {
                dataField: 'Product',
                groupIndex: 0,
            },
            {
                dataField: 'Amount',
                caption: 'Sale Amount',
                dataType: 'number',
                format: 'currency',
                alignment: 'right',
            },
            {
                dataField: 'Discount',
                caption: 'Discount %',
                dataType: 'number',
                format: 'percent',
                alignment: 'right',
                allowGrouping: false,
                cellTemplate: discountCellTemplate,
                cssClass: 'bullet',
            },
            {
                dataField: 'SaleDate',
                dataType: 'date',
            },
            {
                dataField: 'Region',
                dataType: 'string',
            },
            {
                dataField: 'Sector',
                dataType: 'string',
            },
            {
                dataField: 'Channel',
                dataType: 'string',
            },
            {
                dataField: 'Customer',
                dataType: 'string',
                width: 150,
            },
        ],
        */