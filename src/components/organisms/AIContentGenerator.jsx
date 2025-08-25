import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import contentService from "@/services/api/contentService";
import { toast } from "react-toastify";

const AIContentGenerator = () => {
  const [brief, setBrief] = useState("");
  const [contentType, setContentType] = useState("");
  const [tone, setTone] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(0);

  const contentTypes = [
    { value: "ad_copy", label: "Ad Copy" },
    { value: "social_post", label: "Social Media Post" },
    { value: "email", label: "Email Campaign" },
    { value: "landing_page", label: "Landing Page Copy" },
    { value: "blog_post", label: "Blog Post" }
  ];

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual & Friendly" },
    { value: "urgent", label: "Urgent & Direct" },
    { value: "inspirational", label: "Inspirational" },
    { value: "humorous", label: "Light & Humorous" }
  ];

  const handleGenerate = async () => {
    if (!brief || !contentType || !tone) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setGenerating(true);
      const draft = await contentService.generateContent({
        brief,
        type: contentType,
        tone
      });
      setGeneratedContent(draft.generatedContent);
      setSelectedVersion(0);
      toast.success("Content generated successfully!");
    } catch (err) {
      toast.error("Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (generatedContent.length === 0) return;

    try {
      const savedDraft = await contentService.create({
        brief,
        type: contentType,
        tone,
        generatedContent,
        selectedVersion,
        status: "draft"
      });
      toast.success("Content saved as draft");
      // Reset form
      setBrief("");
      setContentType("");
      setTone("");
      setGeneratedContent([]);
      setSelectedVersion(0);
    } catch (err) {
      toast.error("Failed to save content");
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case "ad_copy": return "Megaphone";
      case "social_post": return "Share2";
      case "email": return "Mail";
      case "landing_page": return "Globe";
      case "blog_post": return "FileText";
      default: return "FileText";
    }
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
          <ApperIcon name="Sparkles" className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            AI Content Generator
          </h3>
          <p className="text-sm text-gray-600">
            Generate compelling marketing content with AI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Content Type"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          required
        >
          {contentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>

        <Select
          label="Tone of Voice"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          required
        >
          {tones.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </div>

      <Input
        label="Content Brief"
        placeholder="Describe what you want to create, target audience, key messages..."
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        helper="Provide as much detail as possible for better results"
        required
      />

      <div className="flex items-center space-x-3">
        <Button
          onClick={handleGenerate}
          loading={generating}
          disabled={!brief || !contentType || !tone}
          icon="Sparkles"
        >
          Generate Content
        </Button>
        
        {generatedContent.length > 0 && (
          <Badge variant="success" size="sm">
            {generatedContent.length} versions generated
          </Badge>
        )}
      </div>

      {generatedContent.length > 0 && (
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-gray-900">Generated Content</h4>
            <div className="flex items-center space-x-2">
              {generatedContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVersion(index)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                    selectedVersion === index
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Version {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <ApperIcon 
                name={getContentTypeIcon(contentType)} 
                className="w-4 h-4 text-gray-600" 
              />
              <Badge variant="outline" size="sm">
                {contentTypes.find(t => t.value === contentType)?.label}
              </Badge>
              <Badge variant="outline" size="sm">
                {tones.find(t => t.value === tone)?.label}
              </Badge>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div 
                className="text-gray-800 whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: generatedContent[selectedVersion]?.content || "" 
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button onClick={handleSave} icon="Save">
              Save as Draft
            </Button>
            <Button variant="outline" icon="Copy">
              Copy to Clipboard
            </Button>
            <Button variant="outline" icon="Download">
              Export
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AIContentGenerator;