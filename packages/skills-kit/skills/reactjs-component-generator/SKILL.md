---
name: reactjs-component-generator
description: Generates React component code with TypeScript types, including props definitions, styling examples, and test examples. Use when generating React component boilerplate, creating TypeScript-typed components, or adding prop definitions.
metadata:
  category: reactjs
  version: "1.0.0"
  tags:
    - react
    - component
    - generator
    - typescript
    - code-generation
  owner: skills-kit-team
  originalSource: https://github.com/your-org/skills-kit
---

# React Component Generator

This skill generates React component code in markdown format with TypeScript types, including props definitions, optional styling examples, and test examples.

## When to Use

Use this skill when you need to:
- Generate React component boilerplate code
- Create TypeScript-typed React components
- Generate functional or class components
- Include prop type definitions
- Add styling and test examples

## Usage

### Basic Component Generation

Generate a simple functional component:

**Input:**
- Component name: `Button`
- Component type: `functional`
- Props: `[{ name: "label", type: "string", required: true }, { name: "onClick", type: "() => void", required: false }]`

**Output:** Complete React component code in markdown format with TypeScript types.

### Advanced Component Generation

Generate a component with styling and tests:

**Input:**
- Component name: `Card`
- Component type: `functional`
- Props: `[{ name: "title", type: "string", required: true }, { name: "children", type: "ReactNode", required: false }]`
- Include styles: `true`
- Include tests: `true`

**Output:** Complete component with TypeScript types, CSS styling example, and test examples.

## Component Types

### Functional Components

Functional components are the recommended approach in modern React. They use hooks for state and lifecycle management.

**Example Output:**

```tsx
import { FC } from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};
```

### Class Components

Class components use the traditional React component class syntax. Use when you need specific class component features.

**Example Output:**

```tsx
import { Component } from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

interface ButtonState {}

export class Button extends Component<ButtonProps, ButtonState> {
  render() {
    const { label, onClick } = this.props;
    return (
      <button onClick={onClick}>
        {label}
      </button>
    );
  }
}
```

## Props Definition

Props are defined using TypeScript interfaces with the following structure:

- **name**: Prop name (camelCase)
- **type**: TypeScript type (e.g., `string`, `number`, `ReactNode`, `() => void`)
- **required**: Boolean indicating if the prop is required

**Example:**

```tsx
interface CardProps {
  title: string;           // Required prop
  description?: string;    // Optional prop
  onClick: () => void;     // Required function prop
  variant?: 'primary' | 'secondary';  // Optional enum prop
}
```

## Styling Options

When `includeStyles` is enabled, the generator includes CSS styling examples:

```css
.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}
```

## Testing Examples

When `includeTests` is enabled, the generator includes test examples using React Testing Library:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Complete Example

### Input Parameters

```json
{
  "componentName": "UserCard",
  "componentType": "functional",
  "props": [
    { "name": "name", "type": "string", "required": true },
    { "name": "email", "type": "string", "required": true },
    { "name": "avatar", "type": "string", "required": false },
    { "name": "onClick", "type": "() => void", "required": false }
  ],
  "includeStyles": true,
  "includeTests": true,
  "description": "A card component displaying user information"
}
```

### Generated Output

The generator will produce a complete markdown document containing:

1. **Component Code** - Full TypeScript React component
2. **Styling** - CSS example (if requested)
3. **Tests** - Test examples (if requested)
4. **Usage** - Example usage code

## Best Practices

When generating components:

1. **Use TypeScript** - Always define prop types
2. **Keep components focused** - Single responsibility principle
3. **Use descriptive prop names** - Clear, self-documenting code
4. **Include default values** - For optional props when appropriate
5. **Consider accessibility** - Add ARIA attributes when needed

## Common Prop Types

- `string` - Text values
- `number` - Numeric values
- `boolean` - True/false values
- `ReactNode` - Any renderable React content
- `() => void` - Event handlers
- `'option1' | 'option2'` - Union types for enums
- `Array<T>` - Arrays of specific types
- `Record<string, unknown>` - Object types

## Examples

### Example 1: Simple Button Component

```tsx
import { FC } from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};
```

### Example 2: Complex Card Component

```tsx
import { FC, ReactNode } from "react";

interface CardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  onAction?: () => void;
}

export const Card: FC<CardProps> = ({
  title,
  description,
  children,
  variant = 'default',
  onAction,
}) => {
  return (
    <div className={`card card-${variant}`}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
};
```
