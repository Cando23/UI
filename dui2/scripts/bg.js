const getImagesButton = document.getElementById('button-update');
const background = document.querySelector('.main');

getImagesButton.addEventListener('click', async () => {
  try {
    let key = 'GM1IelYNUpRsX3RVruTX7VDYFeyprNEUBHYDYmb-b2c';
    let url = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=${key}`;
    let json = await getJsonData(url);
    let image = json["urls"]["regular"];
    localStorage.setItem("Image", image);
    background.style.backgroundImage = `url(${image})`;
  }
  catch (error) {
    alert(error);
  }
});
