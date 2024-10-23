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
    const allUser = await prisma.user.findMany({
        select: {
            username: true,
            image: true,
            isVerified: true,
        }
    });
    res.json({allUser});
});

//get one user
router.get ('/:id', async(req, res) => {
    const {id} = req.params;
    try{
        const user = await prisma.user.findUnique({ 
            where: { 
                id: Number(id),
            },
            include: { 
                tweet: {
                    select: {
                        content: true,
                        image: true,
                        impression: true,
                    }
                }
            },
    });
        if(!user){
            res.status(404).json({ error: "User Not Found."});                
        }else{
            res.json(user);
        }
    }catch (e) {
        res.status(404).json({ error: "User Not Found."});    
    }
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