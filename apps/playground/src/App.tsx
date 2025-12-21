
import React, { useState } from 'react';
import { Button, Card, Input, Textarea, Alert } from '@ui/core';
import { SaveIcon } from '@ui/icons';

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
        <Textarea placeholder="Multiline text area" style={{ marginTop: 10 }} />
        <Button onClick={handleClick} style={{ marginTop: 10 }}>
          <SaveIcon style={{ width: 16, height: 16, marginRight: 8 }} />
          Save
        </Button>
        {alertVisible && <Alert variant="success" style={{ marginTop: 10 }}>
          Saved successfully!
        </Alert>}
      </Card>
    </div>
  );
}
