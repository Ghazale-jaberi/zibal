import React, { useState } from 'react';
import { Table, Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import type { ColumnsType } from 'antd/es/table';
import moment from 'jalali-moment';

interface DataType {
  key: string;
  amount: number;
  trackId: number;
  status: number;
  paidAt: string;
  cardNumber: string;
}

interface SimpleTableProps {
  dataSource: DataType[];
  columns: ColumnsType<DataType>;
}

const SimpleTable: React.FC<SimpleTableProps> = ({ dataSource, columns }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<keyof DataType | ''>('');

  const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: keyof DataType) => {
    confirm();
    setSearchText(selectedKeys[0] as string);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const statusRenderer = (status: number) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Paid';
      case 2:
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (date: string) => {
    const m = moment(date, 'jYYYY/jMM/jDD-HH:mm:ss');
    return `${m.format('DD')} ${m.format('jMMMM')} ${m.format('HH:mm')} ${m.format('jYYYY')}`;
  };

  const getColumnSearchProps = (dataIndex: keyof DataType) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: string | number | boolean, record: DataType) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase()),
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columnsWithRender = columns.map(col => {
    if ('dataIndex' in col) {
      const dataIndex = col.dataIndex as keyof DataType;
      if (dataIndex === 'amount') {
        return {
          ...col,
          render: (text: any, record: DataType) => formatAmount(record.amount),
        };
      } else if (dataIndex === 'status') {
        return {
          ...col,
          render: (text: any, record: DataType) => statusRenderer(record.status),
        };
      } else if (dataIndex === 'paidAt') {
        return {
          ...col,
          render: (text: any, record: DataType) => formatDate(record.paidAt),
        };
      }
      return {
        ...col,
        ...getColumnSearchProps(dataIndex),
      };
    }
    return col;
  });

  return (
    <Table dataSource={dataSource} columns={columnsWithRender} />
  );
};

export default SimpleTable;
