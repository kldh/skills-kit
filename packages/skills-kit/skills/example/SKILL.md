---
name: example
description: A simple example skill that echoes back a message. Use as a demonstration or template for creating new skills, testing skill integration, or learning how skills work.
metadata:
  category: utility
  version: "1.0.0"
  tags:
    - example
    - demo
  owner: skills-kit-team
  originalSource: https://github.com/your-org/skills-kit
---

# Example Skill

This is a simple example skill that demonstrates the skill format. It takes a message as input and echoes it back in a formatted markdown response.

## When to Use

Use this skill as a demonstration or template for creating new skills. It's useful for:

- Testing skill integration
- Understanding the skill format
- Learning how skills work

## Parameters

### Required Parameters

- **message** (string) - The message to echo back

## Output

The skill returns a markdown-formatted response containing:

- The original message
- An echoed version of the message

## Examples

### Example 1: Simple Greeting

**Input:**
```json
{
  "message": "Hello, World!"
}
```

**Output:**
```markdown
# Example Skill Output

**Message:** Hello, World!

**Echo:** Hello, World!
```

## Notes

This is a demonstration skill and serves as a template for creating more complex skills.
