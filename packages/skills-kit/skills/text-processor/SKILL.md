---
name: text-processor
description: Processes and transforms text including case conversion, reversal, and counting operations. Use when you need to convert text case, reverse text, or count words and characters.
metadata:
  category: text
  version: "1.0.0"
  tags:
    - text
    - processing
    - transformation
  owner: skills-kit-team
  originalSource: https://github.com/your-org/skills-kit
---

# Text Processor

This skill processes and transforms text using various operations. It supports multiple text manipulation operations including case conversion, reversal, and counting operations.

## When to Use

Use this skill when you need to:

- Convert text case (uppercase, lowercase, capitalize)
- Reverse text
- Count words or characters in text
- Perform basic text transformations

## Supported Operations

- **uppercase** - Convert all characters to uppercase
- **lowercase** - Convert all characters to lowercase
- **reverse** - Reverse the order of all characters
- **word-count** - Count the number of words in the text
- **char-count** - Count the number of characters in the text
- **capitalize** - Capitalize the first letter and lowercase the rest

## Parameters

### Required Parameters

- **text** (string) - The text to process
- **operation** (string) - The operation to perform. Must be one of: `uppercase`, `lowercase`, `reverse`, `word-count`, `char-count`, `capitalize`

### Optional Parameters

- **options** (object) - Additional options for the operation (currently unused)

## Output

The skill returns a markdown-formatted result containing:

- The operation performed
- The original text
- The processed result

## Examples

### Example 1: Convert to Uppercase

**Input:**
```json
{
  "text": "Hello World",
  "operation": "uppercase"
}
```

**Output:**
```markdown
# Text Processing Result

**Operation:** uppercase
**Original Text:** Hello World
**Result:**

```
HELLO WORLD
```
```

### Example 2: Count Words

**Input:**
```json
{
  "text": "Hello World",
  "operation": "word-count"
}
```

**Output:**
```markdown
# Text Processing Result

**Operation:** word-count
**Original Text:** Hello World
**Result:**

```
2
```
```

## Error Handling

- **Unknown operation**: If an invalid operation is provided, the skill will return an error: "Unknown operation: {operation}"

## Notes

- Word count splits text by whitespace and filters out empty strings
- Character count includes all characters including spaces
- Reverse operation reverses the entire string character by character
- Capitalize operation capitalizes only the first character and lowercases the rest
