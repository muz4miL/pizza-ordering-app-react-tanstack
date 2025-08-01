# 🧪 Complete React Testing Guide - Your Personal Reference

## 📋 Table of Contents

1. [Testing Setup & Tools](#testing-setup--tools)
2. [Component Testing (Unit Tests)](#component-testing-unit-tests)
3. [Integration Testing (User Flows)](#integration-testing-user-flows)
4. [Custom Hook Testing](#custom-hook-testing)
5. [API Mocking Patterns](#api-mocking-patterns)
6. [Test Coverage](#test-coverage)
7. [Industry Best Practices](#industry-best-practices)
8. [Common Patterns & Templates](#common-patterns--templates)

---

## 🛠️ Testing Setup & Tools

### **Essential Dependencies:**

```json
{
  "devDependencies": {
    "vitest": "^2.1.3",
    "@testing-library/react": "^16.0.1",
    "vitest-fetch-mock": "^0.3.0",
    "@vitest/coverage-v8": "^2.1.3",
    "happy-dom": "^15.7.4"
  }
}
```

### **Package.json Scripts:**

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

### **Vite Config Setup:**

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/setupTests.js"],
  },
});
```

---

## 🧩 Component Testing (Unit Tests)

### **Basic Component Test Template:**

```jsx
import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import ComponentName from "../ComponentName";

test("should render component correctly", () => {
  // ARRANGE: Set up test data
  const props = {
    name: "Test Name",
    description: "Test Description",
  };

  // ACT: Render the component
  const screen = render(<ComponentName {...props} />);

  // ASSERT: Check expected behavior
  expect(screen.getByText("Test Name")).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute("alt", "Test Name");
});
```

### **Testing Props and Attributes:**

```jsx
test("renders pizza with correct props", () => {
  const props = {
    name: "Margherita",
    description: "Classic pizza",
    image: "https://example.com/pizza.jpg",
  };

  const screen = render(<Pizza {...props} />);

  // Test text content
  expect(screen.getByRole("heading")).toHaveTextContent("Margherita");
  expect(screen.getByText("Classic pizza")).toBeInTheDocument();

  // Test image attributes
  const img = screen.getByRole("img");
  expect(img).toHaveAttribute("src", props.image);
  expect(img).toHaveAttribute("alt", props.name);
});
```

### **Testing Conditional Rendering:**

```jsx
test("shows fallback image when no image provided", () => {
  const screen = render(<Pizza name="Test" description="Test" />);

  const img = screen.getByRole("img");
  expect(img.src).not.toBe("");
  expect(img.src).toContain("picsum.photos"); // Or your fallback URL
});
```

---

## 🔗 Integration Testing (User Flows)

### **Form Submission Test Template:**

```jsx
import { fireEvent, render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

test("can submit form successfully", async () => {
  // ARRANGE: Mock API response
  fetchMocker.mockResponseOnce(JSON.stringify({ status: "ok" }));

  const queryClient = new QueryClient();
  const screen = render(
    <QueryClientProvider client={queryClient}>
      <ContactForm />
    </QueryClientProvider>
  );

  // ACT: Fill out form
  const nameInput = screen.getByPlaceholderText("name");
  const emailInput = screen.getByPlaceholderText("email");
  const messageInput = screen.getByPlaceholderText("message");

  fireEvent.change(nameInput, { target: { value: "John Doe" } });
  fireEvent.change(emailInput, { target: { value: "john@example.com" } });
  fireEvent.change(messageInput, { target: { value: "Hello world" } });

  const submitButton = screen.getByRole("button");
  fireEvent.click(submitButton);

  // ASSERT: Check success state
  const successMessage = await screen.findByText("Submitted!");
  expect(successMessage).toBeInTheDocument();
});
```

### **API Call Verification:**

```jsx
test("makes correct API call", async () => {
  fetchMocker.mockResponseOnce(JSON.stringify({ status: "ok" }));

  // ... form submission code ...

  // Verify API was called correctly
  const requests = fetchMocker.requests();
  expect(requests.length).toBe(1);
  expect(requests[0].url).toBe("/api/contact");
  expect(requests[0].method).toBe("POST");

  // Verify request body
  const requestBody = JSON.parse(requests[0].body);
  expect(requestBody).toEqual({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello world",
  });
});
```

---

## 🪝 Custom Hook Testing

### **Hook Testing Template:**

```jsx
import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { useCustomHook } from "../useCustomHook";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

// Helper function to test hooks
function renderHook(hookFn) {
  let result;

  function TestComponent() {
    result = hookFn();
    return null;
  }

  render(<TestComponent />);
  return result;
}

test("hook returns initial state", () => {
  fetchMocker.mockResponseOnce(JSON.stringify({ data: "test" }));

  const result = renderHook(() => useCustomHook());

  expect(result).toBeNull(); // or whatever initial state
});
```

### **Testing Hook State Changes:**

```jsx
test("hook updates state after API call", async () => {
  const mockData = { id: 1, name: "Test Data" };
  fetchMocker.mockResponseOnce(JSON.stringify(mockData));

  let result;
  function TestComponent() {
    result = useCustomHook();
    return <div>{result ? result.name : "Loading"}</div>;
  }

  const screen = render(<TestComponent />);

  // Initially loading
  expect(screen.getByText("Loading")).toBeInTheDocument();

  // After API call
  await screen.findByText("Test Data");
  expect(result).toEqual(mockData);
});
```

---

## 🌐 API Mocking Patterns

### **Basic Fetch Mocking:**

```jsx
import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

// Mock successful response
fetchMocker.mockResponseOnce(JSON.stringify({ success: true }));

// Mock error response
fetchMocker.mockRejectOnce(new Error("API Error"));

// Mock multiple responses
fetchMocker
  .mockResponseOnce(JSON.stringify({ data: "first" }))
  .mockResponseOnce(JSON.stringify({ data: "second" }));
```

### **Advanced Mocking Patterns:**

```jsx
// Mock based on URL
fetchMocker.mockResponse((req) => {
  if (req.url.endsWith("/api/users")) {
    return Promise.resolve(JSON.stringify([{ id: 1, name: "John" }]));
  }
  if (req.url.endsWith("/api/posts")) {
    return Promise.resolve(JSON.stringify([{ id: 1, title: "Post" }]));
  }
  return Promise.reject(new Error("Unknown endpoint"));
});

// Mock with delay
fetchMocker.mockResponseOnce(JSON.stringify({ data: "delayed" }), {
  status: 200,
  delay: 1000,
});
```

---

## 📊 Test Coverage

### **Running Coverage:**

```bash
# Basic coverage
npm run coverage

# Coverage with UI
npm install -D @vitest/ui
npm run test:ui

# Coverage thresholds in vite.config.js
export default defineConfig({
  test: {
    coverage: {
      threshold: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        }
      }
    }
  }
});
```

### **Coverage Interpretation:**

- **Statements**: Lines of code executed
- **Branches**: if/else paths taken
- **Functions**: Functions called
- **Lines**: Physical lines hit

**Industry Standards:**

- 80-90% statements: Excellent
- 70-80% branches: Good
- 100%: Usually overkill

---

## 🏆 Industry Best Practices

### **What TO Test (Priority Order):**

1. **Critical User Flows** - Login, checkout, form submissions
2. **Business Logic** - Calculations, validations, transformations
3. **Error Handling** - API failures, invalid inputs
4. **Component Props** - Correct rendering with different props
5. **User Interactions** - Clicks, form inputs, navigation

### **What NOT to Test:**

- Third-party libraries (React, TanStack Query)
- Simple getters/setters
- Styling/CSS (unless critical)
- Auto-generated code
- Obvious implementations

### **Testing Pyramid:**

```
    /\     E2E Tests (Few)
   /  \    - Full user journeys
  /____\   - Browser automation
 /      \
/        \  Integration Tests (Some)
\_________\ - Component + API
|        |  - User interactions
|        |
|________| Unit Tests (Many)
          - Individual functions
          - Component rendering
          - Pure logic
```

---

## 📝 Common Patterns & Templates

### **AAA Pattern (Always Use):**

```jsx
test("description of what you're testing", () => {
  // ARRANGE: Set up test data and conditions
  const props = { name: "test" };

  // ACT: Perform the action you're testing
  const screen = render(<Component {...props} />);

  // ASSERT: Verify the expected outcome
  expect(screen.getByText("test")).toBeInTheDocument();
});
```

### **Common Test Selectors:**

```jsx
// By role (preferred)
screen.getByRole("button");
screen.getByRole("heading", { level: 1 });
screen.getByRole("img");
screen.getByRole("textbox");

// By text
screen.getByText("Submit");
screen.getByText(/submit/i); // case insensitive

// By placeholder
screen.getByPlaceholderText("Enter email");

// By test id (last resort)
screen.getByTestId("submit-button");

// Async queries (for things that appear later)
await screen.findByText("Success!");
```

### **Event Simulation:**

```jsx
import { fireEvent } from "@testing-library/react";

// Form inputs
fireEvent.change(input, { target: { value: "new value" } });

// Button clicks
fireEvent.click(button);

// Form submission
fireEvent.submit(form);

// Keyboard events
fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
```

### **Async Testing:**

```jsx
// Wait for element to appear
const element = await screen.findByText("Loaded");

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText("Loading"));

// Custom wait conditions
await waitFor(() => {
  expect(screen.getByText("Success")).toBeInTheDocument();
});
```

---

## 🚀 Quick Reference Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run coverage

# Run specific test file
npx vitest Pizza.test.jsx

# Run tests matching pattern
npx vitest --run contact

# Debug mode
npx vitest --inspect-brk
```

---

## 💡 Pro Tips

1. **Write tests as you code** - Don't leave testing for the end
2. **Test behavior, not implementation** - Focus on what users see/do
3. **One assertion per test** - Keep tests focused and simple
4. **Use descriptive test names** - "should show error when email is invalid"
5. **Mock external dependencies** - Don't rely on real APIs in tests
6. **Clean up after tests** - Use cleanup functions to prevent test interference
7. **Test edge cases** - Empty states, error conditions, boundary values

---

## 📚 Your Learning Journey Summary

### **Types of Tests You Mastered:**

1. **Component Testing (Pizza.test.jsx)**

   - Testing props and rendering
   - Image attributes and fallbacks
   - Basic DOM queries

2. **Integration Testing (contact.lazy.test.jsx)**

   - Form submissions with user interactions
   - API mocking with fetch-mock
   - Async state changes and success messages
   - TanStack Query provider testing

3. **Custom Hook Testing (usePizzaOfTheDay.test.jsx)**

   - Testing hooks through wrapper components
   - Initial state verification
   - API integration with hooks

4. **Snapshot Testing (cart.test.jsx)**
   - HTML output comparison (decided to skip - good choice!)

### **Key Concepts You Learned:**

- **AAA Pattern**: Arrange, Act, Assert
- **Mocking**: Preventing real API calls in tests
- **Async Testing**: Waiting for state changes
- **Event Simulation**: fireEvent for user interactions
- **Test Coverage**: Measuring how much code is tested
- **Industry Standards**: 80-90% coverage is the sweet spot

---

**Remember**: Good tests give you confidence to refactor and catch bugs before users do. Focus on testing the critical paths that matter to your users! 🎯✨

---

_Created during your React Testing learning session - July 2025_
_Keep this as your go-to reference for all future React testing!_
