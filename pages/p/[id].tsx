import React from "react";
import Router from 'next/router';
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { useSession } from 'next-auth/react';

const Post = ({ post }) => {
  const { data: session, status} = useSession();

  if ( status == "loading") {
    return <div>Authenticating ...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === post.author?.email;

  let title = post.title;

  if (!post.published) {
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
        <p>By {post?.author?.name || "Unknown author"}</p>
        <ReactMarkdown source={post.content} />
        {!post.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(post.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(post.id)}>Delete</button>
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
