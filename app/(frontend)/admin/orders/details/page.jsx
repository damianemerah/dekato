"use client";
import {
  ActionList,
  Avatar,
  Badge,
  Bleed,
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Icon,
  InlineGrid,
  LegacyCard,
  Page,
  Popover,
  ResourceItem,
  ResourceList,
  SkeletonBodyText,
  SkeletonDisplayText,
  Tag,
  Text,
  Thumbnail,
} from "@shopify/polaris";

import {
  EditIcon,
  DuplicateIcon,
  ArchiveIcon,
  PrintIcon,
  XIcon,
  MenuHorizontalIcon,
  DeliveryIcon,
  ReceiptPaidIcon,
} from "@shopify/polaris-icons";
import { useCallback, useState } from "react";

// This example is for guidance purposes. Copying it will come with caveats.
function OrderDetails() {
  const SkeletonLabel = (props) => {
    return (
      <Box
        background="bg-fill-tertiary"
        minHeight="1rem"
        maxWidth="5rem"
        borderRadius="base"
        {...props}
      />
    );
  };

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  return (
    <Page
      backAction={{ content: "Products", url: "/admin/orders" }}
      title="#1033"
      titleMetadata={
        <>
          <Badge progress="complete">Paid</Badge>
          <Badge progress="complete">Fullfilled</Badge>
        </>
      }
      subtitle="January 18, 2024 at 12:54 pm"
      compactTitle
      secondaryActions={[
        {
          content: "Restock",
          accessibilityLabel: "Restock Orders",
          onAction: () => alert("Order restocked"),
        },
        {
          content: "Edit",
          onAction: () => alert("Edit order"),
        },
      ]}
      actionGroups={[
        {
          title: "More actions",
          actions: [
            {
              content: "Duplicate",
              accessibilityLabel: "Duplicate order",
              icon: DuplicateIcon,
              onAction: () => alert("order duplicated"),
            },
            {
              content: "Cancel order",
              accessibilityLabel: "Cancel order",
              icon: XIcon,
              onAction: () => alert("order canceled"),
            },
            {
              content: "Archive",
              accessibilityLabel: "Archive order",
              icon: ArchiveIcon,
              onAction: () => alert("order archived"),
            },
            {
              content: "Print order slip",
              accessibilityLabel: "Print order slip",
              icon: PrintIcon,
              onAction: () => alert("printed"),
            },
          ],
        },
      ]}
      pagination={{
        hasPrevious: true,
        hasNext: true,
      }}
    >
      <InlineGrid columns={{ xs: 1, lg: "2fr 1fr" }} gap="400">
        <Box gap="400">
          <LegacyCard primaryFooterAction={{ content: "Fulfill items" }}>
            <LegacyCard.Header
              title={
                <Text as="h2" variant="headingSm">
                  <Badge tone="success" size="large" icon={DeliveryIcon}>
                    Fulfilled
                  </Badge>
                </Text>
              }
            >
              <Popover
                active={active}
                activator={
                  <Button
                    accessibilityLabel="Add variant"
                    variant="plain"
                    onClick={toggleActive}
                  >
                    <Icon source={MenuHorizontalIcon} tone="base" />
                  </Button>
                }
                onClose={toggleActive}
              >
                <ActionList
                  actionRole="menuitem"
                  items={[
                    { content: "Print packing slip" },
                    {
                      content: "Cancel fulfillment",
                      onAction: () => {},
                      destructive: true,
                    },
                  ]}
                />
              </Popover>
            </LegacyCard.Header>
            <Box
              paddingInline="400"
              paddingBlockStart="200"
              paddingBlockEnd="400"
            >
              <Box
                borderColor="border"
                borderWidth="025"
                borderRadius="200"
                overflowX="hidden"
                overflowY="hidden"
              >
                <Box
                  padding="300"
                  borderColor="border"
                  borderBlockEndWidth="025"
                >
                  Add variants if this product comes in multiple versions, like
                  different sizes or colors.
                </Box>
                <ResourceList
                  resourceName={{ singular: "order", plural: "orders" }}
                  items={[
                    {
                      id: "145",
                      url: "#",
                      avatarSource:
                        "https://burst.shopifycdn.com/photos/black-orange-stripes_373x@2x.jpg",
                      name: "VANS | CLASSIC SLIP-ON (PERFORATED SUEDE)",
                      sku: "9504957",
                      qty: 1,
                      price: "200",
                      size: 9,
                      color: "black",
                    },
                    {
                      id: "145",
                      url: "#",
                      avatarSource:
                        "https://burst.shopifycdn.com/photos/tucan-scarf_373x@2x.jpg",
                      name: "Tucan scarf",
                      sku: "0404957",
                      qty: 1,
                      price: "500",
                      size: 9,
                      color: "white",
                    },
                  ]}
                  renderItem={(item) => {
                    const {
                      id,
                      url,
                      name,
                      sku,
                      qty,
                      price,
                      avatarSource,
                      size,
                      color,
                    } = item;

                    return (
                      <ResourceItem
                        id={id}
                        url={url}
                        media={
                          <Avatar
                            customer
                            size="lg"
                            name={name}
                            source={avatarSource}
                          />
                        }
                        accessibilityLabel={`View details for ${name}`}
                      >
                        <div className="order_details-grid">
                          <div className="col-2">
                            <BlockStack gap="100">
                              <Text
                                variant="bodyMd"
                                fontWeight="medium"
                                as="h3"
                                breakWord={true}
                              >
                                {name}
                              </Text>
                              <Text>
                                <Tag>
                                  {size} / {color}
                                </Tag>
                              </Text>

                              <Text tone="subdued" variant="bodySm">
                                SKU: {sku}
                              </Text>
                            </BlockStack>
                          </div>
                          <div className="col-3">
                            <Text>
                              ${price} x {qty}
                            </Text>
                          </div>
                          <div className="col-4">
                            <Text>${price}</Text>
                          </div>
                        </div>
                      </ResourceItem>
                    );
                  }}
                />
              </Box>
            </Box>
          </LegacyCard>
          <LegacyCard
            title={
              <Text as="h2" variant="headingSm">
                <Badge size="large" icon={ReceiptPaidIcon}>
                  Paid
                </Badge>
              </Text>
            }
          >
            <Box paddingBlockStart="200" paddingBlockEnd="400">
              <Box paddingInline="400">
                <Box
                  borderColor="border"
                  borderWidth="025"
                  borderRadius="200"
                  overflowX="hidden"
                  overflowY="hidden"
                >
                  <Box padding="300">
                    <div
                      style={{
                        marginBottom: "var(--p-space-300)",
                        paddingBottom: "var(--p-space-300)",
                        borderBottom:
                          "var(--p-border-width-025) solid var(--p-color-border)",
                      }}
                    >
                      <BlockStack gap="200">
                        <p className="order_overview">
                          <span>Subtotal</span>
                          <span className="order_overview_sub">
                            <Text as="p" tone="subdued">
                              2 Items
                            </Text>
                            $40
                          </span>
                        </p>
                        <Text as="h3" variant="headingSm" fontWeight="medium">
                          <div className="order_overview">
                            <span>Total</span>
                            <span className="order_overview_sub">
                              <span></span>
                              <span>$40</span>
                            </span>
                          </div>
                        </Text>
                      </BlockStack>
                    </div>
                    <div>
                      <p className="order_overview">
                        <span>Paid by customer</span>
                        <span className="order_overview_sub">
                          <span></span>
                          $40
                        </span>
                      </p>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Box>
          </LegacyCard>
        </Box>

        <BlockStack gap="400">
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <InlineGrid columns="1fr auto">
                <Text as="h3" variant="headingSm" fontWeight="medium">
                  Note from customer
                </Text>
                <Button
                  variant="plain"
                  onClick={() => {}}
                  accessibilityLabel="Edit"
                >
                  <Icon source={EditIcon} tone="base" />
                </Button>
              </InlineGrid>
              <Text as="p" variant="bodyMd" tone="subdued">
                No notes from customer
              </Text>
            </BlockStack>
          </Card>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm">
                  Customer
                </Text>
                <Text as="p" variant="bodyMd">
                  John Smith
                </Text>
                <Text as="p" variant="bodyMd">
                  4 orders
                </Text>
              </BlockStack>
              <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                  <Text as="h3" variant="headingSm" fontWeight="medium">
                    Contact Information
                  </Text>
                  <Button
                    variant="plain"
                    onClick={() => {}}
                    accessibilityLabel="Edit"
                  >
                    <Icon source={EditIcon} tone="base" />
                  </Button>
                </InlineGrid>
                <Text as="p" variant="bodyMd">
                  john.smith@example.com
                </Text>
                <Text as="p" variant="bodyMd">
                  +234957304755
                </Text>
              </BlockStack>
              <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                  <Text as="h3" variant="headingSm" fontWeight="medium">
                    Shipping address
                  </Text>
                  <Button
                    variant="plain"
                    onClick={() => {}}
                    accessibilityLabel="Edit"
                  >
                    <Icon source={EditIcon} tone="base" />
                  </Button>
                </InlineGrid>
                <Text as="p" variant="bodyMd">
                  Tyler Ware <br /> 3508 Pharetra. Av.
                  <br /> 42621 Nantes <br /> Paraguay
                  <br /> +59546811470
                </Text>
              </BlockStack>
              <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                  <Text as="h3" variant="headingSm" fontWeight="medium">
                    Billing address
                  </Text>
                  <Button
                    variant="plain"
                    onClick={() => {}}
                    accessibilityLabel="Edit"
                  >
                    <Icon source={EditIcon} tone="base" />
                  </Button>
                </InlineGrid>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Same as shipping address
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </BlockStack>
      </InlineGrid>
    </Page>
  );
}

export default OrderDetails;
