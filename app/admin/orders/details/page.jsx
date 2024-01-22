'use client';
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
} from '@shopify/polaris';

import {
  DuplicateMinor,
  ArchiveMinor,
  PrintMinor,
  CancelMinor,
  MobileHorizontalDotsMajor,
  ShipmentMajor,
} from '@shopify/polaris-icons';
import { useCallback, useState } from 'react';

// This example is for guidance purposes. Copying it will come with caveats.
function OrderDetails() {
  const SkeletonLabel = (props) => {
    return (
      <Box
        background='bg-fill-tertiary'
        minHeight='1rem'
        maxWidth='5rem'
        borderRadius='base'
        {...props}
      />
    );
  };

  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  return (
    <Page
      backAction={{ content: 'Products', url: '/admin/orders' }}
      title='#1033'
      titleMetadata={
        <>
          <Badge progress='complete'>Paid</Badge>{' '}
          <Badge progress='complete'>Fullfilled</Badge>
        </>
      }
      subtitle='January 18, 2024 at 12:54 pm'
      compactTitle
      secondaryActions={[
        {
          content: 'Restock',
          accessibilityLabel: 'Restock Orders',
          onAction: () => alert('Order restocked'),
        },
        {
          content: 'Edit',
          onAction: () => alert('Edit order'),
        },
      ]}
      actionGroups={[
        {
          title: 'More actions',
          actions: [
            {
              content: 'Duplicate',
              accessibilityLabel: 'Duplicate order',
              icon: DuplicateMinor,
              onAction: () => alert('order duplicated'),
            },
            {
              content: 'Cancel order',
              accessibilityLabel: 'Cancel order',
              icon: CancelMinor,
              onAction: () => alert('order canceled'),
            },
            {
              content: 'Archive',
              accessibilityLabel: 'Archive order',
              icon: ArchiveMinor,
              onAction: () => alert('order archived'),
            },
            {
              content: 'Print order slip',
              accessibilityLabel: 'Print order slip',
              icon: PrintMinor,
              onAction: () => alert('printed'),
            },
          ],
        },
      ]}
      pagination={{
        hasPrevious: true,
        hasNext: true,
      }}
    >
      <InlineGrid columns={{ xs: 1, md: '2fr 1fr' }} gap='400'>
        <LegacyCard>
          <LegacyCard.Header
            title={
              <Text as='h2' variant='headingSm'>
                <Badge tone='success' size='large' icon={ShipmentMajor}>
                  Fulfilled
                </Badge>
              </Text>
            }
          >
            <Popover
              active={active}
              activator={
                <Button
                  accessibilityLabel='Add variant'
                  variant='plain'
                  onClick={toggleActive}
                >
                  <Icon source={MobileHorizontalDotsMajor} tone='base' />
                </Button>
              }
              onClose={toggleActive}
            >
              <ActionList
                actionRole='menuitem'
                items={[
                  { content: 'Print packing slip' },
                  {
                    content: 'Cancel fulfillment',
                    onAction: () => {},
                    destructive: true,
                  },
                ]}
              />
            </Popover>
          </LegacyCard.Header>
          <Box paddingInline='400' paddingBlock='200'>
            <Box
              borderColor='border'
              borderWidth='025'
              borderRadius='200'
              overflowX='hidden'
              overflowY='hidden'
            >
              <Box padding='300' borderColor='border' borderBlockEndWidth='025'>
                Add variants if this product comes in multiple versions, like
                different sizes or colors.
              </Box>
              <ResourceList
                resourceName={{ singular: 'order', plural: 'orders' }}
                items={[
                  {
                    id: '145',
                    url: '#',
                    avatarSource:
                      'https://burst.shopifycdn.com/photos/black-orange-stripes_373x@2x.jpg',
                    name: 'VANS | CLASSIC SLIP-ON (PERFORATED SUEDE)',
                    sku: '9504957',
                    qty: 1,
                    price: '200',
                    size: 9,
                    color: 'black',
                  },
                  {
                    id: '145',
                    url: '#',
                    avatarSource:
                      'https://burst.shopifycdn.com/photos/tucan-scarf_373x@2x.jpg',
                    name: 'Tucan scarf',
                    sku: '0404957',
                    qty: 1,
                    price: '500',
                    size: 9,
                    color: 'white',
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
                          size='lg'
                          name={name}
                          source={avatarSource}
                        />
                      }
                      accessibilityLabel={`View details for ${name}`}
                    >
                      <Grid
                        columns={{ xs: 6, sm: 6 }}
                        areas={{
                          xs: [
                            'product product product product product orders',
                            'sales . . . . .',
                          ],
                          sm: ['product product product product sales orders'],
                        }}
                      >
                        <Grid.Cell area='product'>
                          <BlockStack gap='100'>
                            <Text
                              variant='bodyMd'
                              fontWeight='medium'
                              as='h3'
                              breakWord={true}
                            >
                              {name}
                            </Text>
                            <Text>
                              <Tag>
                                {size} / {color}
                              </Tag>
                            </Text>

                            <Text tone='subdued' variant='bodySm'>
                              SKU: {sku}
                            </Text>
                          </BlockStack>
                        </Grid.Cell>
                        <Grid.Cell area='sales'>
                          <Text>
                            ${price} x {qty}
                          </Text>
                        </Grid.Cell>
                        <Grid.Cell area='orders'>
                          <Text>${price}</Text>
                        </Grid.Cell>
                      </Grid>
                    </ResourceItem>
                  );
                }}
              />
            </Box>
          </Box>
        </LegacyCard>

        <BlockStack gap='400'>
          <Card roundedAbove='sm'>
            <Text as='h2' variant='headingSm'>
              <Badge>Fulfilled</Badge>
            </Text>

            <BlockStack gap='400'>
              <Card>
                <ResourceList
                  resourceName={{ singular: 'order', plural: 'orders' }}
                  items={[
                    {
                      id: '145',
                      url: '#',
                      avatarSource:
                        'https://burst.shopifycdn.com/photos/black-orange-stripes_373x@2x.jpg',
                      name: 'VANS | CLASSIC SLIP-ON (PERFORATED SUEDE)',
                      sku: '9504957',
                    },
                    {
                      id: '145',
                      url: '#',
                      avatarSource:
                        'https://burst.shopifycdn.com/photos/tucan-scarf_373x@2x.jpg',
                      name: 'Tucan scarf',
                      sku: '0404957',
                    },
                  ]}
                  renderItem={(item) => {
                    const { id, url, avatarSource, name, sku } = item;

                    return (
                      <ResourceItem
                        id={id}
                        url={url}
                        media={
                          <Thumbnail
                            customer
                            size='small'
                            name={name}
                            source={avatarSource}
                          />
                        }
                        accessibilityLabel={`View details for ${name}`}
                        name={name}
                      >
                        <Text
                          variant='bodyMd'
                          fontWeight='medium'
                          as='h3'
                          breakWord={true}
                        >
                          {name}
                        </Text>
                        <Text tone='subdued' variant='bodySm'>
                          SKU: {sku}
                        </Text>
                      </ResourceItem>
                    );
                  }}
                />
              </Card>
              <Box border='divider' borderRadius='base' minHeight='2rem' />
              <SkeletonLabel maxWidth='8rem' />
              <Box border='divider' borderRadius='base' minHeight='20rem' />
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <SkeletonDisplayText size='small' />
              <InlineGrid columns={{ xs: 1, md: 2 }}>
                <Box border='divider' borderRadius='base' minHeight='10rem' />
                <Box border='divider' borderRadius='base' minHeight='10rem' />
              </InlineGrid>
            </BlockStack>
          </Card>
        </BlockStack>
      </InlineGrid>
    </Page>
  );
}

export default OrderDetails;
