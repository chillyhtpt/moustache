import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MeetingPage } from "./MeetingPage";

describe("MeetingPage", () => {
  it("renders the meeting transcription header and sample meetings", () => {
    render(<MeetingPage />);
    expect(screen.getByRole("heading", { name: /Meetings & AI Notes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Record Meeting/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Import Audio/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Weekly Product & Architecture Sync/i }),
    ).toBeInTheDocument();
  });

  it("allows searching through saved meetings", () => {
    render(<MeetingPage />);
    const searchInput = screen.getByPlaceholderText(/Search meetings, notes, transcript/i);
    fireEvent.change(searchInput, { target: { value: "Sprint Review" } });
    expect(
      screen.getByRole("heading", { name: /1-on-1: Engineering Sprint Review/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Weekly Product & Architecture Sync/i)).not.toBeInTheDocument();
  });

  it("toggles action items on click", () => {
    render(<MeetingPage />);
    const actionItem = screen.getByText(/Run performance benchmarks on Vulkan backend/i);
    expect(actionItem).toBeInTheDocument();
    fireEvent.click(actionItem);
  });

  it("opens the audio file import dialog", () => {
    render(<MeetingPage />);
    fireEvent.click(screen.getByRole("button", { name: /Import Audio/i }));
    expect(
      screen.getByRole("heading", { name: /Import Audio File \(OpenWhispr\)/i }),
    ).toBeInTheDocument();
  });

  it("opens the automated post-meeting workflows dialog", () => {
    render(<MeetingPage />);
    const workflowBtn = screen.getByRole("button", { name: /Automated Workflows/i });
    expect(workflowBtn).toBeInTheDocument();
    fireEvent.click(workflowBtn);
    expect(
      screen.getByRole("heading", { name: /Automated Post-Meeting Workflows/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Follow-Up Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Slack Digest/i)).toBeInTheDocument();
  });

  it("starts a meeting directly from the upcoming calendar banner", () => {
    render(<MeetingPage />);
    const startCalBtn = screen.getByRole("button", { name: /Start Moustache Meeting/i });
    expect(startCalBtn).toBeInTheDocument();
    fireEvent.click(startCalBtn);
    expect(screen.getByText(/Live 0m 00s/i)).toBeInTheDocument();
  });
});
