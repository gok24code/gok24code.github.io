function startCountdown() {
  const displayh = document.querySelector("#hours");
  const displaym = document.querySelector("#minutess");
  const displays = document.querySelector("#seconds");
  const timeInput = document.querySelector('input[type="time"]').value;
  if (!timeInput) return;

  let [hours, minutes] = timeInput.split(":").map(Number);
  let totalSeconds = hours * 3600 + minutes * 60;
  console.log(totalSeconds);
  let timer = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timer);
      reloadScene();
      return;
    }

    let remainingHours = Math.floor(totalSeconds / 3600);
    let remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    let remainingSeconds = totalSeconds % 60;

    displayh.textContent =
      remainingHours < 10
        ? "0" + String(remainingHours)
        : String(remainingHours);

    displaym.textContent =
      remainingMinutes < 10
        ? "0" + String(remainingMinutes)
        : String(remainingMinutes);

    displays.textContent =
      remainingSeconds < 10
        ? "0" + String(remainingSeconds)
        : String(remainingSeconds);

    totalSeconds--;
  }, 1000);

  // Buton ve inputu gizle
  document.getElementById("startButton").style.display = "none";
  document.getElementById("Tinput").style.display = "none";
}

document
  .getElementById("startButton")
  .addEventListener("click", startCountdown);

function reloadScene() {
  location.reload();
}
