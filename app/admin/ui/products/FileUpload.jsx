"use client";
import React, { useState, useCallback } from "react";
import {
  DropZone,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Checkbox,
  Icon,
} from "@shopify/polaris";
import { NoteIcon, PlusIcon } from "@shopify/polaris-icons";
import Image from "next/image";

export function FileUpload() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openFileDialog, setOpenFileDialog] = useState(false);

  const toggleOpenFileDialog = useCallback(() => {
    setOpenFileDialog((prev) => !prev);
  }, []);

  const handleDropZoneDrop = useCallback((_, acceptedFiles, __) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);

  const handleCheckboxChange = useCallback((file) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.includes(file)
        ? prevSelectedFiles.filter((f) => f !== file)
        : [...prevSelectedFiles, file],
    );
  }, []);

  const handleRemove = useCallback(() => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => !selectedFiles.includes(file)),
    );
    setSelectedFiles([]);
  }, [selectedFiles]);

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const fileUpload = !files.length && (
    <DropZone.FileUpload
      actionTitle="Add file"
      actionHint="Accepts images, videos"
    />
  );

  const uploadedFiles = files.length > 0 && (
    <div className="grid grid-cols-6 gap-4">
      {files.map((file, index) => (
        <div
          key={index}
          className={`relative ${index === 0 ? "col-span-2 row-span-2" : ""} group`}
        >
          <div
            className={`absolute left-1 top-1 z-20 transition-opacity duration-300 ${
              selectedFiles.includes(file) ? "opacity-100" : "opacity-0"
            } group-hover:opacity-100`}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={selectedFiles.includes(file)}
              onChange={() => handleCheckboxChange(file)}
            />
          </div>
          <div className="absolute inset-0 z-10 rounded-md bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
          <span className="Polaris-Thumbnail">
            <Image
              fill
              src={
                validImageTypes.includes(file.type)
                  ? window.URL.createObjectURL(file)
                  : NoteIcon
              }
              alt={file.name}
            />
          </span>
        </div>
      ))}

      {files.length > 0 && (
        <div
          className="dropzone-placeholder flex cursor-pointer items-center justify-center"
          onClick={toggleOpenFileDialog}
        >
          <Icon source={PlusIcon} tone="base" />
        </div>
      )}
    </div>
  );

  return (
    <BlockStack gap="400">
      <InlineStack align="space-between">
        <Text as="h2" variant="headingSm">
          Media
        </Text>
        {selectedFiles.length > 0 && (
          <Button variant="plain" tone="critical" onClick={handleRemove}>
            Remove
          </Button>
        )}
      </InlineStack>

      <div>{uploadedFiles}</div>
      <div className={`${files.length > 0 && "hidden"}`}>
        <DropZone
          openFileDialog={openFileDialog}
          onDrop={handleDropZoneDrop}
          onFileDialogClose={toggleOpenFileDialog}
          outline={!files.length && true}
          variableHeight
        >
          {fileUpload}
        </DropZone>
      </div>
    </BlockStack>
  );
}
