import prisma from '../../../lib/prisma';

const publishPost = async (req, res) => {
    const postID = req.query.id;

    const post = await prisma.post.update({
        where: {
            id: Number(postID),
        },
        data: { published: true },
    });

    res.json(post)
}

export default publishPost;