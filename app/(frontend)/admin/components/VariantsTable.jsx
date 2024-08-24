import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
  useBreakpoints,
  Card,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import React from "react";

function VariantsTable() {
  const variants = [
    {
      id: "variant-1",
      size: "L",
      color: "Black",
      material: "Rubber",
      price: 0.0,
      quantity: 0,
      images: [],
    },
    {
      id: "variant-2",
      size: "XL",
      color: "White",
      material: "Rubber",
      price: 0.0,
      quantity: 0,
      images: [],
    },
    {
      id: "variant-3",
      size: "M",
      color: "Red",
      material: "Rubber",
      price: 0.0,
      quantity: 0,
      images: [],
    },
    {
      id: "variant-4",
      size: "L",
      color: "White",
      material: "Rubber",
      price: 0.0,
      quantity: 0,
      images: [],
    },
  ];

  const resourceName = {
    singular: "variant",
    plural: "variants",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(variants);

  const rowMarkup = variants.map(
    ({ id, size, color, price, quantity, images }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {size}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{price}</IndexTable.Cell>
        <IndexTable.Cell>{quantity}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const promotedBulkActions = [
    {
      content: "Create shipping labels",
      onAction: () => console.log("Todo: implement bulk edit"),
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
      icon: DeleteIcon,
      destructive: true,
      content: "Delete orders",
      onAction: () => console.log("Todo: implement bulk delete"),
    },
  ];

  return (
    <Card>
      <IndexTable
        condensed={useBreakpoints().smDown}
        resourceName={resourceName}
        itemCount={variants.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "Variants" },
          { title: "Price" },
          { title: "Available" },
        ]}
        bulkActions={bulkActions}
        promotedBulkActions={promotedBulkActions}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}

export default VariantsTable;
