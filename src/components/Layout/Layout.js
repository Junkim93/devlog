// @flow
import React from 'react';
import Helmet from 'react-helmet';
import type { Node as ReactNode } from 'react';
import styles from './Layout.module.scss';

type Props = {
  children: ReactNode,
  title: string,
  description?: string
};

const Layout = ({ children, title, description }: Props) => (
  <div className={styles.layout}>
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="google-site-verification" content="oNOygxSDdksaRZNmicKVEBcbenrgQGL_Z_mJ0JdX8ks" />
    </Helmet>
    {children}
  </div>
);

export default Layout;
