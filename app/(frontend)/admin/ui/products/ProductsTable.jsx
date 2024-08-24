import React from "react";
import {
  Badge,
  useIndexResourceState,
  IndexTable,
  Thumbnail,
  Link,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";

export default function ProductsIndexTable({ products }) {
  const resourceName = {
    singular: "product",
    plural: "products",
  };

  // Hook for managing resource selection in the table
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);

  const promotedBulkActions = [
    {
      content: "Set as draft",
      onAction: () => console.log("Todo: implement set as draft"),
    },
  ];

  const bulkActions = [
    {
      content: "Add tags",
      onAction: () => console.log("Todo: implement bulk add tags"),
    },
    {
      content: "Remove tags",
      onAction: () => console.log("Todo: implement bulk remove tags"),
    },
    {
      content: "Archive products",
      onAction: () => console.log("Todo: implement archive products"),
    },
    {
      icon: DeleteIcon,
      destructive: true,
      content: "Delete products",
      onAction: () => console.log("Todo: implement bulk delete"),
    },
  ];

  // Create table row markup for each product
  const rowMarkup = products.map(
    ({ id, name, status, quantity, cat: categoryName, image }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Thumbnail
            source={image[0]}
            size="small"
            alt={"product thumbnail" + name}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Link
            monochrome
            removeUnderline
            url={`/admin/products/${id}`}
            dataPrimaryLink
          >
            {name}
          </Link>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge
            tone={`${
              status === "Active" ? "success" : status === "Draft" ? "info" : ""
            }`}
          >
            {status}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{quantity}</IndexTable.Cell>
        <IndexTable.Cell>{categoryName.join(", ")}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <IndexTable
      resourceName={resourceName}
      itemCount={products.length}
      selectedItemsCount={
        allResourcesSelected ? "All" : selectedResources.length
      }
      bulkActions={bulkActions}
      promotedBulkActions={promotedBulkActions}
      onSelectionChange={handleSelectionChange}
      sortable={[false, true, true, true, true]}
      headings={[
        { title: "" },
        { title: "Name" },
        { title: "Status" },
        { title: "Inventory" },
        { title: "Category" },
      ]}
      pagination={{
        hasNext: true,
        onNext: () => {},
      }}
    >
      {rowMarkup}
    </IndexTable>
  );
}
