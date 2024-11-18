
const originalImg = document.body.querySelector('img#original');

const upload = document.body.querySelector('input#upload');
upload.addEventListener('change', () => {
    const file = upload.files.item(0);
    if (file) {
        originalImg.src = window.URL.createObjectURL(file)
    }
    resize();
});

const tileXInput = document.body.querySelector('input#tileX');
tileXInput.addEventListener('change', () => {
    resize();
});
const tileYInput = document.body.querySelector('input#tileY');
tileYInput.addEventListener('change', () => {
    resize();
});

const outputCanvas = document.querySelector('canvas#output');
outputCanvas.width = 3072;
outputCanvas.height = 4080;


async function getImageDataAsBase64(sysFile) {
    return new Promise((res, rej) => {
        const fileReader = new FileReader();
        fileReader.onerror = (err) => {
            rej(err);
        }
        fileReader.onload = () => {
            res(fileReader.result);
        }
        fileReader.readAsDataURL(sysFile);
    });
}

async function getBlobDataFromCanvas(canvas, type, quality) {
    return new Promise((res) => {
        canvas.toBlob((blob) => res(blob), type, quality);
    });
}

async function createHTMLImage(base64data) {
    return new Promise((res, rej) => {
        const img = document.createElement('img');
        img.onerror = (err) => {
            rej(err);
        }
        img.onload = () => {
            res(img);
        };
        img.src = base64data;
    });
}

async function resize() {
    const file = upload.files.item(0);
    if (!file) {
        return;
    }

    const base64ImageData = await getImageDataAsBase64(file);
    const img = await createHTMLImage(base64ImageData);

    const tileX = tileXInput.valueAsNumber;
    const tileY = tileYInput.valueAsNumber;
    const tileWidth = 3072 / 4;
    const tileHeight = 4080 / 4;
    const bitmap = await createImageBitmap(img, tileWidth * tileX, tileHeight * tileY, tileWidth, tileHeight);

    const context = outputCanvas.getContext('2d');
    context.drawImage(bitmap, 0, 0, tileWidth, tileHeight);
}
