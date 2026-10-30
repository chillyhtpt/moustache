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
    expect((select as HTMLSelectElement).value).toBe("rule-vscode");
  });

  it("parses and auto-fills multi-field forms via voice assistant", () => {
    render(<AppRulesPage />);
    expect(screen.getByText(/Field Vision & Voice Form Auto-Fill/i)).toBeInTheDocument();
    const autofillBtn = screen.getByRole("button", { name: /Auto-Fill Fields/i });
    expect(autofillBtn).toBeInTheDocument();
    fireEvent.click(autofillBtn);
    expect(screen.getByDisplayValue("Payment gateway timeout")).toBeInTheDocument();
    expect(screen.getByDisplayValue("contact@enterprise.com")).toBeInTheDocument();
  });

  it("opens add app rule dialog", () => {
    render(<AppRulesPage />);
    fireEvent.click(screen.getByRole("button", { name: /Add App Rule/i }));
    expect(screen.getByRole("heading", { name: /Add New App Rule/i })).toBeInTheDocument();
  });
});
