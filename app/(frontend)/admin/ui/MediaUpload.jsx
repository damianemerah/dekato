import React, { memo, useState, useCallback, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Upload, Image } from "antd";
import { getBase64 } from "../utils/utils";

const DraggableUploadListItem = ({ file, originNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: file.uid,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ant-upload-list-item ant-upload-list-item-picture-card ${
        isDragging ? "is-dragging" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      {originNode}
    </div>
  );
};

const MediaUpload = ({
  multiple = true,
  fileList,
  setFileList,
  defaultFileList,
  setDefaultFileList,
  draggable = false,
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

  const handleRemove = useCallback(
    (file) => {
      const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
      setDefaultFileList(updatedFileList);
      setFileList(updatedFileList);
    },
    [fileList, setDefaultFileList, setFileList],
  );

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setFileList((prev) => {
        const activeIndex = prev.findIndex((i) => i.uid === active.id);
        const overIndex = prev.findIndex((i) => i.uid === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const onChange = useCallback(
    ({ fileList: newFileList }) => {
      if (!multiple) {
        newFileList = newFileList.slice(-1);
      }
      setFileList(newFileList);
    },
    [multiple, setFileList],
  );

  return (
    <>
      {draggable ? (
        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
          <SortableContext
            items={fileList.map((i) => i.uid)}
            strategy={verticalListSortingStrategy}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={onChange}
              onRemove={handleRemove}
              itemRender={(originNode, file) => (
                <DraggableUploadListItem originNode={originNode} file={file} />
              )}
            >
              {fileList?.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </SortableContext>
        </DndContext>
      ) : (
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={onChange}
          multiple={multiple}
          onRemove={handleRemove}
        >
          {fileList?.length >= 8 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      )}
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
