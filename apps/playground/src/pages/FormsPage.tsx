import { useState, FormEvent } from "react"
import { Form, Field, Input, TextArea, Button } from "@ui/core"

export function FormsPage() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (data: Record<string, any>) => {
    alert(`Name: ${data.name}, Message: ${data.message}`)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Forms Examples</h2>
      <Form onSubmit={handleSubmit}>
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Message">
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Field>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  )
}
