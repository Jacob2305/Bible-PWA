export default async function getVerseText(reference) {
  try {
    const res = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}`);
    const data = await res.json();
    return data.text?.trim();
  } catch (err) {
    return null;
  }
}
