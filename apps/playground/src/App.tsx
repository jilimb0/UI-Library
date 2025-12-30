
import { useState } from 'react';
import { Button, Card, Input, TextArea, Alert } from '@ui/core';

export function App() {
  const [inputValue, setInputValue] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  const handleClick = () => {
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter some text..."
        />
        <TextArea placeholder="Multiline text area" style={{ marginTop: 10 }} />
        <Button onClick={handleClick} style={{ marginTop: 10 }}>
          <img style={{ width: 16, height: 16, marginRight: 8 }} src='../../../public/icons/action/SaveIcon'  />
          Save
        </Button>
        {alertVisible && <Alert variant="success" style={{ marginTop: 10 }}>
          Saved successfully!
        </Alert>}
      </Card>
    </div>
  );
}
