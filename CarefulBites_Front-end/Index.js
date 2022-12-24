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
    const scrollView = $('<div />');
    scrollView.append(
      $(`<p>Meal: <span>${RandomCardsById.strMeal}</span></p>`),
      $(`<p>Origin: <span>${RandomCardsById.strArea}</span></p>`),
      $(`<p>Tags: <span>${RandomCardsById.strTags}<span></p>`),
      $(`<p>Category: <span>${RandomCardsById.strCategory}<span></p>`),
      $(`<p>Video: <span>${RandomCardsById.strYoutube}<span></p>`),
      $(`<p>Source: <span>${RandomCardsById.strSource}</span></p>`),
      $(`<p>Ingredients: <span>${RandomCardsById.strIngredient1}<span><span>${" " + RandomCardsById.strMeasure1}<span><span>${" " + RandomCardsById.strIngredient2}<span><span>${" " + RandomCardsById.strMeasure2}<span><span>${" " + RandomCardsById.strIngredient3}<span><span>${" " + RandomCardsById.strMeasure3}<span><span>${" " + RandomCardsById.strIngredient4}<span><span>${" " + RandomCardsById.strMeasure4}<span><span>${" " + RandomCardsById.strIngredient5}<span><span>${" " + RandomCardsById.strMeasure5}<span><span>${" " + RandomCardsById.strIngredient6}<span><span>${" " + RandomCardsById.strMeasure6}<span><span>${" " + RandomCardsById.strIngredient7}<span><span>${" " + RandomCardsById.strMeasure7}<span><span>${" " + RandomCardsById.strIngredient8}<span><span>${" " + RandomCardsById.strMeasure8}<span><span>${" " + RandomCardsById.strIngredient9}<span><span>${" " + RandomCardsById.strMeasure9}<span><span>${" " + RandomCardsById.strIngredient10}<span><span>${" " + RandomCardsById.strMeasure10}<span><span>${" " + RandomCardsById.strIngredient11}<span><span>${" " + RandomCardsById.strMeasure11}<span><span>${" " + RandomCardsById.strIngredient12}<span><span>${" " + RandomCardsById.strMeasure12}<span><span>${" " + RandomCardsById.strIngredient13}<span><span>${" " + RandomCardsById.strMeasure13}<span><span>${" " + RandomCardsById.strIngredient14}<span><span>${" " + RandomCardsById.strMeasure14}<span><span>${" " + RandomCardsById.strIngredient15}<span><span>${" " + RandomCardsById.strMeasure15}<span><span>${" " + RandomCardsById.strIngredient16}<span><span>${" " + RandomCardsById.strMeasure16}<span><span>${" " + RandomCardsById.strIngredient17}<span><span>${" " + RandomCardsById.strMeasure17}<span><span>${" " + RandomCardsById.strIngredient18}<span><span>${" " + RandomCardsById.strMeasure18}<span><span>${" " + RandomCardsById.strIngredient19}<span><span>${" " + RandomCardsById.strMeasure19}<span><span>${" " + RandomCardsById.strIngredient20}<span><span>${" " + RandomCardsById.strMeasure20}<span>`),
      $(`<p>Instructions: <span>${RandomCardsById.strInstructions}<span></p>`),
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

  RandomCards.forEach((currentCard) => {
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

$(function () {
  $("#amountSelection").dxTagBox({
    items: Numbers,
    onValueChanged: function (e) {
      var element = document.getElementById("randomCards");
      element.innerHTML = "";
      amount = e.value[0];
      GetRandomMeals(amount);
    },
  });
});

const Numbers = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10'
]