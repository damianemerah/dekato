"use client";

import React from "react";

const Products = () => {
  return (
    <div fullWidth>
      <div>
        <div title="Order details" sectioned>
          <p>
            Use to follow a normal section with a secondary section to create a
            2/3 + 1/3 layout on detail pages (such as individual product or
            order pages). Can also be used on any page that needs to structure a
            lot of content. This layout stacks the columns on small screens.
          </p>
        </div>
        <section variant="oneThird">
          <p>Add tags to your order.</p>
        </section>
      </div>
    </div>
  );
};

export default Products;
