import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head';
import Link from 'next/link';
import { FaRegCalendar, FaRegUser } from 'react-icons/fa';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    // TODO
    <>
      <Head>
        <title>Home | spacetravelling</title>
      </Head>

      <main className={styles.contentContainer}>
        <div className={styles.posts}>
          {console.log("retorno: ", postsPagination)}
          {postsPagination?.results?.map(post => (
            <Link href={`/posts/${post.uid}`}>
              <a key={post.uid} >
                <strong>{post.data.title}</strong>
                <span>{post.data.subtitle}</span>
                <span>
                  <p>
                    <FaRegCalendar /><time>{post.first_publication_date}</time>
                  </p>
                  <p>
                    <FaRegUser />{post.data.author}
                  </p>
                </span>
              </a>
            </Link>

          ))}

          <a href="#">

            <strong>Creating a Monorepo with</strong>
            <span>Texto grandãoo asdiuajsdiuashdiusadh asiduahsidu asdiuashndiasndas</span>
            <span><p><FaRegCalendar /><time>23 de Junho de 2022</time></p> <p><FaRegUser />Eduardo Almeida</p></span>
          </a>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.getByType(
    'posts'
    , {
      // fetch: ['post.title', 'post.content'],
      pageSize: 5,
    })

  // console.log('response.results: ', response.results);

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      data: {
        title: post.data?.title,
        subtitle: post.data?.subtitle,
        author: post.data?.author,
      }
    }
  })

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: 1
      }
    }
  }
};
