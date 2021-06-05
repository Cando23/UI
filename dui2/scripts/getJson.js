async function getJsonData(url) {
  let response = await fetch(url);
  if (response.ok) {
    let json = response.json();
    return json;
  }
  else {
    throw new Error(`Error found in URL: ${url}`);
  }
}