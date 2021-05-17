# Change Log

All notable changes will be documented in this file.

## 2.0.0 - 2021-05-17

### BREAKING

- When encountering unknown block types, the serializer will no longer throw by default - instead if will render a hidden `div` with a message noting that a serializer is missing. A message will also be logged to the console. To use the old behavior of throwing un known types, pass `ignoreUnknownTypes: false` as a property.
- The `markFallback` serializer has been renamed to `unknownMark` to align with the new `unknownType` serializer for blocks.
