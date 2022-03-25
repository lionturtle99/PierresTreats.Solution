function getDetailsOfTreat(treatId) {
  $(`#${treatId}-name`).click(function () {
    $("#treatName").show();
    $("#treatNameInput").hide();
    $("#submitNameChange").hide();
    $.ajax({
      type: "GET",
      url: '../../Treats/Details',
      data: { 'id': treatId },
      success: function (result) {
        $("#treatName").text(result.thisTreat.$values[0].name);
        $("#treatCalories").text(result.thisTreat.$values[0].calories);
        $("#treatCost").text(result.thisTreat.$values[0].cost);
        $("#treatId").val(result.thisTreat.$values[0].treatId);
        $("#treatNameInput").val(result.thisTreat.$values[0].name);
        $("#listOfFlavors").empty();
        for (let x = 0; x < result.listOfFlavors.$values.length; x++) {

          $("#listOfFlavors").append(`<li class="list-group-item"><div class="row"><div class="col-8">${result.listOfFlavors.$values[x].name}</div><div class="col-4" style="font-size: 30px;"><span id="remove-${result.listOfFlavors.$values[x].patronId}-from-${result.thisTreat.treatId}">⊠</span></div></div></li>`);
        }
        $("#detailsCard").show();
      },
      error: function (httpObj) {
        if (httpObj.status==401) {
          alert("you aren't yet logged in");
        } else {
          alert("Error while getting treat details");
        }
      }
    });
  });
}

$("#treatName").click(function () {
  $("#treatName").hide();
  $("#treatNameInput").show();
  $("#submitNameChange").show();
});
$("#submitNameChange").click(function () {
  $.ajax({
    type: "POST",
    url: '../../Treats/Edit',
    data: { 'treatId': $("#treatId").val(), 'name': $("#treatNameInput").val(), 'genre': $("#treatGenre").text(), 'pages': $("#treatPages").text() },
    success: function (response) {
      $("#treatName").text($("#treatNameInput").val());
      $("#treatNameInput").hide();
      $("#submitNameChange").hide();
      $("#treatName").show();
      $("#" + $("#treatId").val() + "-name").html($("#treatNameInput").val());
      $("#treatNameInput").val("");
      console.log(response.message);
    },
    error: function () {
      alert(`Error while updating ${$("#treatNameInput").val()}`);
    }
  });
});

$("#delete").click(function() {
  $.ajax({
    type: "POST",
    url: '../../Treats/Delete',
    data: { 'treatId':$("#treatId").val()},
    success: function (response) {
      $("#" + $("#treatId").val() + "-name").remove();
      $("#detailsCard").hide();
    },
    error: function() {
      alert(`Error while deleting ${$("#treatNameInput").val()}`);
    }
  })
})

$("#rentButtonShowModal").click(function() {
  $("#patronList").empty();
  $.ajax({
    type: "GET",
    url: '../../Treats/GetPatrons',
    success: function (response) {
      for (let x = 0; x < response.$values.length; x++) {
        $("#patronList").append(
          `<option value="${response.$values[x].patronId}">${response.$values[x].name}</option>`
        );
      }
    },
    error: function() {
      alert(`Error while fetching patrons`);
    }
  });
});

$("#rentTreat").click(function() {
  $.ajax({
    type: "POST",
    url: '../../Treats/RentToPatron',
    data: { 'treatId':$("#treatId").val(), 'patronId':$("#patronList").val()},
    success: function (response) {
      // $("#listOfFlavors").append(`<li class="list-group-item">${response.thisPatron.name}</li>`);
      $("#listOfFlavors").append(`<li class="list-group-item"><div class="row"><div class="col-8">${response.thisPatron.name}</div><div class="col-4" style="font-size: 30px;"><span id="remove-${response.thisPatron.patronId}-from-${$("#treatId").val()}">⊠</span></div></div></li>`);
      $("#rentModal").modal('hide');
    },
    error: function() {
      alert(`Error while renting ${$("#treatNameInput").val()}`);
    }
  });
});