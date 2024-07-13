"use client";

// import { DropZone, BlockStack, Thumbnail, Text } from "@shopify/polaris";
// import { NoteIcon } from "@shopify/polaris-icons";
// import { useState, useCallback } from "react";

// function FileUploadComponent() {
//   const [files, setFiles] = useState([]);

//   const handleDropZoneDrop = useCallback(
//     (_dropFiles, acceptedFiles, _rejectedFiles) =>
//       setFiles((files) => [...files, ...acceptedFiles]),
//     [],
//   );

//   const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

//   const fileUpload = !files.length && (
//     <DropZone.FileUpload actionHint="Accepts .gif, .jpg, and .png" />
//   );

//   const uploadedFiles = files.length > 0 && (
//     <BlockStack vertical>
//       {files.map((file, index) => (
//         <BlockStack align="center" key={index}>
//           <Thumbnail
//             size="small"
//             alt={file.name}
//             source={
//               validImageTypes.includes(file.type)
//                 ? window.URL.createObjectURL(file)
//                 : "NoteIcon"
//             }
//           />
//           <div>
//             {file.name}{" "}
//             <Text variant="bodySm" as="p">
//               {file.size} bytes
//             </Text>
//           </div>
//         </BlockStack>
//       ))}
//     </BlockStack>
//   );

//   return (
//     <DropZone onDrop={handleDropZoneDrop} variableHeight>
//       {uploadedFiles}
//       {fileUpload}
//     </DropZone>
//   );
// }

// export default FileUploadComponent;

import { DropZone, LegacyStack, Thumbnail, Text } from "@shopify/polaris";
import { NoteIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";

function DropZoneExample() {
  const [files, setFiles] = useState([]);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    [],
  );

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const fileUpload = !files.length && (
    <DropZone.FileUpload
      actionTitle="Add file"
      actionHint="Accepts .gif, .jpg, and .png"
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
                : NoteIcon
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

  return (
    <DropZone onDrop={handleDropZoneDrop} variableHeight>
      {uploadedFiles}
      {fileUpload}
    </DropZone>
  );
}

export default DropZoneExample;
