---
name: reactjs-best-practices
description: Provides React.js best practices, patterns, and recommendations for building high-quality React applications. Use when you need guidance on hooks, performance optimization, state management, component design, or testing.
metadata:
  category: reactjs
  version: "1.0.0"
  tags:
    - react
    - best-practices
    - patterns
    - guidelines
    - typescript
  owner: skills-kit-team
  originalSource: https://github.com/your-org/skills-kit
---

# React.js Best Practices

This skill provides comprehensive React.js best practices, patterns, and recommendations to help you build high-quality, maintainable React applications.

## When to Use

Use this skill when you need guidance on:

- React hooks patterns and best practices
- Performance optimization techniques
- State management strategies
- Component design principles
- Testing approaches
- Code organization and architecture

## Topics Covered

### 1. React Hooks Best Practices

#### Rules of Hooks

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call hooks from React function components or custom hooks
3. **Use exhaustive-deps rule** - Always include all dependencies in useEffect, useMemo, and useCallback

#### Common Hooks Patterns

**useState**

- Use functional updates when the new state depends on the previous state
- Initialize state with a function if the initial value is expensive to compute

```tsx
// ✅ Good: Functional update
const [count, setCount] = useState(0);
setCount((prev) => prev + 1);

// ✅ Good: Expensive initial state
const [data, setData] = useState(() => expensiveComputation());
```

**useEffect**

- Always specify dependencies
- Clean up side effects (subscriptions, timers) in the return function
- Use separate effects for unrelated concerns

```tsx
// ✅ Good: useEffect with cleanup
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, [deps]);

// ❌ Bad: Missing dependencies
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId dependency

// ✅ Good: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

**useMemo & useCallback**

- Only use when you have a performance problem
- Don't memoize everything - it has its own cost
- useMemo for expensive calculations
- useCallback for functions passed to memoized children

```tsx
// ✅ Good: Memoize expensive calculation
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// ✅ Good: Memoize callback for memoized child
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 2. Performance Optimization

#### Best Practices

1. **Use React.memo wisely** - Memoize components that render frequently with the same props
2. **Code splitting** - Use React.lazy() and Suspense for route-based code splitting
3. **Virtualize long lists** - Use libraries like react-window for long lists
4. **Avoid inline object/function creation** - Creates new references on every render
5. **Use production builds** - Always use production builds for deployment

#### Optimization Techniques

**Memoization**

```tsx
// ✅ Good: Memoized component
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* render */}</div>;
});

// ❌ Bad: Inline object creation
<Component style={{ color: "red" }} />;

// ✅ Good: Extract to constant
const styles = { color: "red" };
<Component style={styles} />;
```

**Code Splitting**

```tsx
// ✅ Good: Code splitting
const LazyComponent = React.lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 3. State Management

#### Guidelines

1. **Lift state up** - Share state between components by lifting it to their common ancestor
2. **Keep state local** - Don't make state global unless necessary
3. **Use appropriate state management** - useState for local, Context for shared, Redux for complex
4. **Normalize state shape** - Keep state normalized and flat when possible
5. **Avoid prop drilling** - Use Context API or state management library for deep prop passing

#### Patterns

**Local State (useState)**

- Use for component-specific state
- Keep it simple and local

**Context API**

- Use for theme, auth, user preferences
- Split contexts by concern
- Avoid overusing Context

```tsx
// ✅ Good: Lifted state
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Child1 count={count} />
      <Child2 setCount={setCount} />
    </>
  );
}

// ✅ Good: Context for shared state
const ThemeContext = createContext();
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 4. Component Design

#### Principles

1. **Single Responsibility** - Each component should do one thing well
2. **Composition over Inheritance** - Use composition to build complex UIs
3. **Keep components small** - Aim for components under 200 lines
4. **Use TypeScript** - Type your props and state
5. **Extract reusable logic** - Create custom hooks for shared logic

#### Patterns

**Container/Presentational Pattern**

- Container: Handles data fetching and state
- Presentational: Handles UI rendering

**Custom Hooks**

```tsx
// ✅ Good: Custom hook for reusable logic
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount((c) => c + 1);
  return { count, increment };
}
```

**TypeScript Props**

```tsx
// ✅ Good: TypeScript props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
}
```

### 5. Testing

#### Guidelines

1. **Test user behavior, not implementation** - Test what users see and do
2. **Use React Testing Library** - Prefer over Enzyme
3. **Test accessibility** - Ensure components are accessible
4. **Mock external dependencies** - Mock API calls, timers, etc.
5. **Keep tests simple** - One assertion per test when possible

#### Examples

```tsx
// ✅ Good: Test user behavior
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

test("increments counter when clicked", () => {
  render(<Button onClick={increment} />);
  const button = screen.getByRole("button");
  fireEvent.click(button);
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});

// ✅ Good: Test accessibility
test("button is accessible", () => {
  render(<Button aria-label="Submit" />);
  expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
});
```

## Additional Resources

- [React Documentation](https://react.dev)
- [React Patterns](https://reactpatterns.com)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)
- [React Testing Library](https://testing-library.com/react)

## Examples

### Example 1: Proper Hook Usage

```tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      setLoading(true);
      const data = await getUser(userId);
      if (!cancelled) {
        setUser(data);
        setLoading(false);
      }
    }

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

### Example 2: Performance Optimization

```tsx
const ExpensiveList = React.memo(({ items }: { items: Item[] }) => {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.priority - b.priority);
  }, [items]);

  return (
    <ul>
      {sortedItems.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});
```
