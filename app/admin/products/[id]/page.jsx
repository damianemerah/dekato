"use client";
import { useState, useCallback, useMemo } from "react";
import {
  Page,
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
  Icon,
  Grid,
  Collapsible,
  Button,
  Autocomplete,
  PageActions,
  Select,
  Tooltip,
} from "@shopify/polaris";

import {
  QuestionCircleIcon,
  PlusIcon,
  DragHandleIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import { VariantsTableComponent } from "@/app/admin/components";
import ProductOrganization from "@/app/admin/ui/products/New";

function Product() {
  //State
  const [files, setFiles] = useState([]);
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [compareAtPriceValue, setCompareAtPriceValue] = useState("");
  const [quantityValue, setQuantityValue] = useState("1");
  const [options, setOptions] = useState([]);

  const [open, setOpen] = useState(false);

  const [defaultPlaceholders, setDefaultPlaceholders] = useState({
    Color: "Black",
    Size: "Medium",
    Material: "Leather",
    Style: "Classic",
  });

  //Event Handlers
  const handleTitleChange = useCallback(
    (newValue) => setTitleValue(newValue),
    [],
  );
  const handleDescriptionChange = useCallback(
    (newValue) => setDescriptionValue(newValue),
    [],
  );
  const handlePriceChange = useCallback(
    (newValue) => setPriceValue(newValue),
    [],
  );
  const handleCompareAtPriceChange = useCallback(
    (newValue) => setCompareAtPriceValue(newValue),
    [],
  );
  const handleQuantityChange = useCallback(
    (newValue) => setQuantityValue(newValue),
    [],
  );

  const handleAddOption = () => {
    setOptions([...options, { name: "", values: [""] }]);
  };

  const handleOptionNameChange = (index) => (newValue) => {
    const newOptions = [...options];
    newOptions[index].name = newValue;
    setOptions(newOptions);

    // Set the default placeholder based on the selected option name
    const newDefaultPlaceholder = { ...defaultPlaceholders };
    newDefaultPlaceholder[newValue] = defaultPlaceholders[newValue] || "";
    setDefaultPlaceholders(newDefaultPlaceholder);
  };

  const handleOptionValueChange = (optionIndex, valueIndex) => (newValue) => {
    const newOptions = [...options];
    newOptions[optionIndex].values[valueIndex] = newValue;
    setOptions(newOptions);

    // Check if the current option value being edited is the last one
    if (
      valueIndex === options[optionIndex].values.length - 1 &&
      newValue !== ""
    ) {
      // Add a new empty option value field
      newOptions[optionIndex].values.push("");
      setOptions(newOptions);
    }
  };

  const handleToggle = () => {
    // If there are no options yet, add a new empty option field
    if (options.length === 0) {
      setOptions([...options, { name: "", values: [""] }]);
      setOpen(true); // Collapse immediately after adding the new option
    } else {
      setOpen((open) => !open);
    }

    console.log(options);
  };

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    [],
  );

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const fileUpload = !files.length && (
    <DropZone.FileUpload
      actionTitle="Add file"
      actionHint="Accepts images, videos"
    />
  );

  const uploadedFiles = files.length > 0 && (
    <LegacyStack vertical>
      {files.map((file, index) => (
        <LegacyStack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={
              validImageTypes.includes(file.type)
                ? window.URL.createObjectURL(file)
                : NoteMinor
            }
          />
          <div>
            {file.name}{" "}
            <Text variant="bodySm" as="p">
              {file.size} bytes
            </Text>
          </div>
        </LegacyStack>
      ))}
    </LegacyStack>
  );

  const optionsList = useMemo(
    () => [
      { value: "Size", label: "Size" },
      {
        value: "Color",
        label: "Color",
      },
      {
        value: "Material",
        label: "Material",
      },
      { value: "Style", label: "Style" },
    ],
    [],
  );

  const handleDeleteOption = (optionIndex) => () => {
    const newOptions = [...options];
    newOptions.splice(optionIndex, 1);
    setOptions(newOptions);
    console.log(newOptions);
    console.log(options);
  };

  const [selected, setSelected] = useState("active");

  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Draft", value: "draft" },
  ];

  return (
    <Page
      backAction={{ content: "Products", url: "/admin/products" }}
      title="#17394"
    >
      <InlineGrid columns={{ xs: 1, lg: "2fr 1fr" }} gap="400">
        <BlockStack gap="400">
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <TextField
                label="Title"
                placeholder="Short sleeve t-shirt"
                value={titleValue}
                onChange={handleTitleChange}
                autoComplete="off"
              />
              <TextField
                label="Description"
                value={descriptionValue}
                onChange={handleDescriptionChange}
                multiline={4}
                autoComplete="off"
              />
            </BlockStack>
          </Card>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Text as="h2" variant="headingSm">
                Media
              </Text>
              <DropZone onDrop={handleDropZoneDrop} variableHeight>
                {uploadedFiles}
                {fileUpload}
              </DropZone>
            </BlockStack>
          </Card>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Text as="h2" variant="headingSm">
                Pricing
              </Text>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <TextField
                    label="Price"
                    value={priceValue}
                    onChange={handlePriceChange}
                    autoComplete="off"
                    prefix="₦"
                    placeholder="0.00"
                  />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <TextField
                    label="Compare-at price"
                    value={compareAtPriceValue}
                    onChange={handleCompareAtPriceChange}
                    autoComplete="off"
                    prefix="₦"
                    placeholder="0.00"
                    suffix={
                      <Tooltip
                        content="To display a markdown, enter a value higher than
                            your price. Shown with a strikethrough."
                        dismissOnMouseOut
                      >
                        <Icon source={QuestionCircleIcon} tone="base" />
                      </Tooltip>
                    }
                  />
                </Grid.Cell>
              </Grid>
            </BlockStack>
          </Card>

          {/* Inventory */}
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Text as="h2" variant="headingSm">
                Inventory
              </Text>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={quantityValue}
                    onChange={handleQuantityChange}
                    autoComplete="off"
                    min={0}
                  />
                </Grid.Cell>
              </Grid>
            </BlockStack>
          </Card>

          {/* Variants */}
          <Card roundedAbove="sm" padding={0}>
            <Box padding={400}>
              <BlockStack gap="400">
                <Text as="h2" variant="headingSm">
                  Variants
                </Text>
                {options.length > 0 && (
                  <Collapsible
                    open={open}
                    id="basic-collapsible"
                    transition={{
                      duration: "500ms",
                      timingFunction: "ease-in-out",
                    }}
                  >
                    <Box
                      borderColor="border"
                      borderWidth="025"
                      borderRadius="200"
                    >
                      <ul>
                        {options.map((option, optionIndex) => (
                          <li key={optionIndex}>
                            {optionIndex !== 0 && (
                              <Box
                                borderColor="border"
                                borderBlockStartWidth="025"
                              ></Box>
                            )}
                            <div className="grid grid-cols-variant gap-x-3 gap-y-1 p-4">
                              <div className="col-start-2">
                                <Text as="p" variant="bodyMd">
                                  Option name
                                </Text>
                              </div>
                              <button className="col-start-1 cursor-grab">
                                <Icon source={DragHandleIcon} tone="base" />
                              </button>
                              <div className="col-start-2">
                                <Autocomplete
                                  options={optionsList}
                                  selected={option.name}
                                  onSelect={handleOptionNameChange(optionIndex)}
                                  textField={
                                    <Autocomplete.TextField
                                      onChange={handleOptionNameChange(
                                        optionIndex,
                                      )}
                                      label="Option name"
                                      labelHidden
                                      ariaExpanded={true}
                                      value={`${option.name}`}
                                      placeholder="Size"
                                      autoComplete="off"
                                    />
                                  }
                                />
                              </div>
                              <button
                                className="col-start-3"
                                onClick={handleDeleteOption(optionIndex)}
                              >
                                <Icon source={DeleteIcon} tone="base" />
                              </button>
                            </div>
                            <div className="mb-4">
                              <div className="flex flex-col gap-y-1">
                                <div className="grid grid-cols-variant gap-x-3 px-5">
                                  <div className="col-start-2">
                                    <Text as="p" variant="bodyMd">
                                      Option value
                                    </Text>
                                  </div>
                                </div>

                                {option.values.map((value, valueIndex) => (
                                  <div
                                    className="grid grid-cols-variant gap-x-3 gap-y-1 px-5"
                                    key={valueIndex}
                                  >
                                    <button className="col-start-1 hidden cursor-grab justify-self-end">
                                      <Icon
                                        source={DragHandleIcon}
                                        tone="base"
                                      />
                                    </button>
                                    <div className="col-start-2">
                                      <TextField
                                        label="Option value"
                                        placeholder={
                                          valueIndex > 0
                                            ? "Add another value"
                                            : defaultPlaceholders[option.name]
                                        }
                                        labelHidden
                                        value={value}
                                        onChange={handleOptionValueChange(
                                          optionIndex,
                                          valueIndex,
                                        )}
                                        autoComplete="off"
                                      />
                                    </div>
                                    <button className="col-start-3 hidden justify-self-start">
                                      <Icon source={DeleteIcon} tone="base" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 grid grid-cols-variant gap-x-3 px-5">
                                <div className="col-start-2">
                                  <Button>Done</Button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <Divider />
                      <div className="p-4">
                        <Button
                          variant="plain"
                          size="slim"
                          textAlign="left"
                          onClick={handleAddOption}
                          icon={PlusIcon}
                        >
                          Add another option
                        </Button>
                      </div>
                    </Box>
                  </Collapsible>
                )}
                {options.length === 0 && (
                  <Button
                    variant="plain"
                    textAlign="left"
                    onClick={handleToggle}
                    ariaExpanded={open}
                    ariaControls="basic-collapsible"
                    icon={PlusIcon}
                  >
                    Add options like size or colors
                  </Button>
                )}
              </BlockStack>
            </Box>

            <Bleed marginInline={{}}>
              <VariantsTableComponent />
            </Bleed>
          </Card>
        </BlockStack>
        <BlockStack gap={{ xs: "400", md: "200" }}>
          <Card roundedAbove="sm">
            <Text as="h2" variant="headingSm">
              Status
            </Text>
            <Box paddingBlock="200">
              <Select
                label="product status"
                labelHidden
                options={statusOptions}
                onChange={handleSelectChange}
                value={selected}
              />
            </Box>
          </Card>
          <ProductOrganization />
        </BlockStack>
      </InlineGrid>

      <PageActions primaryAction={{ content: "Save" }} />
    </Page>
  );
}

export default Product;
