import React, { useState } from 'react';
import { Table, Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words'; // Correct import path for Highlighter
import type { ColumnsType } from 'antd/es/table';

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
  const [searchedColumn, setSearchedColumn] = useState('');

  // Function to handle search input change
  const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0] as string);
    setSearchedColumn(dataIndex);
  };

  // Function to handle clear filter
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  // Apply formatting to amount column
  const columnsWithRender = columns.map(col => {
    if (col.key === 'amount') {
      return {
        ...col,
        render: (text: any, record: DataType) => formatAmount(record.amount),
      };
    } else if (col.key === 'status') {
      return {
        ...col,
        render: (text: any, record: DataType) => statusRenderer(record.status),
      };
    }
    return col;
  });

  // Filter function based on search text
  const getColumnSearchProps = (dataIndex: string) => ({
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
    onFilter: (value: any, record: DataType) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  return (
    <Table
      dataSource={dataSource}
      columns={columnsWithRender.map(col => ({
        ...col,
        ...getColumnSearchProps(col.dataIndex as string),
      }))}
    />
  );
};

export default SimpleTable;
