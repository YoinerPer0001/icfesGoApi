import ImageKit from "imagekit";
import "dotenv/config";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY ?? "",       // la pública (no sensible)
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? "",     // la privada (manténla segura)
  urlEndpoint: "https://ik.imagekit.io/gwhwzqirc"
});

export default imagekit;
