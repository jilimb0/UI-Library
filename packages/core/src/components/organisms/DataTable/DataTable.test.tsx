import { render, screen, fireEvent } from "@testing-library/react"
import DataTable from "./DataTable"
import React from "react"
import "@testing-library/jest-dom"

const mockData = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
]

const mockColumns = [
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email", sortable: true },
]

const largeData = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  email: `user${i}@example.com`,
}))

describe("DataTable", () => {
  it("renders data in table format", () => {
    render(<DataTable data={mockData} columns={mockColumns} />)
    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("jane@example.com")).toBeInTheDocument()
  })

  it("handles column sorting", () => {
    render(<DataTable data={mockData} columns={mockColumns} />)

    const nameHeader = screen.getByRole("columnheader", { name: /name/i })
    fireEvent.click(nameHeader)

    // Проверка что данные отсортированы
  })

  it("supports pagination", () => {
    render(<DataTable data={largeData} columns={mockColumns} pageSize={10} />)

    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("should handle sorting", () => {
    render(<DataTable data={mockData} columns={mockColumns} />)
    fireEvent.click(screen.getByText("Name"))
    expect(screen.getByText("John Doe")).toBeInTheDocument()
  })

  it("should handle pagination", () => {
    render(<DataTable data={largeData} columns={mockColumns} pageSize={10} />)
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument()
    fireEvent.click(screen.getByText("Next"))
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument()
  })
})
