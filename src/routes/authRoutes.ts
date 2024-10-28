import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'; 

const router = Router();
const prisma = new PrismaClient();


const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = "SUPER SECRET"; //taken from environment later

//Generate a random 8 didigt number as the email token
function generateEmailToken(): string {
    var token = Math.floor(10000000 + Math.random() * 90000000).toString();
    var unique = prisma.token.findUnique({ where:{ emailToken: token }});

    if(prisma){
        token = Math.floor(10000000 + Math.random() * 90000000).toString();
        unique = prisma.token.findUnique({ where:{ emailToken: token }});
    }

    return token;
}

function generateAuthToken(tokenId: number): string{
    const jwtPayload = { tokenId };
    const signed = jwt.sign(jwtPayload, JWT_SECRET, {
        algorithm: "HS256",
        noTimestamp: true,
    });

    return signed;
}

//create a user, if it doesnt exist
//generate the email token and send to user's email
router.post('/login', async(req, res) => {
    const { email } = req.body;
    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES *60 * 1000);

    try{
        const createdToken = await prisma.token.create({
            data: {
                type: "EMAIL",
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create:{ email },
                    }
                }
            }
        });
    
        console.log(createdToken);
        //send email tokento user's email
    
        res.sendStatus(200);
    } catch (e){
        console.log(e);
        res
            .status(400)
            .json({ error: "Couldn't start the authentication process."})
    }
});

//Validate the emailToken
//Generate JWT
router.post('/authenticate', async(req, res) => {
    const { email, emailToken } = req.body;

    try{
        const dbEmailToken = await prisma.token.findUnique({
            where: {
                emailToken,
            },
            include: {
                user: true,
            },
        });

        //console.log(dbEmailToken);
        //console.log(Date());

        if(!dbEmailToken || !dbEmailToken.valid){
            await prisma.token.delete({
                where: { emailToken: emailToken }
            });
            res.sendStatus(401);
        }else if(dbEmailToken.expiration < new Date()){
            await prisma.token.delete({
                where: { emailToken: emailToken }
            });

            res.sendStatus(401).json({ error: "Token expired."});
        }else if(dbEmailToken.user.email != email ){
        //check if email matches the token (else attacker might brute force token that is valid)
            res.sendStatus(401).json();
        }else{
            await prisma.token.delete({
                where: { emailToken: emailToken }
            });

            //generate jwt token for authorized user
            const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS *60 *60 * 1000);

            const apiToken = await prisma.token.create({
                data: {
                    type: "API",
                    expiration: expiration,
                    user: {
                        connect: {
                            email,
                        },
                    },
                },
            })

            const authToken = generateAuthToken(apiToken.id);
            
            res.json({ authToken });
        }

    } catch (e){
        res.sendStatus(401);
    }

});

//Invalidate JWT token
router.post('/logout', async(req, res) => {

});


export default router;