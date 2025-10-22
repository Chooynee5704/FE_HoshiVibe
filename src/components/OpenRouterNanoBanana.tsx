import React, { useState, useRef } from 'react';
import { Upload, Download, FileImage, Loader2, AlertCircle } from 'lucide-react';

interface OpenRouterNanoBananaProps {
  apiKey?: string;
}

const OpenRouterNanoBanana: React.FC<OpenRouterNanoBananaProps> = ({ apiKey: propApiKey }) => {
  const [apiKey, setApiKey] = useState(propApiKey || '');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('black-forest-labs/flux-1-schnell:free');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const models = [
    { id: 'google/gemini-2.5-flash-image-preview', name: 'Google Gemini 2.5 Flash Image (Nano Banana) - Paid' },
    { id: 'black-forest-labs/flux-1.1-pro', name: 'FLUX.1.1 Pro - Paid' },
    { id: 'black-forest-labs/flux-1-schnell:free', name: 'FLUX.1 Schnell - Free' },
    { id: 'stability-ai/stable-diffusion-3-medium', name: 'Stable Diffusion 3 Medium - Paid' },
    { id: 'openai/dall-e-3', name: 'OpenAI DALL-E 3 - Paid' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setError(null);
      setProcessedImageUrl(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const processImage = async () => {
    if (!selectedImage || !apiKey.trim()) {
      setError('Please select an image and provide an API key');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Convert image to base64
      const base64Image = await convertToBase64(selectedImage);

      const requestBody = {
        model: selectedModel,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt || "Transform this image into a more vibrant and enhanced version"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${selectedImage.type};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      };

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'OpenRouter Nano Banana'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (!data.choices?.[0]?.message) {
        throw new Error('No response message received');
      }

      const message = data.choices[0].message;
      
      // Check for images in the message (for image generation models)
      if (message.images && Array.isArray(message.images) && message.images.length > 0) {
        // Use the first generated image
        const imageData = message.images[0];
        console.log('Image data:', imageData); // Debug log
        
        let imageUrl = null;
        
        if (typeof imageData === 'string') {
          // Direct string URL
          imageUrl = imageData;
        } else if (typeof imageData === 'object' && imageData !== null) {
          // Handle the actual structure: {type: 'image_url', image_url: {url: '...'}}
          if (imageData.image_url && imageData.image_url.url) {
            imageUrl = imageData.image_url.url;
          } else {
            // Fallback to other possible properties
            imageUrl = imageData.url || imageData.data || imageData.b64_json;
            
            // Handle base64 data without data URI prefix
            if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('data:') && !imageUrl.startsWith('http')) {
              imageUrl = `data:image/png;base64,${imageUrl}`;
            }
          }
        }
        
        console.log('Extracted imageUrl:', typeof imageUrl, imageUrl ? imageUrl.substring(0, 50) + '...' : 'null');
        
        if (imageUrl && typeof imageUrl === 'string' && (imageUrl.startsWith('data:image/') || imageUrl.startsWith('http'))) {
          setProcessedImageUrl(imageUrl);
          return;
        }
      }

      // Check if the response contains an image in content
      const messageContent = message.content;
      
      // Handle different response formats from Gemini 2.5 Flash Image
      if (Array.isArray(messageContent)) {
        // Look for image content in the array
        const imageContent = messageContent.find(item => item && typeof item === 'object' && (item.type === 'image_url' || item.image_url));
        if (imageContent) {
          const imageUrl = imageContent.image_url?.url || imageContent.url;
          if (imageUrl && typeof imageUrl === 'string' && (imageUrl.startsWith('data:image/') || imageUrl.startsWith('http'))) {
            setProcessedImageUrl(imageUrl);
            return;
          }
        }
      } else if (typeof messageContent === 'string') {
        // Check if the string contains a base64 image or URL
        console.log('Checking string content:', messageContent.substring(0, 100)); // Debug log
        if (messageContent && typeof messageContent === 'string' && (messageContent.startsWith('data:image/') || messageContent.startsWith('http'))) {
          setProcessedImageUrl(messageContent);
          return;
        }
      }

      // If no direct image found, show error for debugging
      if (!messageContent) {
        throw new Error('No content received from the model. This might be a model compatibility issue.');
      }

      // If no direct image URL found, create a text overlay as fallback
      const analysisText = typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent);
      
      // Create a simple canvas with the analysis text overlaid on the original image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx?.drawImage(img, 0, 0);
        
        // Add semi-transparent overlay
        if (ctx) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(0, img.height - 200, img.width, 200);
          
          // Add text
          ctx.fillStyle = 'white';
          ctx.font = '16px Arial';
          ctx.textAlign = 'left';
          
          // Wrap text
          const maxWidth = img.width - 20;
          const words = analysisText.split(' ');
          let line = '';
          let y = img.height - 180;
          
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
              ctx.fillText(line, 10, y);
              line = words[n] + ' ';
              y += 20;
              
              if (y > img.height - 20) break; // Stop if we run out of space
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, 10, y);
        }
        
        // Convert canvas to blob URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setProcessedImageUrl(url);
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.src = previewUrl || '';

    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing the image');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImageUrl) return;

    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = `nano-banana-transformed-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetComponent = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setError(null);
    setPrompt('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">OpenRouter Nano Banana</h1>
        <p className="text-gray-600">Upload an image and transform it with Google's Nano Banana AI</p>
      </div>

      {/* Model Selection */}
      <div className="mb-6">
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
          AI Model
        </label>
        <select
          id="model"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* API Key Input */}
      <div className="mb-6">
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
          OpenRouter API Key
        </label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenRouter API key"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Prompt Input */}
      <div className="mb-6">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
          Processing Prompt (Optional)
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to do with the image (e.g., 'Make this image more colorful and vibrant' or 'Transform this into a cartoon style')"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
        >
          <Upload className="w-5 h-5 text-purple-600" />
          <span className="text-purple-600 font-medium">
            {selectedImage ? selectedImage.name : 'Click to upload an image'}
          </span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {/* Image Preview and Processing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Original Image */}
        {previewUrl && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileImage className="w-5 h-5" />
              Original Image
            </h3>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Original"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        )}

        {/* Processed/Transformed Image */}
        {processedImageUrl && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileImage className="w-5 h-5" />
              Transformed Image
            </h3>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <img
                src={processedImageUrl}
                alt="Transformed"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={processImage}
          disabled={!selectedImage || !apiKey.trim() || isProcessing}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
            </>
          ) : (
            <>
              <FileImage className="w-5 h-5" />
              Transform Image
            </>
          )}
        </button>

        {processedImageUrl && (
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Result
          </button>
        )}

        {(selectedImage || processedImageUrl) && (
          <button
            onClick={resetComponent}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Enter your OpenRouter API key</li>
          <li>Optionally add a custom prompt for processing</li>
          <li>Upload an image (JPG, PNG, etc.)</li>
          <li>Click "Transform Image" to process with Google's Nano Banana AI</li>
          <li>Download the transformed result</li>
        </ol>
      </div>
    </div>
  );
};

export default OpenRouterNanoBanana;
