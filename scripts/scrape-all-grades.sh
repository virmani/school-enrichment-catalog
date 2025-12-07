#!/bin/bash

# Scrape enrichment classes for all grades
PREK_GRADES=("P2" "P3" "P4")
ELEMENTARY_GRADES=("K" "1st" "2nd" "3rd" "4th" "5th" "6th" "7th" "8th")

echo "Starting scrape for all grades..."

# Scrape Pre-K grades (different location)
for grade in "${PREK_GRADES[@]}"; do
  echo ""
  echo "===================================="
  echo "Scraping grade: $grade (Pre-K location)"
  echo "===================================="
  npx ts-node src/index.ts \
    --camp-id 502 \
    --camp-code cis \
    --location-id "5710,1702" \
    --grade "$grade"
done

# Scrape elementary grades (main location)
for grade in "${ELEMENTARY_GRADES[@]}"; do
  echo ""
  echo "===================================="
  echo "Scraping grade: $grade"
  echo "===================================="
  npx ts-node src/index.ts \
    --camp-id 502 \
    --camp-code cis \
    --location-id 5710 \
    --grade "$grade"
done

echo ""
echo "===================================="
echo "All grades scraped!"
echo "===================================="
echo ""
echo "Copying YAML files to calendar assets..."

# Copy YAML files to calendar assets directory
for grade in "${GRADES[@]}"; do
  src_file="output/enrichment-$grade.yaml"
  dest_file="enrichment-calendar/src/assets/enrichment-$grade.yaml"

  if [ -f "$src_file" ]; then
    cp "$src_file" "$dest_file"
    echo "✓ Copied $src_file -> $dest_file"
  else
    echo "⚠ Warning: $src_file not found"
  fi
done

echo ""
echo "Done!"
