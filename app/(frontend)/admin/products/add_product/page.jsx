'use client';

import {
  Page,
  LegacyCard,
  InlineGrid,
  BlockStack,
  Card,
  Box,
  Divider,
  Bleed,
  TextField,
  DropZone,
  LegacyStack,
  Thumbnail,
  Text,
  FormLayout,
  Icon,
  Popover,
  ActionList,
  Grid,
  Collapsible,
  Button,
  TextContainer,
  OptionList,
} from '@shopify/polaris';

import {
  QuestionMarkMajor,
  PlusMinor,
  DragHandleMinor,
} from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

function AddProduct() {
  const [files, setFiles] = useState([]);

  const [value, setValue] = useState('1');

  const handleChange = useCallback((newValue) => setValue(newValue), []);

  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    []
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !files.length && (
    <DropZone.FileUpload actionHint='Accepts images, videos' />
  );

  const uploadedFiles = files.length > 0 && (
    <LegacyStack vertical>
      {files.map((file, index) => (
        <LegacyStack alignment='center' key={index}>
          <Thumbnail
            size='small'
            alt={file.name}
            source={
              validImageTypes.includes(file.type)
                ? window.URL.createObjectURL(file)
                : NoteMinor
            }
          />
          <div>
            {file.name}{' '}
            <Text variant='bodySm' as='p'>
              {file.size} bytes
            </Text>
          </div>
        </LegacyStack>
      ))}
    </LegacyStack>
  );
  const [selected, setSelected] = useState([]);

  const [popoverActive, setPopoverActive] = useState(false);

  const handlePopoverEnter = useCallback(() => {
    setPopoverActive(true);
  }, []);

  const handlePopoverLeave = useCallback(() => {
    setPopoverActive(false);
  }, []);

  const activator = (
    <div onMouseEnter={handlePopoverEnter} onMouseLeave={handlePopoverLeave}>
      <Icon source={QuestionMarkMajor} tone='base' />
    </div>
  );
  const variantOptionsName = (
    <TextField
      label='Option name'
      labelHidden
      value={value}
      onChange={handleChange}
      autoComplete='off'
      onClick={handlePopoverEnter}
    />
  );

  return (
    <Page backAction={{ content: 'Settings', url: '#' }} title='General'>
      <InlineGrid columns={{ xs: 1, md: '2fr 1fr' }} gap='400'>
        <BlockStack gap='400'>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <TextField
                label='Title'
                value='Short sleeve t-shirt'
                onChange={() => {}}
                autoComplete='off'
              />
              <TextField
                label='Description'
                value={''}
                onChange={() => {}}
                multiline={4}
                autoComplete='off'
              />
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Text as='h2' variant='headingSm'>
                Media
              </Text>
              <DropZone onDrop={handleDropZoneDrop} variableHeight>
                {uploadedFiles}
                {fileUpload}
              </DropZone>
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Text as='h2' variant='headingSm'>
                Pricing
              </Text>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <TextField
                    label='Price'
                    onChange={() => {}}
                    autoComplete='off'
                    prefix='₦'
                    placeholder='0.00'
                  />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <TextField
                    label='Compare-at price'
                    onChange={() => {}}
                    autoComplete='off'
                    prefix='₦'
                    placeholder='0.00'
                    suffix={
                      <Popover
                        active={popoverActive}
                        activator={activator}
                        onClose={handlePopoverLeave}
                      >
                        <div className='max-w-64'>
                          <Card>
                            To display a markdown, enter a value higher than
                            your price. Often shown with a strikethrough.
                          </Card>
                        </div>
                      </Popover>
                    }
                  />
                </Grid.Cell>
              </Grid>
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Text as='h2' variant='headingSm'>
                Inventory
              </Text>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <TextField
                    label='Quantity'
                    type='number'
                    value={value}
                    onChange={handleChange}
                    autoComplete='off'
                  />
                </Grid.Cell>
              </Grid>
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Text as='h2' variant='headingSm'>
                Variants
              </Text>
              <Collapsible
                open={open}
                id='basic-collapsible'
                transition={{
                  duration: '500ms',
                  timingFunction: 'ease-in-out',
                }}
                expandOnPrint
              >
                <Box borderColor='border' borderWidth='025' borderRadius='200'>
                  <div className='grid grid-cols-variant gap-x-3 gap-y-1 p-3'>
                    <div className='col-start-2'>
                      <Text as='p' variant='bodyMd'>
                        Option name
                      </Text>
                    </div>
                    <button className='col-start-1 cursor-grab'>
                      <Icon source={DragHandleMinor} tone='base' />
                    </button>
                    <div className='col-start-2'>
                      <Popover
                        active={popoverActive}
                        activator={variantOptionsName}
                        onClose={handlePopoverLeave}
                      >
                        <OptionList
                          title='Inventory Location'
                          onChange={setSelected}
                          options={[
                            {
                              value: 'byward_market',
                              label: 'Byward Market',
                              active: true,
                            },
                            { value: 'centretown', label: 'Centretown' },
                            {
                              value: 'hintonburg',
                              label: 'Hintonburg',
                              active: true,
                            },
                            { value: 'westboro', label: 'Westboro' },
                            { value: 'downtown', label: 'Downtown' },
                          ]}
                          selected={selected}
                        />
                      </Popover>
                    </div>
                    <button className='col-start-3'>
                      <Icon source={DragHandleMinor} tone='base' />
                    </button>
                  </div>
                </Box>
              </Collapsible>
              <Button
                variant='plain'
                textAlign='left'
                onClick={handleToggle}
                ariaExpanded={open}
                ariaControls='basic-collapsible'
                icon={PlusMinor}
              >
                Add options like size or colors
              </Button>
            </BlockStack>
          </Card>
        </BlockStack>
        <BlockStack gap={{ xs: '400', md: '200' }}>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Box border='divider' borderRadius='base' minHeight='2rem' />
              <Box>
                <Bleed marginInline={{ xs: 400, sm: 500 }}>
                  <Divider />
                </Bleed>
              </Box>
              <Divider />
            </BlockStack>
          </Card>
          <Card roundedAbove='sm'>
            <BlockStack gap='400'>
              <Box border='divider' borderRadius='base' minHeight='2rem' />
              <Box border='divider' borderRadius='base' minHeight='2rem' />
            </BlockStack>
          </Card>
        </BlockStack>
      </InlineGrid>
    </Page>
  );
}

export default AddProduct;
