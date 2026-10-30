import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UpgradeManagerPage } from "./UpgradeManagerPage";

describe("UpgradeManagerPage", () => {
  it("renders the upgrade manager and version details", () => {
    render(<UpgradeManagerPage />);
    expect(screen.getByRole("heading", { name: /Upgrade Manager/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Check for Updates/i })).toBeInTheDocument();
    expect(screen.getByText(/Release Versions/i)).toBeInTheDocument();
  });

  it("checks for updates when clicking the check button", () => {
    render(<UpgradeManagerPage />);
    const checkBtn = screen.getByRole("button", { name: /Check for Updates/i });
    expect(checkBtn).toBeInTheDocument();
    fireEvent.click(checkBtn);
    expect(screen.getByText(/Checking for updates/i)).toBeInTheDocument();
  });

  it("allows selecting a release channel", () => {
    render(<UpgradeManagerPage />);
    const channelSelect = screen.getByLabelText(/Release Channel:/i);
    expect(channelSelect).toBeInTheDocument();
    fireEvent.change(channelSelect, { target: { value: "beta" } });
    expect((channelSelect as HTMLSelectElement).value).toBe("beta");
  });
});
