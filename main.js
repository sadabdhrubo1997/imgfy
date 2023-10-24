// element selection
const fileInput = document.getElementById('file-input');
const qualityInput = document.getElementById('quality-input');
const uploadedImage = document.querySelector('#uploaded-image img');
const compressedImage = document.querySelector('#compressed-image img');
const loader1 = document.querySelector('.loader1');
const loader2 = document.querySelector('.loader2');
loader1.style.display = 'none';
loader2.style.display = 'none';

function compressImage(file, config) {
  const _defaultConfig = { quality: 0.7 };
  const { quality } = Object.assign(_defaultConfig, config);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        const canvas = document.createElement('canvas');

        let width = img.width;
        let height = img.height;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas content to a data URL
        const originalImageDataUrl = canvas.toDataURL(file.type, 1);
        const compressedImageDataUrl = canvas.toDataURL(file.type, +quality);

        // Resolve the Promise with the base64 image data
        resolve({ original: originalImageDataUrl, compressed: compressedImageDataUrl });
      };

      img.onerror = function () {
        // In case of an error while processing the image, reject the Promise
        reject('Error processing the image.');
      };
    };

    reader.onerror = function () {
      // In case of an error while reading the file, reject the Promise
      reject('Error reading the file.');
    };
  });
}

const compressImgConfig = {
  quality: 0.5,
  maxImgFileSize: '',
};

function handleCompressImage(compressImgConfig) {
  const selectedFile = fileInput.files[0];
  loader1.style.display = 'block';
  loader2.style.display = 'block';
  if (selectedFile) {
    compressImage(selectedFile, compressImgConfig)
      .then((data) => {
        uploadedImage.src = data.original;
        compressedImage.src = data.compressed;
      })
      .catch((error) => console.log(error))
      .finally(() => {
        loader1.style.display = 'none';
        loader2.style.display = 'none';
      });
  }
}

fileInput.addEventListener('change', () => handleCompressImage(compressImgConfig));

qualityInput.addEventListener('change', (e) => {
  handleCompressImage({ ...compressImgConfig, quality: e.target.value / 100 });
});
