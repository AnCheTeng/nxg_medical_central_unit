$(document).ready(function() {

  setInterval(function() {
    // Call the API------
    // API: /hospitalvm/list
    // API: /hospitalvm/renew
    // API: /hospitalvm/analysis
    var list_api = "/hospitalvm/list";
    var renew_api = "/hospitalvm/renew";
    var analysis_api = "/hospitalvm/analysis";

    $.get(list_api, (response)=>{
      var hospital_list = response[0]+"，"+response[1]+"，"+response[2];
      $("#hospital_list").text(hospital_list);
    });

    $.get(renew_api, ()=>{});

    $.get(analysis_api, (response)=>{

      $("#bloodA").text(response.blood[0]);
      $("#bloodB").text(response.blood[1]);
      $("#bloodC").text(response.blood[2]);
      $("#bedA").text(response.patient[0]);
      $("#bedB").text(response.patient[1]);
      $("#bedC").text(response.patient[2]);

    });

  }, 1000);


  $("button").on("click", function() {
    var value = $("input").val();
    // Load the API------
    // API: load/value
    var complete_api = "/hospitalvm/load/" + value
    console.log(complete_api);
    $.get(complete_api, ()=>{});

  });



});
