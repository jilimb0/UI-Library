import { useState, FormEvent } from "react"
import { Form, Field, Input, Button } from "@ui/core"

export function AuthExample() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (data: Record<string, any>) => {
    // data содержит { email: "...", password: "..." }
    alert(`Email: ${data.email}, Password: ${data.password}`)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field label="Email">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>
      <Field label="Password">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Field>
      <Button type="submit">Login</Button>
    </Form>
  )
}
