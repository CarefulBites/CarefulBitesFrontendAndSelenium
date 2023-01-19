// Random Meals

$(() => {
  GetRandomMeals(3);
});

let RandomCards = [];

function GetRandomMeals(amount) {
  $.ajax({
    type: "GET",
    dataType: "json",
    url:
      "https://carefulbitesapi20221128134821.azurewebsites.net/Meal/RandomMeals?amountOfMeals=" +
      amount,
    async: true,
    success: function (data) {
      RandomCards = data;
      GetRandomCards();
    },
    error: function (error) {
      jsonValue = jQuery.parseJSON(error.responseText);
      alert("error" + error.responseText);
    },
  });
}

let RandomCardsById = "";

function GetRandomMealById(id) {
  $.ajax({
    type: "GET",
    dataType: "json",
    url:
      "https://carefulbitesapi20221128134821.azurewebsites.net/Meal/foodById?id=" +
      id,
    async: false,
    success: function (data) {
      RandomCardsById = data;
    },
    error: function (error) {
      jsonValue = jQuery.parseJSON(error.responseText);
      alert("error" + error.responseText);
    },
  });
}

function GetRandomCards() {
  const popupContentTemplate = function () {
        ingredientsString = `<br><h6>Ingredients</h6>`
        for (var i = 1; i <= 20; i++) {
            var ingredient = $.trim(RandomCardsById["strIngredient" + i]);
            var measure = $.trim(RandomCardsById["strMeasure" + i]);
            if (ingredient !== "" && measure !== "") {
                ingredientsString = ingredientsString + `<p>${ingredient} - ${measure}</p>`;
            }
        }
        const scrollView = $('<div />');
        scrollView.append(
            $(`<h6>Information</h6>`),
            $(`<p>Meal: <span>${RandomCardsById.strMeal}</span></p>`),
            $(`<p>Origin: <span>${RandomCardsById.strArea}</span></p>`),
            $(`<p>Tags: <span>${RandomCardsById.strTags}<span></p>`),
            $(`<p>Category: <span>${RandomCardsById.strCategory}<span></p>`),
            $(`<p>Video: <a href="${RandomCardsById.strYoutube}">${RandomCardsById.strYoutube}</a></p>`),
            $(`<p>Source: <a href="${RandomCardsById.strSource}">${RandomCardsById.strSource}</a></p>`),
            $(ingredientsString),
            $(`<br><h6>Instructions</h6><p><span style="white-space: pre-wrap">${RandomCardsById.strInstructions}<span></p>`),
        );
        scrollView.dxScrollView({
            width: '100%',
            height: '100%',
        });

        return scrollView;
    };

  const popup = $('#randomPopup').dxPopup({
    contentTemplate: popupContentTemplate,
    width: "80vw",
    height: "60vh",
    container: '.dx-viewport',
    showTitle: true,
    title: 'Recipe',
    visible: false,
    dragEnabled: true,
    resizeEnabled: true,
    hideOnOutsideClick: true,
    showCloseButton: false,
    toolbarItems: [{
      widget: 'dxButton',
      toolbar: 'bottom',
      location: 'after',
      options: {
        text: 'Close',
        onClick() {
          popup.hide();
        },
      },
    }],
  }).dxPopup('instance');

  $(RandomCards).each(function(index, currentCard) {
    if (currentCard.strMeal.length > 28) {
        currentCard.strMeal = currentCard.strMeal.substring(0, 26) + "..."
    }

    $('<li>')
      .append(
        $('<img>').attr('src', `${currentCard.strMealThumb}`).attr('id', `image${currentCard.idMeal}`),
        $('<p>').html(`${currentCard.strMeal}`),
        $('<div>')
          .addClass('button-info mt-0 recipe-button-2')
          .dxButton({
            text: 'Details',
            elementAttr: {
              id: 'DETAILS-' + index,
          },
            onClick() {
              GetRandomMealById(currentCard.idMeal)
              popup.option({
                contentTemplate: () => popupContentTemplate(),
              });
              popup.show();
            },
          })
      ).appendTo($('#randomCards'));
  });
};