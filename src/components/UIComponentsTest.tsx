import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function UIComponentsTest(): React.ReactElement {
  const [isEnabled, setIsEnabled] = React.useState(false);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>UI Components Test</CardTitle>
        <CardDescription>Testing shadcn/ui components from Claudia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="airplane-mode"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
            <Label htmlFor="airplane-mode">Enable feature</Label>
          </div>
          <Button onClick={() => alert('Button clicked!')}>
            Test Button
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
