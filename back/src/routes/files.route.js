import { Router } from "express";
import multer from "multer";
const uploader = multer({ dest: './public/data' });
import { v2 as cloudinary } from 'cloudinary';
import ControlerData from '../controller/controller.js';


cloudinary.config({
  cloud_name: 'dv8swkyjy',
  api_key: process.env.CLOUDFLARE_API_KEY,
  api_secret: process.env.CLOUDFLARE_API_SECRET
});

const filesRouter= Router()
filesRouter.post('/profile/:username', uploader.single('profile'), async (req, res) => {
  const { username } = req.params;

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true
  };
  const path = req.file?.path??req.body.image_url;
  const result = await cloudinary.uploader.upload(path, options);

 const imageUrl = cloudinary.url(result.public_id, {
  transformation: [
    { aspect_ratio: '1.0', width: 250, crop: 'fill' },
    { radius: 'max' },
    { fetch_format: 'auto' }
  ]
});


  const user = await ControlerData.updateProfileController(username, imageUrl, req.body.description);
  res.json({
    user
  });
});
filesRouter.post('/:userid/publication/', uploader.single('publicationImg'), async (req, res) => {
  try{
const path = req.file?.path??req.body.publicationImg;

  if(!path) return (res.status(400).json({message:'Image required'}))
    if(!req.body.description)return (res.status(400).json({message:'Description required'}))
  const { userid } = req.params;

  const result = await cloudinary.uploader.upload(path, {
    width: 500, // Ancho en píxeles
    height: 800, // Alto en píxeles
    crop: 'fill' // Método de recorte (fill, fit, scale, etc.)
  });

  const publication = await ControlerData.createPubliationController(userid, result.url, req.body.description);
  res.json({
    message: 'publicacion creada exitosamente',
    publication

  });
  }catch(e){
    console.log(e);
    res.status(500).json({message:"Create publication failed"})
    
  }
  
});
filesRouter.put('/publication/:id', uploader.single('img'), async (req, res) => {
  try {
    const { id } = req.params;
    const description = req.body.description;
    let imageUrl = null;

    if (req.file?.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        width: 500,
        height: 800,
        crop: 'fill'
      });

      imageUrl = result.url;
    }

    // Pasás la imagen solo si existe, y que el controller la maneje
    const publication = await ControlerData.updatePublicationController(
      id,
      imageUrl, // puede ser null
      description
    );

    res.json({
      message: 'Publicación actualizada exitosamente',
      publication
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar la publicación' });
  }
});export default filesRouter