"use client"; // Add this line to specify that this component should run on the client side

import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import Navigation from "./components/Navigation";
import SimpleTable from "../app/components/SimpleTable ";

export default function Home() {
  const [dataSource, setDataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/data');
      const data = await response.json();
      setDataSource(data);
      setFilteredDataSource(data); // Initialize filtered data with all data
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'شماره کارت',
      dataIndex: 'cardNumber',
      key: 'cardNumber',
    },
    {
      title: 'مبلغ',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'تاریخ پرداخت',
      dataIndex: 'paidAt',
      key: 'paidAt',
    },
    {
      title: 'وضعیت تراکنش',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'شماره تراکنش',
      dataIndex: 'trackId',
      key: 'trackId',
      // Add any additional configurations here for columns
    },
  ];

  return (
    <div>
      <Navigation />
      <Input.Search
        placeholder="Search by track ID"
        onChange={(e) => {
          const { value } = e.target;
          const filteredData = dataSource.filter(entry => entry.trackId.toString().includes(value));
          setFilteredDataSource(filteredData);
        }}
        style={{ width: 300, marginBottom: 10 }}
      />
      <SimpleTable dataSource={filteredDataSource} columns={columns} />
    </div>
  );
}
