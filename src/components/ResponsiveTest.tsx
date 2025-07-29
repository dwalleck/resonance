import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function ResponsiveTest(): React.ReactElement {
  return (
    <div
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="responsive-grid"
    >
      <Card>
        <CardHeader>
          <CardTitle>Responsive Grid</CardTitle>
          <CardDescription>1 column on mobile</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This card layout adapts to different screen sizes.
          </p>
        </CardContent>
      </Card>

      <Card className="hidden sm:block" data-testid="tablet-card">
        <CardHeader>
          <CardTitle>Tablet & Desktop</CardTitle>
          <CardDescription>2 columns on tablet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This card is hidden on mobile devices.
          </p>
        </CardContent>
      </Card>

      <Card className="hidden lg:block" data-testid="desktop-card">
        <CardHeader>
          <CardTitle>Desktop Only</CardTitle>
          <CardDescription>3 columns on desktop</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This card only appears on large screens.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
