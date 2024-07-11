"use client";

import {
  Badge,
  Card,
  ChoiceList,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  IndexTable,
  Page,
  Thumbnail,
  Button,
  Link,
  LegacyCard,
  Box,
} from "@shopify/polaris";

import { useState, useCallback } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

function Products() {
  const router = useRouter();

  // Function to format labels for filter selections
  function disambiguateLabel(key, value) {
    switch (key) {
      case "type":
        return value.map((val) => `type: ${val}`).join(", ");
      case "tone":
        return value.map((val) => `tone: ${val}`).join(", ");
      default:
        return value;
    }
  }

  // Function to check if a value is empty (for filter logic)
  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }

  // Helper function for simulating asynchronous operations
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // State for managing tabs (view options)
  const [itemStrings, setItemStrings] = useState([
    "All",
    "Active",
    "Draft",
    "Archived",
  ]);

  // Function to delete a tab (view option)
  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0); // Select the "All" tab after deletion
  };

  // Function to duplicate a tab (view option)
  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length); // Select the newly duplicated tab
    await sleep(1); // Simulate a delay
    return true;
  };

  // Create tab objects for each view option
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {}, // Placeholder for future actions
    id: `${item}-${index}`,
    isLocked: index === 0, // Lock the "All" tab
    actions:
      index === 0
        ? [] // No actions for the "All" tab
        : [
            {
              type: "rename",
              onAction: () => {}, // Placeholder for future actions
              onPrimaryAction: async (value) => {
                // Update tab names based on user input
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1); // Simulate a delay
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (name) => {
                await sleep(1); // Simulate a delay
                duplicateView(name); // Duplicate the tab
                return true;
              },
            },
            {
              type: "edit", // Placeholder for future edit functionality
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1); // Simulate a delay
                deleteView(index); // Delete the tab
                return true;
              },
            },
          ],
  }));

  // State for managing the selected tab
  const [selected, setSelected] = useState(0);

  // Function to create a new tab (view option)
  const onCreateNewView = async (value) => {
    await sleep(500); // Simulate a delay
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length); // Select the newly created tab
    return true;
  };

  // Sort options for the product list
  const sortOptions = [
    { label: "Product", value: "product asc", directionLabel: "Ascending" },
    { label: "Product", value: "product desc", directionLabel: "Descending" },
    { label: "Status", value: "tone asc", directionLabel: "A-Z" },
    { label: "Status", value: "tone desc", directionLabel: "Z-A" },
    { label: "Type", value: "type asc", directionLabel: "A-Z" },
    { label: "Type", value: "type desc", directionLabel: "Z-A" },
    { label: "Vendor", value: "vendor asc", directionLabel: "Ascending" },
    { label: "Vendor", value: "vendor desc", directionLabel: "Descending" },
  ];

  // State for managing the selected sort option
  const [sortSelected, setSortSelected] = useState(["product asc"]);

  // Hook for managing the filter mode (basic or advanced)
  const { mode, setMode } = useSetIndexFiltersMode();

  // Function for handling the cancel action in the filter bar
  const onHandleCancel = () => {};

  // Function for handling the save action in the filter bar
  const onHandleSave = async () => {
    await sleep(1); // Simulate a delay
    return true;
  };

  // Determine the primary action based on the selected tab
  const primaryAction =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView, // Create a new tab
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave, // Save the current filter settings
          disabled: false,
          loading: false,
        };

  // State for managing the selected status filter
  const [tone, setStatus] = useState(undefined);

  // State for managing the selected type filter
  const [type, setType] = useState(undefined);

  // State for managing the search query
  const [queryValue, setQueryValue] = useState("");

  // Callback functions for handling filter changes
  const handleStatusChange = useCallback((value) => setStatus(value), []);
  const handleTypeChange = useCallback((value) => setType(value), []);
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    [],
  );

  // Callback functions for removing filters
  const handleStatusRemove = useCallback(() => setStatus(undefined), []);
  const handleTypeRemove = useCallback(() => setType(undefined), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);

  // Function to clear all filters
  const handleFiltersClearAll = useCallback(() => {
    handleStatusRemove();
    handleTypeRemove();
    handleQueryValueRemove();
  }, [handleStatusRemove, handleQueryValueRemove, handleTypeRemove]);

  // Filter definitions for the filter bar
  const filters = [
    {
      key: "tone",
      label: "Status",
      filter: (
        <ChoiceList
          title="tone"
          titleHidden
          choices={[
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ]}
          selected={tone || []}
          onChange={handleStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "type",
      label: "Type",
      filter: (
        <ChoiceList
          title="Type"
          titleHidden
          choices={[
            { label: "Brew Gear", value: "brew-gear" },
            { label: "Brew Merch", value: "brew-merch" },
          ]}
          selected={type || []}
          onChange={handleTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];

  // Build applied filters array for display
  const appliedFilters = [];
  if (tone && !isEmpty(tone)) {
    const key = "tone";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, tone),
      onRemove: handleStatusRemove,
    });
  }
  if (type && !isEmpty(type)) {
    const key = "type";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, type),
      onRemove: handleTypeRemove,
    });
  }

  // Sample product data
  const products = [
    {
      id: "1020",
      price: "$200",
      product: "1ZPRESSO | J-MAX Manual Coffee Grinder",
      status: "Active",
      inventory: "20 in stock",
      category: "Brew Gear",
      type: "Accessories",
      vendor: "Espresso Shot Coffee",
    },
    {
      id: "1018",
      price: "$200",
      product: "Acaia Pearl Set",
      status: "Draft",
      tone: <Badge tone="success">Active</Badge>,
      inventory: "2 in stock for 50 variants",
      category: "Brew Gear",
      type: "Accessories",
      vendor: "Espresso Shot Coffee",
    },
    {
      id: "1016",
      price: "$200",
      product: "AeroPress Go Brewer",
      status: "Archived",
      tone: <Badge tone="info">Draft</Badge>,
      inventory: "3 in stock for 50 variants",
      category: "Brew Gear",
      type: "Accessories",
      vendor: "Espresso Shot Coffee",
    },
    {
      id: "1015",
      price: "$200",
      product: "Canadiano Brewer",
      status: "Active",
      tone: <Badge tone="success">Active</Badge>,
      inventory: "890 in stock for 50 variants",
      category: "Brew Merch",
      type: "Dress",
      vendor: "Espresso Shot Coffee",
    },
    {
      id: "1014",
      price: "200",
      product: "Canadiano Brewer White Ash",
      status: "Active",
      tone: <Badge tone="success">Active</Badge>,
      inventory: "890 in stock for 50 variants",
      category: "Brew Gear",
      type: "Accessories",
      vendor: "Espresso Shot Coffee",
    },
  ];

  // Resource name configuration for the table
  const resourceName = {
    singular: "product",
    plural: "products",
  };

  // Hook for managing resource selection in the table
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);

  // Create table row markup for each product
  const rowMarkup = products.map(
    (
      { id, product, price, tone, status, inventory, category, type, vendor },
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Thumbnail
            source={"https://picsum.photos/50?random=" + String(index)}
            size="small"
            alt={"product thumbnail" + product}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Link
            monochrome
            removeUnderline
            url={`/admin/products/${id}`}
            dataPrimaryLink
          >
            {product}
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
        <IndexTable.Cell>{inventory}</IndexTable.Cell>
        <IndexTable.Cell>{category}</IndexTable.Cell>
        <IndexTable.Cell>{type}</IndexTable.Cell>
        <IndexTable.Cell>{vendor}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  // Render the page with the product list
  return (
    <Page
      fullWidth
      title={"Products"}
      primaryAction={
        <NextLink href="/admin/products/new">
          <Button variant="primary">Add Product</Button>
        </NextLink>
      }
      secondaryActions={[
        {
          content: "Export",
          accessibilityLabel: "Export product list",
          onAction: () => alert("Export action"),
          disabled: true,
        },
        {
          content: "Import",
          accessibilityLabel: "Import product list",
          onAction: () => alert("Import action"),
          disabled: true,
        },
      ]}
    >
      <Box paddingBlockEnd="400">
        <LegacyCard>
          <IndexFilters
            sortOptions={sortOptions}
            sortSelected={sortSelected}
            queryValue={queryValue}
            queryPlaceholder="Searching in all"
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={() => {}}
            onSort={setSortSelected}
            primaryAction={primaryAction}
            cancelAction={{
              onAction: onHandleCancel,
              disabled: false,
              loading: false,
            }}
            tabs={tabs}
            selected={selected}
            onSelect={setSelected}
            canCreateNewView
            onCreateNewView={onCreateNewView}
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={handleFiltersClearAll}
            mode={mode}
            setMode={setMode}
          />
          <IndexTable
            resourceName={resourceName}
            itemCount={products.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            sortable={[false, true, true, true, true, true, true]}
            headings={[
              { title: "" },
              { title: "Product" },
              { title: "Status" },
              { title: "Inventory" },
              { title: "Category" },
              { title: "Type" },
              { title: "Vendor" },
            ]}
            pagination={{
              hasNext: true,
              onNext: () => {},
            }}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      </Box>
    </Page>
  );
}

export default Products;
