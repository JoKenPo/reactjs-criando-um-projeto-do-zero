import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head';
import Link from 'next/link';
import { FaRegCalendar, FaRegUser } from 'react-icons/fa';
import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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
  const [nextPostsPagination, setNextPostsPagination] = useState<PostPagination>({
    next_page: postsPagination.next_page,
    results: []
  });

  const getNextPage = (url: string) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const posts = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data?.title,
              subtitle: post.data?.subtitle,
              author: post.data?.author,
            }
          }
        })

        setNextPostsPagination({
          results: posts,
          next_page: data?.next_page
        })
      })
  };

  return (
    // TODO
    <>
      <Head>
        <title>Home | spacetravelling</title>
      </Head>

      <main className={styles.contentContainer}>
        <div className={styles.posts}>

          {postsPagination?.results?.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title}</strong>
                <span>{post.data.subtitle}</span>
                <span>
                  <p>
                    <FaRegCalendar /><time>
                      {format(
                        new Date(post.first_publication_date),
                        "dd MMM yyyy",
                        { locale: ptBR }
                      )}
                    </time>
                  </p>
                  <p>
                    <FaRegUser />{post.data.author}
                  </p>
                </span>
              </a>
            </Link>

          ))}

          {nextPostsPagination.results.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid} >
              <a >
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

          {/* <a href="#">

            <strong>Creating a Monorepo with</strong>
            <span>Texto grandãoo asdiuajsdiuashdiusadh asiduahsidu asdiuashndiasndas</span>
            <span><p><FaRegCalendar /><time>23 de Junho de 2022</time></p> <p><FaRegUser />Eduardo Almeida</p></span>
          </a> */}

          {(nextPostsPagination?.next_page) && (

            <button className={styles.nextPage} onClick={() => getNextPage(nextPostsPagination?.next_page)} >
              Carregar mais posts
            </button>
          )}
        </div>

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({})

  const response = await prismic.getByType(
    'posts'
    , {
      fetch: ['post.title'],
      pageSize: 1,
    })

  // console.log('response: ', response);

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
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
        next_page: response?.next_page
      }
    }
  }
};
