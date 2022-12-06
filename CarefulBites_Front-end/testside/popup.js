$('#normal-text').dxButton({
    stylingMode: 'text',
    text: 'Text',
    type: 'normal',
    width: 120,
    onClick() {
        DevExpress.ui.notify('The Text button was clicked');
    },
});