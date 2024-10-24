import React, { memo, useEffect, useState, useCallback } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { getBase64 } from "../utils/utils";

const MediaUpload = ({
  multiple = true,
  fileList,
  setFileList,
  defaultFileList,
  setDefaultFileList,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (defaultFileList?.length > 0 && fileList?.length === 0) {
      setFileList(defaultFileList);
    }
  }, [defaultFileList, fileList?.length, setFileList]);

  const handlePreview = useCallback(async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  }, []);

  const handleChange = useCallback(
    ({ fileList: newFileList }) => {
      if (!multiple) {
        newFileList = newFileList.slice(-1);
      }
      setFileList(newFileList);
    },
    [multiple, setFileList],
  );

  const handleRemove = useCallback(
    (file) => {
      const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
      setDefaultFileList(updatedFileList);
      setFileList(updatedFileList);
    },
    [fileList, setDefaultFileList, setFileList],
  );

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple={multiple}
        onRemove={handleRemove}
        defaultFileList={defaultFileList}
      >
        {fileList?.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
          alt="Preview"
          loading="lazy"
        />
      )}
    </>
  );
};

export default memo(MediaUpload);
