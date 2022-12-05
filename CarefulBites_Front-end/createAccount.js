$(() => {
  const baseURL = "https://carefulbitesapi20221128134821.azurewebsites.net/CarefulBites"
  if (themeLayout == 'light') {
    DevExpress.ui.themes.current("material.blue.light");
  }
  else {
    DevExpress.ui.themes.current("material.blue.dark");
  }

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
      caption: 'Create account',
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
        type: 'success',
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

  $("#theme-button").dxButton({
    text: "change theme",
    styling: 'contained',
    onClick: () => {
      if (DevExpress.ui.themes.current() == "material.blue.dark") {
        DevExpress.ui.themes.current("material.blue.light");
        themeLayout = 'light'
      } else {
        DevExpress.ui.themes.current("material.blue.dark");
        themeLayout = 'dark'
      }
    }
  });
});

