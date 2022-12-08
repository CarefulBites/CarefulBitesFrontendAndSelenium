const formData = {
  username: '',
  password: '',
};

let themeLayout = 'dark'
const baseURL = "https://carefulbitesapi20221128134821.azurewebsites.net/CarefulBites"
let popup = undefined
function show_popup() {
  popup.show()
}
$(() => {

  /*if (themeLayout == 'light') {
    DevExpress.ui.themes.current("material.blue.light");
  }
  else {
    DevExpress.ui.themes.current("material.blue.dark");
  }*/

  const sendRequest = function (value) {
    const invalidEmail = 'test@dx-email.com';
    const d = $.Deferred();
    setTimeout(() => {
      d.resolve(value !== invalidEmail);
    }, 1000);
    return d.promise();
  };

  const formWidget = $('#form').dxForm({
    formData,
    readOnly: false,
    showColonAfterLabel: true,
    showValidationSummary: true,
    validationGroup: 'customerData',
    items: [{
      itemType: 'group',
      caption: 'sign up',
      items: [{
        dataField: 'username',
        validationRules: [{
          type: 'required',
          message: 'Username is required',
        }, {
          type: 'async',
          message: 'Username is already registered',
          validationCallback(params) {
            return sendRequest(params.value);
          },
        }],
      }, {
        dataField: 'password',
        editorOptions: {
          mode: 'password',
        },
        validationRules: [{
          type: 'required',
          message: 'Password is required',
        }],
      }, {
        label: {
          text: 'Confirm Password',
        },
        editorType: 'dxTextBox',
        editorOptions: {
          mode: 'password',
        },
        validationRules: [{
          type: 'required',
          message: 'Confirm Password is required',
        }, {
          type: 'compare',
          message: "'Password' and 'Confirm Password' do not match",
          comparisonTarget() {
            return formWidget.option('formData').password;
          },
        }],
      }],
    },
    // {
    //   itemType: 'group',
    //   items: [{
    //     dataField: 'Accepted',
    //     label: {
    //       visible: false,
    //     },
    //     editorOptions: {
    //       text: 'I agree to the Terms and Conditions',
    //     },
    //     validationRules: [{
    //       type: 'compare',
    //       comparisonTarget() { return true; },
    //       message: 'You must agree to the Terms and Conditions',
    //     }],
    //   }],
    // }, 
    {
      itemType: 'button',
      horizontalAlignment: 'left',
      buttonOptions: {
        text: 'Register',
        type: 'default',
        useSubmitBehavior: true,
      },
    }],
  }).dxForm('instance');

  $('#Create-Account-form-container').on('submit', (e) => {

    DevExpress.ui.notify({
      message: 'You have submitted the form',
      position: {
        my: 'center top',
        at: 'center top',
      },
    }, 'success', 3000);
    console.log(e)
    e.preventDefault();
    var deferred = $.Deferred();
    $.ajax({
      url: baseURL + "/users/",
      dataType: 'json',
      data: JSON.stringify(formData),
      method: "POST",
      contentType: "application/json; charset=utf-8",
    })
      .done(deferred.resolve)
      .fail(function (e) {
        deferred.reject("Create Account failed");
      });
    return deferred.promise();
  });


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
  function IsLoggedIn() {
    if (sessionStorage.getItem('LoggedIn')) {
      return true
    }
    else
      return false
  }
  function GetCurrentUser() {
    return sessionStorage.getItem('CurrentUser')
  }
  const userForm = [{
    username: '',
    password: '',
  }]

  const popupContentTemplateLoggedIn = function () {
    return $('<div>').append(
      $(`<p style="font-size: medium;"> Username: <span>${sessionStorage.getItem('CurrentUser')}</span></p>`)
    );
  };
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

});
