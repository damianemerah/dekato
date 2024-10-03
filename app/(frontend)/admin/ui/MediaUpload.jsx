import React, { memo, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { getBase64 } from "../utils/utils";
import { set } from "lodash";

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
      console.log("defaultFileList", defaultFileList);
      setFileList(defaultFileList);
    }
  }, [defaultFileList, fileList?.length, setFileList]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    console.log("file", file.url);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    if (!multiple) {
      newFileList = newFileList.slice(-1);
    }
    setFileList(newFileList);
  };

  const handleRemove = (file) => {
    const updatedFileList = fileList.filter((item) => item.uid !== file.uid);

    setDefaultFileList(updatedFileList);
    setFileList(updatedFileList);
  };

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
