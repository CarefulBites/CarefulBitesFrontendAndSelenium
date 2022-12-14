const baseURL =
  "https://carefulbitesapi20221128134821.azurewebsites.net/CarefulBites";
const userForm = {
  username: "",
  password: "",
};
const currentUser = "CurrentUser";
let form_popup = undefined;

function IsLoggedIn() {
  if (sessionStorage.getItem("LoggedIn")) {
    return true;
  } else return false;
}

function LogoutUser() {
  sessionStorage.removeItem(currentUser);
  sessionStorage.removeItem("LoggedIn");
  sessionStorage.removeItem("userinfo");
}

function ShowPopUp() {
  form_popup.show();
}

function LoginUser(users) {
  if (users.length == 1) {
    if (
      users[0].username == userForm.username &&
      users[0].password == userForm.password
    ) {
      sessionStorage.setItem(currentUser, users[0].username);
      sessionStorage.setItem("LoggedIn", true);
      sessionStorage.setItem("CurrentUserId", users[0].userId);
      sessionStorage.setItem("userinfo", users[0].information);
    } else {
      alert("User not found");
    }
  }
}

$(() => {
  const sendRequest = function (value) {
    const invalidEmail = "test@dx-email.com";
    const d = $.Deferred();
    setTimeout(() => {
      d.resolve(value !== invalidEmail);
    }, 1000);
    return d.promise();
  };

  const loadPanel = // First, initialize the dxLoadPanel widget on an element in your page
    $("#LOAD-PANEL").dxLoadPanel({
      // The text to display in the loading indicator
      message: "Please wait...",
      // Set the widget's shading color
      shadingColor: "rgba(0,0,0,0.4)",
      // Set the widget's background color
      backgroundColor: "#fff",
      // Set the widget's text color
      fontColor: "#000",
      // Set the widget's position relative to the element
      position: {
        my: "center",
        at: "center",
        of: "body"
      },
      visible: false,
      deferRendering: true,
    }).dxLoadPanel('instance');

  $(window).ajaxStart(function () {
    // Show the load panel
    if (loadPanel != undefined) {
      loadPanel.show();
    }
  });

  $(window).ajaxStop(function () {
    // Show the load panel
    if (loadPanel != undefined) {
      loadPanel.hide();
    }
  });
  const popupContentTemplateLoggedIn = function () {
    return $("<div>").append(
      $(
        `<p style="font-size: medium;"> Username: <span>${sessionStorage.getItem(
          currentUser
        )}</span></p>`
      )
    );
  };

  const popupContentTemplate = function () {
    return $("<div>").append(
      $("<div />")
        .attr("id", "login-form")
        .dxForm({
          labelMode: "floating",
          formData: userForm,
          readOnly: false,
          showColonAfterLabel: true,
          labelLocation: "left",
          screenByWidth: function (width) {
            return 2;
          },
          items: [
            {
              dataField: "username",
              caption: "Username",
              colSpan: 2,
              validationRules: [
                {
                  type: "required",
                  message: "Username is required",
                },
                {
                  type: 'stringLength',
                  min: 3,
                }
              ],
            },
            {
              dataField: "password",
              caption: "Password",
              colSpan: 2,
              editorOptions: {
                mode: "password",
                onEnterKey: function (e) {
                  console.log(e)
                  $('#POPUP-LOGIN-BUTTON').click();
                },
              },
              validationRules: [
                {
                  type: "required",
                  message: "Password is required",
                },
              ],
            },
            {
              itemType: "group",
              colCount: 2,
              items: [
                {
                  itemType: "button",
                  colSpan: 1,
                  horizontalAlignment: "left",
                  buttonOptions: {
                    elementAttr: {
                      id: 'POPUP-LOGIN-BUTTON'
                    },
                    text: "Log In",
                    type: "default",
                    useSubmitBehavior: false,
                    onClick() {
                      $.ajax({
                        url:
                          baseURL +
                          "/users?username=" +
                          encodeURIComponent(userForm.username),
                        dataType: "json",
                        method: "GET",
                        async: true,
                        contentType: "application/json; charset=utf-8",
                        success: function (responseData) {
                          if (responseData == undefined) {
                            DevExpress.ui.notify(
                              {
                                message: "Error",
                                position: {
                                  my: "center top",
                                  at: "center top",
                                },
                              },
                              "danger",
                              3000
                            );
                          } else {
                            users = responseData;
                            DevExpress.ui.notify(
                              {
                                message: "login success",
                                position: {
                                  my: "center top",
                                  at: "center top",
                                },
                              },
                              "success",
                              3000
                            );
                            LoginUser(users);
                            location.href = "./main_page.html";
                          }
                        }
                      });
                    }
                  },
                },
                {
                  itemType: "button",
                  colSpan: 1,
                  horizontalAlignment: "right",
                  buttonOptions: {
                    elementAttr: {
                      id: 'POPUP-CREATEACCOUNT-BUTTON'
                    },
                    text: "Create Account",
                    type: "default",
                    useSubmitBehavior: false,
                    onClick() {
                      location.href = "./create_account.html";
                    }
                  },
                },
              ],
            },
          ],
        }),
    );
  };

  let href = location.href;
  let lastPathSegment = href.substring(href.lastIndexOf("/") + 1);
  if (lastPathSegment == "main_page.html") {
    $('#logout-button').dxButton({
      icon: 'user',
      type: 'logout',
      text: 'Log Out',
      onClick() {
        LogoutUser();
        location.href = "./index.html";
      },
    });
    if (!IsLoggedIn()) {
      location.href = "./index.html";
    }
  }
  if (lastPathSegment == "index.html" || lastPathSegment == "") {
    if (IsLoggedIn()) {
      location.href = "./main_page.html";
    }
    form_popup = $("#popup-login")
      .dxPopup({
        contentTemplate: popupContentTemplate,
        container: ".dx-viewport",
        showTitle: true,
        title: "Log In",
        visible: false,
        dragEnabled: false,
        hideOnOutsideClick: true,
        showCloseButton: false,
        maxWidth: 500,
        maxHeight: 300
      })
      .dxPopup("instance");

    $("#login-button").dxButton({
      type: "default",
      text: "Log In or Sign Up",
      width: "58vw",
      height: "11vh",
      elementAttr: {
        id: 'LOGIN-BUTTON'
      },
      onClick: () => {
        form_popup.show();
      }
    })
  }
  const formWidget = $("#form")
    .dxForm({
      formData: userForm,
      readOnly: false,
      showColonAfterLabel: true,
      showValidationSummary: true,
      validationGroup: "customerData",
      items: [
        {
          itemType: "group",
          caption: "Create account",
          items: [
            {
              dataField: "username",
              validationRules: [
                {
                  type: "required",
                  message: "Username is required",
                },
                {
                  type: "async",
                  message: "Username is already registered",
                  validationCallback(params) {
                    return sendRequest(params.value);
                  },
                },
                {
                  type: 'stringLength',
                  min: 3,
                  message: 'Your username must be at least 3 characters long'
                }
              ],
            },
            {
              dataField: "password",
              editorOptions: {
                mode: "password",
              },
              validationRules: [
                {
                  type: "required",
                  message: "Password is required",
                },
              ],
            },
            {
              label: {
                text: "Confirm Password",
              },
              editorType: "dxTextBox",
              editorOptions: {
                mode: "password",
              },
              validationRules: [
                {
                  type: "required",
                  message: "Confirm Password is required",
                },
                {
                  type: "compare",
                  message: "'Password' and 'Confirm Password' do not match",
                  comparisonTarget() {
                    return formWidget.option("formData").password;
                  },
                },
              ],
            },
          ],
        },
        {
          itemType: "button",
          horizontalAlignment: "left",
          buttonOptions: {
            text: "Register",
            type: "default",
            useSubmitBehavior: true,
          },
        },
      ],
    })
    .dxForm("instance");
  $("#Create-Account-form-container").on("submit", (e) => {
    DevExpress.ui.notify(
      {
        message: "You have made a acount",
        position: {
          my: "center top",
          at: "center top",
        },
      },
      "success",
      3000
    );

    e.preventDefault();
    var deferred = $.Deferred();
    users = $.ajax({
      url: baseURL + "/users/",
      dataType: "json",
      data: JSON.stringify(userForm),
      method: "POST",
      async: false,
      contentType: "application/json; charset=utf-8",
    })
      .done(deferred.resolve)
      .fail(function (e) {
        deferred.reject("Create Account failed");
      });
    if (users.responseJSON != undefined) {
      users = [users.responseJSON];
      LoginUser(users);
      location.href = "./main_page.html";
    }

    return deferred.promise();
  });
});

//cards
let Cards = [];

function GetMealByName(ingredient) {
  ingredients = ingredient[0];
  for (let i = 1; i < ingredient.length; i++) {
    ingredients += "&ingredient=" + ingredient[i];
  }
  $.ajax({
    type: "GET",
    dataType: "json",
    url:
      "https://carefulbitesapi20221128134821.azurewebsites.net/Meal?ingredient=" +
      ingredients,
    async: true,
    success: function (data) {
      Cards = data;
      GetCards();
    },
    error: function (error) {
      jsonValue = jQuery.parseJSON(error.responseText);
      alert("error" + error.responseText);
    },
  });
}

let CardsById = "";

function GetMealById(id) {
  $.ajax({
    type: "GET",
    dataType: "json",
    url:
      "https://carefulbitesapi20221128134821.azurewebsites.net/Meal/foodById?id=" +
      id,
    async: false,
    success: function (data) {
      CardsById = data;
    },
    error: function (error) {
      jsonValue = jQuery.parseJSON(error.responseText);
      alert("error" + error.responseText);
    },
  });
}
