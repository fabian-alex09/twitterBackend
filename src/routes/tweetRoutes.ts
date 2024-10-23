import { Router } from 'express';
import {PrismaClient} from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

//create tweet
router.post('/', async(req, res) => {
    const { content, image, userId } = req.body;
    try{
        const result = await prisma.tweet.create({
            data: {
                content,
                image,
                userId //TODO manage based on the auth user
            }
        });
        res.json(result);    
    } catch (e) {
        res.status(400).json({ error: "Unable to create tweet."});
    }
});


//list all tweets
router.get ('/', async(req, res) => {
    const allTweets = await prisma.tweet.findMany();
    res.json(allTweets);
});

//get one tweet
router.get ('/:id', async(req, res) => {
    const {id} = req.params;
    try{
        const tweet = await prisma.tweet.findUnique({ where: { id: Number(id)}});
        if(!tweet){
            res.status(404).json({ error: "Tweet Not Found."});                
        }else{
            res.json(tweet);
        }
    }catch (e) {
        res.status(404).json({ error: "Tweet Not Found."});    
    }
});

//update tweet
router.put ('/:id', async(req, res) => {
    const {id} = req.params;
    const {content, image} = req.body;

    try{
        const result = await prisma.tweet.update({
            where: { id: Number(id)},
            data: {
                content,
                image,
            }
        });
        res.json(result);
    } catch(e){
        res.status(400).json({ error: "Failed to update tweet."});
    }

});

//delete tweet
router.delete ('/:id', async(req, res) => {
    const {id} = req.params;
    try{
        await prisma.user.delete({ where: {id: Number(id)}});
        res.status(200).json({ message: "User deleted."});
    } catch (e){
        res.status(400).json({ error: "Failed to delete user."})
    }
});


export default router;