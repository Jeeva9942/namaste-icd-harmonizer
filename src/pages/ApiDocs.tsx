import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Server, Database, Zap } from "lucide-react";

const ApiDocs = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">API Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive documentation for AyuBridge Health API endpoints and integration guide.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="sdks">SDKs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-6 w-6" />
                  API Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The AyuBridge Health API provides programmatic access to our NAMASTE to ICD-11 conversion services. 
                  Our RESTful API is designed for easy integration with your existing healthcare systems.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Base URL</h4>
                    <code className="bg-muted px-2 py-1 rounded text-sm">https://api.ayubridge.health/v1</code>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Authentication</h4>
                    <Badge variant="outline">Bearer Token</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Key Features</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h5 className="font-semibold">Real-time Processing</h5>
                        <p className="text-sm text-muted-foreground">Instant code conversion</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h5 className="font-semibold">Batch Processing</h5>
                        <p className="text-sm text-muted-foreground">Handle large datasets</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Code className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h5 className="font-semibold">FHIR Compliance</h5>
                        <p className="text-sm text-muted-foreground">Standard-compliant output</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-green-500">POST</Badge>
                    /convert/single
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Convert a single NAMASTE code to ICD-11</p>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold mb-2">Request Body</h5>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "namaste_code": "A001.01",
  "description": "Fever due to Pitta imbalance"
}`}
                      </pre>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Response</h5>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "icd11_code": "1C62.Z",
    "icd11_description": "Fever, unspecified",
    "confidence": 0.92,
    "mapping_type": "TM2"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-green-500">POST</Badge>
                    /convert/batch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Convert multiple NAMASTE codes in a single request</p>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold mb-2">Request Body</h5>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "codes": [
    {
      "namaste_code": "A001.01",
      "description": "Fever due to Pitta imbalance"
    },
    {
      "namaste_code": "B002.03",
      "description": "Digestive disorder"
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-blue-500">GET</Badge>
                    /mapping/{"{code}"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Retrieve mapping details for a specific NAMASTE code</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">JavaScript (Node.js)</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`const axios = require('axios');

const convertCode = async (namasteCode) => {
  try {
    const response = await axios.post(
      'https://api.ayubridge.health/v1/convert/single',
      {
        namaste_code: namasteCode,
        description: 'Sample description'
      },
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Conversion failed:', error);
  }
};`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Python</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`import requests

def convert_code(namaste_code):
    url = "https://api.ayubridge.health/v1/convert/single"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    data = {
        "namaste_code": namaste_code,
        "description": "Sample description"
    }
    
    response = requests.post(url, json=data, headers=headers)
    return response.json()`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">cURL</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST https://api.ayubridge.health/v1/convert/single \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "namaste_code": "A001.01",
    "description": "Fever due to Pitta imbalance"
  }'`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdks" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>JavaScript SDK</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold">Installation</h5>
                      <code className="bg-muted px-2 py-1 rounded text-sm block mt-2">npm install @ayubridge/js-sdk</code>
                    </div>
                    <div>
                      <h5 className="font-semibold">Usage</h5>
                      <pre className="bg-muted p-3 rounded text-sm mt-2">
{`import AyuBridge from '@ayubridge/js-sdk';

const client = new AyuBridge('YOUR_API_KEY');
const result = await client.convert('A001.01');`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Python SDK</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold">Installation</h5>
                      <code className="bg-muted px-2 py-1 rounded text-sm block mt-2">pip install ayubridge-python</code>
                    </div>
                    <div>
                      <h5 className="font-semibold">Usage</h5>
                      <pre className="bg-muted p-3 rounded text-sm mt-2">
{`from ayubridge import AyuBridge

client = AyuBridge('YOUR_API_KEY')
result = client.convert('A001.01')`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiDocs;