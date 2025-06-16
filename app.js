const verseDisplay = document.getElementById("verseDisplay");

async function fetchVerse() {
  const input = document.getElementById("verseInput").value.trim();
  if (!input) return;

  const response = await fetch(`https://bible-api.com/${encodeURIComponent(input)}`);
  const data = await response.json();

  if (data.text) {
    verseDisplay.innerText = `${data.reference}\n\n${data.text}`;
  } else {
    verseDisplay.innerText = "Verse not found.";
  }
}

async function shareVerse() {
  const text = verseDisplay.innerText;
  if (navigator.share && text) {
    await navigator.share({
      title: "Bible Verse",
      text: text,
      url: window.location.href
    });
  } else {
    alert("Sharing not supported on this device.");
  }
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

