#!/usr/bin/env node

import { Command } from 'commander';
import { HttpClient } from './utils/http-client';
import { ListingScraper } from './scrapers/listing-scraper';
import { DetailScraper } from './scrapers/detail-scraper';
import { filterByGrade } from './filters/grade-filter';
import { YAMLExporter } from './exporters/yaml-exporter';
import { CSVExporter } from './exporters/csv-exporter';
import { ScraperConfig, EnrichedClass, ExportMetadata } from './types';

const program = new Command();

program
  .name('ultracamp-scraper')
  .description('Scrape UltraCamp enrichment class data')
  .version('1.0.0')
  .requiredOption('--camp-id <number>', 'Camp ID (e.g., 502)', parseInt)
  .requiredOption('--camp-code <string>', 'Camp code (e.g., cis)')
  .requiredOption('--location-id <number>', 'Location ID (e.g., 5710)', parseInt)
  .option('--grade <string>', 'Grade to filter (e.g., K, 1st, 3rd)')
  .option('--format <string>', 'Output format: yaml, csv, both', 'both')
  .option('--output-dir <string>', 'Output directory', './output')
  .option('--rate-limit <number>', 'Delay between requests in ms', parseInt, 500)
  .option('--timeout <number>', 'Request timeout in ms', parseInt, 10000)
  .option('--verbose', 'Enable verbose logging')
  .parse(process.argv);

const options = program.opts();

async function main() {
  console.log('🚀 Starting UltraCamp scraper...\n');

  const config: ScraperConfig = {
    idCamp: options.campId,
    campCode: options.campCode,
    idLocation: options.locationId,
    gradeFilter: options.grade,
    rateLimit: options.rateLimit,
    timeout: options.timeout,
  };

  const httpClient = new HttpClient(config.rateLimit, config.timeout);
  const listingScraper = new ListingScraper(httpClient);
  const detailScraper = new DetailScraper(httpClient);

  try {
    // Step 1: Scrape listing page
    console.log('📋 Fetching class listings...');
    const listings = await listingScraper.scrape(config);
    console.log(`Found ${listings.length} total classes\n`);

    // Step 2: Filter by grade if specified
    let filteredListings = filterByGrade(listings, config.gradeFilter);
    if (config.gradeFilter) {
      console.log(`Filtered to ${filteredListings.length} classes for grade ${config.gradeFilter}\n`);
    }

    // Step 3: Filter out Extended Care classes (not enrichment classes)
    const beforeExtendedCareFilter = filteredListings.length;
    filteredListings = filteredListings.filter(listing => !listing.name.endsWith('Extended Care'));
    const extendedCareCount = beforeExtendedCareFilter - filteredListings.length;
    if (extendedCareCount > 0) {
      console.log(`Filtered out ${extendedCareCount} Extended Care classes (not enrichment)\n`);
    }

    if (filteredListings.length === 0) {
      console.log('⚠️  No classes found matching criteria');
      return;
    }

    // Step 4: Scrape detail pages
    console.log('🔍 Fetching class details...');
    const enrichedClasses: EnrichedClass[] = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < filteredListings.length; i++) {
      const listing = filteredListings[i];
      const progress = `[${i + 1}/${filteredListings.length}]`;

      try {
        if (options.verbose) {
          console.log(`${progress} Fetching: ${listing.name}`);
        }

        const detail = await detailScraper.scrape(listing.sessionDetailUrl);

        if (detail) {
          enrichedClasses.push({
            ...listing,
            ...detail,
          });
          successCount++;
        } else {
          failCount++;
          console.warn(`${progress} ⚠️  Failed to parse: ${listing.name}`);
        }
      } catch (error) {
        failCount++;
        console.error(`${progress} ❌ Error fetching: ${listing.name}`, error);
      }

      // Progress indicator
      if (!options.verbose && (i + 1) % 5 === 0) {
        console.log(`${progress} Processed...`);
      }
    }

    console.log(`\n✅ Successfully scraped ${successCount} classes`);
    if (failCount > 0) {
      console.log(`⚠️  Failed to scrape ${failCount} classes\n`);
    }

    // Step 5: Export to YAML and/or CSV
    const metadata: ExportMetadata = {
      scrapedAt: new Date().toISOString(),
      campId: config.idCamp,
      campCode: config.campCode,
      locationId: config.idLocation,
      gradeFilter: config.gradeFilter,
      totalClasses: enrichedClasses.length,
    };

    console.log('\n📦 Exporting data...');

    if (options.format === 'yaml' || options.format === 'both') {
      const yamlExporter = new YAMLExporter();
      const yamlPath = await yamlExporter.export(enrichedClasses, metadata, options.outputDir);
      console.log(`✓ YAML exported to: ${yamlPath}`);
    }

    if (options.format === 'csv' || options.format === 'both') {
      const csvExporter = new CSVExporter();
      const csvPath = await csvExporter.export(enrichedClasses, metadata, options.outputDir);
      console.log(`✓ CSV exported to: ${csvPath}`);
    }

    console.log('\n🎉 Done!\n');
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
