import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function upLoadFile(file, fileName) {
    try {
        const result = await imagekit.files.upload({
            file: await toFile(file, fileName),
            fileName: fileName
        })
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export { upLoadFile };  