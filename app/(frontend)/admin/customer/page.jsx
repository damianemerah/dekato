"use client";
import { Form, Input, Row, Col, Card, Button } from "antd";
import AccountLayout from "../../(account)/account/AccountLayout";

const NewCustomerForm = () => {
  return (
    <AccountLayout title="My Address" breadcrumbs={breadcrumbs}>
      <Form
        layout="vertical"
        style={{ maxWidth: "600px", margin: "0 auto" }}
        onFinish={(values) => console.log(values)}
      >
        <Card title="Customer overview" bordered={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First name"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input placeholder="First name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last name"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Last name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: false, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Phone number" />
          </Form.Item>
        </Card>

        {/* Default Address Section */}
        <Card
          title="Default Address"
          bordered={false}
          style={{ marginTop: "24px" }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: false, message: "Please enter country" }]}
              >
                <Input placeholder="Country" />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
            <Form.Item
              name="addressFirstName"
              label="First name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="First name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="addressLastName"
              label="Last name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Last name" />
            </Form.Item>
          </Col> */}
          </Row>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
          <Form.Item name="apartmentSuite" label="Apartment/Suite">
            <Input placeholder="Apartment/Suite" />
          </Form.Item>
          <Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: false, message: "Please enter city" }]}
                >
                  <Input placeholder="City" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="postalCode"
                  label="Postal code"
                  rules={[
                    { required: false, message: "Please enter postal code" },
                  ]}
                >
                  <Input placeholder="Postal code" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="phone"
              label="Phone number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Phone number" />
            </Form.Item>
          </Form.Item>
          <Form.Item className="flex justify-center">
            <Button className="!bg-primary !text-white" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </AccountLayout>
  );
};

export default NewCustomerForm;
