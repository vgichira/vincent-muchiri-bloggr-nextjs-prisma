import prisma from '../../../lib/prisma';

const deletePost = async (req, res) => {
    const postId = req.query.id;

    if (req.method != 'DELETE') {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
        return
    }

    const post = await prisma.post.delete({
        where: {
            id: Number(postId)
        }
    });

    res.json(post);
}

export default deletePost;