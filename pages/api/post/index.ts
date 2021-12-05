import { useSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

const createPost = async (req, res) => {
    const { title, content } = req.body;

    const { data: session } = useSession();

    const result = await prisma.post.create({
        data: { 
            title, 
            content, 
            author: { connect: { email: session?.user.email } }
        }
    });

    res.json(result);
}

export default createPost;