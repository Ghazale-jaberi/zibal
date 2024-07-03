import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const { Option } = Select;

const MyFormModal = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Received values:', values);
        setVisible(false);
        message.success('ثبت درخواست تسویه با موفقیت انجام شد');
        form.resetFields();
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: ' به حساب',
    },
    {
      key: '2',
      label: 'به کیف پول',
    },

  ];

  const onFinishFailed = (errorInfo: any) => {
    console.error('Failed:', errorInfo);
  };

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        باز کردن فرم
      </Button>
      <Modal
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="ثبت درخواست تسویه"
        cancelText="انصراف"
      >
        <div className='modal-title'>
          <span>زیپ اصلی</span>
          <h4>تسویه کیف پول</h4>
        </div>

        <div className='inventory'>
          <span>: موجودی فعلی</span>

          <div className='wallet-money'>
            <span>15,000</span>
            <p>ریال</p>
          </div>
        </div>

        <div className='switch'>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>

        <Form
          form={form}
          layout="vertical"
          className='form'
          onFinish={handleOk}
          onFinishFailed={onFinishFailed}
          {...formItemLayout}
        >
          <Form.Item
            label="مقصد تسویه"
            name="destination"
            rules={[{ required: true, message: 'مقصد تسویه را وارد کنید' }]}
          >
            <Select
              showSearch
              placeholder="مقصد تسویه را انتخاب کنید"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as any)?.toLowerCase().includes(input.toLowerCase())
              }

            >
              <Option value="main_wallet">کیف پول اصلی</Option>
              <Option value="optional_wallet">کیف پول اختیاری</Option>
              <Option value="settlement_wallet">کیف پول تسویه</Option>
            </Select>

          </Form.Item>
          <Form.Item
            label="مبلغ تسویه"
            name="amount"
            rules={[{ required: true, message: 'مبلغ تسویه را وارد کنید' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => `${value}`.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            label=" توضیحات(بابت)"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MyFormModal;
