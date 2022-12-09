const baseURL = "https://carefulbitesapi20221128134821.azurewebsites.net/CarefulBites"

let row = null

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
    insert: function(values) {
      var deferred = $.Deferred();
      $.ajax({
        url: baseURL + "/foodItems",
        method: 'POST',
        data: JSON.stringify(values),
        contentType: "application/json; charset=utf-8",
      }) 
      .done(deferred.resolve)
      .fail(function(e){
          deferred.reject("Insertion failed");
      });
      return deferred.promise();
    },
    update: function(key, values) {
      jsonpatchstr = "["
      Object.keys(values).forEach(key => {
        console.log(key, values[key]);
        if (typeof(values[key]) == 'number' || typeof(values[key]) == 'object') {
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
      .fail(function(e){
          deferred.reject("Update failed");
      });
      return deferred.promise();
    },
    remove: function(key) {
      var deferred = $.Deferred();
      $.ajax({
          url: baseURL + "/foodItems/" + encodeURIComponent(key),
          method: "DELETE",
          contentType: "application/json; charset=utf-8",
      })
      .done(deferred.resolve)
      .fail(function(e){
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

  const userForm = [{
    username: '',
    password: '',
  }]

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
                // location.reload()
              }
            },
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
