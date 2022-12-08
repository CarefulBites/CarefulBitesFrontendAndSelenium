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

  const popupContentTemplateLoggedIn = function () {
    return $('<div>').append(
      $(`<p style="font-size: medium;"> Username: <span>${GetCurrentUser()}</span></p>`)
    );
  };
  const popupContentTemplate = function () {
    return $('<div>').append(
      $('<div />').attr('id', 'login-form').dxForm({
        labelMode: 'floating',
        formData: userForm,
        readOnly: false,
        showColonAfterLabel: true,
        labelLocation: 'left',
        minColWidth: 300,
        colCount: 1,
        items: [
          {
            dataField: 'username',
            caption: 'Username',
            validationRules: [{
              type: 'required',
              message: 'Username is required'
            }],

          },
          {
            dataField: 'password',
            caption: 'Password',
            editorOptions: { mode: 'password' },
            validationRules: [{
              type: 'required',
              message: 'Password is required'
            }],
          },
          {
            itemType: 'group',
            colCount: 2,
            items:
              [
                {
                  itemType: 'button',
                  horizontalAlignment: 'left',
                  buttonOptions: {
                    text: 'Log In',
                    type: 'default',
                    useSubmitBehavior: false,
                    onClick() {
                      DevExpress.ui.notify({
                        message: 'You have submitted the form',
                        position: {
                          my: 'center top',
                          at: 'center top',
                        },
                      }, 'success', 3000);
                      console.log(userForm)
                      users = $.ajax({
                        url: baseURL + "/users?username=" + encodeURIComponent(userForm.username),
                        dataType: 'json',
                        method: "GET",
                        async: false,
                        contentType: "application/json; charset=utf-8",
                      })
                      users = users.responseJSON
                      LoginUser(users)
                      location.reload()
                    }
                  },
                },
                {
                  itemType: 'button',
                  horizontalAlignment: 'right',
                  buttonOptions: {
                    text: 'Create Account',
                    type: 'default',
                    useSubmitBehavior: false,
                    onClick() {
                      location.href = '/CreateAccount.html'
                    }
                  },
                },
              ]
          },

        ]
      })
    );
  };

  if (IsLoggedIn()) {
    const popup = $('#popup-login').dxPopup({
      contentTemplate: popupContentTemplateLoggedIn,
      width: 425,
      height: 300,
      container: '.dx-viewport',
      showTitle: true,
      title: 'Log In',
      visible: false,
      dragEnabled: false,
      hideOnOutsideClick: true,
      showCloseButton: false,
      toolbarItems: [{
        widget: 'dxButton',
        toolbar: 'bottom',
        location: 'center',
        options: {
          text: 'Log Out',
          stylingMode: 'contained',
          type: 'default',
          onClick: () => {
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
    const popup = $('#popup-login').dxPopup({
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
function LoginUser(users) {
  if (users.length == 1) {
    if (users[0].username == userForm.username && users[0].password == userForm.password) {
      sessionStorage.setItem('CurrentUser', users[0].username)
      sessionStorage.setItem('LoggedIn', true)
    }
    else {
      alert('User not found')
    }
  }
}
function LogoutUser() {
  sessionStorage.removeItem('CurrentUser')
  sessionStorage.removeItem('LoggedIn')
}