//checks password strength in edit-password.hbs



let pass = document.getElementById("new-password");
pass.addEventListener("keyup", () => {
  checkPassword(pass.value)
})

function checkPassword(passoword) {

  var strengthBar = document.getElementById("strength");
  var buttonCheckPass = document.getElementById("changePassword")
  var strength = 0;


  if (passoword.match(/[a-z]+/)) {
    strength += 1

  }
  if (passoword.match(/[A-Z]+/)) {
    strength += 1

  }
  if (passoword.match(/[0-9]+/)) {
    strength += 1

  }
  if (passoword.match(/[~<>?!@$%^&*()]+/)) {
    strength += 1

  }

  if (passoword.length >= 8) {
    strength += 1

  }
  switch (strength) {
    case 0:
      strengthBar.value = "20"
      strengthBar.removeAttribute("class");
      buttonCheckPass.disabled = true
      strengthBar.classList.add("progress-20")
      break;
    case 1:
      strengthBar.value = "40"
      strengthBar.removeAttribute("class");
      buttonCheckPass.disabled = true
      strengthBar.classList.add("progress-40")
      break;
    case 2:
      strengthBar.value = "60"
      strengthBar.removeAttribute("class");
      buttonCheckPass.disabled = true
      strengthBar.classList.add("progress-60")
      break;
    case 3:
      strengthBar.value = "80"
      strengthBar.removeAttribute("class");
      buttonCheckPass.disabled = true
      strengthBar.classList.add("progress-80")
      break;
    case 4:
      strengthBar.value = "90"
      strengthBar.removeAttribute("class");
      buttonCheckPass.disabled = true
      strengthBar.classList.add("progress-90")
      break;
    case 5:
      strengthBar.value = "100"
      strengthBar.removeAttribute("class")
      strengthBar.classList.add("progress-100");
      buttonCheckPass.disabled = false
      break;
  }
}