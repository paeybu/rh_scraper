import React, { useState } from 'react';
import { Input, Row, Col, Spin, Table } from 'antd';
import axios from 'axios';
import { data as mockData } from '../constants/data';

const columns = [
  {
    title: 'Pic',
    dataIndex: 'img',
    key: 'img',
    render: (img) => <img src={img} />,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (title, listing) => <a href={listing.link}>{title}</a>,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    sorter: (a, b) => a.size - b.size,
  },
  {
    title: 'Room Type',
    dataIndex: 'roomType',
    key: 'roomType',
    filters: [
      {
        text: '1 BR',
        value: '1 ห้องนอน',
      },
      {
        text: '2 BR',
        value: '2 ห้องนอน',
      },
    ],
    onFilter: (value, record) => record.roomType === value,
  },
];

const Home = () => {
  const [targetUrl, setTargetUrl] = useState('');
  const [data, setData] = useState({
    listings: [],
  });
  const [loading, setLoading] = useState(false);

  const onChangeTargetUrl = (e) => setTargetUrl(e.target.value);

  const onPressEnter = async () => {
    setLoading(true);
    const res = await axios.post('/', {
      url: targetUrl,
    });
    setData(res.data);
    setLoading(false);
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <h1>Input renthub listing url:</h1>
          <Input
            value={targetUrl}
            onChange={onChangeTargetUrl}
            onPressEnter={onPressEnter}
          />
          {loading ? (
            <Spin />
          ) : (
            <>
              {data.info && (
                <>
                  <h1>{data.info.title}</h1>
                  <h2>{data.info.altTitle}</h2>
                  <p>{data.info.address}</p>
                </>
              )}
              <Table
                columns={columns}
                dataSource={data.listings.map((d, i) => ({
                  key: i,
                  ...d,
                }))}
                pagination={false}
              ></Table>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default Home;
