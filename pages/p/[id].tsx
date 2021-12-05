import React from "react";
import Router from 'next/router';
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from '../../lib/prisma';
import { useSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })

  return {
    props: post
  }
}

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status} = useSession();

  if ( status == "loading") {
    return <div>Authenticating ...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;

  let title = props.title;

  if (!props.published) {
    title = `${title} (Draft)`;
  }

  const publishPost = async (postID: number): Promise<void> => {
    try {
      await fetch(`/api/publish/${postID}`, {
        method: 'PUT',
      })

      await Router.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  const deletePost = async (postID: Number): Promise<void> => {
    try {
      await fetch(`/api/post/${postID}`, {
        method: 'DELETE',
      });

      Router.push('/');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown source={props.content} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Post
