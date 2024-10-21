import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

//create user
router.post('/', async (req, res) => {
    const { email, name, username } = req.body;
    try{
        const result = await prisma.user.create({
            data: {
                email,
                name,
                username,
            }
        });
        res.json(result);    
    } catch (e) {
        res.status(400).json({ error: "Username and emails should be unique."});
    }
});

//list all users
router.get ('/', async (req, res) => {
    const allUser = await prisma.user.findMany();
    res.json({allUser});
});

//get one user
router.get ('/:id', async (req, res) => {
    const {id} = req.params;
    //need to transform id to Number since const{id} is a string from the parameters
    const user = await prisma.user.findUnique({ where: {id: Number(id)}}); 
    res.json(user);
});

//update user
router.put ('/:id', async(req, res) => {
    const {id} = req.params;
    const {bio, name, image} = req.body;

    try{
        const result = await prisma.user.update({
            where: { id: Number(id)},
            data: {
                name,
                image,
            }
        });
        res.json(result);
    } catch(e){
        res.status(400).json({ error: "Failed to update the user."});
    }
});

//delete user
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