(function () {
  "use strict";

  var bookNow = document.getElementById("ehBookNow");
  var remindMe = document.getElementById("ehRemindMe");

  if (bookNow) {
    bookNow.addEventListener("click", function () {
      console.log("Book engine service now");
    });
  }

  if (remindMe) {
    remindMe.addEventListener("click", function () {
      console.log("Remind engine service later");
    });
  }
})();
