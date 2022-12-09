const baseURL = "https://carefulbitesapi20221128134821.azurewebsites.net/CarefulBites"
const userForm = {
    username: '',
    password: '',
}
const currentUser = 'CurrentUser'
let form_popup = undefined;
function IsLoggedIn() {
    if (sessionStorage.getItem('LoggedIn')) {
        return true
    }
    else
        return false
}
function LogoutUser() {
    sessionStorage.removeItem(currentUser)
    sessionStorage.removeItem('LoggedIn')
}
function ShowPopUp() {
    form_popup.show()
}

function LoginUser(users) {
    if (users.length == 1) {

        if (users[0].username == userForm.username && users[0].password == userForm.password) {
            sessionStorage.setItem(currentUser, users[0].username)
            sessionStorage.setItem('LoggedIn', true)
            sessionStorage.setItem('CurrentUserId', users[0].userId)
        }
        else {
            alert('User not found')
        }
    }
}



$(() => {

    const sendRequest = function (value) {
        const invalidEmail = 'test@dx-email.com';
        const d = $.Deferred();
        setTimeout(() => {
            d.resolve(value !== invalidEmail);
        }, 1000);
        return d.promise();
    };

    const popupContentTemplateLoggedIn = function () {
        return $('<div>').append(
            $(`<p style="font-size: medium;"> Username: <span>${sessionStorage.getItem(currentUser)}</span></p>`)
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
                                            console.log(userForm)
                                            users = $.ajax({
                                                url: baseURL + "/users?username=" + encodeURIComponent(userForm.username),
                                                dataType: 'json',
                                                method: "GET",
                                                async: false,
                                                contentType: "application/json; charset=utf-8",
                                            })
                                            if (users.responseJSON == undefined) {
                                                DevExpress.ui.notify({
                                                    message: 'You dont have a account',
                                                    position: {
                                                        my: 'center top',
                                                        at: 'center top',
                                                    },
                                                }, 'success', 3000);
                                            } else {
                                                users = users.responseJSON
                                                DevExpress.ui.notify({
                                                    message: 'login success',
                                                    position: {
                                                        my: 'center top',
                                                        at: 'center top',
                                                    },
                                                }, 'success', 3000);
                                                LoginUser(users)
                                                location.href = './main_page.html'
                                            }
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
                                            location.href = './create_account.html'
                                        }
                                    },
                                },
                            ]
                    },

                ]
            })
        );
    };

    let href = location.href;
    let lastPathSegment = href.substring(href.lastIndexOf('/') + 1);
    if (lastPathSegment == 'main_page.html') {
        form_popup = $('#popup-logout').dxPopup({
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
                toolbar: 'bottom',
                location: 'center',
                options: {
                    text: 'Log Out',
                    stylingMode: 'contained',
                    type: 'default',
                    onClick: () => {
                        LogoutUser()
                        location.href = "./index.html"
                    }
                }
            },]
        }).dxPopup('instance');

        $("#popup-button").dxButton({
            styling: 'contained',
            icon: 'user',
            text: sessionStorage.getItem(currentUser),
            onClick: () => {

                form_popup.show();
            }
        });
        if (!IsLoggedIn()) {
            location.href = "./index.html"
        }
    }
    if (lastPathSegment == 'index.html' || lastPathSegment == '') {
        if (IsLoggedIn()) {
            location.href = './main_page.html'
        }
        form_popup = $('#popup-login').dxPopup({
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
                form_popup.show();
            }
        });
    }
    const formWidget = $('#form').dxForm({
        formData: userForm,
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
            message: 'You have made a acount',
            position: {
                my: 'center top',
                at: 'center top',
            },
        }, 'success', 3000);

        e.preventDefault();
        var deferred = $.Deferred();
        users = $.ajax({
            url: baseURL + "/users/",
            dataType: 'json',
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
            LoginUser(users.responseJSON)
            location.href = './main_page.html'
        }

        return deferred.promise();
    });

});