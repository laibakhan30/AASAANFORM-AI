# Hackathon Requirements Analysis

## Event: Poona College CodeCraft 2026

This document analyzes the requirements and criteria for the Poona College CodeCraft 2026 hackathon as they relate to our PatraPilot AI project.

## Verified Requirements

As of the time of writing, we have not been able to access the official rulebook, challenge descriptions, or judging criteria for Poona College CodeCraft 2026. The following information is based on general communications and should be verified with official sources.

### Mentioned Challenge Categories
Based on user communications, the following challenge categories have been referenced:

1. **Best Use of Gemma 4** ✓
   - Our project centers around Gemma 4 for natural language understanding tasks
   - We use Gemma 4 (in mock form for demo) to:
     - Explain form fields in simple language
     - Extract information from supporting documents
     - Map document information to form fields
   - We have documented our intended AI integration approach in `docs/AI_MODEL.md`

2. **Best Open-Source AI Project** ✓
   - Our application source code will be released as open source
   - We distinguish between:
     - Our application code (open source)
     - The Gemma model (open weights, separate license)
     - Hosted API inference (service-specific terms)
   - We plan to release under Apache-2.0 license (see `LICENSE` file)

### Other Mentioned Elements
- **DigitalOcean**: Has been mentioned in event context but exact role not verified
  - We have not assumed any DigitalOcean requirements
  - We prioritized a functioning local application first
  - If DigitalOcean deployment becomes a requirement, we will address it

## Our Implementation Approach

### Gemma 4 Integration
We have genuinely integrated Gemma 4 concepts into our workflow:
- AI explains form fields in simple language (multilingual: English, Hindi, Marathi)
- AI extracts key information from supporting documents
- AI helps map document information to form fields
- We require human verification at every step (no fully automated decisions)

### Open-Source Commitment
- We distinguish clearly between our open-source code and the Gemma model's separate licensing
- We do not claim to run the model weights ourselves if using a hosted API
- We document the actual inference approach (mock vs. live)
- We provide clear attribution for Gemma 4

### Local-First Development
- We prioritized a working local application over assumed deployment requirements
- All core functionality works without external dependencies (using mock AI)
- The application can be fully demonstrated offline after initial setup

## Unverified Requirements

The following items mentioned in event context require verification:

1. **DigitalOcean Role**
   - Status: Unverified
   - Actions needed: Check official communications for any DigitalOcean-specific challenges, credits, or deployment requirements

2. **Specific Submission Guidelines**
   - Status: Unverified
   - Actions needed: Locate official submission instructions, deadlines, and format requirements

3. **Judging Criteria Weights**
   - Status: Unverified
   - Actions needed: Find official rubric or criteria breakdown

4. **Eligibility Requirements**
   - Status: Partially verified (team is eligible as student participants)
   - Actions needed: Confirm team composition rules, intellectual property policies, etc.

## How to Verify

To obtain the official requirements, please check:
1. The official Poona College CodeCraft 2026 website
2. Official emails or communications from the organizers
3. Any official rulebook or challenge description documents
4. Communications from sponsors (including DigitalOcean if applicable)

## Our Commitment to Accuracy

We will update this document as we receive official information. We commit to:
- Not inventing requirements or criteria
- Clearly separating verified information from assumptions
- Updating our implementation if official requirements necessitate changes
- Being transparent about any gaps between our project and official requirements

Last updated: October 2026