$(() => {
  ItemStorageDict = []
  NewItemStorageDict = []
  $.ajax({
    url: baseURL + "/itemStorages/",
    method: 'GET',
    contentType: "application/json; charset=utf-8",
    async:false,
    success: function(data) {
      ItemStorageDict = data.reduce((obj, item) => {
        obj[item.itemStorageId] = item.name;
        return obj;
      }, {});
    }
  })

  $.ajax({
    url: baseURL + "/itemStorages/",
    method: 'GET',
    contentType: "application/json; charset=utf-8",
    async:false,
    success: function(data) {
      NewItemStorageDict = data.map(item => ({
        name: item.name,
        itemStorageId: item.itemStorageId
      }));
    }
  })

  console.log(ItemStorageDict)

  grid = $('#itemGrid').dxDataGrid({
    dataSource: ItemStore,
    keyExpr: 'itemId',
    padding: 100,
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
    onEditingStart: function (e) {
      row = e.data
    },
    columns: [
      {
        dataField: 'itemId',
        dataType: 'number',
        visible: false,
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
          dataSource: NewItemStorageDict,
          displayExpr: 'name',
          valueExpr: 'itemStorageId',
        }
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
        calculateCellValue: function(rowData) {
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
        calculateCellValue: function(rowData) {
          return ItemStorageDict[rowData.itemStorageId]
        }
      }
    ],
    showBorders: true,
  })

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

  if (IsLoggedIn()) {
    popup = $('#popup-login').dxPopup({
      contentTemplate: popupContentTemplateLoggedIn,
      width: 425,
      height: 300,
      container: '.dx-viewport',
      showTitle: true,
      title: 'Log Out',
      visible: false,
      dragEnabled: false,
      hideOnOutsideClick: true,
      showCloseButton: false,
      toolbarItems: [{
        widget: 'dxButton',
        toolbar:'bottom',
        location: 'center',
        options: {
          text: 'Log Out',
          stylingMode: 'contained',
          type: 'default',
          onClick: ()=> {
            LogoutUser()
            location.reload()
          }
        } 
      },]
    }).dxPopup('instance');

    $("#popup-button").dxButton({
      styling: 'contained',
      icon: 'user',
      text: GetCurrentUser(),
      onClick: () => {
        popup.show();
      }
    });

  } else {
    popup = $('#popup-login').dxPopup({
      contentTemplate: popupContentTemplate,
      width: 425,
      height: 300,
      container: '.dx-viewport',
      showTitle: true,
      title: 'Log In',
      visible: false,
      dragEnabled: false,
      hideOnOutsideClick: true,
      showCloseButton: false,
    }).dxPopup('instance');

    $("#popup-button").dxButton({
      styling: 'contained',
      icon: 'user',
      text: "Log In",
      onClick: () => {
        popup.show();
      }
    });
  }


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
function LoginUser (users) {
  if (users.length == 1) {
    if (users[0].username == userForm.username && users[0].password == userForm.password) 
    {
      sessionStorage.setItem('CurrentUser', users[0].username)
      sessionStorage.setItem('CurrentUserId', users[0].userId)
      sessionStorage.setItem('LoggedIn', true)
    }
    else
    {
      alert('User not found')
    }
  }
}
function LogoutUser () {
  sessionStorage.removeItem('CurrentUser')
  sessionStorage.removeItem('CurrentUserId')
  sessionStorage.removeItem('LoggedIn')
}
function GetItemStorageByID(id){
  AllItemStorages
}