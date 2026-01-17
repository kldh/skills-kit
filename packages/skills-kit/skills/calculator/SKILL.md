---
name: calculator
description: Performs basic mathematical operations including addition, subtraction, multiplication, and division on two numbers. Use when you need to perform arithmetic calculations or get formatted calculation results.
metadata:
  category: math
  version: "1.0.0"
  tags:
    - math
    - calculation
    - arithmetic
  owner: skills-kit-team
  originalSource: https://github.com/your-org/skills-kit
---

# Calculator

This skill performs basic mathematical operations on two numbers. It supports addition, subtraction, multiplication, and division operations.

## When to Use

Use this skill when you need to:

- Perform basic arithmetic calculations
- Add, subtract, multiply, or divide two numbers
- Get formatted calculation results

## Supported Operations

- **add** - Add two numbers together
- **subtract** - Subtract the second number from the first
- **multiply** - Multiply two numbers
- **divide** - Divide the first number by the second (division by zero is not allowed)

## Parameters

### Required Parameters

- **operation** (string) - The operation to perform. Must be one of: `add`, `subtract`, `multiply`, `divide`
- **a** (number) - The first number
- **b** (number) - The second number

## Output

The skill returns a markdown-formatted result containing:

- The operation performed
- The input values
- The calculated result
- A formatted mathematical expression

## Examples

### Example 1: Addition

**Input:**
```json
{
  "operation": "add",
  "a": 5,
  "b": 3
}
```

**Output:**
```markdown
# Calculation Result

**Operation:** add
**Input:** 5 add 3
**Result:** 8

```
5 + 3 = 8
```
```

### Example 2: Multiplication

**Input:**
```json
{
  "operation": "multiply",
  "a": 4,
  "b": 7
}
```

**Output:**
```markdown
# Calculation Result

**Operation:** multiply
**Input:** 4 multiply 7
**Result:** 28

```
4 × 7 = 28
```
```

## Error Handling

- **Division by zero**: If attempting to divide by zero, the skill will return an error: "Division by zero is not allowed"
- **Unknown operation**: If an invalid operation is provided, the skill will return an error: "Unknown operation: {operation}"

## Notes

- All operations work with numeric values
- Division results may include decimal places
- The output is always formatted as markdown for easy display
