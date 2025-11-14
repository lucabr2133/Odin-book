import { Router } from 'express';
import ControlerData from '../controller/controller.js';
const likesRouter = Router();
likesRouter.post('/likes', async (req, res) => {
  const { likes, publicationID, userActiveID } = req.body;
  const likesPublication = await ControlerData.postLikePublication(likes, publicationID, userActiveID);
  res.json(likesPublication);
});
likesRouter.delete('/likes', async (req, res) => {
  const { likeId } = req.body;
  const likesPublication = await ControlerData.deleteLikePublication(likeId);
  res.json({ likesPublication, redirectUrl: 'http://localhost:5173/' });
});
likesRouter.get('/likes', async (req, res) => {
  
  const likesPublication = await ControlerData.getLikePublication();

  res.json(likesPublication);
});
export default likesRouter;
