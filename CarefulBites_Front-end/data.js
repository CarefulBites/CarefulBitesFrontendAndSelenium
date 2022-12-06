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
