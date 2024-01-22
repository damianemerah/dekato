// 'components/LinkWrapper.js'
import React from 'react';
import Link from 'next/link';

const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

const LinkWrapper = ({ children, url = '', external, ...rest }) => {
  // Next.js Link supports client-side navigation, so use it for internal links
  if (!external && !IS_EXTERNAL_LINK_REGEX.test(url)) {
    return (
      <Link href={url} {...rest}>
        {children}
      </Link>
    );
  }

  // For external links, use a regular anchor tag
  return (
    <a href={url} target='_blank' rel='noopener noreferrer' {...rest}>
      {children}
    </a>
  );
};

export default LinkWrapper;
