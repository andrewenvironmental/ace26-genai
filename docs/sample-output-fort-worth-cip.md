# Sample Output: Fort Worth CIP File Search

This sample came from the New Foundry model playground using the `documents` vector store and the Fort Worth FY2021-2025 Adopted CIP PDF.

Observed runtime:

```text
243 seconds
41,745 tokens
File search enabled
```

This confirms the file search path works, but it is too slow for a broad live-workshop prompt. Use shorter prompts that ask for a small number of bullets or table rows.

## Broad Prompt Tested

```text
can you tell me about capital improvement projects in fort worth related to drinking water?
```

## Condensed Sample Answer

The response identified these drinking-water-related or mixed water/sewer project categories:

- Major Mains Bucket: installation, repair, and replacement of large transmission mains.
- WTP Minor Improvements: upgrades at Eagle Mountain, North Holly, South Holly, Rolling Hills, and Westside water treatment plants.
- Miscellaneous Water Facilities: storage tanks, pump stations, and wholesale customer water meter stations.
- Water Sewer Program - Streets: replacement of aging water and sewer lines during street reconstruction.
- Miscellaneous Water and Sewer Line Contract: task-order work for line extension, relocation, replacement, rehabilitation, and emergency response.
- Trinity River Vision Program - Water and Sewer: line relocation and upsizing tied to the Central City flood-control project.
- WS CFA Funding: community facilities agreements for oversizing water/sewer infrastructure to serve growth.
- Water/Wastewater Impact Fee Study: planning work tied to growth assumptions and impact fee recommendations.

The answer cited the Fort Worth CIP PDF and surfaced multiple references.

## Workshop Prompt Recommendation

Use this shorter prompt first:

```text
Use the documents. In 5 bullets or fewer, name drinking-water-related capital improvement project categories in Fort Worth. Keep each bullet under 20 words.
```

Then ask for a small table:

```text
Use the documents. Create a small table with 4 rows. Columns: project category, description, cost, and source note. Focus on drinking water.
```

## Instructor Talking Point

Grounding improves specificity and citations, but it adds retrieval work. In production, teams usually optimize retrieval settings, prompt scope, model choice, and response length to balance accuracy, latency, and cost.
