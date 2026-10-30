import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppRulesPage } from "./AppRulesPage";

describe("AppRulesPage", () => {
  it("renders the app-specific behaviour header and default rules", () => {
    render(<AppRulesPage />);
    expect(screen.getByRole("heading", { name: /App-Specific Behaviour/i })).toBeInTheDocument();
    expect(screen.getByText("Slack")).toBeInTheDocument();
    expect(screen.getByText("VS Code / Cursor")).toBeInTheDocument();
    expect(screen.getByText("Gmail / Mail")).toBeInTheDocument();
  });

  it("updates simulated output when picking different app profiles", () => {
    render(<AppRulesPage />);
    const select = screen.getByLabelText(/Target App Profile:/i);
    expect(screen.getByText(/Transformed Paste Output:/i)).toBeInTheDocument();
    fireEvent.change(select, { target: { value: "rule-vscode" } });
  });

  it("opens add app rule dialog", () => {
    render(<AppRulesPage />);
    fireEvent.click(screen.getByRole("button", { name: /Add App Rule/i }));
    expect(screen.getByRole("heading", { name: /Add New App Rule/i })).toBeInTheDocument();
  });
});
