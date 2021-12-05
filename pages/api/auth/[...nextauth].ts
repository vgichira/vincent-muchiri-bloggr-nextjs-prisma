import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import GithubProviders from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../lib/prisma';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;

const options = {
    providers: [
        GithubProviders({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        })
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
}