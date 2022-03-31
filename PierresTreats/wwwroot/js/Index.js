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

          $("#listOfFlavors").append(`<li class="list-group-item"><div class="row"><div class="col-8">${result.listOfFlavors.$values[x].name}</div><div class="col-4" style="font-size: 30px;"><span id="remove-${result.listOfFlavors.$values[x].flavorId}-from-${result.thisTreat.treatId}">⊠</span></div></div></li>`);
        }
        $("#detailsCard").show();
      },
      error: function (httpObj) {
        if (httpObj.status == 401) {
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
    },
    error: function () {
      if (response.status == 401) {
        alert("Only authenticated users may add, edit, or delete treats.");
      } else {
        alert(`There was an error while updating ${$("#treatNameInput").val()}`);
      }
      
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
    error: function(response) {
      if (response.status == 401) {
        alert("Only authenticated users may add, edit, or delete treats.");
      } else {
        alert(`Error while deleting ${$("#treatNameInput").val()}`);
      }
    }
  });
});

$("#addFlavorButtonShowModal").click(function() {
  $("#flavorList").empty();
  $.ajax({
    type: "GET",
    url: '../../Treats/GetFlavors',
    success: function (response) {
      for (let x = 0; x < response.$values.length; x++) {
        $("#flavorList").append(
          `<option value="${response.$values[x].flavorId}">${response.$values[x].name}</option>`
        );
      }
    },
    error: function(response) {
      if (response.status == 401) {
        alert("Only authenticated users may add flavors");
      } else {
        alert(`Error while grabbing flavors`);
      }
    }
  });
});

$("#addFlavorToTreat").click(function() {
  $.ajax({
    type: "POST",
    url: '../../Treats/AddFlavor',
    data: { 'treatId':$("#treatId").val(), 'flavorId':$("#flavorList").val()},
    success: function (response) {
      $("#listOfFlavors").append(`<li class="list-group-item"><div class="row"><div class="col-8">${response.thisFlavor.name}</div><div class="col-4" style="font-size: 30px;"><span id="remove-${response.thisFlavor.flavorId}-from-${$("#treatId").val()}">⊠</span></div></div></li>
      <script>
        RemoveFlavorFromTreat(${response.thisFlavor.flavorId}, ${$("#treatId").val()});
      </script>`);
      $("#Modal").modal('hide');
    },
    error: function() {
      alert(`Error while adding flavor}`);
    }
  });
});

function RemoveFlavorFromTreat(flavorId, treatId) {
  $(`#remove-${flavorId}-from-${treatId}`).click(function() {
    $.ajax({
      type: "POST",
      url: '../../Treats/DeleteFlavor',
      data: { 'treatId':treatId, 'flavorId':flavorId },
      success: function () {
        $(`#remove-${flavorId}-from-${treatId}`).closest('li').remove();
        alert("Successfully removed that flavor");
      },
      error: function() {
        if (response.status == 401) {
          alert("Only authenticated users may add, edit, or delete treats.");
        } else {
          alert(`We got a ${response.status} error while deleting the flavor`);
        }
      }
    });
  });
}