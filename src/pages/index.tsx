import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head';

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

export default function Home() {
  return (
    // TODO
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about<br />the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
          </p>
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // const price = await stripe.prices.retrieve('price_1L6dnKHWUPDNLZSnyvmyDsAn')

  const product = {
  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
};
