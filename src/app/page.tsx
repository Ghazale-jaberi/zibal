"use client"; 
import fa_IR from 'antd/es/locale/fa_IR';
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import Navigation from "./components/Navigation";
import SimpleTable from "../app/components/SimpleTable ";
import MyFormModal from "../app/components/MyFormModal";

interface DataSourceType {
  key: string;
  cardNumber: string;
  amount: number;
  paidAt: string;
  status: number;  
  trackId: number;
  
}

export default function Home() {
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [filteredDataSource, setFilteredDataSource] = useState<DataSourceType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/data');
      const data = await response.json();
      const processedData = data.map((item: any) => ({
        ...item,
        key: item.trackId,
        trackId: Number(item.trackId),
        status: Number(item.status),  // تبدیل به عدد
      }));
      setDataSource(processedData);
      setFilteredDataSource(processedData);
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
    },
  ];

  return (
    <div className='page-style'>
      <Navigation />
      <Input.Search
      className='border-style'
        placeholder="Search by track ID"
        onChange={(e) => {
          const { value } = e.target;
          const filteredData = dataSource.filter(entry => entry.trackId.toString().includes(value));
          setFilteredDataSource(filteredData);
        }}
        style={{ width: 300, marginBottom: 10 , padding:15 }}
      />
      <SimpleTable  dataSource={filteredDataSource} columns={columns} rowKey="trackId"  />


      <MyFormModal />
    </div>
  );
}
