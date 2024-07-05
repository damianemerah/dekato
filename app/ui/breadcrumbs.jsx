import clsx from "clsx";
import Link from "next/link";
import React from "react";

export default function Breadcrumbs({ breadcrumbs }) {
  return (
    <nav aria-label='breadcrumb'>
      <ol className='flex text-sm md:text-base'>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(
              breadcrumb.active ? "text-gray-900" : "text-gray-500"
            )}
          >
            <Link href={breadcrumb.href}>
              {breadcrumb.label}
              {index < breadcrumbs.length - 1 ? (
                <span className='mx-3 inline-block'>{">"}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
