$(document).ready(function() {

  setInterval(function() {
    console.log("Hi");
    // Call the API
    // API: list
    // API: renew
    // API: analysis
  }, 1500);

  $("button").on("click", function() {
    var value = $("input").val();
    if(ValidateIPaddress(value)==true){
      // Load the API
      // API: load/value
      console.log("Yo");
      console.log(value);
    }
  })



})
