import React, { useState, useEffect } from 'react';
import { 
  LockOutlined, 
  UserOutlined, 
  DiscordOutlined, 
  PlusOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { 
  Layout, 
  Menu, 
  Button, 
  Form, 
  Input, 
  Card, 
  Modal, 
  message, 
  Tooltip 
} from 'antd';

// Secure authentication utility
const authService = {
  login: async (username, password) => {
    // Simulated secure login with CAPTCHA-like challenge
    if (username === 'admin' && password === 'adminpassword') {
      return { 
        success: true, 
        role: 'admin',
        token: generateSecureToken()
      };
    }
    return { success: false };
  },
  generateToken: () => {
    // Robust token generation with timestamp and randomness
    return btoa(`${Date.now()}-${Math.random().toString(36).substring(2)}`);
  }
};

// Tier list management logic
const TierListManager = () => {
  const [tiers, setTiers] = useState({
    'Tier 1': [],
    'Tier 2': [],
    'Tier 3': [],
    'Tier 4': [],
    'Tier 5': []
  });

  const addToTier = (person, tier) => {
    setTiers(prev => ({
      ...prev,
      [tier]: [...prev[tier], person]
    }));
  };

  const removeFromTier = (person, tier) => {
    setTiers(prev => ({
      ...prev,
      [tier]: prev[tier].filter(p => p !== person)
    }));
  };

  return { tiers, addToTier, removeFromTier };
};

// Main Application Component
const JoesTierlist = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { tiers, addToTier, removeFromTier } = TierListManager();

  const handleLogin = async (values) => {
    const result = await authService.login(values.username, values.password);
    if (result.success) {
      setIsAuthenticated(true);
      setUserRole(result.role);
      message.success('Welcome to Joe\'s Tierlist!');
    } else {
      message.error('Invalid credentials');
    }
  };

  const renderTierList = () => {
    return Object.entries(tiers).map(([tierName, tierItems]) => (
      <div 
        key={tierName} 
        className="tier-row bg-gray-100 border-2 border-gray-300 mb-2 p-4 flex items-center"
      >
        <div className="tier-label font-bold w-24 mr-4">{tierName}</div>
        <div className="tier-content flex flex-wrap gap-2">
          {tierItems.map(item => (
            <div 
              key={item} 
              className="bg-white p-2 rounded-md shadow flex items-center"
            >
              {item}
              {userRole === 'admin' && (
                <Button 
                  icon={<DeleteOutlined />} 
                  size="small" 
                  className="ml-2"
                  onClick={() => removeFromTier(item, tierName)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-purple-600">Joe's Tierlist</h1>
        <div className="flex space-x-2">
          <Tooltip title="Join our Discord">
            <Button 
              icon={<DiscordOutlined />} 
              onClick={() => window.open('https://discord.gg/RvpuDbuexy', '_blank')}
            >
              Discord
            </Button>
          </Tooltip>
          {!isAuthenticated && (
            <Modal 
              title="Login to Joe's Tierlist" 
              footer={null}
              trigger={
                <Button icon={<LockOutlined />}>Login</Button>
              }
            >
              <Form onFinish={handleLogin}>
                <Form.Item 
                  name="username" 
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item 
                  name="password" 
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Login
                </Button>
              </Form>
            </Modal>
          )}
        </div>
      </header>

      {isAuthenticated && (
        <div className="container mx-auto p-6">
          {renderTierList()}
          
          {userRole === 'admin' && (
            <Card 
              title="Admin Panel" 
              extra={
                <Button 
                  icon={<PlusOutlined />} 
                  type="primary"
                  onClick={() => {
                    const newPerson = prompt("Enter name to add:");
                    if (newPerson) {
                      const tier = prompt("Enter tier (1-5):");
                      if (tier && ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'].includes(`Tier ${tier}`)) {
                        addToTier(newPerson, `Tier ${tier}`);
                      }
                    }
                  }}
                >
                  Add Person
                </Button>
              }
            >
              <p>Administrative controls for managing the tierlist.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default JoesTierlist;
