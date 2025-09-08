function startCountdown() {
  const display = document.querySelector("#count-number");
  const timeInput = document.querySelector('input[type="time"]').value;
  if (!timeInput) return;

  let [hours, minutes] = timeInput.split(":").map(Number);
  let totalSeconds = hours * 3600 + minutes * 60;

  let timer = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timer);
      reloadScene();
      return;
    }

    let remainingHours = Math.floor(totalSeconds / 3600);
    let remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    let remainingSeconds = totalSeconds % 60;

    display.textContent = `${String(remainingHours).padStart(2, "0")}:${String(
      remainingMinutes
    ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

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
