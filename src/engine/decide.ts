export function decide(confidence: number, audit: any[]) {
  let requiresHumanReview = true;

  if (confidence >= 0.85) requiresHumanReview = false;

  audit.push({
    step: "decide",
    timestamp: new Date().toISOString(),
    details: requiresHumanReview
      ? "Escalated due to low confidence"
      : "Auto-corrected with high confidence"
  });

  return requiresHumanReview;
}
