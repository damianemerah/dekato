"use client";

import {
  Page,
  InlineGrid,
  BlockStack,
  Card,
  Box,
  Text,
  TextField,
  Grid,
} from "@shopify/polaris";
import React from "react";

function NewCustomer() {
  return (
    <Page
      narrowWidth
      backAction={{ content: "Customers", url: "/admin/customers" }}
      title="New customer"
    >
      {/* <InlineGrid columns={{ xs: 1, md: '2fr 1fr' }} gap='400'> */}
      <BlockStack gap="400">
        <Card roundedAbove="sm">
          <BlockStack gap="400">
            <Text as="h2" variant="headingSm">
              Customer overview
            </Text>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <TextField label="First name" value={""} onChange={""} />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <TextField label="Last name" value={""} onChange={""} />
              </Grid.Cell>
            </Grid>
            <TextField label="Email" value={""} onChange={""} />
            <TextField label="Phone number" value={""} onChange={""} />
          </BlockStack>
        </Card>
        <Card roundedAbove="sm">
          <BlockStack gap="400">
            <Box>
              <Text as="h2" variant="headingSm">
                Default Address
              </Text>
              <Text variant="headingXs" as="h6" tone="subdued">
                The primary address of this customer
              </Text>
            </Box>
            <TextField label="Country" value={""} onChange={""} />
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <TextField label="First name" value={""} onChange={""} />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <TextField label="Last name" value={""} onChange={""} />
              </Grid.Cell>
            </Grid>
            <TextField label="Company" value={""} onChange={""} />
            <TextField label="Address" value={""} onChange={""} />
            <TextField label="Apartment/Suite" value={""} onChange={""} />
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <TextField label="City" value={""} onChange={""} />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <TextField label="State" value={""} onChange={""} />
              </Grid.Cell>
            </Grid>
            <TextField label="Postal code" value={""} onChange={""} />
            <TextField label="Phone" value={""} onChange={""} />
          </BlockStack>
        </Card>
      </BlockStack>
      {/* <BlockStack gap={{ xs: '400', md: '200' }}>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'></BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'></BlockStack>
          </Card>
        </BlockStack> */}
      {/* </InlineGrid> */}
    </Page>
  );
}

export default NewCustomer;
