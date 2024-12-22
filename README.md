# SearchableDropdown

`SearchableDropdown` is a versatile React component that provides a feature-rich, searchable dropdown menu. It supports local and API-based search, multi-select, pagination, and custom rendering, making it ideal for a variety of applications.

## Installation

Install the package via npm:

```bash
npm install searchable-dropdown-component
```

## Usage

### Basic Example

```jsx
import React, { useState } from 'react';
import SearchableDropdown from 'searchable-dropdown-component';

const App = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const data = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' },
    { id: 3, label: 'Option 3' },
  ];

  return (
    <SearchableDropdown
      data={data}
      onSelect={setSelectedItem}
      placeholder="Search..."
    >
      <button>Select an option</button>
    </SearchableDropdown>
  );
};

export default App;
```

## Props

| Prop               | Type            | Default             | Description                                                                                  |
|--------------------|-----------------|---------------------|----------------------------------------------------------------------------------------------|
| `data`             | `array`        | `[]`                | The array of items to display in the dropdown.                                               |
| `onSelect`         | `function`     | `undefined`         | Callback function invoked when an item is selected.                                          |
| `placeholder`      | `string`       | `'Search...'`       | Placeholder text for the search input.                                                      |
| `children`         | `node`         | `undefined`         | Trigger element for the dropdown menu.                                                      |
| `renderItem`       | `function`     | `undefined`         | Function to render custom dropdown items.                                                   |
| `hideSearch`       | `bool`         | `false`             | Hides the search input field if `true`.                                                     |
| `multiSelect`      | `bool`         | `false`             | Enables multi-select functionality.                                                         |
| `loadingIndicator` | `node`         | `<CircularProgress>`| Custom loading indicator component.                                                         |
| `debounceDelay`    | `number`       | `400`               | Delay in milliseconds for debouncing search input.                                          |
| `dropdownWidth`    | `number|string`| `300`               | Width of the dropdown in pixels or as a string.                                             |
| `dropdownHeight`   | `number|string`| `300`               | Height of the dropdown in pixels or as a string.                                            |

## Advanced Features

### Multi-Select Example

```jsx
<SearchableDropdown
  data={data}
  onSelect={setSelectedItems}
  multiSelect={true}
>
  <button>Select multiple options</button>
</SearchableDropdown>
```

### Pagination Example

```jsx
<SearchableDropdown
  data={data}
  onSelect={setSelectedItem}
  getData={fetchData}
  pagination={true}
  totalData={500}
>
  <button>Select an option</button>
</SearchableDropdown>
```

### Custom Rendering

```jsx
<SearchableDropdown
  data={data}
  renderItem={(item) => <div>{item.label}</div>}
  renderEmptyState={() => <div>No items found!</div>}
>
  <button>Select an option</button>
</SearchableDropdown>
```

## License

This project is licensed under the MIT License.
