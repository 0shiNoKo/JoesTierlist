import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Form, 
  Input, 
  Modal, 
  message, 
  Select 
} from 'antd';
import { 
  LockOutlined, 
  UserOutlined, 
  DiscordOutlined, 
  PlusOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import './App.css';

// Type Definitions
interface TierItem {
  id: string;
  name: string;
  tier: string;
}

// Main Application Component
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
  const [tierList, setTierList] = useState<Record<string, TierItem[]>>({
    'Tier 1': [],
    'Tier 2': [],
    'Tier 3': [],
    'Tier 4': [],
    'Tier 5': []
  });

  // Authentication Handler
  const handleLogin = (values: { username: string; password: string }) => {
    if (values.username === 'admin' && values.password === 'adminpassword') {
      setIsAuthenticated(true);
      setUserRole('admin');
      message.success('Welcome to Joe\'s Tierlist!');
    } else {
      message.error('Invalid credentials');
    }
  };

  // Tier Management Methods
  const addItemToTier = (name: string, tier: string) => {
    const newItem: TierItem = {
      id: `${Date.now()}`,
      name,
      tier
    };

    setTierList(prev => ({
      ...prev,
      [tier]: [...prev[tier], newItem]
    }));
  };

  const removeItemFromTier = (itemId: string, tier: string) => {
    setTierList(prev => ({
      ...prev,
      [tier]: prev[tier].filter(item => item.id !== itemId)
    }));
  };

  // Render Tier Rows
  const renderTierList = () => {
    return Object.entries(tierList).map(([tierName, items]) => (
      <div 
        key={tierName} 
        className="tier-row bg-gray-100 border-2 border-gray-300 mb-2 p-4 flex"
      >
        <div className="tier-label font-bold w-24 mr-4">{tierName}</div>
        <div className="tier-content flex flex-wrap gap-2">
          {items.map(item => (
            <div 
              key={item.id} 
              className="bg-white p-2 rounded-md shadow flex items-center"
            >
              {item.name}
              {userRole === 'admin' && (
                <Button 
                  icon={<DeleteOutlined />} 
                  size="small" 
                  className="ml-2"
                  onClick={() => removeItemFromTier(item.id, tierName)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // Admin Add Item Modal
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  const handleAddItem = () => {
    addForm.validateFields().then(values => {
      addItemToTier(values.name, values.tier);
      setIsAddModalVisible(false);
      addForm.resetFields();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-purple-600">Joe's Tierlist</h1>
        <div className="flex space-x-2">
          {/* Discord Button */}
          <Button 
            icon={<DiscordOutlined />} 
            onClick={() => window.open('https://discord.gg/RvpuDbuexy', '_blank')}
          >
            Discord
          </Button>

          {/* Login/Logout */}
          {!isAuthenticated ? (
            <Modal
              title="Login to Joe's Tierlist"
              open={!isAuthenticated}
              footer={null}
            >
              <Form onFinish={handleLogin}>
                <Form.Item 
                  name="username" 
                  rules={[{ required: true, message: 'Username required' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item 
                  name="password" 
                  rules={[{ required: true, message: 'Password required' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Login
                </Button>
              </Form>
            </Modal>
          ) : (
            <Button onClick={() => setIsAuthenticated(false)}>Logout</Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      {isAuthenticated && (
        <div className="container mx-auto p-6">
          {renderTierList()}
          
          {userRole === 'admin' && (
            <>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setIsAddModalVisible(true)}
                className="mt-4"
              >
                Add Item
              </Button>

              <Modal
                title="Add New Tier Item"
                open={isAddModalVisible}
                onOk={handleAddItem}
                onCancel={() => setIsAddModalVisible(false)}
              >
                <Form form={addForm}>
                  <Form.Item 
                    name="name" 
                    label="Item Name" 
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item 
                    name="tier" 
                    label="Tier" 
                    rules={[{ required: true }]}
                  >
                    <Select>
                      {Object.keys(tierList).map(tier => (
                        <Select.Option key={tier} value={tier}>
                          {tier}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
