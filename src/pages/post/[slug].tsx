import { GetStaticPaths, GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Head from 'next/head';
import { FaClock, FaRegCalendar, FaRegUser } from 'react-icons/fa'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';

interface Post {
  first_publication_date: string | null;
  uid: string;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter()

  if (router.isFallback) return (<p>Carregando...</p>)

  const readingTime = Math.ceil(
    post.data.content.reduce((time, words) => {
      return time += RichText.asText(words.body).split(' ').length
    }, 0) / 200)

  return (
    <>
      <Head>
        <title>{post.data?.title} | spacetravelling</title>
      </Head>

      <main className={styles.contentContainer}>
        {post &&
          <>
            <div className={styles.infinityBanner}>
              <img src={post.data?.banner?.url} alt="banner" />
            </div>
            <div className={styles.posts}>
              <h1>{post.data.title}</h1>
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
                <p>
                  <FaClock /> {readingTime} min
                </p>
              </span>
              <div className={`${styles.postContent}`} key={post.uid}>
                {post.data.content.map((content, index) => {
                  return (
                    <>
                      <h2>{content.heading}</h2>
                      <p>{content.body.map((paragraph) => { return paragraph.text })}</p>
                    </>
                  )
                })}
              </div>
            </div>
          </>}
      </main>
    </>
  )
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map((item) => ({
    params: { slug: item.uid },
  }))

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(params.slug), {});

  // console.log('response: ', response);

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner?.url || null
      },
      author: response.data.author,
      content: response.data.content,
    }
  };

  return {
    props: {
      post
    }
  }
};
