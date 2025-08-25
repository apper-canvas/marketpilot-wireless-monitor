import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import abTestService from "@/services/api/abTestService";

const ABTesting = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const data = await abTestService.getAll();
      setTests(data);
    } catch (err) {
      setError("Failed to load A/B tests");
      toast.error("Failed to load A/B tests");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async (testData) => {
    try {
      const newTest = await abTestService.create(testData);
      setTests([...tests, newTest]);
      setShowCreateModal(false);
      toast.success("A/B test created successfully");
    } catch (err) {
      toast.error("Failed to create A/B test");
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this A/B test?")) return;
    
    try {
      await abTestService.delete(testId);
      setTests(tests.filter(test => test.Id !== testId));
      toast.success("A/B test deleted successfully");
    } catch (err) {
      toast.error("Failed to delete A/B test");
    }
  };

  const handleStartTest = async (testId) => {
    try {
      const updatedTest = await abTestService.update(testId, { 
        status: 'running',
        startedAt: new Date().toISOString()
      });
      setTests(tests.map(test => test.Id === testId ? updatedTest : test));
      toast.success("A/B test started successfully");
    } catch (err) {
      toast.error("Failed to start A/B test");
    }
  };

  const handleStopTest = async (testId) => {
    try {
      const updatedTest = await abTestService.update(testId, { 
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      setTests(tests.map(test => test.Id === testId ? updatedTest : test));
      toast.success("A/B test stopped successfully");
    } catch (err) {
      toast.error("Failed to stop A/B test");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'success';
      case 'completed': return 'info';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  const getStatisticalSignificance = (variantA, variantB) => {
    const conversionA = variantA.conversions / variantA.visitors;
    const conversionB = variantB.conversions / variantB.visitors;
    const lift = ((conversionB - conversionA) / conversionA) * 100;
    
    // Simplified statistical significance calculation
    const pooledConversion = (variantA.conversions + variantB.conversions) / 
                           (variantA.visitors + variantB.visitors);
    const standardError = Math.sqrt(pooledConversion * (1 - pooledConversion) * 
                          (1/variantA.visitors + 1/variantB.visitors));
    const zScore = Math.abs(conversionB - conversionA) / standardError;
    const significance = zScore > 1.96 ? 95 : zScore > 1.645 ? 90 : 0;
    
    return { lift: lift.toFixed(2), significance };
  };

  const filteredTests = tests.filter(test => {
    if (filter !== 'all' && test.status !== filter) return false;
    if (searchTerm && !test.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) return <Loading variant="dashboard" />;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            A/B Testing
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage A/B tests to optimize your campaigns
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowCreateModal(true)}
          className="shadow-lg hover:shadow-xl"
        >
          Create Test
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{tests.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TestTube" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Running Tests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {tests.filter(t => t.status === 'running').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Play" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Tests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {tests.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Improvement</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">+12.4%</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">All Tests</option>
              <option value="draft">Draft</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tests List */}
      {filteredTests.length === 0 ? (
        <Empty
          variant="campaigns"
          title="No A/B tests found"
          description="Create your first A/B test to start optimizing your campaigns and improving conversion rates."
          action={() => setShowCreateModal(true)}
          actionText="Create Test"
        />
      ) : (
        <div className="space-y-6">
          {filteredTests.map((test) => (
            <TestCard
              key={test.Id}
              test={test}
              onStart={() => handleStartTest(test.Id)}
              onStop={() => handleStopTest(test.Id)}
              onDelete={() => handleDeleteTest(test.Id)}
              onViewDetails={() => setSelectedTest(test)}
              onAddVariant={() => {
                setSelectedTest(test);
                setShowVariantModal(true);
              }}
              getStatusColor={getStatusColor}
              getStatisticalSignificance={getStatisticalSignificance}
            />
          ))}
        </div>
      )}

      {/* Create Test Modal */}
      {showCreateModal && (
        <CreateTestModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTest}
        />
      )}

      {/* Add Variant Modal */}
      {showVariantModal && selectedTest && (
        <AddVariantModal
          test={selectedTest}
          onClose={() => {
            setShowVariantModal(false);
            setSelectedTest(null);
          }}
          onSubmit={loadTests}
        />
      )}
    </div>
  );
};

const TestCard = ({ 
  test, 
  onStart, 
  onStop, 
  onDelete, 
  onViewDetails, 
  onAddVariant,
  getStatusColor,
  getStatisticalSignificance 
}) => {
  const stats = test.variants.length >= 2 
    ? getStatisticalSignificance(test.variants[0], test.variants[1])
    : null;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
              <Badge variant={getStatusColor(test.status)}>
                {test.status}
              </Badge>
              {stats && stats.significance >= 95 && (
                <Badge variant="success">
                  Significant
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-2">{test.description}</p>
            <div className="flex items-center text-xs text-gray-500 space-x-4">
              <span>Type: {test.type}</span>
              <span>•</span>
              <span>Variants: {test.variants.length}</span>
              <span>•</span>
              <span>Created: {new Date(test.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {test.status === 'draft' && (
              <Button size="sm" variant="success" onClick={onStart}>
                <ApperIcon name="Play" className="w-4 h-4 mr-1" />
                Start
              </Button>
            )}
            {test.status === 'running' && (
              <Button size="sm" variant="outline" onClick={onStop}>
                <ApperIcon name="Pause" className="w-4 h-4 mr-1" />
                Stop
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={onAddVariant}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
              Add Variant
            </Button>
            <Button size="sm" variant="ghost" onClick={onViewDetails}>
              <ApperIcon name="Eye" className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-600 hover:text-red-700">
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Variants Performance */}
        {test.variants.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Variant Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {test.variants.map((variant, index) => (
                <div key={variant.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">
                      {variant.name}
                      {index === 0 && <span className="text-xs text-gray-500 ml-2">(Control)</span>}
                    </h5>
                    {stats && index === 1 && (
                      <span className={`text-xs font-medium ${
                        parseFloat(stats.lift) > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {parseFloat(stats.lift) > 0 ? '+' : ''}{stats.lift}%
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Visitors</p>
                      <p className="font-medium">{variant.visitors.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Conversions</p>
                      <p className="font-medium">{variant.conversions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Conversion Rate</p>
                      <p className="font-medium">
                        {((variant.conversions / variant.visitors) * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Revenue</p>
                      <p className="font-medium">${variant.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Traffic Split Indicator */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Traffic Split</span>
                      <span>{variant.trafficSplit}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: `${variant.trafficSplit}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Statistical Significance */}
            {stats && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-blue-900">Statistical Analysis</h5>
                    <p className="text-sm text-blue-700 mt-1">
                      Confidence Level: {stats.significance}%
                      {stats.significance >= 95 && " - Results are statistically significant!"}
                      {stats.significance < 95 && " - Need more data for significance"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600">Lift</p>
                    <p className={`text-lg font-bold ${
                      parseFloat(stats.lift) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(stats.lift) > 0 ? '+' : ''}{stats.lift}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const CreateTestModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'landing_page',
    targetUrl: '',
    conversionGoal: 'click',
    trafficAllocation: 100
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create A/B Test</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Test Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Homepage Banner Test"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Test different banner designs to improve conversion rate"
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <Select
              label="Test Type"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="landing_page">Landing Page</option>
              <option value="email">Email</option>
              <option value="ad_creative">Ad Creative</option>
              <option value="cta_button">CTA Button</option>
              <option value="headline">Headline</option>
            </Select>

            <Input
              label="Target URL"
              required
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              placeholder="https://example.com/landing-page"
            />

            <Select
              label="Conversion Goal"
              required
              value={formData.conversionGoal}
              onChange={(e) => setFormData({ ...formData, conversionGoal: e.target.value })}
            >
              <option value="click">Click</option>
              <option value="signup">Sign Up</option>
              <option value="purchase">Purchase</option>
              <option value="download">Download</option>
              <option value="custom">Custom Event</option>
            </Select>

            <Input
              label="Traffic Allocation (%)"
              type="number"
              required
              min="1"
              max="100"
              value={formData.trafficAllocation}
              onChange={(e) => setFormData({ ...formData, trafficAllocation: parseInt(e.target.value) })}
            />

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Test
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AddVariantModal = ({ test, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    changes: '',
    trafficSplit: 50
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await abTestService.addVariant(test.Id, formData);
      await onSubmit();
      onClose();
      toast.success("Variant added successfully");
    } catch (err) {
      toast.error("Failed to add variant");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add Variant</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Variant Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Variant B"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what's different in this variant"
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Changes Made
              </label>
              <textarea
                required
                value={formData.changes}
                onChange={(e) => setFormData({ ...formData, changes: e.target.value })}
                placeholder="List the specific changes made in this variant"
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <Input
              label="Traffic Split (%)"
              type="number"
              required
              min="1"
              max="100"
              value={formData.trafficSplit}
              onChange={(e) => setFormData({ ...formData, trafficSplit: parseInt(e.target.value) })}
            />

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Variant
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ABTesting;