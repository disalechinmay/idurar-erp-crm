import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col } from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { DatePicker } from '@/components/CustomAntd';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';

import ItemRow from '@/modules/ErpPanelModule/ItemRow';

import MoneyInputFormItem from '@/components/MoneyInputFormItem';

import calculate from '@/utils/calculate';

export default function OfferForm({ subTotal = 0, offerTotal = 0, current = null }) {
  const [total, setTotal] = useState(0);
  const [totalOffer, setTotalOffer] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const handelTaxChange = (value) => {
    setTaxRate(value);
  };

  useEffect(() => {
    if (current) {
      const { taxRate = 0, year } = current;
      setTaxRate(taxRate);
      setCurrentYear(year);
    }
  }, [current]);

  useEffect(() => {
    const currentTotal = calculate.add(calculate.multiply(subTotal, taxRate), subTotal);
    setTaxTotal(Number.parseFloat(calculate.multiply(subTotal, taxRate)).toFixed(2));
    setTotal(Number.parseFloat(currentTotal).toFixed(2));
  }, [subTotal, taxRate]);

  useEffect(() => {
    const currentTotal = calculate.add(calculate.multiply(offerTotal, taxRate), offerTotal);
    setTaxTotal(Number.parseFloat(calculate.multiply(offerTotal, taxRate)).toFixed(2));
    setTotalOffer(Number.parseFloat(currentTotal).toFixed(2));
  }, [offerTotal, taxRate]);

  const addField = useRef(false);

  useEffect(() => {
    addField.current.click();
  }, []);

  return (
    <>
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={9}>
          <Form.Item
            name="lead"
            label="Lead"
            rules={[
              {
                required: true,
                message: 'Please input your lead!',
              },
            ]}
          >
            <AutoCompleteAsync
              entity={'lead'}
              displayLabels={['company']}
              searchFields={'company,managerSurname,managerName'}
              // onUpdateValue={autoCompleteUpdate}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="Number"
            name="number"
            initialValue={1}
            rules={[
              {
                required: true,
                message: 'Please input offer number!',
              },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="year"
            name="year"
            initialValue={currentYear}
            rules={[
              {
                required: true,
                message: 'Please input offer year!',
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="status"
            name="status"
            rules={[
              {
                required: false,
                message: 'Please input offer status!',
              },
            ]}
            initialValue={'draft'}
          >
            <Select
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'pending', label: 'Pending' },
                { value: 'sent', label: 'Sent' },
                { value: 'accepted', label: 'Accepted' },
              ]}
            ></Select>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={9}>
          <Form.Item label="Note" name="note">
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="date"
            label="Date"
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={7}>
          <Form.Item
            name="expiredDate"
            label="Expire Date"
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs().add(30, 'days')}
          >
            <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} />
          </Form.Item>
        </Col>
      </Row>
      <Divider dashed />
      <Row gutter={[12, 12]} style={{ position: 'relative' }}>
        <Col className="gutter-row" span={3}>
          <p>Item</p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p>Description</p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p>Quantity</p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p>Price</p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p>Offer Price</p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p>Offer Total</p>
        </Col>
      </Row>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <ItemRow
                key={field.key}
                remove={remove}
                field={field}
                current={current}
                offer
              ></ItemRow>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                ref={addField}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Divider dashed />
      <div style={{ position: 'relative', width: ' 100%', float: 'right' }}>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={5}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                Save Offer
              </Button>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4} offset={10}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
              }}
            >
              Sub Total :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={subTotal} />
          </Col>
        </Row>

        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
              }}
            >
              Offer Sub Total :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={offerTotal} />
          </Col>
        </Row>

        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <Form.Item
              name="taxRate"
              rules={[
                {
                  required: false,
                  message: 'Please input your taxRate!',
                },
              ]}
              initialValue="0"
            >
              <Select
                value={taxRate}
                onChange={handelTaxChange}
                bordered={false}
                options={[
                  { value: 0, label: 'Tax 0 %' },
                  { value: 0.19, label: 'Tax 19 %' },
                ]}
              ></Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={taxTotal} />
          </Col>
        </Row>

        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
              }}
            >
              Total :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={total} />
          </Col>
        </Row>

        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
              }}
            >
              Total Offer :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={totalOffer} />
          </Col>
        </Row>
      </div>
    </>
  );
}