"use client";

import { memo, useCallback } from "react";
import { Form, InputNumber, DatePicker, Select, message } from "antd";
import dynamic from "next/dynamic";
import { updateProductDiscount } from "@/app/action/productAction";

const Modal = dynamic(() => import("antd/lib/modal"), { ssr: false });

const DiscountModal = memo(function DiscountModal({
  isOpen,
  onClose,
  selectedProducts,
  saleCollections,
  onSuccess,
  loading,
  setLoading,
}) {
  const [form] = Form.useForm();

  console.log(saleCollections, "12333");

  const handleOk = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      for (const productId of selectedProducts) {
        await updateProductDiscount(
          productId,
          {
            discount: values.discount,
            discountDuration: values.discountDuration.toISOString(),
          },
          values.campaign,
        );
      }

      message.success("Products added to sales successfully");
      onSuccess();
      onClose();
      form.resetFields();
    } catch (error) {
      message.error("Failed to add products to sales");
    } finally {
      setLoading(false);
    }
  }, [form, selectedProducts, onSuccess, onClose, setLoading]);

  const handleCancel = useCallback(() => {
    onClose();
    form.resetFields();
  }, [form, onClose]);

  return (
    <Modal
      title="Add to Sales"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="discount"
          label="Discount Percentage"
          rules={[
            {
              required: true,
              message: "Please input the discount percentage!",
            },
          ]}
        >
          <InputNumber min={0} max={100} />
        </Form.Item>
        <Form.Item
          name="discountDuration"
          label="Discount Duration"
          rules={[
            {
              required: true,
              message: "Please select the discount duration!",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="campaign"
          label="Sale Collection"
          rules={[
            {
              required: false,
              message: "Please select a sale collection!",
            },
          ]}
        >
          <Select placeholder="Select a sale collection" allowClear>
            {saleCollections?.map((collection) => (
              <Select.Option key={collection.id} value={collection.id}>
                {collection.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default DiscountModal;
