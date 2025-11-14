import { Router } from 'express';
import ControlerData from '../controller/controller.js';
const commentRouter = Router();
commentRouter.post('/comments', async (req, res) => {
  const { comment, userId, publicationId } = req.body;
  if(!comment||!userId||!publicationId) return res.sendStatus(400)
  const createComment = await ControlerData.createCommentController(comment, userId, publicationId);
  res.json({
    message: 'comment Created succeful',
    createComment
  });
});
commentRouter.get('/comments', async (req, res) => {
  const comments = await ControlerData.getCommentController();

  res.json(comments);
});
export default commentRouter;
