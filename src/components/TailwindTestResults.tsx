import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react';
import {
  testCSSVariables,
  testResponsiveClasses,
  testThemeSwitch,
} from '../utils/test-css-variables';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function TailwindTestResults(): React.ReactElement {
  const [cssVarResults, setCssVarResults] = React.useState<Record<string, boolean>>({});
  const [responsiveResults, setResponsiveResults] = React.useState<Record<string, boolean>>({});
  const [themeTestResult, setThemeTestResult] = React.useState<
    {
      initial: string;
      afterToggle: string;
      success: boolean;
    } | null
  >(null);

  React.useEffect(() => {
    // Run tests after component mounts
    setCssVarResults(testCSSVariables());
    setResponsiveResults(testResponsiveClasses());
  }, []);

  const runThemeTest = (): void => {
    const result = testThemeSwitch();
    setThemeTestResult(result);

    // Switch back after 2 seconds
    setTimeout(() => {
      const toggle = document.querySelector('[aria-label*="Switch to"]') as HTMLButtonElement;
      if (toggle) {
        toggle.click();
      }
    }, 2000);
  };

  const cssVarsPassed = Object.values(cssVarResults).filter(Boolean).length;
  const cssVarsTotal = Object.keys(cssVarResults).length;
  const responsivePassed = Object.values(responsiveResults).filter(Boolean).length;
  const responsiveTotal = Object.keys(responsiveResults).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CSS Variables Test</CardTitle>
          <CardDescription>
            {cssVarsPassed}/{cssVarsTotal} variables defined
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(cssVarResults).map(([variable, passed]) => (
              <div key={variable} className="flex items-center gap-2">
                {passed
                  ? <CheckCircle className="h-4 w-4 text-green-500" />
                  : <XCircle className="h-4 w-4 text-red-500" />}
                <span className={passed ? 'text-green-600' : 'text-red-600'}>
                  {variable}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Responsive Classes Test</CardTitle>
          <CardDescription>
            {responsivePassed}/{responsiveTotal} responsive classes found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(responsiveResults).map(([className, found]) => (
              <div key={className} className="flex items-center gap-2">
                {found
                  ? <CheckCircle className="h-4 w-4 text-green-500" />
                  : <XCircle className="h-4 w-4 text-red-500" />}
                <span className={found ? 'text-green-600' : 'text-red-600'}>
                  {className}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme Switching Test</CardTitle>
          <CardDescription>Test theme toggle functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <button
            onClick={runThemeTest}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            Run Theme Test
          </button>
          {themeTestResult && (
            <div className="mt-4 space-y-2">
              <p>Initial theme: {themeTestResult.initial}</p>
              <p>After toggle: {themeTestResult.afterToggle}</p>
              <p className="flex items-center gap-2">
                Result: {themeTestResult.success
                  ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Success</span>
                    </>
                  )
                  : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">Failed</span>
                    </>
                  )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
