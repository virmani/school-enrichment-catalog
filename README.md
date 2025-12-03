# UltraCamp Enrichment Class Scraper

Reusable Node.js/TypeScript scraper to extract UltraCamp enrichment class data and export to YAML and CSV formats.

## Features

- Scrapes class listings from UltraCamp
- Fetches detailed information for each class
- Filters by grade level (optional)
- Exports to YAML and CSV formats
- Rate limiting to respect server resources
- Retry logic for network failures
- Configurable via CLI parameters

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Usage

Scrape all 3rd grade classes:

```bash
npm start -- --camp-id 502 --camp-code cis --location-id 5710 --grade 3rd
```

### All Classes (No Filter)

```bash
npm start -- --camp-id 502 --camp-code cis --location-id 5710
```

### Custom Options

```bash
npm start -- \
  --camp-id 502 \
  --camp-code cis \
  --location-id 5710 \
  --grade K \
  --format yaml \
  --output-dir ./data \
  --rate-limit 1000 \
  --verbose
```

### Development Mode

```bash
npm run dev -- --camp-id 502 --camp-code cis --location-id 5710 --grade 3rd
```

## CLI Options

### Required

- `--camp-id <number>`: Camp ID (e.g., 502)
- `--camp-code <string>`: Camp code (e.g., cis)
- `--location-id <number>`: Location ID (e.g., 5710)

### Optional

- `--grade <string>`: Grade to filter (e.g., K, 1st, 3rd)
- `--format <string>`: Output format: yaml, csv, both (default: both)
- `--output-dir <string>`: Output directory (default: ./output)
- `--rate-limit <number>`: Delay between requests in ms (default: 500)
- `--timeout <number>`: Request timeout in ms (default: 10000)
- `--verbose`: Enable verbose logging

## Output Format

### YAML

File: `output/enrichment-{grade}.yaml`

```yaml
metadata:
  scrapedAt: "2025-12-01T10:00:00Z"
  campId: 502
  campCode: "cis"
  locationId: 5710
  gradeFilter: "3rd"
  totalClasses: 15

classes:
  - sessionId: "549710"
    name: "Drone Explorers"
    gradeRange: "Grades 3rd-8th"
    instructor: "Lee Le"
    dayOfWeek: "Wednesday"
    time: "3:30 PM - 4:30 PM"
    startDate: "January 14, 2026"
    endDate: "June 10, 2026"
    numberOfClasses: 20
    location: "CAIS K-8th, 3250 19th Avenue, San Francisco, CA 94132"
    cost: "$1,290.00"
    programOverview: "This after-school program introduces students to drone technology..."
    sessionDetailUrl: "https://www.ultracamp.com/info/sessionDetail.aspx?idCamp=502&idSession=549710&campCode=cis"
```

### CSV

File: `output/enrichment-{grade}.csv`

Columns:
- Session ID
- Class Name
- Grade Range
- Instructor
- Day of Week
- Time
- Start Date
- End Date
- Number of Classes
- Location
- Cost
- Program Overview
- Detail URL

## Grade Filtering

When filtering by grade, the scraper includes all classes where the grade range spans the target grade.

Examples for `--grade 3rd`:
- ✅ "Grades K-3rd"
- ✅ "Grades 3rd-8th"
- ✅ "Grades 2nd-4th"
- ✅ "Grade 3rd"
- ❌ "Grades K-2nd"
- ❌ "Grades 4th-5th"

## Project Structure

```
enrichment-catalog/
├── src/
│   ├── types/index.ts              # Type definitions
│   ├── scrapers/
│   │   ├── listing-scraper.ts      # Scrape listing page
│   │   └── detail-scraper.ts       # Scrape detail pages
│   ├── filters/grade-filter.ts     # Grade filtering logic
│   ├── exporters/
│   │   ├── yaml-exporter.ts        # YAML export
│   │   └── csv-exporter.ts         # CSV export
│   ├── utils/
│   │   ├── http-client.ts          # HTTP wrapper with rate limiting
│   │   └── parser.ts               # Parsing utilities
│   └── index.ts                     # Main CLI entry point
├── output/                          # Generated files
├── package.json
├── tsconfig.json
└── README.md
```

## Error Handling

- Network failures: Retries 3x with exponential backoff
- Parsing errors: Continues processing, logs warnings
- Rate limiting: Configurable delay between requests
- Final report: Summary of successes and failures

## License

ISC
