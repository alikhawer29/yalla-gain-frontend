const MySelectComponent = () => {
    // Define state to keep track of the selected value
    const [selectedOption, setSelectedOption] = useState('');
  
    // Define the options for the select dropdown
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];
  
    // Event handler to update the selected value
    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    };
  
    return (
      <div>
        <h2>Select an option:</h2>
        <select value={selectedOption} onChange={handleSelectChange}>
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p>Selected Option: {selectedOption}</p>
      </div>
    );
  };
  
  export default MySelectComponent;