import { describe, it, expect, vi } from "vitest";

import { render } from "@testing-library/react"
import React from "react"
import DataTable from "./DataTable"

const mockColumns = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
]

describe("DataTable Performance", () => {
  it("renders large datasets efficiently", () => {
    const startTime = performance.now()

    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
    }))

    render(<DataTable data={largeData} columns={mockColumns} />)

    const endTime = performance.now()
    expect(endTime - startTime).toBeLessThan(100) // < 100ms render time
  })
})
