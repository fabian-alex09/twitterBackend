import { Router } from 'express';

const router = Router();

//tweet CRUD
router.post('/', (req, res) => {
    res.status(501).json({error: 'Not Implemented'});
});

//list tweets
router.get ('/', (req, res) => {
    res.status(501).json({ error: 'Not Implemented'});
});

//get one tweet
router.get ('/:id', (req, res) => {
    const {id} = req.params;
    res.status(501).json({ error: `Not Implemented: ${id}`});
});

//update tweet
router.put ('/:id', (req, res) => {
    const {id} = req.params;
    res.status(501).json({ error: `Not Implemented: ${id}`});
});

//delete tweet
router.delete ('/:id', (req, res) => {
    const {id} = req.params;
    res.status(501).json({ error: `Not Implemented: ${id}`});
});


export default router;