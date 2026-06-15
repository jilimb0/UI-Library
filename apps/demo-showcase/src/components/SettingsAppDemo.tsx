import {
  Button,
  Card,
  Heading,
  Input,
  Select,
  Switch,
} from '@ui-construction-library/core';
import { useState } from 'react';

export function SettingsAppDemo() {
  const [name, setName] = useState('Jane Doe');
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('jane@example.com');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [digest, setDigest] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '32rem' }}>
      <Card className="p-5" style={{ display: 'grid', gap: '1rem' }}>
        <Heading as="h4">Profile</Heading>
        <Input
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'editor', label: 'Editor' },
            { value: 'viewer', label: 'Viewer' },
          ]}
        />
      </Card>

      <Card className="p-5" style={{ display: 'grid', gap: '1rem' }}>
        <Heading as="h4">Notifications</Heading>
        <Switch
          label="Email notifications"
          description="Receive updates via email."
          checked={emailNotif}
          onCheckedChange={setEmailNotif}
        />
        <Switch
          label="Push notifications"
          description="Receive browser push alerts."
          checked={pushNotif}
          onCheckedChange={setPushNotif}
        />
        <Switch
          label="Weekly digest"
          description="A summary of activity every Monday."
          checked={digest}
          onCheckedChange={setDigest}
        />
      </Card>

      <div
        style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}
      >
        <Button variant="ghost">Cancel</Button>
        <Button onClick={handleSave}>
          {saved ? 'Saved!' : 'Save preferences'}
        </Button>
      </div>
    </div>
  );
}
