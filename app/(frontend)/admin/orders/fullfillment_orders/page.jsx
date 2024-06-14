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
  TextField,
  Icon,
  InlineGrid,
  LegacyCard,
  Page,
  Popover,
  ResourceItem,
  ResourceList,
  TextContainer,
  Banner,
  Checkbox,
  FormLayout,
  SkeletonBodyText,
  SkeletonDisplayText,
  Tag,
  Link,
  Text,
  Thumbnail,
} from '@shopify/polaris';

import {
  EditMajor,
  DuplicateMinor,
  ArchiveMinor,
  PrintMinor,
  CancelMinor,
  MobileHorizontalDotsMajor,
  ShipmentMajor,
  MarkPaidMinor,
} from '@shopify/polaris-icons';
import { useCallback, useState } from 'react';

// This example is for guidance purposes. Copying it will come with caveats.
function Fullfillment() {
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  return (
    <Page
      backAction={{ content: 'Products', url: '/admin/orders' }}
      title='Fulfill item'
      secondaryActions={[
        {
          content: 'Print packing slip',
          onAction: () => alert('print packing slip'),
        },
      ]}
    >
      <InlineGrid columns={{ xs: 1, md: '2fr 1fr' }} gap='400'>
        <Box gap='400'>
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
            <Box
              paddingInline='400'
              paddingBlockStart='200'
              paddingBlockEnd='400'
            >
              <Box
                borderColor='border'
                borderWidth='025'
                borderRadius='200'
                overflowX='hidden'
                overflowY='hidden'
              >
                <Box
                  padding='300'
                  borderColor='border'
                  borderBlockEndWidth='025'
                >
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
                        <div className='flex flex-row flex-wrap gap-3 justify-between'>
                          <div className='basis-1/2'>
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
                          </div>
                          <div className='basis-auto grid'>
                            <span className='sm:justify-self-end'>
                              kg {qty}
                            </span>
                          </div>
                          <div className='basis-32'>
                            <TextField
                              label='Price'
                              labelHidden
                              type='number'
                              value={'5'}
                              onChange={() => {}}
                              suffix='of 1'
                              autoComplete='off'
                              add
                              va
                            />
                          </div>
                        </div>
                      </ResourceItem>
                    );
                  }}
                />
              </Box>
            </Box>

            <Box
              paddingInline='400'
              paddingBlockStart='200'
              paddingBlockEnd='400'
            >
              <BlockStack gap='200'>
                <Text variant='headingSm' as='h6'>
                  Tracking information
                </Text>
                <Banner onDismiss={() => {}}>
                  <p>
                    Add tracking to improve customer satisfaction Orders with
                    tracking let customers receive delivery updates and reduce
                    support requests.
                  </p>
                </Banner>

                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      label='Tracking number'
                      onChange={() => {}}
                      autoComplete='off'
                    />
                    <TextField
                      label='Shipping carrier'
                      onChange={() => {}}
                      autoComplete='off'
                    />
                  </FormLayout.Group>
                </FormLayout>
              </BlockStack>
            </Box>
            <Box
              paddingInline='400'
              paddingBlockStart='200'
              paddingBlockEnd='400'
            >
              <Box
                paddingBlockStart='200'
                borderColor='border'
                borderBlockStartWidth='025'
              >
                <BlockStack gap='200'>
                  <Text variant='headingSm' as='h6'>
                    Notify customer of shipment
                  </Text>
                  <Checkbox
                    label='Send shipment details to your customer now'
                    checked={true}
                    onChange={() => {}}
                  />
                </BlockStack>
              </Box>
            </Box>
          </LegacyCard>
        </Box>

        <BlockStack gap='400'>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <BlockStack gap='200'>
                <InlineGrid columns='1fr auto'>
                  <Text as='h3' variant='headingSm' fontWeight='medium'>
                    Shipping address
                  </Text>
                  <Button
                    variant='plain'
                    onClick={() => {}}
                    accessibilityLabel='Edit'
                  >
                    <Icon source={EditMajor} tone='base' />
                  </Button>
                </InlineGrid>
                <Text as='p' variant='bodyMd'>
                  Tyler Ware <br /> 3508 Pharetra. Av.
                  <br /> 42621 Nantes <br /> Paraguay
                  <br /> +59546811470
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>

          <Card roundedAbove='sm'>
            <BlockStack gap='200'>
              <Text as='h2' variant='headingSm'>
                Summary
              </Text>
              <BlockStack gap='200'>
                <Text as='p' variant='bodyMd' tone='subdued'>
                  Fullfilling from Dekato Shop
                  <br /> {2} of {2} items
                </Text>
              </BlockStack>
              <Divider />
              <Button
                variant='primary'
                onClick={() => {}}
                accessibilityLabel='Fullfill items'
              >
                Fullfill items
              </Button>
            </BlockStack>
          </Card>
        </BlockStack>
      </InlineGrid>
    </Page>
  );
}

export default Fullfillment;
